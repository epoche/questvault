---
status: accepted
---

# Use Deterministic Writing Checks with Parent Writing Log Before LLM Grading

We will validate Writer's Forge submissions in the MVP using deterministic, encouraging Writing Checks (target word usage including basic inflections, capitalization, ending punctuation, minimum descriptive word count) and archive every sentence in a persistent Writing Log for parents and the Player to read together, rather than calling an LLM grading API on day one. This keeps the MVP 100% offline-capable with zero API key setup or billing, avoids harsh automated red-pen feedback that discourages a 4th grader from writing, and preserves an explicit `WritingEvaluator` interface so optional AI writing coaching can be plugged in later.

## Considered Options

- **Live LLM writing feedback (e.g., Gemini API)**: Can critique nuance and grammar, but requires API keys, network access, prompt guardrails for a child, and ongoing cost.
- **No free writing (multiple-choice upgrades only)**: Easier to score, but fails to build real sentence-writing fluency.

## Consequences

- `WritingEvaluator` returns structured check items and positive coaching tips, making future upgrade to an async AI evaluator a drop-in swap.
- Inflection matching (e.g., `observed`, `observing` matching target word `observe`) must be handled cleanly in the deterministic checker and covered by unit tests.
