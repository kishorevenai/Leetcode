"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const uuid_1 = require("uuid");
const util_1 = require("util");
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const execAsync = (0, util_1.promisify)(child_process_1.exec);
function wrapCodeWithTests(userCode, functionName) {
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
        console.log(JSON.stringify({ test: ${index + 1}, passed: false, error: err.message }));
      }
    })();
  `;
    });
    return `
${userCode}

${testRunner.join("\n")}
  `;
}
function runCodeInDocker(_a) {
    return __awaiter(this, arguments, void 0, function* ({ code, language, }) {
        const id = (0, uuid_1.v4)();
        const tmpDir = path_1.default.join(__dirname, "tmp");
        if (!fs_1.default.existsSync(tmpDir)) {
            fs_1.default.mkdirSync(tmpDir, { recursive: true });
        }
        const filename = path_1.default.join(tmpDir, `temp_${id}.js`);
        const containerPath = "/app/user_code.js";
        try {
            const wrappedCode = wrapCodeWithTests(code, "twoSum");
            fs_1.default.writeFileSync(filename, wrappedCode);
            const result = yield execAsync(`docker run -v ${path_1.default.resolve(filename)}:${containerPath} js-runner`);
            // 3. Return either stdout or stderr
            const outputLines = result.stdout.trim().split("\n");
            const testResults = outputLines.map((line) => {
                try {
                    return JSON.parse(line);
                }
                catch (_a) {
                    return { raw: line };
                }
            });
            console.log("Docker run result:", testResults);
            return JSON.stringify(testResults, null, 2);
        }
        catch (error) {
            console.error("Error running code in Docker:", error);
            throw new Error("Failed to run code in Docker");
        }
        finally {
            console.log("TEST COMPLETED");
            // fs.unlinkSync(filename); // or use fs.promises.unlink(filename)
        }
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const client = (0, redis_1.createClient)({
            url: "redis://localhost:6379",
        });
        yield client.connect().catch((err) => {
            console.error("Redis connection error:", err);
        });
        setInterval(() => __awaiter(this, void 0, void 0, function* () {
            client
                .rPop("messages")
                .then((message) => __awaiter(this, void 0, void 0, function* () {
                if (message) {
                    const parsedMessage = JSON.parse(message);
                    const { code, language } = parsedMessage.message;
                    try {
                        const output = yield runCodeInDocker({ code, language });
                        yield client.publish(parsedMessage.clientId, JSON.stringify({ status: "success", output }));
                    }
                    catch (error) {
                        console.error("Error processing message:", error);
                        yield client.publish(parsedMessage.clientId, JSON.stringify({
                            status: "error",
                            message: error instanceof Error ? error.message : String(error),
                        }));
                    }
                }
                else {
                    console.log("No messages in the queue");
                }
            }))
                .catch((err) => {
                console.error("Error reading from Redis:", err);
            });
        }), 5000);
    });
}
main();
