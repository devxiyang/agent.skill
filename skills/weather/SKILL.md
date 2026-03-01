---
name: weather
description: Get current weather and forecasts for any location. No API key required.
requires: bin:curl
---

# Weather Skill

## Preflight

Verify curl is available before proceeding:

```bash
curl --version
```

If missing, load `references/install.md` for installation instructions.

Two free services, no API keys needed.

## wttr.in (primary)

```bash
# One-liner
curl -s "wttr.in/London?format=3"
# London: ⛅️ +8°C

# Compact format
curl -s "wttr.in/London?format=%l:+%c+%t+%h+%w"

# Full 3-day forecast
curl -s "wttr.in/London?T"
```

Format codes: `%c` condition · `%t` temp · `%h` humidity · `%w` wind · `%l` location

Tips:
- URL-encode spaces: `wttr.in/New+York`
- Airport codes work: `wttr.in/JFK`
- Units: `?m` metric · `?u` imperial
- Today only: `?1` · Current only: `?0`

## Open-Meteo (fallback, JSON, no key)

```bash
curl -s "https://api.open-meteo.com/v1/forecast?latitude=51.5&longitude=-0.12&current_weather=true"
```

Get coordinates first, then query. Returns JSON with temperature, windspeed, and weather code.
