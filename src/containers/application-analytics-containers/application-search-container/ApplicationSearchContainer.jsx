

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
import ApplicationSearchHeader from "../../../components/application-analytics/application-search-components/application-search-header-component/ApplicationSearchHeader";
import ApplicationSearchBar from "../../../widgets/application-search-bar-component/ApplicationSearchBar";
import SearchCards from "../../../components/sale-and-confirm/SearchResultCardWithStatus/SearchResultCardWithStatus";
import styles from "../application-search-container/ApplicationSearchContainer.module.css";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const ApplicationSearchContainer = () => {
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
            onCardClick={(item) => console.log("Card clicked:", item)}
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
