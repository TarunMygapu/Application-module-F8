import Gender from "../../../../../widgets/GenderWidget/Gender";
import DatePicker from "../../../../../widgets/DateWidgets/DatePicker/DatePicker";
 
export const personalInfoFields = [
  {
    name: "firstName",
    label: "First Name",
    type: "text",
    disabled: false,
    placeholder: "Enter First Name",
    inputRule: "onlyLettersSingleSpace",
    autoCapitalize: true,
    required: true,
    maxLength: "25",
  },
  {
    name: "surName",
    label: "Surname / Last Name",
    type: "text",
    disabled: false,
    placeholder: "Enter Surname / Last Name",
    inputRule: "onlyLettersSingleSpace",
    autoCapitalize: true,
    required: true,
    maxLength: "25",
  },
  {
    name: "gender",
    label: "Gender",
    component: Gender,
    required: true,
  },
  {
    name: "aaparNo",
    label: "Apaar No",
    type: "text",
    disabled: false,
    placeholder: "Enter Aapar No",
    inputRule: "digits",
    maxLength:"12",
    required: true,
  },
  {
    name: "dob",
    label: "Date of Birth",
    component: DatePicker,
    required: true,
  },
  {
    name: "aadharCardNo",
    label: "Aadhar Card No",
    type: "text",
    disabled: false,
    placeholder: "Enter Aadhar Card No",
    inputRule: "aadhaar",
    maxLength:"12",
    required: true,
  },
  {
    name: "quotaAdmissionReferredBy",
    label: "Quota/Admission Referred By",
    options: [],
    required: true,
  },
  {
    name: "employeeId",
    label: "Employee ID",
    options: [],
    required: true,
  },
  {
    name: "admissionType",
    label: "Admission Type",
    options: [],
    required: true,
  },
  {
    name: "proReceiptNo",
    label: "PRO Receipt No",
    type: "text",
    disabled: false,
    placeholder: "Enter PRO Receipt No",
    inputRule: "digits",
    maxLength:"6",
    required: true,
  },
  { name: "foodType", label: "Food Type", options: ["Veg", "Non-Veg"],required: true, },
  {
    name: "bloodGroup",
    label: "Blood Group",
    options: [],
    required: true,
  },
  { name: "caste", label: "Caste", options: [],required: true, },
  {
    name: "religion",
    label: "Religion",
    options: [],
    required: true,
  },
];
 
export const personalInfoFieldsLayout = [
  { id: "row1", fields: ["firstName", "surName", ""] },
  { id: "row2", fields: ["gender", "aaparNo", ""] },
  { id: "row3", fields: ["dob", "aadharCardNo", "quotaAdmissionReferredBy"] },
  { id: "row4", fields: ["employeeId", "admissionType", "foodType"] },
  { id: "row5", fields: ["bloodGroup", "caste", "religion"] },
];
 
export const personalInfoFastSaleFieldsLayout = [
  { id: "row1", fields: ["firstName", "surName", ""] },
  { id: "row2", fields: ["gender", "aaparNo", ""] },
  { id: "row3", fields: ["dob", "aadharCardNo", "quotaAdmissionReferredBy"] },
  { id: "row4", fields: ["employeeId", "admissionType", ""] },
];
 
export const personalInfoFieldsLayoutForSchool = [
  { id: "row1", fields: ["firstName", "surName", ""] },
  { id: "row2", fields: ["gender", "aaparNo", ""] },
  { id: "row3", fields: ["dob", "aadharCardNo", "quotaAdmissionReferredBy"] },
  { id: "row4", fields: ["employeeId", "admissionType", "proReceiptNo"] },
];
 
 