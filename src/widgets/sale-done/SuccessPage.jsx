import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SuccessPage.module.css";
// import pageicon from "../../assets/application-status/application-status/image (1).jpeg";
// import Statusbar from "../StatusBar/Statusbar";
import LottieWithDot from "../LottieWidgets/LottieWithDot/LottieWithDot";
import successApplication from "../../assets/applicationassets/application-status/Varsity.lottie";
import Button from "../Button/Button";
import rightarrow from "../../assets/applicationassets/application-distribution/rightarrow";

const SuccessPage = ({ applicationNo, studentName, amount, campus, zone, onBack, statusType = "sale", reverseOrder = false }) => {
  const navigate = useNavigate();
  const isSold = statusType === "sale" || statusType === "confirmation";
  const isConfirmed = statusType === "confirmation";
  const isDamaged = statusType === "damaged";

  // Handle navigation to application status page
  const handleBackToStatus = () => {
    // Use React Router's smooth navigation
    navigate("/scopes/application/status");
  };

  return (
    <div className={styles.Success_Page_root}>
      <div className={styles.Success_Page_paper}>
        {/* <Statusbar isSold={isSold} isConfirmed={isConfirmed} isDamaged={isDamaged} showLabels={true} reducedGap={true} labelWidth="36%" reverseOrder={reverseOrder} /> */}

        <div className={styles.Success_Page_iconContainer}>
          {/* <img src={pageicon} alt="Success Icon" className={styles.Success_Page_iconImage} /> */}
          <LottieWithDot src={successApplication} height={150} width={150} />
        </div>

        <div className={styles.successpagecontent}>
          <div className={styles.successpagemessage}>
            <h5 className={styles.Success_Page_title}>
              Application No: {applicationNo || "N/A"}
            </h5>

            <h6 className={styles.Success_Page_subtitle}>
              {isConfirmed ? "Application confirmed" : "Update Successful"}
            </h6>
            <p className={styles.Success_Page_description}>
              {isConfirmed ? "Details added successfully" : "Application Details Added Successfully"}
            </p>

            {/* {studentName && <p className={styles.Success_Page_detail}>Student: {studentName}</p>}
        {amount && <p className={styles.Success_Page_detail}>Amount Paid: {amount}</p>}
        {campus && <p className={styles.Success_Page_detail}>Campus: {campus}</p>}
        {zone && <p className={styles.Success_Page_detail}>Zone: {zone}</p>} */}
          </div>
          <div className={styles.successpagebackbutton}>
            <Button
              onClick={handleBackToStatus}
              variant={"primary"}
              buttonname={"Back To Application Status"}
              righticon={rightarrow}
            />

            {/* <button
          className={styles.Success_Page_button}
          onClick={handleBackToStatus}
        >
          Back To Application Status
        </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;