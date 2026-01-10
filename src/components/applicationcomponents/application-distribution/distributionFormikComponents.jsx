import { useEffect } from "react";
import { useFormikContext } from "formik";
 
 
export const AutoCalcAppTo = () => {
  const { values, setFieldValue, setFieldError } = useFormikContext();
 
  useEffect(() => {
    const from = Number(values.applicationNoFrom);
    const range = Number(values.range);
    const appCount = Number(values.applicationCount);
    const availableTo = Number(values.availableAppNoTo);
 
    // reset errors
    setFieldError("range", "");
    setFieldError("applicationNoTo", "");
 
    if (!Number.isFinite(from) || !Number.isFinite(range) || range <= 0) {
      setFieldValue("applicationNoTo", "", false);
      return;
    }
 
    const computedTo = from + range-1;
 
    // -----------------------
    //  RULE 1: RANGE LIMIT
    // -----------------------
    if (appCount && range > appCount) {
      setFieldError(
        "range",
        `Range cannot exceed Application Count (${appCount}).`
      );
      setFieldValue("applicationNoTo", "", false);
      return;
    }
 
    // -----------------------
    //  RULE 2: END NO LIMIT
    // -----------------------
    if (availableTo && computedTo > availableTo) {
      setFieldError(
        "applicationNoTo",
        `Application No To cannot exceed available range (${availableTo}).`
      );
      setFieldValue("applicationNoTo", "", false);
      return;
    }
 
    // VALID → update value
    setFieldValue("applicationNoTo", String(computedTo), false);
 
  }, [
    values.applicationNoFrom,
    values.range,
    values.applicationCount,
    values.availableAppNoTo,
    setFieldValue,
    setFieldError,
  ]);
 
  return null;
};
 
