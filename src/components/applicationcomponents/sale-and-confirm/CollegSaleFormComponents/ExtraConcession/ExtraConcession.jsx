import React, { useState, useMemo } from "react";
import { useFormikContext } from "formik";
import styles from "./ExtraConcession.module.css";
 
import { renderField } from "../../../../../utils/renderField";
import {
  extraConcessionFeilds,
  extraConcessionFieldsLayout,
} from "./extraConcessionFields";
 
import { useGetEmployeesForSale, useGetConcessionReasons } from "../../../../../queries/applicationqueries/saleApis/clgSaleApis";
import {toTitleCase} from "../../../../../utils/toTitleCase";
 
const ExtraConcession = () => {
  const formik = useFormikContext();
  const { values, setFieldValue, errors, touched, submitCount } = formik;
  const [showConcessionFields, setShowConcessionFields] = useState(false);
 
  // Toggle
  const handleToggleConcession = () => {
    setShowConcessionFields((prev) => !prev);
  };
 
  /* ----------------------------------
      API: Get employees for dropdown
  ---------------------------------- */
  const { data: employeesRaw = [] } = useGetEmployeesForSale();
 
  /* ----------------------------------
      API: Get Concession Reasons
  ---------------------------------- */
  const { data: concessionReasonsRaw = [] } = useGetConcessionReasons();
 
  // Create name-to-ID map for concession reasons
  const concessionReasonNameToId = useMemo(() => {
    const map = new Map();
    if (Array.isArray(concessionReasonsRaw)) {
      concessionReasonsRaw.forEach((reason) => {
        const name = reason?.name || reason?.reasonName || reason?.label || reason?.concessionReasonName || "";
        const id = reason?.id || reason?.reasonId || reason?.concessionReasonId || reason?.value;
        if (name && id !== undefined && id !== null) {
          map.set(name, id);
        }
      });
    }
    return map;
  }, [concessionReasonsRaw]);
 
  // Concession reason options for dropdown
  const concessionReasonOptions = useMemo(() => {
    if (Array.isArray(concessionReasonsRaw)) {
      return concessionReasonsRaw.map((reason) =>
        reason?.name || reason?.reasonName || reason?.label || reason?.concessionReasonName || ""
      ).filter(Boolean);
    }
    return [];
  }, [concessionReasonsRaw]);
 
  const employeeOptions = useMemo(
    () => employeesRaw.map((e) => toTitleCase(e?.name ?? "")),  
    [employeesRaw]
  );
 
  // Create name-to-ID map for employees (for concessionReferredBy)
  const employeeNameToId = useMemo(() => {
    const map = new Map();
    if (Array.isArray(employeesRaw)) {
      employeesRaw.forEach((emp) => {
        const name = toTitleCase(emp?.name ?? "");
        const id = emp?.id || emp?.employeeId || emp?.value;
        if (name && id !== undefined && id !== null) {
          map.set(name, id);
        }
      });
    }
    return map;
  }, [employeesRaw]);
 
  /* ----------------------------------
      Handle Reason Change - Store reason ID
  ---------------------------------- */
  const handleReasonChange = (e) => {
    const { name, value } = e.target;
    setFieldValue(name, value);
   
    // Store proConcessionReasonId when reason is selected
    if (value && concessionReasonNameToId.has(value)) {
      const reasonId = concessionReasonNameToId.get(value);
      setFieldValue("proConcessionReasonId", reasonId);
    } else if (!value) {
      setFieldValue("proConcessionReasonId", null);
    }
  };
 
  /* ----------------------------------
      Handle Concession Referred By Change - Store employee ID
  ---------------------------------- */
  const handleConcessionReferredByChange = (e) => {
    const { name, value } = e.target;
    setFieldValue(name, value);
   
    // Store employee ID when employee is selected
    if (value && employeeNameToId.has(value)) {
      const employeeId = employeeNameToId.get(value);
      setFieldValue("proConcessionGivenById", employeeId);
    } else if (!value) {
      setFieldValue("proConcessionGivenById", null);
    }
  };
 
  /* ----------------------------------
      Build field map dynamically
  ---------------------------------- */
  const fieldMap = useMemo(() => {
    const map = {};
 
    extraConcessionFeilds.forEach((f) => {
      map[f.name] = { ...f };
 
      // Inject API options for concessionReferredBy
      if (f.name === "concessionReferredBy") {
        map[f.name].options = employeeOptions;
      }
     
      // Inject API options for reason (concession reasons)
      if (f.name === "reason") {
        map[f.name].options = concessionReasonOptions;
        map[f.name].type = "select"; // Ensure it's a select dropdown
      }
    });
 
    return map;
  }, [employeeOptions, concessionReasonOptions]);
 
  return (
    <div className={styles.clgAppSaleExtraConcessionWrapper}>
      <div className={styles.clgAppSaleExtraConcessionInfoTop}>
        <div className={styles.extraConcessionTopLeft}>
          {/* Toggle Button */}
          <div
            className={styles.extraConcessionSelection}
            onClick={handleToggleConcession}
          >
            {showConcessionFields && (
              <div className={styles.extraSelectionOption}></div>
            )}
          </div>
 
          <p className={styles.clgAppSaleExtraConcessionHeading}>
            Concession Written on Application
          </p>
        </div>
 
        <div className={styles.clgAppSalePersonalInfoSeperationLine}></div>
      </div>
 
      {/* Conditional Fields */}
      {showConcessionFields && (
        <div className={styles.clgAppSaleExtraConcessionInfoBottom}>
          {extraConcessionFieldsLayout.map((row) => (
            <div key={row.id} className={styles.clgAppSalerow}>
              {row.fields.map((fname) => {
                // Custom onChange handlers for reason and concessionReferredBy
                let onChangeHandler = (e) => setFieldValue(fname, e.target.value);
               
                if (fname === "reason") {
                  onChangeHandler = handleReasonChange;
                } else if (fname === "concessionReferredBy") {
                  onChangeHandler = handleConcessionReferredByChange;
                }
               
                // Check if field is touched or if there's an error (for validation on change)
                const isTouched = touched[fname] || submitCount > 0;
                const hasError = errors[fname];
               
                // Show error if field is touched/submitted OR if there are validation errors present
                const shouldShowError = isTouched || hasError;
                const fieldError = shouldShowError && hasError ? String(hasError) : null;
               
                return (
                  <div key={fname} className={styles.clgAppSaleFieldCell}>
                    {renderField(fname, fieldMap, {
                      value: values[fname] ?? "",
                      onChange: onChangeHandler,
                      error: fieldError,
                    })}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
 
export default ExtraConcession;