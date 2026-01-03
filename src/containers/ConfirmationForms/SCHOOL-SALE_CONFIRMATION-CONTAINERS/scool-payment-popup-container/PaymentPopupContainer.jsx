import React from "react";
import PaymentPopup from "../../../../widgets/PaymentPopup/whole-payment-popup/PaymentPopup.jsx";
 
const SchoolPaymentPopup = ({ onClose, formData, siblings, detailsObject, applicationDetailsData, onSuccess, isSaleAndConfirmFlow = false }) => {
  // Debug: Log props received by PaymentPopupContainer
  console.log("📦 ===== SCHOOL PAYMENT POPUP CONTAINER =====");
  console.log("applicationDetailsData:", applicationDetailsData);
  console.log("detailsObject:", detailsObject);
  console.log("detailsObject.status:", detailsObject?.status);
  console.log("isSaleAndConfirmFlow:", isSaleAndConfirmFlow);
  console.log("============================================");
  
  // Determine title and button text based on flow
  const popupTitle = isSaleAndConfirmFlow 
    ? "Complete Sale & Application Confirmation" 
    : "Complete Application Confirmation";
  
  return (
    <PaymentPopup
      onClose={onClose}
      title={popupTitle}
      formData={formData}
      siblings={siblings}
      detailsObject={detailsObject}
      applicationDetailsData={applicationDetailsData}
      type="school"
      isConfirmation={true}
      isSaleAndConfirmFlow={isSaleAndConfirmFlow}
      onSuccess={onSuccess}
    />
  );
};
 
export default SchoolPaymentPopup;