import React from "react";
import Inputbox from "../../../../../../../widgets/Inputbox/InputBox";
import Dropdown from "../../../../../../../widgets/Dropdown/Dropdown";
import styles from "./SchoolSaleConfAcadeInfo.module.css";
import useSchoolAcademicFormState from "./hooks/useSchoolAcademicFormState";
 
const SchoolSaleConfAcadeInfo = ({ formData, onChange, overviewData, errors = {} }) => {
  const state = useSchoolAcademicFormState({ formData, onChange, overviewData });
 
  /**
   * Handler for Score App No input - only allows numbers and max 12 digits
   */
  const handleScoreAppNoChange = (e) => {
    const { name, value } = e.target;
    // Remove any non-digit characters
    const digitsOnly = value.replace(/\D/g, "");
    // Limit to 12 digits
    const limitedDigits = digitsOnly.slice(0, 12);
   
    // Create a new event with the filtered value
    const filteredEvent = {
      ...e,
      target: {
        ...e.target,
        name,
        value: limitedDigits,
      },
    };
   
    onChange(filteredEvent);
  };
 
  /**
   * Handler for Score Marks input - only allows numbers and max 3 digits
   */
  const handleScoreMarksChange = (e) => {
    const { name, value } = e.target;
    // Remove any non-digit characters
    const digitsOnly = value.replace(/\D/g, "");
    // Limit to 3 digits
    const limitedDigits = digitsOnly.slice(0, 3);
   
    // Create a new event with the filtered value
    const filteredEvent = {
      ...e,
      target: {
        ...e.target,
        name,
        value: limitedDigits,
      },
    };
   
    onChange(filteredEvent);
  };
 
  return (
    <div className={styles.section}>
      {/* Title */}
      <div className={styles.headerRow}>
        <span className={styles.sectionTitle}>Academic Information</span>
        <div className={styles.line}></div>
      </div>
 
      {/* Row 1 */}
      <div className={styles.formGrid}>
        <div>
          <Dropdown
            dropdownname="Orientation Name"
            name="orientationName"
            results={state.orientationsLoading ? [] : state.orientationOptions}
            value={state.getOrientationDisplayValue(formData.orientationName)}
            onChange={state.handleOrientationChange}
            disabled={state.orientationsLoading || !state.branchId || !state.joiningClassId}
          />
          {errors.orientationName && (
            <span style={{ color: 'red', fontSize: 12 }}>{errors.orientationName}</span>
          )}
        </div>
 
        <div>
          <Inputbox
            label={
              <>
                <span>Orientation Fee</span>
                <span style={{ color: 'red', marginLeft: '2px' }}>*</span>
              </>
            }
            name="orientationFee"
            placeholder="0.0"
            value={formData.orientationFee}
            // Orientation Fee should not be editable in confirmation screen
            readOnly={true}
          />
          {errors.orientationFee && (
            <span style={{ color: 'red', fontSize: 12 }}>{errors.orientationFee}</span>
          )}
        </div>
 
        <div>
          <Inputbox
            label={
              <>
                <span>Score App No</span>
           
              </>
            }
            name="scoreAppNo"
            placeholder="Enter score app No"
            value={formData.scoreAppNo}
            onChange={handleScoreAppNoChange}
            type="tel"
          />
          {errors.scoreAppNo && (
            <span style={{ color: 'red', fontSize: 12 }}>{errors.scoreAppNo}</span>
          )}
        </div>
      </div>
 
      {/* Row 2 */}
      <div className={styles.formGrid}>
        <div>
          <Inputbox
            label={
              <>
                <span>Score Marks</span>
                {/* <span style={{ color: 'red', marginLeft: '2px' }}>*</span> */}
              </>
            }
            name="scoreMarks"
            placeholder="Enter marks"
            value={formData.scoreMarks}
            onChange={handleScoreMarksChange}
            type="tel"
          />
          {/* {errors.scoreMarks && (
            <span style={{ color: 'red', fontSize: 12 }}>{errors.scoreMarks}</span>
          )} */}
        </div>
 
        <div>
          <Dropdown
            dropdownname="Food Type"
            name="foodType"
            results={state.foodTypesLoading ? [] : state.foodTypeOptions}
            value={state.getFoodTypeDisplayValue(formData.foodType)}
            onChange={state.handleFoodTypeChange}
            disabled={state.foodTypesLoading}
            required={true}
          />
          {errors.foodType && (
            <span style={{ color: 'red', fontSize: 12 }}>{errors.foodType}</span>
          )}
        </div>
 
        <div>
          <Dropdown
            dropdownname="Blood Group"
            name="bloodGroup"
            results={state.bloodGroupsLoading ? [] : state.bloodGroupOptions}
            value={state.getBloodGroupDisplayValue(formData.bloodGroup)}
            onChange={state.handleBloodGroupChange}
            disabled={state.bloodGroupsLoading}
            required={true}
          />
          {errors.bloodGroup && (
            <span style={{ color: 'red', fontSize: 12 }}>{errors.bloodGroup}</span>
          )}
        </div>
      </div>
 
      {/* Row 3 */}
      <div className={styles.formGrid}>
        <div>
          <Dropdown
            dropdownname="Caste"
            name="caste"
            results={state.castesLoading ? [] : state.casteOptions}
            value={state.getCasteDisplayValue(formData.caste)}
            onChange={state.handleCasteChange}
            disabled={state.castesLoading}
            required={true}
          />
          {errors.caste && (
            <span style={{ color: 'red', fontSize: 12 }}>{errors.caste}</span>
          )}
        </div>
 
        <div>
          <Dropdown
            dropdownname="Religion"
            name="religion"
            results={state.religionsLoading ? [] : state.religionOptions}
            value={state.getReligionDisplayValue(formData.religion)}
            onChange={state.handleReligionChange}
            disabled={state.religionsLoading}
            required={true}
          />
          {errors.religion && (
            <span style={{ color: 'red', fontSize: 12 }}>{errors.religion}</span>
          )}
        </div>
      </div>
    </div>
  );
};
 
export default SchoolSaleConfAcadeInfo;
 
 
 
 