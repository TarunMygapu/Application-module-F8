import { useEffect, useState } from "react";
import { useAuthorizedByList, useConcessionReasonList } from "../../../../../../../../queries/applicationqueries/college-apis/form-apis/ConcessionInfoApis";
import { useConcessionTypes } from "../../../../../../../../components/applicationcomponents/sale-and-confirm/ConfirmationFormComponents/SCHOOL-SALE-CONFIRMATION/school-sale-and-conformation-form/school-sale&conf-concestion-info/hooks/SchoolConcession";
import {
  isValidValue,
  normalizeConcessionsFromOverview,
  findConcessionByType,
  getDisplayValueById,
  findOptionByFuzzyText,
} from "../utils/concessionHelpers";

export default function useCollegeConcessionFormState({ formData, onChange, academicYear, academicYearId, overviewData, joiningClassName = "" }) {
  // Check if joining class is INTER 2 - hide 1st year concession in that case
  const isInter2 = joiningClassName && (joiningClassName.toUpperCase().trim() === "INTER 2" || joiningClassName.toUpperCase().trim() === "INTER2");
  const shouldHideFirstYear = isInter2;
  const [isChecked, setIsChecked] = useState(formData?.concessionWrittenOnApplication || false);

  // Always sync isChecked with parent form value
  useEffect(() => {
    if (isChecked !== !!formData?.concessionWrittenOnApplication) {
      setIsChecked(!!formData?.concessionWrittenOnApplication);
    }
  }, [formData?.concessionWrittenOnApplication]);
  const [selectedReferredBy, setSelectedReferredBy] = useState("");
  const [selectedAuthorizedBy, setSelectedAuthorizedBy] = useState("");
  const [selectedConcessionReferredBy, setSelectedConcessionReferredBy] = useState("");
  const [selectedConcessionReason, setSelectedConcessionReason] = useState("");

  // Dropdown data
  const { authorizedByList, loading, error } = useAuthorizedByList();
  const { concessionReasonList, loading: reasonLoading, error: reasonError } = useConcessionReasonList();

  // Only need the id lookup; avoid unused values
  const { getConcessionTypeIdByLabel } = useConcessionTypes();

  // Initialize academic year and id into the parent form if missing
  useEffect(() => {
    if (academicYear && onChange && !formData?.academicYear) {
      onChange({ target: { name: "academicYear", value: academicYear } });
    }
    if (academicYearId && onChange && !formData?.academicYearId) {
      onChange({ target: { name: "academicYearId", value: academicYearId } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [academicYear, academicYearId]);

  // Options for dropdowns
  const dropdownOptions = loading
    ? ["Loading..."]
    : (authorizedByList?.length ? authorizedByList.map((i) => i.displayText) : ["No data available"]);

  const concessionReasonOptions = reasonLoading
    ? ["Loading..."]
    : (concessionReasonList?.length ? concessionReasonList.map((i) => i.displayText) : ["No data available"]);

  // Display helpers
  const getConcessionReasonDisplayValue = (reasonId) => getDisplayValueById(concessionReasonList || [], reasonId);
  const getAuthorizedByDisplayValue = (authorizedById) => getDisplayValueById(authorizedByList || [], authorizedById);
  const getReferredByDisplayValue = (referredById) => getDisplayValueById(authorizedByList || [], referredById);

  // Handlers
  const handleCheckboxChange = (e) => {
    const checked = e.target.checked;
    setIsChecked(checked);
    onChange?.({ target: { name: "concessionWrittenOnApplication", type: "checkbox", checked } });
  };

  const handleFirstYearConcessionChange = (e) => {
    const { name, value } = e.target;
    // Remove any non-digit characters (allow only numbers)
    const digitsOnly = value.replace(/\D/g, "");
    
    // Create a filtered event with only numeric value
    const filteredEvent = {
      ...e,
      target: {
        ...e.target,
        name,
        value: digitsOnly,
      },
    };
    
    onChange?.(filteredEvent);
    const typeId = getConcessionTypeIdByLabel("1st year");
    if (typeId !== undefined) {
      onChange?.({ target: { name: "firstYearConcessionTypeId", value: typeId } });
    }
  };

  const handleSecondYearConcessionChange = (e) => {
    const { name, value } = e.target;
    // Remove any non-digit characters (allow only numbers)
    const digitsOnly = value.replace(/\D/g, "");
    
    // Create a filtered event with only numeric value
    const filteredEvent = {
      ...e,
      target: {
        ...e.target,
        name,
        value: digitsOnly,
      },
    };
    
    onChange?.(filteredEvent);
    const typeId = getConcessionTypeIdByLabel("2nd year");
    if (typeId !== undefined) {
      onChange?.({ target: { name: "secondYearConcessionTypeId", value: typeId } });
    }
  };

  const handleReferredByChange = (event) => {
    const selectedDisplayText = event?.target?.value || event;
    setSelectedReferredBy(selectedDisplayText);
    let referredById = null;
    const selectedItem = (authorizedByList || []).find((i) => i.displayText === selectedDisplayText);
    if (selectedItem) referredById = selectedItem.id;
    else if (typeof selectedDisplayText === 'string' && selectedDisplayText.includes(' - ')) {
      const parts = selectedDisplayText.split(' - ');
      if (parts.length >= 2) referredById = parts[parts.length - 1].trim();
    }
    onChange?.({ target: { name: "referredBy", value: referredById || selectedDisplayText } });
  };

  const handleAuthorizedByChange = (event) => {
    const selectedDisplayText = event?.target?.value || event;
    setSelectedAuthorizedBy(selectedDisplayText);
    let authorizedById = null;
    const selectedItem = (authorizedByList || []).find((i) => i.displayText === selectedDisplayText);
    if (selectedItem) authorizedById = selectedItem.id;
    else if (typeof selectedDisplayText === 'string' && selectedDisplayText.includes(' - ')) {
      const parts = selectedDisplayText.split(' - ');
      if (parts.length >= 2) authorizedById = parts[parts.length - 1].trim();
    }
    onChange?.({ target: { name: "authorizedBy", value: authorizedById || selectedDisplayText } });
  };

  const handleConcessionReferredByChange = (event) => {
    const value = event?.target?.value || event;
    setSelectedConcessionReferredBy(value);
    onChange?.({ target: { name: "concessionReferredBy", value } });
  };

  const handleConcessionReasonChange = (event) => {
    const selectedDisplayText = event?.target?.value || event;
    setSelectedConcessionReason(selectedDisplayText);
    let reasonId = null;
    const selectedItem = (concessionReasonList || []).find((i) => i.displayText === selectedDisplayText);
    if (selectedItem) reasonId = selectedItem.id;
    else if (typeof selectedDisplayText === 'string' && selectedDisplayText.includes(' - ')) {
      const parts = selectedDisplayText.split(' - ');
      if (parts.length >= 2) reasonId = parts[parts.length - 1].trim();
    }
    onChange?.({ target: { name: "concessionReason", value: reasonId || selectedDisplayText } });
  };

  // Seed selected display values if parent formData carries ids
  useEffect(() => {
    if (formData?.concessionReason && (concessionReasonList?.length || 0) > 0) {
      const display = getConcessionReasonDisplayValue(formData.concessionReason);
      if (display && display !== selectedConcessionReason) setSelectedConcessionReason(display);
    }
    if (formData?.authorizedBy && (authorizedByList?.length || 0) > 0) {
      const display = getAuthorizedByDisplayValue(formData.authorizedBy);
      if (display && display !== selectedAuthorizedBy) setSelectedAuthorizedBy(display);
    }
    if (formData?.referredBy && (authorizedByList?.length || 0) > 0) {
      const display = getReferredByDisplayValue(formData.referredBy);
      if (display && display !== selectedReferredBy) setSelectedReferredBy(display);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData?.concessionReason, formData?.authorizedBy, formData?.referredBy, concessionReasonList, authorizedByList]);

  // Auto-populate from overviewData
  useEffect(() => {
    console.log("[Concession AutoPopulate] effect running");
    console.log("overviewData:", overviewData);
    console.log("loading:", loading, "reasonLoading:", reasonLoading);
    console.log("authorizedByList:", authorizedByList);
    console.log("concessionReasonList:", concessionReasonList);
    console.log("formData before:", formData);

    if (!overviewData || !onChange) return;
    if (loading || reasonLoading) return;

    const concessions = normalizeConcessionsFromOverview(overviewData);
    console.log("normalized concessions:", concessions);

    // Always prefer overview fields for auto-population
    const hasOverviewConcession = isValidValue(overviewData.concessionAmount) || isValidValue(overviewData.concessionReferredBy) || isValidValue(overviewData.reason);
    if (hasOverviewConcession) {
      if (!formData?.concessionWrittenOnApplication) {
        setIsChecked(true);
        onChange({ target: { name: "concessionWrittenOnApplication", type: "checkbox", checked: true } });
      }
      if (!formData?.concessionAmount && isValidValue(overviewData.concessionAmount)) {
        onChange({ target: { name: 'concessionAmount', value: overviewData.concessionAmount } });
      }
      if (!formData?.concessionReferredBy && isValidValue(overviewData.concessionReferredBy)) {
        onChange({ target: { name: 'concessionReferredBy', value: overviewData.concessionReferredBy } });
      }
      if (!formData?.reason && isValidValue(overviewData.reason)) {
        onChange({ target: { name: 'reason', value: overviewData.reason } });
      }
    } else if (concessions.length > 0) {
      // Always populate 1st and 2nd year concessions from concessions array (regardless of pro concession)
      const firstYear = findConcessionByType(concessions, ["1st", "first", "1st year", "first year"]);
      const secondYear = findConcessionByType(concessions, ["2nd", "second", "2nd year", "second year"]);
      const thirdYear = findConcessionByType(concessions, ["3rd", "third", "3rd year", "third year"]);
      
      // Use 2nd year as primary if it exists, otherwise use first year or first concession
      const primary = secondYear || firstYear || thirdYear || concessions[0];

      // Auto-populate 1st year concession
      if (firstYear && isValidValue(firstYear.amount) && !formData?.firstYearConcession) {
        onChange({ target: { name: "firstYearConcession", value: firstYear.amount } });
      }
      
      // Auto-populate 2nd year concession - use the amount field from the 2nd year concession object
      if (secondYear && isValidValue(secondYear.amount) && !formData?.secondYearConcession) {
        // Convert to string and ensure it's the numeric value from amount field
        const secondYearAmount = String(secondYear.amount).replace(/\D/g, "");
        if (secondYearAmount) {
          onChange({ target: { name: "secondYearConcession", value: secondYearAmount } });
        }
      }
      
      // Auto-populate description from primary concession (2nd year if available)
      const descriptionValue = primary?.comments || primary?.description;
      if (descriptionValue && isValidValue(descriptionValue) && !formData?.description) {
        onChange({ target: { name: "description", value: descriptionValue } });
      }
      
      // Auto-populate Referred By - check multiple field names from API
      const referredByName = primary?.givenByName || primary?.concReferedByName || primary?.referredBy || primary?.givenBy;
      if (referredByName && !formData?.referredBy && (authorizedByList?.length || 0) > 0) {
        const match = findOptionByFuzzyText(authorizedByList, referredByName);
        if (match) {
          setSelectedReferredBy(match.displayText);
          onChange({ target: { name: "referredBy", value: match.id } });
          // Also set referredById if available
          if (match.id) {
            onChange({ target: { name: "referredById", value: match.id } });
          }
        } else {
          // Try to find by ID if we have givenById
          const givenById = primary?.givenById || primary?.concReferedBy;
          if (givenById) {
            const byIdMatch = authorizedByList.find(emp => String(emp.id) === String(givenById));
            if (byIdMatch) {
              setSelectedReferredBy(byIdMatch.displayText);
              onChange({ target: { name: "referredBy", value: byIdMatch.id } });
              onChange({ target: { name: "referredById", value: byIdMatch.id } });
            } else {
              // Fallback: set the name directly
              setSelectedReferredBy(referredByName);
              onChange({ target: { name: "referredBy", value: referredByName } });
            }
          } else {
            setSelectedReferredBy(referredByName);
            onChange({ target: { name: "referredBy", value: referredByName } });
          }
        }
      }
      
      // Auto-populate Authorized By - check multiple field names from API
      const authorizedByName = primary?.authorizedByName || primary?.authorizedBy;
      if (authorizedByName && !formData?.authorizedBy && (authorizedByList?.length || 0) > 0) {
        const match = findOptionByFuzzyText(authorizedByList, authorizedByName);
        if (match) {
          setSelectedAuthorizedBy(match.displayText);
          onChange({ target: { name: "authorizedBy", value: match.id } });
          // Also set authorizedById if available
          if (match.id) {
            onChange({ target: { name: "authorizedById", value: match.id } });
          }
        } else {
          // Try to find by ID if we have authorizedById
          const authorizedById = primary?.authorizedById;
          if (authorizedById) {
            const byIdMatch = authorizedByList.find(emp => String(emp.id) === String(authorizedById));
            if (byIdMatch) {
              setSelectedAuthorizedBy(byIdMatch.displayText);
              onChange({ target: { name: "authorizedBy", value: byIdMatch.id } });
              onChange({ target: { name: "authorizedById", value: byIdMatch.id } });
            } else {
              // Fallback: set the name directly
              setSelectedAuthorizedBy(authorizedByName);
              onChange({ target: { name: "authorizedBy", value: authorizedByName } });
            }
          } else {
            setSelectedAuthorizedBy(authorizedByName);
            onChange({ target: { name: "authorizedBy", value: authorizedByName } });
          }
        }
      }
      
      // Auto-populate Concession Referred By (for pro concession section)
      if (referredByName && !formData?.concessionReferredBy) {
        setSelectedConcessionReferredBy(referredByName);
        onChange({ target: { name: "concessionReferredBy", value: referredByName } });
      }
      
      // Auto-populate Concession Reason - check multiple field names from API
      const reasonName = primary?.reasonName || primary?.reason;
      if (reasonName && !formData?.concessionReason && (concessionReasonList?.length || 0) > 0) {
        const match = findOptionByFuzzyText(concessionReasonList, reasonName);
        if (match) {
          setSelectedConcessionReason(match.displayText);
          onChange({ target: { name: "concessionReason", value: match.id } });
          // Also set concessionReasonId if available
          if (match.id) {
            onChange({ target: { name: "concessionReasonId", value: match.id } });
          }
        } else {
          // Try to find by ID if we have reasonId
          const reasonId = primary?.reasonId;
          if (reasonId) {
            const byIdMatch = concessionReasonList.find(reason => String(reason.id) === String(reasonId));
            if (byIdMatch) {
              setSelectedConcessionReason(byIdMatch.displayText);
              onChange({ target: { name: "concessionReason", value: byIdMatch.id } });
              onChange({ target: { name: "concessionReasonId", value: byIdMatch.id } });
            } else {
              // Fallback: set the name directly
              setSelectedConcessionReason(reasonName);
              onChange({ target: { name: "concessionReason", value: reasonName } });
            }
          } else {
            setSelectedConcessionReason(reasonName);
            onChange({ target: { name: "concessionReason", value: reasonName } });
          }
        }
      }
      
      // Check for pro concession fields in concessions array (separate from regular concessions)
      // Pro concession is the "Concession Written on Application" - should only use proAmount, not regular amount
      const proConcession = concessions.find(concession => 
        concession?.proAmount !== null && 
        concession?.proAmount !== undefined && 
        concession?.proAmount !== 0
      );
      
      if (proConcession) {
        // Auto-populate from pro concession fields ONLY
        if (!formData?.concessionWrittenOnApplication) {
          setIsChecked(true);
          onChange({ target: { name: "concessionWrittenOnApplication", type: "checkbox", checked: true } });
        }
        // Only populate concessionAmount from proAmount - this is the "Concession Written on Application" amount
        if (!formData?.concessionAmount && proConcession.proAmount) {
          const proAmountValue = String(proConcession.proAmount).replace(/\D/g, "");
          if (proAmountValue) {
            onChange({ target: { name: 'concessionAmount', value: proAmountValue } });
          }
        }
        if (!formData?.concessionReferredBy && (proConcession.proGivenByName || proConcession.proGivenById)) {
          // Prefer name, fallback to ID
          const referredByValue = proConcession.proGivenByName || String(proConcession.proGivenById);
          onChange({ target: { name: 'concessionReferredBy', value: referredByValue } });
          // Also set proConcessionGivenById if we have the ID
          if (proConcession.proGivenById) {
            onChange({ target: { name: 'proConcessionGivenById', value: proConcession.proGivenById } });
          }
        }
        if (!formData?.reason && proConcession.proReason) {
          onChange({ target: { name: 'reason', value: String(proConcession.proReason) } });
          // Also set proConcessionReasonId if proReason is an ID
          if (proConcession.proReason) {
            onChange({ target: { name: 'proConcessionReasonId', value: String(proConcession.proReason) } });
          }
        }
      }
      // DO NOT use primary.amount as fallback for concessionAmount
      // concessionAmount should ONLY come from proConcession.proAmount
      // The 2nd year concession amount is separate and comes from secondYear.amount
      
      if (primary && isValidValue(primary.reasonName) && !formData?.reason) {
        onChange({ target: { name: "reason", value: primary.reasonName } });
      }
    }
    console.log("formData after:", formData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [overviewData, authorizedByList, concessionReasonList, loading, reasonLoading]);

  const hasValidConcessionData = () => true; // keep previous behavior

  return {
    // options
    dropdownOptions,
    concessionReasonOptions,

    // selected display values
    selectedReferredBy,
    selectedAuthorizedBy,
    selectedConcessionReferredBy,
    selectedConcessionReason,

    // handlers
    handleCheckboxChange,
    handleFirstYearConcessionChange,
    handleSecondYearConcessionChange,
    handleReferredByChange,
    handleAuthorizedByChange,
    handleConcessionReferredByChange,
    handleConcessionReasonChange,

    // display getters (for controlled value fallbacks)
    getReferredByDisplayValue,
    getAuthorizedByDisplayValue,
    getConcessionReasonDisplayValue,

    // checkbox state
    isChecked,
    setIsChecked,

    // misc
    hasValidConcessionData,
    getConcessionTypeIdByLabel, // Export for use in parent component
  };
}
