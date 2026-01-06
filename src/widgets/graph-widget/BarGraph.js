// import React from "react";
// import styles from "./BarGraph.module.css";
// import reddot2 from "../../assets/application-analytics/red2.svg";
// import greendot2 from "../../assets/application-analytics/green2.svg";

// // const graphData = [
// //   { year: "2018-2019", issued: 50, sold: 100 },
// //   { year: "2019-2020", issued: 40, sold: 70 },
// //   { year: "2021-2022", issued: 65, sold: 30 },
// //   { year: "2023-2024", issued: 80, sold: 60 },
// // ];

// // const percentage = 100;
// // const BarGraph = ({graphBarData}) => {
// //   return (
// //     <div>
// //       <div className={styles.all_graphs}>
// //         {graphBarData.map((graph,index) => {
// //           return (
// //             <div key={index} className={styles.bars_and_year}>
// //               <div className={styles.bars}>
// //                 <div className={styles.red_bar_wrapper}>

// //                   <div
// //                     className={styles.red_bar}
// //                     style={{ height: `${graph.issued}%` }}
// //                     >
// //                       <img src={reddot2} className={styles.reddot}/>
// //                     </div>
// //                 </div>
// //                 <div className={styles.green_bar_wrapper}>

// //                   <div
// //                     className={styles.green_bar}
// //                     style={{ height: `${graph.sold}%` }}
// //                   >
// //                     <img src={greendot2} className={styles.greendot}/>
// //                   </div>
// //                 </div>
// //               </div>
// //               <p className={styles.year}>{graph.year}</p>
// //             </div>
// //           );
// //         })}
// //       </div>
// //     </div>
// //   );
// // };

// // export default BarGraph;

// const BarGraph = ({ graphBarData }) => {
//   return (
//     <div>
//       <div className={styles.all_graphs}>
//         {graphBarData.map((graph, index) => {

//           const issued = Math.floor(Number(graph.issued) || 0);
//           const sold = Math.floor(Number(graph.sold) || 0);

//           console.log("Rounded Values →", graph.year, issued, sold);

//           return (
//             <div key={index} className={styles.bars_and_year}>
//               <div className={styles.bars}>
//                 <div className={styles.red_bar_wrapper}>
//                   <div
//                     className={styles.red_bar}
//                     style={{ height: `${issued}%` }}
//                   >
//                     <img src={reddot2} className={styles.reddot} alt="issued-dot" />
//                   </div>
//                 </div>

//                 <div className={styles.green_bar_wrapper}>
//                   <div
//                     className={styles.green_bar}
//                     style={{ height: `${sold}%` }}
//                   >
//                     <img src={greendot2} className={styles.greendot} alt="sold-dot" />
//                   </div>
//                 </div>
//               </div>
//               <p className={styles.year}>{graph.year}</p>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default BarGraph;









import React from "react";
import styles from "./BarGraph.module.css";
import reddot2 from "../../assets/application-analytics/red2.svg";
import greendot2 from "../../assets/application-analytics/green2.svg";
import { formatFee } from "../../utils/feeFormat";

