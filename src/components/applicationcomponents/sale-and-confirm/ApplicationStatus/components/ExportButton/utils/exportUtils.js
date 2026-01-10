// Export utility functions for PDF, XLS, and DOC downloads
 
/**
 * Export selected records to PDF
 * @param {Array} selectedRecords - Array of selected record objects
 * @param {string} filename - Name of the file to download
 */
export const exportToPDF = (records, headers, fields) => {
  const html = generateTableHTML(records, headers, fields);
  const win = window.open("", "_blank");
 
  win.document.write(`
    <html>
      <body>
        <h2>Application Distribution</h2>
        ${html}
      </body>
    </html>
  `);
 
  win.document.close();
  win.print();
};
 
 
/**
 * Export selected records to Excel (.xls)
 * @param {Array} selectedRecords - Array of selected record objects
 * @param {string} filename - Name of the file to download
 */
export const exportToXLS = (records, headers, fields) => {
  const rows = [
    headers.join(","),
    ...records.map((r) =>
      fields.map((f) => `"${r[f] ?? ""}"`).join(",")
    ),
  ].join("\n");

  // Use a spreadsheet-compatible mime type and .xls filename so browsers
  // will offer the file as an Excel document. Content is CSV-style.
  const blob = new Blob([rows], { type: "application/vnd.ms-excel" });
  download(blob, "application-distribution.xls");
};
 
 
/**
 * Export selected records to Word (.doc)
 * @param {Array} selectedRecords - Array of selected record objects
 * @param {string} filename - Name of the file to download
 */
export const exportToDOC = (records, headers, fields) => {
  const html = generateTableHTML(records, headers, fields);
  const blob = new Blob([html], { type: "application/msword" });
  download(blob, "application-distribution.doc");
};
 
const download = (blob, filename) => {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};
 
 
 
/**
 * Generate HTML table from selected records
 * @param {Array} selectedRecords - Array of selected record objects
 * @returns {string} HTML table string
 */
const generateTableHTML = (records, headers, fields) => {
  const rows = records
    .map(
      (row) => `
      <tr>
        ${fields.map((f) => `<td>${row[f] ?? "-"}</td>`).join("")}
      </tr>
    `
    )
    .join("");
 
  return `
    <table>
      <thead>
        <tr>
          ${headers.map((h) => `<th>${h}</th>`).join("")}
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
};
 
 
/**
 * Generate CSV content from selected records
 * @param {Array} selectedRecords - Array of selected record objects
 * @returns {string} CSV content string
 */
const generateCSVContent = (selectedRecords) => {
  if (!selectedRecords || selectedRecords.length === 0) {
    return 'No records selected for export.';
  }
 
  const headers = ['Application No', 'PRO', 'Campus', 'DGM', 'Zone', 'Status'];
  const csvRows = [headers.join(',')];
 
  selectedRecords.forEach(record => {
    const row = [
      record.applicationNo || '',
      record.pro || '',
      record.campus || '',
      record.dgm || '',
      record.zone || '',
      record.status || ''
    ];
    csvRows.push(row.join(','));
  });
 
  return csvRows.join('\n');
};
 
/**
 * Get selected records from the data array
 * @param {Array} data - Array of all records
 * @returns {Array} Array of selected records
 */
export const getSelectedRecords = (data) => {
  return data.filter(record => record.isSelected === true);
};
 
/**
 * Check if any records are selected
 * @param {Array} data - Array of all records
 * @returns {boolean} True if any records are selected
 */
export const hasSelectedRecords = (data) => {
  return data.some(record => record.isSelected === true);
};