import React, { useEffect, useRef, useMemo } from "react";
import Inputbox from "../../../../../../../widgets/Inputbox/InputBox";
import Dropdown from "../../../../../../../widgets/Dropdown/Dropdown";
import styles from "./CollegeConceInfoForms.module.css";
import useCollegeConcessionFormState from "./hooks/useCollegeConcessionFormState";
import ButtonRightArrow from "../../../../../../../assets/applicationassets/application-status/school-sale-conf-assets/ButtonRightArrow";

const CollegeConceInfoForms = ({ formData, onChange, academicYear, academicYearId, overviewData, errors = {}, joiningClassName = "" }) => {
  const state = useCollegeConcessionFormState({ formData, onChange, academicYear, academicYearId, overviewData, joiningClassName });
  
  // Get joining class from multiple sources (prop, overviewData, formData)
  // Priority: prop > overviewData > formData
  // Use useMemo to recalculate when joiningClassName or overviewData changes
  const shouldHideFirstYear = useMemo(() => {
    const actualClassName = joiningClassName || overviewData?.className || overviewData?.joiningClassName || formData?.joiningClass || "";
    
    if (!actualClassName) return false;
    
    // Check if joining class is INTER 2 - hide 1st year concession in that case
    // Handle variations: "INTER2", "INTER 2", "Inter 2", "inter2", "INTER-2", etc.
    // Remove all spaces, hyphens, underscores, and any other non-alphanumeric chars, convert to uppercase
    const normalizedClassName = String(actualClassName)
      .toUpperCase()
      .trim()
      .replace(/\s+/g, "")
      .replace(/-/g, "")
      .replace(/_/g, "")
      .replace(/[^A-Z0-9]/g, "");
    
    // Check if it contains "INTER2" (in case there are extra characters)
    const isInter2 = normalizedClassName === "INTER2" || normalizedClassName.includes("INTER2");
    
    return isInter2;
  }, [joiningClassName, overviewData?.className, overviewData?.joiningClassName, formData?.joiningClass]);

  // Track if user has manually edited any Concession Written on Application fields
  const userEdited = useRef({});

  useEffect(() => {
    // Only auto-populate if user hasn't edited
    if (!userEdited.current.concessionAmount && overviewData?.concessionAmount && formData?.concessionAmount !== overviewData.concessionAmount) {
      onChange({ target: { name: "concessionAmount", value: overviewData.concessionAmount } });
    }
    if (!userEdited.current.concessionReferredBy && overviewData?.concessionReferredBy && formData?.concessionReferredBy !== overviewData.concessionReferredBy) {
      onChange({ target: { name: "concessionReferredBy", value: overviewData.concessionReferredBy } });
    }
    if (!userEdited.current.reason && overviewData?.reason && formData?.reason !== overviewData.reason) {
      onChange({ target: { name: "reason", value: overviewData.reason } });
    }
  }, [overviewData]);

  // Apply concession amount to 2nd year when 1st year is hidden (INTER 2) and checkbox is checked
  // BUT only if secondYearConcession is not already populated from overview data
  useEffect(() => {
    if (shouldHideFirstYear && formData?.concessionWrittenOnApplication && formData?.concessionAmount) {
      // Only apply if secondYearConcession is empty (not already populated from overview)
      // This prevents overwriting the correct 2nd year concession amount from overview
      if (!formData?.secondYearConcession || formData.secondYearConcession === "") {
        const digitsOnly = String(formData.concessionAmount).replace(/\D/g, "");
        if (digitsOnly) {
          onChange({ target: { name: "secondYearConcession", value: digitsOnly } });
          // Set 2nd year concession type ID
          const typeId = state.getConcessionTypeIdByLabel?.("2nd year");
          if (typeId !== undefined) {
            onChange({ target: { name: "secondYearConcessionTypeId", value: typeId } });
          }
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldHideFirstYear, formData?.concessionWrittenOnApplication, formData?.concessionAmount, formData?.secondYearConcession]);

  // Mark user edit on change
  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    userEdited.current[name] = true;
    
    // For concessionAmount, filter to numbers only
    if (name === 'concessionAmount') {
      const digitsOnly = value.replace(/\D/g, "");
      const filteredEvent = {
        ...e,
        target: {
          ...e.target,
          name,
          value: digitsOnly,
        },
      };
      onChange(filteredEvent);
      
      // If 1st year is hidden (INTER 2), apply the amount to 2nd year concession
      // BUT only if secondYearConcession is not already populated from overview data
      if (shouldHideFirstYear && formData?.concessionWrittenOnApplication && digitsOnly) {
        // Only apply if secondYearConcession is empty (not already populated from overview)
        if (!formData?.secondYearConcession || formData.secondYearConcession === "") {
          // Apply to 2nd year concession
          onChange({ target: { name: "secondYearConcession", value: digitsOnly } });
          // Set 2nd year concession type ID
          const typeId = state.getConcessionTypeIdByLabel?.("2nd year");
          if (typeId !== undefined) {
            onChange({ target: { name: "secondYearConcessionTypeId", value: typeId } });
          }
        }
      }
    } else {
      onChange(e);
    }
  };

  return (
    <div className={styles.section}>
      {/* Title */}
      <div className={styles.headerRow}>
        <span className={styles.title}>Concession Information</span>
        <div className={styles.line}></div>
      </div>

      {/* Row 1 */}
      <div className={styles.grid}>
        {!shouldHideFirstYear && (
          <div>
            <Inputbox
              label="1st Year Concession"
              name="firstYearConcession"
              placeholder="Enter 1st Year Concession"
              value={formData?.firstYearConcession || ""}
              onChange={state.handleFirstYearConcessionChange}
              type="tel"
            />
            {errors.firstYearConcession && (
              <span className={styles.errorMessage}>{errors.firstYearConcession}</span>
            )}
          </div>
        )}

        <div>
          <Inputbox
            label="2nd Year Concession"
            name="secondYearConcession"
            placeholder="Enter 2nd Year Concession"
            value={formData?.secondYearConcession || ""}
            onChange={state.handleSecondYearConcessionChange}
            type="tel"
          />
          {errors.secondYearConcession && (
            <span className={styles.errorMessage}>{errors.secondYearConcession}</span>
          )}
        </div>

        <div>
          <Dropdown
            dropdownname="Referred By"
            name="referredBy"
            results={state.dropdownOptions}
            onChange={state.handleReferredByChange}
            value={state.selectedReferredBy || state.getReferredByDisplayValue(formData?.referredBy)}
          />
          {errors.referredBy && (
            <span className={styles.errorMessage}>{errors.referredBy}</span>
          )}
        </div>
      </div>

      {/* Row 2 */}
      <div className={styles.grid}>
        <div>
          <Inputbox
            label="Description"
            name="description"
            placeholder="Enter Description"
            value={formData?.description || ""}
            onChange={onChange}
          />
          {errors.description && (
            <span className={styles.errorMessage}>{errors.description}</span>
          )}
        </div>

        <div>
          <Dropdown
            dropdownname="Authorized By"
            name="authorizedBy"
            results={state.dropdownOptions}
            onChange={state.handleAuthorizedByChange}
            value={state.selectedAuthorizedBy || state.getAuthorizedByDisplayValue(formData?.authorizedBy)}
          />
          {errors.authorizedBy && (
            <span className={styles.errorMessage}>{errors.authorizedBy}</span>
          )}
        </div>

        <div>
          <Dropdown
            dropdownname="Concession Reason "
            name="concessionReason"
            results={state.concessionReasonOptions}
            onChange={state.handleConcessionReasonChange}
            value={state.selectedConcessionReason || state.getConcessionReasonDisplayValue(formData?.concessionReason)}
          />
          {errors.concessionReason && (
            <span className={styles.errorMessage}>{errors.concessionReason}</span>
          )}
        </div>
      </div>

      {/* Concession Written on Application Section - Only show when overview has valid concession data */}
  {/* Always show Concession Written on Application fields, auto-populate but allow editing */}
  <>
    <div className={styles.checkboxRow}>
      <label className={styles.checkboxLabel}>
        <input 
          type="checkbox" 
          className={styles.checkbox}
          checked={!!formData?.concessionWrittenOnApplication}
          onChange={state.handleCheckboxChange}
        />
        <span>Concession Written on Application</span>
      </label>
      <div className={styles.line}></div>
    </div>
    {!!formData?.concessionWrittenOnApplication && (
      <div className={styles.grid}>
        <div>
          <Inputbox
            label="Concession Amount"
            name="concessionAmount"
            placeholder="Enter Concession Amount"
            value={formData?.concessionAmount ?? overviewData?.concessionAmount ?? "10,000"}
            onChange={handleFieldChange}
            type="tel"
          />
          {errors.concessionAmount && (
            <span className={styles.errorMessage}>{errors.concessionAmount}</span>
          )}
        </div>
        <div>
          <Dropdown
            dropdownname="Concession Referred By"
            name="concessionReferredBy"
            results={state.dropdownOptions}
            onChange={state.handleConcessionReferredByChange}
            value={state.selectedConcessionReferredBy ?? formData?.concessionReferredBy ?? overviewData?.concessionReferredBy ?? ""}
          />
          {errors.concessionReferredBy && (
            <span className={styles.errorMessage}>{errors.concessionReferredBy}</span>
          )}
        </div>
        <div>
          <Inputbox
            label="Reason"
            name="reason"
            placeholder="Enter Reason"
            value={formData?.reason ?? overviewData?.reason ?? ""}
            onChange={handleFieldChange}
          />
          {errors.reason && (
            <span className={styles.errorMessage}>{errors.reason}</span>
          )}
        </div>
      </div>
    )}
  </>
    </div>
  );
};

export default CollegeConceInfoForms;
