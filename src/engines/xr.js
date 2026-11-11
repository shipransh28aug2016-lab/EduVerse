// Optional immersive-mode capability detection. The core app never requires WebXR; a lab may offer an "Enter VR/AR" control
// only when this reports support. Detection only: no session is started here (WebXR needs a headset/device to verify).
export async function xrSupport(nav = globalThis.navigator) {
  const out = { vr: false, ar: false, secure: globalThis.isSecureContext !== false };
  if (!nav?.xr?.isSessionSupported) return out;
  const ask = async (mode) => { try { return !!(await nav.xr.isSessionSupported(mode)); } catch { return false; } };
  [out.vr, out.ar] = await Promise.all([ask('immersive-vr'), ask('immersive-ar')]);
  return out;
}
