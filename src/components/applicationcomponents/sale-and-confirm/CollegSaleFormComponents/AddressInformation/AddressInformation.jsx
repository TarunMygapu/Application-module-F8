import React, { useState, useEffect, useMemo, useRef } from "react";
import { useFormikContext } from "formik";
import styles from "./AddressInformation.module.css";

import {
  addressInformationFields,
  addressInformationFieldsLayout
} from "./addressInformationFields";

import { renderField } from "../../../../../utils/renderField";

import {
  useGetPincode,
  useGetMandalsByDistrict,
  useGetCityByDistrict,
} from "../../../../../queries/applicationqueries/saleApis/clgSaleApis";
import { toTitleCase } from "../../../../../utils/toTitleCase";

const AddressInformation = () => {
  const formik = useFormikContext();
  const { values, setFieldValue, setFieldTouched, setFieldError, errors, touched, submitCount, handleChange, handleBlur } = formik;
  const [selectedDistrictId, setSelectedDistrictId] = useState(null);
  const hasTouchedOnSubmitRef = useRef(false);
  // Track if validation was manually triggered (Application Sale button clicked)
  const validationTriggeredRef = useRef(false);
  const previousErrorsRef = useRef({});

  // Detect when validation is triggered by checking if errors appear
  useEffect(() => {
    const currentErrorKeys = Object.keys(errors);
    const previousErrorKeys = Object.keys(previousErrorsRef.current);

    // If errors appeared (especially when form is touched), it means validation was triggered
    if (currentErrorKeys.length > 0 && currentErrorKeys.length !== previousErrorKeys.length) {
      // Check if any fields are touched (which happens when handleProceedToSale sets all fields as touched)
      const hasTouchedFields = Object.keys(touched).some(key => touched[key] === true);
      if (hasTouchedFields) {
        validationTriggeredRef.current = true;
      }
    }

    // Update previous errors
    previousErrorsRef.current = { ...errors };
  }, [errors, touched]);

  /* -------------------------
      API CALL - PINCODE
  ------------------------- */
  // Convert pincode to string and ensure it's 6 digits for API call
  const pincodeString = values.pincode ? String(values.pincode).trim() : "";
  const isValidPincode = pincodeString.length === 6 && /^\d{6}$/.test(pincodeString);
  const { data: pincodeData } = useGetPincode(isValidPincode ? pincodeString : "");

  /* -----------------------------------------------------
      HANDLE PINCODE RESPONSE CORRECTLY (IMPORTANT)
  ------------------------------------------------------ */
  useEffect(() => {
    // pincode must be 6 digits + API must have returned data
    const pincodeValue = values.pincode ? String(values.pincode).trim() : "";
    const isPincodeValid = pincodeValue.length === 6 && /^\d{6}$/.test(pincodeValue);

    if (isPincodeValid && pincodeData) {
      // Only update if the data is different to avoid unnecessary re-renders
      const currentState = values.state || "";
      const currentDistrict = values.district || "";
      const newState = pincodeData.stateName || "";
      const newDistrict = pincodeData.districtName || "";

      // Set state and district names if they're different
      if (newState && newState !== currentState) {
        setFieldValue("state", newState);
      }
      if (newDistrict && newDistrict !== currentDistrict) {
        setFieldValue("district", newDistrict);
      }

      // Store IDs if available
      if (pincodeData.stateId && (!values.stateId || values.stateId !== pincodeData.stateId)) {
        setFieldValue("stateId", pincodeData.stateId);
      }
      if (pincodeData.districtId && (!values.districtId || values.districtId !== pincodeData.districtId)) {
        setFieldValue("districtId", pincodeData.districtId);
        setSelectedDistrictId(pincodeData.districtId);
      }
    } else if (!isPincodeValid && values.pincode) {
      // Only reset if pincode was previously valid and now invalid
      // Don't reset if pincode is empty (might be initial state)
      const wasValid = String(values.pincode || "").length === 6;
      if (wasValid) {
        setFieldValue("state", "");
        setFieldValue("district", "");
        setFieldValue("mandal", "");
        setFieldValue("city", "");
        setFieldValue("stateId", "");
        setFieldValue("districtId", "");
        setFieldValue("mandalId", "");
        setFieldValue("cityId", "");
        setSelectedDistrictId(null);
      }
    }
  }, [pincodeData, values.pincode, values.state, values.district, values.stateId, values.districtId, setFieldValue]);

  // Sync selectedDistrictId when districtId is set directly (from auto-population)
  // This is critical to trigger the mandal and city APIs
  useEffect(() => {
    const districtIdValue = values.districtId;
    if (districtIdValue && districtIdValue !== 0 && districtIdValue !== null && districtIdValue !== "") {
      const districtIdNum = Number(districtIdValue);
      if (districtIdNum !== selectedDistrictId && !isNaN(districtIdNum)) {
        setSelectedDistrictId(districtIdNum);
      }
    } else if (!districtIdValue && selectedDistrictId) {
      // Clear selectedDistrictId if districtId is cleared
      setSelectedDistrictId(null);
    }
  }, [values.districtId, selectedDistrictId]);

  /* -------------------------
      FETCH MANDALS & CITY
  ------------------------- */
  // Use effective district ID to ensure API calls work even if state updates are delayed
  const effectiveDistrictId = selectedDistrictId || values.districtId;
  const { data: mandalRaw = [], isLoading: mandalLoading, error: mandalError } = useGetMandalsByDistrict(effectiveDistrictId ? Number(effectiveDistrictId) : null);
  const { data: cityRaw = [], isLoading: cityLoading, error: cityError } = useGetCityByDistrict(effectiveDistrictId ? Number(effectiveDistrictId) : null);

  /* -------------------------
      OPTIONS
  ------------------------- */
  const mandalOptions = useMemo(
    () => {
      if (mandalLoading) return ['Loading mandals...'];
      if (mandalError) return ['Error loading mandals. Please check district.'];
      const options = mandalRaw.map((m) => toTitleCase(m.name ?? ""));
      return options;
    },
    [mandalRaw, mandalLoading, mandalError]
  );

  const cityOptions = useMemo(
    () => {
      if (cityLoading) return ['Loading cities...'];
      if (cityError) return ['Error loading cities. Please check district.'];
      return cityRaw.map((c) => toTitleCase(c.name ?? ""));
    },
    [cityRaw, cityLoading, cityError]
  );

  // Create maps for ID lookup
  const mandalNameToId = useMemo(() => {
    const map = new Map();
    mandalRaw.forEach((m) => {
      if (m.name && m.id) {
        map.set(toTitleCase(m.name), m.id);
      }
    });
    return map;
  }, [mandalRaw]);

  const cityNameToId = useMemo(() => {
    const map = new Map();
    cityRaw.forEach((c) => {
      if (c.name && c.id) {
        map.set(toTitleCase(c.name), c.id);
      }
    });
    return map;
  }, [cityRaw]);

  // Force touch and full validation for all required fields on form submit (only once per submit attempt)
  useEffect(() => {
    if (submitCount > 0 && !hasTouchedOnSubmitRef.current) {
      hasTouchedOnSubmitRef.current = true;
      const requiredFields = ['doorNo', 'streetName', 'pincode', 'mandal', 'city'];
      requiredFields.forEach((field) => {
        setFieldTouched(field, true, false); // false to avoid triggering validation again
      });
      // Trigger full form validation to ensure errors are up-to-date
      formik.validateForm();
    }
  }, [submitCount, formik, setFieldTouched, values.city, touched.city, errors.city]); // Added dependencies for re-trigger if needed

  // Reset the ref when submitCount resets (e.g., on successful submit or reset)
  useEffect(() => {
    if (submitCount === 0) {
      hasTouchedOnSubmitRef.current = false;
    }
  }, [submitCount]);

  // Watch for errors and ensure city field is touched when errors exist (for manual validation)
  // Track when validation is triggered (errors appear after Application Sale button click)
  useEffect(() => {
    const errorKeys = Object.keys(errors);
    // If errors appear and submitCount > 0, validation was triggered by button click
    if (errorKeys.length > 0 && submitCount > 0) {
      validationTriggeredRef.current = true;
    }
    // If errors appear and many fields are being touched (setTouched was called), validation was triggered
    if (errorKeys.length > 0) {
      const touchedCount = Object.keys(touched).filter(key => touched[key] === true).length;
      // If many fields are touched at once, it means setTouched was called (validation triggered)
      if (touchedCount > 5) {
        validationTriggeredRef.current = true;
      }
    }

    // Auto-touch city field if validation was triggered and city has error
    if (validationTriggeredRef.current && errors.city && !touched.city) {
      setFieldTouched('city', true, false);
    }
  }, [errors, touched, setFieldTouched, submitCount]);

  // Sync IDs when labels are present but IDs are missing (for pre-populated data)
  useEffect(() => {
    // Sync stateId if state is present but stateId is missing
    if (values.state && (!values.stateId || values.stateId === 0 || values.stateId === null)) {
      // Try to find state ID from pincode data if available
      if (pincodeData?.stateId) {
        setFieldValue("stateId", pincodeData.stateId);
      }
    }

    // Sync districtId if district is present but districtId is missing
    if (values.district && (!values.districtId || values.districtId === 0 || values.districtId === null)) {
      // Try to find district ID from pincode data if available
      if (pincodeData?.districtId) {
        setFieldValue("districtId", pincodeData.districtId);
        setSelectedDistrictId(pincodeData.districtId);
      }
    }

    // Sync mandalId if mandal is present but mandalId is missing
    // Wait for mandal API data to load before syncing
    if (values.mandal && (!values.mandalId || values.mandalId === 0 || values.mandalId === null)) {
      // Only sync if we have mandal data loaded
      if (mandalNameToId.size > 0) {
        const originalMandal = String(values.mandal).trim();
        const mandalLabel = toTitleCase(originalMandal);
        let mandalIdValue = mandalNameToId.get(mandalLabel);

        // Try exact match first
        if (mandalIdValue) {
          setFieldValue("mandalId", mandalIdValue);
          // Also ensure the mandal value matches the dropdown format (toTitleCase)
          if (values.mandal !== mandalLabel) {
            setFieldValue("mandal", mandalLabel);
          }
          setFieldTouched("mandal", true); // Touch after sync
        } else {
          // Try case-insensitive match
          let found = false;
          for (const [key, id] of mandalNameToId.entries()) {
            if (key.toLowerCase() === mandalLabel.toLowerCase()) {
              setFieldValue("mandalId", id);
              setFieldValue("mandal", key); // Update to exact match from dropdown
              setFieldTouched("mandal", true); // Touch after sync
              found = true;
              break;
            }
          }

          // If still not found, try without toTitleCase
          if (!found) {
            for (const [key, id] of mandalNameToId.entries()) {
              if (key.toLowerCase() === originalMandal.toLowerCase() ||
                toTitleCase(key).toLowerCase() === originalMandal.toLowerCase()) {
                setFieldValue("mandalId", id);
                setFieldValue("mandal", key); // Update to exact match from dropdown
                setFieldTouched("mandal", true); // Touch after sync
                found = true;
                break;
              }
            }
          }
        }
      }
    }

    // Sync cityId if city is present but cityId is missing
    // Wait for city API data to load before syncing
    if (values.city && (!values.cityId || values.cityId === 0 || values.cityId === null)) {
      // Only sync if we have city data loaded
      if (cityNameToId.size > 0) {
        const cityLabel = toTitleCase(values.city);
        let cityIdValue = cityNameToId.get(cityLabel);
        if (cityIdValue) {
          setFieldValue("cityId", cityIdValue);
          setFieldValue("city", cityLabel); // Ensure value matches
          setFieldTouched("city", true); // Force touch to trigger validation
        } else {
          // Try case-insensitive match
          for (const [key, id] of cityNameToId.entries()) {
            if (key.toLowerCase() === cityLabel.toLowerCase()) {
              setFieldValue("cityId", id);
              setFieldValue("city", key); // Update to exact match from dropdown
              setFieldTouched("city", true); // Force touch to trigger validation
              break;
            }
          }
        }
      }
    }
  }, [
    values.state,
    values.district,
    values.mandal,
    values.city,
    values.stateId,
    values.districtId,
    values.mandalId,
    values.cityId,
    pincodeData,
    mandalNameToId,
    cityNameToId,
    setFieldValue,
    setFieldTouched,
    mandalRaw,
    cityRaw,
    selectedDistrictId,
  ]);

  /* -------------------------
      FIELD MAP
  ------------------------- */
  const fieldMap = useMemo(() => {
    const map = {};

    addressInformationFields.forEach((f) => {
      map[f.name] = { ...f };

      if (f.name === "mandal") map[f.name].options = mandalOptions;
      if (f.name === "city") map[f.name].options = cityOptions;
    });

    return map;
  }, [mandalOptions, cityOptions]);

  // Custom onChange that integrates Formik's handleChange for proper touched and validation triggering
  const customOnChange = (fname) => (e) => {
    handleChange(e); // This sets value and touched automatically
    const selectedValue = e.target.value;

    // Clear error immediately when a valid value is selected
    if (selectedValue && selectedValue !== "Select Mandal" && selectedValue !== "Select City" && selectedValue !== "-") {
      if (errors[fname]) {
        setFieldError(fname, undefined);
      }
    }

    // Store IDs when dropdowns are selected (after handleChange)
    if (fname === "mandal" && mandalNameToId.has(selectedValue)) {
      const id = mandalNameToId.get(selectedValue);
      setFieldValue("mandalId", id);
      // Ensure mandal error is cleared
      if (errors.mandal) {
        setFieldError("mandal", undefined);
        // Trigger validation after a small delay to ensure error is cleared
        setTimeout(() => {
          formik.validateField("mandal").then(() => {
            // Double-check error is cleared
            if (formik.errors.mandal) {
              setFieldError("mandal", undefined);
            }
          });
        }, 50);
      }
    } else if (fname === "city" && cityNameToId.has(selectedValue)) {
      const id = cityNameToId.get(selectedValue);
      setFieldValue("cityId", id);
      // Ensure city error is cleared
      if (errors.city) {
        setFieldError("city", undefined);
        // Trigger validation after a small delay to ensure error is cleared
        setTimeout(() => {
          formik.validateField("city").then(() => {
            // Double-check error is cleared
            if (formik.errors.city) {
              setFieldError("city", undefined);
            }
          });
        }, 50);
      }
    }
  };

  return (
    <div className={styles.clgAppSaleAddressInfoWrapper}>
      <div className={styles.clgAppSaleAddressInfoTop}>
        <p className={styles.clgAppSaleAddressHeading}>Address Information</p>
        <div className={styles.clgAppSalePersonalInfoSeperationLine}></div>
      </div>

      <div className={styles.clgAppSaleAddressInfoBottom}>
        {addressInformationFieldsLayout.map((row) => (
          <div key={row.id} className={styles.clgAppSalerow}>
            {row.fields.map((fname, index) => {
              // Render empty spacer div for empty field names
              if (!fname) {
                return <div key={`empty-${index}`} className={styles.clgAppSaleFieldCell}></div>;
              }
              // Check if field is touched or if validation was triggered (Application Sale button clicked)
              const isTouched = touched[fname];
              const hasError = errors[fname];

              // Detect if "Proceed to Sale" was clicked by checking if all/most fields are touched
              // (handleProceedToSale sets all fields as touched when validation fails)
              const allFieldsTouched = Object.keys(touched).length > 0 &&
                Object.values(touched).filter(Boolean).length >= 5; // At least 5 fields touched
              const validationAttempted = submitCount > 0 || validationTriggeredRef.current || allFieldsTouched;

              // Only show errors AFTER "Proceed to Sale" button is clicked
              // This ensures errors appear after form submission attempt
              const hasValidValue = values[fname] &&
                values[fname] !== "" &&
                values[fname] !== "Select Mandal" &&
                values[fname] !== "Select City" &&
                values[fname] !== "-";
              // Show error if validation was attempted AND field has error AND no valid value
              const shouldShowError = validationAttempted && hasError && !hasValidValue;
              const fieldError = shouldShowError ? String(hasError) : null;

              return (
                <div key={fname} className={styles.clgAppSaleFieldCell}>
                  {renderField(fname, fieldMap, {
                    value: values[fname] ?? "",
                    onChange: customOnChange(fname), // Use integrated handleChange
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

export default AddressInformation;