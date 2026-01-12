import React, { useRef, useState, useEffect } from "react";
import styles from "../analytical-header-part-components/AnalyticsHeader.module.css";
import ApplicationSearchHeaderIcon from "../../../../assets/applicationassets/application-analytics/ApplicationSearchHeaderIcon";
import ApplicationSearchBar from "../../../../widgets/application-search-bar-component/ApplicationSearchBar";
import SearchDropdown from "../analytics-header-part/searchbar-drop-down-component/SearchDropdown";
import FilterSearch from "../analytics-header-part/filter-search-component/FilterSearch";
import { usePermission } from "../../../../hooks/usePermission ";
import { useRole } from "../../../../hooks/useRole";
// import { useZonesQuery, useCampusesQuery, useDgmsQuery } from "../analytics-header-part/zone-name-dropdown/DropdownData";
import {
  useGetAllZones,
  useGetAllDgms,
  useGetAllCampuses,
  useGetDgmsForZonalAccountant,
  useGetCampuesForZonalAccountant,
  useGetCampuesForDgmEmpId,
} from "../../../../queries/applicationqueries/application-analytics/analytics";
import { useSelectedEntity } from "../../../../contexts/applicationcontext/SelectedEntityContext";

const AnalyticsHeader = ({ onTabChange, activeTab }) => {
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const { hasRole: isUserAdmin } = useRole("ADMIN");

  console.log("Is User Admin:", isUserAdmin);
  console.log("Search Term:", searchTerm);

  // ✅ Get user info from localStorage
  const [userCategory, setUserCategory] = useState(null);
  const [empId, setEmpId] = useState(null);

  const wrapperRef = useRef(null);
  const prevActiveTabRef = useRef(activeTab);

  // ✅ Get selected entity from context
  const { selectedEntity, selectEntity, clearSelection } = useSelectedEntity();

  // ✅ Get permissions
  const zonePerms = usePermission("DISTRIBUTE_ZONE");
  const dgmPerms = usePermission("DISTRIBUTE_DGM");
  const campusPerms = usePermission("DISTRIBUTE_CAMPUS");

  // ✅ Load user info from localStorage
  useEffect(() => {
    const storedCategory = localStorage.getItem("campusCategory");
    const storedEmpId = localStorage.getItem("empId");
    if (storedCategory) setUserCategory(storedCategory.toUpperCase());
    if (storedEmpId) setEmpId(storedEmpId);
  }, []);

  // ✅ Update search box value when entity is selected
  useEffect(() => {
    if (selectedEntity && selectedEntity.name) {
      const typeLabel = selectedEntity.type
        ? selectedEntity.type.charAt(0).toUpperCase() + selectedEntity.type.slice(1).toLowerCase()
        : "";
      const displayValue = `${selectedEntity.name} (${typeLabel})`;
      setSearchTerm(displayValue);
      setShowSuggestions(false);
      // Close the filter dropdown after selection
      setShowSearchDropdown(false);
    } else if (!selectedEntity.id) {
      // Clear search box when selection is cleared
      setSearchTerm("");
    }
  }, [selectedEntity]);

  // ✅ Clear selection when tab changes (Zone/DGM/Campus)
  // When user switches tabs, clear the previous selection since they're looking for a different category
  useEffect(() => {
    // Only clear if tab actually changed (not on initial mount)
    if (prevActiveTabRef.current && prevActiveTabRef.current !== activeTab && selectedEntity.id) {
      clearSelection();
      setSearchTerm("");
    }
    prevActiveTabRef.current = activeTab;
  }, [activeTab, selectedEntity.id, clearSelection]);

  // ✅ Identify user type
  // const isZonalAccountant = userCategory === "SCHOOL" || userCategory === "COLLEGE";
  // const isAdmin = !!userCategory && !isZonalAccountant;

  // ✅ Fetch data using the SAME queries as the dropdown

  console.log("SearchDropdown rendered, activeTab:", activeTab);
  const allZonesQuery = useGetAllZones(userCategory, {
    enabled: !!userCategory && !!isUserAdmin && zonePerms.isFullAccess,
  });
  console.log("All Zones Query Data:", allZonesQuery.data);

  const dgmsQueryStatic = useGetAllDgms(userCategory, {
    enabled: !!userCategory && !!isUserAdmin && dgmPerms.isFullAccess,
  });

  console.log("All DGMs Query Data:", dgmsQueryStatic.data);

  const dgmsForZonalQuery = useGetDgmsForZonalAccountant(empId, {
    enabled: !!empId && !isUserAdmin && dgmPerms.isFullAccess,
  });

  console.log("All DGMs For Zonal Query Data:", dgmsForZonalQuery.data);

  const allCampusesQuery = useGetAllCampuses(userCategory, {
    enabled: !!userCategory && !!isUserAdmin && campusPerms.isFullAccess,
  });
  console.log("All Campuses Query Data:", allCampusesQuery.data);

  const campusesForZonalQuery = useGetCampuesForZonalAccountant(empId, userCategory, {
    enabled: !!empId && !!userCategory && !isUserAdmin && campusPerms.isFullAccess,
  });

  const campusesForDgmQuery = useGetCampuesForDgmEmpId(empId, userCategory, {
    enabled: !!empId && !!userCategory && !isUserAdmin && campusPerms.isFullAccess,
  });

  const handleSearchBarClick = () => {
    // Show filter dropdown when clicking/focusing on search bar
    // Don't clear selection for Zone, DGM, or Campus - keep the selection
    // Always show the filter dropdown when clicking the search box
    // Note: Don't auto-restore searchTerm here - let user manually clear if they want
    setShowSearchDropdown(true);
    setShowSuggestions(false);
  };

  // ✅ Get searchable items - EXACT same logic as dropdown
  const getSearchableItems = () => {
    const items = [];

    // Zone data - same for all users with permission
    if (zonePerms.isFullAccess) {
      const zoneData = allZonesQuery.data || [];
      zoneData.forEach(zone => {
        const zoneName = zone.name || zone.zoneName || zone.zone_name || zone.zone;
        if (zoneName) {
          items.push({ id: `zone-${zone.id}`, name: zoneName, type: "Zone" });
        }
      });
    }

    // DGM data - different based on user type
    if (dgmPerms.isFullAccess) {
      let dgmData = [];
      if (isUserAdmin) {
        dgmData = dgmsQueryStatic.data || [];
      } else if (!isUserAdmin) {
        dgmData = dgmsForZonalQuery.data || [];
      }

      dgmData.forEach(dgm => {
        const dgmName = dgm.name || dgm.dgmName || dgm.dgm_name;
        // Zonal accountant API returns empId, Admin API returns id
        const dgmId = dgm.id || dgm.empId;

        if (dgmName && dgmId) {
          items.push({ id: `dgm-${dgmId}`, name: dgmName, type: "DGM" });
        }
      });
    }

    // Campus data - different based on user type
    if (campusPerms.isFullAccess) {
      let campusData = [];

      if (isUserAdmin) {
        campusData = allCampusesQuery.data || [];
      } else if (!isUserAdmin) {
        // Same fallback logic as dropdown
        const zonalData = campusesForZonalQuery.data || [];
        const dgmData = campusesForDgmQuery.data || [];
        campusData = Array.isArray(zonalData) && zonalData.length > 0 ? zonalData : dgmData;
      }

      campusData.forEach(campus => {
        const campusName = campus.name || campus.campusName || campus.campus_name || campus.campus;
        if (campusName) {
          items.push({ id: `campus-${campus.id}`, name: campusName, type: "Branch" });
        }
      });
    }

    return items;
  };

  // ✅ Updated search handler to use real data
  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    const q = value.toLowerCase().trim();

    if (!q) {
      setSuggestions([]);
      setShowSuggestions(false);
      setShowSearchDropdown(true); // Show dropdown when search is cleared
      // Clear selected entity when search box is manually cleared (for all types: Zone, DGM, Campus)
      // User manually deleted the text, so clear the selection
      if (selectedEntity.id) {
        clearSelection();
      }
      return;
    }

    // Get items based on active tab
    const items = getSearchableItems();

    // Filter (case-insensitive)
    const filtered = items.filter((it) => it.name.toLowerCase().includes(q));

    // De-duplicate by exact original string
    const seen = new Set();
    const unique = [];
    for (const it of filtered) {
      if (!seen.has(it.name)) {
        seen.add(it.name);
        unique.push(it);
      }
    }

    // Top-5 only
    setSuggestions(unique.slice(0, 5));
    setShowSuggestions(unique.length > 0);
    setShowSearchDropdown(false); // Hide dropdown when showing suggestions
  };

  // ✅ Handle search item click
  const handleSearchItemClick = (item) => {
    console.log("Search item selected:", item);

    // Extract the actual ID from the prefixed ID (e.g., "zone-22" -> "22")
    const actualId = item.id ? item.id.replace(/^(zone|dgm|campus)-/, "") : null;

    // Map the type from "Zone"/"DGM"/"Campus" to "zone"/"dgm"/"campus"
    let entityType = null;
    if (item.type === "Zone") entityType = "zone";
    else if (item.type === "DGM") entityType = "dgm";
    else if (item.type === "Branch") entityType = "branch";

    // For DGM, we need to find the original data to get cmpsId
    let cmpsId = null;
    if (entityType === "dgm" && actualId) {
      // Find the DGM in the raw data to get cmpsId
      let dgmData = [];
      if (isUserAdmin) {
        dgmData = dgmsQueryStatic.data || [];
      } else {
        dgmData = dgmsForZonalQuery.data || [];
      }

      console.log("🔍 [AnalyticsHeader] Looking for DGM...", {
        actualId,
        dgmDataSize: dgmData.length,
        firstFewDgMs: dgmData.slice(0, 3)
      });

      const dgmItem = dgmData.find(dgm => String(dgm.id || dgm.empId) === String(actualId));

      console.log("🔍 [AnalyticsHeader] Found DGM Item:", dgmItem);

      if (dgmItem) {
        // Check for array of campuses (from dgm-with-campuses endpoint)
        if (dgmItem.campuses && Array.isArray(dgmItem.campuses)) {
          // Extract IDs from campus objects
          cmpsId = dgmItem.campuses.map(c => c.campusId || c.id || c.cmps_id || c.cmpsId).filter(id => id);
          console.log("🔍 [AnalyticsHeader] Extracted via .campuses:", cmpsId);
        } else if (dgmItem.campusIds) {
          // If it already has a list of IDs
          cmpsId = dgmItem.campusIds;
          console.log("🔍 [AnalyticsHeader] Extracted via .campusIds:", cmpsId);
        } else {
          // Fallback to singular properties
          cmpsId = dgmItem.cmpsId || dgmItem.campusId || dgmItem.cmps_id || dgmItem.campus_id || null;
          console.log("🔍 [AnalyticsHeader] Extracted via singular:", cmpsId);
        }
      }
    }

    // Call selectEntity with the extracted data
    if (actualId && entityType) {
      console.log(`✅ Calling selectEntity from search:`, {
        id: actualId,
        name: item.name,
        type: entityType,
        cmpsId: cmpsId,
        originalItem: item
      });
      selectEntity(actualId, item.name, entityType, cmpsId);
    } else {
      console.error("❌ Failed to call selectEntity - missing actualId or entityType", {
        actualId,
        entityType,
        item
      });
    }

    // Close suggestions and filter dropdown after selection
    setShowSuggestions(false);
    setShowSearchDropdown(false);
  };

  useEffect(() => {
    function handleOutside(e) {
      const clickedInsideWrapper = wrapperRef.current?.contains(e.target);
      if (clickedInsideWrapper) return;
      // Only close if user clicks outside - don't close if they're interacting with the search
      setShowSearchDropdown(false);
      setShowSuggestions(false);
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  // ✅ Generate dynamic placeholder based on ACTIVE TAB
  const getSearchPlaceholder = () => {
    // If there is an active tab chosen by the user, show that specific placeholder
    // if (activeTab === "Zone") return "Search for Zone";
    // if (activeTab === "DGM") return "Search for DGM";
    // if (activeTab === "Branch") return "Search for Branch";

    // Fallback logic if no tab is active (or on initial load before sync)
    // We can keep the old logic as a fallback or just return "Search"
    const allowedTypes = [];
    if (zonePerms.isFullAccess) allowedTypes.push("Zone");
    if (dgmPerms.isFullAccess) allowedTypes.push("DGM");
    if (campusPerms.isFullAccess) allowedTypes.push("Branch");

    if (allowedTypes.length === 0) return "Search";
    if (allowedTypes.length === 1) return `Search for ${allowedTypes[0]}`;
    if (allowedTypes.length === 2) return `Search for ${allowedTypes[0]} or ${allowedTypes[1]}`;
    return `Search for ${allowedTypes[0]}, ${allowedTypes[1]} or ${allowedTypes[2]}`;
  };

  return (
    <div className={styles.analytics_header_and_search_bar} ref={wrapperRef}>
      <div className={styles.analytics_header}>
        <ApplicationSearchHeaderIcon height="44" width="44" />
        <div>
          <h3 className={styles.analytics_heading}>Application Analytics</h3>
          <p className={styles.analytics_header_text_para}>
            Get all the analytics and growth rate of applications
          </p>
        </div>
      </div>

      <div className={styles.searchbar_wrapper}>
        <ApplicationSearchBar
          placeholderText={getSearchPlaceholder()}
          customClass={styles.custom_search_bar}
          onClick={handleSearchBarClick}
          onChange={handleInputChange}
          value={searchTerm}
          inputRule="none"
          maxLength="45"
          minLength="3"
        />

        {showSuggestions && <FilterSearch suggestions={suggestions} onItemClick={handleSearchItemClick} />}
        {showSearchDropdown && <SearchDropdown onTabChange={onTabChange} activeTab={activeTab} />}
      </div>
    </div>
  );
};

export default AnalyticsHeader;

