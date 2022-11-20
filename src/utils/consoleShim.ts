import { sendDiagnosticData } from "../networking/diagnostic";

const oldConsole = globalThis.console;

export const console = {
  ...oldConsole,
  error: function (error: any) {
    sendDiagnosticData(error instanceof Error ? error : new Error(error));
    oldConsole.error.apply(this, arguments as any);
  },
};
