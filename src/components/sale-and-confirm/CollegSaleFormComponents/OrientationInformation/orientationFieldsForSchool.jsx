export const orientationInfoFieldsForSchool =[
  {
    name: "academicYear",
    label: "Academic Year",
    type: "text",
    disabled: true,
    placeholder: "Academic Year",
  },
   {
    name:"studentType",
    label:"Student Type",
    options:[],
    required: true,
  },
  {
    name:"joiningClass",
    label:"Joining Class",
    options:[],
    required: true,
  },
  {
    name:"orientationName",
    label:"Orientation Name",
    options:[],
    required: true,
  },
  {
    name: "branchName",
    label: "Branch Name",
    type: "text",
    disabled: true,
    placeholder: "Enter Branch Name",
  },
  {
    name: "branchType",
    label: "Branch Type",
    type: "text",
    disabled: true,
    placeholder: "Enter Branch Type",
  },
  {
    name: "orientationCity",
    label: "City",
    type: "text",
    disabled: true,
    placeholder: "City",
  },
  {
    name: "orientationFee",
    label: "Course Fee",
    type: "text",
      readOnly: true,
  disabled: false,
    placeholder: "Course Fee",
  },
]
 
export const orientationInfoFieldsLayoutForSchool = [
    {id:"row1", fields:["academicYear","orientationCity","branchName"]},
    {id:"row2", fields:["joiningClass","orientationName","studentType"]},
    {id:"row3", fields:["orientationFee","",""]},
]
 