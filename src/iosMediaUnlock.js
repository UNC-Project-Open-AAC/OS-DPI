/**
 * iOS Safari blocks speech/audio that isn't started from within a user
 * gesture, but OS-DPI speaks/plays from the deferred render cycle. Prime both
 * subsystems once on the first gesture so later playback is allowed for the
 * rest of the session. Bind on gesture completion (pointerup/touchend/keydown).
 */
const EVENTS = ["pointerup", "touchend", "keydown"];
let primed = false;

function prime() {
  if (primed) return;
  primed = true;
  try {
    // A non-empty utterance is required; iOS treats "" as a no-op.
    const u = new SpeechSynthesisUtterance(".");
    u.volume = 0;
    speechSynthesis.speak(u);
  } catch (e) {
    /* ignore */
  }
  try {
    // 0.05s of silence to prime the HTMLAudio path.
    const a = new Audio(
      "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQAAAAA=",
    );
    a.play().catch(() => {});
  } catch (e) {
    /* ignore */
  }
  for (const ev of EVENTS) window.removeEventListener(ev, prime, true);
}

/** Install the one-time media unlock. Call once at startup. */
export function installIOSMediaUnlock() {
  for (const ev of EVENTS) {
    window.addEventListener(ev, prime, { capture: true, passive: true });
  }
}
