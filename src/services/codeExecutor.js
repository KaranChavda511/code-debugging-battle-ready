// src/services/codeExecutor.js
import { NodeVM } from "vm2";
import logger from "../utils/logger.js";

export const executeCode = async (userCode, expectedOutput) => {
  try {
    const vm = new NodeVM({
      timeout: 2000, // Timeout for security
      sandbox: {}, // Empty sandbox, no access to filesystem or network
    });

    // Wrap user code in a function to execute safely
    const wrappedCode = `
      module.exports = function() {
        ${userCode}
      };
    `;

    const script = vm.run(wrappedCode);
    const userOutput = script();

    // Compare user output with expected output
    if (userOutput.toString().trim() === expectedOutput.trim()) {
      return { success: true, message: "Code is correct! ✅" };
    } else {
      return { success: false, message: "Incorrect output! ❌", userOutput };
    }
  } catch (error) {
    logger.error(`Code Execution Error: ${error.message}`);
    return { success: false, message: "Execution Error!", error: error.message };
  }
};
