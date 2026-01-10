// Export utility functions for PDF, XLS, and DOC downloads

/**
 * Export selected records to PDF
 * @param {Array} selectedRecords - Array of selected record objects
 * @param {string} filename - Name of the file to download
 */
// Go up 7 levels to reach src/ -> then into assets/applicationassets/
import { logoBase64 } from "../../../../../../../assets/applicationassets/watermarkLogo";

export const exportToPDF = (records, headers, fields) => {
  const html = generateTableHTML(records, headers, fields);
  const win = window.open("", "_blank");

  win.document.write(`
    <html>
      <head>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            position: relative;
            min-height: 100vh;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
           /* Watermark Style */
          body::before {
            content: "";
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 80%;
            height: 80%;
            background-image: url('${logoBase64}');
            background-repeat: no-repeat;
            background-position: center;
            background-size: contain;
            opacity: 0.1; /* Faint watermark */
            z-index: -1;
            pointer-events: none;
          }

          table { width: 100%; border-collapse: collapse; margin-top: 20px; position: relative; z-index: 1; }
          th, td { border: 1px solid #000; padding: 8px; text-align: left; font-size: 12px; }
          th { background-color: #f2f2f2; font-weight: bold; }
          h2 { text-align: center; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <h2>Application Distribution</h2>
        ${html}
      </body>
    </html>
  `);

  win.document.close();
  // Allow image to load before printing (though base64 is instant, a small delay is safe/good practice)
  setTimeout(() => {
    win.print();
  }, 500);
};


/**
 * Export selected records to Excel (.xls)
 * @param {Array} selectedRecords - Array of selected record objects
 * @param {string} filename - Name of the file to download
 */
export const exportToXLS = (records, headers, fields) => {
  // Generate the table HTML using the existing helper
  const tableHtml = generateTableHTML(records, headers, fields);

  // Wrap in a full HTML document for Excel to interpret it correctly
  // properly handling the title "Application Distribution" and adding borders
  const excelHtml = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>Sheet1</x:Name>
              <x:WorksheetOptions>
                <x:DisplayGridlines/>
              </x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
      <meta charset="utf-8">
      <style>
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #000000; padding: 5px; text-align: left; }
          th { background-color: #f2f2f2; font-weight: bold; }
      </style>
    </head>
    <body>
      <h2>Application Distribution</h2>
      ${tableHtml}
    </body>
    </html>
  `;

  const blob = new Blob([excelHtml], { type: "application/vnd.ms-excel" });
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