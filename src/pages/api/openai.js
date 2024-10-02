// pages/api/openai.js

import { Configuration, OpenAIApi } from 'openai';

// OpenAI API konfigürasyonu
const configuration = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, // Ortam değişkeninizi kullanın
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { prompt } = req.body; // İstekten gelen prompt

    try {
      const response = await openai.createCompletion({
        model: 'text-davinci-003', // Kullanmak istediğiniz model
        prompt: prompt, // Kullanıcıdan gelen metin
        max_tokens: 150, // Yanıtın maksimum uzunluğu
      });

      res.status(200).json({ result: response.data.choices[0].text }); // Yanıtı gönder
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'API isteği başarısız oldu' }); // Hata durumunda yanıt
    }
  } else {
    res.status(405).json({ error: 'Yalnızca POST isteklerine izin veriliyor' }); // Diğer istekler için hata yanıtı
  }
}
