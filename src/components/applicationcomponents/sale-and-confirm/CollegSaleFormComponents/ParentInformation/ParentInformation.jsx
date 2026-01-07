import React, { useState, useEffect, useMemo } from "react";
import { useFormikContext } from "formik";
import styles from "./ParentInformation.module.css";
 
import {
  parentInfoFields,
  parentInfoFieldsLayout,
} from "./parentInformationFields";
 
import SiblingInformation from "./SiblingInformation";
import { renderField } from "../../../../../utils/renderField";
 
import Button from "../../../../../widgets/Button/Button";
import uploadAnnexureIcon from "../../../../../assets/applicationassets/application-status/uploadAnnexureIcon";
import plusIconBlueColor from "../../../../../assets/applicationassets/application-status/plusIconBlueColor";
 
import { useGetSector, useGetOccupation } from "../../../../../queries/applicationqueries/saleApis/clgSaleApis";
 
const ParentInformation = ({ isEditMode = false, isFastSold = false }) => {
 const { values, setFieldValue, errors, touched, submitCount, setTouched, setFieldError, validateField } = useFormikContext();
  const [siblingIds, setSiblingIds] = useState([]);
 
  const { data: sectorData } = useGetSector();
  const { data: occupationData } = useGetOccupation();
 
  // Create name-to-ID maps for storing IDs
  const sectorNameToId = useMemo(() => {
    const map = new Map();
    if (Array.isArray(sectorData?.data)) {
      sectorData.data.forEach((s) => {
        if (s.name && s.id) {
          map.set(s.name, s.id);
        }
      });
    }
    return map;
  }, [sectorData]);
 
  const occupationNameToId = useMemo(() => {
    const map = new Map();
    if (Array.isArray(occupationData?.data)) {
      occupationData.data.forEach((o) => {
        if (o.name && o.id) {
          map.set(o.name, o.id);
        }
      });
    }
    return map;
  }, [occupationData]);
 
  // Build field map dynamically - memoized to prevent unnecessary recalculations
  const fieldMap = useMemo(() => {
    return parentInfoFields.reduce((acc, f) => {
      let field = { ...f };

      // Disable all parent information fields in edit mode
      // Also disable fatherName and fatherMobile in fast sold modes
      if (isEditMode) {
        field.disabled = true;
        field.readOnly = true;
      } else if (isFastSold && (f.name === "fatherName" || f.name === "fatherMobile")) {
        field.disabled = true;
        field.readOnly = true;
      }

      // populate dropdowns for father & mother
      if (f.name.includes("Sector"))
        field.options = sectorData?.data?.map((s) => s.name) || [];

      if (f.name.includes("Occupation")) {
        // If sector is "Others", show only "Others" in occupation dropdown
        if (f.name === "fatherOccupation") {
          if (values.fatherSector === "Others") {
            field.options = ["Others"];
          } else {
            field.options = occupationData?.data?.map((o) => o.name) || [];
          }
        } else if (f.name === "motherOccupation") {
          if (values.motherSector === "Others") {
            field.options = ["Others"];
          } else {
            field.options = occupationData?.data?.map((o) => o.name) || [];
          }
        } else {
          // Fallback for any other occupation fields
          field.options = occupationData?.data?.map((o) => o.name) || [];
        }
      }

      acc[f.name] = field;
      return acc;
    }, {});
  }, [sectorData, occupationData, values.fatherSector, values.motherSector, isEditMode, isFastSold]);
 
  // 💥 Check father Other condition
  const showFatherOther =
    values.fatherSector === "Others" && values.fatherOccupation === "Others";
 
  // 💥 Check mother Other condition
  const showMotherOther =
    values.motherSector === "Others" && values.motherOccupation === "Others";
 
  // Use useEffect to clear fields instead of direct setFieldValue in render
  useEffect(() => {
    if (!showFatherOther && values.fatherOther) {
      setFieldValue("fatherOther", "");
    }
  }, [showFatherOther, values.fatherOther, setFieldValue]);
 
  useEffect(() => {
    if (!showMotherOther && values.motherOther) {
      setFieldValue("motherOther", "");
    }
  }, [showMotherOther, values.motherOther, setFieldValue]);
 
  // Store fatherSectorId when fatherSector changes
  useEffect(() => {
    if (values.fatherSector && sectorNameToId.has(values.fatherSector)) {
      const id = sectorNameToId.get(values.fatherSector);
      setFieldValue("fatherSectorId", id);
    } else if (!values.fatherSector && values.fatherSectorId) {
      setFieldValue("fatherSectorId", null);
    }
   
    // Clear occupation when sector changes to/from "Others"
    const wasOthers = values.fatherSector === "Others";
    if (wasOthers && values.fatherOccupation && values.fatherOccupation !== "Others") {
      setFieldValue("fatherOccupation", "");
      setFieldValue("fatherOccupationId", null);
    } else if (!wasOthers && values.fatherOccupation === "Others") {
      setFieldValue("fatherOccupation", "");
      setFieldValue("fatherOccupationId", null);
    }
  }, [values.fatherSector, sectorNameToId, setFieldValue, values.fatherOccupation]);
 
  // Store fatherOccupationId when fatherOccupation changes
  useEffect(() => {
    if (values.fatherOccupation && occupationNameToId.has(values.fatherOccupation)) {
      const id = occupationNameToId.get(values.fatherOccupation);
      setFieldValue("fatherOccupationId", id);
    } else if (!values.fatherOccupation && values.fatherOccupationId) {
      setFieldValue("fatherOccupationId", null);
    }
  }, [values.fatherOccupation, occupationNameToId, setFieldValue]);
 
  // Store motherSectorId when motherSector changes
  useEffect(() => {
    if (values.motherSector && sectorNameToId.has(values.motherSector)) {
      const id = sectorNameToId.get(values.motherSector);
      setFieldValue("motherSectorId", id);
    } else if (!values.motherSector && values.motherSectorId) {
      setFieldValue("motherSectorId", null);
    }
   
    // Clear occupation when sector changes to/from "Others"
    const wasOthers = values.motherSector === "Others";
    if (wasOthers && values.motherOccupation && values.motherOccupation !== "Others") {
      setFieldValue("motherOccupation", "");
      setFieldValue("motherOccupationId", null);
    } else if (!wasOthers && values.motherOccupation === "Others") {
      setFieldValue("motherOccupation", "");
      setFieldValue("motherOccupationId", null);
    }
  }, [values.motherSector, sectorNameToId, setFieldValue, values.motherOccupation]);
 
  // Store motherOccupationId when motherOccupation changes
  useEffect(() => {
    if (values.motherOccupation && occupationNameToId.has(values.motherOccupation)) {
      const id = occupationNameToId.get(values.motherOccupation);
      setFieldValue("motherOccupationId", id);
    } else if (!values.motherOccupation && values.motherOccupationId) {
      setFieldValue("motherOccupationId", null);
    }
  }, [values.motherOccupation, occupationNameToId, setFieldValue]);
 
  // Sync IDs when labels are present but IDs are missing (for pre-populated data)
  useEffect(() => {
    // Sync fatherSectorId
    if (values.fatherSector && (!values.fatherSectorId || values.fatherSectorId === 0) && sectorNameToId.has(values.fatherSector)) {
      const id = sectorNameToId.get(values.fatherSector);
      setFieldValue("fatherSectorId", id);
    }
   
    // Sync fatherOccupationId
    if (values.fatherOccupation && (!values.fatherOccupationId || values.fatherOccupationId === 0) && occupationNameToId.has(values.fatherOccupation)) {
      const id = occupationNameToId.get(values.fatherOccupation);
      setFieldValue("fatherOccupationId", id);
    }
   
    // Sync motherSectorId
    if (values.motherSector && (!values.motherSectorId || values.motherSectorId === 0) && sectorNameToId.has(values.motherSector)) {
      const id = sectorNameToId.get(values.motherSector);
      setFieldValue("motherSectorId", id);
    }
   
    // Sync motherOccupationId
    if (values.motherOccupation && (!values.motherOccupationId || values.motherOccupationId === 0) && occupationNameToId.has(values.motherOccupation)) {
      const id = occupationNameToId.get(values.motherOccupation);
      setFieldValue("motherOccupationId", id);
    }
  }, [values.fatherSector, values.fatherSectorId, values.fatherOccupation, values.fatherOccupationId, values.motherSector, values.motherSectorId, values.motherOccupation, values.motherOccupationId, sectorNameToId, occupationNameToId, setFieldValue]);
 
  // 💥 Build dynamic layout
  const dynamicLayout = [
    {
      id: "row1",
      fields: ["fatherName", "fatherMobile", "fatherEmail"],
    },
 
    {
      id: "row2",
      fields: showFatherOther
        ? ["fatherSector", "fatherOccupation", "fatherOther"]
        : ["fatherSector", "fatherOccupation",""],
    },
 
    {
      id: "row3",
      fields: ["motherName", "motherMobile", "motherEmail"],
    },
 
    {
      id: "row4",
      fields: showMotherOther
        ? ["motherSector", "motherOccupation", "motherOther"]
        : ["motherSector", "motherOccupation",""],
    },
 
    siblingIds.length > 0 ? { id: "rowSibling", fields: [] } : null,
  ].filter(Boolean);
 
 
  return (
    <div className={styles.clgAppSalePersonalInforWrapper}>
      <div className={styles.clgAppSaleParentsInfoTop}>
        <p className={styles.clgAppSaleParentsHeading}>Parent Information</p>
        <div className={styles.clgAppSalePersonalInfoSeperationLine}></div>
      </div>
 
      <div className={styles.clgAppSaleParentInfoBottom}>
 
        {dynamicLayout.map((row) => (
          <div key={row.id} className={styles.clgAppSalerow}>
            {row.fields.map((fname) => (
              <div key={fname} className={styles.clgAppSaleFieldCell}>
                {fname &&
                  renderField(fname, fieldMap, {
                    value: values[fname] ?? "",
                    disabled: (isEditMode || (isFastSold && (fname === "fatherName" || fname === "fatherMobile"))) ? true : undefined,
                    onChange: (isEditMode || (isFastSold && (fname === "fatherName" || fname === "fatherMobile"))) ? undefined : (e) => {
                      const selectedValue = e.target.value;
                     
                      // Mark field as touched first
                      setTouched({ ...touched, [fname]: true });
                     
                      // Clear error immediately when a valid value is selected
                      if (selectedValue && selectedValue.trim() !== "") {
                        setFieldError(fname, undefined);
                      }
                     
                      // Set the value without immediate validation to prevent error from re-appearing
                      setFieldValue(fname, selectedValue, false); // false = don't validate immediately
                     
                      // Force clear error again after setting value (in case validation ran)
                      if (selectedValue && selectedValue.trim() !== "") {
                        // Clear immediately after setFieldValue
                        setTimeout(() => {
                          if (errors[fname]) {
                            setFieldError(fname, undefined);
                          }
                        }, 0);
                       
                        // Validate after a delay and ensure error stays cleared if value is valid
                        setTimeout(() => {
                          validateField(fname).then((validationError) => {
                            // If validation passes (no error), ensure error is cleared
                            if (!validationError && selectedValue.trim() !== "") {
                              setFieldError(fname, undefined);
                            }
                          });
                        }, 100);
                      }
                    },
                    error: (touched[fname] || submitCount > 0) && errors[fname],
                  })}
              </div>
            ))}
          </div>
        ))}
 
        {/* Sibling Info */}
        {siblingIds.map((siblingId, index) => (
          <SiblingInformation
            key={siblingId}
            onClose={isEditMode ? undefined : () => {
              setSiblingIds(prev => prev.filter(id => id !== siblingId));
            }}
            siblingIndex={index}
            isEditMode={isEditMode}
          />
        ))}
 
        {/* Buttons */}
        <div className={styles.clgAppSalerow}>
          <div className={styles.clgAppSaleFieldCell}>
            <Button
              buttonname="Upload Annexure"
              variant="upload"
              lefticon={uploadAnnexureIcon}
              width="196px"
              disabled={isEditMode}
            />
          </div>

          <div className={styles.clgAppSaleFieldCell}>
            <Button
              buttonname={
                siblingIds.length > 0 ? "Add Another Sibling" : "Add Sibling"
              }
              variant="secondaryWithExtraPadding"
              lefticon={plusIconBlueColor}
              width={siblingIds.length > 0 ? "240px" : "194px"}
              onClick={() => {
                const newId = Date.now() + Math.random(); // Generate unique ID
                setSiblingIds(prev => [...prev, newId]);
              }}
              disabled={isEditMode}
            />
          </div>

          <div className={styles.clgAppSaleFieldCell}></div>
        </div>
      </div>
    </div>
  );
};
 
export default ParentInformation;