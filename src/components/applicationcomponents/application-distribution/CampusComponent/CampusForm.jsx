import React, { useMemo, useState, useEffect, useRef, use } from "react";
import DistributeForm from "../DistributeForm";

import {
  useGetAllDistricts,
  useGetCitiesByDistrict,
  useGetProsByCampus,
  useGetMobileNo,
  useGetCampuesByCityWithCategory,
  useGetAllFeeAmounts,
  useGetApplicationSeriesForEmpId,
  useGetSchoolDgmCityDistrictId,
  useGetLocationOfEmployees,
  useGetThreeAcademicYear,
} from "../../../../queries/applicationqueries/application-distribution/dropdownqueries";
import { useRole } from "../../../../hooks/useRole";

// ---------- HELPERS ----------
const asArray = (v) => (Array.isArray(v) ? v : []);

const yearLabel = (y) => y?.academicYear ?? "";
const yearId = (y) => y?.acdcYearId ?? null;

const districtLabel = (d) => d?.districtName ?? "";
const districtId = (d) => d?.districtId ?? null;

const cityLabel = (c) => c?.name ?? "";
const cityId = (c) => c?.id ?? null;

const campusLabel = (c) => c?.name ?? "";
const campusId = (c) => c?.id ?? null;

const empLabel = (e) => e?.name ?? "";
const empId = (e) => e?.id ?? null;


