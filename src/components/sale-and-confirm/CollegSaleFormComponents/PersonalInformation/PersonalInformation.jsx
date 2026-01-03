import React, { useEffect, useMemo } from "react";
import { useFormikContext } from "formik";
import styles from "./PersonalInformation.module.css";
 
import {
  personalInfoFields,
  personalInfoFieldsLayout,
} from "./personalInformationFields";
 
import UploadPicture from "../../../../widgets/UploadPicture/UploadPicture";
import { renderField } from "../../../../utils/renderField";
import {toTitleCase} from "../../../../utils/toTitleCase";
 
// API Hooks
import {
  useGetQuota,
  useGetEmployeesForSale,
  useGetAdmissionType,
  useGetFoodType,
  useGetCaste,
  useGetReligion,
  useGetBloodGroup,
} from "../../../../queries/saleApis/clgSaleApis";
 
const PersonalInformation = ({ isEditMode = false, isFastSold = false }) => {
  const formik = useFormikContext();
  const { values, setFieldValue, errors, touched, setFieldError, setTouched, validateField } = formik;
 
  // Fetch dropdown data
  const { data: quotaData } = useGetQuota();
  const { data: employeesData } = useGetEmployeesForSale();
  const { data: admissionData } = useGetAdmissionType();
  const { data: foodData } = useGetFoodType();
  const { data: casteData } = useGetCaste();
  const { data: religionData } = useGetReligion();
  const { data: bloodGroupData } = useGetBloodGroup();
 
  // Create name-to-ID maps for storing IDs
  const quotaNameToId = useMemo(() => {
    const map = new Map();
    if (Array.isArray(quotaData)) {
      quotaData.forEach((q) => {
        if (q.name && q.id) {
          map.set(q.name, q.id);
        }
      });
    }
    return map;
  }, [quotaData]);
 
  const admissionTypeNameToId = useMemo(() => {
    const map = new Map();
    if (Array.isArray(admissionData)) {
      admissionData.forEach((a) => {
        const name = a.name || a.admissionTypeName || a.admission_type_name;
        const id = a.id || a.admissionTypeId || a.admission_type_id;
        if (name && id) {
          map.set(name, id);
          map.set(toTitleCase(name), id); // Also store title-cased version
        }
      });
    }
    return map;
  }, [admissionData]);
 
  const foodTypeNameToId = useMemo(() => {
    const map = new Map();
    if (Array.isArray(foodData)) {
      foodData.forEach((food) => {
        const name = food.name || food.foodTypeName;
        const id = food.id || food.foodTypeId;
        if (name && id) {
          map.set(name, id);
          map.set(toTitleCase(name), id);
        }
      });
    }
    return map;
  }, [foodData]);
 
  const casteNameToId = useMemo(() => {
    const map = new Map();
    if (Array.isArray(casteData)) {
      casteData.forEach((c) => {
        if (c.name && c.id) {
          map.set(c.name, c.id);
        }
      });
    }
    return map;
  }, [casteData]);
 
  const religionNameToId = useMemo(() => {
    const map = new Map();
    if (Array.isArray(religionData)) {
      religionData.forEach((r) => {
        const name = r.name || r.religionName;
        const id = r.id || r.religionId;
        if (name && id) {
          map.set(name, id);
          map.set(toTitleCase(name), id);
        }
      });
    }
    return map;
  }, [religionData]);
 
  const bloodGroupNameToId = useMemo(() => {
    const map = new Map();
    if (Array.isArray(bloodGroupData)) {
      bloodGroupData.forEach((b) => {
        if (b.name && b.id) {
          map.set(b.name, b.id);
        }
      });
    }
    return map;
  }, [bloodGroupData]);
 
  // Create employee name-to-ID map
  const employeeNameToId = useMemo(() => {
    const map = new Map();
    if (Array.isArray(employeesData)) {
      employeesData.forEach((emp) => {
        const name = toTitleCase(emp.name || emp.employeeName || emp.employee_name || '');
        const id = emp.id || emp.employeeId || emp.employee_id;
        if (name && id !== undefined && id !== null) {
          map.set(name, id);
          // Also store "name - id" format for easy lookup
          map.set(`${name} - ${id}`, id);
        }
      });
    }
    return map;
  }, [employeesData]);
 
  // Build field map with API results - memoized to prevent unnecessary recalculations
  const fieldMap = useMemo(() => {
    return personalInfoFields.reduce((acc, f) => {
      let field = { ...f };
 
      // Disable specific fields in edit mode OR fast sold: firstName, surName, aaparNo, aadharCardNo, dob
      if ((isEditMode || isFastSold) && (f.name === "firstName" || f.name === "surName" || f.name === "aaparNo" || f.name === "aadharCardNo" || f.name === "dob")) {
        field.disabled = true;
        field.readOnly = true;
      }
 
      if (f.name === "quotaAdmissionReferredBy")
        field.options = Array.isArray(quotaData) ? quotaData.map((q) => q.name) : [];
 
      if (f.name === "employeeId") {
        // Format options as "name - id"
        field.options = Array.isArray(employeesData) ? employeesData.map((emp) => {
          const name = toTitleCase(emp.name || emp.employeeName || emp.employee_name || '');
          const id = emp.id || emp.employeeId || emp.employee_id || '';
          return id ? `${name} - ${id}` : name;
        }) : [];
      }
 
      if (f.name === "admissionType")
        field.options = Array.isArray(admissionData) ? admissionData.map((a) => toTitleCase(a.name)) : [];
 
      if (f.name === "foodType")
        field.options = Array.isArray(foodData) ? foodData.map((food) => toTitleCase(food.food_type)) : [];
 
      if (f.name === "caste")
        field.options = Array.isArray(casteData) ? casteData.map((c) => c.name) : [];
 
      if (f.name === "religion")
        field.options = Array.isArray(religionData) ? religionData.map((r) => toTitleCase(r.name)) : [];
 
      if (f.name === "bloodGroup")
        field.options = Array.isArray(bloodGroupData) ? bloodGroupData.map((b) => b.name) : [];
 
      acc[f.name] = field;
      return acc;
    }, {});
  }, [quotaData, employeesData, admissionData, foodData, casteData, religionData, bloodGroupData, isEditMode, isFastSold]);
 
  const isStaff =
    values.quotaAdmissionReferredBy === "Staff children" ||
    values.quotaAdmissionReferredBy === "Staff";
 
  // CLEANUP employeeId if not Staff - use useEffect to prevent infinite loops
  useEffect(() => {
    if (!isStaff && values.employeeId) {
      setFieldValue("employeeId", "");
    }
  }, [isStaff, values.employeeId, setFieldValue]);
 
  // Store genderId when gender changes
  useEffect(() => {
    if (values.gender) {
      const genderMap = new Map([
        ["MALE", 1],
        ["FEMALE", 2],
        ["Male", 1],
        ["Female", 2],
        ["Other", 3],
      ]);
      const genderId = genderMap.get(values.gender);
      if (genderId !== undefined && genderId !== null) {
        setFieldValue("genderId", genderId);
      }
    } else if (values.genderId) {
      setFieldValue("genderId", null);
    }
  }, [values.gender, setFieldValue]);
 
  // Store quotaId when quotaAdmissionReferredBy changes
  useEffect(() => {
    if (values.quotaAdmissionReferredBy && quotaNameToId.has(values.quotaAdmissionReferredBy)) {
      const id = quotaNameToId.get(values.quotaAdmissionReferredBy);
      setFieldValue("quotaId", id);
    } else if (!values.quotaAdmissionReferredBy && values.quotaId) {
      setFieldValue("quotaId", null);
    }
  }, [values.quotaAdmissionReferredBy, quotaNameToId, setFieldValue]);
 
  // Store appTypeId when admissionType changes
  useEffect(() => {
    if (values.admissionType) {
      let id = admissionTypeNameToId.get(values.admissionType);
      if (id === undefined && typeof values.admissionType === 'string') {
        const titleCasedValue = toTitleCase(values.admissionType);
        id = admissionTypeNameToId.get(titleCasedValue);
      }
      if (id !== undefined && id !== null) {
        setFieldValue("appTypeId", id);
      }
    } else if (!values.admissionType && values.appTypeId) {
      setFieldValue("appTypeId", null);
    }
  }, [values.admissionType, admissionTypeNameToId, setFieldValue]);
 
 
  // Store foodTypeId when foodType changes
  useEffect(() => {
    if (values.foodType) {
      let id = foodTypeNameToId.get(values.foodType);
      if (id === undefined && typeof values.foodType === 'string') {
        const titleCasedValue = toTitleCase(values.foodType);
        id = foodTypeNameToId.get(titleCasedValue);
      }
      if (id !== undefined && id !== null) {
        setFieldValue("foodTypeId", id);
      }
    } else if (!values.foodType && values.foodTypeId) {
      setFieldValue("foodTypeId", null);
    }
  }, [values.foodType, foodTypeNameToId, setFieldValue]);
 
  // Store casteId when caste changes
  useEffect(() => {
    if (values.caste && casteNameToId.has(values.caste)) {
      const id = casteNameToId.get(values.caste);
      setFieldValue("casteId", id);
    } else if (!values.caste && values.casteId) {
      setFieldValue("casteId", null);
    }
  }, [values.caste, casteNameToId, setFieldValue]);
 
  // Store religionId when religion changes
  useEffect(() => {
    if (values.religion) {
      let id = religionNameToId.get(values.religion);
      if (id === undefined && typeof values.religion === 'string') {
        const titleCasedValue = toTitleCase(values.religion);
        id = religionNameToId.get(titleCasedValue);
      }
      if (id !== undefined && id !== null) {
        setFieldValue("religionId", id);
      }
    } else if (!values.religion && values.religionId) {
      setFieldValue("religionId", null);
    }
  }, [values.religion, religionNameToId, setFieldValue]);
 
  // Store bloodGroupId when bloodGroup changes
  useEffect(() => {
    if (values.bloodGroup && bloodGroupNameToId.has(values.bloodGroup)) {
      const id = bloodGroupNameToId.get(values.bloodGroup);
      setFieldValue("bloodGroupId", id);
    } else if (!values.bloodGroup && values.bloodGroupId) {
      setFieldValue("bloodGroupId", null);
    }
  }, [values.bloodGroup, bloodGroupNameToId, setFieldValue]);
 
  // 🔥 Dynamic layout
  const dynamicLayout = [
    personalInfoFieldsLayout[0], // row1
    personalInfoFieldsLayout[1], // row2
    personalInfoFieldsLayout[2], // row3
 
    isStaff
      ? { id: "row4", fields: ["employeeId", "admissionType", "foodType"] }
      : { id: "row4", fields: ["admissionType", "foodType", "bloodGroup"] },
 
    isStaff
      ? { id: "row5", fields: ["bloodGroup", "caste", "religion"] }
      : { id: "row5", fields: ["caste", "religion", ""] }
  ];
 
  return (
    <div className={styles.clgAppSalePersonalInforWrapper}>
      <div className={styles.clgAppSalePersonalInfoTop}>
        <p className={styles.clgAppSalePersonalInfoHeading}>
          Personal Information
        </p>
        <div className={styles.clgAppSalePersonalInfoSeperationLine}></div>
      </div>
 
      <div className={styles.clgAppSalePersonalInfoBottom}>
        {dynamicLayout.map((row) => (
          <div key={row.id} className={styles.clgAppSalerow}>
            {row.fields.map((fname) => (
              <div key={fname} className={styles.clgAppSaleFieldCell}>
                {renderField(fname, fieldMap, {
                  value: values[fname] ?? "",
                  disabled: ((isEditMode || isFastSold) && (fname === "firstName" || fname === "surName" || fname === "aaparNo" || fname === "aadharCardNo" || fname === "dob")) ? true : undefined,
                  onChange: ((isEditMode || isFastSold) && (fname === "firstName" || fname === "surName" || fname === "aaparNo" || fname === "aadharCardNo" || fname === "dob")) ? undefined : (e) => {
                    const selectedValue = e.target.value;
                   
                    // IMPORTANT: Prevent clearing quotaAdmissionReferredBy when admissionType changes
                    // and vice versa - only set the value if it's actually changing for THIS field
                    if (fname === "admissionType" && selectedValue === values.admissionType) {
                      return;
                    }
                    if (fname === "quotaAdmissionReferredBy" && selectedValue === values.quotaAdmissionReferredBy) {
                      return;
                    }
                   
                    // Prevent setting empty value if field already has a value (unless explicitly clearing)
                    if (!selectedValue || selectedValue.trim() === "") {
                      // Only allow clearing if user explicitly selected empty option
                      if (fname === "quotaAdmissionReferredBy" && values.quotaAdmissionReferredBy) {
                        return; // Don't clear if there's already a value
                      }
                      if (fname === "admissionType" && values.admissionType) {
                        return; // Don't clear if there's already a value
                      }
                    }
                   
                    // Mark field as touched first
                    setTouched({ ...touched, [fname]: true });
                   
                    // Clear error immediately when a valid value is selected
                    if (selectedValue && selectedValue.trim() !== "") {
                      setFieldError(fname, undefined);
                    }
                   
                    // Handle employeeId - store "name - id" format
                    if (fname === "employeeId") {
                      if (selectedValue.includes(' - ')) {
                        // Store the full "name - id" format for display
                        setFieldValue(fname, selectedValue, false);
                      } else if (employeeNameToId.has(selectedValue)) {
                        // Lookup by name only (fallback) - convert to "name - id" format
                        const employeeId = employeeNameToId.get(selectedValue);
                        const employee = employeesData?.find(e => {
                          const name = toTitleCase(e.name || e.employeeName || e.employee_name || '');
                          return name === selectedValue;
                        });
                        if (employee && employeeId) {
                          const formattedValue = `${selectedValue} - ${employeeId}`;
                          setFieldValue(fname, formattedValue, false);
                        } else {
                          setFieldValue(fname, selectedValue, false);
                        }
                      } else {
                        setFieldValue(fname, selectedValue, false);
                      }
                    } else {
                      // Set the value without immediate validation to prevent error from re-appearing
                      setFieldValue(fname, selectedValue, false); // false = don't validate immediately
                    }
                   
                    // Force clear error again after setting value (in case validation ran)
                    if (selectedValue && selectedValue.trim() !== "") {
                      // Clear immediately after setFieldValue
                      setTimeout(() => {
                        if (formik.errors[fname]) {
                          setFieldError(fname, undefined);
                        }
                      }, 0);
                     
                      // Validate after a delay and ensure error stays cleared if value is valid
                      setTimeout(() => {
                        validateField(fname).then((validationError) => {
                          // Check current formik.errors state (not closure variable)
                          const currentError = formik.errors[fname];
                          // If we have a valid value but there's still an error, clear it
                          if (currentError && selectedValue.trim() !== "") {
                            setFieldError(fname, undefined);
                          }
                        });
                      }, 100);
                    }
                  },
                  error: (touched[fname] || formik.submitCount > 0) && formik.errors[fname] ? formik.errors[fname] : null,
                })}
              </div>
            ))}
          </div>
        ))}
      </div>
 
      <div className={styles.clgAppSaleUploadPictureWrapper}>
        <UploadPicture />
        <p className={styles.uploadPictureHint}>Max image size is 300kb</p>
      </div>
    </div>
  );
};
 
export default PersonalInformation;