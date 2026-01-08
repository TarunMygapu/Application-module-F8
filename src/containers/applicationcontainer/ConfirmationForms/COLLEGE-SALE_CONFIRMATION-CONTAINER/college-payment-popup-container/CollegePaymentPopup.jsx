import React from 'react'
import PaymentPopup from '../../../../../widgets/PaymentPopup/whole-payment-popup/PaymentPopup.jsx';
 
const CollegePaymentPopup = ({ onClose, formData, academicFormData, detailsObject, applicationDetailsData, onSuccess }) => {
  // Debug: Log props received by CollegePaymentPopup
  console.log("📦 ===== COLLEGE PAYMENT POPUP CONTAINER =====");
  console.log("Form Data:", formData);
  console.log("applicationDetailsData:", applicationDetailsData);
  console.log("detailsObject:", detailsObject);
  console.log("detailsObject.status:", detailsObject?.status);
  console.log("===========================================");
  
  return (
    <PaymentPopup
      onClose={onClose}
      title="Complete Application Confirmation"
      type="college"
      collegeFormData={formData}
      collegeAcademicFormData={academicFormData}
      detailsObject={detailsObject}
      applicationDetailsData={applicationDetailsData}
      isConfirmation={true}
      onSuccess={onSuccess}
    />
  );
}
 
export default CollegePaymentPopup