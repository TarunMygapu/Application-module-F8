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
    academicYear: initialValues?.academicYear || "2025-26",
  });


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
  const {hasRole : isUserAdmin} = useRole("ADMIN");

  const {data : locationData,isLoading,
  isFetching,
  isSuccess: isLocationSuccess,
  isError,} = useGetLocationOfEmployees(employeeId,campusCategory,isUserAdmin);
  console.log("ZONAL ACCOUNTANT LOCATIONS: ",locationData);

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

const hydratedRef = useRef(false);

const updateHydratedRef = useRef(false);

useEffect(() => {
  if (!isUpdate || !initialValues) return;
  if (updateHydratedRef.current) return;

  console.log("🟡 UPDATE HYDRATION START", initialValues);

  isHydratingRef.current = true;

  // ✅ STEP 1: set IDs FIRST (so APIs can load)
  if (initialValues.cityId) setSelectedCityId(initialValues.cityId);
  if (initialValues.zoneId) setSelectedZoneId(initialValues.zoneId);
  if (initialValues.campusId) setSelectedCampusId(initialValues.campusId);
  if (initialValues.issuedToEmpId) setIssuedToId(initialValues.issuedToEmpId);

  // ✅ store refs to prevent resets
  prevCityNameRef.current = initialValues.cityName ?? null;
  prevZoneNameRef.current = initialValues.zoneName ?? null;
  prevCampusNameRef.current = initialValues.campusName ?? null;

  // ✅ STEP 2: set visible values into Formik initial values
  setSeedInitialValues(prev => ({
    ...prev,
    cityName: initialValues.cityName ?? "",
    zoneName: initialValues.zoneName ?? "",
    campusName: initialValues.campusName ?? "",
    issuedTo: initialValues.issuedName ?? "",
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
  const academicYearNames = years.map(yearLabel);
  const cityNames = cities.map(cityLabel);
  const zoneNames = zones.map(zoneLabel);
  const campusNames = campuses.map(campusLabel);
  const issuedToNames = employees.map(empLabel);

  // ---------------- REVERSE MAPPINGS ----------------
  const yearMap = new Map(years.map((y) => [yearLabel(y), yearId(y)]));
  const cityMap = new Map(cities.map((c) => [cityLabel(c), cityId(c)]));
  const zoneMap = new Map(zones.map((z) => [zoneLabel(z), zoneId(z)]));
  const campusMap = new Map(campuses.map((c) => [campusLabel(c), campusId(c)]));
  const empMap = new Map(employees.map((e) => [empLabel(e), empId(e)]));

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
const handleValuesChange = (values, setFieldValue) => {
  if (!setFieldValue) return;

  /* ================= CITY ================= */
  if (values.cityName && cityMap.has(values.cityName)) {
    const newCityId = cityMap.get(values.cityName);

    if (newCityId !== selectedCityId) {
      console.log("🔥 CITY CHANGE DETECTED");

      // 🔥 RESET CHILDREN FIRST
      setFieldValue("zoneName", "");
      setFieldValue("campusName", "");
      setFieldValue("issuedTo", "");

      setSelectedZoneId(null);
      setSelectedCampusId(null);
      setIssuedToId(null);
      setSelectedFee(null);

      // ✅ THEN update parent
      setSelectedCityId(newCityId);

      prevCityNameRef.current = values.cityName;
      return;
    }
  }

  /* ================= ZONE ================= */
  if (values.zoneName && zoneMap.has(values.zoneName)) {
    const newZoneId = zoneMap.get(values.zoneName);

    if (newZoneId !== selectedZoneId) {
      console.log("🔥 ZONE CHANGE DETECTED");

      // 🔥 RESET CHILDREN FIRST
      setFieldValue("campusName", "");
      setFieldValue("issuedTo", "");

      setSelectedCampusId(null);
      setIssuedToId(null);
      setSelectedFee(null);

      // ✅ THEN update parent
      setSelectedZoneId(newZoneId);

      prevZoneNameRef.current = values.zoneName;
      return;
    }
  }

  /* ================= CAMPUS ================= */
  if (values.campusName && campusMap.has(values.campusName)) {
    const newCampusId = campusMap.get(values.campusName);

    if (newCampusId !== selectedCampusId) {
      console.log("🔥 CAMPUS CHANGE DETECTED");

      setFieldValue("issuedTo", "");
      setIssuedToId(null);
      setSelectedFee(null);

      setSelectedCampusId(newCampusId);
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



  // ---------------- SELECTED SERIES OBJECT ----------------
  const seriesObj = useMemo(() => {
    if (!selectedSeries) return null;

    return (
      applicationSeries.find((s) => s.displaySeries === selectedSeries) || null
    );
  }, [selectedSeries, applicationSeries]);

  // ---------------- BACKEND VALUES (MATCHES ZoneForm) ----------------
  const backendValues = useMemo(() => {

    if (isUpdate && initialValues) {
    return {
      academicYearId: initialValues.academicYearId,
      cityId: initialValues.cityId,
      zoneId: initialValues.zoneId,
      campusId: initialValues.campusId,
      issuedToEmpId: initialValues.issuedToEmpId,
      issuedTo: initialValues.issuedName,
      cityName: initialValues.cityName,
      zoneName: initialValues.zoneName,
      campusName: initialValues.campusName,
      applicationSeries: initialValues.applicationSeries,
      applicationCount: initialValues.applicationCount,
      applicationNoFrom: initialValues.applicationNoFrom,
      availableAppNoFrom: initialValues.availableAppNoFrom,
      availableAppNoTo: initialValues.availableAppNoTo,
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

    if (selectedAcademicYearId != null) obj.academicYearId = selectedAcademicYearId;
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

    return obj;
  }, [
    mobileNo,
    seriesObj,
    selectedAcademicYearId,
    selectedCityId,
    selectedZoneId,
    selectedCampusId,
    issuedToId,
    applicationFee,
    applicationSeries,
    locationData,
  ]);

  // ---------------- DYNAMIC OPTIONS ----------------
  const dynamicOptions = {
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
  };

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