import * as path from 'path';
import * as fs from 'fs';

// Since docx4js doesn't have type definitions, we'll use a more permissive import
// and define our own interfaces for the objects we're using
const docx4js = require('docx4js');

// Define interfaces for the objects we're using
interface DocxCell {
  text(): string;
}

interface DocxRow {
  cells: DocxCell[];
}

interface DocxTable {
  rows: DocxRow[];
}

interface DocxDocument {
  tables: DocxTable[];
}

/**
 * Parses the first table in a .docx file into an array of objects, using the first row as headers.
 */
export async function parseDocxTableToJson(filePath: string): Promise<Record<string, string>[]> {
  const doc = await docx4js.load(filePath) as DocxDocument;
  const tables = doc.tables;
  if (!tables || tables.length === 0) {
    throw new Error('No tables found in the document.');
  }
  const rows = tables[0].rows;
  if (!rows || rows.length < 2) {
    throw new Error('Not enough rows in the table.');
  }
  // Use the first row as headers
  const headers = rows[0].cells.map((cell: DocxCell) => cell.text().replace(/\s+/g, ' ').trim());
  const data = rows.slice(1).map((row: DocxRow) => {
    const obj: Record<string, string> = {};
    row.cells.forEach((cell: DocxCell, i: number) => {
      obj[headers[i] || `col${i}`] = cell.text().replace(/\s+/g, ' ').trim();
    });
    return obj;
  });
  return data;
}

/**
 * Parses all tables in a .docx file into an array of table data objects
 */
export async function parseAllDocxTablesToJson(filePath: string): Promise<Record<string, string>[][]> {
  const doc = await docx4js.load(filePath) as DocxDocument;
  const tables = doc.tables;
  
  if (!tables || tables.length === 0) {
    throw new Error('No tables found in the document.');
  }
  
  return tables.map((table: DocxTable) => {
    const rows = table.rows;
    if (!rows || rows.length < 2) {
      return [];
    }
    
    // Use the first row as headers
    const headers = rows[0].cells.map((cell: DocxCell) => 
      cell.text().replace(/\s+/g, ' ').trim());
    
    return rows.slice(1).map((row: DocxRow) => {
      const obj: Record<string, string> = {};
      row.cells.forEach((cell: DocxCell, i: number) => {
        obj[headers[i] || `col${i}`] = cell.text().replace(/\s+/g, ' ').trim();
      });
      return obj;
    });
  });
}

// Example usage (uncomment to run as a script)
// (async () => {
//   const filePath = path.join(__dirname, '../klientu_jautājumi_fasādes.docx');
//   
//   // Parse first table
//   const firstTableData = await parseDocxTableToJson(filePath);
//   fs.writeFileSync('first_table.json', JSON.stringify(firstTableData, null, 2), 'utf-8');
//   
//   // Parse all tables
//   const allTablesData = await parseAllDocxTablesToJson(filePath);
//   fs.writeFileSync('all_tables.json', JSON.stringify(allTablesData, null, 2), 'utf-8');
// })(); 