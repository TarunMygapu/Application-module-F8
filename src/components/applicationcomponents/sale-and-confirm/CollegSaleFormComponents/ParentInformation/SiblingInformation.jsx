import React, { useState, useMemo, useEffect } from "react";
import { useFormikContext } from "formik";
import styles from "./SiblingInformation.module.css";
import SiblingCloseIcon from "./SiblingCloseIcon";

import {
  siblingsInformationFields,
  siblingFieldsLayout,
} from "./parentInformationFields";

import { renderField } from "../../../../../utils/renderField";

// API Hooks
import {
  useGetRelationTypes,
  useGetAllClasses
} from "../../../../../queries/applicationqueries/saleApis/clgSaleApis";

const SiblingInformation = ({ onClose, siblingIndex = 0 }) => {
  const formik = useFormikContext();
  const { values } = formik;

  // Initialize local values from existing sibling data if available
  const getInitialValues = () => {
    const currentSiblings = Array.isArray(formik.values.siblings) ? formik.values.siblings : [];
    const existingSibling = currentSiblings[siblingIndex];

    if (existingSibling) {
      return {
        fullName: existingSibling.fullName || "",
        relationType: existingSibling.relationType || "",
        relationTypeId: existingSibling.relationTypeId || null,
        selectClass: existingSibling.selectClass || "",
        classId: existingSibling.classId || null,
        schoolName: existingSibling.schoolName || "",
      };
    }

    return {
      fullName: "",
      relationType: "",
      relationTypeId: null,
      selectClass: "",
      classId: null,
      schoolName: "",
    };
  };

  const [localValues, setLocalValues] = useState(getInitialValues);

  // Update local values when siblingIndex changes or when siblings array changes
  useEffect(() => {
    const newValues = getInitialValues();
    setLocalValues(newValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siblingIndex, formik.values.siblings]);

  const setLocalFieldValue = (field, value) => {
    setLocalValues((prev) => ({ ...prev, [field]: value }));
  };

  // Fetch dropdown values
  const { data: relationData } = useGetRelationTypes();
  const { data: classData } = useGetAllClasses();

  // Create maps for name-to-ID conversion - Only Sister and Brother
  const relationNameToId = useMemo(() => {
    const map = new Map();
    const relationArray = Array.isArray(relationData?.data)
      ? relationData.data
      : (Array.isArray(relationData) ? relationData : []);
    relationArray.forEach((r) => {
      const name = r.name || r.relationName || r.label || '';
      // Only include "Sister" and "Brother" relation types
      if (name && r.id && (name.toLowerCase() === "sister" || name.toLowerCase() === "brother")) {
        map.set(name, r.id);
      }
    });
    return map;
  }, [relationData]);

  const classNameToId = useMemo(() => {
    const map = new Map();
    const classArray = Array.isArray(classData?.data)
      ? classData.data
      : (Array.isArray(classData) ? classData : []);
    classArray.forEach((c) => {
      const name = c.name || c.className || c.label || '';
      if (name && c.id) {
        map.set(name, c.id);
      }
    });
    return map;
  }, [classData]);

  // Build field map with API values - memoized to prevent unnecessary recalculations
  const fieldMap = useMemo(() => {
    return siblingsInformationFields.reduce((acc, f) => {
      let field = { ...f };

      if (f.name === "relationType") {
        // Handle different possible response structures: relationData.data or relationData
        const relationArray = Array.isArray(relationData?.data)
          ? relationData.data
          : (Array.isArray(relationData) ? relationData : []);
        // Filter to show only "Sister" and "Brother"
        const allOptions = relationArray.map((r) => r.name || r.relationName || r.label || '');
        field.options = allOptions.filter((name) => {
          const nameLower = name.toLowerCase();
          return nameLower === "sister" || nameLower === "brother";
        });
      }

      if (f.name === "selectClass") {
        // Handle different possible response structures: classData.data or classData
        // Note: getAllClasses already normalizes to array, but check both for safety
        const classArray = Array.isArray(classData?.data)
          ? classData.data
          : (Array.isArray(classData) ? classData : []);
        field.options = classArray.map((c) => c.name || c.className || c.label || '');
      }

      acc[f.name] = field;
      return acc;
    }, {});
  }, [relationData, classData]);

  // Clear sibling fields
  const handleClear = () => {
    setLocalValues({
      fullName: "",
      relationType: "",
      relationTypeId: null,
      selectClass: "",
      classId: null,
      schoolName: "",
    });

    // Remove only this specific sibling from Formik by index
    const currentSiblings = Array.isArray(formik.values.siblings) ? formik.values.siblings : [];
    if (siblingIndex < currentSiblings.length) {
      const updatedSiblings = currentSiblings.filter((_, index) => index !== siblingIndex);
      formik.setFieldValue("siblings", updatedSiblings, false);
    }
  };

  // Automatically add/update sibling in Formik when required fields are filled
  useEffect(() => {
    // Get current siblings from Formik
    const currentSiblings = Array.isArray(formik.values.siblings) ? formik.values.siblings : [];

    // Only auto-add if required fields are filled
    const hasRequiredFields = localValues.fullName && localValues.fullName.trim() &&
      localValues.relationType && localValues.relationType.trim();

    if (hasRequiredFields) {
      // Get IDs for relation and class
      const relationTypeId = relationNameToId.get(localValues.relationType) || null;
      const classId = classNameToId.get(localValues.selectClass) || null;

      // Create sibling object
      const siblingObject = {
        fullName: localValues.fullName.trim(),
        relationType: localValues.relationType,
        relationTypeId: relationTypeId,
        selectClass: localValues.selectClass,
        classId: classId,
        schoolName: localValues.schoolName || "",
      };

      // Update sibling at this specific index
      let updatedSiblings;
      if (siblingIndex < currentSiblings.length) {
        // Update existing sibling at this index
        updatedSiblings = [...currentSiblings];
        updatedSiblings[siblingIndex] = siblingObject;
      } else {
        // Add new sibling at the end
        updatedSiblings = [...currentSiblings, siblingObject];
      }

      // Update Formik state only if it's different to avoid infinite loops
      const currentSiblingsString = JSON.stringify(currentSiblings);
      const updatedSiblingsString = JSON.stringify(updatedSiblings);
      if (currentSiblingsString !== updatedSiblingsString) {
        formik.setFieldValue("siblings", updatedSiblings, false);
      }
    } else {
      // If required fields are not filled, remove only this specific sibling by index
      if (siblingIndex < currentSiblings.length && (!localValues.fullName || !localValues.fullName.trim())) {
        // Only remove this sibling if fullName is empty (user cleared it)
        const updatedSiblings = currentSiblings.filter((_, index) => index !== siblingIndex);
        formik.setFieldValue("siblings", updatedSiblings, false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localValues.fullName, localValues.relationType, localValues.selectClass, localValues.schoolName, relationNameToId, classNameToId, siblingIndex]);

  return (
    <div className={styles.siblingInformationWrapper}>
      <div className={styles.clgAppSaleParentsInfoTop}>
        <p className={styles.clgAppSaleParentsHeading}>Sibling Information</p>
        <div className={styles.clgAppSalePersonalInfoSeperationLine}></div>
      </div>

      <div className={styles.siblingsFieldsWrapper}>
        <div className={styles.fieldsetHeader}>
          <p className={styles.siblingTitle}>Sibling {siblingIndex + 1}</p>
          {/* Buttons on the right */}
          <div className={styles.siblingButtons}>
            <button
              type="button"
              className={styles.clearButton}
              onClick={handleClear}
            >
              Clear
            </button>

            <button
              type="button"
              className={styles.siblingsCloseButton}
              onClick={onClose}
            >
              <SiblingCloseIcon />
            </button>
          </div>
        </div>

        {siblingFieldsLayout.map((row) => (
          <div key={row.id} className={styles.clgAppSalerow}>
            {row.fields.map((fname, fieldIndex) => (
              <div key={`${row.id}-${fieldIndex}-${fname || 'empty'}`} className={styles.clgAppSaleFieldCell}>
                {fname &&
                  renderField(fname, fieldMap, {
                    value: localValues[fname] ?? "",
                    onChange: (e) => {
                      const value = e.target.value;
                      setLocalFieldValue(fname, value);

                      // Store IDs when dropdown values change
                      if (fname === "relationType" && relationNameToId.has(value)) {
                        setLocalFieldValue("relationTypeId", relationNameToId.get(value));
                      }
                      if (fname === "selectClass" && classNameToId.has(value)) {
                        setLocalFieldValue("classId", classNameToId.get(value));
                      }
                    },
                  })}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SiblingInformation;