// Placeholder images replacing figma:asset/ references.
// These are small colored avatar circles used at 24-40px sizes.

function avatarSvg(initials: string, bg: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80">
    <rect width="80" height="80" rx="12" fill="${bg}"/>
    <text x="40" y="44" text-anchor="middle" dominant-baseline="middle" font-family="Inter,sans-serif" font-size="28" font-weight="600" fill="white">${initials}</text>
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

// Dashboard avatars — ready-for-review assignees
export const imgReady1 = avatarSvg("JD", "#6366f1");
export const imgReady2 = avatarSvg("KM", "#8b5cf6");
export const imgReady3 = avatarSvg("AL", "#a855f7");

// Dashboard / MyPriorities — critical status indicator
export const imgCritical = avatarSvg("!", "#ef4444");

// MyPriorities & TaskDrilldown — ready status indicator
export const imgReady = avatarSvg("OK", "#22c55e");
