import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const css = await readFile(new URL('../styles.css', import.meta.url), 'utf8');

function rule(selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = css.match(new RegExp(`${escaped}\\s*\\{([^}]+)\\}`));
  assert.ok(match, `${selector} rule should exist`);
  return match[1];
}

test('hero overlay preserves the illustration without a dark gradient', () => {
  const overlay = rule('.hero-overlay');

  assert.match(overlay, /background:\s*transparent\s*;/);
  assert.doesNotMatch(overlay, /linear-gradient|rgba\(0,\s*0,\s*0/);
});

test('hero content is positioned in the upper illustration space', () => {
  const overlay = rule('.hero-overlay');

  assert.match(overlay, /justify-content:\s*flex-start\s*;/);
  assert.match(overlay, /padding:\s*clamp\(135px,\s*17svh,\s*170px\)\s+28px\s+0\s*;/);
});

test('hero text uses an illustration-matching brick red', () => {
  const overlay = rule('.hero-overlay');

  assert.match(overlay, /color:\s*#8f2f27\s*;/i);
});
