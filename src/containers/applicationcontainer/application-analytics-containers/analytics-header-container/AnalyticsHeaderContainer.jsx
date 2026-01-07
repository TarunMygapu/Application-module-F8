import AnalyticsHeader from "../../../../components/applicationcomponents/application-analytics/analytical-header-part-components/AnalyticsHeader"

const AnalyticsHeaderContainer = ({ onTabChange, activeTab }) => {
  return (
    <AnalyticsHeader onTabChange={onTabChange} activeTab={activeTab} />
  )
}

export default AnalyticsHeaderContainer
