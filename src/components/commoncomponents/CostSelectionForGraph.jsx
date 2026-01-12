import React, { useState, useEffect, useMemo, useRef } from "react";
import styles from "./CostSelectionForGraph.module.css";
import Button from "../../widgets/Button/Button";
import { useSelectedEntity } from "../../contexts/applicationcontext/SelectedEntityContext";
import { useGetAllAmounts, useGetAmountMaster } from "../../queries/applicationqueries/application-analytics/analytics";

const CostSelectionForGraph = ({ onClose, onApply, onClear, type, excludeRef }) => {
  const [activeTab, setActiveTab] = useState(null);
  const { setAmount, clearAmount, selectedAmount } = useSelectedEntity();

  // Ref to track if click is inside the component
  const containerRef = useRef(null);

  // Get employee ID from localStorage
  const empId = localStorage.getItem("empId");
  const academicYearId = 26; // Hardcoded as per requirement


  // Fetch amounts from backend
  const { data: amountsData, isLoading: amountsLoading, isError: amountsError } = useGetAllAmounts(empId, academicYearId, {
    enabled: !!type,
  });

  const { data: amountMasterData, isLoading: amountMasterLoading, isError: amountMasterError } = useGetAmountMaster({
    enabled: !type,
  });
  console.log("amountMasterData", amountMasterData);

  // Determine which data to use based on type
  const finalData = type ? amountsData : amountMasterData;
  const finalLoading = type ? amountsLoading : amountMasterLoading;
  const finalError = type ? amountsError : amountMasterError;

  // Transform backend data to costTabs format
  const costTabs = useMemo(() => {
    if (finalLoading) {
      return [];
    }

    if (finalError) {
      return [
        { id: 1, label: "10000", value: "10000" },
        { id: 2, label: "5000", value: "5000" },
        { id: 3, label: "2000", value: "2000" },
        { id: 4, label: "0", value: "0" },
      ];
    }

    if (!finalData) {
      return [];
    }

    let amountsArray = Array.isArray(finalData) ? finalData : finalData.data || finalData.amounts || finalData.values || [];

    if (!Array.isArray(amountsArray)) {
      return [
        { id: 1, label: "10000", value: "10000" },
        { id: 2, label: "5000", value: "5000" },
        { id: 3, label: "2000", value: "2000" },
        { id: 4, label: "0", value: "0" },
      ];
    }

    const transformed = amountsArray.map((item, index) => {
      let amount = item.amount || item.value || item.id || item;
      const amountStr = String(amount);
      return { id: index + 1, label: amountStr, value: amountStr };
    }).sort((a, b) => Number(b.value) - Number(a.value));

    return transformed;
  }, [finalData, finalLoading, finalError]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      // Check if click is inside the component
      const isInsideComponent = containerRef.current && containerRef.current.contains(e.target);
      // Check if click is inside the excluded element (e.g., the toggle button)
      const isInsideExcluded = excludeRef && excludeRef.current && excludeRef.current.contains(e.target);

      if (!isInsideComponent && !isInsideExcluded) {
        onClose?.(); // Close the modal when clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose, excludeRef]);

  useEffect(() => {
    if (selectedAmount !== null && selectedAmount !== undefined) {
      setActiveTab(selectedAmount.toString());
    }
  }, [selectedAmount]);

  const handleNavTab = (value) => {
    setActiveTab(value);
  };

  const clearActive = () => {
    setActiveTab(null);
    clearAmount();
    onClear?.();
  };

  const handleApply = () => {
    if (activeTab) {
      setAmount(activeTab);
      onApply?.();
    } else {
      clearAmount();
      onClear?.();
    }

    onClose?.(); // Close after applying
  };

  return (
    <div className={styles.costSelectionForGraphWrapper} ref={containerRef}>
      <div className={styles.costFilterTop}>
        <p className={styles.costFilterheading}>Application Price</p>
        {amountsLoading ? (
          <p>Loading amounts...</p>
        ) : amountsError ? (
          <p>Error loading amounts. Using default values.</p>
        ) : (
          <ul className={styles.cost_nav_tab}>
            {costTabs.map((tab) => (
              <li
                key={tab.id}
                className={styles.cost_nav_list}
                onClick={() => handleNavTab(tab.value)}
              >
                <a
                  className={`${styles.cost_nav_item} ${activeTab === tab.value ? styles.active : ""}`}
                >
                  {tab.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={styles.filterAppButtons}>
        <Button
          buttonname={"Clear"}
          variant={"secondary"}
          onClick={clearActive}
        />
        <Button
          buttonname={"Apply"}
          variant={"primary"}
          onClick={handleApply}
        />
      </div>
    </div>
  );
};

export default CostSelectionForGraph;
