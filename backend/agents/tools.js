import axios from 'axios';
import * as cheerio from 'cheerio';

export const getSearchResults = async (query, partNumber = null) => {
  const params = {
    q: `${query} site:partselect.com`,
    engine: 'google',
    api_key: process.env.SERPAPI_KEY,
    num: 5,
  };

  try {
    const response = await axios.get('https://serpapi.com/search', { params });
    const results = response.data.organic_results || [];

    console.log("All search results:");
    results.forEach((r, i) => {
      console.log(`Result ${i + 1}: ${r.title} | ${r.link}`);
    });

    if (partNumber) {
      // Prioritize a result that mentions the exact part number
      const match = results.find(r => r.title.includes(partNumber) || r.snippet.includes(partNumber));
      if (match) return match.link;
    }

    // Fallback: return first link
    return results[0]?.link || null;
  } catch (err) {
    console.error('Error fetching search results:', err);
    return null;
  }
};

export const scrapePartSelectPage = async (url) => {
  try {
    const { data: html } = await axios.get(url);
    const $ = cheerio.load(html);

    const instructions = [];

    // Look for typical installation instruction containers
    $('.how-to-section, .instructions, .installation-instructions, #qa-section, .questions-answers, .how-to, .repair-help').each((_, el) => {
      instructions.push($(el).text().trim());
    });

    const result = instructions
      .filter(Boolean)
      .join('\n\n')
      .replace(/\s+/g, ' ')
      .trim();

    return result || null;
  } catch (err) {
    console.error('Error scraping PartSelect page:', err);
    return null;
  }
};
