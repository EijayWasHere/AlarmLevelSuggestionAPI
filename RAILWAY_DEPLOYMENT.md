# Railway Deployment Guide

## Issues Fixed

### 1. **Platform Configuration Mismatch**
- ❌ **Problem**: Project was configured for Vercel but deployed on Railway
- ✅ **Solution**: Removed Vercel-specific files and created Railway configuration

### 2. **Incorrect OpenAI Model**
- ❌ **Problem**: Using non-existent model `"gpt-5-mini"`
- ✅ **Solution**: Changed to `"gpt-4o-mini"` (valid OpenAI model)

### 3. **Missing Railway Configuration**
- ❌ **Problem**: No Railway-specific deployment configuration
- ✅ **Solution**: Created `railway.json` with proper settings

## API Endpoints

Your API is now properly configured with these endpoints:

- **Main Endpoint**: `https://chatanalysisapi-production.up.railway.app/analyze-message`
- **Health Check**: `https://chatanalysisapi-production.up.railway.app/`
- **Test UI**: `https://chatanalysisapi-production.up.railway.app/ui`

## Request Format

Send POST requests to `/analyze-message` with this JSON structure:

```json
{
  "message": "Your fire incident description here"
}
```

## Response Format

The API will return JSON with this structure:

```json
{
  "alarm_level": "First Alarm",
  "reason": "Based on the description provided"
}
```

## Environment Variables

Make sure to set these in your Railway dashboard:

1. `OPENAI_API_KEY` - Your OpenAI API key
2. `PORT` - Railway will set this automatically

## Testing

You can test the API using:

1. **Web UI**: Visit `https://chatanalysisapi-production.up.railway.app/ui`
2. **cURL**: 
   ```bash
   curl -X POST https://chatanalysisapi-production.up.railway.app/analyze-message \
     -H "Content-Type: application/json" \
     -d '{"message": "5 houses affected on Oak Street"}'
   ```

## Deployment Steps

1. Push these changes to your repository
2. Railway will automatically redeploy
3. Verify the API is working at the test UI
4. Update your main project to use the correct endpoint

## Troubleshooting

If the API still doesn't work:

1. Check Railway logs for errors
2. Verify `OPENAI_API_KEY` is set correctly
3. Test the health check endpoint first
4. Check that the port is being set correctly by Railway
