import React, { useMemo, useEffect } from "react";
import { useFormikContext } from "formik";
import styles from "./PersonalInformation.module.css";
 
import {
  personalInfoFields,
  personalInfoFieldsLayoutForSchool,
} from "./personalInformationFields";
 
import UploadPicture from "../../../../widgets/UploadPicture/UploadPicture";
import { renderField } from "../../../../utils/renderField";
 
// API hooks
import {
  useGetQuota,
  useGetEmployeesForSale,
  useGetAdmissionType,
} from "../../../../queries/saleApis/clgSaleApis";
 
const PersonalInformationForSchool = ({ isEditMode = false }) => {
  const formik = useFormikContext();
  const { values, setFieldValue, errors, touched, setFieldError, setTouched, validateField } = formik;
 
  /* =======================
     Fetch Dropdown Data
  =========================*/
  const { data: quotaData } = useGetQuota();
  const { data: employeesData } = useGetEmployeesForSale();
  const { data: admissionData } = useGetAdmissionType();
 
 
  /* =======================
      Build Field Map & ID Maps
  =========================*/
  // Create ID maps for dropdowns
  const quotaNameToId = useMemo(() => {
    const map = new Map();
    quotaData?.forEach((q) => {
      // Handle different possible field names from API
      const name = q.name || q.quotaName || q.quota_name;
      const id = q.id || q.quotaId || q.quota_id;
      if (name && id) {
        map.set(name, id);
      }
    });
    return map;
  }, [quotaData]);
 
  const admissionTypeNameToId = useMemo(() => {
    const map = new Map();
    admissionData?.forEach((a) => {
      // Handle different possible field names from API
      const name = a.name || a.admissionTypeName || a.admission_type_name || a.typeName;
      const id = a.id || a.admissionTypeId || a.admission_type_id || a.typeId;
      if (name && id) {
        map.set(name, id);
      }
    });
    return map;
  }, [admissionData]);
 
  // Create employee name-to-ID map
  const employeeNameToId = useMemo(() => {
    const map = new Map();
    employeesData?.forEach((e) => {
      const name = e.name || e.employeeName || e.employee_name;
      const id = e.id || e.employeeId || e.employee_id;
      if (name && id !== undefined && id !== null) {
        map.set(name, id);
        // Also store "name - id" format for easy lookup
        map.set(`${name} - ${id}`, id);
      }
    });
    return map;
  }, [employeesData]);
 
  const fieldMap = useMemo(() => {
    return personalInfoFields.reduce((acc, field) => {
      let f = { ...field };
 
      // Disable specific fields in edit mode: firstName, surName, aaparNo, aadharCardNo, dob
      if (isEditMode && (f.name === "firstName" || f.name === "surName" || f.name === "aaparNo" || f.name === "aadharCardNo" || f.name === "dob")) {
        f.disabled = true;
        f.readOnly = true;
      }
 
      if (field.name === "quotaAdmissionReferredBy") {
        f.options = quotaData?.map((q) => q.name) || [];
      }
 
      if (field.name === "employeeId") {
        // Format options as "name - id"
        f.options = employeesData?.map((e) => {
          const name = e.name || e.employeeName || e.employee_name || '';
          const id = e.id || e.employeeId || e.employee_id || '';
          return id ? `${name} - ${id}` : name;
        }) || [];
      }
 
      if (field.name === "admissionType") {
        f.options = admissionData?.map((a) => a.name) || [];
      }
 
      acc[field.name] = f;
      return acc;
    }, {});
  }, [quotaData, employeesData, admissionData, isEditMode]);
 
  /* =======================
      Staff Logic
  =========================*/
  const isStaff =
    values.quotaAdmissionReferredBy === "Staff" ||
    values.quotaAdmissionReferredBy === "Staff children";
 
  // cleanup employeeId if not staff
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
        // Always set genderId if gender is selected - ensure it's always set
        // This ensures genderId is always set when gender is selected
        setFieldValue("genderId", genderId);
      }
    } else {
      // Clear genderId if gender is cleared
      if (values.genderId) {
        setFieldValue("genderId", null);
      }
    }
  }, [values.gender, setFieldValue]);
 
  // Sync quotaId when quotaAdmissionReferredBy is present but quotaId is missing
  useEffect(() => {
    if (values.quotaAdmissionReferredBy && (!values.quotaId || values.quotaId === 0)) {
      // Try exact match first
      if (quotaNameToId.has(values.quotaAdmissionReferredBy)) {
        const id = quotaNameToId.get(values.quotaAdmissionReferredBy);
        setFieldValue("quotaId", id);
      } else {
        // Try case-insensitive match
        const quotaUpper = String(values.quotaAdmissionReferredBy).toUpperCase().trim();
        for (const [key, id] of quotaNameToId.entries()) {
          if (String(key).toUpperCase().trim() === quotaUpper) {
            setFieldValue("quotaId", id);
            break;
          }
        }
      }
    }
  }, [values.quotaAdmissionReferredBy, values.quotaId, quotaNameToId, setFieldValue]);
 
  // Sync appTypeId when admissionType is present but appTypeId is missing
  useEffect(() => {
    if (values.admissionType && (!values.appTypeId || values.appTypeId === 0)) {
      // Try exact match first
      if (admissionTypeNameToId.has(values.admissionType)) {
        const id = admissionTypeNameToId.get(values.admissionType);
        setFieldValue("appTypeId", id);
      } else {
        // Try case-insensitive match and variations
        const admissionTypeUpper = String(values.admissionType).toUpperCase().trim();
        for (const [key, id] of admissionTypeNameToId.entries()) {
          const keyUpper = String(key).toUpperCase().trim();
          if (keyUpper === admissionTypeUpper ||
              keyUpper.includes(admissionTypeUpper) ||
              admissionTypeUpper.includes(keyUpper)) {
            setFieldValue("appTypeId", id);
            break;
          }
        }
      }
    }
  }, [values.admissionType, values.appTypeId, admissionTypeNameToId, setFieldValue]);
 
  /* =======================
      Admission Type Logic
  =========================*/
  // decide isWithPro first
  const isWithPro = values.admissionType === "With pro";
 
  // build row4 step-by-step
  let row4;
  // CASE 1: Staff selected + With Pro selected
  // employeeId | admissionType | proReceiptNo
  if (isStaff && isWithPro) {
    row4 = {
      id: "row4",
      fields: ["employeeId", "admissionType", "proReceiptNo"],
    };
  }
 
  // CASE 2: Staff selected + With Pro NOT selected
  // employeeId | admissionType | ""
  else if (isStaff && !isWithPro) {
    row4 = {
      id: "row4",
      fields: ["employeeId", "admissionType"],
    };
  }
 
  // CASE 3: Staff NOT selected + With Pro selected
  // admissionType | proReceiptNo
  // (These two fields will now occupy two cells, likely 50% width each)
  else if (!isStaff && isWithPro) {
    row4 = {
      id: "row4",
      // ONLY TWO FIELDS - No empty middle field, as requested.
      fields: ["admissionType", "proReceiptNo"],
    };
  }
 
  // CASE 4: Staff NOT selected + With Pro NOT selected
  // admissionType | "" | ""
  else {
    row4 = {
      id: "row4",
      fields: ["admissionType", "", ""],
    };
  }
 
  const staticRows = personalInfoFieldsLayoutForSchool.slice(0, 3);
 
  const dynamicLayout = [...staticRows, row4];
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
          <div key={row.id} className={styles.schoolRow}>
            {row.fields.map((fname, idx) => (
              <div key={idx} className={styles.schoolCell}>
                {fname !== "" &&
                  renderField(fname, fieldMap, {
                    value: values[fname] ?? "",
                    disabled: (isEditMode && (fname === "firstName" || fname === "surName" || fname === "aaparNo" || fname === "aadharCardNo" || fname === "dob")) ? true : undefined,
                    onChange: (isEditMode && (fname === "firstName" || fname === "surName" || fname === "aaparNo" || fname === "aadharCardNo" || fname === "dob")) ? undefined : (e) => {
                      const selectedValue = e.target.value;
                     
                      // IMPORTANT: Prevent clearing quotaAdmissionReferredBy when admissionType changes
                      if (fname === "admissionType" && selectedValue === values.admissionType) {
                        return;
                      }
                      if (fname === "quotaAdmissionReferredBy" && selectedValue === values.quotaAdmissionReferredBy) {
                        return;
                      }
                     
                      // Prevent setting empty value if field already has a value
                      if (!selectedValue || selectedValue.trim() === "") {
                        if (fname === "quotaAdmissionReferredBy" && values.quotaAdmissionReferredBy) {
                          return;
                        }
                        if (fname === "admissionType" && values.admissionType) {
                          return;
                        }
                      }
                     
                      // Mark field as touched first
                      setTouched({ ...touched, [fname]: true });
                     
                      // Clear error immediately when a valid value is selected
                      if (selectedValue && selectedValue.trim() !== "") {
                        setFieldError(fname, undefined);
                      }
                     
                      // Set the value without immediate validation to prevent error from re-appearing
                      setFieldValue(fname, selectedValue, false); // false = don't validate immediately
                     
                      // Store IDs when dropdowns are selected
                      if (fname === "quotaAdmissionReferredBy") {
                        if (quotaNameToId.has(selectedValue)) {
                          const id = quotaNameToId.get(selectedValue);
                          setFieldValue("quotaId", id);
                        }
                      } else if (fname === "employeeId") {
                        // Extract ID from "name - id" format or lookup by name
                        let employeeId = null;
                        if (selectedValue.includes(' - ')) {
                          // Extract ID from "name - id" format
                          const parts = selectedValue.split(' - ');
                          if (parts.length >= 2) {
                            const extractedId = parts[parts.length - 1].trim();
                            employeeId = Number(extractedId);
                            if (!isNaN(employeeId)) {
                              setFieldValue("employeeId", selectedValue); // Store full "name - id" format
                            }
                          }
                        } else if (employeeNameToId.has(selectedValue)) {
                          // Lookup by name only
                          employeeId = employeeNameToId.get(selectedValue);
                          // Update the value to "name - id" format
                          const employee = employeesData?.find(e => {
                            const name = e.name || e.employeeName || e.employee_name;
                            return name === selectedValue;
                          });
                          if (employee) {
                            const formattedValue = `${selectedValue} - ${employeeId}`;
                            setFieldValue("employeeId", formattedValue);
                          }
                        }
                      } else if (fname === "admissionType") {
                        if (admissionTypeNameToId.has(selectedValue)) {
                          const id = admissionTypeNameToId.get(selectedValue);
                          setFieldValue("appTypeId", id);
                        }
                      }
                     
                      // Force clear error again after setting value (in case validation ran)
                      if (selectedValue && selectedValue.trim() !== "") {
                        setTimeout(() => {
                          if (formik.errors[fname]) {
                            setFieldError(fname, undefined);
                          }
                        }, 0);
                       
                        // Validate after a delay and ensure error stays cleared if value is valid
                        setTimeout(() => {
                          validateField(fname).then((validationError) => {
                            const currentError = formik.errors[fname];
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
        <p className={styles.uploadPictureHint}>Photo should not exceed 300kb</p>
      </div>
    </div>
  );
};
 
export default PersonalInformationForSchool;
 
 