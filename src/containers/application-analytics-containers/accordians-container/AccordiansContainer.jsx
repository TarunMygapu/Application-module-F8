// import React, { useState } from "react";
// import styles from "./AccordiansContainer.module.css";
// import Accordian from "../../../widgets/accordian-component/Accordian";

// const AccordiansContainer = () => {
//   const [userRole, setUserRole] = useState("CEO");

//   const accordianData = [
//     {
//       title: "Zone wise graph",
//       graphData: [
//         { label: "Issued", percent: 16 },
//         { label: "Sold", percent: -12 },
//       ],
//       graphBarData: [
//         { year: "2018-2019", issued: 60, sold: 30},
//         { year: "2019-2020", issued: 100, sold: 70 },
//         { year: "2021-2022", issued: 90, sold: 30 },
//         { year: "2023-2024", issued: 100, sold: 60 },
//       ],
//     },
//     {
//       title: "DGM wise graph",
//       graphData: [
//         { label: "Issued", percent: 16 },
//         { label: "Sold", percent: -12 },
//       ],
//       graphBarData: [
//         { year: "2018-2019", issued: 60, sold: 50 },
//         { year: "2019-2020", issued: 100, sold: 70 },
//         { year: "2021-2022", issued: 80, sold: 30 },
//         { year: "2023-2024", issued: 100, sold: 60 },
//       ],
//     },
//     {
//       title: "Campus wise graph",
//       graphData: [
//         { label: "Issued", percent: 16 },
//         { label: "Sold", percent: -12 },
//       ],
//       graphBarData: [
//         { year: "2018-2019", issued: 60, sold: 100 },
//         { year: "2019-2020", issued: 100, sold: 70 },
//         { year: "2021-2022", issued: 100, sold: 30 },
//         { year: "2023-2024", issued: 100, sold: 60 },
//       ],
//     },
//   ];

//   const [expandedIndex, setExpandedIndex] = useState(null);

//   const handleChange = (index) => (_event, isExpanded) => {
//     setExpandedIndex(isExpanded ? index : null);
//   };

//   const getVisibleAccordions = (data) => {
//     return data.filter((accordion) => {
//       if (userRole === "CEO") {
//         return (
//           accordion.title.includes("Zone") ||
//           accordion.title.includes("DGM") ||
//           accordion.title.includes("Campus")
//         );
//       } else if (userRole === "Zone") {
//         return (
//           accordion.title.includes("DGM") || accordion.title.includes("Campus")
//         );
//       } else if (userRole === "DGM") {
//         return accordion.title.includes("Campus");
//       } else if (userRole === "Campus") {
//         return false;
//       }
//       return false;
//     });
//   };

//   const visibleAccordions = getVisibleAccordions(accordianData);

//   return (
//     <div id="accordian_wrapper" className={styles.accordian_wrapper}>
//       {visibleAccordions.map((item, index) => (
//         <Accordian
//           key={index}
//           zoneTitle={item.title}
//           percentageItems={item.graphData}
//           graphBarData={item.graphBarData}
//           expanded={expandedIndex === index}
//           onChange={handleChange(index)}
//         />
//       ))}
//     </div>
//   );
// };

// export default AccordiansContainer;






// 1. Define the master data structure
// const accordianData = [
//     {
//         title: "Zone wise graph",
//         permissionKey: "DISTRIBUTE_ZONE", // 🔑 Map to the permission key
//         graphData: [
//             { label: "Issued", percent: 16 },
//             { label: "Sold", percent: -12 },
//         ],
//         graphBarData: [
//             { year: "2018-2019", issued: 60, sold: 30 },
//             { year: "2019-2020", issued: 100, sold: 70 },
//             { year: "2021-2022", issued: 90, sold: 30 },
//             { year: "2023-2024", issued: 100, sold: 60 },
//         ],
//     },
//     {
//         title: "DGM wise graph",
//         permissionKey: "DISTRIBUTE_DGM", // 🔑 Map to the permission key
//         graphData: [
//             { label: "Issued", percent: 16 },
//             { label: "Sold", percent: -12 },
//         ],
//         graphBarData: [
//             { year: "2018-2019", issued: 60, sold: 50 },
//             { year: "2019-2020", issued: 100, sold: 70 },
//             { year: "2021-2022", issued: 80, sold: 30 },
//             { year: "2023-2024", issued: 100, sold: 60 },
//         ],
//     },
//     {
//         title: "Campus wise graph",
//         permissionKey: "DISTRIBUTE_CAMPUS", // 🔑 Map to the permission key
//         graphData: [
//             { label: "Issued", percent: 16 },
//             { label: "Sold", percent: -12 },
//         ],
//         graphBarData: [
//             { year: "2018-2019", issued: 60, sold: 100 },
//             { year: "2019-2020", issued: 100, sold: 70 },
//             { year: "2021-2022", issued: 100, sold: 30 },
//             { year: "2023-2024", issued: 100, sold: 60 },
//         ],
//     },
// ];

// import React, { useState, useMemo, useEffect } from "react";
// import styles from "./AccordiansContainer.module.css";
// import Accordian from "../../../widgets/accordian-component/Accordian";
// import { usePermission } from "../../../hooks/usePermission ";
// import {
//   useGetGraphDataForAdmin,
//   useGetGraphDataForEmployee,
//   useGetAnalyticsForZone,
//   useGetAnalyticsForCampus,
//   useGetFlexibleGraph,
// } from "../../../queries/application-analytics/analytics";
// import { useSelectedEntity } from "../../../contexts/SelectedEntityContext";

// const AccordiansContainer = () => {
//   const { canView: canViewZone } = usePermission("DISTRIBUTE_ZONE");
//   const { canView: canViewDGM } = usePermission("DISTRIBUTE_DGM");
//   const { canView: canViewCampus } = usePermission("DISTRIBUTE_CAMPUS");

//   const { selectedEntity, selectedAmount } = useSelectedEntity();

//   console.log("=== ACCORDIANS CONTAINER DEBUG ===");
//   console.log("Selected Entity in Accordians:", selectedEntity);
//   console.log("Selected Amount:", selectedAmount);

//   const [userCategory, setUserCategory] = useState(null);
//   const [empId, setEmpId] = useState(null);
//   const [expandedIndex, setExpandedIndex] = useState(null);

//   // ✅ Load category & empId from localStorage
//   useEffect(() => {
//     const storedCategory = localStorage.getItem("category");
//     const storedEmpId = localStorage.getItem("empId");
//     if (storedCategory) setUserCategory(storedCategory.toUpperCase());
//     if (storedEmpId) setEmpId(storedEmpId);
//   }, []);

//   // ✅ Identify user type (Admin vs others)
//   const isZonalAccountant =
//     userCategory === "SCHOOL" || userCategory === "COLLEGE";
//   const isAdmin = !!userCategory && !isZonalAccountant;

//   // ✅ Conditionally fetch graph data based on role
//   const adminGraphQuery = useGetGraphDataForAdmin(empId, {
//     enabled: !!empId && !!userCategory && isAdmin,
//   });

//   const employeeGraphQuery = useGetGraphDataForEmployee(empId, {
//     enabled: !!empId && !!userCategory && !isAdmin,
//   });

//   // ✅ Fetch analytics for selected zone/dgm/campus using flexible-graph endpoint
//   // This endpoint supports zoneId, campusId, and amount parameters (all optional)
//   const zoneId = selectedEntity.type === "zone" ? selectedEntity.id : null;
//   const campusId = selectedEntity.type === "campus" ? selectedEntity.id : null;
//   const amount = selectedAmount ? Number(selectedAmount) : null;

//   console.log("🔍 ACCORDIANS: Selected Entity Details:", {
//     selectedEntity,
//     zoneId,
//     campusId,
//     amount,
//     zoneIdType: typeof zoneId,
//     campusIdType: typeof campusId
//   });

//   // Enable query when entity OR amount OR both are selected
//   const hasEntity = !!selectedEntity.id;
//   const hasAmount = !!selectedAmount;
//   const shouldFetch = hasEntity || hasAmount;

//   const flexibleGraphQuery = useGetFlexibleGraph(zoneId, campusId, amount, {
//     enabled: shouldFetch, // Enable when entity OR amount is selected
//   });

//   // Keep old queries for backward compatibility (if needed)
//   const selectedZoneQuery = useGetAnalyticsForZone(selectedEntity.id, {
//     enabled: false, // Disabled - using flexible-graph instead
//   });

