#!/usr/bin/env node

/**
 * Diagnostic script to test which Gemini models are available
 * Run this from backend directory: node test-gemini-models.js
 */

require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error('❌ ERROR: GEMINI_API_KEY not found in .env file');
  console.error('Please add GEMINI_API_KEY=your_key_here to backend/.env');
  process.exit(1);
}

console.log('🔍 Testing Gemini Model Availability...\n');

const models = [
  'gemini-pro',
  'gemini-pro-vision',
  'gemini-1.5-pro',
  'gemini-1.5-flash',
  'gemini-2.0-flash',
  'gemini-2.0-flash-exp',
  'gemini-exp-1114',
];

async function testModel(modelName) {
  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: modelName });
    
    // Try to generate simple content
    const result = await model.generateContent('Say "Hello" and nothing else.');
    console.log(`✅ ${modelName}: WORKS`);
    return true;
  } catch (error) {
    const errorMsg = error.message || error;
    if (errorMsg.includes('404')) {
      console.log(`❌ ${modelName}: NOT FOUND (404)`);
    } else if (errorMsg.includes('401')) {
      console.log(`⚠️  ${modelName}: UNAUTHORIZED (Invalid API key)`);
    } else if (errorMsg.includes('429')) {
      console.log(`⏱️  ${modelName}: RATE LIMITED`);
    } else {
      console.log(`❌ ${modelName}: ERROR - ${errorMsg.substring(0, 80)}`);
    }
    return false;
  }
}

async function runTests() {
  console.log(`Testing with API Key: ${API_KEY.substring(0, 10)}...${API_KEY.substring(-10)}\n`);
  
  const results = [];
  
  for (const model of models) {
    const works = await testModel(model);
    results.push({ model, works });
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n📊 SUMMARY:\n');
  const working = results.filter(r => r.works);
  const notWorking = results.filter(r => !r.works);
  
  if (working.length > 0) {
    console.log('✅ WORKING MODELS:');
    working.forEach(r => console.log(`   - ${r.model}`));
  }
  
  if (notWorking.length > 0) {
    console.log('\n❌ NOT WORKING:');
    notWorking.forEach(r => console.log(`   - ${r.model}`));
  }
  
  if (working.length > 0) {
    console.log(`\n✨ RECOMMENDATION: Use '${working[0].model}'`);
    console.log(`\nUpdate backend/services/geminiService.js line 17:`);
    console.log(`  model: '${working[0].model}'`);
  } else {
    console.log('\n⚠️  No working models found!');
    console.log('Possible issues:');
    console.log('1. Invalid GEMINI_API_KEY');
    console.log('2. API key is restricted to specific models');
    console.log('3. Network connectivity issue');
    console.log('4. API service is down');
  }
}

runTests().catch(console.error);
