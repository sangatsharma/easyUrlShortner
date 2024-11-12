import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format } from 'date-fns';

interface ClickData {
  date: string;
  link: string;         // The link name or identifier
  uniqueClicks: number;
}

interface UniqueClicksChartProps {
  data: ClickData[];
  chartType?: 'line' | 'bar';
}

const UniqueClicksChart: React.FC<UniqueClicksChartProps> = ({ data, chartType = 'line' }) => {
  // Format the date on the X-axis and group by date
  const formattedData = data.map(item => ({
    ...item,
    date: format(new Date(item.date), 'MM/dd/yyyy'),
  }));

  // Group by date and link
  const groupedData: { [key: string]: { [key: string]: number } } = {};
  formattedData.forEach(item => {
    if (!groupedData[item.date]) {
      groupedData[item.date] = {};
    }
    groupedData[item.date][item.link] = item.uniqueClicks;
  });

  // Convert the grouped data into an array for the chart
  const chartData = Object.keys(groupedData).map(date => {
      const dateData: { date: string; [key: string]: any } = { date };
    Object.keys(groupedData[date]).forEach(link => {
      dateData[link] = groupedData[date][link];
    });
    return dateData;
  });

  return (
    <ResponsiveContainer width="100%" height={400}>
      {chartType === 'line' ? (
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          {/* Dynamically render a Line for each link */}
          {Object.keys(chartData[0])
            .filter(key => key !== 'date')
            .map(link => (
              <Line key={link} type="monotone" dataKey={link} stroke="#8884d8" />
            ))}
        </LineChart>
      ) : (
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          {/* Dynamically render a Bar for each link */}
          {Object.keys(chartData[0])
            .filter(key => key !== 'date')
            .map(link => (
              <Bar key={link} dataKey={link} fill="#8884d8" />
            ))}
        </BarChart>
      )}
    </ResponsiveContainer>
  );
};

export default UniqueClicksChart;
