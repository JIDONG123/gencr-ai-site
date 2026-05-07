// api/generate.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { style } = req.body;
  if (!style) {
    return res.status(400).json({ error: 'Missing style' });
  }

  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}` // 密钥存于 Vercel 环境变量
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'user',
            content: `Generate a unique ${style} style English gaming username, only output the name, no extra words`
          }
        ],
        temperature: 0.7,
        max_tokens: 50
      })
    });

    const data = await response.json();
    const name = data.choices?.[0]?.message?.content?.trim() || 'Generation failed';
    res.status(200).json({ name });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}