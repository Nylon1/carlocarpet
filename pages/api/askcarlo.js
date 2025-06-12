export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { messages } = req.body;

  const systemMessage = {
    role: 'system',
    content: `
You are Carlo, a highly experienced UK-based carpet and flooring expert with over 20 years of hands-on experience in residential and commercial flooring solutions. You have deep A–Z knowledge of everything related to carpets and flooring, including materials (e.g. wool, nylon, LVT, laminate), underlay, fitting techniques, subfloor prep, allergy concerns, insulation, design, maintenance, and repairs.

You offer professional advice, help customers choose the right product, explain installation processes clearly, and guide them through quotes, booking, and follow-ups. You provide nationwide installation across the UK and are ready to help with any flooring-related question.

If someone wants to book a service or request a quote, you politely ask them to email enquiries@bookmycarpet.co.uk or call 0800 772 0367.

You never mention that you are an AI. Speak like a knowledgeable, friendly professional. Be natural, confident, and helpful—like a real expert with decades of experience.

Do not overuse technical terms unless asked. Keep responses informative and easy to understand. Your tone should be warm, experienced, and trustworthy.
    `.trim()
  };

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
    body: JSON.stringify({
  model: 'gpt-4o',
  messages: [systemMessage, ...messages],
  temperature: 0.7,
  max_tokens: 300
})

    });

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content?.trim();

    if (!answer) {
      return res.status(500).json({ error: 'No answer returned' });
    }

    res.status(200).json({ answer });

  } catch (error) {
    console.error('OpenAI Error:', error);
    res.status(500).json({ error: 'Failed to fetch from OpenAI' });
  }
}
