import SearchboxWithLabel from "../../../../../widgets/Searchbox/SearchboxWithLabel";
 
export const addressInformationFields = [
  {
    name: "doorNo",
    label: "Door No",
    type: "text",
    disabled: false,
    inputRule:"doorNo",
    maxLength:"10",
    placeholder: "Enter Door No",
    required: true,
  },
  {
    name: "streetName",
    label: "Street Name",
    type: "text",
    disabled: false,
    inputRule:"address",
    maxLength:"25",
    placeholder: "Enter Street Name",
    required: true,
  },
  {
    name: "landmark",
    label: "Landmark",
    type: "text",
    disabled: false,
     inputRule:"address",
    maxLength:"25",
    placeholder: "Enter Landmark",
  },
  {
    name: "area",
    label: "Area",
    type: "text",
    disabled: false,
     inputRule:"address",
    maxLength:"25",
    placeholder: "Enter Area",
  },
  {
    name: "pincode",
    label: "Pincode",
    type: "text",
    disabled: false,
    placeholder: "Enter Pincode",
    required: true,
    inputRule:"digits",
  },
  {
    name: "state",
    label: "State",
    type: "text",
    readOnly: true,
    disabled: false,
    placeholder: "Enter State",
  },
  {
    name: "district",
    label: "District",
    type: "text",
    readOnly: true,
    disabled: false,
    placeholder: "Enter District",
  },
  {
    name: "mandal",
    label: "Mandal",
    options: [],
    required: true,
  },
  {
    name: "city",
    label: "City",
    options: [],
    required: true,
  },
  {
    name: "gpin",
    label: "G-pin (Lattitude & Longitude)",
    component: SearchboxWithLabel,
    placeholder: "Search for Address",
  },
];
 
export const addressInformationFieldsLayout = [
  { id: "row1", fields: ["doorNo", "streetName", "landmark"] },
  { id: "row2", fields: ["area", "pincode", "state"] },
  { id: "row3", fields: ["district", "mandal", "city"] },
  { id: "row4", fields: ["gpin", "", ""] },
];
 
 