import React, { useMemo, useState, useEffect, useRef } from "react";
import DistributeForm from "../DistributeForm";

import {
  useGetAcademicYears,
  useGetCities,
  useGetZoneByCity,
  useGetCampusByZone,
  useGetMobileNo,
  useGetDgmsByCampus,
  useGetAllFeeAmounts,
  useGetApplicationSeriesForEmpId,
  useGetDgmWithZonalAccountant,
  useGetLocationOfEmployees,
  useGetThreeAcademicYear,
} from "../../../../queries/applicationqueries/application-distribution/dropdownqueries";
import { useRole } from "../../../../hooks/useRole";

// ---------------- LABEL / ID HELPERS ----------------
const yearLabel = (y) => y?.academicYear ?? y?.name ?? "";
const yearId = (y) => y?.acdcYearId ?? y?.id ?? null;

const cityLabel = (c) => c?.name ?? "";
const cityId = (c) => c?.id ?? null;

const zoneLabel = (z) => z?.zoneName ?? "";
const zoneId = (z) => z?.zoneId ?? z?.id ?? null;

const campusLabel = (c) => c?.name ?? "";
const campusId = (c) => c?.id ?? null;

const empLabel = (e) => e?.name ?? "";
const empId = (e) => e?.id ?? null;

const asArray = (v) => (Array.isArray(v) ? v : []);

