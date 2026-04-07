# Agentic Leave System - Copilot Instructions

## System Architecture

This is a **multi-agent leave request processing system** where each agent specializes in one task:

1. **NLP Agent** ([agents/nlp_agent.py](../agents/nlp_agent.py)): Classifies leave reasons into types (Sick Leave, Medical Emergency, Vacation, Casual, Personal)
2. **Policy Agent** ([agents/policy_agent.py](../agents/policy_agent.py)): Evaluates requests against company policy rules and yearly limits
3. **Decision Agent** ([agents/decision_agent.py](../agents/decision_agent.py)): Synthesizes final HR decision with explanation
4. **Email Agent** ([agents/email_agent.py](../agents/email_agent.py)): Notifies manager via Gmail SMTP
5. **Memory Store** ([memory/memory_store.py](../memory/memory_store.py)): Persists leave history to JSON and tracks yearly usage per employee

**Data Flow**: CLI user input → NLP classification → policy reasoning → final decision → email notification + JSON persistence

## LLM Integration Pattern

All agents use OpenRouter API (not direct OpenAI):
- **Endpoint**: `https://openrouter.ai/api/v1/chat/completions`
- **Model**: `openai/gpt-3.5-turbo`
- **Retry logic**: Built into `ask_llm()` (3 attempts with 2-second backoff)
- **API Key** stored as constant in [agents/nlp_agent.py](../agents/nlp_agent.py) (⚠️ security debt: should be env var)

All prompts are passed through `ask_llm()` - never call OpenRouter directly.

## Policy Engine

Company policy defined in [config/policy.txt](../config/policy.txt) is passed as raw text to Policy Agent. Key rules:
- **Hard limit**: 20 days/year per employee
- **Auto-approve**: Sick leave ≤3 days
- **Always approve**: Medical emergencies (if under limit)
- **Manager review**: Casual >3 days, Vacation >5 days
- **Escalation**: Frequent leave requests flagged

Policy changes update only the text file; agents reinterpret on next run (no code changes needed).

## Development Workflows

**Run system**: `python main.py` from project root
- Interactive CLI menu: Apply Leave → View History → Exit
- Leaves recorded in [leave_history.json](../leave_history.json) with full decision chain

**Testing LLM**: Run [agents/test_llm.py](../agents/test_llm.py) to verify API connectivity before system test

**Leave history**: Reset by deleting `leave_history.json` (auto-recreates on next request)

## Critical Conventions

- **Agent output format**: Each agent returns plain text (not JSON). Final decision follows pattern: `Decision:\nExplanation:` (see [agents/decision_agent.py](../agents/decision_agent.py))
- **Leave classification**: Always one of 5 types only (no custom types)
- **Yearly calculation**: Based on `datetime.now().year` and employee `name` field match in history
- **Remaining balance**: Calculated as `20 - (used_days + requested_days)` for approval, `20 - used_days` for rejection
- **Email credentials**: Hardcoded in [agents/email_agent.py](../agents/email_agent.py) - use app-specific password, not main account password

## Common Patterns & Gotchas

1. **Prompt injection risk**: Leave reason passed directly to NLP agent - sanitize if adding validation
2. **Stateless agents**: Each agent call is independent; context comes from passing history/policy explicitly
3. **LLM flakiness**: Replies may vary (e.g., "Auto Approve" vs "Approved"). Always use loose string matching
4. **Year boundary**: Yearly reset on Jan 1 - test with mock dates if adding calendar logic
5. **Email failures silently**: `send_notification()` has no error handling - catches `smtplib` exceptions but doesn't re-raise

## Extension Points

- Add new leave types: Update [config/policy.txt](../config/policy.txt) and update classification prompt in [agents/nlp_agent.py](../agents/nlp_agent.py)
- Add approval hierarchy: Create `escalation_agent.py` and insert before final decision
- Change LLM model: Update `model` parameter in `ask_llm()` (see OpenRouter docs for other model IDs)
- Persistent approval cache: Extend [memory/memory_store.py](../memory/memory_store.py) with SQLite instead of JSON
