import * as Yup from "yup";

// ---------------------- REGEX PATTERNS ---------------------- //
// Only alphabets and single spaces allowed (e.g., "John Doe", "Mary Jane")
const onlyLettersSingleSpace = /^[A-Za-z]+(?: [A-Za-z]+)*$/;

// Valid email format (e.g., "user@example.com")
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;

// Phone number: Must start with 6, 7, 8, or 9 and be exactly 10 digits (e.g., "9876543210")
const phoneRegex = /^[6-9]\d{9}$/;

// Only digits allowed (e.g., "12345", "9876543210")
const digitsOnlyRegex = /^[0-9]+$/;

// Only alphabets and single spaces, no digits or special characters (e.g., "Reason Text")
const noSpecialNoDigitsRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/;

/**
 * School Sale Confirmation Validation Schema
 * Validates parent information, academic information, language information, concession information, and siblings
 */
const schoolSaleConfValidationSchema = (maxConcessionLimit = 999999) =>
  Yup.object().shape({
    // ===================================================
    // PARENT INFORMATION - FATHER
    // ===================================================
    // Father Name: Required, must be alphabets only with single spaces, max 20 characters
    fatherName: Yup.string()
      .required("Father Name is required")
      .trim()
      .max(20, "Father Name must not exceed 20 characters")
      .matches(onlyLettersSingleSpace, "Only alphabets allowed, single space only"),

    // Father Phone: Required, must be valid 10-digit phone starting with 6-9
    fatherPhone: Yup.string()
      .required("Phone number is required")
      .matches(phoneRegex, "Phone number must start with 6, 7, 8, or 9 and be exactly 10 digits"),

    // Father Email: Required, must be valid email format
    fatherEmail: Yup.string()
      .required("Email is required")
      .trim()
      .matches(emailRegex, "Please enter a valid email address"),

    // Father Sector: Required dropdown selection
    fatherSector: Yup.string()
      .required("Sector is required")
      .nullable(),

    // Father Occupation: Required dropdown selection
    fatherOccupation: Yup.string()
      .required("Occupation is required")
      .nullable(),

    // Father Other Occupation: Required only if sector is "Other"
    fatherOtherOccupation: Yup.string()
      .nullable()
      .when("fatherSector", {
        is: (val) => val === "Other",
        then: (schema) => schema.required("Other occupation is required when sector is Other"),
      }),

    // ===================================================
    // PARENT INFORMATION - MOTHER
    // ===================================================
    // Mother Name: Required, must be alphabets only with single spaces, max 20 characters
    motherName: Yup.string()
      .required("Mother Name is required")
      .trim()
      .max(20, "Mother Name must not exceed 20 characters")
      .matches(onlyLettersSingleSpace, "Only alphabets allowed, single space only"),

    // Mother Phone: Required, must be valid 10-digit phone starting with 6-9
    motherPhone: Yup.string()
      .required("Phone number is required")
      .matches(phoneRegex, "Phone number must start with 6, 7, 8, or 9 and be exactly 10 digits"),

    // Mother Email: Required, must be valid email format
    motherEmail: Yup.string()
      .required("Email is required")
      .trim()
      .matches(emailRegex, "Please enter a valid email address"),

    // Mother Sector: Required dropdown selection
    motherSector: Yup.string()
      .required("Sector is required")
      .nullable(),

    // Mother Occupation: Required dropdown selection
    motherOccupation: Yup.string()
      .required("Occupation is required")
      .nullable(),

    // Mother Other Occupation: Required only if sector is "Other"
    motherOtherOccupation: Yup.string()
      .nullable()
      .when("motherSector", {
        is: (val) => val === "Other",
        then: (schema) => schema.required("Other occupation is required when sector is Other"),
      }),

    // ===================================================
    // ACADEMIC INFORMATION
    // ===================================================
    // Orientation Name: Required dropdown selection
    orientationName: Yup.string()
      .required("Orientation Name is required"),

    // Orientation Fee: Required field, must contain only digits
    orientationFee: Yup.string()
      .required("Orientation Fee is required")
      .matches(digitsOnlyRegex, "Orientation Fee must contain digits only"),

    // Score App No: Required field, must contain only digits
    scoreAppNo: Yup.string()
      .required("Score App No is required")
      .matches(digitsOnlyRegex, "Score App No must contain digits only"),

    // Score Marks: Optional field (validation removed)
    scoreMarks: Yup.string().nullable(),

    // Food Type: Required dropdown selection
    foodType: Yup.string()
      .required("Food Type is required"),

    // Blood Group: Required dropdown selection
    bloodGroup: Yup.string()
      .required("Blood Group is required"),

    // Caste: Required dropdown selection
    caste: Yup.string()
      .required("Caste is required"),

    // Religion: Required dropdown selection
    religion: Yup.string()
      .required("Religion is required"),

    // ===================================================
    // LANGUAGE INFORMATION
    // ===================================================
    // First Language: Required dropdown selection
    firstLanguage: Yup.string()
      .required("1st Language is required")
      .nullable(),

    // Second Language: Required dropdown selection
    secondLanguage: Yup.string()
      .required("2nd Language is required")
      .nullable(),

    // Third Language: Required dropdown selection
    thirdLanguage: Yup.string()
      .required("3rd Language is required")
      .nullable(),

    // ===================================================
    // CONCESSION INFORMATION
    // ===================================================
    // Admission Concession: Optional, must be digits only, total concessions cannot exceed max limit or orientation fee
    admissionConcession: Yup.string()
      .nullable()
      .matches(digitsOnlyRegex, "Admission Concession must contain digits only")
      .test(
        "concession-sum-check",
        `Total concession cannot exceed ${maxConcessionLimit}`,
        function () {
          const admission = Number(this.parent.admissionConcession || 0);
          const tuition = Number(this.parent.tuitionConcession || 0);
          return admission + tuition <= maxConcessionLimit;
        }
      )
      .test(
        "concession-exceeds-fee",
        "Total concessions cannot exceed orientation fee",
        function () {
          const orientationFee = Number(this.parent.orientationFee || 0);
          const admission = Number(this.parent.admissionConcession || 0);
          const tuition = Number(this.parent.tuitionConcession || 0);
          const totalConcessions = admission + tuition;
          
          // If orientation fee is not provided or is 0, skip this validation
          if (orientationFee <= 0) return true;
          
          return totalConcessions <= orientationFee;
        }
      ),

    // Admission Concession Type ID: Optional, stores the concession type ID
    admissionConcessionTypeId: Yup.string().nullable(),

    // Tuition Concession: Optional, must be digits only, total concessions cannot exceed max limit or orientation fee
    tuitionConcession: Yup.string()
      .nullable()
      .matches(digitsOnlyRegex, "Tuition Concession must contain digits only")
      .test(
        "concession-sum-check",
        `Total concession cannot exceed ${maxConcessionLimit}`,
        function () {
          const admission = Number(this.parent.admissionConcession || 0);
          const tuition = Number(this.parent.tuitionConcession || 0);
          return admission + tuition <= maxConcessionLimit;
        }
      )
      .test(
        "concession-exceeds-fee",
        "Total concessions cannot exceed orientation fee",
        function () {
          const orientationFee = Number(this.parent.orientationFee || 0);
          const admission = Number(this.parent.admissionConcession || 0);
          const tuition = Number(this.parent.tuitionConcession || 0);
          const totalConcessions = admission + tuition;
          
          // If orientation fee is not provided or is 0, skip this validation
          if (orientationFee <= 0) return true;
          
          return totalConcessions <= orientationFee;
        }
      ),

    // Tuition Concession Type ID: Optional, stores the concession type ID
    tuitionConcessionTypeId: Yup.string().nullable(),

    // Referred By: Required if any concession amount is entered, otherwise optional
    referredBy: Yup.string()
      .nullable()
      .when(["admissionConcession", "tuitionConcession"], {
        is: (admission, tuition) => {
          const admissionAmount = Number(admission || 0);
          const tuitionAmount = Number(tuition || 0);
          return admissionAmount > 0 || tuitionAmount > 0;
        },
        then: (schema) => schema.required("Referred by is required when concession amount is entered"),
      }),

    // Concession Description: Optional, must be alphabets only with single spaces
    concessionDescription: Yup.string()
      .nullable()
      .matches(noSpecialNoDigitsRegex, "Only alphabets allowed, single space only"),

    // Concession Reason: Required if any concession amount is entered, must be alphabets only
    concessionReason: Yup.string()
      .nullable()
      .matches(noSpecialNoDigitsRegex, "Only alphabets allowed, single space only")
      .when(["admissionConcession", "tuitionConcession"], {
        is: (admission, tuition) => {
          const admissionAmount = Number(admission || 0);
          const tuitionAmount = Number(tuition || 0);
          return admissionAmount > 0 || tuitionAmount > 0;
        },
        then: (schema) => schema.required("Concession Reason is required when concession amount is entered"),
      }),

    // Authorized By: Required if any concession amount is entered, otherwise optional
    authorizedBy: Yup.string()
      .nullable()
      .when(["admissionConcession", "tuitionConcession"], {
        is: (admission, tuition) => {
          const admissionAmount = Number(admission || 0);
          const tuitionAmount = Number(tuition || 0);
          return admissionAmount > 0 || tuitionAmount > 0;
        },
        then: (schema) => schema.required("Authorized by is required when concession amount is entered"),
      }),

    // ===================================================
    // SIBLINGS INFORMATION
    // ===================================================
    // Siblings Array: Each sibling object must have all required fields
    siblings: Yup.array().of(
      Yup.object().shape({
        // Sibling ID: Required unique identifier for each sibling
        id: Yup.number().required(),

        // Sibling Name: Required, must be alphabets only with single spaces
        siblingName: Yup.string()
          .trim()
          .required("Full Name is required")
          .matches(onlyLettersSingleSpace, "Only alphabets allowed, single space only"),

        // Sibling Relation: Required dropdown selection (relation type)
        siblingRelation: Yup.string().required("Relation Type is required"),

        // Sibling Class: Required dropdown selection (class)
        siblingClass: Yup.string().required("Class is required"),

        // Sibling School: Required, must be alphabets only with single spaces
        siblingSchool: Yup.string()
          .trim()
          .required("Organization Name is required")
          .matches(onlyLettersSingleSpace, "Only alphabets allowed, single space only"),
      })
    ),
  });

export default schoolSaleConfValidationSchema;
