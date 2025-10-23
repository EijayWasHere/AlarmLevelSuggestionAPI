## AI Alarm Analyzer Service

Express-based backend that classifies responder messages into fire alarm levels using OpenAI `gpt-5-mini`.

### Features
- **Single POST endpoint**: `/analyze-message`
- **Input JSON**: `{ "message": "text of the responder message" }`
- **Returns JSON**: `{ "alarm_level": "...", "reason": "..." }`
- **Auth**: Uses `OPENAI_API_KEY` from environment (never hardcoded)
- **Deployable**: Ready for Vercel (serverless) or Railway

### Fire Alarm Mapping (used in system prompt)
- **First Alarm**: 2–3 houses
- **Second Alarm**: 4–5 houses
- **Third Alarm**: 6–7 houses OR high-rise affected
- **Fourth Alarm**: 8–9 houses OR high-rise affected
- **Fifth Alarm**: 10–11 houses OR high-rise affected
- **Task Force Alpha**: ~12 houses
- **Task Force Bravo**: ~15 houses
- **Task Force Charlie**: fire affecting significant part of area
- **Task Force Delta Echo Hotel India**: fire affecting significant part of area
- **General Alarm**: fire affecting major part of area

### Requirements
- Node.js 18+

### Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create an environment file:
   - Copy `env.example` to `.env` and fill in values, or set variables in your shell.
   ```bash
   OPENAI_API_KEY=your_openai_key
   PORT=3000
   ```

### Run locally
```bash
npm start
# or with live reload
npm run dev
```

Test the endpoint:
```bash
curl -X POST http://localhost:3000/analyze-message \
  -H "Content-Type: application/json" \
  -d '{"message":"Reports of 5 houses affected on Oak Street"}'
```

Example response:
```json
{
  "alarm_level": "Second Alarm",
  "reason": "Responder reported 5 houses affected"
}
```

### Deploy
#### Vercel
- `vercel.json` routes `/analyze-message` to `api/analyze-message.js`.
- Set `OPENAI_API_KEY` in Vercel project settings.
- Deploy via Vercel CLI or Git integration.

#### Railway
- The Express server (`src/server.js`) runs with `npm start`.
- Set `OPENAI_API_KEY` in Railway variables.

### Notes
- Secrets are never hardcoded; use environment variables.
- Errors return JSON with an `error` field and may include `details`.

