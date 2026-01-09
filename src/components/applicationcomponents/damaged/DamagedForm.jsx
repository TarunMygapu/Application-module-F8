// import React, { useMemo, useState, useEffect } from "react";
// import { Formik, Form, useFormikContext } from "formik";
// import { useLocation } from "react-router-dom";

// import styles from "./DamagedForm.module.css";
// import rightArrow from "../../assets/application-status/rightArrowWhiteColor";

// import { damagedFields, damagedFieldsLayout } from "./DamagedFields";
// import { renderField } from "../../utils/renderField";
// import {
//   useGetApplicationValues,
//   useGetApplicationStatuses,
//   useSubmitDamagedApplication,
// } from "../../queries/damagedApis/damageApis";
// import Button from "../../widgets/Button/Button";

// // ------------------------------------------------------------------
// // 🔥 INNER FORM COMPONENT
// // ------------------------------------------------------------------
// const DamagedFormInner = ({
//   appNo,
//   setAppNo,
//   applicationIds,
//   setApplicationIds,
//   validationErrors,
//   setValidationErrors,
// }) => {
//   const { values, setFieldValue } = useFormikContext();
//   const [debouncedAppNo, setDebouncedAppNo] = useState("");

//   // Sync applicationNo from navigation
//   useEffect(() => {
//     if (appNo && !values.applicationNo) {
//       setFieldValue("applicationNo", appNo);
//     }
//   }, [appNo, values.applicationNo, setFieldValue]);

//   // Debounce application number
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setDebouncedAppNo(appNo);
//     }, 500);
//     return () => clearTimeout(timer);
//   }, [appNo]);

//   const { data: applicationValues, isError } =
//     useGetApplicationValues(debouncedAppNo);

//   const { data: applicationStatuses } = useGetApplicationStatuses();

//   // Autofill fields when API responds
//   useEffect(() => {
//     if (!debouncedAppNo || debouncedAppNo.length < 4) {
//       setFieldValue("zoneName", "");
//       setFieldValue("proName", "");
//       setFieldValue("dgmName", "");
//       setFieldValue("campusName", "");
//       setFieldValue("applicationStatus", "");
//       return;
//     }

//     if (!applicationValues) {
//       if (isError) {
//         setFieldValue("zoneName", "");
//         setFieldValue("proName", "");
//         setFieldValue("dgmName", "");
//         setFieldValue("campusName", "");
//         setFieldValue("applicationStatus", "");
//       }
//       return;
//     }

//     const app = applicationValues.data || applicationValues;

//     setFieldValue("zoneName", app.zoneName ?? "");
//     setFieldValue("proName", app.proName ?? "");
//     setFieldValue("dgmName", app.dgmName ?? "");
//     setFieldValue("campusName", app.campusName ?? "");

//     setApplicationIds({
//       campusId: app.campusId ?? null,
//       proId: app.proEmpId ?? null,
//       zoneId: app.zoneId ?? null,
//       dgmEmpId: app.dgmEmpId ?? null,
//       statusId: null,
//     });
//   }, [applicationValues, debouncedAppNo, isError, setFieldValue, setApplicationIds]);

//   // Build fieldMap
//   const fieldMap = useMemo(() => {
//     const map = {};

//     damagedFields.forEach((f) => {
//       if (f.name === "applicationStatus" && applicationStatuses) {
//         let statusOptions = [];
//         let statusMap = {};

//         const list = Array.isArray(applicationStatuses)
//           ? applicationStatuses
//           : applicationStatuses?.data || [];

//         statusOptions = list
//           .filter((i) => i?.status)
//           .map((i) => {
//             statusMap[i.status] = i.status_id;
//             return i.status;
//           });

//         window.statusIdMap = statusMap;

//         map[f.name] = {
//           ...f,
//           options: statusOptions.length ? statusOptions : f.options,
//         };
//       } else {
//         map[f.name] = f;
//       }
//     });

//     return map;
//   }, [applicationStatuses]);

