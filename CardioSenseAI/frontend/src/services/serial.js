/**
 * Placeholder serial service. No real serial/WebSocket connection is
 * implemented here — these functions exist so UI code can be wired up
 * ahead of the backend integration.
 */

let connectionStatus = "offline";

export async function connectSerial() {
  connectionStatus = "connecting";
  await new Promise((resolve) => setTimeout(resolve, 600));
  connectionStatus = "connected";
  return connectionStatus;
}

export function disconnectSerial() {
  connectionStatus = "offline";
  return connectionStatus;
}

export function getConnectionStatus() {
  return connectionStatus;
}