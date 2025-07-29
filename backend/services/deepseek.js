import axios from 'axios';

export const getChatCompletion = async (messages) => {
  const response = await axios.post(
    'https://api.deepseek.com/v1/chat/completions',
    {
      model: "deepseek-chat",
      messages
    },
    {
      headers: {
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  );

  return response.data.choices[0].message.content;
};
