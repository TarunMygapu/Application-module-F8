import React from "react";
import Inputbox from "../../../../../../widgets/Inputbox/InputBox";
import Dropdown from "../../../../../../widgets/Dropdown/Dropdown";
import styles from "./SchoolSaleConfParentInfo.module.css";
import useSchoolParentFormState from "./hooks/useSchoolParentFormState";

const SchoolSaleConfParentInfo = ({ formData, onChange, errors = {} }) => {
  const state = useSchoolParentFormState({ formData, onChange });

  /**
   * Handler for phone number input - only allows numbers and max 10 digits
   */
  const handlePhoneChange = (e) => {
    const { name, value } = e.target;
    // Remove any non-digit characters
    const digitsOnly = value.replace(/\D/g, "");
    // Limit to 10 digits
    const limitedDigits = digitsOnly.slice(0, 10);
    
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
   * Handler for name input - only allows alphabets and spaces, max 20 characters
   */
  const handleNameChange = (e) => {
    const { name, value } = e.target;
    // Remove any non-alphabetic characters (keep only letters and spaces)
    const alphabetsOnly = value.replace(/[^a-zA-Z\s]/g, "");
    // Limit to 20 characters
    const limitedName = alphabetsOnly.slice(0, 20);
    
    // Create a new event with the filtered value
    const filteredEvent = {
      ...e,
      target: {
        ...e.target,
        name,
        value: limitedName,
      },
    };
    
    onChange(filteredEvent);
  };

  return (
    <div className={styles.section}>
      {/* Section Header */}
      <div className={styles.headerRow}>
        <span className={styles.sectionTitle}>Parent Information</span>
        <div className={styles.line}></div>
      </div>

      {/* Father Row 1 */}
      <div className={styles.formGrid}>
        <div>
          <Inputbox
            label={<><span>Father Name</span><span className={styles.mandatoryAsterisk}>*</span></>}
            name="fatherName"
            placeholder="Enter full name"
            value={formData.fatherName}
            onChange={handleNameChange}
          />
          {errors.fatherName && (
            <span className={styles.errorMessage}>{errors.fatherName}</span>
          )}
        </div>

        <div className={styles.inputWithIcon}>
          <Inputbox
            label={<><span>Phone Number</span><span className={styles.mandatoryAsterisk}>*</span></>}
            name="fatherPhone"
            placeholder="Enter phone number"
            value={formData.fatherPhone}
            onChange={handlePhoneChange}
            type="tel"

          />
          <svg
            className={styles.inputIcon}
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              d="M18.333 14.1v2.5c.001.232-.047.462-.14.675a1.67 1.67 0 0 1-.994.959c-.22.074-.453.102-.684.081A17.09 17.09 0 0 1 9.325 15.708 17.11 17.11 0 0 1 4.325 10.708 17.1 17.1 0 0 1 1.767 3.483c-.02-.23.008-.462.082-.681.074-.22.194-.421.35-.592.155-.17.345-.307.556-.4.212-.094.44-.143.672-.143H5.925c.404-.004.796.139 1.103.403.307.263.507.629.563 1.03.105.8.301 1.586.583 2.342.112.298.136.622.07.933-.067.312-.221.598-.445.825L6.742 8.258a14.35 14.35 0 0 0 5 5l1.058-1.058c.227-.224.513-.378.825-.445.312-.066.636-.042.934.07.756.282 1.542.478 2.342.583.404.056.77.256 1.034.563.264.307.407.699.403 1.103Z"
              stroke="#4E4E4E"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {errors.fatherPhone && (
            <span className={styles.errorMessage}>{errors.fatherPhone}</span>
          )}
        </div>

        <div className={styles.inputWithIcon}>
          <Inputbox
            label={<><span>Email</span><span className={styles.mandatoryAsterisk}>*</span></>}
            name="fatherEmail"
            placeholder="Enter Email"
            value={formData.fatherEmail}
            onChange={onChange}
            type="email"
          />
          <svg
            className={styles.inputIcon}
           width="16"
            height="16"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              d="M18.333 5c0-.917-.75-1.667-1.667-1.667H3.333C2.417 3.333 1.667 4.083 1.667 5m16.666 0v10c0 .917-.75 1.667-1.667 1.667H3.333C2.417 16.667 1.667 15.917 1.667 15V5m16.666 0L10 10.833 1.667 5"
              stroke="#4E4E4E"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {errors.fatherEmail && (
            <span className={styles.errorMessage}>{errors.fatherEmail}</span>
          )}
        </div>
      </div>

      {/* Father Row 2 */}
      <div className={styles.formGrid}>
        <div>
          <Dropdown
            dropdownname="Sector"
            name="fatherSector"
            results={state.sectorsLoading ? [] : state.sectorOptions}
            value={state.getSectorDisplay(formData.fatherSector)}
            onChange={state.handleSectorChangeWithReset("fatherSector")}
            disabled={state.sectorsLoading}
            required={true}
          />
          {errors.fatherSector && (
            <span className={styles.errorMessage}>{errors.fatherSector}</span>
          )}
        </div>
        <div>
          <Dropdown
            dropdownname="Occupation"
            name="fatherOccupation"
            results={state.occupationsLoading ? [] : state.fatherOccupationOptions}
            value={state.getOccupationDisplay(formData.fatherOccupation)}
            onChange={state.handleOccupationChange("fatherOccupation")}
            disabled={state.occupationsLoading}
            required={true}
          />
          {errors.fatherOccupation && (
            <span className={styles.errorMessage}>{errors.fatherOccupation}</span>
          )}
        </div>
        {state.showFatherOtherOccupation && (
          <Inputbox
            label="Other Occupation Name"
            name="fatherOtherOccupation"
            placeholder="Enter other occupation name"
            value={formData.fatherOtherOccupation}
            onChange={onChange}
          />
        )}
      </div>

      {/* Mother Row 1 */}
      <div className={styles.formGrid}>
        <div>
          <Inputbox
            label={<><span>Mother Name</span><span className={styles.mandatoryAsterisk}>*</span></>}
            name="motherName"
            placeholder="Enter full name"
            value={formData.motherName}
            onChange={handleNameChange}
          />
          {errors.motherName && (
            <span className={styles.errorMessage}>{errors.motherName}</span>
          )}
        </div>
        <div className={styles.inputWithIcon}>
          <Inputbox
            label={<><span>Phone Number</span><span className={styles.mandatoryAsterisk}>*</span></>}
            name="motherPhone"
            placeholder="Enter phone number"
            value={formData.motherPhone}
            onChange={handlePhoneChange}
            type="tel"
          />
          <svg
            className={styles.inputIcon}
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              d="M18.333 14.1v2.5c.001.232-.047.462-.14.675a1.67 1.67 0 0 1-.994.959c-.22.074-.453.102-.684.081A17.09 17.09 0 0 1 9.325 15.708 17.11 17.11 0 0 1 4.325 10.708 17.1 17.1 0 0 1 1.767 3.483c-.02-.23.008-.462.082-.681.074-.22.194-.421.35-.592.155-.17.345-.307.556-.4.212-.094.44-.143.672-.143H5.925c.404-.004.796.139 1.103.403.307.263.507.629.563 1.03.105.8.301 1.586.583 2.342.112.298.136.622.07.933-.067.312-.221.598-.445.825L6.742 8.258a14.35 14.35 0 0 0 5 5l1.058-1.058c.227-.224.513-.378.825-.445.312-.066.636-.042.934.07.756.282 1.542.478 2.342.583.404.056.77.256 1.034.563.264.307.407.699.403 1.103Z"
              stroke="#4E4E4E"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {errors.motherPhone && (
            <span className={styles.errorMessage}>{errors.motherPhone}</span>
          )}
        </div>

        <div className={styles.inputWithIcon}>
          <Inputbox
            label="Email"
            name="motherEmail"
            placeholder="Enter Email"
            value={formData.motherEmail}
            onChange={onChange}
            type="email"
            required={true}
          />
          <svg
            className={styles.inputIcon}
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              d="M18.333 5c0-.917-.75-1.667-1.667-1.667H3.333C2.417 3.333 1.667 4.083 1.667 5m16.666 0v10c0 .917-.75 1.667-1.667 1.667H3.333C2.417 16.667 1.667 15.917 1.667 15V5m16.666 0L10 10.833 1.667 5"
              stroke="#4E4E4E"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
       
          {errors.motherEmail && (
            <span className={styles.errorMessage}>{errors.motherEmail}</span>
          )}
        </div>
      </div>

      {/* Mother Row 2 */}
      <div className={styles.formGrid}>
        <div>
          <Dropdown
            dropdownname="Sector"
            name="motherSector"
            results={state.sectorsLoading ? [] : state.sectorOptions}
            value={state.getSectorDisplay(formData.motherSector)}
            onChange={state.handleSectorChangeWithReset("motherSector")}
            disabled={state.sectorsLoading}
            required={true}
          />
          {errors.motherSector && (
            <span className={styles.errorMessage}>{errors.motherSector}</span>
          )}
        </div>
        <div>
          <Dropdown
            dropdownname="Occupation"
            name="motherOccupation"
            results={state.occupationsLoading ? [] : state.motherOccupationOptions}
            value={state.getOccupationDisplay(formData.motherOccupation)}
            onChange={state.handleOccupationChange("motherOccupation")}
            disabled={state.occupationsLoading}
            required={true}
          />
          {errors.motherOccupation && (
            <span className={styles.errorMessage}>{errors.motherOccupation}</span>
          )}
        </div>
        {state.showMotherOtherOccupation && (
          <Inputbox
            label="Other Occupation Name"
            name="motherOtherOccupation"
            placeholder="Enter other occupation name"
            value={formData.motherOtherOccupation}
            onChange={onChange}
          />
        )}
      </div>
    </div>
  );
};

export default SchoolSaleConfParentInfo;
