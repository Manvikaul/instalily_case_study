import { getChatCompletion } from '../services/deepseek.js';
import { getSearchResults } from './tools.js';

export const troubleshootingAgent = async ({ partName, modelNumber, brand }) => {
  console.log('Input to troubleshootingAgent:', { partName, modelNumber, brand });

  const queryParts = [];
  if (partName) queryParts.push(partName);
  if (brand) queryParts.push(brand);
  if (modelNumber) queryParts.push(modelNumber);
  queryParts.push('site:partselect.com troubleshooting');

  const query = queryParts.join(' ');
  console.log('Search query:', query);

  const searchContent = await getSearchResults(query);
  console.log('Scraped content from search:', searchContent.slice(0, 500)); // Show first 500 chars for brevity

  const userPrompt = `I'm having trouble with my ${partName || "appliance"}${brand ? " from " + brand : ""}${modelNumber ? " (model " + modelNumber + ")" : ""}. How can I fix it?`;

  const messages = [
    {
      role: "system",
      content: "You are a helpful and accurate troubleshooting assistant for appliance parts. Use only the information provided below from partselect.com to construct your answer. If the issue is not covered, say so clearly.",
    },
    {
      role: "user",
      content: `${userPrompt}\n\nHere is some info from partselect.com:\n\n${searchContent}`,
    },
  ];

  const result = await getChatCompletion(messages);
  console.log('Deepseek final reply:', result);
  return result;
};
