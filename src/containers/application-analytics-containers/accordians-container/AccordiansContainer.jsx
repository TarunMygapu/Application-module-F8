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
  useGetFlexibleGraph,
} from "../../../queries/application-analytics/analytics";
import { useSelectedEntity } from "../../../contexts/SelectedEntityContext";

const AccordiansContainer = () => {
  const { canView: canViewZone } = usePermission("DISTRIBUTE_ZONE");
  const { canView: canViewDGM } = usePermission("DISTRIBUTE_DGM");
  const { canView: canViewCampus } = usePermission("DISTRIBUTE_CAMPUS");
 
  const { selectedEntity, selectedAmount } = useSelectedEntity();
 
  console.log("=== ACCORDIANS CONTAINER DEBUG ===");
  console.log("Selected Entity in Accordians:", selectedEntity);
  console.log("Selected Amount:", selectedAmount);

  const [userCategory, setUserCategory] = useState(null);
  const [empId, setEmpId] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null);

  // ✅ Load category & empId from localStorage
  useEffect(() => {
    // Read category from either `campusCategory` (new) or `category` (legacy)
    const storedCategory = localStorage.getItem("campusCategory") || localStorage.getItem("category");
    const storedEmpId = localStorage.getItem("empId");
    if (storedCategory) setUserCategory(storedCategory.toUpperCase());
    if (storedEmpId) setEmpId(storedEmpId);
  }, []);

  // ✅ Identify user type (Admin vs others)
  const isZonalAccountant =
    userCategory === "SCHOOL" || userCategory === "COLLEGE";
  const isAdmin = !!userCategory && !isZonalAccountant;

  // ✅ Conditionally fetch graph data based on role
  const adminGraphQuery = useGetGraphDataForAdmin(empId, {
    enabled: !!empId && !!userCategory && isAdmin,
  });

  const employeeGraphQuery = useGetGraphDataForEmployee(empId, {
    enabled: !!empId && !!userCategory && !isAdmin,
  });
 
  // ✅ Fetch analytics for selected zone/dgm/campus using flexible-graph endpoint
  // This endpoint supports zoneId, campusId, and amount parameters (all optional)
  const zoneId = selectedEntity.type === "zone" ? selectedEntity.id : null;
  // For DGM, use cmpsId from selectedEntity; for campus, use the entity id
  const campusId = selectedEntity.type === "dgm"
    ? (selectedEntity.cmpsId || null)
    : (selectedEntity.type === "campus" ? selectedEntity.id : null);
  const amount = selectedAmount ? Number(selectedAmount) : null;

  console.log("🔍 ACCORDIANS: Selected Entity Details:", {
    selectedEntity,
    zoneId,
    campusId,
    amount,
    zoneIdType: typeof zoneId,
    campusIdType: typeof campusId,
    entityType: selectedEntity.type,
    cmpsId: selectedEntity.cmpsId
  });
 
  // Enable query when entity OR amount OR both are selected
  const hasEntity = !!selectedEntity.id;
  const hasAmount = !!selectedAmount;
  const shouldFetch = hasEntity || hasAmount;
 
  const flexibleGraphQuery = useGetFlexibleGraph(zoneId, campusId, amount, {
    enabled: shouldFetch, // Enable when entity OR amount is selected
  });
 
  // Keep old queries for backward compatibility (if needed)
  const selectedZoneQuery = useGetAnalyticsForZone(selectedEntity.id, {
    enabled: false, // Disabled - using flexible-graph instead
  });
 
  const selectedCampusQuery = useGetAnalyticsForCampus(selectedEntity.id, {
    enabled: false, // Disabled - using flexible-graph instead
  });
 
  console.log("=== QUERY STATUS ===");
  console.log("Zone query enabled:", !!selectedEntity.id && selectedEntity.type === "zone");
  console.log("Campus query enabled:", !!selectedEntity.id && selectedEntity.type === "campus");
  console.log("Zone query status:", {
    isLoading: selectedZoneQuery.isLoading,
    isFetching: selectedZoneQuery.isFetching,
    data: selectedZoneQuery.data,
    error: selectedZoneQuery.error
  });
  console.log("Campus query status:", {
    isLoading: selectedCampusQuery.isLoading,
    isFetching: selectedCampusQuery.isFetching,
    data: selectedCampusQuery.data,
    error: selectedCampusQuery.error
  });

  // ✅ Choose which data to use
  const { data: graphResponse, isLoading, error } = isAdmin
    ? adminGraphQuery
    : employeeGraphQuery;

  console.log("=== GRAPH DEBUG ===");
  console.log("User Category:", userCategory);
  console.log("Is Admin:", isAdmin);
  console.log("Employee ID:", empId);
  console.log("Full Graph Response:", graphResponse);
  console.log("Is Loading:", isLoading);
  console.log("Error:", error);

  // ✅ Extract graphData from response
  const rawGraphData = useMemo(() => {
    if (!graphResponse) {
      console.log("📈 No graphResponse available");
      return null;
    }
   
    console.log("📈 Full graphResponse:", graphResponse);
    console.log("📈 graphResponse type:", typeof graphResponse);
    console.log("📈 graphResponse keys:", graphResponse ? Object.keys(graphResponse) : "null");
   
    // Admin response from cards_graph: { metricCards: [...], graphData: {...} }
    // Employee response: { metricsData: {...}, graphData: {...} }
    const extractedData = graphResponse.graphData || null;
    console.log("📈 Extracted graphData:", extractedData);
    console.log("📈 graphData type:", typeof extractedData);
    console.log("📈 graphData keys:", extractedData ? Object.keys(extractedData) : "null");
    
    // ✅ Additional check: verify graphBarData exists
    if (extractedData) {
      console.log("📈 graphData.graphBarData:", extractedData.graphBarData);
      console.log("📈 graphData.graphBarData type:", typeof extractedData.graphBarData);
      console.log("📈 graphData.graphBarData is array:", Array.isArray(extractedData.graphBarData));
      if (Array.isArray(extractedData.graphBarData)) {
        console.log("📈 graphData.graphBarData length:", extractedData.graphBarData.length);
        console.log("📈 graphData.graphBarData first item:", extractedData.graphBarData[0]);
      }
      // ✅ Log all keys in graphData to see what's available
      console.log("📈 graphData all keys:", Object.keys(extractedData));
      console.log("📈 graphData full structure:", JSON.stringify(extractedData, null, 2));
    }
   
    return extractedData;
  }, [graphResponse]);

  console.log("Raw Graph Data:", rawGraphData);

  // ✅ Extract role from response for non-admin users
  const userRole = useMemo(() => {
    if (isAdmin) return "Admin";
    return graphResponse?.role || "User";
  }, [graphResponse, isAdmin]);

  console.log("User Role from API:", userRole);

  // ✅ Default graph data with zeros (for when API returns no data)
  const defaultGraphData = {
    graphBarData: [
      { year: "2022-23", issued: 0, sold: 0, issuedCount: 0, soldCount: 0 },
      { year: "2023-24", issued: 0, sold: 0, issuedCount: 0, soldCount: 0 },
      { year: "2024-25", issued: 0, sold: 0, issuedCount: 0, soldCount: 0 },
      { year: "2025-26", issued: 0, sold: 0, issuedCount: 0, soldCount: 0 },
    ],
  };

  // ✅ Transform graph data to accordion format
  const accordianData = useMemo(() => {
    // If no graph data, use default with zeros
    if (!rawGraphData) {
      console.log("No graph data available - using default zeros");
      const defaultBarData = defaultGraphData.graphBarData;
      return [{
        title: "Previous Year Graph",
        graphData: [
          { label: isAdmin ? "Issued" : "Total Applications", percent: 0 },
          { label: "Sold", percent: 0 },
        ],
        graphBarData: defaultBarData,
      }];
    }

    // Handle different API structures
    // Admin API: graphData.graphBarData
    // Employee API: graphData.yearlyData
    // ✅ Check all possible keys for graph data
    const barData = rawGraphData.graphBarData || rawGraphData.yearlyData || rawGraphData.barData || null;
    
    console.log("🔍 Checking barData:", {
      barData,
      barDataType: typeof barData,
      isArray: Array.isArray(barData),
      length: Array.isArray(barData) ? barData.length : "N/A",
      rawGraphDataKeys: Object.keys(rawGraphData),
      hasGraphBarData: 'graphBarData' in rawGraphData,
      hasYearlyData: 'yearlyData' in rawGraphData,
      hasBarData: 'barData' in rawGraphData,
      rawGraphDataValue: rawGraphData
    });
   
    // If barData is empty, use default with zeros
    if (!barData || !Array.isArray(barData) || barData.length === 0) {
      console.log("⚠️ No bar data available - using default zeros", {
        barData,
        isArray: Array.isArray(barData),
        length: Array.isArray(barData) ? barData.length : "N/A"
      });
      const defaultBarData = defaultGraphData.graphBarData;
      return [{
        title: "Previous Year Graph",
        graphData: [
          { label: isAdmin ? "Issued" : "Total Applications", percent: 0 },
          { label: "Sold", percent: 0 },
        ],
        graphBarData: defaultBarData,
      }];
    }

    console.log("✅ Bar Data from API:", barData);
    console.log("✅ Bar Data length:", barData.length);
   
    // Transform bar data to accordion format FIRST
    const transformedBarData = barData.map((item) => {
      // Helper to coerce percent-like values (e.g., "100%" or 100) to numeric
      const toNumber = (v) => {
        if (v === null || v === undefined) return 0;
        if (typeof v === 'number') return v;
        // Strip percent sign and non-numeric characters, then parse
        const cleaned = String(v).replace(/[^0-9.-]+/g, '');
        const n = parseFloat(cleaned);
        return Number.isFinite(n) ? n : 0;
      };

      // ✅ Since both admin and employee now use cards_graph endpoint, they return the same structure
      // Check for both field names to support both API structures (backward compatibility)
      const issuedPercent = toNumber(
        item.issuedPercent ??      // cards_graph endpoint (admin & employee)
        item.totalAppPercent ??   // Old employee endpoint (backward compatibility)
        item.issued ??             // Fallback
        0
      );
      const soldPercent = toNumber(
        item.soldPercent ??        // cards_graph endpoint (admin & employee)
        item.sold ??               // Fallback
        0
      );
      const issuedCount = toNumber(
        item.issuedCount ??        // cards_graph endpoint (admin & employee)
        item.totalAppCount ??      // Old employee endpoint (backward compatibility)
        item.issued ??             // Fallback
        0
      );
      const soldCount = toNumber(
        item.soldCount ??          // cards_graph endpoint (admin & employee)
        item.sold ??               // Fallback
        0
      );

      console.log(`🔧 Transforming item for ${item.year}:`, {
        original: item,
        issuedPercent,
        soldPercent,
        issuedCount,
        soldCount
      });

      return {
        year: item.year,
        issued: issuedPercent,      // Bar height percentage (numeric)
        sold: soldPercent,          // Bar height percentage (numeric)
        issuedCount: issuedCount,   // Tooltip count (numeric)
        soldCount: soldCount,       // Tooltip count (numeric)
      };
    });

    // Get the current year's percentages from the TRANSFORMED bar data
    // Find the current year (2025-26) or the first item if array is sorted newest to oldest
    // The graph shows years from newest to oldest, so the first item is the current year
    const currentYearData = transformedBarData[0] || transformedBarData[transformedBarData.length - 1];
    const issuedPercent = currentYearData?.issued || 0;  // Use bar height percentage
    const soldPercent = currentYearData?.sold || 0;        // Use bar height percentage

    console.log("✅ Transformed Bar Data:", transformedBarData);
    console.log("✅ Transformed Bar Data length:", transformedBarData.length);
    console.log("✅ Current Year Data (first item):", currentYearData);
    console.log("✅ Current Year:", currentYearData?.year);
    console.log("✅ Current Issued % (from bar height):", issuedPercent);
    console.log("✅ Current Sold % (from bar height):", soldPercent);
    
    // ✅ Final validation before returning
    if (!transformedBarData || transformedBarData.length === 0) {
      console.error("❌ ERROR: transformedBarData is empty after transformation!");
      const defaultBarData = defaultGraphData.graphBarData;
      return [{
        title: "Previous Year Graph",
        graphData: [
          { label: isAdmin ? "Issued" : "Total Applications", percent: 0 },
          { label: "Sold", percent: 0 },
        ],
        graphBarData: defaultBarData,
      }];
    }
   
    // Show only ONE accordion based on highest permission
    const accordions = [];
   
    // Determine accordion title based on role
    let accordionTitle;
    if (isAdmin) {
      accordionTitle = "Year Wise Graph";
    } else {
      // For non-admin, use role from API response
      accordionTitle = `${userRole}  Graph`;
    }
   
    console.log("Accordion Title:", accordionTitle);
   
    // Determine which accordion to show based on permissions
    if (canViewZone) {
      accordions.push({
        title: accordionTitle,
        permissionKey: "DISTRIBUTE_ZONE",
        graphData: [
          { label: isAdmin ? "Issued" : "Total Applications", percent: issuedPercent,type:"issued"},
          { label: "Sold", percent: soldPercent, type:"sold" },
        ],
        graphBarData: transformedBarData,
      });
    } else if (canViewDGM) {
      accordions.push({
        title: accordionTitle,
        permissionKey: "DISTRIBUTE_DGM",
        graphData: [
          { label: isAdmin ? "Issued" : "Total Applications", percent: issuedPercent, type:"issued" },
          { label: "Sold", percent: soldPercent, type:"sold" },
        ],
        graphBarData: transformedBarData,
      });
    } else if (canViewCampus) {
      accordions.push({
        title: accordionTitle,
        permissionKey: "DISTRIBUTE_CAMPUS",
        graphData: [
          { label: isAdmin ? "Issued" : "Total Applications", percent: issuedPercent, type:"issued" },
          { label: "Sold", percent: soldPercent, type:"sold" },
        ],
        graphBarData: transformedBarData,
      });
    } else {
      // ✅ Fallback: Show graph if data exists, even without specific permissions
      // This handles cases like PRO/PRINCIPAL users who have graph data but no distribute permissions
      accordions.push({
        title: accordionTitle,
        permissionKey: "VIEW_GRAPH",
        graphData: [
          { label: isAdmin ? "Issued" : "Total Applications", percent: issuedPercent, type:"issued" },
          { label: "Sold", percent: soldPercent, type:"sold" },
        ],
        graphBarData: transformedBarData,
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
          { label: isAdmin ? "Issued" : "Total Applications", percent: 0 },
          { label: "Sold", percent: 0 },
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
          { label: isAdmin ? "Issued" : "Total Applications", percent: 0 },
          { label: "Sold", percent: 0 },
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
        { label: issuedLabel, percent: issuedPercent,type:"issued" },
        { label: "Sold", percent: soldPercent,type:"sold" },
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
        console.log(`🎯 Rendering Accordion ${index}:`, {
          title: item.title,
          graphData: item.graphData,
          graphBarData: item.graphBarData,
          graphBarDataLength: item.graphBarData ? item.graphBarData.length : "null/undefined",
          graphBarDataType: typeof item.graphBarData,
          isArray: Array.isArray(item.graphBarData)
        });
        
        return (
          <Accordian
            key={item.title}
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