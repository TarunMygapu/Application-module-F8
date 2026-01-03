import React, { useState, useMemo, useEffect } from "react";
import { useFormikContext } from "formik";
import styles from "./AcademicInformation.module.css";
 
import { academicFields, getAcademicLayout } from "./acedemicInformationFields";
import { renderField } from "../../../../utils/renderField";

import {
  useGetState,
  useGetDistrictByState,
  useGetSchoolType,
  useGetAllClgTypes,
  useGetSchoolNames,
  useGetClgNames,
} from "../../../../queries/saleApis/clgSaleApis";
 
// -----------------------
// Label / ID Helpers
// -----------------------
const stateLabel = (s) => s?.stateName ?? "";
const stateId = (s) => s?.stateId ?? null;
 
const districtLabel = (d) => d?.name ?? "";
const districtId = (d) => d?.id ?? null;
 
const schoolTypeLabel = (s) => s?.name ?? "";
const schoolTypeId = (s) => s?.id ?? null;
 
const collegeTypeLabel = (c) => c?.name ?? "";
const collegeTypeId = (c) => c?.id ?? null;
 
const schoolNameId = (s) => s?.id ?? null;
const schoolNameLabel = (s) => s?.name ?? "";
 
const clgNameId = (s) => s?.id ?? null;
const collegeNameLabel = (c) => c?.name ?? "";
 
