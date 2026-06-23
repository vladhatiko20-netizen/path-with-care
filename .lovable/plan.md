# Plan - Remove Voice Diagnostic Logs

We will clean up `src/lib/voice.functions.ts` by removing all diagnostic `[voice:diag]` log statements that were temporarily added to diagnose Romanian transcription quality. We will leave all other behavior, prompts, conditional model selections (full model for Romanian, mini for Russian), and validation perfectly intact.

## Steps

### 1. Edit `src/lib/voice.functions.ts`
- Remove the `console.log("[voice:diag] callProviderTranscribe pre-fetch", ...)` block.
- Remove the unused `languageFieldAppended` and `promptFieldAppended` tracking variables.
- Remove the `console.log("[voice:diag] callProviderTranscribe post-fetch", ...)` block.
- Remove the `console.log("[voice:diag] transcribeAudio received lang form entry", ...)` block.
- Remove the `console.log("[voice:diag] transcribeAudio resolved requestedLang", ...)` block.
