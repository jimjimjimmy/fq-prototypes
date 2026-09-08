/**
 * Shared formatting helpers for Data Studio features.
 *
 * Small, dependency-free seams so every table/detail screen formats values
 * the same way — and so the formatting can later be swapped for real
 * locale-aware / date-aware logic in one place.
 */

/**
 * Record count for the Catalog "Records" column (and anywhere a row count is
 * shown). Returns an em dash when there's no count yet — e.g. a model that
 * has never completed a pipeline run (PRD AC-ML-4-04: blank/dash before first
 * run). Pass `null`/`undefined` for "no run".
 */
export function formatRecords(records: number | null | undefined): string {
  if (records == null) return '—';
  return records.toLocaleString();
}

/**
 * "Last Updated" timestamp, rendered as M/D/YYYY to match the canonical design
 * (e.g. "3/22/2026"). Mock data stores ISO dates (YYYY-MM-DD); parse the parts
 * directly to avoid Date() timezone off-by-one. Non-ISO input is returned as-is.
 */
export function formatLastUpdated(value: string | null | undefined): string {
  if (!value) return '—';
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (m) return `${Number(m[2])}/${Number(m[3])}/${m[1]}`;
  return value.trim();
}

/**
 * Model version, rendered as "Version N" to match the canonical Catalog design
 * ("Data Studio — For Dev", frame 5:30130). Data stores the active version as an
 * integer; this is the single display seam (Catalog cell + Overview "Active
 * Version"). Returns an em dash for a missing version.
 */
export function formatVersion(version: number | null | undefined): string {
  if (version == null) return '—';
  return `Version ${version}`;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/**
 * Long date — "March 1, 2026" — used in the Model View Overview metadata grid.
 * Parses ISO (YYYY-MM-DD) parts directly to avoid Date() timezone drift.
 */
export function formatLongDate(value: string | null | undefined): string {
  if (!value) return '—';
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (m) return `${MONTHS[Number(m[2]) - 1]} ${Number(m[3])}, ${m[1]}`;
  return value.trim();
}