// =====================================================================
//                           CAMPUS FORM
// =====================================================================
const CampusForm = ({
  initialValues = {},
  onSubmit,
  setIsInsertClicked,
  isUpdate = false,
  editId,
  setCallTable,
  setTableTrigger,
}) => {

  const isHydratingRef = useRef(true);
  const prevDistrictNameRef = useRef(null);
  const prevCityNameRef = useRef(null);
  const prevCampusNameRef = useRef(null);
  const isProcessingChangeRef = useRef(false); // Track if we're processing a dropdown change
  const lastProcessedValuesRef = useRef({}); // Track last processed values to prevent duplicate processing

  // ---------------- SELECTED KEYS ----------------
  const [selectedAcademicYearId, setSelectedAcademicYearId] = useState(null);
  const [selectedDistrictId, setSelectedDistrictId] = useState(null);
  const [selectedCityId, setSelectedCityId] = useState(null);
  const [selectedCampusId, setSelectedCampusId] = useState(null);
  const [issuedToId, setIssuedToId] = useState(null);
  const [selectedFee, setSelectedFee] = useState(null);
  const [selectedSeries, setSelectedSeries] = useState(null);

  const employeeId = localStorage.getItem("empId");
  const category = localStorage.getItem("campusCategory");
  const { hasRole: isUserAdmin } = useRole("ADMIN");
  const { data: academicYear } = useGetThreeAcademicYear();

  const { data: dgmEmpDetails } = useGetSchoolDgmCityDistrictId(employeeId, category);

  const { data: locationData, isLoading,
    isFetching,
    isSuccess: isLocationSuccess,
    isError, } = useGetLocationOfEmployees(employeeId, category, isUserAdmin);
  console.log("ZONAL/DGM ACCOUNTANT LOCATIONS: ", locationData);

  // ---------------- INITIAL FORM VALUES ----------------
  const [seedInitialValues, setSeedInitialValues] = useState({
    ...initialValues,
    academicYear: initialValues?.academicYear || "",
  });

  const didSeedRef = useRef(false);

  // ---------------- API CALLS ----------------
  // const { data: yearsRaw = [] } = useGetAcademicYears(); // REMOVED
  const { data: districtsRaw = [] } = useGetAllDistricts();
  const { data: citiesRaw = [] } = useGetCitiesByDistrict(selectedDistrictId);
  const { data: campusesRaw = [] } =
    useGetCampuesByCityWithCategory(category, selectedCityId);

  console.log("Campus Selected values: ", selectedCampusId);

  const { data: employeesRaw = [] } = useGetProsByCampus(selectedCampusId);
  console.log("Campus Selected Id : ", selectedCampusId);
  console.log("Employees :", employeesRaw);
  const { data: mobileNo } = useGetMobileNo(issuedToId);

  // SCHOOL AUTOFILL API
  const { data: empDetails } = useGetSchoolDgmCityDistrictId(
    employeeId,
    category
  );

  const { data: applicationFee = [] } =
    useGetAllFeeAmounts(employeeId, selectedAcademicYearId);
  console.log("Application Fee:", applicationFee);

  const { data: applicationSeries = [] } =
    useGetApplicationSeriesForEmpId(
      employeeId,
      selectedAcademicYearId,
      selectedFee,
      false
    );


  // ---------------- NORMALIZATION ----------------
  // Construct years array from useGetThreeAcademicYear data
  const years = useMemo(() => {
    if (!academicYear) return [];
    return [
      academicYear.currentYear,
      academicYear.nextYear,
      academicYear.previousYear
    ].filter(Boolean);
  }, [academicYear]);

  // const years = asArray(yearsRaw); // REMOVED
  const districts = asArray(districtsRaw);
  const cities = asArray(citiesRaw);
  const campuses = asArray(campusesRaw);
  const employees = asArray(employeesRaw);

  // ---------------- LABEL ARRAYS ----------------
  const academicYearNames = years.map(yearLabel);
  const districtNames = districts.map(districtLabel);
  const cityNames = cities.map(cityLabel);
  const campusNames = campuses.map(campusLabel);
  const issuedToNames = employees.map(empLabel);

  // ---------------- MAPPINGS ----------------
  const yearMap = new Map(years.map((y) => [yearLabel(y), yearId(y)]));
  const districtMap = new Map(
    districts.map((d) => [districtLabel(d), districtId(d)])
  );
  const cityMap = new Map(cities.map((c) => [cityLabel(c), cityId(c)]));
  const campusMap = new Map(campuses.map((c) => [campusLabel(c), campusId(c)]));
  const empMap = new Map(employees.map((e) => [empLabel(e), empId(e)]));

  useEffect(() => {
    if (isUserAdmin) {
      isHydratingRef.current = false;
    }
  }, [isUserAdmin]);

  useEffect(() => {
    if (isUpdate) return;               // 🔒 do not touch update
    if (!academicYear?.currentYear) return;

    const { academicYear: yearName, acdcYearId } =
      academicYear.currentYear;

    // ✅ set visible dropdown value
    setSeedInitialValues(prev => ({
      ...prev,
      academicYear: yearName,
    }));

    // ✅ set ID for APIs - Auto-select current year
    setSelectedAcademicYearId(acdcYearId);

    isHydratingRef.current = false;
  }, [academicYear, isUpdate]);



  const hydratedRef = useRef(false);

  const updateHydratedRef = useRef(false);

  useEffect(() => {
    if (!isUpdate || !initialValues) return;
    if (updateHydratedRef.current) return;

    isHydratingRef.current = true;

    if (initialValues?.academicYearId) {
      setSelectedAcademicYearId(initialValues.academicYearId);
    }

    // ✅ FIXED
    if (initialValues.campaignDistrictId)
      setSelectedDistrictId(initialValues.campaignDistrictId);

    if (initialValues.cityId)
      setSelectedCityId(initialValues.cityId);

    if (initialValues.campusId)
      setSelectedCampusId(initialValues.campusId);

    if (initialValues.issuedToEmpId)
      setIssuedToId(initialValues.issuedToEmpId);

    prevDistrictNameRef.current = initialValues.campaignDistrictName ?? null;
    prevCityNameRef.current = initialValues.cityName ?? null;
    prevCampusNameRef.current = initialValues.campusName ?? null;

    setSeedInitialValues(prev => ({
      ...prev,
      academicYear: initialValues.academicYear ?? "",
      campaignDistrictName: initialValues.campaignDistrictName ?? "",
      cityName: initialValues.cityName ?? "",
      campusName: initialValues.campusName ?? "",
      issuedTo: initialValues.issuedToName ?? "",
      applicationFee: initialValues.applicationFee ?? "",
      applicationSeries: initialValues.applicationSeries ?? "",
    }));

    updateHydratedRef.current = true;
    isHydratingRef.current = false;
  }, [isUpdate, initialValues]);


  useEffect(() => {
    if (hydratedRef.current) return;
    if (!isLocationSuccess || !locationData) return;
    if (isUserAdmin) return;

    const { districtId: dId, cityId: cId, districtName, cityName } = locationData;

    // ⛔ backend returned nulls
    if (!dId || !cId) {
      hydratedRef.current = true;
      isHydratingRef.current = false;
      return;
    }

    // 🔁 STEP 1: set city (trigger zones API)
    if (selectedDistrictId !== dId) {
      isHydratingRef.current = true;
      setSelectedDistrictId(dId);
      return;
    }

    // ⛔ wait until city exists
    const districtExists = districts.some(d => districtId(d) === dId);
    if (!districtExists) return;

    // ⛔ wait until zones load
    if (!cities.length) return;

    const cityExists = cities.some(c => cityId(c) === cId);
    if (!cityExists) return;

    // ✅ STEP 2: set zone + Formik names
    setSelectedCityId(cId);

    // setSeedInitialValues(prev => ({
    //   ...prev,
    //   cityName,
    //   zoneName,
    // }));

    prevDistrictNameRef.current = districtName;
    prevCityNameRef.current = cityName;

    hydratedRef.current = true;
    isHydratingRef.current = false;
  }, [
    isLocationSuccess,
    locationData,
    selectedCityId,
    districts,
    cities,        // ✅ IMPORTANT
    isUserAdmin,
  ]);


  // =====================================================================
  //                 RESET LOGIC
  // =====================================================================
  const handleValuesChange = React.useCallback((values, setFieldValue) => {
    if (!setFieldValue) return;

    // Prevent processing if we're already processing a change (prevents infinite loops)
    if (isProcessingChangeRef.current) return;

    // Create a key from current values to detect actual changes
    const valuesKey = `${values.campaignDistrictName}-${values.cityName}-${values.campusName}-${values.academicYear}-${values.issuedTo}-${values.applicationFee}`;

    // Skip if we've already processed these exact values
    if (lastProcessedValuesRef.current.key === valuesKey) {
      return;
    }

    // Update the last processed key
    lastProcessedValuesRef.current.key = valuesKey;

    /* ================= ACADEMIC YEAR ================= */
    if (yearMap.has(values.academicYear)) {
      const newYearId = yearMap.get(values.academicYear);
      if (newYearId !== selectedAcademicYearId) {
        isProcessingChangeRef.current = true;
        setSelectedAcademicYearId(newYearId);
        setSelectedFee(null);
        setTimeout(() => { isProcessingChangeRef.current = false; }, 0);
      }
    }

    /* ================= DISTRICT ================= */
    if (values.campaignDistrictName && districtMap.has(values.campaignDistrictName)) {
      const newDistrictId = districtMap.get(values.campaignDistrictName);

      if (newDistrictId !== selectedDistrictId && !isProcessingChangeRef.current) {
        console.log("🔥 DISTRICT CHANGE");
        isProcessingChangeRef.current = true;

        // 🔥 RESET CHILDREN
        setFieldValue("cityName", "", false);
        setFieldValue("campusName", "", false);
        setFieldValue("issuedTo", "", false);

        setSelectedCityId(null);
        setSelectedCampusId(null);
        setIssuedToId(null);
        setSelectedFee(null);

        // ✅ SET PARENT
        setSelectedDistrictId(newDistrictId);
        prevDistrictNameRef.current = values.campaignDistrictName;
        prevCityNameRef.current = null;
        prevCampusNameRef.current = null;

        setTimeout(() => { isProcessingChangeRef.current = false; }, 100);
        return;
      }
    }

    /* ================= CITY ================= */
    if (values.cityName && cityMap.has(values.cityName)) {
      const newCityId = cityMap.get(values.cityName);

      if (newCityId !== selectedCityId && !isProcessingChangeRef.current) {
        console.log("🔥 CITY CHANGE");
        isProcessingChangeRef.current = true;

        // 🔥 RESET CHILDREN
        setFieldValue("campusName", "", false);
        setFieldValue("issuedTo", "", false);

        setSelectedCampusId(null);
        setIssuedToId(null);
        setSelectedFee(null);

        // ✅ SET PARENT
        setSelectedCityId(newCityId);
        prevCityNameRef.current = values.cityName;
        prevCampusNameRef.current = null;

        setTimeout(() => { isProcessingChangeRef.current = false; }, 100);
        return;
      }
    }

    /* ================= CAMPUS ================= */
    if (
      values.campusName &&
      campuses.length > 0 &&
      campusMap.has(values.campusName)
    ) {
      const newCampusId = campusMap.get(values.campusName);

      if (newCampusId !== selectedCampusId && !isProcessingChangeRef.current) {
        console.log("🔥 CAMPUS CHANGE");
        isProcessingChangeRef.current = true;

        setFieldValue("issuedTo", "", false);
        setIssuedToId(null);
        setSelectedFee(null);

        setSelectedCampusId(newCampusId);
        prevCampusNameRef.current = values.campusName;

        setTimeout(() => { isProcessingChangeRef.current = false; }, 100);
        return;
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
  }, [
    yearMap, districtMap, cityMap, campusMap, empMap,
    selectedAcademicYearId, selectedDistrictId, selectedCityId, selectedCampusId,
    issuedToId, selectedFee, isUpdate, campuses
  ]);

  const seriesObj = useMemo(() => {
    if (!selectedSeries) return null;

    return (
      applicationSeries.find((s) => s.displaySeries === selectedSeries) || null
    );
  }, [selectedSeries, applicationSeries]);

  // =====================================================================
  //                  BACKEND VALUES
  // =====================================================================
  // =====================================================================
  //                  BACKEND VALUES
  // =====================================================================
  const backendValues = useMemo(() => {
    const obj = {};

    if (isUpdate && initialValues) {
      obj.academicYearId = selectedAcademicYearId ?? initialValues.academicYearId ?? null;
      obj.academicYear = seedInitialValues.academicYear || initialValues.academicYear || "";

      // 1. Resolve IDs with hierarchy checks
      const finalDistrictId = selectedDistrictId ?? initialValues.campaignDistrictId;
      const isDistrictChanged = finalDistrictId !== initialValues.campaignDistrictId;

      const finalCityId = isDistrictChanged ? selectedCityId : (selectedCityId ?? initialValues.cityId);
      const isCityChanged = finalCityId !== initialValues.cityId;

      const finalCampusId = isCityChanged ? selectedCampusId : (selectedCampusId ?? initialValues.campusId);
      const isCampusChanged = finalCampusId !== initialValues.campusId;

      obj.campaignDistrictId = finalDistrictId;
      obj.cityId = finalCityId;
      obj.campusId = finalCampusId;

      // 2. Resolve Names
      let computedDistrictName = prevDistrictNameRef.current || initialValues.campaignDistrictName;
      let computedCityName = prevCityNameRef.current || (isDistrictChanged ? "" : initialValues.cityName);
      let computedCampusName = prevCampusNameRef.current || (isCityChanged ? "" : initialValues.campusName);

      if (finalDistrictId && districts.length > 0) {
        const dist = districts.find(d => districtId(d) === finalDistrictId);
        if (dist) {
          computedDistrictName = districtLabel(dist);
          prevDistrictNameRef.current = computedDistrictName;
        }
      }

      if (finalCityId && cities.length > 0) {
        const city = cities.find(c => cityId(c) === finalCityId);
        if (city) {
          computedCityName = cityLabel(city);
          prevCityNameRef.current = computedCityName;
        }
      }

      if (finalCampusId && campuses.length > 0) {
        const campus = campuses.find(c => campusId(c) === finalCampusId);
        if (campus) {
          computedCampusName = campusLabel(campus);
          prevCampusNameRef.current = computedCampusName;
        }
      }

      obj.campaignDistrictName = computedDistrictName;
      obj.cityName = computedCityName;
      obj.campusName = computedCampusName;

      // 3. Resolve Issued To
      let finalIssuedToId = null;
      if (isCampusChanged) {
        finalIssuedToId = issuedToId;
      } else {
        finalIssuedToId = issuedToId ?? initialValues.issuedToEmpId ?? initialValues.issuedToId;
      }

      if (finalIssuedToId && finalIssuedToId !== 0) {
        obj.issuedToEmpId = finalIssuedToId;
        obj.issuedToId = finalIssuedToId;
      } else {
        if (!isCampusChanged) {
          obj.issuedToEmpId = initialValues.issuedToEmpId;
          obj.issuedToId = initialValues.issuedToEmpId; // fallback
        } else {
          obj.issuedToEmpId = null;
          obj.issuedToId = null;
        }
      }

      // 4. Series & Fee
      const finalApplicationFee = selectedFee ?? initialValues.applicationFee ?? seedInitialValues.applicationFee;
      if (finalApplicationFee != null) {
        obj.applicationFee = Number(finalApplicationFee);
      }

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

      if (mobileNo != null) obj.mobileNumber = String(mobileNo);

      return obj;
    }

    // CREATE MODE
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
      // ✅ FIX: Find the label for the selected ID (don't force seed value)
      const selectedYearObj = years.find(y => yearId(y) === Number(selectedAcademicYearId));
      obj.academicYear = selectedYearObj ? yearLabel(selectedYearObj) : seedInitialValues.academicYear;
    }
    if (selectedDistrictId) obj.campaignDistrictId = selectedDistrictId;
    if (selectedCityId) obj.cityId = selectedCityId;
    if (selectedCampusId) obj.campusId = selectedCampusId;

    if (locationData?.districtName) obj.campaignDistrictName = locationData.districtName;
    if (locationData?.cityName) obj.cityName = locationData.cityName;

    if (issuedToId) {
      obj.issuedToEmpId = issuedToId;
      obj.issuedToId = issuedToId;
    }

    return obj;
  }, [
    isUpdate,
    initialValues,
    seedInitialValues,
    prevDistrictNameRef, // ensure refs are stable but access current inside
    prevCityNameRef,
    prevCampusNameRef,
    mobileNo,
    seriesObj,
    selectedAcademicYearId,
    selectedDistrictId,
    selectedCityId,
    selectedCampusId,
    issuedToId,
    selectedFee,
    districts,
    cities,
    campuses,
    employees,
    locationData,
    years // ✅ Added years dependency
  ]);

  // =====================================================================
  //                  OPTIONS FOR FORM
  // =====================================================================
  const dynamicOptions = {
    academicYear: academicYearNames,
    campaignDistrictName: districtNames,
    cityName: cityNames,
    campusName: campusNames,
    issuedTo: issuedToNames,

    applicationFee: Array.isArray(applicationFee)
      ? applicationFee.map((f) => String(f))
      : [],

    applicationSeries: Array.isArray(applicationSeries)
      ? applicationSeries.map((s) => s.displaySeries)
      : [],
  };

  return (
    <DistributeForm
      formType="Campus"
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

export default CampusForm;