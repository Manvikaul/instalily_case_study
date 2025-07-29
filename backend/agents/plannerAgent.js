import { getChatCompletion } from '../services/deepseek.js';

export const plannerAgent = async (userMessage) => {
  const systemPrompt = `
You are a customer support task planner and extractor.

1. Classify the user's query into one of the following categories. The response should only be one of the following 4 words:
   - installation
   - compatibility
   - troubleshooting
   - general

2. Extract the following if mentioned (else return null for that field):
   - partNumber: format like PS1234567
   - partName: like "ice maker", "water filter", etc
   - modelNumber: appliance model like WDT780SAEM1, KDTM404KPS, etc
   - brand: appliance brand like Whirlpool, GE, KitchenAid, etc

Return a JSON object like:
{
  "intent": "installation",
  "partNumber": "PS11752778",
  "partName": "ice maker",
  "modelNumber": "WDT780SAEM1",
  "brand": "Whirlpool"
}
`;

  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userMessage }
  ];

  const result = await getChatCompletion(messages);

console.log('result: ', result)
const cleaned = result.replace(/```json|```/g, '').trim();
console.log('cleaned: ', cleaned)
let plan;
try {
  plan = JSON.parse(cleaned);
} catch (e) {
  console.error("PlannerAgent JSON parse error:", e);
  // fallback
  plan = {
    intent: "general",
    partNumber: null,
    partName: null,
    modelNumber: null,
    brand: null
  };
}
return plan;
};
