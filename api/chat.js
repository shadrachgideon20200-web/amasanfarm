// api/chat.js - This na your secure backend for Vercel

export default async function handler(req, res) {
  // Only allow POST
  if (req.method!== 'POST') {
    return res.status(405).json({ reply: 'Method not allowed' });
  }

  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ reply: 'No message sent' });
    }

    // Call Groq from backend - key dey hide for Vercel
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant', // fast and free model
        messages: [
          {
            role: 'system',
            content: 'You are Amasan Farm assistant. You help customers about Amasan Farm - poultry, eggs, catfish, livestock. Be friendly, short, and helpful. You dey speak pidgin small small.'
          },
         ...(history || []),
          { role: 'user', content: message }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });

    const data = await groqRes.json();

    if (!groqRes.ok) {
      console.error('Groq Error:', data);
      return res.status(500).json({ reply: 'Sorry, AI busy small. Try again.' });
    }

    const reply = data.choices?.[0]?.message?.content || 'Sorry, I no understand.';

    return res.status(200).json({ reply });

  } catch (error) {
    console.error('Server Error:', error);
    return res.status(500).json({ reply: 'Network error for server. Try again.' });
  }
}