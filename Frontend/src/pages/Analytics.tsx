import * as React from "react";
import UniqueClicksChart from "../components/UniqueClicksChart";

// interface IAnalyticsProps {}

const Analytics: React.FunctionComponent = () => {
  const sampleData = [
    { date: "2024-11-01", link: "link1", uniqueClicks: 120 },
    { date: "2024-11-01", link: "link2", uniqueClicks: 95 },
    { date: "2024-11-02", link: "link1", uniqueClicks: 130 },
    { date: "2024-11-02", link: "link2", uniqueClicks: 105 },
    { date: "2024-11-03", link: "link1", uniqueClicks: 150 },
    { date: "2024-11-03", link: "link2", uniqueClicks: 110 },
  ];
  return (
    <>
      <main className="flex-grow m-20  h-screen ">
        <UniqueClicksChart data={sampleData} chartType="line" />
      </main>
    </>
  );
};

export default Analytics;
