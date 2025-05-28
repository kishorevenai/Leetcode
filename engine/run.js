// engine/run.js
import fs from "fs";

const code = fs.readFileSync("/app/user_code.js", "utf8");

try {
  const result = eval(code);
  if (result !== undefined) {
    console.log(result);
  }
} catch (err) {
  console.error("Runtime error:", err.message);
}
