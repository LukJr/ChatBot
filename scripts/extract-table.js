const mammoth = require('mammoth');
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

// Path to the document
const documentPath = path.join(__dirname, '../AIC.docx');
// Output path for the JSON file
const jsonOutputPath = path.join(__dirname, '../data/document-data.json');

/**
 * Extract tables from HTML content and convert to JSON
 */
function extractTablesFromHtml(html) {
  const $ = cheerio.load(html);
  const tables = [];

  $('table').each((tableIndex, tableEl) => {
    const rows = [];
    
    $(tableEl).find('tr').each((rowIndex, rowEl) => {
      const cells = [];
      
      $(rowEl).find('th, td').each((cellIndex, cellEl) => {
        cells.push($(cellEl).text().trim());
      });
      
      if (cells.length > 0) {
        rows.push(cells);
      }
    });
    
    if (rows.length >= 2) {
      // Convert to JSON using headers from first row
      const headers = rows[0];
      const jsonData = rows.slice(1).map(row => {
        const rowObj = {};
        row.forEach((cell, i) => {
          rowObj[headers[i] || `column${i}`] = cell;
        });
        return rowObj;
      });
      
      tables.push(jsonData);
    }
  });
  
  return tables;
}

async function processDocument() {
  try {
    console.log(`Processing document: ${documentPath}`);
    
    // Create the data directory if it doesn't exist
    const dataDir = path.dirname(jsonOutputPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // Convert document to HTML (preserves tables)
    const result = await mammoth.convertToHtml({ path: documentPath });
    
    // Extract tables from HTML
    const tables = extractTablesFromHtml(result.value);
    
    // Write table data to JSON file with correct encoding
    fs.writeFileSync(
      jsonOutputPath, 
      JSON.stringify(tables, null, 2), 
      { encoding: 'utf8' }
    );
    
    console.log(`Document processed successfully!`);
    console.log(`Found ${tables.length} tables.`);
    console.log(`JSON data saved to: ${jsonOutputPath}`);
    
    // Log a preview of the data
    if (tables.length > 0 && tables[0].length > 0) {
      console.log('\nData structure preview:');
      console.log(`First table, first row keys: ${Object.keys(tables[0][0]).join(', ')}`);
      console.log(`Sample entry:`);
      const sampleEntry = tables[0][0];
      for (const [key, value] of Object.entries(sampleEntry)) {
        console.log(`  ${key}: ${value.substring(0, 100)}${value.length > 100 ? '...' : ''}`);
      }
    } else {
      console.log('No tables found in the document.');
    }
    
    // Print any warnings
    if (result.messages.length > 0) {
      console.log('\nWarnings:');
      result.messages.forEach(msg => console.log(`- ${msg.message}`));
    }
    
  } catch (error) {
    console.error('Error processing document:', error);
  }
}

// Run the script
processDocument(); 