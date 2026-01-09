import * as Yup from "yup";
 
// ---------------------- REGEX ---------------------- //
const onlyLettersSingleSpace = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
 
const emailRegex =
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;
 
const aaparRegex = /^(?!0)[0-9]{12}$/;
const aadharRegex = /^[2-9]{1}[0-9]{11}$/;
 
const doorNoRegex = /^[A-Za-z0-9\-\/#& ]+$/;
const areaRegex = /^[A-Za-z0-9 ,]+$/;
 
const digitsOnlyRegex = /^[0-9]+$/;
const noSpecialNoDigitsRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
 
// 3+ AGE CHECK
const MIN_AGE = 15;
const validateAge15Plus = (date) => {
  if (!date) return false;
  const dob = new Date(date);
  const today = new Date();
 
  // 1. Prevent future dates immediately
  if (dob > today) return false;
 
  // 2. Calculate age
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
 
  // Adjust age if the birthday hasn't occurred yet this year
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
 
  return age >= MIN_AGE;
};
 
const collegeFastSaleValidationSchema = (maxConcessionLimit) =>
  Yup.object().shape({
    // ===================================================
    // PERSONAL INFORMATION
    // ===================================================
    firstName: Yup.string()
      .trim()
      .required("First Name is required")
      .matches(onlyLettersSingleSpace, "Only alphabets allowed, single space only"),
 
    surName: Yup.string()
      .trim()
      .matches(onlyLettersSingleSpace, "Only alphabets allowed, single space only")
      .required("Sur/Last Name is required")
      .nullable(),
 
    gender: Yup.string().required("Gender is required"),
 
    aaparNo: Yup.string()
      .nullable()
      .test(
        "aaparCheck",
        "Aapar must be 12 digits and cannot start with 0",
        (val) => !val || aaparRegex.test(val)
      )
      .required("Aapar Number is required"),
 
    dob: Yup.date()
      .required("Date of birth is required")
      .test("ageCheck", "Must be 3 years or above", validateAge15Plus),
 
    aadharCardNo: Yup.string()
      .required("Aadhar Number is required")
      .matches(/^[0-9]{12}$/, "Aadhar must be 12 digits")
      .matches(aadharRegex, "Invalid Aadhar number"),
 
    quotaAdmissionReferredBy: Yup.string().nullable().required("Quota/Admission is required"),
 
    employeeId: Yup.string()
      .nullable()
      .when("quotaAdmissionReferredBy", {
        is: (val) => val === "Staff",
        then: (schema) => schema.required("Employee ID is required for Staff quota"),
      }),
 
    admissionType: Yup.string().required("Admission type is required"),
 
    // ===================================================
    // PARENT INFORMATION
    // ===================================================
    fatherName: Yup.string()
      .trim()
      .matches(onlyLettersSingleSpace, "Only alphabets allowed, single space only")
      .nullable()
      .required("Father Name is required"),
 
    // mobileNumber: Used in some forms (deprecated, use fatherMobile)
    // mobileNumber: Yup.string().nullable(),
    // fatherMobile: Used in school and college forms for parent mobile number (required)
    fatherMobile: Yup.string()
      .required("Mobile Number is required")
      .matches(/^[6-9]\d{9}$/, "Mobile Number must start with 6, 7, 8, or 9 and be exactly 10 digits"),

    fatherEmail: Yup.string()
      .trim()
      .required("Father email is required")
      .matches(emailRegex, "Please enter a valid email address"),

    motherName: Yup.string()
      .trim()
      .matches(onlyLettersSingleSpace, "Only alphabets allowed, single space only")
      .nullable()
      .required("Mother Name is required"),

    motherMobile: Yup.string()
      .required("Mobile Number is required")
      .matches(/^[6-9]\d{9}$/, "Mobile number must start with 6, 7, 8, or 9 and be exactly 10 digits"),

    motherEmail: Yup.string()
      .trim()
      .nullable()
      .test(
        "email-format",
        "Please enter a valid email address",
        function(value) {
          // If empty/null/undefined, it's valid (optional field)
          if (!value || (typeof value === 'string' && value.trim() === "")) {
            return true;
          }
          // If has value, validate email format
          const trimmedValue = typeof value === 'string' ? value.trim() : String(value);
          return emailRegex.test(trimmedValue);
        }
      ),

    fatherSector: Yup.string()
      .nullable()
      .required("Father sector is required"),

    fatherOccupation: Yup.string()
      .nullable()
      .required("Father occupation is required"),

    motherSector: Yup.string()
      .nullable()
      .required("Mother sector is required"),

    motherOccupation: Yup.string()
      .nullable()
      .required("Mother occupation is required"),

    fatherOther: Yup.string()
      .nullable()
      .when(["fatherSector", "fatherOccupation"], {
        is: (sector, occupation) => sector === "Others" && occupation === "Others",
        then: (schema) => schema.required("Other field is required when sector and occupation are Others"),
      }),

    motherOther: Yup.string()
      .nullable()
      .when(["motherSector", "motherOccupation"], {
        is: (sector, occupation) => sector === "Others" && occupation === "Others",
        then: (schema) => schema.required("Other field is required when sector and occupation are Others"),
      }),

    // ===================================================
    // ORIENTATION INFORMATION
    // ===================================================
    // city: Now only used for Address Information (nullable)
    // city: Yup.string().nullable(),
    // orientationCity: Used for Orientation Information (required for both school and college)
    orientationCity: Yup.string().required("City is required"),
    campusName: Yup.string().required("Branch is required"),
    joiningClass: Yup.string().required("Joining class is required"),
    orientationName: Yup.string().required("Course name is required"),
    studentType: Yup.string().required("Student type is required"),
 
    // academicYear: Yup.string().nullable(),
    // orientationStartDate: Yup.string().nullable(),
    // orientationEndDate: Yup.string().nullable(),
    // orientationFee: Yup.string().nullable(),
    // orientationBatch: Yup.string().nullable(),
 
    // ===================================================
    // ADDRESS INFORMATION
    // ===================================================
    doorNo: Yup.string().nullable().required("Door number is required").matches(doorNoRegex, "Only letters, numbers and - / # & allowed"),
 
    streetName: Yup.string()
      .nullable()
      .matches(/^[A-Za-z ]+$/, "Only alphabets allowed")
      .max(20, "Maximum 20 characters allowed")
      .required("Street Name is required"),
 
    landmark: Yup.string()
      .nullable()
      .matches(/^[A-Za-z ]+$/, "Only alphabets allowed")
      .max(20, "Maximum 20 characters allowed"),
 
    area: Yup.string().nullable().matches(areaRegex, "Only letters, numbers and comma allowed"),
 
    pincode: Yup.string()
      .required("Pincode is required")
      .matches(/^[0-9]{6}$/, "Pincode must be 6 digits")
      .required("Pincode is required"),
 
    state: Yup.string(),
    district: Yup.string(),
    mandal: Yup.string().required("Mandal is required"),
    city: Yup.string().required("City is required"),
    gpin: Yup.string().nullable(),
  });
 
export default collegeFastSaleValidationSchema;
 