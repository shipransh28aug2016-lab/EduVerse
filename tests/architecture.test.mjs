import test from 'node:test';
import assert from 'node:assert/strict';
import { runArchitectureChecks } from '../tools/verify-architecture.mjs';

test('architecture guardrails: zero cycles, pure domain engines, lean boot & per-theme isolation', () => {
  const res = runArchitectureChecks();
  assert.deepEqual(res.errors, [], `Architecture violations:\n${res.errors.join('\n')}`);
  assert.equal(res.stats.themesVerified, 16);
  assert.ok(res.stats.bootStaticKB < 110, `Expected lean static boot < 110 KB raw, got ${res.stats.bootStaticKB} KB`);
});
