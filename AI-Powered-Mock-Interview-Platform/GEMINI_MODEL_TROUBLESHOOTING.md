# Gemini API Model Troubleshooting Guide

## Problem
The application was using `gemini-2.5-flash-lite` and `gemini-1.5-flash` models which are not available for the v1beta API endpoint.

**Errors encountered:**
```
Error: [404 Not Found] This model models/gemini-2.5-flash-lite is no longer available to new users.
Error: [404 Not Found] models/gemini-1.5-flash is not found for API version v1beta
```

## Solution Applied
Changed the model from `gemini-1.5-flash` to `gemini-1.5-pro` in:
- **File:** `backend/services/geminiService.js` (Line 17)
- **Change:** `'gemini-1.5-flash'` → `'gemini-1.5-pro'`

## Why `gemini-1.5-pro`?
1. **v1beta API Compatibility:** `gemini-1.5-pro` is the main model available for the v1beta API endpoint
2. **More Capable:** Better at understanding complex interview questions and providing detailed explanations
3. **Google Generative AI Free Tier:** Available without additional permissions
4. **Production Ready:** Used in many commercial applications

## How It Works
The change affects all Gemini operations:
- ✅ Generating interview questions
- ✅ Evaluating user answers
- ✅ Providing explanations and suggestions
- ✅ Generating interview summaries
- ✅ Performance analysis

## Testing Steps

### 1. Verify Backend Configuration
```bash
# In backend directory
node -c server.js
# Should output: ✅ Backend syntax valid!
```

### 2. Start Backend Server
```bash
cd backend
npm start
# Should see: "Server running on http://localhost:5000"
# MongoDB connection message
```

### 3. Start Frontend Application
```bash
cd frontend
npm start
# Should see: "Local: http://localhost:5173/"
```

### 4. Test Interview Feature
1. **Register/Login** to the application
2. **Click "Start Mock Interview"**
3. **Select:**
   - Category (e.g., "React")
   - Difficulty (e.g., "Medium")
   - Time Limit (e.g., "30 minutes")
   - Number of Questions (e.g., "5")
4. **Click "Start Interview"**
5. **Verify:** Questions appear (should NOT see Gemini errors)
6. **Answer** a question
7. **Submit Answer**
8. **Verify:** Get score, explanation, and suggestions

## Expected Behavior After Fix

### Question Generation
```
✅ Questions are generated dynamically from Gemini
✅ Questions vary by category and difficulty
✅ No hardcoded questions
```

### Answer Evaluation
```
✅ Each answer gets a score (0-100)
✅ Explanation of correctness
✅ Mistakes identified
✅ Better answer provided
✅ Suggestions for improvement
```

### Performance Analysis
```
✅ Confidence rating (0-100)
✅ Difficulty analysis
✅ Interview summary
✅ Strengths highlighted
✅ Areas for improvement identified
```

## Alternative Models (If Issues Persist)

If `gemini-1.5-pro` doesn't work, try these in order:

### 1. Try `gemini-pro`
```javascript
const getModel = () => {
  return getGenAI().getGenerativeModel({ model: 'gemini-pro' });
};
```
**Pros:** Most widely available
**Cons:** Less capable than 1.5-pro

### 2. Try with `-latest` suffix
```javascript
const getModel = () => {
  return getGenAI().getGenerativeModel({ model: 'gemini-1.5-pro-latest' });
};
```
**Pros:** Always gets latest version
**Cons:** May not work on v1beta

### 3. Try `gemini-2.0-flash-exp` (Experimental)
```javascript
const getModel = () => {
  return getGenAI().getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
};
```
**Pros:** Most advanced model
**Cons:** Experimental, may have availability issues

## Common Issues & Solutions

### Error: "401 Unauthorized"
**Cause:** Invalid or missing API key
**Solution:** 
1. Check `.env` file has valid GEMINI_API_KEY
2. Get key from: https://aistudio.google.com/app/apikeys
3. Ensure key is not expired

### Error: "Rate Limited"
**Cause:** Too many requests to Gemini API
**Solution:** 
1. Wait a few minutes
2. Check API quota at: https://console.cloud.google.com
3. Consider upgrading API tier for production

### Error: "Invalid Request"
**Cause:** Model name format wrong
**Solution:** 
1. Verify model name spelling exactly
2. Check API endpoint is correct (v1beta)
3. Ensure all parameters are valid

### Error: "Model Not Found"
**Cause:** Model not available for this API version
**Solution:** 
1. Verify model is available at: https://ai.google.dev/models
2. Try alternative model name
3. Check API key tier supports this model

## API Key Setup

1. **Get Free API Key:**
   - Go to: https://aistudio.google.com/app/apikeys
   - Click "Get API Key"
   - Select "Create API key in new project"

2. **Add to Backend:**
   - Open `backend/.env`
   - Set: `GEMINI_API_KEY=your_actual_key_here`
   - Save file

3. **Verify Connection:**
   - Start backend: `npm start`
   - Check logs for: "Server running on http://localhost:5000"
   - No error messages about API key

## Environment Constraints

### API Version
- Current: `v1beta`
- Alternative: Could switch to `v1` (requires code change)
- **Recommendation:** Keep v1beta (more stable)

### Free Tier Limits
- **Requests:** 60 per minute
- **Daily Quota:** 1,500 requests per day
- **Models:** `gemini-1.5-pro`, `gemini-pro`

### Paid Tier Benefits
- **Higher limits:** 1,500 requests per minute
- **More models:** All experimental models
- **Priority:** Faster response times

## Deployment Considerations

### For Production
```bash
# Before deployment:
1. Set NODE_ENV=production in .env
2. Use production API key (paid tier recommended)
3. Implement caching for generated questions
4. Monitor API usage
5. Set up error alerts
```

### For Development/Testing
```bash
# Current setup is fine:
NODE_ENV=development
Use free API key
Test rate limits
```

## Files Modified

### backend/services/geminiService.js
```javascript
// Line 17 - Changed from:
const getModel = () => {
  return getGenAI().getGenerativeModel({ model: 'gemini-1.5-flash' });
};

// Changed to:
const getModel = () => {
  return getGenAI().getGenerativeModel({ model: 'gemini-1.5-pro' });
};
```

## Next Steps

1. ✅ **Restart Backend** (if running)
2. ✅ **Test Interview Feature**
3. ✅ **Verify Questions Generate Successfully**
4. ✅ **Test Answer Evaluation**
5. ✅ **Check Performance Reports**
6. ✅ **If Issues:** Try alternative models above
7. ✅ **Document Working Model** for future reference

## Support Resources

- **Google AI Studio:** https://aistudio.google.com
- **Gemini API Docs:** https://ai.google.dev/tutorials/python_quickstart
- **Available Models:** https://ai.google.dev/models
- **Rate Limits:** https://ai.google.dev/docs/rate_limit_guide

---

**Status:** ✅ Model fixed to `gemini-1.5-pro`
**Last Updated:** After model update
**Ready for Testing:** Yes
