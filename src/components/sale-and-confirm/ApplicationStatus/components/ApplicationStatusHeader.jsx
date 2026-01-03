import React from 'react';
import styles from './ApplicationStatusToSetCategory/ApplicationStatusToSetCategory.module.css';
import searchIcon from '../../../../assets/application-status/application-status/Group.svg';
import filterIcon from '../../../../assets/application-status/application-status/Filter.svg';
import appliedFilterIcon from '../../../../assets/application-status/application-status/Vector.svg';
import exportIcon from '../../../../assets/application-status/application-status/Arrow up.svg';
import FilterPanel from './FilterButton/FilterPanel';
import FileExport from './ExportButton/FileExport';
import { EXPORT_CONFIG } from './ExportButton/utils/exportConfig';
import { getSelectedRecords } from './ExportButton/utils/exportUtils';
 
const ApplicationStatusHeader = ({
  search,
  handleSearchChange,
  handleKeyDown,
  showFilter,
  setShowFilter,
  showExport,
  setShowExport,
  isFilterApplied,
  activeTab,
  setActiveTab,
  selectedCampus,
  setSelectedCampus,
  studentCategory,
  setStudentCategory,
  data = [], // Add data prop
  category  // Add category prop
}) => {
  // Debug: Log category to verify it's being received
  console.log('🔍 ApplicationStatusHeader - Category received:', category);
 
  return (
    <div className={styles["application-status__actions"]}>
      <div className={styles["application-status__search"]}>
        <figure className={styles["application-status__search-icon"]}>
          <img src={searchIcon} alt="Search" />
        </figure>
        <input
          type="text"
          inputMode="numeric"
          placeholder="Search with application no"
          value={search}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          maxLength={9}
        />
      </div>
      {!search && (
        <div className={styles["application-status__filter"]}>
          <button
            className={styles["application-status__filter-btn"]}
            onClick={() => setShowFilter((prev) => !prev)}
          >
            <span className={styles["application-status__filter-icon-wrapper"]}>
              <img
                src={isFilterApplied ? appliedFilterIcon : filterIcon}
                alt="Filter"
              />
              {isFilterApplied && (
                <span className={styles["application-status__filter-dot"]}></span>
              )}
            </span>
            Filter
          </button>
          {showFilter && (
            <FilterPanel
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              selectedCampus={selectedCampus}
              setSelectedCampus={setSelectedCampus}
              studentCategory={studentCategory}
              setStudentCategory={setStudentCategory}
              category={category}
            />
          )}
        </div>
      )}
      {!search && (
        <div className={styles["application-status__export"]}>
          <button
            className={styles["application-status__export-btn"]}
            onClick={() => setShowExport((prev) => !prev)}
          >
            <img src={exportIcon} alt="Export" /> Export
          </button>
          {showExport && (
            <FileExport
              exportConfig={EXPORT_CONFIG.applicationStatus}
              onExport={(type, selectedRecords) => {
                console.log("Export:", type, "Records:", selectedRecords.length);
                setShowExport(false); // Close dropdown after export
              }}
              data={getSelectedRecords(data)}
            />
          )}
        </div>
      )}
    </div>
  );
};
 
export default ApplicationStatusHeader;
 
 