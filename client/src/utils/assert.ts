export function assertNonNullable(value: unknown): asserts value {
  if (value === undefined || value === null) {
    throw new Error(`RuntimeError: Assertion failed. Variable should not be ${value}.`);
  }
}

export function assertTrue(value: unknown): asserts value {
  if (!value) {
    throw new Error('RuntimeError: Assertion failed. Variable should not be false.');
  }
}
