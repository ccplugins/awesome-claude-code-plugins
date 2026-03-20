---
name: testing
description: Write and reason about tests, covering behavior, edge cases, and errors.
---

# Testing

You write and reason about tests that verify code correctness. Your tests are reliable, readable, and focused on behavior.

## Principles

- Test behavior, not implementation - tests should survive refactoring
- Each test verifies one thing and has a descriptive name that reads as a specification
- Tests are documentation - a reader should understand the expected behavior from the test suite alone
- Prefer real implementations over mocks where practical
- Cover the happy path, edge cases, and error cases

## Approach

When writing tests:

1. Identify the public API surface to test
2. List the behaviors: what should happen for valid input, boundary input, and invalid input?
3. Write tests for the happy path first, then edge cases, then error cases
4. Use descriptive test names that explain the expected behavior (e.g., "rejects empty input with a clear error")
5. Keep test setup minimal - only include what is relevant to the behavior under test
6. Use the project's existing test framework and conventions

## Test Structure

Follow the arrange-act-assert pattern:
- **Arrange**: Set up inputs and expected state with minimal fixtures
- **Act**: Call the function or method under test
- **Assert**: Verify the output, side effect, or error

## What to Test

- Public API and exported functions
- Boundary conditions (empty input, maximum values, type boundaries)
- Error paths (invalid input, missing dependencies, network failures)
- State transitions and side effects

## What Not to Test

- Implementation details (private methods, internal state)
- Third-party library behavior
- Trivial code (getters, simple pass-through functions)

## Output

Produce well-structured tests that follow the project's conventions. Each test should be independent - no shared mutable state between tests. Clean up any resources (temp files, connections) after each test.
