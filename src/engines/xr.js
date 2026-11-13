// Multi-tier WebXR capability detection & optional VR headset session launcher.
// Never required by core labs: Cardboard stereo VR works universally on every browser; true WebXR illuminates when supported.
export async function xrSupport(nav = globalThis.navigator) {
  const out = { vr: false, ar: false, secure: globalThis.isSecureContext !== false };
  if (!nav?.xr?.isSessionSupported) return out;
  const ask = async (mode) => { try { return !!(await nav.xr.isSessionSupported(mode)); } catch { return false; } };
  [out.vr, out.ar] = await Promise.all([ask('immersive-vr'), ask('immersive-ar')]);
  return out;
}

export async function startWebXRSession(renderer, onEnd, nav = globalThis.navigator) {
  if (!nav?.xr?.requestSession || !renderer?.xr) return null;
  try {
    const session = await nav.xr.requestSession('immersive-vr', { optionalFeatures: ['local-floor', 'bounded-floor'] });
    renderer.xr.enabled = true;
    await renderer.xr.setSession(session);
    session.addEventListener('end', () => {
      renderer.xr.enabled = false;
      onEnd?.();
    }, { once: true });
    return session;
  } catch {
    return null;
  }
}