//   const selectedCampusQuery = useGetAnalyticsForCampus(selectedEntity.id, {
//     enabled: false, // Disabled - using flexible-graph instead
//   });

//   console.log("=== QUERY STATUS ===");
//   console.log("Zone query enabled:", !!selectedEntity.id && selectedEntity.type === "zone");
//   console.log("Campus query enabled:", !!selectedEntity.id && selectedEntity.type === "campus");
//   console.log("Zone query status:", {
//     isLoading: selectedZoneQuery.isLoading,
//     isFetching: selectedZoneQuery.isFetching,
//     data: selectedZoneQuery.data,
//     error: selectedZoneQuery.error
//   });
//   console.log("Campus query status:", {
//     isLoading: selectedCampusQuery.isLoading,
//     isFetching: selectedCampusQuery.isFetching,
//     data: selectedCampusQuery.data,
//     error: selectedCampusQuery.error
//   });

//   // ✅ Choose which data to use
//   const { data: graphResponse, isLoading, error } = isAdmin
//     ? adminGraphQuery
//     : employeeGraphQuery;

//   console.log("=== GRAPH DEBUG ===");
//   console.log("User Category:", userCategory);
//   console.log("Is Admin:", isAdmin);
//   console.log("Employee ID:", empId);
//   console.log("Full Graph Response:", graphResponse);
//   console.log("Is Loading:", isLoading);
//   console.log("Error:", error);

//   // ✅ Extract graphData from response
//   const rawGraphData = useMemo(() => {
//     if (!graphResponse) {
//       console.log("📈 No graphResponse available");
//       return null;
//     }

//     console.log("📈 Full graphResponse:", graphResponse);

//     // Admin response from cards_graph: { metricCards: [...], graphData: {...} }
//     // Employee response: { metricsData: {...}, graphData: {...} }
//     const extractedData = graphResponse.graphData || null;
//     console.log("📈 Extracted graphData:", extractedData);
//     console.log("📈 graphData type:", typeof extractedData);
//     console.log("📈 graphData keys:", extractedData ? Object.keys(extractedData) : "null");

//     return extractedData;
//   }, [graphResponse]);

//   console.log("Raw Graph Data:", rawGraphData);

//   // ✅ Extract role from response for non-admin users
//   const userRole = useMemo(() => {
//     if (isAdmin) return "Admin";
//     return graphResponse?.role || "User";
//   }, [graphResponse, isAdmin]);

//   console.log("User Role from API:", userRole);

//   // ✅ Default graph data with zeros (for when API returns no data)
//   const defaultGraphData = {
//     graphBarData: [
//       { year: "2022-23", issued: 0, sold: 0, issuedCount: 0, soldCount: 0 },
//       { year: "2023-24", issued: 0, sold: 0, issuedCount: 0, soldCount: 0 },
//       { year: "2024-25", issued: 0, sold: 0, issuedCount: 0, soldCount: 0 },
//       { year: "2025-26", issued: 0, sold: 0, issuedCount: 0, soldCount: 0 },
//     ],
//   };

//   // ✅ Transform graph data to accordion format
//   const accordianData = useMemo(() => {
//     // If no graph data, use default with zeros
//     if (!rawGraphData) {
//       console.log("No graph data available - using default zeros");
//       const defaultBarData = defaultGraphData.graphBarData;
//       return [{
//         title: "Previous Year Graph",
//         graphData: [
//           { label: isAdmin ? "Issued" : "Total Applications", percent: 0 },
//           { label: "Sold", percent: 0 },
//         ],
//         graphBarData: defaultBarData,
//       }];
//     }

//     // Handle different API structures
//     // Admin API: graphData.graphBarData
//     // Employee API: graphData.yearlyData
//     const barData = rawGraphData.graphBarData || rawGraphData.yearlyData;

//     // If barData is empty, use default with zeros
//     if (!barData || barData.length === 0) {
//       console.log("No bar data available - using default zeros");
//       const defaultBarData = defaultGraphData.graphBarData;
//       return [{
//         title: "Previous Year Graph",
//         graphData: [
//           { label: isAdmin ? "Issued" : "Total Applications", percent: 0 },
//           { label: "Sold", percent: 0 },
//         ],
//         graphBarData: defaultBarData,
//       }];
//     }

//     console.log("Bar Data from API:", barData);

//     // Get the latest year's percentages for the badges
//     const latestYear = barData[barData.length - 1];

//     // Handle both API response formats
//     let issuedPercent, soldPercent;

//     if (isAdmin) {
//       // Admin API structure
//       issuedPercent = latestYear?.issuedPercent || 0;
//       soldPercent = latestYear?.soldPercent || 0;
//     } else {
//       // Employee API structure (yearlyData)
//       issuedPercent = latestYear?.totalAppPercent || 0;
//       soldPercent = latestYear?.soldPercent || 0;
//     }

//     // Transform bar data to accordion format
//     const transformedBarData = barData.map((item) => {
//       if (isAdmin) {
//         // Admin API structure
//         return {
//           year: item.year,
//           issued: item.issuedPercent || 0,      // Bar height percentage
//           sold: item.soldPercent || 0,          // Bar height percentage
//           issuedCount: item.issuedCount || 0,   // Tooltip count
//           soldCount: item.soldCount || 0,       // Tooltip count
//         };
//       } else {
//         // Employee API structure (yearlyData)
//         return {
//           year: item.year,
//           issued: item.totalAppPercent || 0,    // Bar height percentage
//           sold: item.soldPercent || 0,          // Bar height percentage
//           issuedCount: item.totalAppCount || 0, // Tooltip count
//           soldCount: item.soldCount || 0,       // Tooltip count
//         };
//       }
//     });

//     console.log("Transformed Bar Data:", transformedBarData);
//     console.log("Latest Total App %:", issuedPercent);
//     console.log("Latest Sold %:", soldPercent);

//     // Show only ONE accordion based on highest permission
//     const accordions = [];

//     // Determine accordion title based on role
//     let accordionTitle;
//     if (isAdmin) {
//       accordionTitle = "Overall Graph";
//     } else {
//       // For non-admin, use role from API response
//       accordionTitle = `${userRole}  Graph`;
//     }

//     console.log("Accordion Title:", accordionTitle);

//     // Determine which accordion to show based on permissions
//     if (canViewZone) {
//       accordions.push({
//         title: accordionTitle,
//         permissionKey: "DISTRIBUTE_ZONE",
//         graphData: [
//           { label: isAdmin ? "Issued" : "Total Applications", percent: issuedPercent },
//           { label: "Sold", percent: soldPercent },
//         ],
//         graphBarData: transformedBarData,
//       });
//     } else if (canViewDGM) {
//       accordions.push({
//         title: accordionTitle,
//         permissionKey: "DISTRIBUTE_DGM",
//         graphData: [
//           { label: isAdmin ? "Issued" : "Total Applications", percent: issuedPercent },
//           { label: "Sold", percent: soldPercent },
//         ],
//         graphBarData: transformedBarData,
//       });
//     } else if (canViewCampus) {
//       accordions.push({
//         title: accordionTitle,
//         permissionKey: "DISTRIBUTE_CAMPUS",
//         graphData: [
//           { label: isAdmin ? "Issued" : "Total Applications", percent: issuedPercent },
//           { label: "Sold", percent: soldPercent },
//         ],
//         graphBarData: transformedBarData,
//       });
//     }

//     return accordions;
//   }, [rawGraphData, canViewZone, canViewDGM, canViewCampus, isAdmin, userRole]);

//   // ✅ Create accordion for selected zone/dgm/campus using flexible-graph endpoint
//   // This accordion shows data based on entity selection, amount selection, or both
//   const selectedEntityAccordion = useMemo(() => {
//     console.log("=== BUILDING SELECTED ENTITY ACCORDION ===");
//     console.log("Selected Entity:", selectedEntity);
//     console.log("Selected Amount:", selectedAmount);

//     // Show accordion if entity OR amount is selected
//     const hasEntity = selectedEntity.id && selectedEntity.name;
//     const hasAmount = !!selectedAmount;

//     if (!hasEntity && !hasAmount) {
//       console.log("No entity or amount selected");
//       return null;
//     }

//     // Use flexible-graph data
//     const flexibleData = flexibleGraphQuery.data;

