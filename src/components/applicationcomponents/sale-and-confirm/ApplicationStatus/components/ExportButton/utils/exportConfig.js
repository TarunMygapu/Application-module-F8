// exportConfig.js
export const EXPORT_CONFIG = {
  zone: {
    headers: [
      "Application From",
      "Application To",
      "Total Applications",
      "Amount",
      "Issued Name",
      "Zone Name",
    ],
    fields: [
      "applicationNoFrom",
      "applicationNoTo",
      "applicationCount",
      "applicationFee",
      "issuedName",
      "zoneName",
    ],
  },
 
  dgm: {
    headers: [
      "Application From",
      "Application To",
      "Total Applications",
      "Amount",
      "Issued Name",
      "Campus Name",
    ],
    fields: [
      "applicationForm",
      "applicationTo",
      "totalApplications",
      "amount",
      "issuedName",
      "campusName",
    ],
  },
 
  campus: {
    headers: [
      "Application From",
      "Application To",
      "Total Applications",
      "Amount",
      "Issued Name",
      "Campus Name",
      "District",
      "Area",
    ],
    fields: [
      "applicationForm",
      "applicationTo",
      "totalApplications",
      "amount",
      "issuedName",
      "campusName",
      "campaignDistrictName",
      "campaignAreaName",
    ],
  },
  applicationStatus: {
    headers: [
      "Application No",
      "PRO",
      "Campus",
      "DGM",
      "Zone",
      "Date",
      "Status",
    ],
    fields: [
      "applicationNo",
      "pro",
      "campus",
      "dgm",
      "zone",
      "date",
      "status",
    ],
  },
};
 
 