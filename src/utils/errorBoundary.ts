import { sendDiagnosticData } from "../networking/diagnostic";

export const errorBoundary = <T extends (...args: any[]) => any>(fn: T) =>
  function (this: ThisType<T>, ...args: Parameters<T>) {
    try {
      return fn.apply(this, args);
    } catch (error) {
      if (!__DEV__) {
        console.error(error);
        return;
      }
      const e = error as Error;
      sendDiagnosticData({
        type: "error",
        data: JSON.stringify({
          name: e.name,
          stack: e.stack,
          message: e.message,
        }),
      });
      throw error;
    }
  };
