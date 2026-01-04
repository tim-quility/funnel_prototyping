import React, { useState, useRef, useEffect } from 'react';
import type { ChartDataPoint } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { themes } from '../../themes';

interface SimpleBarChartProps {
  data: ChartDataPoint[];
}

const SimpleBarChart: React.FC<SimpleBarChartProps> = ({ data }) => {
  const { theme } = useTheme();
  const activeTheme = themes.find(t => t.id === theme) || themes[0];
  const barColor = activeTheme.colors['quility-default'] || '#45bcaa';
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const observer = new ResizeObserver(entries => {
      if (entries[0]) {
        setWidth(entries[0].contentRect.width);
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-full text-quility-dark-grey">No data to display</div>;
  }

  const maxValue = Math.max(...data.map(d => d.value), 1);
  const chartHeight = 256;
  const bottomPadding = 20;

  // Responsive calculations
  const totalItems = data.length;
  const barPercentage = 0.6; // 60% of the available space for each item is the bar
  const itemWidth = width / totalItems;
  const barWidth = itemWidth * barPercentage;
  const barMargin = itemWidth * (1 - barPercentage);

  return (
    <div ref={containerRef} className="w-full h-full">
      <svg width={width} height={chartHeight} className="font-sans">
        <g>
          {data.map((d, i) => {
            const barHeight = (d.value / maxValue) * (chartHeight - 40);
            const x = i * itemWidth + (barMargin / 2);
            const y = chartHeight - barHeight - bottomPadding;
            
            // Truncate label if it's too long for the bar width
            const maxLabelChars = Math.floor(barWidth / 7); // Approx. 7px per char
            const label = d.label.length > maxLabelChars ? `${d.label.substring(0, maxLabelChars - 1)}…` : d.label;

            return (
              <g key={i}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill={barColor}
                  rx="3"
                />
                <text
                  x={x + barWidth / 2}
                  y={y - 5}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="bold"
                  fill="#333"
                >
                  {d.value}
                </text>
                {/* FIX: Replaced unsupported `title` attribute with a `<title>` child element for SVG tooltips. */}
                <text
                  x={x + barWidth / 2}
                  y={chartHeight - 5}
                  textAnchor="middle"
                  fontSize="12"
                  fill="#555"
                >
                  <title>{'d.label'}</title>
                  {label}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
};

export default SimpleBarChart;