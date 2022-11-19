import { sendDiagnosticData } from "../networking/diagnostic";

const oldConsole = globalThis.console;

export const console = {
  ...oldConsole,
  error: function () {
    sendDiagnosticData({
      type: "error",
      data: JSON.stringify(arguments),
    });
    oldConsole.error.apply(this, arguments as any);
  },
};