const BarGraph = ({ graphBarData }) => {
  console.log("📊 BarGraph received graphBarData:", graphBarData);
  console.log("📊 BarGraph graphBarData type:", typeof graphBarData);
  console.log("📊 BarGraph graphBarData is array:", Array.isArray(graphBarData));
  console.log("📊 BarGraph graphBarData length:", Array.isArray(graphBarData) ? graphBarData.length : "N/A");

  // ✅ Safety check: if graphBarData is null/undefined/empty, show empty state
  if (!graphBarData || !Array.isArray(graphBarData) || graphBarData.length === 0) {
    console.warn("⚠️ BarGraph: graphBarData is null, undefined, or empty", graphBarData);
    return (
      <div>
        <div className={styles.all_graphs}>
          <p style={{ color: '#718ebf', fontSize: '12px', textAlign: 'center', width: '100%' }}>
            No graph data available
          </p>
        </div>
      </div>
    );
  }

  console.log("✅ BarGraph: Rendering graph with", graphBarData.length, "items");
  const yearsOrder = graphBarData.map(item => item.year);
  console.log("✅ BarGraph: Years in order:", yearsOrder);
  console.log("✅ BarGraph: Expected order: [2025-26, 2024-25, 2023-24, 2022-23]");
  console.log("✅ BarGraph: Order matches:", JSON.stringify(yearsOrder) === JSON.stringify(["2025-26", "2024-25", "2023-24", "2022-23"]));
  console.log("✅ BarGraph: Full data:", graphBarData);

  return (
    <div>
      <div className={styles.all_graphs}>
        {graphBarData.map((graph, index) => {
          console.log(`📊 BarGraph: Rendering item ${index} (${graph.year}):`, {
            year: graph.year,
            issued: graph.issued,
            sold: graph.sold,
            issuedCount: graph.issuedCount,
            soldCount: graph.soldCount
          });

          // ✅ Ensure percentages are properly calculated (0-100 range)
          // The values come as percentages (0-100), use them directly for height
          let issued = Math.max(0, Math.min(100, Number(graph.issued) || 0));
          let sold = Math.max(0, Math.min(100, Number(graph.sold) || 0));

          // ✅ Ensure minimum visibility: if value > 0, show at least 4px (about 2.8% of 141px)
          // This ensures bars are visible even for very small percentages like 1%
          // For wrapper height of 141px: 1% = 1.41px, 2% = 2.82px, 3% = 4.23px
          // Using 3% minimum ensures bars are clearly visible
          if (issued > 0 && issued < 3) {
            issued = 3; // Minimum 3% for visibility (~4.2px)
            console.log(`📊 Adjusted issued from ${graph.issued} to 3% for visibility`);
          }
          if (sold > 0 && sold < 3) {
            sold = 3; // Minimum 3% for visibility (~4.2px)
            console.log(`📊 Adjusted sold from ${graph.sold} to 3% for visibility`);
          }

          const issuedCount = graph.issuedCount ?? graph.issued ?? 0;
          const soldCount = graph.soldCount ?? graph.sold ?? 0;

          console.log(`📊 BarGraph Item ${index} (${graph.year}):`, {
            rawIssued: graph.issued,
            rawSold: graph.sold,
            calculatedIssued: issued,
            calculatedSold: sold,
            issuedHeight: `${issued}%`,
            soldHeight: `${sold}%`
          });

          // ✅ Calculate actual pixel height for better visibility control
          // Wrapper height is 141px, so percentage translates directly
          const wrapperHeight = 141; // px
          const issuedHeightPx = Math.max(issued > 0 ? 3 : 0, (issued / 100) * wrapperHeight);
          const soldHeightPx = Math.max(sold > 0 ? 3 : 0, (sold / 100) * wrapperHeight);

          console.log(`📊 BarGraph ${graph.year} - Heights:`, {
            issued: `${issued}% = ${issuedHeightPx}px`,
            sold: `${sold}% = ${soldHeightPx}px`
          });

          return (
            <div key={graph.year || index} className={styles.bars_and_year}>
              <div className={styles.bars}>
                {/* RED BAR */}
                <div className={styles.red_bar_wrapper}>
                  <div
                    className={styles.red_bar}
                    style={{
                      height: `${issued}%`,
                      minHeight: issued > 0 ? '3px' : '0px' // Ensure minimum visibility
                    }}
                  >
                    <img src={reddot2} className={styles.reddot} alt="issued-dot" />
                    <span className={styles.tooltip}>{formatFee(issuedCount)}</span>
                  </div>
                </div>

                {/* GREEN BAR */}
                <div className={styles.green_bar_wrapper}>
                  <div
                    className={styles.green_bar}
                    style={{
                      height: `${sold}%`,
                      minHeight: sold > 0 ? '3px' : '0px' // Ensure minimum visibility
                    }}
                  >
                    <img src={greendot2} className={styles.greendot} alt="sold-dot" />
                    <span className={styles.tooltip}>{formatFee(soldCount)}</span>
                  </div>
                </div>

              </div>
              <p className={styles.year}>{graph.year}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BarGraph;