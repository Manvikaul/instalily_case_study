import { getChatCompletion } from '../services/deepseek.js';

export const compatibilityAgent = async ({ partNumber, partName, modelNumber, brand }) => {
  const partDescriptor = partNumber
    ? `part number ${partNumber}`
    : partName
    ? `the ${partName}`
    : "a part";

  const applianceDescriptor = modelNumber
    ? `model ${modelNumber}`
    : "this appliance";

  const prompt = `Is ${partDescriptor} compatible with ${applianceDescriptor}${brand ? ` from ${brand}` : ''}?`;

  const messages = [
    { role: "system", content: "You are a compatibility assistant for appliance parts. Only respond based on what is known or publicly documented." },
    { role: "user", content: prompt }
  ];

  const result = await getChatCompletion(messages);
  return result;
};
