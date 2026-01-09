

// Sample data
//   const data = [
//     { appNo: "A123", status: "Sold", campusName: "Campus A", zoneName: "Zone 1" },
//     { applicationNo: "B456", displayStatus: "Damaged", campus: "Campus B", zone: "Zone 2" },
//     { applicationNo: "C789", displayStatus: "Confirmed", campus: "Campus C", zone: "Zone 3" },
//     { applicationNo: "A123", displayStatus: "Sold", campus: "Campus A", zone: "Zone 1" },
//     { applicationNo: "A123", displayStatus: "Sold", campus: "Campus A", zone: "Zone 1" },
//     { applicationNo: "A123", displayStatus: "Sold", campus: "Campus A", zone: "Zone 1" },
//     { applicationNo: "A123", displayStatus: "Sold", campus: "Campus A", zone: "Zone 1" },
//     { applicationNo: "A123", displayStatus: "Sold", campus: "Campus A", zone: "Zone 1" },
//     { applicationNo: "A123", displayStatus: "Sold", campus: "Campus A", zone: "Zone 1" },
//     { applicationNo: "A123", displayStatus: "Sold", campus: "Campus A", zone: "Zone 1" },

//   ];

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApplicationSearchHeader from "../../../../components/applicationcomponents/application-analytics/application-search-components/application-search-header-component/ApplicationSearchHeader";
import ApplicationSearchBar from "../../../../widgets/application-search-bar-component/ApplicationSearchBar";
import SearchCards from "../../../../components/applicationcomponents/sale-and-confirm/SearchResultCardWithStatus/SearchResultCardWithStatus";
import styles from "../application-search-container/ApplicationSearchContainer.module.css";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const ApplicationSearchContainer = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const empId = localStorage.getItem("empId");
  const campusCategory = localStorage.getItem("campusCategory");

  // ✅ API fetch function
  const fetchApp = async (empId, campusCategory) => {
    const response = await axios.get(
      `http://localhost:8080/api/application-status/status-by-role?empId=${empId}&category=${campusCategory}`
    );
    console.log("Fetched Data →", response);
    return response.data ?? [];
  };

  // ✅ useQuery hook — always runs in same order
  const {
    data = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["appCard"],
    queryFn: () => fetchApp(empId, campusCategory),
  });

  // ✅ Handle search
  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  // ✅ Filter data based on search
  useEffect(() => {
  if (search.trim() === "") {
    setFilteredData([]);
  } else {
    const filtered = data
      .filter((item) =>
        String(item.num ?? "").toLowerCase().includes(search.toLowerCase())
      )
      .map((item) => {
        // Log the item to see its structure
        console.log("Mapped Item →", item);

        return {
          // Transform API keys to Card Component keys
          ...item,
          id: item.num,
          applicationNo: item.num,
          campus: item.cmps_name,
          zone: item.zone_name,
          displayStatus: item.status, // Map 'status' from API to 'displayStatus' for logic
        };
      });

    setFilteredData(filtered);
  }
}, [search, data]);


console.log("Filtered Data →", filteredData);

  // Handle card click navigation - same behavior as Sale & Confirm tab
  const handleCardClick = (item) => {
    const applicationNo = item?.applicationNo;
    const displayStatus = item?.displayStatus;
    const normalizedCategory = campusCategory?.toLowerCase()?.trim();
    
    if (applicationNo) {
      let route;
      
      // Determine route based on status and category
      if (displayStatus === "Sold" || displayStatus === "Not Confirmed" || displayStatus === "Confirmed") {
        // For confirmation: use category-specific route
        if (normalizedCategory === 'college') {
          route = "college-confirmation";
        } else {
          route = "school-confirmation";
        }
      } else {
        // For sale (PRO, With Pro, or other unsold statuses): use category-specific route
        if (normalizedCategory === 'college') {
          route = "college-sale";
        } else {
          route = "school-sale";
        }
      }
      
      // Navigate with applicationData in state
      navigate(`/scopes/application/status/${applicationNo}/${route}`, {
        state: {
          applicationData: item,
        },
      });
    }
  };

  // ✅ Conditional rendering inside JSX instead of early return
  return (
    <>
      <div id="application_search_container" className={styles.application_search_container}>
        <ApplicationSearchHeader />
        <ApplicationSearchBar
          placeholderText="Search for Application"
          value={search}
          onChange={handleSearchChange}
        />
      </div>

      {/* Loading / Error states */}
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}

      {/* Popup cards */}
      {!isLoading && !error && search.trim() !== "" && filteredData.length > 0 && (
        <div className={styles.search_list_container}>
          <SearchCards
            data={filteredData}
            maxResults={5}
            category={campusCategory}
            onCardClick={handleCardClick}
          />
        </div>
      )}

      {/* No results */}
      {!isLoading && !error && search.trim() !== "" && filteredData.length === 0 && (
        <p style={{ textAlign: "center", color: "#777" }}>No results found.</p>
      )}
    </>
  );
};

export default ApplicationSearchContainer;