//     console.log("Selected entity type:", selectedEntity.type);
//     console.log("Flexible graph data:", flexibleData);

//     // Show loading state
//     if (flexibleGraphQuery.isLoading || flexibleGraphQuery.isFetching) {
//       return {
//         title: hasEntity ? `${selectedEntity.name} Graph` : `Amount ${selectedAmount} Graph`,
//         graphBarData: [],
//         graphData: []
//       };
//     }

//     // Show error state
//     if (flexibleGraphQuery.isError) {
//       console.error("Flexible Graph API Error:", flexibleGraphQuery.error);
//       return {
//         title: hasEntity ? `${selectedEntity.name} Graph` : `Amount ${selectedAmount} Graph`,
//         graphBarData: [],
//         graphData: []
//       };
//     }

//     if (!flexibleData || !Array.isArray(flexibleData) || flexibleData.length === 0) {
//       console.log("No flexible graph data available");
//       return null;
//     }

//     console.log("=== SELECTED ENTITY DEBUG ===");
//     console.log("Selected Entity:", selectedEntity);
//     console.log("Flexible Graph Data:", flexibleData);

//     // Flexible-graph returns array directly: [{ year, issuedPercent, soldPercent, issuedCount, soldCount }, ...]
//     const barData = flexibleData;

//     if (!barData || barData.length === 0) {
//       console.log("No bar data for selected entity");
//       return null;
//     }

//     // Get the latest year's percentages
//     const latestYear = barData[barData.length - 1];
//     const issuedPercent = latestYear?.issuedPercent || 0;
//     const soldPercent = latestYear?.soldPercent || 0;

//     // Transform bar data to match expected format
//     const transformedBarData = barData.map((item) => ({
//       year: item.year,
//       issued: item.issuedPercent || 0,
//       sold: item.soldPercent || 0,
//       issuedCount: item.issuedCount || 0,
//       soldCount: item.soldCount || 0,
//     }));

//     // Build title based on what's selected
//     let title = "";
//     if (hasEntity && hasAmount) {
//       title = `${selectedEntity.name} (Amount: ${selectedAmount}) Wise Graph`;
//     } else if (hasEntity) {
//       title = `${selectedEntity.name} Graph`;
//     } else if (hasAmount) {
//       title = `Amount ${selectedAmount} Graph`;
//     }

//     console.log("✅ Creating accordion with title:", title);

//     // Use the same label logic as default accordion
//     const issuedLabel = isAdmin ? "Issued" : "Total Applications";

//     return {
//       title: title,
//       graphData: [
//         { label: issuedLabel, percent: issuedPercent },
//         { label: "Sold", percent: soldPercent },
//       ],
//       graphBarData: transformedBarData,
//     };
//   }, [selectedEntity, selectedAmount, flexibleGraphQuery.data, flexibleGraphQuery.isLoading, flexibleGraphQuery.isFetching, flexibleGraphQuery.isError, isAdmin]);

//   const visibleAccordions = useMemo(() => {
//     // Start with default accordion(s)
//     const allAccordions = [...accordianData];

//     console.log("=== VISIBLE ACCORDIONS DEBUG ===");
//     console.log("Default accordions:", accordianData);
//     console.log("Selected entity accordion:", selectedEntityAccordion);

//     // Add selected entity accordion if available
//     if (selectedEntityAccordion) {
//       allAccordions.push(selectedEntityAccordion);
//       console.log("✅ Added selected entity accordion");
//     }

//     console.log("Final visible accordions:", allAccordions);
//     return allAccordions;
//   }, [accordianData, selectedEntityAccordion]);

//   const handleChange = (index) => (_event, isExpanded) => {
//     setExpandedIndex(isExpanded ? index : null);
//   };

//   // 🧠 Prevent rendering until category & empId are ready
//   if (!userCategory || !empId) {
//     console.log("Waiting for user data...", { userCategory, empId });
//     return <p>Loading user data...</p>;
//   }

//   // Check loading state for both default graph and flexible graph (if entity selected)
//   const isFlexibleGraphLoading = selectedEntity.id ? flexibleGraphQuery.isLoading : false;
//   const isFlexibleGraphError = selectedEntity.id ? flexibleGraphQuery.error : null;

//   if (isLoading || isFlexibleGraphLoading) {
//     console.log("Loading graph data...");
//     return <p>Loading graphs...</p>;
//   }

//   if (error || isFlexibleGraphError) {
//     console.error("Graph API Error:", error || isFlexibleGraphError);
//     return <p>Error loading graphs: {(error || isFlexibleGraphError)?.message}</p>;
//   }

//   // Only check graphResponse if no entity is selected (default graph)
//   if (!selectedEntity.id && !graphResponse) {
//     console.log("No graph response received");
//     return <p>No graph data received from server</p>;
//   }

//   return (
//     <div id="accordian_wrapper" className={styles.accordian_wrapper}>
//       {visibleAccordions.length === 0 && (
//         <p>No graph data available for your role</p>
//       )}
//       {visibleAccordions.map((item, index) => (
//         <Accordian
//           key={item.title}
//           zoneTitle={item.title}
//           percentageItems={item.graphData}
//           graphBarData={item.graphBarData}
//           expanded={expandedIndex === index}
//           onChange={handleChange(index)}
//         />
//       ))}
//     </div>
//   );
// };

// export default AccordiansContainer;


import React, { useState, useMemo, useEffect } from "react";
import styles from "./AccordiansContainer.module.css";
import Accordian from "../../../widgets/accordian-component/Accordian";
import { usePermission } from "../../../hooks/usePermission ";
import {
  useGetGraphDataForAdmin,
  useGetGraphDataForEmployee,
  useGetAnalyticsForZone,
  useGetAnalyticsForCampus,
  useGetAnalyticsForDgm,
  useGetFlexibleGraph,
} from "../../../queries/application-analytics/analytics";
import { useSelectedEntity } from "../../../contexts/SelectedEntityContext";
import { useSelector } from "react-redux";
import { useRole } from "../../../hooks/useRole";

