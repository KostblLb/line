export const sendDiagnosticData = (data: { type: string; data: string }) => {
  if (!__DEV__) {
    return;
  }

  navigator.sendBeacon(
    window.origin + "/diagnostic/logError",
    JSON.stringify(data)
  );
};
