import React, { useMemo, useState, useEffect, useRef, use } from "react";
import DistributeForm from "../DistributeForm";

import {
  useGetAllDistricts,
  useGetCitiesByDistrict,
  useGetProsByCampus,
  useGetAcademicYears,
  useGetMobileNo,
  useGetCampuesByCityWithCategory,
  useGetAllFeeAmounts,
  useGetApplicationSeriesForEmpId,
  useGetSchoolDgmCityDistrictId,
  useGetLocationOfEmployees,
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
  const {hasRole : isUserAdmin} = useRole("ADMIN");

  const { data: dgmEmpDetails } = useGetSchoolDgmCityDistrictId(employeeId, category);

  const {data : locationData,isLoading,
    isFetching,
    isSuccess: isLocationSuccess,
    isError,} = useGetLocationOfEmployees(employeeId,category,isUserAdmin);
    console.log("ZONAL/DGM ACCOUNTANT LOCATIONS: ",locationData);

  // ---------------- INITIAL FORM VALUES ----------------
   const [seedInitialValues, setSeedInitialValues] = useState({
      ...initialValues,
      academicYear: initialValues?.academicYear || "2025-26",
    });

  const didSeedRef = useRef(false);

  // ---------------- API CALLS ----------------
  const { data: yearsRaw = [] } = useGetAcademicYears();
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
  const years = asArray(yearsRaw);
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



  // =====================================================================
  //            DEFAULT ACADEMIC YEAR = "2025-26"
  // =====================================================================

   useEffect(() => {
      if (didSeedRef.current) return;
      if (!years.length) return;
  
      const defaultYear = years.find((y) => yearLabel(y) === "2025-26");
  
      if (defaultYear) {
        setSelectedAcademicYearId(yearId(defaultYear));
        didSeedRef.current = true;
      }
    }, [years]);
  

   const hydratedRef = useRef(false);
  
  const updateHydratedRef = useRef(false);
  
 useEffect(() => {
  if (!isUpdate || !initialValues) return;
  if (updateHydratedRef.current) return;

  isHydratingRef.current = true;

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
    campaignDistrictName: initialValues.campaignDistrictName ?? "",
    cityName: initialValues.cityName ?? "",
    campusName: initialValues.campusName ?? "",
    issuedTo: initialValues.issuedTo ?? "",
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
const handleValuesChange = (values, setFieldValue) => {
  if (!setFieldValue) return;

  /* ================= ACADEMIC YEAR ================= */
  if (yearMap.has(values.academicYear)) {
    const newYearId = yearMap.get(values.academicYear);
    if (newYearId !== selectedAcademicYearId) {
      setSelectedAcademicYearId(newYearId);
      setSelectedFee(null);
    }
  }

  /* ================= DISTRICT ================= */
  if (values.campaignDistrictName && districtMap.has(values.campaignDistrictName)) {
    const newDistrictId = districtMap.get(values.campaignDistrictName);

    if (newDistrictId !== selectedDistrictId) {
      console.log("🔥 DISTRICT CHANGE");

      // 🔥 RESET CHILDREN
      setFieldValue("cityName", "");
      setFieldValue("campusName", "");
      setFieldValue("issuedTo", "");

      setSelectedCityId(null);
      setSelectedCampusId(null);
      setIssuedToId(null);
      setSelectedFee(null);

      // ✅ SET PARENT
      setSelectedDistrictId(newDistrictId);
      prevDistrictNameRef.current = values.campaignDistrictName;
      return;
    }
  }

  /* ================= CITY ================= */
  if (values.cityName && cityMap.has(values.cityName)) {
    const newCityId = cityMap.get(values.cityName);

    if (newCityId !== selectedCityId) {
      console.log("🔥 CITY CHANGE");

      // 🔥 RESET CHILDREN
      setFieldValue("campusName", "");
      setFieldValue("issuedTo", "");

      setSelectedCampusId(null);
      setIssuedToId(null);
      setSelectedFee(null);

      // ✅ SET PARENT
      setSelectedCityId(newCityId);
      prevCityNameRef.current = values.cityName;
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

    if (newCampusId !== selectedCampusId) {
      console.log("🔥 CAMPUS CHANGE");

      setFieldValue("issuedTo", "");
      setIssuedToId(null);
      setSelectedFee(null);

      setSelectedCampusId(newCampusId);
      prevCampusNameRef.current = values.campusName;
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
};



  const seriesObj = useMemo(() => {
    if (!selectedSeries) return null;

    return (
      applicationSeries.find((s) => s.displaySeries === selectedSeries) || null
    );
  }, [selectedSeries, applicationSeries]);

  // =====================================================================
  //                  BACKEND VALUES
  // =====================================================================
  const backendValues = useMemo(() => {

     if (isUpdate && initialValues) {
    return {
      academicYearId: initialValues.academicYearId,
      cityId: initialValues.cityId,
      campusId: initialValues.campusId,
      campaignDistrictId: initialValues.campaignDistrictId,
      issuedToEmpId: initialValues.issuedToEmpId,
      issuedTo: initialValues.issuedToEmpId,
      cityName: initialValues.cityName,
      campusName: initialValues.campusName,
      campusName: initialValues.campusName,
      applicationSeries: initialValues.applicationSeries,
      applicationCount: initialValues.applicationCount,
      applicationNoFrom: initialValues.applicationNoFrom,
      availableAppNoFrom: initialValues.availableAppNoFrom,
      availableAppNoTo: initialValues.availableAppNoTo,
      issuedName: initialValues.issuedName,
    };
  }

    const obj = {};

    if (mobileNo != null) obj.mobileNumber = String(mobileNo);

    if (seriesObj) {
      obj.applicationSeries = seriesObj.displaySeries;
      obj.applicationCount = seriesObj.availableCount;
      obj.availableAppNoFrom = seriesObj.masterStartNo;
      obj.availableAppNoTo = seriesObj.masterEndNo;
      obj.applicationNoFrom = seriesObj.startNo;
    }

    if (selectedAcademicYearId) obj.academicYearId = selectedAcademicYearId;
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
    mobileNo,
    seriesObj,
    selectedAcademicYearId,
    selectedDistrictId,
    selectedCityId,
    selectedCampusId,
    issuedToId,
    applicationFee,
    applicationSeries,
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