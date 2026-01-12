import React, { useMemo, useState, useEffect, useRef, use } from "react";
import DistributeForm from "../DistributeForm";

import {
  useGetStateName,
  useGetCityByStateId,
  useGetZoneByCity,
  useGetEmployeesByZone,
  useGetMobileNo,
  useGetAllFeeAmounts,
  useGetApplicationSeriesForEmpId,
  useGetLocationOfEmployees,
  useGetThreeAcademicYear
} from "../../../../queries/applicationqueries/application-distribution/dropdownqueries";
import { useRole } from "../../../../hooks/useRole";
import { useFormikContext } from "formik";

// ---------- LABEL/ID HELPERS ----------
const stateLabel = (s) => s?.stateName ?? s?.name ?? "";
const stateId = (s) => s?.stateId ?? s?.id ?? null;

const yearLabel = (y) =>
  y?.academicYear ?? y?.name ?? String(y?.year ?? y?.id ?? "");
const yearId = (y) => y?.acdcYearId ?? y?.id ?? null;

const cityLabel = (c) => c?.cityName ?? c?.name ?? "";
const cityId = (c) => c?.cityId ?? c?.id ?? null;

const zoneLabel = (z) => z?.zoneName ?? z?.name ?? "";
const zoneId = (z) => z?.zoneId ?? z?.id ?? null;

// Employee Name
const empLabel = (e) =>
  [e?.firstName, e?.lastName].filter(Boolean).join(" ").trim() ||
  e?.employeeName ||
  e?.name ||
  "";
const empId = (e) => e?.empId ?? e?.employeeId ?? e?.id ?? null;

const asArray = (v) => (Array.isArray(v) ? v : []);

