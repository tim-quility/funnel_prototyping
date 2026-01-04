import React, { useState, useRef, useEffect } from 'react';
import type { ChartDataPoint } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { themes } from '../../themes';

interface SimpleLineChartProps {
  data: ChartDataPoint[];
}

const SimpleLineChart: React.FC<SimpleLineChartProps> = ({ data }) => {
  const { theme } = useTheme();
  const activeTheme = themes.find(t => t.id === theme) || themes[0];
  const lineColor = activeTheme.colors['quility-default'] || '#45bcaa';
  const pointColor = activeTheme.colors['quility-dark-green'] || '#005851';
  const fillColor = activeTheme.colors['quility-light-green'] || 'rgba(69,188,170,0.2)';

  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 300, height: 200 });

  // ResizeObserver for dynamic sizing
  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        if (width && height) setDimensions({ width, height });
      }
    };

    measure();
    const observer = new ResizeObserver(() => measure());
    if (containerRef.current) observer.observe(containerRef.current);
    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current);
    };
  }, []);

  const { width, height } = dimensions;
  const padding = 20;

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-quility-dark-grey">
        No data for this period
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value), 1);
  const xScale = data.length > 1 ? (width - 2 * padding) / (data.length - 1) : 0;
  const yScale = (height - 2 * padding) / maxValue;

  // Path for line
  const linePath =
    data.length > 1
      ? data
          .map((p, i) => {
            const x = padding + i * xScale;
            const y = height - padding - p.value * yScale;
            return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)},${y.toFixed(2)}`;
          })
          .join(' ')
      : '';

  // Path for area fill
  const areaPath =
    data.length > 1
      ? `${linePath} L ${padding + (data.length - 1) * xScale},${height - padding} L ${padding},${height - padding} Z`
      : '';

  return (
    <div ref={containerRef} className="w-full h-64">
      <svg width={width} height={height} className="font-sans">
        {/* Y-Axis Grid Lines */}
        {[0, 0.25, 0.5, 0.75, 1].map(tick => (
          <g key={tick} className="text-gray-300">
            <line
              x1={padding}
              x2={width - padding}
              y1={height - padding - maxValue * tick * yScale}
              y2={height - padding - maxValue * tick * yScale}
              stroke="currentColor"
              strokeWidth="0.5"
            />
            <text
              x={padding - 5}
              y={height - padding - maxValue * tick * yScale + 3}
              fontSize="10"
              textAnchor="end"
              fill="#707070"
            >
              {(maxValue * tick).toFixed(0)}
            </text>
          </g>
        ))}

        {/* X-Axis Labels */}
        {data.map((p, i) => (
          <text
            key={i}
            x={data.length > 1 ? padding + i * xScale : width / 2}
            y={height - 5}
            textAnchor="middle"
            fontSize="10"
            fill="#707070"
          >
            {p.label}
          </text>
        ))}

        {/* Area Fill */}
        <path d={areaPath} fill={fillColor} />

        {/* Line Path */}
        <path d={linePath} fill="none" stroke={lineColor} strokeWidth="2" />

        {/* Points */}
        {data.map((p, i) => {
          const x = data.length > 1 ? padding + i * xScale : width / 2;
          const y = height - padding - p.value * yScale;
          return (
            <circle key={i} cx={x} cy={y} r={3} fill={pointColor}>
              <title>
                {p.label}: {p.value}
              </title>
            </circle>
          );
        })}
      </svg>
    </div>
  );
};

export default SimpleLineChart;
