import PhoneNumberBox from "../../../../widgets/PhoneNumber/PhoneNumberBox";
 
export const parentInfoFields =[
 
  // FATHER
  { name: "fatherName", label: "Father Name", type: "text",placeholder:"Enter Father Name", inputRule: "onlyLettersSingleSpace",
    autoCapitalize: true, required: true, },
  { name: "fatherMobile", label: "Mobile Number", component: PhoneNumberBox,required: true, },
  { name: "fatherEmail", label: "Email", type: "text",inputRule: "email",placeholder:"Enter Father Email",required: true,  },
 
  { name: "fatherSector", label: "Sector", options: [], required: true },
  { name: "fatherOccupation", label: "Occupation", options: [], required: true },
  { name: "fatherOther", label: "Other", type: "text",placeholder:"Enter Other",inputRule: "alpha",
    autoCapitalize: true, },
 
  // MOTHER
  { name: "motherName", label: "Mother Name", type: "text",placeholder:"Enter Mother Name", inputRule: "onlyLettersSingleSpace",
    autoCapitalize: true,required: true,},
  { name: "motherMobile", label: "Mobile Number", component: PhoneNumberBox,required: true,},
  { name: "motherEmail", label: "Email", type: "text",inputRule: "email",placeholder:"Enter Mother Email" ,required: true},
 
  { name: "motherSector", label: "Sector", options: [], required: true },
  { name: "motherOccupation", label: "Occupation", options: [], required: true },
  { name: "motherOther", label: "Other", type: "text",placeholder:"Enter Other",inputRule: "alpha",
    autoCapitalize: true, },
 
];
 
 
export const siblingsInformationFields=[
   {
    name: "fullName",
    label: "Full Name",
    type: "text",
    disabled: false,
    inputRule: "onlyLettersSingleSpace",
    placeholder: "Enter Full Name",
    autoCapitalize: true,
    required: true,
  },
   {
    name:"relationType",
    label:"Relation Type",
    options:[],
    required: true,
  },
   {
    name:"selectClass",
    label:"Select Class",
    options:[],
    required: true,
  },
   {
    name: "schoolName",
    label: "Organization Name",
    type: "text",
    disabled: false,
    inputRule: "none",
    autoCapitalize: true,
    placeholder: "Enter School Name",
    required: true,
  },
]
 
export const parentInfoFieldsLayout = [
 
  // FATHER
  { id: "row1", fields: ["fatherName", "fatherMobile", "fatherEmail"] },
  { id: "row2", fields: ["fatherSector", "fatherOccupation", "fatherOther"] },
 
  // MOTHER
  { id: "row3", fields: ["motherName", "motherMobile", "motherEmail"] },
  { id: "row4", fields: ["motherSector", "motherOccupation", "motherOther"] },
 
];
 
export const siblingFieldsLayout = [
  {id:"row1", fields:["fullName","relationType","selectClass"]},
  {id:"row2", fields:["schoolName","",""]}
]
 
export const parentInfoFieldsLayoutForSchool = [
  {id:"row1", fields: ["fatherName","fatherMobile",""]}
]