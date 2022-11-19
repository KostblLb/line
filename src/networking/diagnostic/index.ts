export const sendDiagnosticData = (err: Error) => {
  if (!__DEV__) {
    return;
  }

  const blob = new Blob(
    [
      JSON.stringify({
        name: err.name,
        message: err.message,
        stack: err.stack,
      }),
    ],
    { type: "application/json" }
  );

  navigator.sendBeacon(window.origin + "/jsdiag/logError", blob);
};