// ----------------------------------------------------------
//                          DGM FORM
// ----------------------------------------------------------
const DgmForm = ({
  initialValues = {},
  onSubmit,
  setIsInsertClicked,
  isUpdate = false,
  editId,
  setCallTable,
  setTableTrigger,
}) => {

  const isHydratingRef = useRef(true);
  const prevCityNameRef = useRef(null);
  const prevZoneNameRef = useRef(null);
  const prevCampusNameRef = useRef(null);
  const initialValuesLockedRef = useRef(false);
  const isProcessingChangeRef = useRef(false); // Track if we're processing a dropdown change
  const lastProcessedValuesRef = useRef({}); // Track last processed values to prevent duplicate processing

  // ---------------- SELECTED VALUES ----------------
  const [selectedAcademicYearId, setSelectedAcademicYearId] = useState(null);
  const [selectedCityId, setSelectedCityId] = useState(null);
  const [selectedZoneId, setSelectedZoneId] = useState(null);
  const [selectedCampusId, setSelectedCampusId] = useState(null);
  const [issuedToId, setIssuedToId] = useState(null);
  const [selectedFee, setSelectedFee] = useState(null);
  const [selectedSeries, setSelectedSeries] = useState(null);

  // ---------------- INITIAL FORM VALUES ----------------
  const [seedInitialValues, setSeedInitialValues] = useState({
    ...initialValues,
    academicYear: initialValues?.academicYear || "",
  });

  const { data: academicYear } = useGetThreeAcademicYear();

  const didSeedRef = useRef(false);
  const employeeId = localStorage.getItem("empId");
  const category = localStorage.getItem("category");
  const campusCategory = localStorage.getItem("campusCategory");

  // ---------------- API CALLS ----------------
  const { data: yearsRaw = [] } = useGetAcademicYears();
  const { data: citiesRaw = [] } = useGetCities();
  const { data: zonesRaw = [] } = useGetZoneByCity(selectedCityId);
  const { data: campusRaw = [] } = useGetDgmWithZonalAccountant(selectedZoneId, campusCategory);
  console.log("Campus Raw Data: ", campusRaw);
  const { data: employeesRaw = [] } = useGetDgmsByCampus(selectedCampusId);
  const { data: mobileNo } = useGetMobileNo(issuedToId);
  const { hasRole: isUserAdmin } = useRole("ADMIN");

  const { data: locationData, isLoading,
    isFetching,
    isSuccess: isLocationSuccess,
    isError, } = useGetLocationOfEmployees(employeeId, campusCategory, isUserAdmin);
  console.log("ZONAL ACCOUNTANT LOCATIONS: ", locationData);

  // Application Fee
  const { data: applicationFee = [] } = useGetAllFeeAmounts(
    employeeId,
    selectedAcademicYearId
  );

  console.log("Application Fees : ", applicationFee);

  // APPLICATION SERIES (PRIMARY API)
  const { data: applicationSeries = [] } =
    useGetApplicationSeriesForEmpId(
      employeeId,
      selectedAcademicYearId,
      selectedFee,
      false,

    );

  console.log("Application Series: ", applicationSeries);

  // ---------------- NORMALIZE ARRAYS ----------------
  const years = asArray(yearsRaw);
  const cities = asArray(citiesRaw);
  const zones = asArray(zonesRaw);
  const campuses = asArray(campusRaw);
  const employees = asArray(employeesRaw);

  useEffect(() => {
    if (!isUpdate) return;

    // 🔁 reset hydration guards on every edit open
    updateHydratedRef.current = false;
    hydratedRef.current = false;
    isHydratingRef.current = true;
    initialValuesLockedRef.current = false; // ✅ Reset lock to allow re-hydration
    isProcessingChangeRef.current = false; // Reset processing flag
    lastProcessedValuesRef.current = {}; // Reset last processed values

  }, [editId, isUpdate]);

  useEffect(() => {
    if (isUpdate) return;               // 🔒 do not touch update
    if (!academicYear?.currentYear) return;

    const { academicYear: yearName, acdcYearId } =
      academicYear.currentYear;

    // ✅ 1. Set visible dropdown value
    setSeedInitialValues(prev => ({
      ...prev,
      academicYear: yearName,
    }));

    // ✅ 2. Set ID for APIs
    if (initialValues?.academicYearId) {
      setSelectedAcademicYearId(initialValues.academicYearId);
    }

    isHydratingRef.current = false;
  }, [academicYear, isUpdate]);

  const hydratedRef = useRef(false);

  const updateHydratedRef = useRef(false);

  useEffect(() => {
    if (!isUpdate || !editId) return;
    if (initialValuesLockedRef.current) return;

    console.log("🟢 HYDRATING FORM ONCE");

    isHydratingRef.current = true;

    setSelectedAcademicYearId(initialValues.academicYearId ?? null);
    setSelectedCityId(initialValues.cityId ?? null);
    setSelectedZoneId(initialValues.zoneId ?? null);
    setSelectedCampusId(initialValues.campusId ?? null);
    // ✅ Use issuedToId if available, otherwise fallback to issuedToEmpId
    const initialIssuedToId = initialValues.issuedToId ?? initialValues.issuedToEmpId;
    setIssuedToId(initialIssuedToId ?? null);
    setSelectedFee(initialValues.applicationFee ?? null);
    setSelectedSeries(initialValues.applicationSeries ?? null);

    prevCityNameRef.current = initialValues.cityName ?? null;
    prevZoneNameRef.current = initialValues.zoneName ?? null;
    prevCampusNameRef.current = initialValues.campusName ?? null;

    setSeedInitialValues({
      academicYear: initialValues.academicYear ?? "",
      cityName: initialValues.cityName ?? "",
      zoneName: initialValues.zoneName ?? "",
      campusName: initialValues.campusName ?? "",
      issuedTo: initialValues.issuedName ?? "",
      applicationFee: initialValues.applicationFee ?? "",
      applicationSeries: initialValues.applicationSeries ?? "",
      // ✅ Ensure issuedToId is set in Formik initial values
      issuedToId: initialIssuedToId ?? null,
      issuedToEmpId: initialIssuedToId ?? null,
    });

    initialValuesLockedRef.current = true;

    setTimeout(() => {
      isHydratingRef.current = false;
      updateHydratedRef.current = true; // Mark that initial hydration is complete
    }, 0);

  }, [editId, isUpdate]);

  useEffect(() => {
    if (isUpdate) return;
    if (hydratedRef.current) return;
    if (!isLocationSuccess || !locationData) return;
    if (isUserAdmin) return;

    const { cityId: cId, zoneId: zId, cityName, zoneName } = locationData;

    // ⛔ backend returned nulls
    if (!cId || !zId) {
      hydratedRef.current = true;
      isHydratingRef.current = false;
      return;
    }

    // 🔁 STEP 1: set city (trigger zones API)
    if (selectedCityId !== cId) {
      isHydratingRef.current = true;
      setSelectedCityId(cId);
      return;
    }

    // ⛔ wait until city exists
    const cityExists = cities.some(c => cityId(c) === cId);
    if (!cityExists) return;

    // ⛔ wait until zones load
    if (!zones.length) return;

    const zoneExists = zones.some(z => zoneId(z) === zId);
    if (!zoneExists) return;

    // ✅ STEP 2: set zone + Formik names
    setSelectedZoneId(zId);

    // setSeedInitialValues(prev => ({
    //   ...prev,
    //   cityName,
    //   zoneName,
    // }));

    prevCityNameRef.current = cityName;
    prevZoneNameRef.current = zoneName;

    hydratedRef.current = true;
    isHydratingRef.current = false;
  }, [
    isLocationSuccess,
    locationData,
    selectedCityId,
    zones,
    cities,        // ✅ IMPORTANT
    isUserAdmin,
  ]);


  // ---------------- OPTIONS FOR UI ----------------
  const academicYearNames = useMemo(() => years.map(yearLabel), [years]);
  const cityNames = useMemo(() => cities.map(cityLabel), [cities]);
  const zoneNames = useMemo(() => zones.map(zoneLabel), [zones]);
  const campusNames = useMemo(() => campuses.map(campusLabel), [campuses]);
  const issuedToNames = useMemo(() => employees.map(empLabel), [employees]);

  // ---------------- REVERSE MAPPINGS ----------------
  const yearMap = useMemo(() => new Map(years.map((y) => [yearLabel(y), yearId(y)])), [years]);
  const cityMap = useMemo(() => new Map(cities.map((c) => [cityLabel(c), cityId(c)])), [cities]);
  const zoneMap = useMemo(() => new Map(zones.map((z) => [zoneLabel(z), zoneId(z)])), [zones]);
  const campusMap = useMemo(() => new Map(campuses.map((c) => [campusLabel(c), campusId(c)])), [campuses]);
  const empMap = useMemo(() => new Map(employees.map((e) => [empLabel(e), empId(e)])), [employees]);

  // ---------------- DEFAULT ACADEMIC YEAR ----------------
  useEffect(() => {
    if (didSeedRef.current) return;
    if (!years.length) return;

    const defaultYear = years.find((y) => yearLabel(y) === "2025-26");

    if (defaultYear) {
      setSelectedAcademicYearId(yearId(defaultYear));
      didSeedRef.current = true;
    }
  }, [years]);

  // ---------------- RESET ON CHANGE ----------------
  const handleValuesChange = React.useCallback((values, setFieldValue) => {
    if (!setFieldValue) return;

    // Don't process changes during initial hydration
    if (isHydratingRef.current && !updateHydratedRef.current) return;

    // Prevent processing if we're already processing a change (prevents infinite loops)
    if (isProcessingChangeRef.current) return;

    // Create a key from current values to detect actual changes
    const valuesKey = `${values.cityName}-${values.zoneName}-${values.campusName}-${values.academicYear}-${values.issuedTo}-${values.applicationFee}-${values.applicationSeries}`;

    // Skip if we've already processed these exact values
    if (lastProcessedValuesRef.current.key === valuesKey) {
      return;
    }

    // Update the last processed key
    lastProcessedValuesRef.current.key = valuesKey;

    /* ================= ACADEMIC YEAR ================= */
    if (values.academicYear && yearMap.has(values.academicYear)) {
      const id = yearMap.get(values.academicYear);

      if (id !== selectedAcademicYearId) {
        isProcessingChangeRef.current = true;
        setSelectedAcademicYearId(id);
        setSelectedFee(null); // reset dependent data
        // Reset the flag after state updates
        setTimeout(() => {
          isProcessingChangeRef.current = false;
        }, 0);
      }
    }

    /* ================= CITY ================= */
    if (
      values.cityName &&
      cityMap.has(values.cityName)
    ) {
      const newCityId = cityMap.get(values.cityName);

      if (newCityId !== selectedCityId) {
        isProcessingChangeRef.current = true;

        setFieldValue("zoneName", "", false); // Set validate to false to prevent re-render loops
        setFieldValue("campusName", "", false);
        setFieldValue("issuedTo", "", false);

        setSelectedZoneId(null);
        setSelectedCampusId(null);
        setIssuedToId(null);
        setSelectedFee(null);

        setSelectedCityId(newCityId);
        prevCityNameRef.current = values.cityName;
        prevZoneNameRef.current = null; // Reset child ref
        prevCampusNameRef.current = null; // Reset child ref

        // Reset the flag after a short delay to allow API calls to complete
        setTimeout(() => {
          isProcessingChangeRef.current = false;
        }, 100);
      }
    }


    /* ================= ZONE ================= */
    if (values.zoneName && zoneMap.has(values.zoneName)) {
      const newZoneId = zoneMap.get(values.zoneName);

      if (newZoneId !== selectedZoneId && !isProcessingChangeRef.current) {
        isProcessingChangeRef.current = true;

        // 🔥 ONLY reset children, not parent state
        setFieldValue("campusName", "", false);
        setFieldValue("issuedTo", "", false);

        setSelectedCampusId(null);
        setIssuedToId(null);
        setSelectedFee(null);

        // ✅ ALWAYS allow change
        setSelectedZoneId(newZoneId);
        prevZoneNameRef.current = values.zoneName;
        prevCampusNameRef.current = null; // Reset child ref

        setTimeout(() => {
          isProcessingChangeRef.current = false;
        }, 100);
      }
    }

    /* ================= CAMPUS ================= */
    if (values.campusName && campusMap.has(values.campusName)) {
      const newCampusId = campusMap.get(values.campusName);

      if (newCampusId !== selectedCampusId && !isProcessingChangeRef.current) {
        isProcessingChangeRef.current = true;

        setFieldValue("issuedTo", "", false);
        setIssuedToId(null);
        setSelectedFee(null);

        // ✅ allow update
        setSelectedCampusId(newCampusId);
        prevCampusNameRef.current = values.campusName;

        setTimeout(() => {
          isProcessingChangeRef.current = false;
        }, 100);
      }
    }

    /* ================= ISSUED TO ================= */
    if (values.issuedTo && empMap.has(values.issuedTo)) {
      const newEmpId = empMap.get(values.issuedTo);
      if (newEmpId !== issuedToId) {
        setIssuedToId(newEmpId);
      }
    }

    /* ================= APPLICATION FEE ================= */
    if (values.applicationFee && values.applicationFee !== selectedFee) {
      setSelectedFee(values.applicationFee);

      if (!isUpdate) {
        setFieldValue("applicationSeries", "");
        setFieldValue("applicationCount", "");
        setFieldValue("availableAppNoFrom", "");
        setFieldValue("availableAppNoTo", "");
        setFieldValue("applicationNoFrom", "");
      }
    }

    /* ================= APPLICATION SERIES ================= */
    if (values.applicationSeries && values.applicationSeries !== selectedSeries) {
      setSelectedSeries(values.applicationSeries);
    }
  }, [
    yearMap,
    cityMap,
    zoneMap,
    campusMap,
    empMap,
    selectedAcademicYearId,
    selectedCityId,
    selectedZoneId,
    selectedCampusId,
    issuedToId,
    selectedFee,
    selectedSeries,
    isUpdate,
  ]);



  // ---------------- SELECTED SERIES OBJECT ----------------
  const seriesObj = useMemo(() => {
    if (!selectedSeries) return null;

    return (
      applicationSeries.find((s) => s.displaySeries === selectedSeries) || null
    );
  }, [selectedSeries, applicationSeries]);

  // ---------------- BACKEND VALUES (MATCHES ZoneForm) ----------------
  // Use refs to track previous computed values to prevent unnecessary recalculations
  const backendValuesRef = useRef({});
  const prevBackendValuesKeyRef = useRef("");

  const backendValues = useMemo(() => {
    // Create a key from the actual values that matter, not array references
    const valuesKey = `${isUpdate}-${selectedAcademicYearId}-${selectedCityId}-${selectedZoneId}-${selectedCampusId}-${issuedToId}-${selectedSeries}-${selectedFee}-${mobileNo}`;

    // If values haven't actually changed, return cached object
    if (valuesKey === prevBackendValuesKeyRef.current && backendValuesRef.current) {
      return backendValuesRef.current;
    }

    const obj = {};

    // In update mode, merge initial values with new selections
    if (isUpdate && initialValues) {
      // Start with initial values as base, but override with new selections
      obj.academicYearId = selectedAcademicYearId ?? initialValues.academicYearId;
      obj.academicYear = seedInitialValues.academicYear || initialValues.academicYear;
      // 1. Resolve IDs with hierarchy checks to prevent invalid fallbacks
      const finalCityId = selectedCityId ?? initialValues.cityId;
      const isCityChanged = finalCityId !== initialValues.cityId;

      const finalZoneId = isCityChanged ? selectedZoneId : (selectedZoneId ?? initialValues.zoneId);
      const isZoneChanged = finalZoneId !== initialValues.zoneId;

      const finalCampusId = isZoneChanged ? selectedCampusId : (selectedCampusId ?? initialValues.campusId);
      const isCampusChanged = finalCampusId !== initialValues.campusId;

      obj.cityId = finalCityId;
      obj.zoneId = finalZoneId;
      obj.campusId = finalCampusId;

      // ✅ CRITICAL: Set issuedToId properly - this becomes dgmEmployeeId in the DTO
      // Use current selected value, or fallback to initial ONLY if campus hasn't changed
      let finalIssuedToId = null;
      if (isCampusChanged) {
        finalIssuedToId = issuedToId;
      } else {
        finalIssuedToId = issuedToId ?? initialValues.issuedToId ?? initialValues.issuedToEmpId;
      }

      // ⛔ Prevent 0 or null - this causes "Employee ID: 0" error
      if (finalIssuedToId && finalIssuedToId !== 0) {
        obj.issuedToEmpId = finalIssuedToId;
        obj.issuedToId = finalIssuedToId; // ✅ Required for dgmFormDTO
      } else {
        // If still null/0, use initial values ONLY if campus matched
        if (!isCampusChanged) {
          obj.issuedToEmpId = initialValues.issuedToEmpId ?? initialValues.issuedToId;
          obj.issuedToId = initialValues.issuedToId ?? initialValues.issuedToEmpId;
        } else {
          obj.issuedToEmpId = null;
          obj.issuedToId = null;
        }
      }
      // If campus changed, incorrect to send old name
      // obj.issuedTo = isCampusChanged ? "" : initialValues.issuedTo;

      // ✅ FIX: Try to resolve the name for the selected ID
      let computedIssuedToName = "";
      if (finalIssuedToId && employees.length > 0) {
        const e = employees.find(emp => empId(emp) === finalIssuedToId);
        if (e) computedIssuedToName = empLabel(e);
      }

      if (computedIssuedToName) {
        obj.issuedTo = computedIssuedToName;
      } else {
        // Fallback checks
        obj.issuedTo = isCampusChanged ? "" : initialValues.issuedTo;
      }

      // ✅ CRITICAL: Add applicationFee - required for application_Amount in DTO
      const finalApplicationFee = selectedFee ?? initialValues.applicationFee ?? seedInitialValues.applicationFee;
      if (finalApplicationFee != null) {
        obj.applicationFee = Number(finalApplicationFee); // Ensure it's a number
      }

      // Get names from maps if IDs are selected, otherwise use initial values
      // Only compute names if we have the data and IDs are set
      let computedCityName = prevCityNameRef.current || initialValues.cityName;
      // If city changed, do not fallback to initial zone name
      let computedZoneName = prevZoneNameRef.current || (isCityChanged ? "" : initialValues.zoneName);
      // If zone changed, do not fallback to initial campus name
      let computedCampusName = prevCampusNameRef.current || (isZoneChanged ? "" : initialValues.campusName);

      if (finalCityId && cities.length > 0) {
        const city = cities.find(c => cityId(c) === finalCityId);
        if (city) {
          computedCityName = cityLabel(city);
          prevCityNameRef.current = computedCityName;
        }
      }

      if (finalZoneId && zones.length > 0) {
        const zone = zones.find(z => zoneId(z) === finalZoneId);
        if (zone) {
          computedZoneName = zoneLabel(zone);
          prevZoneNameRef.current = computedZoneName;
        }
      }

      if (finalCampusId && campuses.length > 0) {
        const campus = campuses.find(c => campusId(c) === finalCampusId);
        if (campus) {
          computedCampusName = campusLabel(campus);
          prevCampusNameRef.current = computedCampusName;
        }
      }

      obj.cityName = computedCityName;
      obj.zoneName = computedZoneName;
      obj.campusName = computedCampusName;

      // Use new series if selected, otherwise keep initial
      if (seriesObj) {
        obj.applicationSeries = seriesObj.displaySeries;
        obj.applicationCount = seriesObj.availableCount;
        obj.availableAppNoFrom = seriesObj.masterStartNo;
        obj.availableAppNoTo = seriesObj.masterEndNo;
        obj.applicationNoFrom = seriesObj.startNo;
      } else {
        obj.applicationSeries = seedInitialValues.applicationSeries || initialValues.applicationSeries;
        obj.applicationCount = initialValues.applicationCount;
        obj.applicationNoFrom = initialValues.applicationNoFrom;
        obj.availableAppNoFrom = initialValues.availableAppNoFrom;
        obj.availableAppNoTo = initialValues.availableAppNoTo;
      }

      // Add mobile number if available
      if (mobileNo != null) obj.mobileNumber = String(mobileNo);

      // Cache the result
      backendValuesRef.current = obj;
      prevBackendValuesKeyRef.current = valuesKey;
      return obj;
    }

    // Create mode - original logic
    if (mobileNo != null) obj.mobileNumber = String(mobileNo);

    if (seriesObj) {
      obj.applicationSeries = seriesObj.displaySeries;
      obj.applicationCount = seriesObj.availableCount;
      obj.availableAppNoFrom = seriesObj.masterStartNo;
      obj.availableAppNoTo = seriesObj.masterEndNo;
      obj.applicationNoFrom = seriesObj.startNo;
    }

    if (selectedAcademicYearId != null) {
      obj.academicYearId = Number(selectedAcademicYearId);
      obj.academicYear = seedInitialValues.academicYear; // 🔥 REQUIRED
    }
    if (selectedCityId != null) obj.cityId = selectedCityId;
    if (selectedZoneId != null) obj.zoneId = selectedZoneId;
    if (selectedCampusId != null) obj.campusId = selectedCampusId;

    // 🔥 ADD THESE
    if (locationData?.cityName) obj.cityName = locationData.cityName;
    if (locationData?.zoneName) obj.zoneName = locationData.zoneName;

    if (issuedToId != null) {
      obj.issuedToEmpId = issuedToId;
      obj.issuedToId = issuedToId;
    }

    // Cache and return for create mode too
    backendValuesRef.current = obj;
    prevBackendValuesKeyRef.current = valuesKey;
    return obj;
  }, [
    isUpdate,
    initialValues,
    mobileNo,
    seriesObj,
    selectedAcademicYearId,
    selectedCityId,
    selectedZoneId,
    selectedCampusId,
    issuedToId,
    applicationFee,
    locationData,
    seedInitialValues,
    selectedSeries,
    selectedFee, // Add selectedFee to dependencies
    cities, // Needed for name lookup but changes are controlled
    zones, // Needed for name lookup but changes are controlled
    campuses, // Needed for name lookup but changes are controlled
    employees, // ✅ Needed for name lookup
  ]);

  // ---------------- DYNAMIC OPTIONS ----------------
  const dynamicOptions = useMemo(() => ({
    academicYear: academicYearNames,
    cityName: cityNames,
    zoneName: zoneNames,
    campusName: campusNames,
    issuedTo: issuedToNames,

    // FIX: applicationFee.data instead of applicationFee
    applicationFee: Array.isArray(applicationFee)
      ? applicationFee.map((f) => String(f))
      : [],

    // FIX: applicationSeries default fallback
    applicationSeries: Array.isArray(applicationSeries)
      ? applicationSeries.map((s) => s.displaySeries)
      : [],
  }), [
    academicYearNames,
    cityNames,
    zoneNames,
    campusNames,
    issuedToNames,
    applicationFee,
    applicationSeries,
  ]);

  return (
    <DistributeForm
      formType="DGM"
      initialValues={seedInitialValues}
      onSubmit={onSubmit}
      setIsInsertClicked={setIsInsertClicked}
      dynamicOptions={dynamicOptions}
      backendValues={backendValues}
      onValuesChange={handleValuesChange}
      onApplicationFeeSelect={(fee) => setSelectedFee(fee)}
      onSeriesSelect={(series) => setSelectedSeries(series)}
      applicationSeriesList={applicationSeries}
      isUpdate={isUpdate}
      editId={editId}
      setCallTable={setCallTable}
      setTableTrigger={setTableTrigger}
    />
  );
};

export default DgmForm;