import * as fs from 'fs';
import * as path from 'path';

interface DocumentEntry {
  [key: string]: string;
}

type DocumentData = DocumentEntry[][];

/**
 * Loads the parsed document data from the JSON file
 */
export function loadDocumentData(): DocumentData {
  try {
    const dataPath = path.join(process.cwd(), 'data/document-data.json');
    if (!fs.existsSync(dataPath)) {
      console.warn('Document data file not found:', dataPath);
      return [];
    }
    
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    return JSON.parse(rawData) as DocumentData;
  } catch (error) {
    console.error('Error loading document data:', error);
    return [];
  }
}

/**
 * Normalizes text for better matching (lowercase, remove diacritics, etc.)
 */
function normalizeText(text: string): string {
  if (!text) return '';
  
  // Convert to lowercase
  return text.toLowerCase()
    // Remove diacritics (not perfect but helps with basic matching)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    // Remove extra spaces
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extracts keywords from the query
 */
function extractKeywords(query: string): string[] {
  const normalizedQuery = normalizeText(query);
  
  // Remove common words that don't help with search
  const stopWords = ['un', 'ar', 'par', 'ka', 'vai', 'bet', 'ja', 'tad', 'kā', 'ir'];
  
  return normalizedQuery
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.includes(word));
}

/**
 * Calculate simple relevance score based on keyword matches
 */
function calculateRelevance(entry: DocumentEntry, keywords: string[]): number {
  let score = 0;
  
  // Convert entry values to normalized text for matching
  const entryText = Object.values(entry)
    .map(value => normalizeText(value))
    .join(' ');
  
  // Count keyword matches
  for (const keyword of keywords) {
    if (entryText.includes(keyword)) {
      score += 1;
      
      // Give bonus points for exact phrase matches
      if (entryText.includes(keyword + ' ') || entryText.includes(' ' + keyword)) {
        score += 0.5;
      }
    }
  }
  
  return score;
}

/**
 * Searches for relevant entries in the document data based on a query
 */
export function searchDocumentData(query: string): DocumentEntry[] {
  const data = loadDocumentData();
  if (!data || data.length === 0) return [];
  
  console.log(`Searching document data for: "${query}"`);
  
  // Extract keywords from the query
  const keywords = extractKeywords(query);
  console.log(`Extracted keywords: ${keywords.join(', ')}`);
  
  if (keywords.length === 0) return [];
  
  const scoredResults: {entry: DocumentEntry, score: number}[] = [];
  
  // Search through all tables and entries
  for (const table of data) {
    for (const entry of table) {
      const score = calculateRelevance(entry, keywords);
      
      if (score > 0) {
        scoredResults.push({ entry, score });
      }
    }
  }
  
  // Sort by relevance score (highest first)
  scoredResults.sort((a, b) => b.score - a.score);
  
  // Only return entries with decent relevance
  const relevantResults = scoredResults
    .filter(item => item.score >= Math.min(1, scoredResults[0]?.score || 0))
    .map(item => item.entry);
  
  console.log(`Found ${relevantResults.length} relevant entries`);
  
  return relevantResults;
}

/**
 * Formats document entries into a readable string for the chatbot response
 */
export function formatDocumentEntries(entries: DocumentEntry[]): string {
  if (!entries || entries.length === 0) {
    return "No relevant information found in the documents.";
  }
  
  return entries.map((entry, index) => {
    // Extract the question and answer for clearer display
    const question = entry['Iedzīvotāju jautājums'] || '';
    const answer = entry['Rīgas Apkaimju iedzīvotāju centra sagatavota atbilde'] || '';
    const category = entry['Kategorija'] || '';
    const criteria = entry['Kritēriji kategorijas izpildei'] || '';
    
    let formattedEntry = `ENTRY ${index + 1}:\n`;
    
    if (question) formattedEntry += `Question: ${question}\n`;
    if (answer) formattedEntry += `Answer: ${answer}\n`;
    if (category) formattedEntry += `Category: ${category}\n`;
    if (criteria) formattedEntry += `Criteria: ${criteria}\n`;
    
    // Add any other fields not explicitly handled above
    for (const [key, value] of Object.entries(entry)) {
      if (!['Iedzīvotāju jautājums', 'Rīgas Apkaimju iedzīvotāju centra sagatavota atbilde', 'Kategorija', 'Kritēriji kategorijas izpildei'].includes(key)) {
        formattedEntry += `${key}: ${value}\n`;
      }
    }
    
    return formattedEntry;
  }).join('\n\n');
}

/**
 * Main function to search document data and format results
 */
export function getRelevantDocumentContext(query: string): string {
  const results = searchDocumentData(query);
  return formatDocumentEntries(results);
} 