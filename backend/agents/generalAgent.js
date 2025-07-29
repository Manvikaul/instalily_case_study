// agents/generalAgent.js
import { getChatCompletion } from '../services/deepseek.js';

export const generalAgent = async (message) => {
  const messages = [
    { role: "system", content: "You are a helpful assistant for refrigerator and dishwasher parts. Only answer questions relevant to that domain." },
    { role: "user", content: message }
  ];

  const result = await getChatCompletion(messages);
  return result;
};
