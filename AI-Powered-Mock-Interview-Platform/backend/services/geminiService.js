const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI (only on backend)
let genAI = null;

const getGenAI = () => {
  if (!genAI) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured in environment variables');
    }
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
};

const getModel = () => {
  // Using gemini-2.0-flash which is the latest available model
  // If this fails, fallback to gemini-pro
  return getGenAI().getGenerativeModel({ 
    model: 'gemini-2.0-flash',
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
    }
  });
};

/**
 * Generate interview questions for a given category and difficulty
 * @param {string} category - Interview category
 * @param {string} difficulty - Easy | Medium | Hard
 * @param {number} count - Number of questions to generate
 * @returns {Array} Array of question strings
 */
const generateQuestions = async (category, difficulty, count) => {
  const model = getModel();

  const prompt = `You are an expert technical interviewer. Generate exactly ${count} interview questions for a ${difficulty} level ${category} interview.

Requirements:
- Questions must be practical, relevant, and test real understanding
- Mix conceptual and practical questions
- For ${difficulty} level:
  ${difficulty === 'Easy' ? '- Basic concepts, definitions, simple use cases' : ''}
  ${difficulty === 'Medium' ? '- Intermediate concepts, design patterns, real scenarios' : ''}
  ${difficulty === 'Hard' ? '- Advanced topics, system design, edge cases, optimization' : ''}
- Do NOT include answer hints in the questions

Return ONLY a valid JSON array of strings with exactly ${count} questions. No markdown, no explanation, just the JSON array.

Example format: ["Question 1?", "Question 2?", "Question 3?"]`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    // Clean response — remove markdown code blocks if present
    const cleaned = text
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    const questions = JSON.parse(cleaned);

    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error('Invalid questions format from Gemini');
    }

    return questions.slice(0, count);
  } catch (error) {
    console.error('Gemini question generation error:', error.message);
    throw new Error(`Failed to generate questions: ${error.message}`);
  }
};

/**
 * Evaluate a user's answer to an interview question
 * @param {string} question - The interview question
 * @param {string} userAnswer - The user's answer
 * @param {string} category - Interview category
 * @param {string} difficulty - Difficulty level
 * @returns {Object} Evaluation object
 */
const evaluateAnswer = async (question, userAnswer, category, difficulty) => {
  const model = getModel();

  // Handle unanswered questions
  if (!userAnswer || userAnswer.trim().length < 3) {
    return {
      score: 0,
      explanation: 'No answer was provided for this question.',
      mistakes: ['Question was left unanswered'],
      betterAnswer: 'Please attempt to answer all questions for a proper evaluation.',
      suggestions: ['Always attempt to provide an answer, even if partial'],
      confidenceRating: 'N/A',
      difficultyAnalysis: `This was a ${difficulty} level ${category} question`,
    };
  }

  const prompt = `You are an expert technical interviewer evaluating a candidate's answer.

**Category**: ${category}
**Difficulty**: ${difficulty}
**Question**: ${question}
**Candidate's Answer**: ${userAnswer}

Evaluate this answer comprehensively and return a JSON object with exactly these fields:
{
  "score": <number 0-100>,
  "explanation": "<detailed explanation of the evaluation in 2-3 sentences>",
  "mistakes": ["<mistake 1>", "<mistake 2>"],
  "betterAnswer": "<a comprehensive model answer>",
  "suggestions": ["<improvement suggestion 1>", "<improvement suggestion 2>"],
  "confidenceRating": "<Excellent|Good|Average|Below Average|Poor>",
  "difficultyAnalysis": "<analysis of how the candidate handled the difficulty level>"
}

Scoring guide:
- 90-100: Perfect or near-perfect answer
- 75-89: Good answer with minor gaps
- 60-74: Adequate answer with some gaps
- 40-59: Partial answer, missing key concepts
- 20-39: Minimal understanding shown
- 0-19: Incorrect or very insufficient answer

Return ONLY valid JSON. No markdown, no extra text.`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    // Clean response
    const cleaned = text
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    const evaluation = JSON.parse(cleaned);

    // Validate required fields
    const required = ['score', 'explanation', 'mistakes', 'betterAnswer', 'suggestions', 'confidenceRating', 'difficultyAnalysis'];
    for (const field of required) {
      if (evaluation[field] === undefined) {
        evaluation[field] = field === 'score' ? 0 : field.includes('Array') ? [] : 'Not available';
      }
    }

    // Ensure score is within bounds
    evaluation.score = Math.min(100, Math.max(0, Number(evaluation.score) || 0));

    return evaluation;
  } catch (error) {
    console.error('Gemini evaluation error:', error.message);
    throw new Error(`Failed to evaluate answer: ${error.message}`);
  }
};

/**
 * Generate overall interview summary and learning path
 * @param {Array} questions - Array of question objects with evaluations
 * @param {string} category - Interview category
 * @param {number} averageScore - Overall average score
 * @returns {Object} Summary with strengths, weaknesses, and learning path
 */
const generateInterviewSummary = async (questions, category, averageScore) => {
  const model = getModel();

  const qaSummary = questions
    .map((q, i) => `Q${i + 1}: ${q.questionText} | Score: ${q.aiEvaluation.score}/100`)
    .join('\n');

  const prompt = `You are a technical interview coach. Based on the following interview results, provide a comprehensive summary.

**Category**: ${category}
**Overall Average Score**: ${averageScore}/100
**Questions and Scores**:
${qaSummary}

Return a JSON object with exactly these fields:
{
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "weaknesses": ["<weakness 1>", "<weakness 2>", "<weakness 3>"],
  "overallFeedback": "<2-3 sentence overall assessment>",
  "learningPath": ["<specific topic to study 1>", "<specific topic to study 2>", "<topic 3>", "<topic 4>"],
  "recommendedTopics": ["<topic 1>", "<topic 2>", "<topic 3>"]
}

Return ONLY valid JSON. No markdown, no extra text.`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    const cleaned = text
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    return JSON.parse(cleaned);
  } catch (error) {
    console.error('Gemini summary error:', error.message);
    // Return fallback summary
    return {
      strengths: ['Attempted all questions', 'Showed willingness to participate'],
      weaknesses: ['Needs more preparation in ' + category],
      overallFeedback: `You completed the ${category} interview with an average score of ${averageScore}/100. Keep practicing to improve your skills.`,
      learningPath: [`Study ${category} fundamentals`, 'Practice coding exercises', 'Review common interview patterns'],
      recommendedTopics: [category, 'Data Structures', 'System Design'],
    };
  }
};

module.exports = { generateQuestions, evaluateAnswer, generateInterviewSummary };
