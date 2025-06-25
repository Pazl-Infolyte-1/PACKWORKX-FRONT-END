import React, { useState } from 'react';
import { Pie } from 'recharts';
import { Filter, Download, ChevronDown } from 'lucide-react';

const TaskReport = () => {
  const [startDate, setStartDate] = useState('2024-01-01');
  const [endDate, setEndDate] = useState('2024-12-31');
  const [status, setStatus] = useState('all');
  const [project, setProject] = useState('all');

  // Sample data for the pie chart
  const data = [
    { name: 'Completed', value: 65, fill: '#10B981' },
    { name: 'In Progress', value: 25, fill: '#F59E0B' },
    { name: 'Pending', value: 10, fill: '#3B82F6' }
  ];

  const totalTasks = data.reduce((sum, item) => sum + item.value, 0);

  const CustomPieChart = () => {
    const size = 280;
    const strokeWidth = 8;
    const radius = (size - strokeWidth) / 2;
    const center = size / 2;
    
    let cumulativePercentage = 0;
    
    return (
      <div className="relative">
        <svg width={size} height={size} className="drop-shadow-sm">
          {data.map((item, index) => {
            const percentage = item.value / totalTasks;
            const startAngle = cumulativePercentage * 360 - 90;
            const endAngle = (cumulativePercentage + percentage) * 360 - 90;
            
            const startAngleRad = (startAngle * Math.PI) / 180;
            const endAngleRad = (endAngle * Math.PI) / 180;
            
            const largeArcFlag = percentage > 0.5 ? 1 : 0;
            
            const x1 = center + radius * Math.cos(startAngleRad);
            const y1 = center + radius * Math.sin(startAngleRad);
            const x2 = center + radius * Math.cos(endAngleRad);
            const y2 = center + radius * Math.sin(endAngleRad);
            
            const pathData = [
              `M ${center} ${center}`,
              `L ${x1} ${y1}`,
              `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              'Z'
            ].join(' ');
            
            cumulativePercentage += percentage;
            
            return (
              <path
                key={index}
                d={pathData}
                fill={item.fill}
                stroke="white"
                strokeWidth={2}
                className="hover:opacity-80 transition-opacity cursor-pointer"
              />
            );
          })}
        </svg>
        
        {/* Legend */}
        <div className="mt-6 space-y-3">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.fill }}
                />
                <span className="text-sm font-medium text-gray-700">{item.name}</span>
              </div>
              <div className="text-sm text-gray-600 font-semibold">
                {item.value}% ({Math.round((item.value / 100) * totalTasks)} tasks)
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-semibold text-gray-900">Task Report</h1>
            <div className="flex items-center text-sm text-gray-500">
              <span>Home</span>
              <span className="mx-2">•</span>
              <span>Task Report</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-700">Duration</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="text-sm text-gray-500">To End Date</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-700">Status</span>
                <div className="relative">
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="appearance-none border border-gray-300 rounded-md px-3 py-1.5 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value="all">All</option>
                    <option value="completed">Completed</option>
                    <option value="in-progress">In Progress</option>
                    <option value="pending">Pending</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-700">Project</span>
                <div className="relative">
                  <select
                    value={project}
                    onChange={(e) => setProject(e.target.value)}
                    className="appearance-none border border-gray-300 rounded-md px-3 py-1.5 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value="all">All</option>
                    <option value="project-a">Project A</option>
                    <option value="project-b">Project B</option>
                    <option value="project-c">Project C</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <button className="flex items-center space-x-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-8">
            {/* Chart Section */}
            <div className="flex flex-col items-center">
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 text-center mb-2">
                  Task Status Distribution
                </h2>
                <p className="text-sm text-gray-600 text-center">
                  Overview of task completion status
                </p>
              </div>
              
              <CustomPieChart />
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-6 mt-12 mb-8">
              {data.map((item, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 text-center">
                  <div 
                    className="w-4 h-4 rounded-full mx-auto mb-2"
                    style={{ backgroundColor: item.fill }}
                  />
                  <div className="text-2xl font-bold text-gray-900">{item.value}%</div>
                  <div className="text-sm text-gray-600">{item.name}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {Math.round((item.value / 100) * totalTasks)} tasks
                  </div>
                </div>
              ))}
            </div>

            {/* Export Button */}
            <div className="flex justify-start">
              <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors shadow-sm">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskReport;