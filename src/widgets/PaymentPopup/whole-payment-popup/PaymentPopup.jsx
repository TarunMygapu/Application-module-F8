// import React, { useState, useEffect } from "react";
// import styles from "./PaymentPopup.module.css";
// import PopupHeader from "../popup-headerpart/PopupHeader";
// import PopupNavTabs from "../popup-navtabs/PopupNavTabs";
// import CashForms from "../popup-formspart/CashForms";
// import DDForms from "../popup-formspart/DDForms";
// import ChequeForms from "../popup-formspart/ChequeForms";
// import CardForms from "../popup-formspart/CardForms";
// import Button from "../../Button/Button";
// import { submitSchoolApplicationSale, mapFormDataToPayload, submitSchoolApplicationSaleCreate, mapSchoolApplicationSaleToPayload } from "../../../hooks/school-apis/SchoolSubmissionApi";
// import { submitCollegeApplicationConfirmation, mapCollegeFormDataToPayload, submitCollegeFastSale, mapCollegeFastSaleToPayload, submitCollegeApplicationSaleComplete, mapCollegeApplicationSaleCompleteToPayload } from "../../../hooks/college-apis/CollegeSubmissionApi";
// import { getCurrentDate } from "../../../utils/getCurrentDate";

// const PaymentPopup = ({
//   onClose,
//   title,
//   formData: schoolFormData,
//   siblings,
//   detailsObject,
//   type = "school", // "school" or "college"
//   collegeFormData, // For college: concession form data
//   collegeAcademicFormData, // For college: academic form data (orientation info)
//   saleType = "regular", // "regular" or "fast"
//   isConfirmation = false, // true for confirmation flow, false for sale flow
//   onSuccess // Callback function when submission is successful
// }) => {
//   // Determine button text based on sale type, form type, and confirmation status
//   const getButtonText = () => {
//     if (saleType === "fast") {
//       // For college fast sale, show "Finish Fast Sale"
//       if (type === "college") {
//         return "Finish Fast Sale";
//       }
//       // School fast sale removed - this should not happen
//       return "Finish Sale";
//     }
//     // For regular sale/confirmation
//     if (isConfirmation) {
//       // For confirmation flows
//       if (type === "school") {
//         return "Finish Sale & Confirmation";
//       }
//       if (type === "college") {
//         return "Finish College Confirmation";
//       }
//     }
//     // For regular college application sale, show "Finish College Sale"
//     if (type === "college" && saleType === "regular") {
//       return "Finish College Sale";
//     }
//     // For regular sale - school shows "Finish Sale"
//     return "Finish Sale";
//   };

//   const buttonText = getButtonText();
//   const [activeTab, setActiveTab] = useState("cash");
//   const [paymentFormData, setPaymentFormData] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitError, setSubmitError] = useState(null);
//   const [submitSuccess, setSubmitSuccess] = useState(false);

//   // Set current date when component mounts
//   useEffect(() => {
//     const currentDate = getCurrentDate();
//     setPaymentFormData((prev) => ({
//       ...prev,
//       paymentDate: currentDate
//     }));
//   }, []);

//   const handleTabChange = (tabId) => {
//     setActiveTab(tabId);
//   };

//   const handleFormChange = (e) => {
//     const { name, value } = e.target;
//     setPaymentFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleFinishSale = async () => {
//     try {
//       setIsSubmitting(true);
//       setSubmitError(null);
//       setSubmitSuccess(false);

//       let payload;
//       let response;

//       if (type === "college") {
//         // Check if it's confirmation first, then fast sale, then regular sale (application sale)
//         if (isConfirmation) {
//           // Map college confirmation form data to API payload
//           console.log('🔍 ===== COLLEGE CONFIRMATION DATA BEFORE MAPPING (PaymentPopup) =====');
//           console.log('collegeFormData:', collegeFormData);
//           console.log('collegeAcademicFormData:', collegeAcademicFormData);
//           console.log('paymentFormData:', paymentFormData);
//           console.log('detailsObject:', detailsObject);
//           console.log('activeTab:', activeTab);
//           console.log('==============================================================');

//           payload = mapCollegeFormDataToPayload(
//             collegeFormData || {},
//             collegeAcademicFormData || {},
//             paymentFormData,
//             detailsObject || {},
//             activeTab
//           );

//           // Log the complete payload object to console in a readable format
//           console.log("===========================================");
//           console.log("📤 SUBMITTING COLLEGE CONFIRMATION PAYLOAD TO BACKEND");
//           console.log("===========================================");
//           console.log("📋 Complete Payload Object:");
//           console.log(payload);
//           console.log("===========================================");
//           console.log("📄 Payload as JSON (formatted):");
//           console.log(JSON.stringify(payload, null, 2));
//           console.log("===========================================");
//           console.log("📊 Payload Summary:");
//           console.log("  - studAdmsNo:", payload.studAdmsNo);
//           console.log("  - academicYearId:", payload.academicYearId);
//           console.log("  - joiningClassId:", payload.joiningClassId);
//           console.log("  - branchId:", payload.branchId);
//           console.log("  - studentTypeId:", payload.studentTypeId);
//           console.log("  - cityId:", payload.cityId);
//           console.log("  - courseNameId:", payload.courseNameId);
//           console.log("  - Concessions count:", payload.concessions?.length || 0);
//           console.log("  - Payment Mode ID:", payload.paymentDetails?.paymentModeId);
//           console.log("  - Payment Amount:", payload.paymentDetails?.amount);
//           console.log("===========================================");

//           // Submit to college confirmation API
//           response = await submitCollegeApplicationConfirmation(payload);
//         } else if (saleType === "fast") {
//           // Map college fast sale form data to API payload
//           console.log('🔍 ===== COLLEGE FAST SALE DATA BEFORE MAPPING (PaymentPopup) =====');
//           console.log('collegeFormData (full form):', collegeFormData);
//           console.log('paymentFormData:', paymentFormData);
//           console.log('detailsObject:', detailsObject);
//           console.log('activeTab:', activeTab);
//           console.log('==============================================================');

//           payload = mapCollegeFastSaleToPayload(
//             collegeFormData || {},
//             paymentFormData,
//             detailsObject || {},
//             activeTab
//           );

//           // Log the complete payload object to console in a readable format
//           console.log("===========================================");
//           console.log("📤 SUBMITTING COLLEGE FAST SALE PAYLOAD TO BACKEND");
//           console.log("===========================================");
//           console.log("📋 Complete Payload Object:");
//           console.log(payload);
//           console.log("===========================================");
//           console.log("📄 Payload as JSON (formatted):");
//           console.log(JSON.stringify(payload, null, 2));
//           console.log("===========================================");
//           console.log("📊 Payload Summary:");
//           console.log("  - studAdmsNo:", payload.studAdmsNo);
//           console.log("  - firstName:", payload.firstName);
//           console.log("  - lastName:", payload.lastName);
//           console.log("  - genderId:", payload.genderId);
//           console.log("  - academicYearId:", payload.academicYearId);
//           console.log("  - branchId:", payload.branchId);
//           console.log("  - classId:", payload.classId);
//           console.log("  - orientationId:", payload.orientationId);
//           console.log("  - studentTypeId:", payload.studentTypeId);
//           console.log("  - Payment Mode ID:", payload.paymentDetails?.paymentModeId);
//           console.log("  - Payment Amount:", payload.paymentDetails?.amount);
//           console.log("===========================================");

//           // Submit to college fast sale API
//           console.log("📤 Using college fast sale endpoint: /student_fast_sale/fast-sale");
//           response = await submitCollegeFastSale(payload);
//         } else if (saleType === "regular") {
//           // Map college application sale complete form data to API payload
//           console.log('🔍 ===== COLLEGE APPLICATION SALE COMPLETE DATA BEFORE MAPPING (PaymentPopup) =====');
//           console.log('collegeFormData (full form):', collegeFormData);
//           console.log('paymentFormData:', paymentFormData);
//           console.log('detailsObject:', detailsObject);
//           console.log('activeTab:', activeTab);
//           console.log('==============================================================');

//           payload = mapCollegeApplicationSaleCompleteToPayload(
//             collegeFormData || {},
//             paymentFormData,
//             detailsObject || {},
//             activeTab
//           );

//           // Log the complete payload object to console in a readable format
//           console.log("===========================================");
//           console.log("📤 SUBMITTING COLLEGE APPLICATION SALE COMPLETE PAYLOAD TO BACKEND");
//           console.log("===========================================");
//           console.log("📋 Complete Payload Object:");
//           console.log(payload);
//           console.log("===========================================");
//           console.log("📄 Payload as JSON (formatted):");
//           console.log(JSON.stringify(payload, null, 2));
//           console.log("===========================================");
//           console.log("📊 Payload Summary:");
//           console.log("  - studAdmsNo:", payload.studAdmsNo);
//           console.log("  - firstName:", payload.firstName);
//           console.log("  - lastName:", payload.lastName);
//           console.log("  - genderId:", payload.genderId);
//           console.log("  - appTypeId:", payload.appTypeId);
//           console.log("  - quotaId:", payload.quotaId);
//           console.log("  - academicYearId:", payload.academicYearId);
//           console.log("  - branchId:", payload.branchId);
//           console.log("  - classId:", payload.classId);
//           console.log("  - orientationId:", payload.orientationId);
//           console.log("  - studentTypeId:", payload.studentTypeId);
//           console.log("  - Siblings count:", payload.siblings?.length || 0);
//           console.log("  - Concessions count:", payload.concessions?.length || 0);
//           console.log("  - Payment Mode ID:", payload.paymentDetails?.paymentModeId);
//           console.log("  - Payment Amount:", payload.paymentDetails?.amount);
//           console.log("===========================================");

//           // Submit to college application sale complete API
//           console.log("📤 Using college application sale complete endpoint: /student_fast_sale/college-application-sale");
//           response = await submitCollegeApplicationSaleComplete(payload);
//         }
//       } else {
//         // School fast sale has been removed - only handle regular sale/confirmation
//         if (saleType === "fast" && type === "school") {
//           throw new Error("School fast sale is no longer supported. Please use regular sale or confirmation.");
//         }

//         // Check if it's confirmation or sale
//         if (isConfirmation) {
//             // Map school confirmation form data to confirmation API payload (with parents, siblings, languages, concessions)
//             console.log('🔍 ===== SCHOOL CONFIRMATION DATA BEFORE MAPPING (PaymentPopup) =====');
//             console.log('schoolFormData (full form):', schoolFormData);
//             console.log('siblings:', siblings);
//             console.log('paymentFormData:', paymentFormData);
//             console.log('detailsObject:', detailsObject);
//             console.log('activeTab:', activeTab);
//             console.log('==============================================================');

//             payload = mapFormDataToPayload(
//               schoolFormData || {},
//               siblings || [],
//               paymentFormData,
//               detailsObject || {},
//               activeTab
//             );

//             // Log the complete payload object to console in a readable format
//             console.log("===========================================");
//             console.log("📤 SUBMITTING SCHOOL CONFIRMATION PAYLOAD TO BACKEND");
//             console.log("===========================================");
//             console.log("📋 Complete Payload Object:");
//             console.log(payload);
//             console.log("===========================================");
//             console.log("📄 Payload as JSON (formatted):");
//             console.log(JSON.stringify(payload, null, 2));
//             console.log("===========================================");
//             console.log("📊 Payload Summary:");
//             console.log("  - studAdmsNo:", payload.studAdmsNo);
//             console.log("  - appConfDate:", payload.appConfDate);
//             console.log("  - orientationId:", payload.orientationId);
//             console.log("  - Parents count:", payload.parents?.length || 0);
//             console.log("  - Siblings count:", payload.siblings?.length || 0);
//             console.log("  - Languages count:", payload.languages?.length || 0);
//             console.log("  - Concessions count:", payload.concessions?.length || 0);
//             console.log("  - Payment Mode ID:", payload.paymentDetails?.paymentModeId);
//             console.log("  - Payment Amount:", payload.paymentDetails?.amount);
//             console.log("===========================================");

//             // Submit to school confirmation API
//             console.log("📤 Using school confirmation endpoint: /application-confirmation/confirm-school");
//             response = await submitSchoolApplicationSale(payload);
//           } else {
//             // Map school form data to create API payload (simpler structure)
//             console.log('🔍 ===== SCHOOL APPLICATION SALE DATA BEFORE MAPPING (PaymentPopup) =====');
//             console.log('schoolFormData (full form):', schoolFormData);
//             console.log('schoolFormData keys:', Object.keys(schoolFormData || {}));
//             console.log('Personal Info:', {
//               firstName: schoolFormData?.firstName,
//               lastName: schoolFormData?.surName,
//               gender: schoolFormData?.gender,
//               aaparNo: schoolFormData?.aaparNo,
//               dob: schoolFormData?.dob,
//               aadharCardNo: schoolFormData?.aadharCardNo,
//             });
//             console.log('Orientation Info:', {
//               academicYearId: schoolFormData?.academicYearId,
//               branchId: schoolFormData?.branchId,
//               campusId: schoolFormData?.campusId,
//               classId: schoolFormData?.classId,
//               joiningClassId: schoolFormData?.joiningClassId,
//               orientationId: schoolFormData?.orientationId,
//               studentTypeId: schoolFormData?.studentTypeId,
//               joiningClass: schoolFormData?.joiningClass,
//               orientationName: schoolFormData?.orientationName,
//               studentType: schoolFormData?.studentType,
//             });
//             console.log('Parent Info:', {
//               fatherName: schoolFormData?.fatherName,
//               fatherMobile: schoolFormData?.fatherMobile,
//             });
//             console.log('Address Info:', {
//               doorNo: schoolFormData?.doorNo,
//               streetName: schoolFormData?.streetName,
//               cityId: schoolFormData?.cityId,
//               stateId: schoolFormData?.stateId,
//               districtId: schoolFormData?.districtId,
//               pincode: schoolFormData?.pincode,
//             });
//             console.log('paymentFormData:', paymentFormData);
//             console.log('detailsObject:', detailsObject);
//             console.log('activeTab:', activeTab);
//             console.log('==============================================================');

//             payload = mapSchoolApplicationSaleToPayload(
//               schoolFormData || {},
//               paymentFormData,
//               detailsObject || {},
//               activeTab
//             );

//             // Log the complete payload object to console in a readable format
//             console.log("===========================================");
//             console.log("📤 SUBMITTING SCHOOL APPLICATION SALE CREATE PAYLOAD TO BACKEND");
//             console.log("===========================================");
//             console.log("📋 Complete Payload Object:");
//             console.log(payload);
//             console.log("===========================================");
//             console.log("📄 Payload as JSON (formatted):");
//             console.log(JSON.stringify(payload, null, 2));
//             console.log("===========================================");
//             console.log("📊 Payload Summary:");
//             console.log("  - studAdmsNo:", payload.studAdmsNo);
//             console.log("  - firstName:", payload.firstName);
//             console.log("  - lastName:", payload.lastName);
//             console.log("  - genderId:", payload.genderId);
//             console.log("  - academicYearId:", payload.academicYearId);
//             console.log("  - branchId:", payload.branchId);
//             console.log("  - classId:", payload.classId);
//             console.log("  - orientationId:", payload.orientationId);
//             console.log("  - Payment Mode ID:", payload.paymentDetails?.paymentModeId);
//             console.log("  - Payment Amount:", payload.paymentDetails?.amount);
//             console.log("===========================================");

//             // Submit to school sale create API
//             console.log("📤 Using school sale create endpoint: /student-admissions-sale/create");
//             response = await submitSchoolApplicationSaleCreate(payload);
//           }
//         }

//       console.log("✅ Submission successful:", response);
//       setSubmitSuccess(true);

//       // Call onSuccess callback if provided
//       console.log("🔍 Checking if onSuccess callback exists:", !!onSuccess);
//       if (onSuccess) {
//         console.log("📞 Calling onSuccess callback with response and detailsObject");
//         onSuccess(response, detailsObject);
//         console.log("✅ onSuccess callback executed");
//       } else {
//         console.log("⚠️ No onSuccess callback provided, using fallback close");
//         // Fallback: Close popup after a short delay if no onSuccess callback
//         setTimeout(() => {
//           onClose();
//         }, 2000);
//       }
//     } catch (error) {
//       console.error("❌ Error submitting form:", error);
//       setSubmitError(error.response?.data?.message || error.message || "Failed to submit form. Please try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleCashFinishSale = () => {
//     handleFinishSale();
//   };

//   const handleCardFinishSale = () => {
//     handleFinishSale();
//   };

//   return (
//     <div className={styles.overlay}>
//       <div className={styles.modal}>
//         <PopupHeader step={3} onClose={onClose} title={title} />

//         <PopupNavTabs onChange={handleTabChange} />

//         <div className={styles.modalContent}>
//           {submitError && (
//             <div style={{ padding: '10px', margin: '10px', backgroundColor: '#fee', color: '#c00', borderRadius: '4px' }}>
//               Error: {submitError}
//             </div>
//           )}
//           {submitSuccess && (
//             <div style={{ padding: '10px', margin: '10px', backgroundColor: '#efe', color: '#0c0', borderRadius: '4px' }}>
//               Success! Form submitted successfully.
//             </div>
//           )}

//           {activeTab === "cash" && (
//             <CashForms formData={paymentFormData} onChange={handleFormChange} />
//           )}

//           {activeTab === "dd" && (
//             <>
//               <DDForms formData={paymentFormData} onChange={handleFormChange} />
//               <div className={styles.footer}>
//                 <Button
//                   buttonname={isSubmitting ? "Submitting..." : buttonText}
//                   righticon={
//                     <svg
//                       width="20"
//                       height="20"
//                       viewBox="0 0 20 20"
//                       fill="none"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <path
//                         d="M4 10H16M16 10L10 4M16 10L10 16"
//                         stroke="currentColor"
//                         strokeWidth="2"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                       />
//                     </svg>
//                   }
//                   variant="primary"
//                   onClick={handleFinishSale}
//                   disabled={isSubmitting}
//                 />
//               </div>
//             </>
//           )}

//           {activeTab === "cheque" && (
//             <>
//               <ChequeForms formData={paymentFormData} onChange={handleFormChange} />
//               <div className={styles.footer}>
//                 <Button
//                   buttonname={isSubmitting ? "Submitting..." : buttonText}
//                   righticon={
//                     <svg
//                       width="20"
//                       height="20"
//                       viewBox="0 0 20 20"
//                       fill="none"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <path
//                         d="M4 10H16M16 10L10 4M16 10L10 16"
//                         stroke="currentColor"
//                         strokeWidth="2"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                       />
//                     </svg>
//                   }
//                   variant="primary"
//                   onClick={handleFinishSale}
//                   disabled={isSubmitting}
//                 />
//               </div>
//             </>
//           )}

//           {activeTab === "card" && (
//             <CardForms formData={paymentFormData} onChange={handleFormChange} />
//           )}
//         </div>

//         {activeTab === "cash" && (
//           <div className={styles.footer}>
//             <Button
//               buttonname={isSubmitting ? "Submitting..." : buttonText}
//               righticon={
//                 <svg
//                   width="20"
//                   height="20"
//                   viewBox="0 0 20 20"
//                   fill="none"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     d="M4 10H16M16 10L10 4M16 10L10 16"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   />
//                 </svg>
//               }
//               variant="primary"
//               onClick={handleCashFinishSale}
//               disabled={isSubmitting}
//             />
//           </div>
//         )}

//         {activeTab === "card" && (
//           <div className={styles.footer}>
//             <Button
//               buttonname={isSubmitting ? "Submitting..." : buttonText}
//               righticon={
//                 <svg
//                   width="20"
//                   height="20"
//                   viewBox="0 0 20 20"
//                   fill="none"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     d="M4 10H16M16 10L10 4M16 10L10 16"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   />
//                 </svg>
//               }
//               variant="primary"
//               onClick={handleCardFinishSale}
//               disabled={isSubmitting}
//             />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PaymentPopup;


















import React, { useState, useEffect } from "react";
import styles from "./PaymentPopup.module.css";
import PopupHeader from "../popup-headerpart/PopupHeader";
import PopupNavTabs from "../popup-navtabs/PopupNavTabs";
import CashForms from "../popup-formspart/CashForms";
import DDForms from "../popup-formspart/DDForms";
import ChequeForms from "../popup-formspart/ChequeForms";
import CardForms from "../popup-formspart/CardForms";
import Button from "../../Button/Button";
import { submitSchoolApplicationSale, mapFormDataToPayload, submitSchoolApplicationSaleCreate, mapSchoolApplicationSaleToPayload } from "../../../queries/applicationqueries/school-apis/SchoolSubmissionApi";
import { submitCollegeApplicationConfirmation, mapCollegeFormDataToPayload, submitCollegeFastSale, mapCollegeFastSaleToPayload, submitCollegeApplicationSaleComplete, mapCollegeApplicationSaleCompleteToPayload } from "../../../queries/applicationqueries/college-apis/CollegeSubmissionApi";
import { getCurrentDate } from "../../../utils/getCurrentDate";

// Helper function to get current date in YYYY-MM-DD format for HTML date inputs
const getCurrentDateForInput = () => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();
  return `${year}-${month}-${day}`; // Format: YYYY-MM-DD for HTML date input
};

const PaymentPopup = ({
  onClose,
  title,
  formData: schoolFormData,
  siblings,
  detailsObject,
  applicationDetailsData, // Application details from ApplicationSaleDetails (contains appFee and amount)
  type = "school", // "school" or "college"
  collegeFormData, // For college: concession form data
  collegeAcademicFormData, // For college: academic form data (orientation info)
  saleType = "regular", // "regular" or "fast"
  isConfirmation = false, // true for confirmation flow, false for sale flow
  isSaleAndConfirmFlow = false, // true when coming from "Sale & Confirm" button, false when from table "Confirm"
  onSuccess, // Callback function when submission is successful
  amountReadOnly = false // When true, amount field is read-only (for College Fast Sale)
}) => {
  // Debug: Log all props when component mounts or updates
  console.log("🎯 ===== PAYMENT POPUP COMPONENT RENDERED =====");
  console.log("Props received:", {
    title,
    type,
    saleType,
    isConfirmation,
    applicationDetailsData,
    detailsObject,
    hasSchoolFormData: !!schoolFormData,
    hasCollegeFormData: !!collegeFormData
  });
  console.log("==============================================");

  // Determine button text based on sale type, form type, and confirmation status
  const getButtonText = () => {
    if (saleType === "fast") {
      // For college fast sale, show "Finish Fast Sale"
      if (type === "college") {
        return "Finish Fast Sale";
      }
      // School fast sale removed - this should not happen
      return "Finish Sale";
    }
    // For regular sale/confirmation
    if (isConfirmation) {
      // For confirmation flows
      if (type === "school") {
        // If coming from "Sale & Confirm" button, show "Finish Sale & Confirmation"
        // If coming from table "Confirm" button, show "Finish Confirmation"
        return isSaleAndConfirmFlow ? "Finish Sale & Confirmation" : "Finish Confirmation";
      }
      if (type === "college") {
        return "Finish Confirmation";
      }
    }
    // For regular college application sale, show "Finish Sale"
    if (type === "college" && saleType === "regular") {
      return "Finish Sale";
    }
    // For regular sale - school shows "Finish Sale"
    return "Finish Sale";
  };

  const buttonText = getButtonText();
  const [activeTab, setActiveTab] = useState("cash");
  const [paymentFormData, setPaymentFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [minimumAmount, setMinimumAmount] = useState(0); // Store the auto-populated minimum amount

  // Set current date when component mounts - for all payment modes
  useEffect(() => {
    const currentDate = getCurrentDate(); // For display (dd/mm/yyyy)
    const currentDateForInput = getCurrentDateForInput(); // For HTML date inputs (YYYY-MM-DD)
    setPaymentFormData((prev) => ({
      ...prev,
      paymentDate: currentDate, // Cash (display format)
      dd_paymentDate: currentDateForInput, // DD (HTML date input format)
      cheque_paymentDate: currentDateForInput, // Cheque (HTML date input format)
      card_paymentDate: currentDateForInput // Credit/Debit Card (HTML date input format)
    }));
  }, []);

  // Auto-populate payment date when switching between payment modes
  useEffect(() => {
    const currentDate = getCurrentDate(); // For display (dd/mm/yyyy)
    const currentDateForInput = getCurrentDateForInput(); // For HTML date inputs (YYYY-MM-DD)
    setPaymentFormData((prev) => {
      const updated = { ...prev };
      // Always set payment date for the currently active tab (auto-populate on tab switch)
      if (activeTab === "cash") {
        updated.paymentDate = currentDate; // Cash uses display format
      } else if (activeTab === "dd") {
        updated.dd_paymentDate = currentDateForInput; // DD uses HTML date input format
      } else if (activeTab === "cheque") {
        updated.cheque_paymentDate = currentDateForInput; // Cheque uses HTML date input format
      } else if (activeTab === "card") {
        updated.card_paymentDate = currentDateForInput; // Card uses HTML date input format
      }
      return updated;
    });
  }, [activeTab]);

  // Auto-populate amount field: appFee + amount (for both school and college)
  // Skip auto-population ONLY if application is already sold/confirmed (edit mode)
  useEffect(() => {
    console.log("🔍 ===== PAYMENT POPUP AUTO-POPULATION DEBUG =====");
    console.log("isConfirmation:", isConfirmation);
    console.log("applicationDetailsData:", applicationDetailsData);
    console.log("detailsObject:", detailsObject);
    console.log("type:", type);

    // Check if application is sold by checking status from multiple sources
    const status = detailsObject?.status ||
      detailsObject?.displayStatus ||
      schoolFormData?.status ||
      collegeFormData?.status ||
      applicationDetailsData?.status ||
      "";
    const statusLower = status.toLowerCase().trim();

    // Statuses that mean payment was already collected (should NOT auto-populate)
    // "not confirmed" means application is sold but not yet confirmed (payment already collected)
    const isSold = statusLower === "sold" ||
      statusLower === "confirmed" ||
      statusLower === "not confirmed" ||  // ← "not confirmed" means sold (payment collected)
      statusLower === "fast sold" ||
      statusLower === "fastsold" ||
      statusLower === "fast sale" ||
      statusLower === "fastsale" ||
      statusLower.includes("fast sold") ||
      statusLower.includes("fastsold");

    // Check if this is specifically a fast sale (payment already collected in fast sale)
    const isFastSale = statusLower === "fast sold" ||
      statusLower === "fastsold" ||
      statusLower === "fast sale" ||
      statusLower === "fastsale" ||
      statusLower.includes("fast sold") ||
      statusLower.includes("fastsold");

    // Statuses that mean payment is still pending (SHOULD auto-populate)
    // Note: "not confirmed" is NOT here because it means payment was already collected
    const isPaymentPending = statusLower === "payment pending" ||
      statusLower === "pending payment" ||
      statusLower === "pending";

    console.log("📊 Status check:", { status, statusLower, isSold, isFastSale, isPaymentPending, isConfirmation });

    // Skip auto-population if:
    // 1. Application is already sold/confirmed (payment already collected)
    // 2. AND payment is NOT pending
    // This applies to BOTH regular sale flows AND confirmation flows
    // If payment was already collected in fast sale, don't ask for payment again
    if (isSold && !isPaymentPending) {
      if (!isConfirmation) {
        // Regular sale flow: Skip auto-population if already fast sold (payment already collected)
        console.log("🚫 Skipping auto-population - Application is already fast sold (payment already collected) and this is a regular sale flow:", status);
        return;
      } else {
        // Confirmation flow: Skip auto-population if already sold/confirmed (payment already collected in fast sale)
        console.log("🚫 Skipping auto-population - Application is already fast sold/confirmed (payment already collected) and this is a confirmation flow:", status);
        console.log("   Payment was already collected during fast sale, no need to collect again in confirmation");
        console.log("   isFastSale:", isFastSale, "isSold:", isSold);
        return;
      }
    }

    // Additional check: If this is a confirmation flow and application was fast sold, skip auto-population
    // This is a safety check in case the status wasn't correctly identified above
    if (isConfirmation && isFastSale && !isPaymentPending) {
      console.log("🚫 Skipping auto-population - Additional check: Confirmation flow for fast sold application (payment already collected)");
      return;
    }

    // Log why we're continuing with auto-population
    if (isPaymentPending) {
      console.log("✅ Continuing auto-population - Payment is pending (status:", status, ")");
    } else if (isConfirmation && !isSold) {
      console.log("✅ Continuing auto-population - This is a combined Sale & Confirmation flow (status:", status, ")");
    } else if (!isConfirmation && !isSold) {
      console.log("✅ Continuing auto-population - This is a sale flow (application not yet sold)");
    }

    // Get appFee and amount from applicationDetailsData or detailsObject
    let appFee = 0;
    let amount = 0;
    let previouslySubmittedAmount = null;

    if (applicationDetailsData) {
      // Check for previously submitted amount (from fast sale) first
      previouslySubmittedAmount = applicationDetailsData.previouslySubmittedAmount || null;

      // Check both "appFee" and "applicationFee" field names
      appFee = parseFloat(applicationDetailsData.appFee || applicationDetailsData.applicationFee) || 0;
      amount = parseFloat(applicationDetailsData.amount) || 0;
      console.log("✅ Using applicationDetailsData - appFee:", appFee, "amount:", amount);
      console.log("   - Raw values: appFee field:", applicationDetailsData.appFee, "applicationFee field:", applicationDetailsData.applicationFee, "amount field:", applicationDetailsData.amount);
      console.log("   - Previously submitted amount:", previouslySubmittedAmount);
    } else if (detailsObject) {
      // Check both "appFee" and "applicationFee" field names
      appFee = parseFloat(detailsObject.appFee || detailsObject.applicationFee) || 0;
      amount = parseFloat(detailsObject.amount) || 0;
      console.log("✅ Using detailsObject - appFee:", appFee, "amount:", amount);
      console.log("   - Raw values: appFee field:", detailsObject.appFee, "applicationFee field:", detailsObject.applicationFee, "amount field:", detailsObject.amount);
    } else {
      console.log("❌ No data source found for appFee and amount");
    }

    // For regular sale flows, always calculate appFee + amount
    // For confirmation flows, use previously submitted amount if available (payment already collected)
    // Otherwise, calculate total as appFee + amount
    let totalAmount;

    if (isConfirmation && previouslySubmittedAmount) {
      // Confirmation flow: Use previously submitted amount (payment was already collected in fast sale)
      totalAmount = parseFloat(previouslySubmittedAmount);
      console.log("💰 Confirmation flow - Using previously submitted payment amount from fast sale:", totalAmount);
    } else {
      // Regular sale flow: Always calculate appFee + amount (don't use previously submitted amount)
      totalAmount = appFee + amount;
      if (previouslySubmittedAmount) {
        console.log("💰 Regular sale flow - Ignoring previously submitted amount, calculating appFee + amount");
        console.log("   - Previously submitted amount (ignored):", previouslySubmittedAmount);
        console.log("   - Calculated total (appFee + amount):", totalAmount);
      } else {
        console.log("💰 Total amount calculated (appFee + amount):", totalAmount);
      }
    }

    if (totalAmount > 0) {
      console.log("✅ Auto-populating amount in PaymentPopup:", {
        type,
        appFee,
        amount,
        totalAmount,
        source: applicationDetailsData ? 'applicationDetailsData' : 'detailsObject'
      });

      // Store the minimum amount (auto-populated value that user cannot go below)
      setMinimumAmount(totalAmount);
      console.log("✅ Minimum amount set to:", totalAmount);

      // Set amount for all payment types
      setPaymentFormData((prev) => ({
        ...prev,
        amount: totalAmount.toString(),
        card_amount: totalAmount.toString(),
        dd_amount: totalAmount.toString(),
        cheque_amount: totalAmount.toString()
      }));
      console.log("✅ Amount fields updated!");
    } else {
      console.log("❌ Total amount is 0 or less, not auto-populating");
    }
    console.log("================================================");
  }, [type, isConfirmation, applicationDetailsData, detailsObject, schoolFormData, collegeFormData]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setPaymentFormData((prev) => ({ ...prev, [name]: value }));

    // Validate receipt number as user types if it was already erroring
    if (["prePrinted", "dd_receiptNo", "cheque_receiptNo", "card_receiptNo"].includes(name)) {
      if (value.length === 9) {
        setFormErrors((prev) => {
          const updated = { ...prev };
          delete updated[name];
          return updated;
        });
      } else if (value.length > 0 && value.length !== 9) {
        setFormErrors((prev) => ({
          ...prev,
          [name]: "Pre Printed Receipt No must be exactly 9 digits"
        }));
      } else if (value.length === 0) {
        setFormErrors((prev) => ({
          ...prev,
          [name]: "Pre Printed Receipt No is required"
        }));
      }
    } else if (["amount", "dd_amount", "cheque_amount", "card_amount"].includes(name)) {
      // Validate amount fields - must not be less than auto-populated minimum
      const parsedAmount = parseFloat(value);
      if (value === "" || value === null || value === undefined) {
        setFormErrors((prev) => ({
          ...prev,
          [name]: "Amount is required"
        }));
      } else if (isNaN(parsedAmount) || parsedAmount < 0) {
        setFormErrors((prev) => ({
          ...prev,
          [name]: "Amount must be at least 0"
        }));
      } else if (minimumAmount > 0 && parsedAmount < minimumAmount) {
        setFormErrors((prev) => ({
          ...prev,
          [name]: `Amount cannot be less than ₹${minimumAmount}`
        }));
      } else {
        // Clear error if valid
        setFormErrors((prev) => {
          const updated = { ...prev };
          delete updated[name];
          return updated;
        });
      }
    } else {
      // Clear error for other fields
      if (formErrors[name]) {
        setFormErrors((prev) => {
          const updated = { ...prev };
          delete updated[name];
          return updated;
        });
      }
    }
  };

  const handleFinishSale = async () => {
    try {
      // Validate amount field first
      let amountFieldName = "";
      if (activeTab === "cash") amountFieldName = "amount";
      else if (activeTab === "dd") amountFieldName = "dd_amount";
      else if (activeTab === "cheque") amountFieldName = "cheque_amount";
      else if (activeTab === "card") amountFieldName = "card_amount";

      const amountValue = paymentFormData[amountFieldName];
      const parsedAmount = parseFloat(amountValue);

      // Amount must be entered (not empty) and must be at least 0
      if (amountValue === undefined || amountValue === null || amountValue === "" || String(amountValue).trim() === "") {
        const errorMsg = "Amount is required";
        setFormErrors({ [amountFieldName]: errorMsg });
        setSubmitError(errorMsg);
        return;
      }

      if (isNaN(parsedAmount) || parsedAmount < 0) {
        const errorMsg = "Amount must be at least 0";
        setFormErrors({ [amountFieldName]: errorMsg });
        setSubmitError(errorMsg);
        return;
      }

      // Check if entered amount is less than the auto-populated minimum amount
      if (minimumAmount > 0 && parsedAmount < minimumAmount) {
        const errorMsg = `Amount cannot be less than the auto-populated amount (₹${minimumAmount})`;
        setFormErrors({ [amountFieldName]: errorMsg });
        setSubmitError(errorMsg);
        return;
      }

      let receiptFieldName = "";
      if (activeTab === "cash") receiptFieldName = "prePrinted";
      else if (activeTab === "dd") receiptFieldName = "dd_receiptNo";
      else if (activeTab === "cheque") receiptFieldName = "cheque_receiptNo";
      else if (activeTab === "card") receiptFieldName = "card_receiptNo";

      const receiptValue = paymentFormData[receiptFieldName] || "";

      if (receiptValue.trim() === "") {
        const errorMsg = "Pre Printed Receipt No is required";
        setFormErrors({ [receiptFieldName]: errorMsg });
        setSubmitError(errorMsg);
        return;
      }

      if (receiptValue.length !== 9) {
        const errorMsg = "Pre Printed Receipt No must be exactly 9 digits";
        setFormErrors({ [receiptFieldName]: errorMsg });
        setSubmitError(errorMsg);
        return;
      }

      // Clear any existing errors before proceeding
      setFormErrors({});

      setIsSubmitting(true);
      setSubmitError(null);
      setSubmitSuccess(false);

      let payload;
      let response;

      if (type === "college") {
        // Check if it's confirmation first, then fast sale, then regular sale (application sale)
        if (isConfirmation) {
          // Map college confirmation form data to API payload
          console.log('🔍 ===== COLLEGE CONFIRMATION DATA BEFORE MAPPING (PaymentPopup) =====');
          console.log('collegeFormData:', collegeFormData);
          console.log('collegeAcademicFormData:', collegeAcademicFormData);
          console.log('paymentFormData:', paymentFormData);
          console.log('detailsObject:', detailsObject);
          console.log('activeTab:', activeTab);
          console.log('==============================================================');

          payload = mapCollegeFormDataToPayload(
            collegeFormData || {},
            collegeAcademicFormData || {},
            paymentFormData,
            detailsObject || {},
            activeTab
          );

          // Log the complete payload object to console in a readable format
          console.log("===========================================");
          console.log("📤 SUBMITTING COLLEGE CONFIRMATION PAYLOAD TO BACKEND");
          console.log("===========================================");
          console.log("📋 Complete Payload Object:");
          console.log(payload);
          console.log("===========================================");
          console.log("📄 Payload as JSON (formatted):");
          console.log(JSON.stringify(payload, null, 2));
          console.log("===========================================");
          console.log("📊 Payload Summary:");
          console.log("  - studAdmsNo:", payload.studAdmsNo);
          console.log("  - academicYearId:", payload.academicYearId);
          console.log("  - joiningClassId:", payload.joiningClassId);
          console.log("  - branchId:", payload.branchId);
          console.log("  - studentTypeId:", payload.studentTypeId);
          console.log("  - cityId:", payload.cityId);
          console.log("  - courseNameId:", payload.courseNameId);
          console.log("  - Concessions count:", payload.concessions?.length || 0);
          console.log("  - Payment Mode ID:", payload.paymentDetails?.paymentModeId);
          console.log("  - Payment Amount:", payload.paymentDetails?.amount);
          console.log("===========================================");

          // Submit to college confirmation API
          console.log("📤 Payload set to the College Sale API: ",payload);
          response = await submitCollegeApplicationConfirmation(payload);
        } else if (saleType === "fast") {
          // Map college fast sale form data to API payload
          console.log('🔍 ===== COLLEGE FAST SALE DATA BEFORE MAPPING (PaymentPopup) =====');
          console.log('collegeFormData (full form):', collegeFormData);
          console.log('paymentFormData:', paymentFormData);
          console.log('detailsObject:', detailsObject);
          console.log('activeTab:', activeTab);
          console.log('==============================================================');

          payload = mapCollegeFastSaleToPayload(
            collegeFormData || {},
            paymentFormData,
            detailsObject || {},
            activeTab
          );

          // Log the complete payload object to console in a readable format
          console.log("===========================================");
          console.log("📤 SUBMITTING COLLEGE FAST SALE PAYLOAD TO BACKEND");
          console.log("===========================================");
          console.log("📋 Complete Payload Object:");
          console.log(payload);
          console.log("===========================================");
          console.log("📄 Payload as JSON (formatted):");
          console.log(JSON.stringify(payload, null, 2));
          console.log("===========================================");
          console.log("📊 Payload Summary:");
          console.log("  - studAdmsNo:", payload.studAdmsNo);
          console.log("  - firstName:", payload.firstName);
          console.log("  - lastName:", payload.lastName);
          console.log("  - genderId:", payload.genderId);
          console.log("  - academicYearId:", payload.academicYearId);
          console.log("  - branchId:", payload.branchId);
          console.log("  - classId:", payload.classId);
          console.log("  - orientationId:", payload.orientationId);
          console.log("  - studentTypeId:", payload.studentTypeId);
          console.log("  - Payment Mode ID:", payload.paymentDetails?.paymentModeId);
          console.log("  - Payment Amount:", payload.paymentDetails?.amount);
          console.log("===========================================");

          // Submit to college fast sale API
          console.log("📤 Using college fast sale endpoint: /student_fast_sale/fast-sale");
          response = await submitCollegeFastSale(payload);
        } else if (saleType === "regular") {
          // Map college application sale complete form data to API payload
          console.log('🔍 ===== COLLEGE APPLICATION SALE COMPLETE DATA BEFORE MAPPING (PaymentPopup) =====');
          console.log('collegeFormData (full form):', collegeFormData);
          console.log('collegeFormData.siblings:', collegeFormData?.siblings);
          console.log('collegeFormData.siblings type:', typeof collegeFormData?.siblings);
          console.log('collegeFormData.siblings is array?', Array.isArray(collegeFormData?.siblings));
          console.log('collegeFormData.siblings length:', collegeFormData?.siblings?.length || 0);
          if (collegeFormData?.siblings && collegeFormData.siblings.length > 0) {
            console.log('  - First sibling in collegeFormData:', collegeFormData.siblings[0]);
          }
          console.log('paymentFormData:', paymentFormData);
          console.log('detailsObject:', detailsObject);
          console.log('activeTab:', activeTab);
          console.log('==============================================================');

          payload = mapCollegeApplicationSaleCompleteToPayload(
            collegeFormData || {},
            paymentFormData,
            detailsObject || {},
            activeTab
          );

          // Log the complete payload object to console in a readable format
          console.log("===========================================");
          console.log("📤 SUBMITTING COLLEGE APPLICATION SALE COMPLETE PAYLOAD TO BACKEND");
          console.log("===========================================");
          console.log("📋 Complete Payload Object:");
          console.log(payload);
          console.log("===========================================");
          console.log("📄 Payload as JSON (formatted):");
          console.log(JSON.stringify(payload, null, 2));
          console.log("===========================================");
          console.log("📊 Payload Summary:");
          console.log("  - studAdmsNo:", payload.studAdmsNo);
          console.log("  - firstName:", payload.firstName);
          console.log("  - lastName:", payload.lastName);
          console.log("  - genderId:", payload.genderId);
          console.log("  - appTypeId:", payload.appTypeId);
          console.log("  - quotaId:", payload.quotaId);
          console.log("  - academicYearId:", payload.academicYearId);
          console.log("  - branchId:", payload.branchId);
          console.log("  - classId:", payload.classId);
          console.log("  - orientationId:", payload.orientationId);
          console.log("  - studentTypeId:", payload.studentTypeId);
          console.log("  - Siblings count:", payload.siblings?.length || 0);
          console.log("  - Concessions count:", payload.concessions?.length || 0);
          console.log("  - Payment Mode ID:", payload.paymentDetails?.paymentModeId);
          console.log("  - Payment Amount:", payload.paymentDetails?.amount);
          console.log("===========================================");

          // Submit to college application sale complete API
          console.log("📤 Using college application sale complete endpoint: /student_fast_sale/college-application-sale");
          response = await submitCollegeApplicationSaleComplete(payload);
        }
      } else {
        // School fast sale has been removed - only handle regular sale/confirmation
        if (saleType === "fast" && type === "school") {
          throw new Error("School fast sale is no longer supported. Please use regular sale or confirmation.");
        }

        // Check if it's confirmation or sale
        if (isConfirmation) {
          // Map school confirmation form data to confirmation API payload (with parents, siblings, languages, concessions)
          console.log('🔍 ===== SCHOOL CONFIRMATION DATA BEFORE MAPPING (PaymentPopup) =====');
          console.log('schoolFormData (full form):', schoolFormData);
          console.log('siblings:', siblings);
          console.log('paymentFormData:', paymentFormData);
          console.log('detailsObject:', detailsObject);
          console.log('activeTab:', activeTab);
          console.log('==============================================================');

          payload = mapFormDataToPayload(
            schoolFormData || {},
            siblings || [],
            paymentFormData,
            detailsObject || {},
            activeTab
          );

          // Log the complete payload object to console in a readable format
          console.log("===========================================");
          console.log("📤 SUBMITTING SCHOOL CONFIRMATION PAYLOAD TO BACKEND");
          console.log("===========================================");
          console.log("📋 Complete Payload Object:");
          console.log(payload);
          console.log("===========================================");
          console.log("📄 Payload as JSON (formatted):");
          console.log(JSON.stringify(payload, null, 2));
          console.log("===========================================");
          console.log("📊 Payload Summary:");
          console.log("  - studAdmsNo:", payload.studAdmsNo);
          console.log("  - appConfDate:", payload.appConfDate);
          console.log("  - orientationId:", payload.orientationId);
          console.log("  - Parents count:", payload.parents?.length || 0);
          console.log("  - Siblings count:", payload.siblings?.length || 0);
          console.log("  - Languages count:", payload.languages?.length || 0);
          console.log("  - Concessions count:", payload.concessions?.length || 0);
          console.log("  - Payment Mode ID:", payload.paymentDetails?.paymentModeId);
          console.log("  - Payment Amount:", payload.paymentDetails?.amount);
          console.log("===========================================");

          // Submit to school confirmation API
          console.log("📤 Using school confirmation endpoint: /application-confirmation/confirm-school");
          response = await submitSchoolApplicationSale(payload);
        } else {
          // Map school form data to create API payload (simpler structure)
          console.log('🔍 ===== SCHOOL APPLICATION SALE DATA BEFORE MAPPING (PaymentPopup) =====');
          console.log('schoolFormData (full form):', schoolFormData);
          console.log('schoolFormData keys:', Object.keys(schoolFormData || {}));
          console.log('Personal Info:', {
            firstName: schoolFormData?.firstName,
            lastName: schoolFormData?.surName,
            gender: schoolFormData?.gender,
            aaparNo: schoolFormData?.aaparNo,
            dob: schoolFormData?.dob,
            aadharCardNo: schoolFormData?.aadharCardNo,
          });
          console.log('Orientation Info:', {
            academicYearId: schoolFormData?.academicYearId,
            branchId: schoolFormData?.branchId,
            campusId: schoolFormData?.campusId,
            classId: schoolFormData?.classId,
            joiningClassId: schoolFormData?.joiningClassId,
            orientationId: schoolFormData?.orientationId,
            studentTypeId: schoolFormData?.studentTypeId,
            joiningClass: schoolFormData?.joiningClass,
            orientationName: schoolFormData?.orientationName,
            studentType: schoolFormData?.studentType,
          });
          console.log('Parent Info:', {
            fatherName: schoolFormData?.fatherName,
            fatherMobile: schoolFormData?.fatherMobile,
          });
          console.log('Address Info:', {
            doorNo: schoolFormData?.doorNo,
            streetName: schoolFormData?.streetName,
            cityId: schoolFormData?.cityId,
            stateId: schoolFormData?.stateId,
            districtId: schoolFormData?.districtId,
            pincode: schoolFormData?.pincode,
          });
          console.log('paymentFormData:', paymentFormData);
          console.log('detailsObject:', detailsObject);
          console.log('activeTab:', activeTab);
          console.log('==============================================================');

          payload = mapSchoolApplicationSaleToPayload(
            schoolFormData || {},
            paymentFormData,
            detailsObject || {},
            activeTab
          );

          // Log the complete payload object to console in a readable format
          console.log("===========================================");
          console.log("📤 SUBMITTING SCHOOL APPLICATION SALE CREATE PAYLOAD TO BACKEND");
          console.log("===========================================");
          console.log("📋 Complete Payload Object:");
          console.log(payload);
          console.log("===========================================");
          console.log("📄 Payload as JSON (formatted):");
          console.log(JSON.stringify(payload, null, 2));
          console.log("===========================================");
          console.log("📊 Payload Summary:");
          console.log("  - studAdmsNo:", payload.studAdmsNo);
          console.log("  - firstName:", payload.firstName);
          console.log("  - lastName:", payload.lastName);
          console.log("  - genderId:", payload.genderId);
          console.log("  - academicYearId:", payload.academicYearId);
          console.log("  - branchId:", payload.branchId);
          console.log("  - classId:", payload.classId);
          console.log("  - orientationId:", payload.orientationId);
          console.log("  - Payment Mode ID:", payload.paymentDetails?.paymentModeId);
          console.log("  - Payment Amount:", payload.paymentDetails?.amount);
          console.log("===========================================");

          // Submit to school sale create API
          console.log("📤 Using school sale create endpoint: /student-admissions-sale/create");
          response = await submitSchoolApplicationSaleCreate(payload);
        }
      }

      console.log("✅ Submission successful:", response);
      setSubmitSuccess(true);

      // Call onSuccess callback if provided
      console.log("🔍 Checking if onSuccess callback exists:", !!onSuccess);
      if (onSuccess) {
        console.log("📞 Calling onSuccess callback with response and detailsObject");
        onSuccess(response, detailsObject);
        console.log("✅ onSuccess callback executed");
      } else {
        console.log("⚠️ No onSuccess callback provided, using fallback close");
        // Fallback: Close popup after a short delay if no onSuccess callback
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch (error) {
      console.error("❌ Error submitting form:", error);
      setSubmitError(error.response?.data?.message || error.message || "Failed to submit form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCashFinishSale = () => {
    handleFinishSale();
  };

  const handleCardFinishSale = () => {
    handleFinishSale();
  };

  // Calculate total steps based on whether it's a sale or confirmation flow
  // Sale flows (Fast Sale, Regular Sale): 2 steps
  // Confirmation flows: 3 steps
  const totalSteps = isConfirmation ? 3 : 2;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <PopupHeader step={totalSteps} onClose={onClose} title={title} totalSteps={totalSteps} />

        <PopupNavTabs onChange={handleTabChange} />

        <div className={styles.modalContent}>
          {submitError && (
            <div style={{ padding: '10px', margin: '10px', backgroundColor: '#fee', color: '#c00', borderRadius: '4px' }}>
              Error: {submitError}
            </div>
          )}
          {submitSuccess && (
            <div style={{ padding: '10px', margin: '10px', backgroundColor: '#efe', color: '#0c0', borderRadius: '4px' }}>
              Success! Form submitted successfully.
            </div>
          )}

          {activeTab === "cash" && (
            <CashForms formData={paymentFormData} onChange={handleFormChange} errors={formErrors} amountReadOnly={amountReadOnly} />
          )}

          {activeTab === "dd" && (
            <>
              <DDForms formData={paymentFormData} onChange={handleFormChange} errors={formErrors} amountReadOnly={amountReadOnly} />
              <div className={styles.footer}>
                <Button
                  buttonname={isSubmitting ? "Submitting..." : buttonText}
                  righticon={
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4 10H16M16 10L10 4M16 10L10 16"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  }
                  variant="primary"
                  onClick={handleFinishSale}
                  disabled={isSubmitting}
                />
              </div>
            </>
          )}

          {activeTab === "cheque" && (
            <>
              <ChequeForms formData={paymentFormData} onChange={handleFormChange} errors={formErrors} amountReadOnly={amountReadOnly} />
              <div className={styles.footer}>
                <Button
                  buttonname={isSubmitting ? "Submitting..." : buttonText}
                  righticon={
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4 10H16M16 10L10 4M16 10L10 16"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  }
                  variant="primary"
                  onClick={handleFinishSale}
                  disabled={isSubmitting}
                />
              </div>
            </>
          )}

          {activeTab === "card" && (
            <CardForms formData={paymentFormData} onChange={handleFormChange} errors={formErrors} amountReadOnly={amountReadOnly} />
          )}
        </div>

        {activeTab === "cash" && (
          <div className={styles.footer}>
            <Button
              buttonname={isSubmitting ? "Submitting..." : buttonText}
              righticon={
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 10H16M16 10L10 4M16 10L10 16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
              variant="primary"
              onClick={handleCashFinishSale}
              disabled={isSubmitting}
            />
          </div>
        )}

        {activeTab === "card" && (
          <div className={styles.footer}>
            <Button
              buttonname={isSubmitting ? "Submitting..." : buttonText}
              righticon={
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 10H16M16 10L10 4M16 10L10 16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
              variant="primary"
              onClick={handleCardFinishSale}
              disabled={isSubmitting}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentPopup;