//   return (
//     <div className={styles.damagedFormWrapper}>
//       <div className={styles.damagedForm}>
//         {damagedFieldsLayout.map((row) => {
//           const colsClass =
//             row.fields.length >= 3
//               ? styles.row3cols
//               : row.fields.length === 2
//               ? styles.row2cols
//               : styles.row1col;

//           return (
//             <div key={row.id} className={`${styles.damagedRow} ${colsClass}`}>
//               {row.fields.map((fname) => {
//                 const field = fieldMap[fname];
//                 if (!field) return <div key={fname}></div>;

//                 return (
//                   <div key={fname} className={styles.damagedFieldCell}>
//                     {renderField(fname, fieldMap, {
//                       value: values[fname],
//                       onChange: (e) => {
//                         const value = e.target.value;

//                         setFieldValue(fname, value);

//                         // 🔥 CLEAR ERROR ON CHANGE
//                         if (validationErrors[fname]) {
//                           setValidationErrors((prev) => {
//                             const updated = { ...prev };
//                             delete updated[fname];
//                             return updated;
//                           });
//                         }

//                         if (fname === "applicationNo") {
//                           setAppNo(value);
//                         }

//                         if (fname === "applicationStatus" && window.statusIdMap) {
//                           setApplicationIds((prev) => ({
//                             ...prev,
//                             statusId: window.statusIdMap[value],
//                           }));
//                         }
//                       },
//                     })}

//                     {validationErrors[fname] && (
//                       <span
//                         style={{
//                           color: "red",
//                           fontSize: 12,
//                           display: "block",
//                           marginTop: 4,
//                         }}
//                       >
//                         {validationErrors[fname]}
//                       </span>
//                     )}
//                   </div>
//                 );
//               })}

//               {row.id === "row3" && (
//                 <div className={styles.damagedSubmitWrapper}>
//                   <Button
//                     buttonname="Submit"
//                     type="submit"
//                     variant="primary"
//                     righticon={rightArrow}
//                   />
//                 </div>
//               )}
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// // ------------------------------------------------------------------
// // 🔥 MASTER COMPONENT
// // ------------------------------------------------------------------
// const DamagedForm = () => {
//   const location = useLocation();

//   const [appNo, setAppNo] = useState("");
//   const [validationErrors, setValidationErrors] = useState({});
//   const [applicationIds, setApplicationIds] = useState({
//     campusId: null,
//     proId: null,
//     zoneId: null,
//     dgmEmpId: null,
//     statusId: null,
//   });

//   const { mutate: submitDamage, isSuccess } =
//     useSubmitDamagedApplication();

//   useEffect(() => {
//     if (isSuccess) {
//       alert("Done");
//     }
//   }, [isSuccess]);

//   const applicationDataFromNav = location?.state?.applicationData;

//   const initialValues = {
//     applicationNo: applicationDataFromNav?.applicationNo || "",
//     zoneName: "",
//     proName: "",
//     dgmName: "",
//     campusName: "",
//     applicationStatus: "",
//     reason: "",
//   };

//   useEffect(() => {
//     if (applicationDataFromNav?.applicationNo) {
//       setAppNo(String(applicationDataFromNav.applicationNo));
//     }
//   }, [applicationDataFromNav]);

//   const handleSubmit = (values) => {
//     const errors = {};

//     if (!values.applicationNo) {
//       errors.applicationNo = "Please enter Application Number";
//     }
//     if (!values.applicationStatus) {
//       errors.applicationStatus = "Please select Application Status";
//     }
//     if (!values.reason) {
//       errors.reason = "Please enter Reason";
//     }
//     if (!applicationIds.statusId) {
//       errors.applicationStatus = "Please select a valid status";
//     }

//     if (Object.keys(errors).length > 0) {
//       setValidationErrors(errors);
//       return;
//     }

//     setValidationErrors({});

//     submitDamage({
//       applicationNo: Number(values.applicationNo),
//       statusId: applicationIds.statusId,
//       reason: values.reason,
//       campusId: applicationIds.campusId || 0,
//       proId: applicationIds.proId || 0,
//       zoneId: applicationIds.zoneId || 0,
//       dgmEmpId: applicationIds.dgmEmpId || 0,
//     });
//   };

