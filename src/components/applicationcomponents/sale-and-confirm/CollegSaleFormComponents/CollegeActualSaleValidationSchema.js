import * as Yup from "yup";

// ---------------------- REGEX ---------------------- //
const onlyLettersSingleSpace = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;
const aaparRegex = /^(?!0)[0-9]{12}$/;
const aadharRegex = /^[2-9]{1}[0-9]{11}$/;
const doorNoRegex = /^[A-Za-z0-9\-\/#& ]+$/;
const areaRegex = /^[A-Za-z0-9 ,]+$/;
const digitsOnlyRegex = /^[0-9]+$/;
const noSpecialNoDigitsRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/;

// ---------------------- HELPER FUNCTION ---------------------- //
// Parse formatted numbers (with commas) to plain numbers
const parseFormattedNumber = (value) => {
  if (!value) return 0;
  // Remove all commas and convert to number
  const cleaned = String(value).replace(/,/g, "");
  return Number(cleaned) || 0;
};

// ---------------------- AGE CHECK ---------------------- //
const MIN_AGE = 15;
const validateAge15Plus = (date) => {
  if (!date) return false;
  const dob = new Date(date);
  const today = new Date();
  const age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  return age > MIN_AGE || (age === MIN_AGE && m >= 0);
};

// =====================================================
// MAIN VALIDATION SCHEMA
// =====================================================
const clgActualSaleValidationSchema = () =>
  Yup.object().shape({

    // ===================================================
    // PERSONAL INFORMATION
    // ===================================================
    firstName: Yup.string()
      .trim()
      .required("First Name is required")
      .matches(onlyLettersSingleSpace, "Only alphabets allowed"),

    surName: Yup.string()
      .trim()
      .required("Sur/Last Name is required")
      .matches(onlyLettersSingleSpace, "Only alphabets allowed"),

    gender: Yup.string().required("Gender is required"),

    aaparNo: Yup.string()
      .required("Aapar Number is required")
      .test(
        "aaparCheck",
        "Aapar must be 12 digits and cannot start with 0",
        (val) => !val || aaparRegex.test(val)
      ),

    dob: Yup.date()
      .required("Date of birth is required")
      .test("ageCheck", "Must be 15 years or above", validateAge15Plus),

    aadharCardNo: Yup.string()
      .required("Aadhar Number is required")
      .matches(/^[0-9]{12}$/, "Aadhar must be 12 digits")
      .matches(aadharRegex, "Invalid Aadhar number"),

    quotaAdmissionReferredBy: Yup.string().required("Quota is required"),

    employeeId: Yup.string()
      .nullable()
      .when("quotaAdmissionReferredBy", {
        is: "Staff",
        then: (s) => s.required("Employee ID is required for Staff Quota"),
      }),

    admissionType: Yup.string().required("Admission type is required"),

    foodType: Yup.string()
      .nullable()
      .required("Food Type is required"),

    bloodGroup: Yup.string()
      .nullable()
      .required("Blood Group is required"),

    caste: Yup.string()
      .nullable()
      .required("Caste is required"),

    religion: Yup.string()
      .nullable()
      .required("Religion is required"),

    // ===================================================
    // PARENT INFORMATION
    // ===================================================
    fatherName: Yup.string()
      .trim()
      .required("Father Name is required")
      .matches(onlyLettersSingleSpace, "Only alphabets allowed"),

    fatherMobile: Yup.string()
      .required("Mobile Number is required")
      .matches(/^[6-9]\d{9}$/, "Invalid mobile number"),

    motherName: Yup.string()
      .trim()
      .required("Mother Name is required")
      .matches(onlyLettersSingleSpace, "Only alphabets allowed"),

    motherMobile: Yup.string()
      .required("Mobile Number is required")
      .matches(/^[6-9]\d{9}$/, "Invalid mobile number"),

    fatherEmail: Yup.string()
      .trim()
      .required("Father Email is required")
      .matches(emailRegex, "Please enter a valid email address"),

    motherEmail: Yup.string()
      .trim()
      .nullable()
      .test(
        "email-format",
        "Please enter a valid email address",
        function (value) {
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
      .required("Father Sector is required"),

    fatherOccupation: Yup.string()
      .nullable()
      .required("Father Occupation is required"),

    motherSector: Yup.string()
      .nullable()
      .required("Mother Sector is required"),

    motherOccupation: Yup.string()
      .nullable()
      .required("Mother Occupation is required"),

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
        then: (schema) => schema.required("Other Field is required when Sector and Occupation are Others"),
      }),

    // ===================================================
    // ORIENTATION INFORMATION
    // ===================================================
    orientationCity: Yup.string().required("City is required"),
    branchName: Yup.string().nullable(),
    joiningClass: Yup.string().required("Joining Class is required"),
    orientationName: Yup.string().required("Course Name is required"),
    studentType: Yup.string().required("Student Type is required"),

    academicYear: Yup.string().nullable(),
    orientationStartDate: Yup.string().nullable(),
    orientationEndDate: Yup.string().nullable(),
    orientationFee: Yup.string().nullable(),

    // ===================================================
    // ADDRESS INFORMATION
    // ===================================================
    doorNo: Yup.string()
      .required("Door Number is required")
      .matches(doorNoRegex, "Invalid door number"),

    streetName: Yup.string()
      .required("Street Name is required")
      .max(100),

    landmark: Yup.string()
      .nullable()
      .max(100),

    area: Yup.string().nullable(),

    pincode: Yup.string()
      .required("Pincode is required")
      .matches(/^[0-9]{6}$/, "Pincode must be 6 digits"),

    state: Yup.string().nullable(),
    district: Yup.string().nullable(),
    mandal: Yup.string().required("Mandal is required"),
    city: Yup.string().required("City is required"),

    // ===================================================
    // CONCESSION INFORMATION (🔥 LIVE VALIDATION)
    // ===================================================
    firstYearConcession: Yup.string()
      .nullable()
      .matches(digitsOnlyRegex, "Only digits allowed")
      .test(
        "first-year-concession-check",
        function (value) {
          const { orientationFee } = this.parent;

          // Use the current value parameter, not this.parent.firstYearConcession
          // This ensures we validate the actual current value, not a stale value
          const first = parseFormattedNumber(value);
          const fee = parseFormattedNumber(orientationFee);

          // Skip until fee is available
          if (!fee || fee <= 0) {
            return true;
          }

          // Skip if value is empty/null
          if (!value || first === 0) {
            return true;
          }

          // Check if 1st year concession individually exceeds course fee
          if (first > fee) {
            return this.createError({
              message: `1st Year Concession (${first}) cannot exceed Course Fee (${fee})`,
            });
          }

          return true;
        }
      ),

    secondYearConcession: Yup.string()
      .nullable()
      .matches(digitsOnlyRegex, "Only digits allowed")
      .test(
        "second-year-concession-check",
        function (value) {
          const { orientationFee } = this.parent;

          // Use the current value parameter, not this.parent.secondYearConcession
          // This ensures we validate the actual current value, not a stale value
          const second = parseFormattedNumber(value);
          const fee = parseFormattedNumber(orientationFee);

          // Skip until fee is available
          if (!fee || fee <= 0) return true;

          // Skip if value is empty/null
          if (!value || second === 0) return true;

          // Check if 2nd year concession individually exceeds course fee
          if (second > fee) {
            return this.createError({
              message: `2nd Year Concession (${second}) cannot exceed Course Fee (${fee})`,
            });
          }
          return true;
        }
      ),

    extraConcession: Yup.string()
      .nullable()
      .matches(digitsOnlyRegex, "Only digits allowed")
      .test(
        "total-concession-check",
        function (value) {
          const {
            firstYearConcession,
            secondYearConcession,
            extraConcession,
            orientationFee,
          } = this.parent;

          const first = parseFormattedNumber(firstYearConcession);
          const second = parseFormattedNumber(secondYearConcession);
          const extra = parseFormattedNumber(extraConcession);
          const fee = parseFormattedNumber(orientationFee);

          // Skip until fee is available
          if (!fee || fee <= 0) return true;

          const total1 = first + extra;
          const total2 = second + extra

          if (total1 > fee && second > fee) {
            return this.createError({
              message: `Total of 1st Year Concession (${first}) + Extra Concession (${extra}) = ${total1} cannot exceed Course Fee (${fee})`,
            });
          }
          return true;
        }
      ),

    // Concession Amount (in "Concession Written on Application") - should not exceed Course Fee
    // If INTER2 is selected (1st year hidden), validate against 2nd Year Concession
    // If 1st year is visible, validate against 1st Year Concession
    concessionAmount: Yup.string()
      .nullable()
      .matches(digitsOnlyRegex, "Only digits allowed")
      .test(
        "concession-amount-check",
        function (value) {
          const { orientationFee, firstYearConcession, secondYearConcession, joiningClass } = this.parent;

          // Skip if concessionAmount is empty
          if (!value || value.trim() === "") return true;

          const concessionAmountValue = parseFormattedNumber(value);
          const fee = parseFormattedNumber(orientationFee);

          // Skip if Course Fee is not available
          if (!fee || fee <= 0) return true;

          // Check if joining class is INTER2 (normalize to handle variations)
          const normalizedJoiningClass = joiningClass 
            ? String(joiningClass).toUpperCase().trim().replace(/\s+/g, "").replace(/-/g, "").replace(/_/g, "")
            : "";
          const isInter2 = normalizedJoiningClass === "INTER2" || normalizedJoiningClass.includes("INTER2");

          // Check if concessionAmount individually exceeds Course Fee
          if (concessionAmountValue > fee) {
            return this.createError({
              message: `Concession Amount (${concessionAmountValue}) cannot exceed Course Fee (${fee})`,
            });
          }

          // If INTER2 is selected (1st year hidden), validate against 2nd Year Concession
          if (isInter2) {
            const secondYearConcessionValue = parseFormattedNumber(secondYearConcession) || 0;
            const total = secondYearConcessionValue + concessionAmountValue;
            if (total > fee) {
              return this.createError({
                message: `Total of 2nd Year Concession (${secondYearConcessionValue}) + Concession Amount (${concessionAmountValue}) = ${total} cannot exceed Course Fee (${fee})`,
              });
            }
          } else {
            // If 1st year is visible, validate against 1st Year Concession (original behavior)
            const firstYearConcessionValue = parseFormattedNumber(firstYearConcession) || 0;
            const total = firstYearConcessionValue + concessionAmountValue;
            if (total > fee) {
              return this.createError({
                message: `Total of 1st Year Concession (${firstYearConcessionValue}) + Concession Amount (${concessionAmountValue}) = ${total} cannot exceed Course Fee (${fee})`,
              });
            }
          }
          return true;
        }
      ),

    referredBy: Yup.string()
      .nullable()
      .when(["firstYearConcession", "secondYearConcession", "extraConcession"], {
        is: (f, s, e) => !!f || !!s || !!e,
        then: (schema) => schema.required("Referred by is required when concession amount is entered"),
      }),

    concessionReason: Yup.string()
      .nullable()
      .when(["firstYearConcession", "secondYearConcession", "extraConcession"], {
        is: (f, s, e) => !!f || !!s || !!e,
        then: (schema) => schema.required("Concession Reason is required when concession amount is entered"),
      }),

    authorizedBy: Yup.string()
      .nullable()
      .when(["firstYearConcession", "secondYearConcession", "extraConcession"], {
        is: (f, s, e) => !!f || !!s || !!e,
        then: (schema) => schema.required("Authorized by is required when concession amount is entered"),
      }),

    description: Yup.string()
      .nullable()
      .matches(noSpecialNoDigitsRegex, "Only alphabets allowed, single space only")
      .when(["firstYearConcession", "secondYearConcession", "extraConcession"], {
        is: (f, s, e) => !!f || !!s || !!e,
        then: (schema) => schema.required("Description is required when concession amount is entered"),
      }),

    // ===================================================
    // ACADEMIC INFORMATION
    // ===================================================
    // Conditional validation based on joiningClass
    // INTER1 or empty: require hallTicketNo, schoolState, schoolDistrict, schoolType, schoolName
    // INTER2: require tenthHallTicketNo, clgState, clgDistrict, clgType, collegeName
    // LONG_TERM/SHORT_TERM: require interHallTicketNo, clgState, clgDistrict, clgType, collegeName
    hallTicketNo: Yup.string().when("joiningClass", {
      is: (val) => val === "INTER1" || !val || val === "",
      then: (s) => s.required("Hall Ticket No is required"),
      otherwise: (s) => s.nullable(),
    }),

    schoolState: Yup.string().when("joiningClass", {
      is: (val) => val === "INTER1" || !val || val === "",
      then: (s) => s.required("School State is required"),
      otherwise: (s) => s.nullable(),
    }),

    schoolDistrict: Yup.string().when("joiningClass", {
      is: (val) => val === "INTER1" || !val || val === "",
      then: (s) => s.required("School District is required"),
      otherwise: (s) => s.nullable(),
    }),

    schoolType: Yup.string().when("joiningClass", {
      is: (val) => val === "INTER1" || !val || val === "",
      then: (s) => s.required("School Type is required"),
      otherwise: (s) => s.nullable(),
    }),

    schoolName: Yup.string().when("joiningClass", {
      is: (val) => val === "INTER1" || !val || val === "",
      then: (s) => s.required("School Name is required"),
      otherwise: (s) => s.nullable(),
    }),

    // INTER2 fields
    tenthHallTicketNo: Yup.string().when("joiningClass", {
      is: "INTER2",
      then: (s) => s.required("10th Hall Ticket No is required"),
      otherwise: (s) => s.nullable(),
    }),

    interFirstYearHallTicketNo: Yup.string().nullable(),

    clgState: Yup.string().when("joiningClass", {
      is: (val) => val === "INTER2" || val === "LONG_TERM" || val === "SHORT_TERM",
      then: (s) => s.required("College State is required"),
      otherwise: (s) => s.nullable(),
    }),

    clgDistrict: Yup.string().when("joiningClass", {
      is: (val) => val === "INTER2" || val === "LONG_TERM" || val === "SHORT_TERM",
      then: (s) => s.required("College District is required"),
      otherwise: (s) => s.nullable(),
    }),

    clgType: Yup.string().when("joiningClass", {
      is: (val) => val === "INTER2" || val === "LONG_TERM" || val === "SHORT_TERM",
      then: (s) => s.required("College Type is required"),
      otherwise: (s) => s.nullable(),
    }),

    collegeName: Yup.string().when("joiningClass", {
      is: (val) => val === "INTER2" || val === "LONG_TERM" || val === "SHORT_TERM",
      then: (s) => s.required("College Name is required"),
      otherwise: (s) => s.nullable(),
    }),

    // LONG_TERM/SHORT_TERM fields
    interHallTicketNo: Yup.string().when("joiningClass", {
      is: (val) => val === "LONG_TERM" || val === "SHORT_TERM",
      then: (s) => s.required("Inter Hall Ticket No is required"),
      otherwise: (s) => s.nullable(),
    }),

    // Optional academic fields
    scoreAppNo: Yup.string().nullable(),
    scoreMarks: Yup.string().nullable(),

    // ===================================================
    // SIBLINGS
    // ===================================================
    siblings: Yup.array().of(
      Yup.object().shape({
        fullName: Yup.string()
          .trim()
          .required("Sibling name is required")
          .matches(onlyLettersSingleSpace, "Only alphabets allowed"),

        relationType: Yup.string().required("Relation type is required"),
        selectClass: Yup.string().required("Class is required"),
        schoolName: Yup.string().required("School name is required"),
      })
    ),
  });

// =====================================================
// FAST SALE VALIDATION SCHEMA (Simplified version)
// =====================================================
// This schema is for College Fast Sale form which has fewer fields
// It includes: Personal Info, Parent Info (Father only), Orientation Info, Address Info
// It excludes: Academic Info, Concession Info, Siblings, Mother Info
const clgFastSaleValidationSchema = () =>
  Yup.object().shape({

    // ===================================================
    // PERSONAL INFORMATION
    // ===================================================
    firstName: Yup.string()
      .trim()
      .required("First Name is required")
      .matches(onlyLettersSingleSpace, "Only alphabets allowed"),

    surName: Yup.string()
      .trim()
      .required("Sur/Last Name is required")
      .matches(onlyLettersSingleSpace, "Only alphabets allowed"),

    gender: Yup.string().required("Gender is required"),

    aaparNo: Yup.string()
      .required("Aapar Number is required")
      .test(
        "aaparCheck",
        "Aapar must be 12 digits and cannot start with 0",
        (val) => !val || aaparRegex.test(val)
      ),

    dob: Yup.date()
      .required("Date of birth is required")
      .test("ageCheck", "Must be 15 years or above", validateAge15Plus),

    aadharCardNo: Yup.string()
      .required("Aadhar Number is required")
      .matches(/^[0-9]{12}$/, "Aadhar must be 12 digits")
      .matches(aadharRegex, "Invalid Aadhar number"),

    quotaAdmissionReferredBy: Yup.string().required("Quota is required"),

    employeeId: Yup.string()
      .nullable()
      .when("quotaAdmissionReferredBy", {
        is: "Staff",
        then: (s) => s.required("Employee ID is required for Staff Quota"),
      }),

    admissionType: Yup.string().required("Admission type is required"),

    // ===================================================
    // PARENT INFORMATION (Father only for fast sale)
    // ===================================================
    fatherName: Yup.string()
      .trim()
      .required("Father Name is required")
      .matches(onlyLettersSingleSpace, "Only alphabets allowed"),

    fatherMobile: Yup.string()
      .required("Mobile Number is required")
      .matches(/^[6-9]\d{9}$/, "Invalid mobile number"),

    // ===================================================
    // ORIENTATION INFORMATION
    // ===================================================
    orientationCity: Yup.string().required("City is required"),

    // For fast sale, campusName is used (not branchName)
    campusName: Yup.string().required("Branch/Campus is required"),

    joiningClass: Yup.string().required("Joining Class is required"),
    orientationName: Yup.string().required("Course Name is required"),
    studentType: Yup.string().required("Student Type is required"),

    academicYear: Yup.string().nullable(),
    orientationStartDate: Yup.string().nullable(),
    orientationEndDate: Yup.string().nullable(),
    orientationFee: Yup.string().nullable(),

    // ===================================================
    // ADDRESS INFORMATION (No validations for fast sale)
    // ===================================================
    doorNo: Yup.string().nullable(),
    streetName: Yup.string().nullable(),
    landmark: Yup.string().nullable(),
    area: Yup.string().nullable(),
    pincode: Yup.string().nullable(),
    state: Yup.string().nullable(),
    district: Yup.string().nullable(),
    mandal: Yup.string().nullable(),
    // City for address (separate from orientation city)
    city: Yup.string().nullable(),
  });

export default clgActualSaleValidationSchema;
export { clgFastSaleValidationSchema };