const AccordiansContainer = () => {
  const { canView: canViewZone } = usePermission("DISTRIBUTE_ZONE");
  const { canView: canViewDGM } = usePermission("DISTRIBUTE_DGM");
  const { canView: canViewCampus } = usePermission("DISTRIBUTE_CAMPUS");

  const { selectedEntity, selectedAmount } = useSelectedEntity();

  // ✅ Use useRole hook to check if user is admin (same as AnalyticsHeader)
  const { hasRole: isUserAdmin } = useRole("ADMIN");

  // ✅ Get user roles from Redux (set during login)
  const roles = useSelector((state) => state.authorization?.roles || []);

  console.log("=== ACCORDIANS CONTAINER DEBUG ===");
  console.log("Selected Entity in Accordians:", selectedEntity);
  console.log("Selected Amount:", selectedAmount);

  const [userCategory, setUserCategory] = useState(null);
  const [empId, setEmpId] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [isConfirmedAdmin, setIsConfirmedAdmin] = useState(false);

  // ✅ Load category, empId, and designation from localStorage
  // Use only "campusCategory" key (no fallback)
  const [designation, setDesignation] = useState(null);

  useEffect(() => {
    const storedCategory = localStorage.getItem("campusCategory");
    const storedEmpId = localStorage.getItem("empId");
    const storedDesignation = localStorage.getItem("designation");
    if (storedCategory) setUserCategory(storedCategory.toUpperCase());
    if (storedEmpId) setEmpId(storedEmpId);
    if (storedDesignation) setDesignation(storedDesignation);
    console.log("🔍 Loaded from localStorage:", {
      campusCategory: storedCategory,
      storedEmpId,
      designation: storedDesignation,
      roles
    });
  }, [roles]);

  // ✅ Identify user type (Admin vs others) based on campusCategory
  // Note: This is just for initial categorization. Actual admin status is determined from API response.
  const isZonalAccountant =
    userCategory === "SCHOOL" || userCategory === "COLLEGE";
  const isAdminFromCategory = !!userCategory && !isZonalAccountant;

  // ✅ Conditionally fetch graph data based on role
  // Admin uses: cards_graph endpoint → returns { metricCards: [...], graphData: { graphBarData: [...] } }
  // Employee/Zonal Accountant/DGM/Cashier/Principal uses: /api/analytics/${empId} → returns { role, graphData: { yearlyData: [...] }, ... }
  // ✅ CRITICAL: cards_graph is ONLY for admin users - never for DGM, Zonal Accountant, Cashier, Principal
  // - Zonal accountants (COLLEGE/SCHOOL): Only enable employee query (admin query disabled)
  // - Others: Enable employee query first, then enable admin query ONLY if employee query confirms 'ADMIN' role
  // - This ensures cards_graph endpoint is NEVER called for non-admin users
  const employeeQueryEnabled = !!empId && !!userCategory;

  // ✅ Enable employee query first to get role information
  const employeeGraphQuery = useGetGraphDataForEmployee(empId, {
    enabled: employeeQueryEnabled,
  });

  // ✅ Check employee query response to confirm if user is admin
  const employeeRole = employeeGraphQuery.data?.role;
  const employeeDesignation = employeeGraphQuery.data?.designationName;
  const isEmployeeAdmin = employeeRole === 'ADMIN' || employeeRole === 'Admin' ||
    employeeDesignation === 'ADMIN EXECUTIVE' || employeeDesignation === 'ADMIN';

  // ✅ Check if user is admin based on login designation/role (from localStorage/Redux)
  // Priority: localStorage designation > Redux roles > API response > category-based
  // Use designation as primary source for routing decisions
  // Make designation check case-insensitive to handle variations like "Dgm", "DGM", "dgm", etc.
  const normalizedDesignation = designation ? designation.toUpperCase().trim() : '';
  const isAdminFromLogin = normalizedDesignation === 'ADMIN EXECUTIVE' || normalizedDesignation === 'ADMIN' ||
    roles.some(role =>
      role === 'ADMIN' || role === 'Admin' || role === 'ADMIN EXECUTIVE'
    );

  // ✅ Determine actual admin status: Use login role (preferred), then API response, then category-based
  // This ensures isAdmin reflects the actual user role from login, not just campusCategory
  const isAdmin = isAdminFromLogin || isEmployeeAdmin || (isAdminFromCategory && employeeRole === null);

  // ✅ Check if employee query explicitly says user is a zonal accountant
  const isEmployeeZonalAccountant = employeeRole === 'Zonal Accountant' ||
    employeeRole === 'ZONAL ACCOUNTANT' ||
    employeeDesignation === 'ZONAL ACCOUNTANT';

  // ✅ Check if employee query explicitly says user is NOT admin (DGM, Cashier, Principal, etc.)
  // Note: Zonal Accountant is handled separately above
  const isEmployeeNonAdmin = employeeRole === 'DGM' || employeeRole === 'Cashier' ||
    employeeRole === 'Principal' || employeeDesignation === 'DGM' ||
    employeeDesignation === 'Cashier' || employeeDesignation === 'Principal';

  // ✅ Update confirmed admin state when employee query confirms admin status
  useEffect(() => {
    if (employeeGraphQuery.data) {
      // If employee query explicitly says admin → confirm admin
      if (isEmployeeAdmin) {
        setIsConfirmedAdmin(true);
      } else if (isEmployeeZonalAccountant || isEmployeeNonAdmin) {
        // Employee query explicitly says user is NOT admin (Zonal Accountant, DGM, etc.)
        setIsConfirmedAdmin(false);
      } else if (employeeRole === null) {
        // Employee query returned null role (uncertain) - don't confirm yet
        // We'll check admin query response to determine if user is admin
        setIsConfirmedAdmin(false);
      }
    }
  }, [employeeGraphQuery.data, isEmployeeAdmin, isEmployeeZonalAccountant, isEmployeeNonAdmin, employeeRole]);

  // ✅ Enable admin query based on useRole("ADMIN") hook (same as AnalyticsHeader)
  // CRITICAL:
  // - Enable admin query ONLY if user has "ADMIN" role (from useRole hook)
  // - This ensures cards_graph endpoint is ONLY called for admin users
  // - All other users (DGM, Zonal Accountant, Cashier, Principal, etc.) use employee query
  const adminQueryEnabled = !!empId && !!userCategory && isUserAdmin;

  console.log("🔍 Query Enable Status (Using useRole('ADMIN') for Routing):", {
    empId,
    userCategory,
    isUserAdmin, // ✅ From useRole("ADMIN") hook (same as AnalyticsHeader)
    designation, // Raw designation from localStorage
    roles, // Redux roles
    adminQueryEnabled,
    employeeQueryEnabled,
    isConfirmedAdmin,
    employeeRole,
    employeeDesignation
  });

  // ✅ CRITICAL: Only initialize admin query hook if user is actually admin
  // This prevents the hook from even being created for non-admin users
  // React Query might still execute or cache data even with enabled: false
  const adminGraphQuery = useGetGraphDataForAdmin(empId, {
    enabled: adminQueryEnabled && isUserAdmin, // Double-check: enabled AND isUserAdmin
  });

  // ✅ Log if admin query is being initialized (should only happen for admin users)
  if (adminQueryEnabled && !isUserAdmin) {
    console.error("🚨 SECURITY ERROR: Admin query enabled for non-admin user!", {
      isUserAdmin,
      adminQueryEnabled,
      roles,
      designation,
      empId
    });
  }

  console.log("🔍 Admin Query Status:", {
    enabled: adminQueryEnabled,
    isUserAdmin, // ✅ Must be true for admin query to work
    isLoading: adminGraphQuery.isLoading,
    isFetching: adminGraphQuery.isFetching,
    hasData: !!adminGraphQuery.data,
    dataKeys: adminGraphQuery.data ? Object.keys(adminGraphQuery.data) : null,
    hasGraphBarData: !!(adminGraphQuery.data?.graphData?.graphBarData),
    // ✅ CRITICAL: If admin query has data but user is not admin, this is a security issue
    securityCheck: !isUserAdmin && !!adminGraphQuery.data ? "🚨 SECURITY ISSUE: Admin data exists for non-admin user!" : "OK"
  });

  // ✅ CRITICAL: If admin query somehow has data for non-admin user, log error
  if (!isUserAdmin && adminGraphQuery.data) {
    console.error("🚨🚨🚨 CRITICAL SECURITY ERROR: Admin query has data for non-admin user!", {
      isUserAdmin,
      roles,
      designation,
      adminQueryData: adminGraphQuery.data,
      adminQueryEnabled
    });
  }

  console.log("🔍 Employee Query Status:", {
    enabled: employeeQueryEnabled,
    isLoading: employeeGraphQuery.isLoading,
    isFetching: employeeGraphQuery.isFetching,
    hasData: !!employeeGraphQuery.data,
    dataKeys: employeeGraphQuery.data ? Object.keys(employeeGraphQuery.data) : null
  });

  // ✅ Fetch analytics for selected zone/dgm/campus using flexible-graph endpoint
  // This endpoint supports zoneId, campusIds, campusId, and amount parameters (all optional)
  const zoneId = selectedEntity.type === "zone" ? selectedEntity.id : null;
  const campusIds = selectedEntity.type === "dgm" ? (selectedEntity.cmpsId || null) : null;
  const campusId = selectedEntity.type === "campus" ? selectedEntity.id : null;
  const amount = selectedAmount ? Number(selectedAmount) : null;

  console.log("🔍 ACCORDIANS: Selected Entity Details:", {
    selectedEntity,
    zoneId,
    campusIds,
    campusId,
    amount,
    entityType: selectedEntity.type,
    cmpsId: selectedEntity.cmpsId
  });

  // Enable query when entity OR amount OR both are selected
  const hasEntity = !!selectedEntity.id;
  const hasAmount = !!selectedAmount;
  const shouldFetch = hasEntity || hasAmount;

  const flexibleGraphQuery = useGetFlexibleGraph(zoneId, campusIds, campusId, amount, {
    enabled: shouldFetch, // Enable when entity OR amount is selected
  });

  // ✅ Analytics queries for selected entities (Zone, DGM, Campus)
  // These fetch metrics/data for the selected entity
  const selectedZoneQuery = useGetAnalyticsForZone(selectedEntity.id, {
    enabled: !!selectedEntity.id && selectedEntity.type === "zone", // Enable when zone is selected
  });

  const selectedDgmQuery = useGetAnalyticsForDgm(selectedEntity.id, {
    enabled: !!selectedEntity.id && selectedEntity.type === "dgm", // Enable when DGM is selected (id is employeeId)
  });

  const selectedCampusQuery = useGetAnalyticsForCampus(selectedEntity.id, {
    enabled: !!selectedEntity.id && selectedEntity.type === "campus", // Enable when campus is selected
  });

  console.log("=== QUERY STATUS ===");
  console.log("Zone query enabled:", !!selectedEntity.id && selectedEntity.type === "zone");
  console.log("DGM query enabled:", !!selectedEntity.id && selectedEntity.type === "dgm");
  console.log("Campus query enabled:", !!selectedEntity.id && selectedEntity.type === "campus");
  console.log("Zone query status:", {
    isLoading: selectedZoneQuery.isLoading,
    isFetching: selectedZoneQuery.isFetching,
    data: selectedZoneQuery.data,
    error: selectedZoneQuery.error
  });
  console.log("DGM query status:", {
    isLoading: selectedDgmQuery.isLoading,
    isFetching: selectedDgmQuery.isFetching,
    data: selectedDgmQuery.data,
    error: selectedDgmQuery.error
  });
  console.log("Campus query status:", {
    isLoading: selectedCampusQuery.isLoading,
    isFetching: selectedCampusQuery.isFetching,
    data: selectedCampusQuery.data,
    error: selectedCampusQuery.error
  });

  // ✅ Choose which data to use - Use API response role to determine data source
  // CRITICAL: Only check admin query data if user is actually admin
  // This prevents accessing admin data for non-admin users (DGM, Zonal Accountant, etc.)
  const adminHasGraphBarData = isUserAdmin && !!(adminGraphQuery.data?.graphData?.graphBarData);
  const employeeHasYearlyData = !!(employeeGraphQuery.data?.graphData?.yearlyData?.length > 0);

  // ✅ Check if admin query completed without graphBarData (helps distinguish admin from zonal accountant when both have null role)
  const adminQueryCompletedWithoutData = adminGraphQuery.data && !adminHasGraphBarData && employeeRole === null;

  // ✅ Simplified decision logic using useRole("ADMIN") hook (same as AnalyticsHeader)
  // CRITICAL: cards_graph endpoint is ONLY for admin users
  // - If isUserAdmin is true → use cards_graph (admin query)
  // - If isUserAdmin is false → use employeeId URL (employee query)
  // This ensures strict separation: cards_graph ONLY for admins, employee endpoint for everyone else
  // NEVER use admin data for DGM, Zonal Accountant, Cashier, Principal, etc.
  let shouldUseAdminData = false;

  // ✅ Use useRole("ADMIN") to determine data source (same logic as AnalyticsHeader)
  // CRITICAL: Only use admin data if user explicitly has "ADMIN" role in Redux
  if (isUserAdmin) {
    // User has "ADMIN" role in Redux → use cards_graph endpoint
    shouldUseAdminData = adminQueryEnabled && adminHasGraphBarData;
    console.log("✅ Using admin data (cards_graph) - User has ADMIN role from useRole:", {
      isUserAdmin,
      adminQueryEnabled,
      adminHasGraphBarData,
      roles
    });
  } else {
    // User does NOT have "ADMIN" role → ALWAYS use employeeId URL
    // This includes: DGM, Zonal Accountant, Cashier, Principal, and any other non-admin roles
    shouldUseAdminData = false;
    console.log("🚫 BLOCKING admin data - User does NOT have ADMIN role from useRole:", {
      isUserAdmin,
      roles,
      designation,
      adminQueryEnabled: false, // Explicitly show admin query is disabled
      reason: `User role is '${roles[0] || 'unknown'}' (not ADMIN), designation is '${designation || 'unknown'}'`
    });
  }

  // ✅ CRITICAL: Final safety check - NEVER use admin data if user is not admin
  // This is a double-check to prevent any edge cases where admin data might be used incorrectly
  if (!isUserAdmin && shouldUseAdminData) {
    console.error("🚨 SECURITY CHECK: Attempted to use admin data for non-admin user! Blocking...", {
      isUserAdmin,
      roles,
      designation,
      shouldUseAdminData
    });
    shouldUseAdminData = false; // Force to false for non-admin users
  }

  // ✅ CRITICAL: Final safety check - NEVER use admin query data if user is not admin
  // This prevents using cached admin data or accidentally accessing admin query
  const adminQueryData = isUserAdmin ? adminGraphQuery.data : null;
  const employeeQueryData = employeeGraphQuery.data;

  const { data: graphResponse, isLoading, error } = shouldUseAdminData && isUserAdmin && adminQueryData
    ? { data: adminQueryData, isLoading: adminGraphQuery.isLoading, error: adminGraphQuery.error }
    : { data: employeeQueryData, isLoading: employeeGraphQuery.isLoading, error: employeeGraphQuery.error };

  // ✅ Log which data source is actually being used
  console.log("🔒 DATA SOURCE LOCK:", {
    isUserAdmin,
    shouldUseAdminData,
    usingAdminData: shouldUseAdminData && isUserAdmin && !!adminQueryData,
    usingEmployeeData: !shouldUseAdminData || !isUserAdmin || !adminQueryData,
    adminQueryHasData: !!adminQueryData,
    employeeQueryHasData: !!employeeQueryData,
    adminQueryEnabled,
    roles,
    designation
  });

  // ✅ Log which query is being used and its data structure
  console.log("🎯 SELECTED QUERY (Role-Based):", {
    usingAdminQuery: shouldUseAdminData,
    usingEmployeeQuery: !shouldUseAdminData,
    querySource: shouldUseAdminData ? "ADMIN (cards_graph)" : "EMPLOYEE (/api/analytics/${empId})",
    hasData: !!graphResponse,
    decisionFactors: {
      isEmployeeZonalAccountant,
      isEmployeeAdmin,
      employeeRole,
      adminQueryEnabled,
      employeeQueryEnabled,
      adminHasGraphBarData,
      employeeHasYearlyData,
      campusCategoryBased: { isAdmin, isZonalAccountant }
    },
    graphResponseStructure: graphResponse ? {
      topLevelKeys: Object.keys(graphResponse),
      hasGraphData: !!graphResponse.graphData,
      graphDataKeys: graphResponse.graphData ? Object.keys(graphResponse.graphData) : null,
      hasGraphBarData: !!(graphResponse.graphData?.graphBarData),
      hasYearlyData: !!(graphResponse.graphData?.yearlyData),
      graphBarDataLength: graphResponse.graphData?.graphBarData?.length || 0,
      yearlyDataLength: graphResponse.graphData?.yearlyData?.length || 0,
      role: graphResponse.role || null
    } : null
  });

  console.log("🔍 Data Selection (Role-Based from API):", {
    campusCategoryBased: { isAdmin, isZonalAccountant, userCategory },
    apiRoleBased: { employeeRole, isEmployeeZonalAccountant, isEmployeeAdmin },
    queryEnablement: { adminQueryEnabled, employeeQueryEnabled },
    dataAvailability: {
      adminHasGraphBarData,
      employeeHasYearlyData,
      adminGraphBarDataLength: adminGraphQuery.data?.graphData?.graphBarData?.length || 0,
      employeeYearlyDataLength: employeeGraphQuery.data?.graphData?.yearlyData?.length || 0
    },
    decision: {
      shouldUseAdminData,
      usingAdminData: shouldUseAdminData,
      usingEmployeeData: !shouldUseAdminData,
      reason: isEmployeeZonalAccountant
        ? "Employee API returned 'Zonal Accountant' role"
        : adminQueryEnabled && adminHasGraphBarData
          ? "Admin query enabled and has graphBarData"
          : employeeQueryEnabled && employeeHasYearlyData
            ? "Employee query enabled and has yearlyData"
            : "Fallback to available data"
    },
    adminDataSample: adminGraphQuery.data?.graphData?.graphBarData?.[0] || null,
    employeeDataSample: employeeGraphQuery.data?.graphData?.yearlyData?.[0] || null
  });

  console.log("=== GRAPH DEBUG ===");
  console.log("User Category:", userCategory);
  console.log("Is Admin:", isAdmin);
  console.log("Employee ID:", empId);
  console.log("Full Graph Response:", graphResponse);
  console.log("Is Loading:", isLoading);
  console.log("Error:", error);

  // ✅ Extract graphData from response - Robust extraction handling multiple response structures
  const rawGraphData = useMemo(() => {
    if (!graphResponse) {
      console.log("📈 No graphResponse available");
      return null;
    }

    console.log("📈 Full graphResponse in extraction:", graphResponse);
    console.log("📈 graphResponse type:", typeof graphResponse);
    console.log("📈 graphResponse keys:", Object.keys(graphResponse || {}));
    console.log("📈 Is Admin:", isAdmin, "| User Category:", userCategory);

    // 1. If response has a 'graphData' wrapper (Admin/cards_graph structure)
    // Structure: { metricCards: [...], graphData: { graphBarData: [...] } }
    if (graphResponse.graphData && typeof graphResponse.graphData === 'object') {
      console.log("📈 ✅ Found graphData wrapper");
      console.log("📈 ✅ graphData keys:", Object.keys(graphResponse.graphData));
      console.log("📈 ✅ graphData.graphBarData exists?", !!graphResponse.graphData.graphBarData);
      console.log("📈 ✅ graphData.graphBarData is array?", Array.isArray(graphResponse.graphData.graphBarData));
      if (Array.isArray(graphResponse.graphData.graphBarData)) {
        console.log("📈 ✅ graphData.graphBarData length:", graphResponse.graphData.graphBarData.length);
      }
      return graphResponse.graphData;
    }

    // 2. If the response itself contains the expected bar data fields directly
    // Structure: { graphBarData: [...] } or { yearlyData: [...] }
    if (graphResponse.graphBarData || graphResponse.yearlyData || graphResponse.barData) {
      console.log("📈 Using graphResponse directly as graph data source");
      return graphResponse;
    }

    // 3. If response is an array directly (flexible-graph endpoint sometimes returns array)
    if (Array.isArray(graphResponse)) {
      console.log("📈 Response is array directly");
      return { graphBarData: graphResponse };
    }

    // 4. Fallback: return the response as-is and let barData extraction handle it
    console.log("📈 No standard graph data structure found, using response as-is");
    return graphResponse;
  }, [graphResponse]);

  console.log("Raw Graph Data:", rawGraphData);

  // ✅ Extract role from response for non-admin users
  const userRole = useMemo(() => {
    if (isAdmin) return "Admin";
    return graphResponse?.role || "User";
  }, [graphResponse, isAdmin]);

  console.log("User Role from API:", userRole);

  // ✅ Default graph data with zeros (for when API returns no data) - in descending order
  const defaultGraphData = {
    graphBarData: [
      { year: "2025-26", issued: 0, sold: 0, issuedCount: 0, soldCount: 0 },
      { year: "2024-25", issued: 0, sold: 0, issuedCount: 0, soldCount: 0 },
      { year: "2023-24", issued: 0, sold: 0, issuedCount: 0, soldCount: 0 },
      { year: "2022-23", issued: 0, sold: 0, issuedCount: 0, soldCount: 0 },
    ],
  };

  // ✅ Transform graph data to accordion format
  const accordianData = useMemo(() => {
    // If no graph data, use default with zeros (already in descending order)
    if (!rawGraphData) {
      console.log("No graph data available - using default zeros (descending order)");
      const defaultBarData = [...defaultGraphData.graphBarData]; // Copy to avoid mutation
      return [{
        title: "Previous Year Graph",
        graphData: [
          { label: isAdmin ? "Issued" : "Total Applications", percent: 0, type: "issued" },
          { label: "Sold", percent: 0, type: "sold" },
        ],
        graphBarData: defaultBarData, // Already in descending order
      }];
    }

    // Handle different API structures - Robust extraction
    // Admin API: graphData.graphBarData
    // Employee API: graphData.yearlyData
    // Flexible Graph: Array directly
    // ✅ CRITICAL: If using employee query, ONLY look for yearlyData (not graphBarData)
    // This ensures DGM/Zonal Accountant users never see admin graph data structure
    let barData = null;

    if (rawGraphData) {
      // ✅ If using employee query (not admin), ONLY look for yearlyData - NEVER use graphBarData
      // CRITICAL: graphBarData is ONLY for admin cards_graph endpoint
      // If employee query returns graphBarData, it's likely wrong data or cached admin data
      if (!shouldUseAdminData) {
        // Employee query - ONLY look for yearlyData (employee endpoint structure)
        if (Array.isArray(rawGraphData.yearlyData)) {
          barData = rawGraphData.yearlyData;
          console.log("🔍 ✅ Found barData in rawGraphData.yearlyData (Employee endpoint)");
        } else if (Array.isArray(rawGraphData.graphBarData)) {
          // ⚠️ BLOCKED: Employee query should NEVER return graphBarData
          // This indicates wrong data source or cached admin data
          console.error("🚨 SECURITY: Employee query returned graphBarData! This should not happen. Blocking...", {
            isUserAdmin,
            roles,
            designation,
            rawGraphDataKeys: Object.keys(rawGraphData)
          });
          barData = null; // Explicitly block graphBarData for employee queries
        }
      } else {
        // Admin query - look for graphBarData (admin cards_graph endpoint structure)
        if (Array.isArray(rawGraphData.graphBarData)) {
          barData = rawGraphData.graphBarData;
          console.log("🔍 ✅ Found barData in rawGraphData.graphBarData (Admin cards_graph)");
          console.log("🔍 ✅ barData length:", barData.length);
          console.log("🔍 ✅ barData first item:", barData[0]);
        }
        // Priority 2: yearlyData (Employee endpoint structure) - fallback for admin query
        else if (Array.isArray(rawGraphData.yearlyData)) {
          barData = rawGraphData.yearlyData;
          console.log("🔍 ✅ Found barData in rawGraphData.yearlyData (Admin query fallback)");
        }
        // Priority 3: barData (alternative naming)
        else if (Array.isArray(rawGraphData.barData)) {
          barData = rawGraphData.barData;
          console.log("🔍 ✅ Found barData in rawGraphData.barData");
        }
        // Priority 4: rawGraphData itself is an array
        else if (Array.isArray(rawGraphData)) {
          barData = rawGraphData;
          console.log("🔍 ✅ rawGraphData is array directly");
        } else {
          console.warn("⚠️ rawGraphData exists but no array found. Keys:", Object.keys(rawGraphData));
        }
      }
    }

    // Fallback: Check graphResponse directly if rawGraphData didn't yield results
    // CRITICAL: For employee query, prioritize yearlyData; for admin query, prioritize graphBarData
    if (!barData && graphResponse) {
      if (Array.isArray(graphResponse)) {
        barData = graphResponse;
        console.log("🔍 Fallback: graphResponse is array directly");
      } else if (!shouldUseAdminData && graphResponse.graphData && Array.isArray(graphResponse.graphData.yearlyData)) {
        // Employee query fallback: yearlyData first
        barData = graphResponse.graphData.yearlyData;
        console.log("🔍 Fallback: Found barData in graphResponse.graphData.yearlyData (Employee endpoint)");
      } else if (shouldUseAdminData && graphResponse.graphData && Array.isArray(graphResponse.graphData.graphBarData)) {
        // Admin query fallback: graphBarData first
        barData = graphResponse.graphData.graphBarData;
        console.log("🔍 Fallback: Found barData in graphResponse.graphData.graphBarData (Admin cards_graph)");
      } else if (Array.isArray(graphResponse.graphBarData)) {
        // Fallback: graphBarData (only if using admin query)
        if (shouldUseAdminData) {
          barData = graphResponse.graphBarData;
          console.log("🔍 Fallback: Found barData in graphResponse.graphBarData (Admin)");
        } else {
          // ⚠️ BLOCKED: Employee query should NEVER have graphBarData
          console.error("🚨 SECURITY: Employee query fallback found graphBarData at root! Blocking...", {
            isUserAdmin,
            roles,
            designation
          });
          barData = null; // Explicitly block
        }
      } else if (graphResponse.graphData && Array.isArray(graphResponse.graphData.yearlyData)) {
        // Employee API structure: { graphData: { yearlyData: [...] } }
        barData = graphResponse.graphData.yearlyData;
        console.log("🔍 Fallback: Found barData in graphResponse.graphData.yearlyData");
      } else if (graphResponse.graphData && Array.isArray(graphResponse.graphData.graphBarData)) {
        // Admin API structure: { graphData: { graphBarData: [...] } }
        if (shouldUseAdminData) {
          barData = graphResponse.graphData.graphBarData;
          console.log("🔍 Fallback: Found barData in graphResponse.graphData.graphBarData (Admin)");
        } else {
          // ⚠️ BLOCKED: Employee query should NEVER have graphBarData
          console.error("🚨 SECURITY: Employee query fallback found graphBarData in graphData! Blocking...", {
            isUserAdmin,
            roles,
            designation
          });
          barData = null; // Explicitly block
        }
      }
    }

    console.log("🔍 Robust barData extraction result:", {
      source: barData ? "found" : "not found",
      isBarDataArray: Array.isArray(barData),
      length: Array.isArray(barData) ? barData.length : 0,
      rawGraphDataKeys: rawGraphData ? Object.keys(rawGraphData) : [],
      graphResponseKeys: graphResponse ? Object.keys(graphResponse) : []
    });

    // If barData is empty, use default with zeros
    if (!barData || !Array.isArray(barData) || barData.length === 0) {
      console.log("⚠️ No bar data available - using default zeros");
      const defaultBarData = defaultGraphData.graphBarData;
      return [{
        title: "Previous Year Graph",
        graphData: [
          { label: isAdmin ? "Issued" : "Total Applications", percent: 0, type: "issued" },
          { label: "Sold", percent: 0, type: "sold" },
        ],
        graphBarData: defaultBarData,
      }];
    }

    console.log("✅ Bar Data from API:", barData);
    console.log("✅ Bar Data length:", barData.length);

    // Transform bar data to accordion format FIRST
    const transformedBarData = barData.map((item, index) => {
      // Helper to coerce percent-like values (e.g., "100%" or 100) to numeric
      const toNumber = (v) => {
        if (v === null || v === undefined) return 0;
        if (typeof v === 'number') return v;
        // Strip percent sign and non-numeric characters, then parse
        const cleaned = String(v).replace(/[^0-9.-]+/g, '');
        const n = parseFloat(cleaned);
        return Number.isFinite(n) ? n : 0;
      };

      // ✅ Universal field mapping - Check all possible field names regardless of user type
      // This ensures compatibility with all API response structures
      // Employee endpoint uses: totalAppPercent, soldPercent, totalAppCount, soldCount
      // Admin endpoint uses: issuedPercent, soldPercent, issuedCount, soldCount
      const issuedPercent = toNumber(
        item.issuedPercent ??      // cards_graph endpoint (admin) - PRIMARY
        item.totalAppPercent ??   // Employee endpoint (/api/analytics/${empId}) - PRIMARY
        item.issued ??             // Alternative naming
        item.issuedPercentage ??  // Alternative naming
        0
      );
      const soldPercent = toNumber(
        item.soldPercent ??        // Both endpoints - PRIMARY
        item.sold ??               // Alternative naming
        item.soldPercentage ??     // Alternative naming
        0
      );
      const issuedCount = toNumber(
        item.issuedCount ??        // cards_graph endpoint (admin) - PRIMARY
        item.totalAppCount ??      // Employee endpoint (/api/analytics/${empId}) - PRIMARY
        item.issued ??             // Alternative naming
        item.totalApplications ??  // Alternative naming
        0
      );
      const soldCount = toNumber(
        item.soldCount ??          // cards_graph endpoint (admin & employee) - PRIMARY
        item.sold ??               // Alternative naming
        0
      );

      // Log transformation for debugging (only for first item to reduce console noise)
      if (index === 0) {
        console.log(`🔧 Transforming item for ${item.year}:`, {
          original: item,
          issuedPercent,
          soldPercent,
          issuedCount,
          soldCount
        });
      }

      return {
        year: item.year,
        issued: issuedPercent,      // Bar height percentage (numeric)
        sold: soldPercent,          // Bar height percentage (numeric)
        issuedCount: issuedCount,   // Tooltip count (numeric)
        soldCount: soldCount,       // Tooltip count (numeric)
      };
    });

    // ✅ Sort data in descending order (newest first: 2025-26 → 2022-23)
    const yearsBeforeSort = transformedBarData.map(item => item.year);
    console.log("🔄 BEFORE SORTING - Years:", yearsBeforeSort);
    console.log("🔄 BEFORE SORTING - Full Data:", transformedBarData);

    // Create a deep copy to ensure we're sorting a fresh array
    const sortedBarData = [...transformedBarData].sort((a, b) => {
      // Extract the first year from strings like "2025-26" or "2024-25"
      const getStartYear = (yearStr) => {
        const match = String(yearStr).match(/^(\d{4})/);
        return match ? parseInt(match[1], 10) : 0;
      };
      const yearA = getStartYear(a.year);
      const yearB = getStartYear(b.year);
      return yearB - yearA; // Descending order (newest first)
    });

    const yearsAfterSort = sortedBarData.map(item => item.year);
    console.log("🔄 AFTER SORTING - Years:", yearsAfterSort);
    console.log("🔄 AFTER SORTING - Expected: [2025-26, 2024-25, 2023-24, 2022-23]");
    console.log("🔄 AFTER SORTING - Match:", JSON.stringify(yearsAfterSort) === JSON.stringify(["2025-26", "2024-25", "2023-24", "2022-23"]));
    console.log("🔄 Sorted Bar Data (Full):", sortedBarData);

    // Get the latest year's percentages from the SORTED bar data (first item is newest)
    const currentYearData = sortedBarData[0] || null;
    const issuedPercent = currentYearData?.issued || 0;
    const soldPercent = currentYearData?.sold || 0;

    console.log("✅ Current Year Data (Latest - first item):", currentYearData);
    console.log("✅ Current Year:", currentYearData?.year);
    console.log("✅ Current Issued %:", issuedPercent);
    console.log("✅ Current Sold %:", soldPercent);

    // ✅ Final validation before returning
    if (!sortedBarData || sortedBarData.length === 0) {
      console.error("❌ ERROR: sortedBarData is empty after transformation!");
      const defaultBarData = defaultGraphData.graphBarData;
      return [{
        title: "Previous Year Graph",
        graphData: [
          { label: isAdmin ? "Issued" : "Total Applications", percent: 0, type: "issued" },
          { label: "Sold", percent: 0, type: "sold" },
        ],
        graphBarData: defaultBarData,
      }];
    }

    // Show only ONE accordion based on highest permission
    const accordions = [];

    // Determine accordion title based on role
    // ✅ Use "Previous Year Graph" for all users as requested
    const accordionTitle = "Previous Year Graph";

    console.log("Accordion Title:", accordionTitle);

    // Determine which accordion to show based on permissions
    if (canViewZone) {
      accordions.push({
        title: accordionTitle,
        permissionKey: "DISTRIBUTE_ZONE",
        graphData: [
          { label: isAdmin ? "Issued" : "Total Applications", percent: issuedPercent, type: "issued" },
          { label: "Sold", percent: soldPercent, type: "sold" },
        ],
        graphBarData: sortedBarData, // Use sorted data (descending order - newest first)
      });
    } else if (canViewDGM) {
      accordions.push({
        title: accordionTitle,
        permissionKey: "DISTRIBUTE_DGM",
        graphData: [
          { label: isAdmin ? "Issued" : "Total Applications", percent: issuedPercent, type: "issued" },
          { label: "Sold", percent: soldPercent, type: "sold" },
        ],
        graphBarData: sortedBarData, // Use sorted data (descending order - newest first)
      });
    } else if (canViewCampus) {
      accordions.push({
        title: accordionTitle,
        permissionKey: "DISTRIBUTE_CAMPUS",
        graphData: [
          { label: isAdmin ? "Issued" : "Total Applications", percent: issuedPercent, type: "issued" },
          { label: "Sold", percent: soldPercent, type: "sold" },
        ],
        graphBarData: sortedBarData, // Use sorted data (descending order - newest first)
      });
    } else {
      // ✅ Fallback: Show graph if data exists, even without specific permissions
      // This handles cases like PRO/PRINCIPAL users who have graph data but no distribute permissions
      accordions.push({
        title: accordionTitle,
        permissionKey: "VIEW_GRAPH",
        graphData: [
          { label: isAdmin ? "Issued" : "Total Applications", percent: issuedPercent, type: "issued" },
          { label: "Sold", percent: soldPercent, type: "sold" },
        ],
        graphBarData: sortedBarData, // Use sorted data (descending order - newest first)
      });
    }

    return accordions;
  }, [rawGraphData, canViewZone, canViewDGM, canViewCampus, isAdmin, userRole]);

  // ✅ Create accordion for selected zone/dgm/campus using flexible-graph endpoint
  // This accordion shows data based on entity selection, amount selection, or both
  const selectedEntityAccordion = useMemo(() => {
    console.log("=== BUILDING SELECTED ENTITY ACCORDION ===");
    console.log("Selected Entity:", selectedEntity);
    console.log("Selected Amount:", selectedAmount);

    // Show accordion if entity OR amount is selected
    const hasEntity = selectedEntity.id && selectedEntity.name;
    const hasAmount = !!selectedAmount;

    if (!hasEntity && !hasAmount) {
      console.log("No entity or amount selected");
      return null;
    }

    // Use flexible-graph data
    const flexibleData = flexibleGraphQuery.data;

    console.log("Selected entity type:", selectedEntity.type);
    console.log("Flexible graph data:", flexibleData);

    // Show loading state
    if (flexibleGraphQuery.isLoading || flexibleGraphQuery.isFetching) {
      return {
        title: hasEntity ? `${selectedEntity.name} Graph` : `Amount ${selectedAmount} Graph`,
        graphBarData: [],
        graphData: []
      };
    }

    // Show error state
    if (flexibleGraphQuery.isError) {
      console.error("Flexible Graph API Error:", flexibleGraphQuery.error);
      return {
        title: hasEntity ? `${selectedEntity.name} Graph` : `Amount ${selectedAmount} Graph`,
        graphBarData: [],
        graphData: []
      };
    }

    // ✅ Use default zero data if no flexible data or empty array (show graph even with 0 values)
    const defaultBarData = [
      { year: "2022-23", issued: 0, sold: 0, issuedCount: 0, soldCount: 0 },
      { year: "2023-24", issued: 0, sold: 0, issuedCount: 0, soldCount: 0 },
      { year: "2024-25", issued: 0, sold: 0, issuedCount: 0, soldCount: 0 },
      { year: "2025-26", issued: 0, sold: 0, issuedCount: 0, soldCount: 0 },
    ];

    if (!flexibleData || !Array.isArray(flexibleData) || flexibleData.length === 0) {
      console.log("No flexible graph data available - using default zeros");
      // Still show the graph with zero values
      return {
        title: hasEntity ? `${selectedEntity.name} Graph` : `Amount ${selectedAmount} Graph`,
        graphData: [
          { label: isAdmin ? "Issued" : "Total Applications", percent: 0, type: "issued" },
          { label: "Sold", percent: 0, type: "sold" },
        ],
        graphBarData: defaultBarData,
      };
    }

    console.log("=== SELECTED ENTITY DEBUG ===");
    console.log("Selected Entity:", selectedEntity);
    console.log("Flexible Graph Data:", flexibleData);

    // Flexible-graph returns array directly: [{ year, issuedPercent, soldPercent, issuedCount, soldCount }, ...]
    const barData = flexibleData;

    if (!barData || barData.length === 0) {
      console.log("No bar data for selected entity - using default zeros");
      // Still show the graph with zero values
      return {
        title: hasEntity ? `${selectedEntity.name} Graph` : `Amount ${selectedAmount} Graph`,
        graphData: [
          { label: isAdmin ? "Issued" : "Total Applications", percent: 0, type: "issued" },
          { label: "Sold", percent: 0, type: "sold" },
        ],
        graphBarData: defaultBarData,
      };
    }

    // Transform bar data to match expected format FIRST
    const transformedBarData = barData.map((item) => ({
      year: item.year,
      issued: item.issuedPercent || 0,
      sold: item.soldPercent || 0,
      issuedCount: item.issuedCount || 0,
      soldCount: item.soldCount || 0,
    }));

    // Get the current year's percentages from the TRANSFORMED bar data
    // Find the current year (2025-26) or the first item if array is sorted newest to oldest
    // The graph shows years from newest to oldest, so the first item is the current year
    const currentYearData = transformedBarData[0] || transformedBarData[transformedBarData.length - 1];
    const issuedPercent = currentYearData?.issued || 0;  // Use bar height percentage
    const soldPercent = currentYearData?.sold || 0;        // Use bar height percentage

    console.log("Selected Entity - Current Year Data (first item):", currentYearData);
    console.log("Selected Entity - Current Year:", currentYearData?.year);
    console.log("Selected Entity - Issued % (from bar height):", issuedPercent);
    console.log("Selected Entity - Sold % (from bar height):", soldPercent);

    // Build title based on what's selected
    let title = "";
    if (hasEntity && hasAmount) {
      title = `${selectedEntity.name} (Amount: ${selectedAmount}) Wise Graph`;
    } else if (hasEntity) {
      title = `${selectedEntity.name} Graph`;
    } else if (hasAmount) {
      title = `Amount ${selectedAmount} Graph`;
    }

    console.log("✅ Creating accordion with title:", title);

    // Use the same label logic as default accordion
    const issuedLabel = isAdmin ? "Issued" : "Total Applications";

    return {
      title: title,
      graphData: [
        { label: issuedLabel, percent: issuedPercent, type: "issued" },
        { label: "Sold", percent: soldPercent, type: "sold" },
      ],
      graphBarData: transformedBarData,
    };
  }, [selectedEntity, selectedAmount, flexibleGraphQuery.data, flexibleGraphQuery.isLoading, flexibleGraphQuery.isFetching, flexibleGraphQuery.isError, isAdmin]);

  const visibleAccordions = useMemo(() => {
    // Start with default accordion(s)
    const allAccordions = [...accordianData];

    console.log("=== VISIBLE ACCORDIONS DEBUG ===");
    console.log("Default accordions:", accordianData);
    console.log("Selected entity accordion:", selectedEntityAccordion);

    // Add selected entity accordion if available
    if (selectedEntityAccordion) {
      allAccordions.push(selectedEntityAccordion);
      console.log("✅ Added selected entity accordion");
    }

    console.log("Final visible accordions:", allAccordions);
    return allAccordions;
  }, [accordianData, selectedEntityAccordion]);

  const handleChange = (index) => (_event, isExpanded) => {
    setExpandedIndex(isExpanded ? index : null);
  };

  // 🧠 Prevent rendering until category & empId are ready
  if (!userCategory || !empId) {
    console.log("Waiting for user data...", { userCategory, empId });
    return <p>Loading user data...</p>;
  }

  // Check loading state for both default graph and flexible graph (if entity selected)
  const isFlexibleGraphLoading = selectedEntity.id ? flexibleGraphQuery.isLoading : false;
  const isFlexibleGraphError = selectedEntity.id ? flexibleGraphQuery.error : null;

  if (isLoading || isFlexibleGraphLoading) {
    console.log("Loading graph data...");
    return <p>Loading graphs...</p>;
  }

  if (error || isFlexibleGraphError) {
    console.error("Graph API Error:", error || isFlexibleGraphError);
    return <p>Error loading graphs: {(error || isFlexibleGraphError)?.message}</p>;
  }

  // Only check graphResponse if no entity is selected (default graph)
  if (!selectedEntity.id && !graphResponse) {
    console.log("No graph response received");
    return <p>No graph data received from server</p>;
  }

  return (
    <div id="accordian_wrapper" className={styles.accordian_wrapper}>
      {visibleAccordions.length === 0 && (
        <p>No graph data available for your role</p>
      )}
      {visibleAccordions.map((item, index) => {
        // ✅ Log the actual years being passed to verify sorting
        const yearsInData = item.graphBarData ? item.graphBarData.map(d => d.year) : [];
        console.log(`🎯 Rendering Accordion ${index}:`, {
          title: item.title,
          graphData: item.graphData,
          graphBarData: item.graphBarData,
          graphBarDataLength: item.graphBarData ? item.graphBarData.length : "null/undefined",
          graphBarDataType: typeof item.graphBarData,
          isArray: Array.isArray(item.graphBarData),
          yearsInOrder: yearsInData,
          expectedOrder: ["2025-26", "2024-25", "2023-24", "2022-23"],
          isCorrectOrder: JSON.stringify(yearsInData) === JSON.stringify(["2025-26", "2024-25", "2023-24", "2022-23"])
        });

        // ✅ Create a unique key that includes the years to force re-render when order changes
        const uniqueKey = `${item.title}-${yearsInData.join('-')}`;

        return (
          <Accordian
            key={uniqueKey}
            zoneTitle={item.title}
            percentageItems={item.graphData}
            graphBarData={item.graphBarData}
            expanded={expandedIndex === index}
            onChange={handleChange(index)}
          />
        );
      })}
    </div>
  );
};

export default AccordiansContainer;