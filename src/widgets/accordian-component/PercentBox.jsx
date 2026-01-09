import React from "react";
import styles from "./PercentBox.module.css"


const getArrowPath = (percent) => {
  if (percent > 0) return "M2.08337 4.66667L5.00004 1.75M5.00004 1.75L7.91671 4.66667M5.00004 1.75V9.25"; // up
  if (percent < 0) return "M7.91671 6.33333L5.00004 9.25M5.00004 9.25L2.08337 6.33333M5.00004 9.25V1.75"; // down
  return "M2 5.5 L8 5.5"; // flat
};

const PercentBox = ({ items = [] }) => (
  <div style={{ display: "flex", gap: 12 ,marginTop:"3px"}}>
    {items.map((item, index) => {
      const percentValue = Number(item?.percent || 0);
      const sign = percentValue > 0 ? "+" : percentValue < 0 ? "-" : "";
      const absValue = Math.abs(percentValue);

     
      const isIssued = item.type === "issued";
      const isSold = item.type === "sold";
      const borderColor = isIssued ? "#EF4444" : "#22C55E";
      const arrowDirection = percentValue > 0 ? "up" : percentValue < 0 ? "down" : "flat";

      const bgColor = isIssued ? "#fff3f0" : "#eefaf1";

       const issuedStyles = {
        border: "1px solid #B51919",
        // background: `
        //   linear-gradient(#fff3f0, #fff3f0) padding-box,
        //   linear-gradient(to bottom, #F31616, #8D0D6F) border-box
        // `,
        backgroundColor:"#FFFAF5",
      };

      const soldStyles = {
        border: "1px solid #36B422",
        // background: `
        //   linear-gradient(#eefaf1, #eefaf1) padding-box,
        //   linear-gradient(to bottom, #45D92E, #07968F) border-box
        // `,
        backgroundColor: "#F8FFF7",
      };

      const arrowColor = isIssued
  ? "#22C55E"   // 🔴 Issued → always red
  : "#EF4444";  // 🟢 Sold → always green

     const arrowPercentColor = percentValue > 0 || percentValue < 0 ? (isIssued
  ? "#FC0B0B"   // 🔴 Issued → always red
  : "#25D433") : "#000000"
      return (
        <span
          key={index}
          style={{
            padding: "4px 8px",
            borderRadius: 20,
            letterrSpacing:"0.2px",
            fontSize: 12,
            fontWeight: 500,
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            // border: `1px solid ${borderColor}`,
            background: bgColor,
            color: borderColor,
            // fontFamily:"Plus Jakarta Sans",
             ...(isIssued ? issuedStyles : soldStyles),
                   opacity: 1, // Ensure opacity is set for transitions
            transition: "opacity 0.3s ease-out", // Smooth fade-in/out
          }}
        >
          {`${sign}${absValue}%`}
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="15" viewBox="0 0 10 11">
            <path
              d={getArrowPath(percentValue)}
              stroke={arrowPercentColor}
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      );
    })}
  </div>
);

export default PercentBox;