export const ValuesBridge = ({ onValuesChange }) => {
  const { values, setFieldValue } = useFormikContext();
 
  useEffect(() => {
    onValuesChange?.(values, setFieldValue);
  }, [values, setFieldValue, onValuesChange]);
 
  return null;
};
 
 
export const BackendPatcher = ({
  appNoFormMode,
  middlewareAppNoFrom,
  backendValues = {},
  skipAppNoPatch = false,
}) => {
  const { values, setFieldValue } = useFormikContext();
 
  console.log("Backend Values:", backendValues);
 
  // ------------------ APPLICATION NO FROM ------------------
  useEffect(() => {
    if (skipAppNoPatch) return;
 
    const src =
      appNoFormMode === "middleware" && middlewareAppNoFrom != null
        ? middlewareAppNoFrom
        : backendValues.applicationNoFrom;
 
    if (src != null) {
      const nextVal = String(src);
      if (values.applicationNoFrom !== nextVal) {
        setFieldValue("applicationNoFrom", nextVal, false);
      }
    }
  }, [
    appNoFormMode,
    middlewareAppNoFrom,
    backendValues.applicationNoFrom,
    values.applicationNoFrom,
    skipAppNoPatch,
    setFieldValue,
  ]);
 
  // ------------------ MOBILE NUMBER ------------------
  useEffect(() => {
    if (backendValues.mobileNumber != null) {
      const nextVal = String(backendValues.mobileNumber);
      if (values.mobileNumber !== nextVal) {
        setFieldValue("mobileNumber", nextVal, false);
      }
    }
  }, [backendValues.mobileNumber, values.mobileNumber, setFieldValue]);
 
  // ------------------ AVAILABLE APP NO FROM ------------------
  useEffect(() => {
    if (skipAppNoPatch) return;
 
    if (backendValues.availableAppNoFrom != null) {
      const nextVal = String(backendValues.availableAppNoFrom);
      if (values.availableAppNoFrom !== nextVal) {
        setFieldValue("availableAppNoFrom", nextVal, false);
      }
    }
  }, [
    backendValues.availableAppNoFrom,
    values.availableAppNoFrom,
    skipAppNoPatch,
    setFieldValue,
  ]);
 
  // ------------------ AVAILABLE APP NO TO ------------------
  useEffect(() => {
    if (skipAppNoPatch) return;
 
    if (backendValues.availableAppNoTo != null) {
      const nextVal = String(backendValues.availableAppNoTo);
      if (values.availableAppNoTo !== nextVal) {
        setFieldValue("availableAppNoTo", nextVal, false);
      }
    }
  }, [
    backendValues.availableAppNoTo,
    values.availableAppNoTo,
    skipAppNoPatch,
    setFieldValue,
  ]);
 
  // ------------------ IDS ------------------
  const patchNumber = (field, backendVal) => {
    if (backendVal != null && values[field] !== Number(backendVal)) {
      setFieldValue(field, Number(backendVal), false);
    }
  };
 
  useEffect(() => {
  if (backendValues.issuedToEmpId != null) {
    if (values.issuedToEmpId !== backendValues.issuedToEmpId) {
      setFieldValue("issuedToEmpId", backendValues.issuedToEmpId, false);
    }
  }
}, [backendValues.issuedToEmpId, values.issuedToEmpId, setFieldValue]);

// ✅ CRITICAL: Also patch issuedToId (needed for DGM form - maps to dgmEmployeeId)
useEffect(() => {
  if (backendValues.issuedToId != null) {
    if (values.issuedToId !== backendValues.issuedToId) {
      setFieldValue("issuedToId", backendValues.issuedToId, false);
    }
  }
}, [backendValues.issuedToId, values.issuedToId, setFieldValue]);

useEffect(() => {
  if (backendValues.academicYearId != null) {
    if (values.academicYearId !== backendValues.academicYearId) {
      setFieldValue("academicYearId", backendValues.academicYearId, false);
    }
  }
}, [backendValues.academicYearId, values.academicYearId, setFieldValue]);


  useEffect(() => {
  if (backendValues.academicYear != null) {
    if (values.academicYear !== backendValues.academicYear) {
      setFieldValue("academicYear", backendValues.academicYear, false);
    }
  }
}, [backendValues.academicYear, values.academicYear, setFieldValue]);
  useEffect(() => patchNumber("stateId", backendValues.stateId), [
    backendValues.stateId,
  ]);
  // useEffect(() => patchNumber("cityId", backendValues.cityId), [
  //   backendValues.cityId,
  // ]);
  // useEffect(() => patchNumber("zoneId", backendValues.zoneId), [
  //   backendValues.zoneId,
  // ]);

  // ------------------ CITY NAME ------------------
useEffect(() => {
  if (backendValues.cityName != null) {
    if (values.cityName !== backendValues.cityName) {
      setFieldValue("cityName", backendValues.cityName, false);
    }
  }
}, [backendValues.cityName, values.cityName, setFieldValue]);


// ------------------ ZONE NAME ------------------
useEffect(() => {
  if (backendValues.zoneName != null) {
    if (values.zoneName !== backendValues.zoneName) {
      setFieldValue("zoneName", backendValues.zoneName, false);
    }
  }
}, [backendValues.zoneName, values.zoneName, setFieldValue]);

useEffect(() => {
  if (backendValues.campusName != null) {
    if (values.campusName !== backendValues.campusName) {
      setFieldValue("campusName", backendValues.campusName, false);
    }
  }
}, [backendValues.campusName, values.campusName, setFieldValue]);

useEffect(() => {
  if (backendValues.issuedName != null) {
    if (values.issuedName !== backendValues.issuedName) {
      setFieldValue("issuedName", backendValues.issuedName, false);
    }
  }
}, [backendValues.issuedName, values.issuedName, setFieldValue]);


  useEffect(() => {
  if (backendValues.campaignDistrictId != null) {
    if (values.campaignDistrictId !== backendValues.campaignDistrictId) {
      setFieldValue("campaignDistrictId", backendValues.campaignDistrictId, false);
    }
  }
}, [backendValues.campaignDistrictId, values.campaignDistrictId, setFieldValue]);

useEffect(() => {
  if (backendValues.campaignDistrictName != null) {
    if (values.campaignDistrictName !== backendValues.campaignDistrictName) {
      setFieldValue("campaignDistrictName", backendValues.campaignDistrictName, false);
    }
  }
}, [backendValues.campaignDistrictName, values.campaignDistrictName, setFieldValue]);



useEffect(() => {
  if (backendValues.cityId != null) {
    if (values.cityId !== backendValues.cityId) {
      setFieldValue("cityId", backendValues.cityId, false);
    }
  }
}, [backendValues.cityId, values.cityId, setFieldValue]);

useEffect(() => {
  if (backendValues.zoneId != null) {
    if (values.zoneId !== backendValues.zoneId) {
      setFieldValue("zoneId", backendValues.zoneId, false);
    }
  }
}, [backendValues.zoneId, values.zoneId, setFieldValue]);

  useEffect(() => {
  if (backendValues.campusId != null) {
    if (values.campusId !== backendValues.campusId) {
      setFieldValue("campusId", backendValues.campusId, false);
      
    }
  }
}, [backendValues.campusId, values.campusId, setFieldValue]);


  // useEffect(
  //   () => patchNumber("campaignDistrictId", backendValues.campaignDistrictId),
  //   [backendValues.campaignDistrictId]
  // );
  useEffect(() => patchNumber("campaignId", backendValues.campaignId), [
    backendValues.campaignId,
  ]);

  useEffect(() => {
  if (backendValues.issuedTo != null) {
    if (values.issuedTo !== backendValues.issuedTo) {
      setFieldValue("issuedTo", backendValues.issuedTo, false);
    }
  }
}, [backendValues.issuedTo, values.issuedTo, setFieldValue]);
  // useEffect(() => patchNumber("issuedToId", backendValues.issuedToId), [
  //   backendValues.issuedToId,
  // ]);
  useEffect(
    () =>
      patchNumber(
        "selectedBalanceTrackId",
        backendValues.selectedBalanceTrackId
      ),
    [backendValues.selectedBalanceTrackId]
  );
 
  // --------------------------------------------------------------
  //          🔥 PATCH APPLICATION SERIES RELATED FIELDS
  // --------------------------------------------------------------
  useEffect(() => {
    if (!backendValues) return;
 
    // Application Series string
    if (backendValues.applicationSeries != null) {
      if (values.applicationSeries !== backendValues.applicationSeries) {
        setFieldValue(
          "applicationSeries",
          backendValues.applicationSeries,
          false
        );
      }
    }
 
    // Application Count
    if (backendValues.applicationCount != null) {
      const nextVal = String(backendValues.applicationCount);
      if (values.applicationCount !== nextVal) {
        setFieldValue("applicationCount", nextVal, false);
      }
    }
 
    // Start No (applicationNoFrom)
    if (backendValues.applicationNoFrom != null) {
      const nextVal = String(backendValues.applicationNoFrom);
      if (values.applicationNoFrom !== nextVal) {
        setFieldValue("applicationNoFrom", nextVal, false);
      }
    }
 
    // AVAILABLE RANGE
    if (backendValues.availableAppNoFrom != null) {
      const nextVal = String(backendValues.availableAppNoFrom);
      if (values.availableAppNoFrom !== nextVal) {
        setFieldValue("availableAppNoFrom", nextVal, false);
      }
    }
 
    if (backendValues.availableAppNoTo != null) {
      const nextVal = String(backendValues.availableAppNoTo);
      if (values.availableAppNoTo !== nextVal) {
        setFieldValue("availableAppNoTo", nextVal, false);
      }
    }
  }, [backendValues, values, setFieldValue]);
 
  return null;
};
 
 