// -----------------------
// Academic Component
// -----------------------
const AcademicInformation = ({ joiningClass }) => {
  const { values, setFieldValue, errors, touched, submitCount, setFieldError, setTouched, validateField } = useFormikContext();
  const [localValues, setLocalValues] = useState({});

  const [selectedStateId, setSelectedStateId] = useState(null);
  const [selectedDistrictId, setSelectedDistrictId] = useState(null);

  const [selectedSchoolType, setSelectedSchoolType] = useState(null);
  const [selectedClgType, setSelectedClgType] = useState(null);
 
  // -----------------------
  // Decide Flow
  // -----------------------
  // Use joiningClass from props or Formik values
  const currentJoiningClass = joiningClass || values.joiningClass || "";
  
  const isSchoolFlow =
    currentJoiningClass === "INTER1" || currentJoiningClass === "" || currentJoiningClass == null;

  const isCollegeFlow =
    currentJoiningClass === "INTER2" ||
    currentJoiningClass === "LONG_TERM" ||
    currentJoiningClass === "SHORT_TERM";
 
  // -----------------------
  // Fetch Data
  // -----------------------
  const { data: stateRaw = [] } = useGetState();
  const { data: districtRaw = [] } = useGetDistrictByState(selectedStateId);
  const { data: schoolTypesRaw = [] } = useGetSchoolType(isSchoolFlow);
  const { data: schoolNamesRaw = [] } = useGetSchoolNames(
    selectedDistrictId,
    selectedSchoolType,
    isSchoolFlow
  );

  const { data: clgTypesRaw = [] } = useGetAllClgTypes(isCollegeFlow);
  const { data: clgNamesRaw = [] } = useGetClgNames(
    selectedDistrictId,
    selectedClgType,
    isCollegeFlow
  );
  // -----------------------
  // Build Options
  // -----------------------
  const stateOptions = useMemo(() => stateRaw.map(stateLabel), [stateRaw]);
  const districtOptions = useMemo(
    () => districtRaw.map(districtLabel),
    [districtRaw]
  );
 
  const schoolTypeOptions = useMemo(
    () => schoolTypesRaw.map(schoolTypeLabel),
    [schoolTypesRaw]
  );
  const schoolNameOptions = useMemo(
    () => schoolNamesRaw.map(schoolNameLabel),
    [schoolNamesRaw]
  );
 
  const clgTypeOptions = useMemo(
    () => clgTypesRaw.map(collegeTypeLabel),
    [clgTypesRaw]
  );
  const clgNameOptions = useMemo(
    () => clgNamesRaw.map(collegeNameLabel),
    [clgNamesRaw]
  );
 
  // -----------------------
  // Build Final Field Map
  // -----------------------
  const fieldMap = useMemo(() => {
    const map = {};
 
    academicFields.forEach((f) => {
      map[f.name] = { ...f };
 
      // STATE & DISTRICT
      if (f.name === "schoolState") map[f.name].options = stateOptions;
      if (f.name === "schoolDistrict") map[f.name].options = districtOptions;
        if (f.name === "clgState") map[f.name].options = stateOptions;
      if (f.name === "clgDistrict") map[f.name].options = districtOptions;
 
      // SCHOOL FLOW
      if (isSchoolFlow) {
        if (f.name === "schoolType") map[f.name].options = schoolTypeOptions;
        if (f.name === "schoolName") map[f.name].options = schoolNameOptions;
      }
 
      // COLLEGE FLOW
      if (isCollegeFlow) {
        if (f.name === "clgType") map[f.name].options = clgTypeOptions;
        if (f.name === "collegeName") map[f.name].options = clgNameOptions;
      }
    });
 
    return map;
  }, [
    academicFields,
    stateOptions,
    districtOptions,
    schoolTypeOptions,
    schoolNameOptions,
    clgTypeOptions,
    clgNameOptions,
    isSchoolFlow,
    isCollegeFlow,
  ]);
 
  // -----------------------
  // Handle Change
  // -----------------------
 
   // -------------------------
  const resetField = (nameArr) => {
    nameArr.forEach((n) => {
      setFieldValue(n, "");
      setLocalValues((prev) => ({ ...prev, [n]: "" }));
    });
  };

  const handleFieldChange = (field, value) => {
    // Mark field as touched first
    setTouched({ ...touched, [field]: true });

    // Clear error immediately when a valid value is selected
    if (value && value.trim() !== "") {
      setFieldError(field, undefined);
    }

    // Set the value without immediate validation to prevent error from re-appearing
    setFieldValue(field, value, false); // false = don't validate immediately
    setLocalValues((prev) => ({ ...prev, [field]: value }));

    // Force clear error again after setting value (in case validation ran)
    if (value && value.trim() !== "") {
      setTimeout(() => {
        if (errors[field]) {
          setFieldError(field, undefined);
        }
      }, 0);

      setTimeout(() => {
        validateField(field).then((validationError) => {
          const currentError = errors[field];
          if (currentError && value.trim() !== "") {
            setFieldError(field, undefined);
          }
        });
      }, 100);
    }

    /** ================= STATE UPDATE ================= **/
    if (field === "schoolState" || field === "clgState") {
      const stObj = stateRaw.find((s) => stateLabel(s) === value);
      const stateIdValue = stateId(stObj);
      setSelectedStateId(stateIdValue);
      setSelectedDistrictId(null);

      // Store state IDs
      if (field === "schoolState" && stateIdValue) {
        setFieldValue("schoolStateId", stateIdValue);
      }
      if (field === "clgState" && stateIdValue) {
        setFieldValue("preCollegeStateId", stateIdValue);
      }

      resetField([
        "schoolDistrict",
        "clgDistrict",
        "schoolType",
        "clgType",
        "schoolName",
        "collegeName",
      ]);

      setSelectedSchoolType(null);
      setSelectedClgType(null);
      return;
    }

    /** ================= DISTRICT UPDATE ================= **/
    if (field === "schoolDistrict" || field === "clgDistrict") {
      const dObj = districtRaw.find((d) => districtLabel(d) === value);
      const districtIdValue = districtId(dObj);
      setSelectedDistrictId(districtIdValue);

      // Store district IDs
      if (field === "schoolDistrict" && districtIdValue) {
        setFieldValue("schoolDistrictId", districtIdValue);
      }
      if (field === "clgDistrict" && districtIdValue) {
        setFieldValue("preCollegeDistrictId", districtIdValue);
      }

      resetField(["schoolType", "clgType", "schoolName", "collegeName"]);

      setSelectedSchoolType(null);
      setSelectedClgType(null);
      return;
    }

    /** ================= SCHOOL TYPE UPDATE ================= **/
    if (field === "schoolType") {
      const stObj = schoolTypesRaw.find((s) => schoolTypeLabel(s) === value);
      const schoolTypeIdValue = schoolTypeId(stObj);
      setSelectedSchoolType(schoolTypeLabel(stObj));

      // Store school type ID
      if (schoolTypeIdValue) {
        setFieldValue("schoolTypeId", schoolTypeIdValue);
      }

      resetField(["schoolName"]);
      return;
    }

    /** ================= COLLEGE TYPE UPDATE ================= **/
    if (field === "clgType") {
      const cObj = clgTypesRaw.find((c) => collegeTypeLabel(c) === value);
      const collegeTypeIdValue = collegeTypeId(cObj);
      setSelectedClgType(collegeTypeIdValue);

      // Store college type ID
      if (collegeTypeIdValue) {
        setFieldValue("preCollegeTypeId", collegeTypeIdValue);
      }

      resetField(["collegeName"]);
      return;
    }
  };
 
  // Sync selectedStateId when schoolStateId or preCollegeStateId is set in Formik (for auto-population)
  // This triggers the API call to load districts
  useEffect(() => {
    const stateIdValue = values.schoolStateId || values.preCollegeStateId;
    if (stateIdValue && stateIdValue !== 0 && stateIdValue !== null && Number(stateIdValue) !== selectedStateId) {
      const numStateId = Number(stateIdValue);
      setSelectedStateId(numStateId);
    }
  }, [values.schoolStateId, values.preCollegeStateId, selectedStateId]);

  // Sync selectedDistrictId when schoolDistrictId or preCollegeDistrictId is set in Formik (for auto-population)
  // This triggers the API call to load school/college types and names
  useEffect(() => {
    const districtIdValue = values.schoolDistrictId || values.preCollegeDistrictId;
    if (districtIdValue && districtIdValue !== 0 && districtIdValue !== null && Number(districtIdValue) !== selectedDistrictId) {
      const numDistrictId = Number(districtIdValue);
      setSelectedDistrictId(numDistrictId);
    }
  }, [values.schoolDistrictId, values.preCollegeDistrictId, selectedDistrictId]);

  // Sync IDs when labels are present but IDs are missing (for pre-populated data)
  useEffect(() => {
    // Sync schoolStateId
    if (values.schoolState && (!values.schoolStateId || values.schoolStateId === 0)) {
      const stateObj = stateRaw.find((s) => stateLabel(s) === values.schoolState);
      if (stateObj) {
        const id = stateId(stateObj);
        if (id) {
          setFieldValue("schoolStateId", id);
        }
      }
    }
    
    // Sync schoolDistrictId
    if (values.schoolDistrict && (!values.schoolDistrictId || values.schoolDistrictId === 0)) {
      const districtObj = districtRaw.find((d) => districtLabel(d) === values.schoolDistrict);
      if (districtObj) {
        const id = districtId(districtObj);
        if (id) {
          setFieldValue("schoolDistrictId", id);
        }
      }
    }
    
    // Sync schoolTypeId
    if (values.schoolType && (!values.schoolTypeId || values.schoolTypeId === 0)) {
      const schoolTypeObj = schoolTypesRaw.find((s) => schoolTypeLabel(s) === values.schoolType);
      if (schoolTypeObj) {
        const id = schoolTypeId(schoolTypeObj);
        if (id) {
          setFieldValue("schoolTypeId", id);
        }
      }
    }
    
    // Sync preCollegeStateId
    if (values.clgState && (!values.preCollegeStateId || values.preCollegeStateId === 0)) {
      const stateObj = stateRaw.find((s) => stateLabel(s) === values.clgState);
      if (stateObj) {
        const id = stateId(stateObj);
        if (id) {
          setFieldValue("preCollegeStateId", id);
        }
      }
    }
    
    // Sync preCollegeDistrictId
    if (values.clgDistrict && (!values.preCollegeDistrictId || values.preCollegeDistrictId === 0)) {
      const districtObj = districtRaw.find((d) => districtLabel(d) === values.clgDistrict);
      if (districtObj) {
        const id = districtId(districtObj);
        if (id) {
          setFieldValue("preCollegeDistrictId", id);
        }
      }
    }
    
    // Sync preCollegeTypeId
    if (values.clgType && (!values.preCollegeTypeId || values.preCollegeTypeId === 0)) {
      const clgTypeObj = clgTypesRaw.find((c) => collegeTypeLabel(c) === values.clgType);
      if (clgTypeObj) {
        const id = collegeTypeId(clgTypeObj);
        if (id) {
          setFieldValue("preCollegeTypeId", id);
        }
      }
    }
  }, [
    values.schoolState, values.schoolStateId,
    values.schoolDistrict, values.schoolDistrictId,
    values.schoolType, values.schoolTypeId,
    values.clgState, values.preCollegeStateId,
    values.clgDistrict, values.preCollegeDistrictId,
    values.clgType, values.preCollegeTypeId,
    stateRaw, districtRaw, schoolTypesRaw, clgTypesRaw,
    setFieldValue
  ]);

  // -----------------------
  // Layout Based on Flow
  // -----------------------
  const layout = getAcademicLayout(currentJoiningClass);
 
  return (
    <div className={styles.clgAppSaleAcademicInfoWrapper}>
      <div className={styles.clgAppSaleAcademicInfoTop}>
        <p className={styles.clgAppSaleAcademicHeading}>Academic Information</p>
        <div className={styles.clgAppSalePersonalInfoSeperationLine}></div>
      </div>
 
      <div className={styles.clgAppSaleAcademicInfoBottom}>
        {layout.map((row, rowIndex) => (
          <div key={rowIndex} className={styles.clgAppSalerow}>
            {row.map((fname, colIndex) => {
              // Show error if field is touched OR form has been submitted (submitCount > 0)
              const hasError = errors[fname];
              const isTouched = touched[fname];
              const shouldShowError = (isTouched || submitCount > 0) && hasError;
              const fieldError = shouldShowError ? String(hasError) : null;
              
              return (
                <div key={colIndex} className={styles.clgAppSaleFieldCell}>
                  {fname
                    ? renderField(fname, fieldMap, {
                        value: values[fname] ?? localValues[fname] ?? "",
                        onChange: (e) => handleFieldChange(fname, e.target.value),
                        error: fieldError,
                      })
                    : null}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
 
export default AcademicInformation;
