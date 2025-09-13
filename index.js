import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/translate', async (req, res) => {
  const { text, targetLanguage } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant that translates text.' },
        { role: 'user', content:
          `Translate the following text to ${targetLanguage}.
          Text: ${text}

          Rules:
          1. Output ONLY the translated text, no quotes.
          2. If the text is already in ${targetLanguage}, output exactly: No translation needed.
          3. If the text is gibberish or unreadable, output exactly: No translation needed.
          4. If the text contains multiple languages, translate only the parts that are not in ${targetLanguage}.`},
      ],
      temperature: 0.0,
    });

    const translatedText = response.choices[0].message.content;
    res.json({ translatedText });
  } catch (error) {
    console.error('Error translating text:', error);
    res.status(500).json({ error: 'Failed to translate text' });
  }
});
    
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});