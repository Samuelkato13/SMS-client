import axios from 'axios';
import { toast } from 'react-toastify';

/** Set in `.env` as `VITE_OPENAI_API_KEY` — never commit real keys. */
const OPENAI_API_KEY =
  typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_OPENAI_API_KEY
    ? String(import.meta.env.VITE_OPENAI_API_KEY).trim()
    : '';

const analyzeData = async (data, type) => {
  try {
    if (!OPENAI_API_KEY) {
      toast.error('AI analytics is not configured (missing VITE_OPENAI_API_KEY).');
      return 'Analysis unavailable: configure an API key on the server or in env.';
    }
    const prompt = generatePrompt(data, type);
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a data analyst specializing in educational data analysis.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error analyzing data:', error);
    toast.error('Failed to analyze data. Please try again later.');
    return 'Analysis unavailable at this time.';
  }
};

const generatePrompt = (data, type) => {
  switch (type) {
    case 'fees':
      return `Analyze this fee collection data and provide insights:
        - Total collection: ${data.totalCollected}
        - Outstanding amount: ${data.outstanding}
        - Collection rate: ${data.collectionRate}%
        - Monthly trends: ${JSON.stringify(data.monthlyTrends)}
        Please provide:
        1. Key insights
        2. Areas of concern
        3. Recommendations for improvement
        4. Predictions for next month`;

    case 'marks':
      return `Analyze this academic performance data and provide insights:
        - Class average: ${data.classAverage}
        - Subject performance: ${JSON.stringify(data.subjectPerformance)}
        - Student distribution: ${JSON.stringify(data.studentDistribution)}
        Please provide:
        1. Performance trends
        2. Areas needing attention
        3. Recommendations for improvement
        4. Predictions for next term`;

    case 'attendance':
      return `Analyze this attendance data and provide insights:
        - Overall attendance rate: ${data.attendanceRate}%
        - Class-wise attendance: ${JSON.stringify(data.classAttendance)}
        - Monthly trends: ${JSON.stringify(data.monthlyTrends)}
        Please provide:
        1. Attendance patterns
        2. Areas of concern
        3. Recommendations for improvement
        4. Predictions for next month`;

    default:
      return 'Please provide specific data type for analysis';
  }
};

export const analyticsService = {
  analyzeFees: (data) => analyzeData(data, 'fees'),
  analyzeMarks: (data) => analyzeData(data, 'marks'),
  analyzeAttendance: (data) => analyzeData(data, 'attendance')
}; 