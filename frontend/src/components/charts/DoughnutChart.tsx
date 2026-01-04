import React from 'react';

interface DoughnutChartProps {
  data: { label: string; value: number; color: string }[];
}

const DoughnutChart: React.FC<DoughnutChartProps> = ({ data }) => {

  const size = 150;
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const totalValue = data.reduce((sum, item) => sum + item.value, 0);

  let accumulatedPercentage = 0;

  if (totalValue === 0) {
    return <div className="flex items-center justify-center h-full text-quility-dark-grey">No activity to display</div>;
  }
  let accumulatedLength = 0;
  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="#ff0000"
          strokeWidth={strokeWidth}
        />
        {data.map((item, index) => {
          console.log(item)
          //const percentage = (item.value / totalValue) * 100;
          //const strokeDashoffset = circumference - (accumulatedPercentage / 100) * circumference;
          //const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
          const sliceLength = (item.value / totalValue) * circumference; // actual arc length
          const strokeDasharray = `${sliceLength} ${circumference}`;
          const strokeDashoffset = circumference - accumulatedLength; 
          
            accumulatedLength += sliceLength;

          return (
            <circle
      key={index}
      cx={size / 2}
      cy={size / 2}
      r={radius}
      fill="transparent"
      stroke={item.color}
      strokeWidth={strokeWidth}
      strokeDasharray={strokeDasharray}
      strokeDashoffset={strokeDashoffset}
      transform={`rotate(-90 ${size / 2} ${size / 2})`}
    />
          );
        })}
         <text x="50%" y="50%" textAnchor="middle" dy=".3em" fontSize="20" fontWeight="bold" fill="#333">
            {totalValue}
        </text>
      </svg>
      <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
        {data.map((item) => (
          <div key={item.label} className="flex items-center">
            <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></span>
            <span className="text-quility-dark-grey">{item.label}: <span className="font-bold text-quility-dark-text">{item.value}</span></span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoughnutChart;