/* Opening tabs in a way Safari allows.
 *
 * Safari only runs window.open synchronously inside the gesture that triggered
 * it. Open a tab after an await and it is blocked, silently. Passing noopener
 * also makes window.open return null even when it worked, so there is no way
 * to tell success from failure.
 *
 * These helpers are for our own pages, where falling back to the current tab
 * is harmless. Keep noopener on anything that opens a site we don't control.
 */

/** Claim a tab during the click, before anything is awaited.
 * @returns {Window | null} */
export function claimTab() {
  return window.open("", "_blank");
}

/** Send a claimed tab to a url, or use this one if the popup was blocked.
 * @param {Window | null} tab
 * @param {string} url */
export function showInTab(tab, url) {
  if (tab && !tab.closed) tab.location.replace(url);
  else window.location.assign(url);
}

/** Open a url now, for when there is nothing left to await.
 * @param {string} url */
export function openTab(url) {
  if (!window.open(url, "_blank")) window.location.assign(url);
}
