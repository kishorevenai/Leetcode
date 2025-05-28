import { createClient } from "redis";
import { v4 as uuidv4 } from "uuid";
import { promisify } from "util";
import { exec } from "child_process";
import path, { dirname, parse } from "path";
import fs from "fs";

export interface MessageToEngine {
  clientId: string;
  message: {
    code: string;
    language: string;
  };
}

const execAsync = promisify(exec);

function wrapCodeWithTests(userCode: string, functionName: string) {
  const tests = [
    { input: [[2, 7, 11, 15], 9], expected: [0, 1] },
    { input: [[3, 2, 4], 6], expected: [1, 2] },
    { input: [[3, 3], 6], expected: [0, 1] },
  ];

  const testRunner = tests.map((t, index) => {
    return `
    (() => {
      try {
        const result = ${functionName}(${JSON.stringify(t.input).slice(1, -1)});
        const expected = ${JSON.stringify(t.expected)};
        const passed = JSON.stringify(result) === JSON.stringify(expected);
        console.log(JSON.stringify({ test: ${index + 1}, passed }));
      } catch (err) {
        console.log(JSON.stringify({ test: ${
          index + 1
        }, passed: false, error: err.message }));
      }
    })();
  `;
  });

  return `
${userCode}

${testRunner.join("\n")}
  `;
}

async function runCodeInDocker({
  code,
  language,
}: {
  code: string;
  language: string;
}) {
  const id = uuidv4();
  const tmpDir = path.join(__dirname, "tmp");

  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
  }
  const filename = path.join(tmpDir, `temp_${id}.js`);

  const containerPath = "/app/user_code.js";

  try {
    const wrappedCode = wrapCodeWithTests(code, "twoSum");

    fs.writeFileSync(filename, wrappedCode);

    const result = await execAsync(
      `docker run -v ${path.resolve(filename)}:${containerPath} js-runner`
    );

    // 3. Return either stdout or stderr

    const outputLines = result.stdout.trim().split("\n");
    const testResults = outputLines.map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return { raw: line };
      }
    });

    console.log("Docker run result:", testResults);

    return JSON.stringify(testResults, null, 2);
  } catch (error) {
    console.error("Error running code in Docker:", error);
    throw new Error("Failed to run code in Docker");
  } finally {
    console.log("TEST COMPLETED");
    // fs.unlinkSync(filename); // or use fs.promises.unlink(filename)
  }
}

async function main() {
  const client = createClient({
    url: "redis://localhost:6379",
  });

  await client.connect().catch((err) => {
    console.error("Redis connection error:", err);
  });

  setInterval(async () => {
    client
      .rPop("messages")
      .then(async (message) => {
        if (message) {
          const parsedMessage: MessageToEngine = JSON.parse(message);

          const { code, language } = parsedMessage.message;
          try {
            const output = await runCodeInDocker({ code, language });

            await client.publish(
              parsedMessage.clientId,
              JSON.stringify({ status: "success", output })
            );
          } catch (error) {
            console.error("Error processing message:", error);
            await client.publish(
              parsedMessage.clientId,
              JSON.stringify({
                status: "error",
                message: error instanceof Error ? error.message : String(error),
              })
            );
          }
        } else {
          console.log("No messages in the queue");
        }
      })
      .catch((err) => {
        console.error("Error reading from Redis:", err);
      });
  }, 5000);
}

main();