//   return (
//     <Formik initialValues={initialValues} onSubmit={handleSubmit}>
//       <Form>
//         <DamagedFormInner
//           appNo={appNo}
//           setAppNo={setAppNo}
//           applicationIds={applicationIds}
//           setApplicationIds={setApplicationIds}
//           validationErrors={validationErrors}
//           setValidationErrors={setValidationErrors}
//         />
//       </Form>
//     </Formik>
//   );
// };

// export default DamagedForm;

import React, { useMemo, useState, useEffect } from "react";
import { Formik, Form, useFormikContext } from "formik";
import { useLocation } from "react-router-dom";

import styles from "./DamagedForm.module.css";
import rightArrow from "../../../assets/applicationassets/application-status/rightArrowWhiteColor";

import { damagedFields, damagedFieldsLayout } from "./DamagedFields";
import { renderField } from "../../../utils/renderField";
import {
  useGetApplicationValues,
  useGetApplicationStatuses,
  useSubmitDamagedApplication,
} from "../../../queries/applicationqueries/damagedApis/damageApis";
import Button from "../../../widgets/Button/Button";
import SuccessPage from "../../../widgets/sale-done/SuccessPage"; // ✅ IMPORT WIDGET
import ProgressHeader from "../../../widgets/ProgressHeader/ProgressHeader";

