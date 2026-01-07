import React, { useMemo, useEffect } from "react";
import { useFormikContext } from "formik";
import styles from "./ConcessionInformation.module.css";

import { useGetEmployeesForSale, useGetConcessionReasons } from "../../../../../queries/applicationqueries/saleApis/clgSaleApis";
import { useConcessionTypes } from "./hooks/useCollegeConcessionTypes";

import {
  concessionInformationFields,
  concessionInformationFieldsLayout,
} from "./concessionInformtionFields";

import { renderField } from "../../../../../utils/renderField";
import { toTitleCase } from "../../../../../utils/toTitleCase";

const ConcessionInformation = () => {
  const formik = useFormikContext();
  const { values, setFieldValue, setFieldTouched, setFieldError, errors, touched, submitCount, handleBlur } = formik;

  /* -------------------------
      API: Get Employees
  ------------------------- */
  const { data: employeesRaw = [] } = useGetEmployeesForSale();

  /* -------------------------
      API: Get Concession Types
  ------------------------- */
  const { getConcessionTypeIdByLabel } = useConcessionTypes();

  /* -------------------------
      API: Get Concession Reasons
  ------------------------- */
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

  /* -------------------------
      Dropdown options
  ------------------------- */
  const employeeOptions = useMemo(
    () => employeesRaw.map((e) => toTitleCase(e?.name ?? "")), // adjust key if needed
    [employeesRaw]
  );

  // Create name-to-ID map for employees (for authorizedBy and referredBy)
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

  /* -------------------------
      Handle 1st Year Concession Change - Store amount and type ID
  ------------------------- */
  const handleFirstYearConcessionChange = (e) => {
    const { name, value } = e.target;

    // Remove any non-digit characters (allow only numbers)
    const digitsOnly = value.replace(/\D/g, "");

    // Get the "1st year" concession type ID
    const firstYearTypeId = getConcessionTypeIdByLabel("1st year");

    // Mark field as touched FIRST so error can display immediately
    setFieldTouched(name, true, false);

    // Update the form data with the concession amount and trigger validation
    setFieldValue(name, digitsOnly, true); // true = shouldValidate, triggers validation immediately

    // Validate field to show errors below the field (no alert)
    formik.validateField(name);

    // Validate dependent fields (description, referredBy, authorizedBy, concessionReason)
    // when concession amount is entered
    if (digitsOnly && digitsOnly !== "0") {
      // Mark dependent fields as touched so errors display immediately
      setFieldTouched("description", true, false);
      setFieldTouched("referredBy", true, false);
      setFieldTouched("authorizedBy", true, false);
      setFieldTouched("concessionReason", true, false);

      // Validate dependent fields
      formik.validateField("description");
      formik.validateField("referredBy");
      formik.validateField("authorizedBy");
      formik.validateField("concessionReason");
    }

    // Also store the concession type ID separately
    if (firstYearTypeId !== undefined) {
      setFieldValue("firstYearConcessionTypeId", firstYearTypeId);
    }
  };

  /* -------------------------
      Handle 2nd Year Concession Change - Store amount and type ID
  ------------------------- */
  const handleSecondYearConcessionChange = (e) => {
    const { name, value } = e.target;

    // Remove any non-digit characters (allow only numbers)
    const digitsOnly = value.replace(/\D/g, "");

    // Get the "2nd year" concession type ID
    const secondYearTypeId = getConcessionTypeIdByLabel("2nd year");

    // Clear error if value is valid (not empty and not causing validation error)
    if (digitsOnly && errors[name]) {
      // Check if the value is valid by validating it
      formik.validateField(name).then(() => {
        // If validation passes (no error), clear the error
        if (!formik.errors[name]) {
          setFieldError(name, undefined);
        }
      });
    }

    // Update the form data with the concession amount and mark as touched
    setFieldValue(name, digitsOnly, false); // false = don't validate immediately, we'll validate manually
    setFieldTouched(name, true, false); // Mark field as touched

    // Validate dependent fields (description, referredBy, authorizedBy, concessionReason)
    // when concession amount is entered
    if (digitsOnly && digitsOnly !== "0") {
      // Mark dependent fields as touched so errors display immediately
      setFieldTouched("description", true, false);
      setFieldTouched("referredBy", true, false);
      setFieldTouched("authorizedBy", true, false);
      setFieldTouched("concessionReason", true, false);

      // Validate dependent fields
      formik.validateField("description");
      formik.validateField("referredBy");
      formik.validateField("authorizedBy");
      formik.validateField("concessionReason");
    }

    // Also store the concession type ID separately
    if (secondYearTypeId !== undefined) {
      setFieldValue("secondYearConcessionTypeId", secondYearTypeId);
    }
  };

  /* -------------------------
      Handle Concession Reason Change - Store reason ID
  ------------------------- */
  const handleConcessionReasonChange = (e) => {
    const { name, value } = e.target;

    // Clear error when a valid value is selected
    if (value && value !== "Select Concession Reason" && errors[name]) {
      setFieldError(name, undefined);
      formik.validateField(name).then(() => {
        if (!formik.errors[name]) {
          setFieldError(name, undefined);
        }
      });
    }

    setFieldValue(name, value);

    // Store concessionReasonId when reason is selected
    if (value && concessionReasonNameToId.has(value)) {
      const reasonId = concessionReasonNameToId.get(value);
      setFieldValue("concessionReasonId", reasonId);
    } else if (!value) {
      setFieldValue("concessionReasonId", null);
    }
  };

  /* -------------------------
      Handle Authorized By Change - Store employee ID
  ------------------------- */
  const handleAuthorizedByChange = (e) => {
    const { name, value } = e.target;

    // Clear error when a valid value is selected
    if (value && value !== "Select Authorized By" && errors[name]) {
      setFieldError(name, undefined);
      formik.validateField(name).then(() => {
        if (!formik.errors[name]) {
          setFieldError(name, undefined);
        }
      });
    }

    setFieldValue(name, value);

    // Store employee ID when employee is selected
    if (value && employeeNameToId.has(value)) {
      const employeeId = employeeNameToId.get(value);
      console.log("Employee ID (Authorized By): ", employeeId);
      setFieldValue("authorizedById", employeeId);
    } else if (!value) {
      setFieldValue("authorizedById", null);
    }
  };

  /* -------------------------
      Handle Referred By Change - Store employee ID
  ------------------------- */
  const handleReferredByChange = (e) => {
    const { name, value } = e.target;

    // Clear error when a valid value is selected
    if (value && value !== "Select Referred By" && errors[name]) {
      setFieldError(name, undefined);
      formik.validateField(name).then(() => {
        if (!formik.errors[name]) {
          setFieldError(name, undefined);
        }
      });
    }

    setFieldValue(name, value);

    // Store employee ID when employee is selected
    if (value && employeeNameToId.has(value)) {
      const employeeId = employeeNameToId.get(value);
      console.log("Employee ID (Referred By): ", employeeId);
      setFieldValue("referredById", employeeId);
    } else if (!value) {
      setFieldValue("referredById", null);
    }
  };

  /* -------------------------
      Handle Description Change - Mark as touched and trigger validation
  ------------------------- */
  const handleDescriptionChange = (e) => {
    const { name, value } = e.target;

    // Mark field as touched FIRST so error can display immediately
    setFieldTouched(name, true, false);

    // Update the form data and trigger validation
    setFieldValue(name, value, true); // true = shouldValidate, triggers validation immediately

    // Validate field to show errors below the field
    formik.validateField(name);

    // Clear error when a valid value is entered
    if (value && value.trim() !== "" && errors[name]) {
      formik.validateField(name).then(() => {
        if (!formik.errors[name]) {
          setFieldError(name, undefined);
        }
      });
    }
  };

  /* -------------------------
      Sync concession type IDs when values are present but IDs are missing
  ------------------------- */
  useEffect(() => {
    // Sync firstYearConcessionTypeId
    if (values.firstYearConcession && (!values.firstYearConcessionTypeId || values.firstYearConcessionTypeId === 0)) {
      const firstYearTypeId = getConcessionTypeIdByLabel("1st year");
      if (firstYearTypeId !== undefined) {
        setFieldValue("firstYearConcessionTypeId", firstYearTypeId);
      }
    }

    // Sync secondYearConcessionTypeId
    if (values.secondYearConcession && (!values.secondYearConcessionTypeId || values.secondYearConcessionTypeId === 0)) {
      const secondYearTypeId = getConcessionTypeIdByLabel("2nd year");
      if (secondYearTypeId !== undefined) {
        setFieldValue("secondYearConcessionTypeId", secondYearTypeId);
      }
    }

    // Sync concessionReasonId when reason label is present but ID is missing
    if (values.concessionReason && (!values.concessionReasonId || values.concessionReasonId === 0)) {
      // Try exact match first
      if (concessionReasonNameToId.has(values.concessionReason)) {
        const reasonId = concessionReasonNameToId.get(values.concessionReason);
        setFieldValue("concessionReasonId", reasonId);
      } else {
        // Try case-insensitive match
        const reasonLabel = String(values.concessionReason).trim();
        for (const [key, id] of concessionReasonNameToId.entries()) {
          if (key.toLowerCase() === reasonLabel.toLowerCase()) {
            setFieldValue("concessionReasonId", id);
            // Also update the reason value to match the dropdown format
            setFieldValue("concessionReason", key);
            break;
          }
        }
      }
    }

    // Sync authorizedById when authorizedBy label is present but ID is missing
    if (values.authorizedBy && (!values.authorizedById || values.authorizedById === 0)) {
      const authorizedByLabel = toTitleCase(String(values.authorizedBy).trim());
      if (employeeNameToId.has(authorizedByLabel)) {
        const employeeId = employeeNameToId.get(authorizedByLabel);
        setFieldValue("authorizedById", employeeId);
      } else {
        // Try case-insensitive match
        for (const [key, id] of employeeNameToId.entries()) {
          if (key.toLowerCase() === authorizedByLabel.toLowerCase()) {
            setFieldValue("authorizedById", id);
            setFieldValue("authorizedBy", key);
            break;
          }
        }
      }
    }

    // Sync referredById when referredBy label is present but ID is missing
    if (values.referredBy && (!values.referredById || values.referredById === 0)) {
      const referredByLabel = toTitleCase(String(values.referredBy).trim());
      if (employeeNameToId.has(referredByLabel)) {
        const employeeId = employeeNameToId.get(referredByLabel);
        setFieldValue("referredById", employeeId);
      } else {
        // Try case-insensitive match
        for (const [key, id] of employeeNameToId.entries()) {
          if (key.toLowerCase() === referredByLabel.toLowerCase()) {
            setFieldValue("referredById", id);
            setFieldValue("referredBy", key);
            break;
          }
        }
      }
    }
  }, [values.firstYearConcession, values.secondYearConcession, values.firstYearConcessionTypeId, values.secondYearConcessionTypeId, values.concessionReason, values.concessionReasonId, values.authorizedBy, values.authorizedById, values.referredBy, values.referredById, getConcessionTypeIdByLabel, concessionReasonNameToId, employeeNameToId, setFieldValue, concessionReasonsRaw, employeesRaw]);

  /* -------------------------
      Build final field map
  ------------------------- */
  const fieldMap = useMemo(() => {
    const map = {};

    concessionInformationFields.forEach((f) => {
      map[f.name] = { ...f };

      // Replace dropdowns
      if (f.name === "referredBy") map[f.name].options = employeeOptions;
      if (f.name === "authorizedBy") map[f.name].options = employeeOptions;
      if (f.name === "concessionReason") {
        map[f.name].options = concessionReasonOptions;
        map[f.name].type = "select"; // Change from text to select
      }
    });

    return map;
  }, [employeeOptions, concessionReasonOptions]);

  return (
    <div className={styles.clgAppSaleConcessionInfoWrapper}>
      <div className={styles.clgAppSaleConcessionInfoTop}>
        <p className={styles.clgAppSaleConcessionHeading}>
          Concession Information
        </p>
        <div className={styles.clgAppSalePersonalInfoSeperationLine}></div>
      </div>

      <div className={styles.clgAppSaleConcessionInfoBottom}>
        {concessionInformationFieldsLayout.map((row) => (
          <div key={row.id} className={styles.clgAppSalerow}>
            {row.fields.map((fname) => {
              // Custom onChange handlers for concession amount fields, reason, and employee fields
              let onChangeHandler = (e) => setFieldValue(fname, e.target.value);

              if (fname === "firstYearConcession") {
                onChangeHandler = handleFirstYearConcessionChange;
              } else if (fname === "secondYearConcession") {
                onChangeHandler = handleSecondYearConcessionChange;
              } else if (fname === "concessionReason") {
                onChangeHandler = handleConcessionReasonChange;
              } else if (fname === "authorizedBy") {
                onChangeHandler = handleAuthorizedByChange;
              } else if (fname === "referredBy") {
                onChangeHandler = handleReferredByChange;
              } else if (fname === "description") {
                onChangeHandler = handleDescriptionChange;
              }

              // Check if field is touched or if there's an error (for validation on change)
              const isTouched = touched[fname] || submitCount > 0;
              const hasError = errors[fname];

              // Check if field has a valid value (not empty, not placeholder)
              // NOTE: For firstYearConcession and secondYearConcession, don't hide errors based on value
              // because these fields can have values that are still invalid (exceed course fee)
              const isConcessionAmountField = fname === "firstYearConcession" || fname === "secondYearConcession";
              const hasValidValue = !isConcessionAmountField && values[fname] &&
                values[fname] !== "" &&
                values[fname] !== "Select Referred By" &&
                values[fname] !== "Select Authorized By" &&
                values[fname] !== "Select Concession Reason";

              // Show error if field is touched/submitted OR if there are validation errors present
              // This ensures errors show even if touched state hasn't updated yet after setTouched() call
              // IMPORTANT: For concession amount fields, show error immediately if error exists and field has value (real-time validation)
              // This allows errors to appear while typing, not just after blur or button click
              // For other fields, if field has a valid value, don't show error even if validation was triggered
              const hasAnyErrors = Object.keys(errors).length > 0;
              // For concession amount fields: show error immediately if error exists and field has a value (real-time while typing)
              // The field is marked as touched on change, so errors will show immediately
              // For other fields: show error only if no valid value
              const fieldError = isConcessionAmountField
                ? (hasError && values[fname] ? hasError : null) // Show error immediately if exists and field has value
                : (hasError && !hasValidValue ? hasError : null);

              return (
                <div key={fname} className={styles.clgAppSaleFieldCell}>
                  {renderField(fname, fieldMap, {
                    value: values[fname] ?? "",
                    onChange: onChangeHandler,
                    onBlur: handleBlur, // Add Formik's handleBlur for proper touched on blur
                    error: fieldError,
                  })}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConcessionInformation;