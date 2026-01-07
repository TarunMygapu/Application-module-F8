export const orientationInfoFields = [
  {
    name: "academicYear",
    label: "Academic Year",
    type: "text",
      readOnly: true,
  disabled: false,
    placeholder: "Academic Year",
  },
  {
    name: "campusName",
    label: "Branch Name",
    options: [], // dynamic will replace
    required: true,
  },
  {
    name: "branchType",
    label: "Branch Type",
    options: [],
    required: true,
  },
  {
    name: "orientationCity",
    label: "City",
    options: [], // dynamic will replace
    required: true,
  },
  {
    name: "joiningClass",
    label: "Joining Class",
    options: [], // dynamic will replace
    required: true,
  },
  {
    name: "orientationName",
    label: "Course Name",
    options: [], // dynamic will replace
    required: true,
  },
  {
    name: "studentType",
    label: "Student Type",
    options: [], // dynamic will replace
    required: true,
  },
  {
    name: "orientationStartDate",
    label: "Course Start Date",
    type: "text",
      readOnly: true,
  disabled: false,
    placeholder: "Course Start Date",
  },
  {
    name: "orientationEndDate",
    label: "Course End Date",
    type: "text",
      readOnly: true,
  disabled: false,
    placeholder: "Course End Date",
  },
  {
    name: "orientationFee",
    label: "Course Fee",
    type: "text",
      readOnly: true,
  disabled: false,
    placeholder: "Course Fee",
  },
  {
    name: "orientationBatch",
    label: "Orientation Batch",
    options: ["Type-1", "Type-2"],
  },
];
 
export const orientationInfoFieldsLayout = [
  { id: "row1", fields: ["academicYear", "orientationCity", "campusName"] },
  { id: "row2", fields: ["joiningClass", "orientationName", "studentType"] },
  { id: "row3", fields: ["orientationStartDate", "orientationEndDate", "orientationFee"] },
];
 
 