import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, Sector } from 'recharts';

// 자산 구성 데이터
const assetAllocationData = [
  { name: '주식', value: 597, percentage: 62.01, color: '#0088FE' },
  { name: '어음', value: 286, percentage: 29.77, color: '#00C49F' },
  { name: '채권', value: 150, percentage: 15.57, color: '#FFBB28' },
  { name: '장내 파생상품 증거금', value: 65, percentage: 6.71, color: '#FF8042' },
  { name: '장외 파생상품 평가손익', value: -135, percentage: -14.06, color: '#FF0000' },
];

// 주식 세부 구성 데이터
const stockDetailsData = [
  { name: 'Apple', value: 7.2, sector: 'IT', color: '#8884d8' },
  { name: 'Microsoft', value: 6.5, sector: 'IT', color: '#83a6ed' },
  { name: 'Amazon', value: 3.5, sector: '소비재', color: '#8dd1e1' },
  { name: 'NVIDIA', value: 3.3, sector: 'IT', color: '#82ca9d' },
  { name: 'Alphabet A/C', value: 4.1, sector: '커뮤니케이션', color: '#a4de6c' },
  { name: 'Berkshire H.', value: 1.6, sector: '금융', color: '#d0ed57' },
  { name: 'Meta Platforms', value: 1.4, sector: '커뮤니케이션', color: '#ffc658' },
  { name: 'Tesla', value: 1.3, sector: '소비재', color: '#f28cb1' },
  { name: 'UnitedHealth', value: 1.2, sector: '헬스케어', color: '#b7b3f7' },
  { name: 'ExxonMobil', value: 1.0, sector: '에너지', color: '#f78c6c' },
];

// 툴팁 커스텀 컴포넌트
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-200 shadow-md rounded-md">
        <p className="font-semibold">{payload[0].name}</p>
        <p className="text-sm">금액: {payload[0].value}억원</p>
        <p className="text-sm">비중: {payload[0].payload.percentage}%</p>
        {payload[0].payload.sector && (
          <p className="text-sm">섹터: {payload[0].payload.sector}</p>
        )}
      </div>
    );
  }
  return null;
};

// 활성화된 섹터 렌더링
const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 6}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};

const AssetAllocation: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [showStockDetails, setShowStockDetails] = useState(false);

  const handlePieClick = (data: any, index: number) => {
    if (data.name === '주식') {
      setShowStockDetails(!showStockDetails);
    }
    setActiveIndex(index);
  };

  const handleMouseEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const handleMouseLeave = () => {
    setActiveIndex(null);
  };

  return (
    <div className="mb-10">
      <h2 className="text-2xl font-bold mb-4">모투자신탁 자산 구성 (2024.10.31 기준)</h2>
      
      <div className="flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/2 mb-6 lg:mb-0">
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={assetAllocationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  innerRadius={60}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  nameKey="name"
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  onClick={handlePieClick}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  {assetAllocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="overflow-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">자산 항목</th>
                  <th className="border p-2 text-right">금액 (억원)</th>
                  <th className="border p-2 text-right">자산 비중 (%)</th>
                </tr>
              </thead>
              <tbody>
                {assetAllocationData.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="border p-2">{item.name}</td>
                    <td className="border p-2 text-right">{item.value}</td>
                    <td className="border p-2 text-right">{item.percentage}</td>
                  </tr>
                ))}
                <tr className="bg-gray-100 font-semibold">
                  <td className="border p-2">총계</td>
                  <td className="border p-2 text-right">962</td>
                  <td className="border p-2 text-right">100.00%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {showStockDetails && (
          <div className="w-full lg:w-1/2 lg:pl-6">
            <h3 className="text-xl font-semibold mb-4">주식 세부 구성</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stockDetailsData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                    nameKey="name"
                    activeIndex={activeIndex === 0 ? undefined : activeIndex}
                    activeShape={renderActiveShape}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    {stockDetailsData.map((entry, index) => (
                      <Cell key={`cell-stock-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="overflow-auto mt-4">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2 text-left">종목명</th>
                    <th className="border p-2 text-right">비중 (%)</th>
                    <th className="border p-2 text-left">섹터</th>
                  </tr>
                </thead>
                <tbody>
                  {stockDetailsData.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="border p-2">{item.name}</td>
                      <td className="border p-2 text-right">{item.value}</td>
                      <td className="border p-2">{item.sector}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <p className="text-sm text-gray-600 mt-4">
              * 주식을 클릭하면 세부 구성을 볼 수 있습니다.
            </p>
          </div>
        )}
        
        {!showStockDetails && (
          <div className="w-full lg:w-1/2 lg:pl-6 flex items-center justify-center">
            <p className="text-gray-600 p-4 border border-dashed border-gray-300 rounded-lg">
              주식 부분을 클릭하면 주식의 세부 비중을 확인할 수 있습니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssetAllocation; 