// ------------------------------------------------------------------
// 🔥 INNER FORM COMPONENT
// ------------------------------------------------------------------
const DamagedFormInner = ({
  appNo,
  setAppNo,
  applicationIds,
  setApplicationIds,
  validationErrors,
  setValidationErrors,
}) => {
  const { values, setFieldValue } = useFormikContext();
  const [debouncedAppNo, setDebouncedAppNo] = useState("");

  useEffect(() => {
    if (appNo && !values.applicationNo) {
      setFieldValue("applicationNo", appNo);
    }
  }, [appNo, values.applicationNo, setFieldValue]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedAppNo(appNo);
    }, 500);
    return () => clearTimeout(timer);
  }, [appNo]);

  const { data: applicationValues, isError } =
    useGetApplicationValues(debouncedAppNo);

  console.log("applicationValues", applicationValues);

  const { data: applicationStatuses } = useGetApplicationStatuses();

  useEffect(() => {
    // -------------------------------

    // RESET WHEN APP NO IS INVALID

    // -------------------------------

    if (!debouncedAppNo || debouncedAppNo.length < 4) {
      setFieldValue("zoneName", "");

      setFieldValue("proName", "");

      setFieldValue("dgmName", "");

      setFieldValue("campusName", "");

      setFieldValue("applicationStatus", "");

      setApplicationIds({
        campusId: null,

        proId: null,

        zoneId: null,

        dgmEmpId: null,

        statusId: null,
      });

      return;
    }

    if (!applicationValues || !applicationStatuses?.length) return;

    const app = applicationValues.data || applicationValues;

    // -------------------------------

    // SET BASIC DETAILS

    // -------------------------------

    setFieldValue("zoneName", app.zoneName ?? "");

    setFieldValue("proName", app.proName ?? "");

    setFieldValue("dgmName", app.dgmName ?? "");

    setFieldValue("campusName", app.campusName ?? "");

    // -------------------------------

    // STATUS AUTO-SELECTION LOGIC

    // -------------------------------

    const normalizedStatus = app.status?.trim().toLowerCase();

    const STATUS_MAP = {
      "with pro": "Available",

      "un available": "Un Available",

      damaged: "Damaged",
    };

    const targetStatusLabel = STATUS_MAP[normalizedStatus];

    if (targetStatusLabel) {
      const matchedStatus = applicationStatuses.find(
        (s) => s.status === targetStatusLabel
      );

      if (matchedStatus) {
        // ✅ set dropdown

        setFieldValue("applicationStatus", matchedStatus.status);

        // ✅ set backend IDs

        setApplicationIds({
          campusId: app.campusId ?? 0,

          proId: app.proEmpId ?? 0,

          zoneId: app.zoneId ?? 0,

          dgmEmpId: app.dgmEmpId ?? 0,

          statusId: matchedStatus.status_id,
        });

        return; // 🔴 stop here once auto-set
      }
    }

    // -------------------------------

    // FALLBACK (NO AUTO STATUS)

    // -------------------------------

    setApplicationIds({
      campusId: app.campusId ?? 0,

      proId: app.proEmpId ?? 0,

      zoneId: app.zoneId ?? 0,

      dgmEmpId: app.dgmEmpId ?? 0,

      statusId: null,
    });
  }, [
    applicationValues,

    applicationStatuses,

    debouncedAppNo,

    setFieldValue,

    setApplicationIds,
  ]);

  useEffect(() => {
    // -------------------------------

    // RESET WHEN APP NO IS INVALID

    // -------------------------------

    if (!debouncedAppNo || debouncedAppNo.length < 4) {
      setFieldValue("zoneName", "");

      setFieldValue("proName", "");

      setFieldValue("dgmName", "");

      setFieldValue("campusName", "");

      setFieldValue("applicationStatus", "");

      setApplicationIds({
        campusId: null,

        proId: null,

        zoneId: null,

        dgmEmpId: null,

        statusId: null,
      });

      return;
    }

    if (!applicationValues || !applicationStatuses?.length) return;

    const app = applicationValues.data || applicationValues;

    // -------------------------------

    // SET BASIC DETAILS

    // -------------------------------

    setFieldValue("zoneName", app.zoneName ?? "");

    setFieldValue("proName", app.proName ?? "");

    setFieldValue("dgmName", app.dgmName ?? "");

    setFieldValue("campusName", app.campusName ?? "");

    // -------------------------------

    // STATUS AUTO-SELECTION LOGIC

    // -------------------------------

    const normalizedStatus = app.status?.trim().toLowerCase();

    const STATUS_MAP = {
      "with pro": "Available",

      "un available": "Un Available",

      damaged: "Damaged",
    };

    const targetStatusLabel = STATUS_MAP[normalizedStatus];

    if (targetStatusLabel) {
      const matchedStatus = applicationStatuses.find(
        (s) => s.status === targetStatusLabel
      );

      if (matchedStatus) {
        // ✅ set dropdown

        setFieldValue("applicationStatus", matchedStatus.status);

        // ✅ set backend IDs

        setApplicationIds({
          campusId: app.campusId ?? 0,

          proId: app.proEmpId ?? 0,

          zoneId: app.zoneId ?? 0,

          dgmEmpId: app.dgmEmpId ?? 0,

          statusId: matchedStatus.status_id,
        });

        return; // 🔴 stop here once auto-set
      }
    }

    // -------------------------------

    // FALLBACK (NO AUTO STATUS)

    // -------------------------------

    setApplicationIds({
      campusId: app.campusId ?? 0,

      proId: app.proEmpId ?? 0,

      zoneId: app.zoneId ?? 0,

      dgmEmpId: app.dgmEmpId ?? 0,

      statusId: null,
    });
  }, [
    applicationValues,

    applicationStatuses,

    debouncedAppNo,

    setFieldValue,

    setApplicationIds,
  ]);

  const fieldMap = useMemo(() => {
    const map = {};

    damagedFields.forEach((f) => {
      if (f.name === "applicationStatus" && applicationStatuses) {
        let statusMap = {};

        const list = Array.isArray(applicationStatuses)
          ? applicationStatuses
          : applicationStatuses?.data || [];

        const options = list
          .filter((i) => i?.status)
          .map((i) => {
            statusMap[i.status] = i.status_id;
            return i.status;
          });

        window.statusIdMap = statusMap;

        map[f.name] = { ...f, options };
      } else {
        map[f.name] = f;
      }
    });

    return map;
  }, [applicationStatuses]);

  return (
    <div className={styles.damagedFormWrapper}>
      <p className={styles.clgAppSaleDetails}>Application Damage</p>
      <ProgressHeader step={0} totalSteps={2} />
      <div className={styles.damagedForm}>
        {damagedFieldsLayout.map((row) => {
          const colsClass =
            row.fields.length >= 3
              ? styles.row3cols
              : row.fields.length === 2
              ? styles.row2cols
              : styles.row1col;

          return (
            <div key={row.id} className={`${styles.damagedRow} ${colsClass}`}>
              {row.fields.map((fname) => {
                const field = fieldMap[fname];
                if (!field) return <div key={fname}></div>;

                return (
                  <div key={fname} className={styles.damagedFieldCell}>
                    {renderField(fname, fieldMap, {
                      value: values[fname],
                      onChange: (e) => {
                        const value = e.target.value;
                        setFieldValue(fname, value);

                        if (validationErrors[fname]) {
                          setValidationErrors((prev) => {
                            const updated = { ...prev };
                            delete updated[fname];
                            return updated;
                          });
                        }

                        if (fname === "applicationNo") setAppNo(value);

                        if (
                          fname === "applicationStatus" &&
                          window.statusIdMap
                        ) {
                          setApplicationIds((prev) => ({
                            ...prev,
                            statusId: window.statusIdMap[value],
                          }));
                        }
                      },
                    })}

                    {validationErrors[fname] && (
                      <span
                        style={{ color: "red", fontSize: 12, marginTop: 4 }}
                      >
                        {validationErrors[fname]}
                      </span>
                    )}
                  </div>
                );
              })}

              {row.id === "row3" && (
                <div className={styles.damagedSubmitWrapper}>
                  <Button
                    buttonname="Submit"
                    type="submit"
                    variant="primary"
                    righticon={rightArrow}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ------------------------------------------------------------------
// 🔥 MASTER COMPONENT
// ------------------------------------------------------------------
const DamagedForm = () => {
  const location = useLocation();

  const [appNo, setAppNo] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [applicationIds, setApplicationIds] = useState({
    campusId: null,
    proId: null,
    zoneId: null,
    dgmEmpId: null,
    statusId: null,
  });

  const { mutate: submitDamage, isSuccess } = useSubmitDamagedApplication();

  const applicationDataFromNav = location?.state?.applicationData;

  const initialValues = {
    applicationNo: applicationDataFromNav?.applicationNo || "",
    zoneName: "",
    proName: "",
    dgmName: "",
    campusName: "",
    applicationStatus: "",
    reason: "",
  };

  useEffect(() => {
    if (applicationDataFromNav?.applicationNo) {
      setAppNo(String(applicationDataFromNav.applicationNo));
    }
  }, [applicationDataFromNav]);

  const handleSubmit = (values) => {
    const errors = {};

    if (!values.applicationNo)
      errors.applicationNo = "Please Enter Application Number";
    if (!values.applicationStatus)
      errors.applicationStatus = "Please Select Application Status";
    if (!values.reason) errors.reason = "Please Enter Reason";
    if (!applicationIds.statusId)
      errors.applicationStatus = "Please Select a Valid Status";

    if (Object.keys(errors).length) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({});

    submitDamage({
      applicationNo: Number(values.applicationNo),
      statusId: applicationIds.statusId,
      reason: values.reason,
      campusId: applicationIds.campusId || 0,
      proId: applicationIds.proId || 0,
      zoneId: applicationIds.zoneId || 0,
      dgmEmpId: applicationIds.dgmEmpId || 0,
    });
  };

  // 🔥 SHOW SUCCESS WIDGET INSTEAD OF FORM
  if (isSuccess) {
    return <SuccessPage applicationNo={appNo} statusType="damaged" />;
  }

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      <Form>
        <DamagedFormInner
          appNo={appNo}
          setAppNo={setAppNo}
          applicationIds={applicationIds}
          setApplicationIds={setApplicationIds}
          validationErrors={validationErrors}
          setValidationErrors={setValidationErrors}
        />
      </Form>
    </Formik>
  );
};

export default DamagedForm;