// ---------------------------------------------------------------------------
//                       ZONE FORM COMPONENT
// ---------------------------------------------------------------------------
const ZoneForm = ({
  initialValues = {},
  onSubmit,
  setIsInsertClicked,
  isUpdate = false,
  editId,
  setCallTable,
  setTableTrigger,
}) => {

  // const {setFieldValue} = useFormikContext();
  const isHydratingRef = useRef(true);
  const prevStateNameRef = useRef(null);
  const prevCityNameRef = useRef(null);
  const prevZoneNameRef = useRef(null);


  // ---------------------  SELECTED VALUES -------------------------
  const [selectedStateId, setSelectedStateId] = useState(null);
  const [selectedCityId, setSelectedCityId] = useState(null);
  const [selectedZoneId, setSelectedZoneId] = useState(null);
  const [selectedAcademicYearId, setSelectedAcademicYearId] = useState(null);
  const [issuedToEmpId, setIssuedToEmpId] = useState(null);

  const [selectApplicationFee, setSelectedApplicationFee] = useState(null);

  const [customAcademicYear, setCustomAcademicYear] = useState(null);
  const [selectedSeries, setSelectedSeries] = useState(null);

  const { data: academicYear } = useGetThreeAcademicYear();
  console.log("Three Academic Year: ", academicYear);

  // --------------------- INITIAL FORM VALUES -------------------------
  const [seedInitialValues, setSeedInitialValues] = useState({
    ...initialValues,
    academicYear: initialValues.academicYear || "",
  });

  useEffect(() => {
    if (isUpdate) return;               // 🔒 do not touch update
    if (!academicYear?.currentYear) return;

    const { academicYear: yearName, acdcYearId } =
      academicYear.currentYear;

    // ✅ 1. Set visible dropdown value (LABEL)
    setSeedInitialValues(prev => ({
      ...prev,
      academicYear: yearName,
    }));

    // ✅ 2. Set ID for backend & dependent APIs
    setSelectedAcademicYearId(acdcYearId);

    isHydratingRef.current = false;
  }, [academicYear, isUpdate]);



  useEffect(() => {
    if (!isUpdate) {
      isHydratingRef.current = false;
      return;
    }
    // initialize previous values from update data
    prevStateNameRef.current = seedInitialValues.stateName || null;
    prevCityNameRef.current = seedInitialValues.cityName || null;
    prevZoneNameRef.current = seedInitialValues.zoneName || null;

    if (initialValues.academicYearId) {
      setSelectedAcademicYearId(initialValues.academicYearId);
    }

    isHydratingRef.current = false;
  }, [isUpdate, seedInitialValues]);

  const { hasRole: isUserAdmin } = useRole("ADMIN");
  console.log("Is User Admin: ", isUserAdmin);
  const campusCategory = localStorage.getItem("campusCategory");
  console.log("Employee Campus Category :", campusCategory);


  // --------------------- BASIC DROPDOWNS ----------------------------
  const { data: statesRaw = [] } = useGetStateName();

  const { data: citiesRaw = [] } = useGetCityByStateId(selectedStateId);
  const { data: zonesRaw = [] } = useGetZoneByCity(selectedCityId);
  const { data: employeesRaw = [] } = useGetEmployeesByZone(selectedZoneId, campusCategory);

  const { data: mobileNo } = useGetMobileNo(issuedToEmpId);

  const employeeId = localStorage.getItem("empId");

  // -------------------- APPLICATION FEE ----------------------------
  const { data: applicationFee = [] } = useGetAllFeeAmounts(
    employeeId,
    selectedAcademicYearId
  );

  console.log("------------------ ZONE FORM ---------------------")

  const { data } = useGetLocationOfEmployees(employeeId, campusCategory, isUserAdmin);
  console.log("Location of Employees Data:", data);

  // -------------------- APPLICATION SERIES -------------------------
  const { data: applicationSeries = [] } = useGetApplicationSeriesForEmpId(
    employeeId,
    selectedAcademicYearId,
    selectApplicationFee,
    false
  );

  // console.log("Application Fee:", applicationFee.data);
  console.log("Application Fee Selected:", selectApplicationFee);
  console.log("Application Series:", applicationSeries);

  // --------------------- NORMALIZE ARRAYS --------------------------
  const statesData = useMemo(() => asArray(statesRaw), [statesRaw]);

  // Construct years array from useGetThreeAcademicYear data
  const yearsData = useMemo(() => {
    if (!academicYear) return [];
    return [
      academicYear.currentYear,
      academicYear.nextYear,
      academicYear.previousYear
    ].filter(Boolean);
  }, [academicYear]);

  const citiesData = useMemo(() => asArray(citiesRaw), [citiesRaw]);
  const zonesData = useMemo(() => asArray(zonesRaw), [zonesRaw]);
  const employeesData = useMemo(() => asArray(employeesRaw), [employeesRaw]);

  // ---------------------- BUILD OPTIONS ----------------------------
  const stateNames = useMemo(
    () => statesData.map(stateLabel).filter(Boolean),
    [statesData]
  );

  const academicYearNames = useMemo(() => yearsData.map(yearLabel), [yearsData]);

  const academicYearSearchOptions = useMemo(
    () => yearsData.map(yearLabel),
    [yearsData]
  );

  const cityNames = citiesData.map(cityLabel);
  const zoneNames = zonesData.map(zoneLabel);
  const issuedToNames = employeesData.map(empLabel);

  // -------------------- LABEL → ID MAPS ---------------------------
  const stateNameToId = useMemo(() => {
    const m = new Map();
    statesData.forEach((s) => m.set(stateLabel(s), stateId(s)));
    return m;
  }, [statesData]);

  const yearNameToId = useMemo(() => {
    const m = new Map();
    yearsData.forEach((y) => m.set(yearLabel(y), yearId(y)));
    return m;
  }, [yearsData]);

  const cityNameToId = useMemo(() => {
    const m = new Map();
    citiesData.forEach((c) => m.set(cityLabel(c), cityId(c)));
    return m;
  }, [citiesData]);

  const zoneNameToId = useMemo(() => {
    const m = new Map();
    zonesData.forEach((z) => m.set(zoneLabel(z), zoneId(z)));
    return m;
  }, [zonesData]);

  const empNameToId = useMemo(() => {
    const m = new Map();
    employeesData.forEach((e) => m.set(empLabel(e), empId(e)));
    return m;
  }, [employeesData]);

  const isProcessingChangeRef = useRef(false);
  const lastProcessedValuesRef = useRef({});

  // -----------------------------------------------------------------------
  //      WHEN PARENT DROPDOWN CHANGES → RESET CHILD DROPDOWNS
  // -----------------------------------------------------------------------
  const handleValuesChange = React.useCallback((values, setFieldValue) => {

    if (!setFieldValue) return; // Safety check

    // Prevent processing if we're already processing a change (prevents infinite loops)
    if (isProcessingChangeRef.current) return;

    // Create a key from current values to detect actual changes
    const valuesKey = `${values.stateName}-${values.cityName}-${values.zoneName}-${values.academicYear}-${values.issuedTo}-${values.applicationFee}`;

    // Skip if we've already processed these exact values
    if (lastProcessedValuesRef.current.key === valuesKey) {
      return;
    }
    // Update the last processed key
    lastProcessedValuesRef.current.key = valuesKey;


    // Academic Year
    if (values.academicYear) {
      if (yearNameToId.has(values.academicYear)) {
        const id = yearNameToId.get(values.academicYear);
        if (id !== selectedAcademicYearId) {
          isProcessingChangeRef.current = true;
          setSelectedAcademicYearId(id);
          setSelectedApplicationFee(null); // reset fee
          setTimeout(() => { isProcessingChangeRef.current = false; }, 0);
        }
      } else {
        // Custom year logic
        if (values.academicYear !== customAcademicYear) {
          setCustomAcademicYear(values.academicYear);
          setSelectedAcademicYearId(null);
          setSelectedApplicationFee(null);
        }
      }
    }

    // ---------------- STATE → RESET CITY, ZONE, EMPLOYEE ----------------
    if (values.stateName && stateNameToId.has(values.stateName)) {
      const id = stateNameToId.get(values.stateName);
      const prev = prevStateNameRef.current;

      // Only process if ID changed or we are not hydrating/checking duplicates
      // Note: checking `id !== selectedStateId` helps, but we also rely on the valuesKey guard now.

      if (id !== selectedStateId) {
        setSelectedStateId(id);
      } // We usually want to set this even if hydrating ? 

      // The logic below was: if (!isHydratingRef.current && values.stateName !== prev)
      if (!isHydratingRef.current && values.stateName !== prev) {
        isProcessingChangeRef.current = true;
        setSelectedStateId(id);

        // 🔥 Reset children in BOTH create & update
        setFieldValue("cityName", "");
        setFieldValue("zoneName", "");
        setFieldValue("issuedTo", "");

        setSelectedCityId(null);
        setSelectedZoneId(null);
        setIssuedToEmpId(null);
        setTimeout(() => { isProcessingChangeRef.current = false; }, 100);
      }

      prevStateNameRef.current = values.stateName;
    }

    // ---------------- CITY → RESET ZONE, EMPLOYEE ----------------
    if (values.cityName && cityNameToId.has(values.cityName)) {
      const id = cityNameToId.get(values.cityName);
      const prev = prevCityNameRef.current;

      if (id !== selectedCityId) {
        setSelectedCityId(id);
      }

      if (!isHydratingRef.current && values.cityName !== prev) {
        isProcessingChangeRef.current = true;
        setSelectedCityId(id);

        setFieldValue("zoneName", "");
        setFieldValue("issuedTo", "");

        setSelectedZoneId(null);
        setIssuedToEmpId(null);
        setSelectedApplicationFee(null);
        setTimeout(() => { isProcessingChangeRef.current = false; }, 100);
      }

      prevCityNameRef.current = values.cityName;
    }

    // ---------------- ZONE → RESET EMPLOYEE ----------------
    if (values.zoneName && zoneNameToId.has(values.zoneName)) {
      const id = zoneNameToId.get(values.zoneName);
      const prev = prevZoneNameRef.current;

      if (id !== selectedZoneId) {
        setSelectedZoneId(id);
      }

      if (!isHydratingRef.current && values.zoneName !== prev) {
        isProcessingChangeRef.current = true;
        setSelectedZoneId(id);

        setFieldValue("issuedTo", "");
        setIssuedToEmpId(null);
        setSelectedApplicationFee(null);
        setTimeout(() => { isProcessingChangeRef.current = false; }, 100);
      }

      prevZoneNameRef.current = values.zoneName;
    }

    // ---------------- EMPLOYEE SELECTED ----------------
    if (values.issuedTo && empNameToId.has(values.issuedTo)) {
      const id = empNameToId.get(values.issuedTo);
      if (id !== issuedToEmpId) {
        setIssuedToEmpId(id);
      }
    }


    if (values.applicationFee && values.applicationFee !== selectApplicationFee) {
      setSelectedApplicationFee(values.applicationFee);
      if (!isUpdate) {
        setFieldValue("applicationSeries", "");
        setFieldValue("applicationCount", "");
        setFieldValue("availableAppNoFrom", "");
        setFieldValue("availableAppNoTo", "");
        setFieldValue("applicationNoFrom", "");
      }
    }
  }, [
    yearNameToId, stateNameToId, cityNameToId, zoneNameToId, empNameToId,
    selectedAcademicYearId, selectedStateId, selectedCityId, selectedZoneId,
    issuedToEmpId, selectApplicationFee, isUpdate, customAcademicYear
  ]);

  const seriesObj = useMemo(() => {
    if (!selectedSeries) return null;

    const found = applicationSeries.find(
      (s) => s.displaySeries === selectedSeries
    );

    return found || null;
  }, [selectedSeries, applicationSeries]);

  const backendValues = useMemo(() => {
    const obj = {};

    if (mobileNo != null) obj.mobileNumber = String(mobileNo);

    if (issuedToEmpId != null) obj.issuedToEmpId = Number(issuedToEmpId);
    if (selectedAcademicYearId != null) {
      obj.academicYearId = Number(selectedAcademicYearId);
      // ✅ FIX: Find the label for the selected ID
      const selectedYearObj = yearsData.find(y => yearId(y) === Number(selectedAcademicYearId));
      obj.academicYear = selectedYearObj ? yearLabel(selectedYearObj) : seedInitialValues.academicYear;
    }
    if (selectedStateId != null) obj.stateId = Number(selectedStateId);
    if (selectedCityId != null) obj.cityId = Number(selectedCityId);
    if (selectedZoneId != null) obj.zoneId = Number(selectedZoneId);
    if (selectApplicationFee != null)
      obj.applicationFee = Number(selectApplicationFee);

    // ----------------- APPLICATION SERIES → SET FORM VALUES -----------------
    if (seriesObj) {
      obj.applicationSeries = seriesObj.displaySeries;
      obj.applicationCount = seriesObj.availableCount;
      obj.availableAppNoFrom = seriesObj.masterStartNo;
      obj.availableAppNoTo = seriesObj.masterEndNo;
      obj.applicationNoFrom = seriesObj.startNo;
    }

    return obj;
  }, [
    mobileNo,
    seriesObj,
    issuedToEmpId,
    selectedAcademicYearId,
    selectedStateId,
    selectedCityId,
    selectedZoneId,
    selectApplicationFee,
    yearsData, // ✅ Added yearsData dependency
    seedInitialValues
  ]);

  // ---------------------------------------------------------------------
  //                 DYNAMIC OPTIONS FOR UI
  // ---------------------------------------------------------------------
  const dynamicOptions = useMemo(
    () => ({
      academicYear: academicYearNames,
      stateName: stateNames,
      cityName: cityNames,
      zoneName: zoneNames,
      issuedTo: issuedToNames,
      applicationFee: Array.isArray(applicationFee)
        ? applicationFee.map((f) => String(f))
        : [],

      // FIX: applicationSeries default fallback
      applicationSeries: Array.isArray(applicationSeries)
        ? applicationSeries.map((s) => s.displaySeries)
        : [],
    }),
    [
      academicYearNames,
      stateNames,
      cityNames,
      zoneNames,
      issuedToNames,
      applicationFee,
      applicationSeries,
    ]
  );

  return (
    <DistributeForm
      formType="Zone"
      initialValues={seedInitialValues}
      onSubmit={onSubmit}
      setIsInsertClicked={setIsInsertClicked}
      dynamicOptions={dynamicOptions}
      backendValues={backendValues}
      searchOptions={{ academicYear: academicYearSearchOptions }}
      onValuesChange={handleValuesChange}
      onApplicationFeeSelect={(fee) => setSelectedApplicationFee(fee)}
      onSeriesSelect={(series) => setSelectedSeries(series)}
      applicationSeriesList={applicationSeries}
      isUpdate={isUpdate}
      editId={editId}
      setCallTable={setCallTable}
      setTableTrigger={setTableTrigger}
    />
  );
};

export default ZoneForm;
