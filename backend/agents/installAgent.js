import { getChatCompletion } from '../services/deepseek.js';
import { getSearchResults, scrapePartSelectPage } from './tools.js';

export const installAgent = async ({ partNumber, partName, modelNumber, brand }) => {
  console.log('Input to installAgent:', { partNumber, partName, modelNumber, brand });

  if (!modelNumber && !partNumber) {
    console.log('Missing both model number and part number. Cannot proceed.');
    return `Could you please provide either the model number or part number so I can help with installation instructions?`;
  }

  const query = partNumber 
    ? `${partNumber} site:partselect.com installation`
    : `${brand || ''} ${modelNumber || ''} ${partName || ''} installation site:partselect.com`;

  console.log('Search query:', query);

  const partPageLink = await getSearchResults(query, partNumber);
  console.log('Best matching PartSelect link:', partPageLink);

  if (!partPageLink) {
    return `I couldn't find specific installation info for ${partNumber || modelNumber || 'your part'}. You can try searching on partselect.com manually.`;
  }

  const rawInstructions = await scrapePartSelectPage(partPageLink);
  console.log('Raw scraped instructions:', rawInstructions?.slice(0, 500)); // only log preview

  if (!rawInstructions) {
    return `I found the part page, but couldn't extract installation instructions. Here's the link: ${partPageLink}`;
  }

  const summarized = await getChatCompletion(`Summarize these installation instructions:\n\n${rawInstructions}`);
  return `Here’s how you can install ${partNumber || partName || 'the part'}:\n\n${summarized}`;
};
