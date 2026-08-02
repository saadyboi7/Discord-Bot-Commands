// ============================================================
//  Shared warnings store
//  Both -warn and -unwarn import from here so they use the same data
//  Note: warnings reset when the bot restarts (no database)
// ============================================================

// { userId: [{ reason, moderator, date }] }
const warnings = new Map();

module.exports = { warnings };
