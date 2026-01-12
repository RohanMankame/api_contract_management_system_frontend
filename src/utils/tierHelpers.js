// src/utils/tierHelpers.js
export function validateRows(rows) {
  const parsed = rows.map(r => ({ min: Number(r.min_calls), max: r.infinite ? -1 : Number(r.max_calls) }));
  for (let i = 0; i < parsed.length; i++) {
    if (!Number.isFinite(parsed[i].min)) return `Row ${i+1}: Min required`;
    if (!Number.isFinite(parsed[i].max) && parsed[i].max !== -1) return `Row ${i+1}: Max required or Infinity`;
    if (parsed[i].max !== -1 && parsed[i].min > parsed[i].max) return `Row ${i+1}: min must not exceed max`;
  }
  const intervals = parsed.map((p, idx) => ({ idx, min: p.min, max: p.max === -1 ? Infinity : p.max })).sort((a,b) => a.min - b.min);
  for (let i = 1; i < intervals.length; i++) if (intervals[i].min <= intervals[i-1].max) return `Rows ${intervals[i-1].idx+1} & ${intervals[i].idx+1} overlap`;
  return null;
}

export function buildBatchPayload(rows, rateCardId) {
  return rows.map(r => ({
    rate_card_id: rateCardId,
    min_calls: Number(r.min_calls),
    max_calls: r.infinite ? -1 : Number(r.max_calls),
    unit_price: Number(r.unit_price || 0),
  }));
}