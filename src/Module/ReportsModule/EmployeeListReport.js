

import React, { useState } from 'react';
import { Pie } from 'recharts';
import { Filter, Download, ChevronDown } from 'lucide-react';
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'
import Drawer from '../../components/Drawer/Drawer';
import dayjs from 'dayjs'
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';


const EmployeeListReport = () => {
const [startDate, setStartDate] = useState('2024-01-01')
  const [endDate, setEndDate] = useState('2024-12-31')
  const [status, setStatus] = useState('all');
  const [project, setProject] = useState('all');
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);


   const handleRangeChange = (range) => {
  const today = dayjs()
  let start = today
  let end = today

  switch (range) {
	case 'today':
	  start = today.startOf('day')
	  end = today.endOf('day')
	  break
	case '30days':
	  start = today.subtract(30, 'day')
	  break
	case 'thisMonth':
	  start = today.startOf('month')
	  end = today.endOf('month')
	  break
	case 'lastMonth':
	  start = today.subtract(1, 'month').startOf('month')
	  end = today.subtract(1, 'month').endOf('month')
	  break
	case '90days':
	  start = today.subtract(90, 'day')
	  break
	case '6months':
	  start = today.subtract(6, 'month')
	  break
	case '1year':
	  start = today.subtract(1, 'year')
	  break
	case 'custom':
	  // You might want to show a date picker manually here
	  return
	default:
	  return
  }

  setStartDate(start.format('YYYY-MM-DD'))
  setEndDate(end.format('YYYY-MM-DD'))
}

const data01 = [
  { x: 10, y: 30 },
  { x: 30, y: 200 },
  { x: 45, y: 100 },
  { x: 50, y: 400 },
  { x: 70, y: 150 },
  { x: 100, y: 250 },
];

const data02 = [
  { x: 30, y: 20 },
  { x: 50, y: 180 },
  { x: 75, y: 240 },
  { x: 100, y: 100 },
  { x: 120, y: 190 },
];

const summaryData = [
  { name: 'Completed', value: 65, fill: '#10B981' },
  { name: 'In Progress', value: 25, fill: '#F59E0B' },
  { name: 'Pending', value: 10, fill: '#3B82F6' }
];

const totalTasks = 100; // Or dynamically calculate if needed

const JoinedLineChart = () => (
  <ResponsiveContainer width="100%" height={300}>
    <ComposedChart
      margin={{ top: 20, right: 30, bottom: 20, left: 20 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="x" type="number" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line dataKey="y" data={data01} name="Line A" stroke="#8884d8" dot={false} />
      <Line dataKey="y" data={data02} name="Line B" stroke="#82ca9d" dot={false} />
    </ComposedChart>
  </ResponsiveContainer>
);



  return (
   <div className="min-h-screen bg-gray-50">
	  {/* Header */}
   <div className="bg-white border-b border-gray-200">
  <div className="px-4 sm:px-6 py-3">
	<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-y-1 sm:gap-y-0">
	  
	  {/* Title and Breadcrumb in one row */}
	  <div className="flex items-center space-x-4">
		<h1 className="text-lg sm:text-xl font-semibold text-gray-900">Employee Report</h1>
		<nav className="flex items-center text-sm text-gray-500" aria-label="Breadcrumb">
		  <span>Home</span>
		  <span className="mx-2">•</span>
		  <span className="text-gray-700">Task Report</span>
		</nav>
	  </div>

	</div>
  </div>
</div>

	  {/* Filters */}
	 <div className="bg-white border-b border-gray-200">
  <div className="px-4 sm:px-6 py-3">
	<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-y-3">
	  
	  {/* Filter Controls */}
	  <div className="flex flex-col sm:flex-row flex-wrap gap-3">
		{/* Range + Date Inputs */}
		<div className="flex flex-wrap items-center gap-3">
		<select
  onChange={(e) => handleRangeChange(e.target.value)}
  className="border border-gray-300 rounded-md px-2 py-1.5 text-sm text-gray-700"
  defaultValue=""
>
  <option value="" disabled>Select Range</option>
  <option value="today">Today</option>
  <option value="30days">Last 30 Days</option>
  <option value="thisMonth">This Month</option>
  <option value="lastMonth">Last Month</option>
  <option value="90days">Last 90 Days</option>
  <option value="6months">Last 6 Months</option>
  <option value="1year">Last 1 Year</option>
  <option value="custom">Custom Range</option>
</select>


		  <span className="text-sm font-medium text-gray-700">Duration</span>
		  <input
			type="date"
			value={startDate}
			onChange={(e) => setStartDate(e.target.value)}
			className="border border-gray-300 rounded-md px-3 py-1.5 text-sm"
		  />
		  <span className="text-sm text-gray-500">To</span>
		  <input
			type="date"
			value={endDate}
			onChange={(e) => setEndDate(e.target.value)}
			className="border border-gray-300 rounded-md px-3 py-1.5 text-sm"
		  />
		</div>

		{/* Status Filter */}
		<div className="flex items-center gap-2">
		  <span className="text-sm font-medium text-gray-700">Status</span>
		  <div className="relative">
			<select
			  value={status}
			  onChange={(e) => setStatus(e.target.value)}
			  className="appearance-none border border-gray-300 rounded-md px-3 py-1.5 pr-8 text-sm bg-white"
			>
			  <option value="all">All</option>
			  <option value="completed">Completed</option>
			  <option value="in-progress">In Progress</option>
			  <option value="pending">Pending</option>
			</select>
			<ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
		  </div>
		</div>

		{/* Project Filter */}
		<div className="flex items-center gap-2">
		  <span className="text-sm font-medium text-gray-700">Project</span>
		  <div className="relative">
			<select
			  value={project}
			  onChange={(e) => setProject(e.target.value)}
			  className="appearance-none border border-gray-300 rounded-md px-3 py-1.5 pr-8 text-sm bg-white"
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

	  {/* Filter Drawer Button */}
	  <div className="pt-2 lg:pt-0">
		<button
		  onClick={() => setIsDrawerOpen(true)}
		  className="flex items-center space-x-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
		>
		  <Filter className="w-4 h-4" />
		  <span>Filter</span>
		</button>
	  </div>
	</div>
  </div>
</div>

	  {/* Main Content */}
   <div className="min-h-screen bg-gray-50">
  {/* Container */}
  <div className="px-4 sm:px-6 py-4">
	<div className="bg-white rounded-lg shadow-sm border border-gray-200">
	  {/* Pie Chart + Stats */}
	  <div className="p-4">
		<div className="flex flex-col lg:flex-row lg:items-start lg:space-x-8 space-y-4 lg:space-y-0 mb-6">
		  
		  {/* Pie Chart + Export */}
		  <div className="flex-shrink-0 flex flex-col items-center justify-between h-full w-full sm:w-auto">
<div className="flex items-center justify-center w-full lg:w-[500px] h-[250px]">
<JoinedLineChart />
</div>


			<button className="mt-3 flex items-center space-x-1 text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md transition-colors shadow-sm">
			  <Download className="w-3 h-3" />
			  <span>Export</span>
			</button>
		  </div>

		  {/* Stats Cards */}
		  <div className="flex-1 flex flex-col justify-center w-full">
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
			  {summaryData.map((item, index) => (
  <div key={index} className="bg-gray-50 rounded-lg p-2.5 flex items-center space-x-3">
	<div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.fill }} />
	<div className="flex-1">
	  <div className="flex items-center justify-between">
		<span className="text-sm font-medium text-gray-700">{item.name}</span>
		<span className="text-base font-bold text-gray-900">{item.value}%</span>
	  </div>
	  <div className="text-xs text-gray-500">
		{Math.round((item.value / 100) * totalTasks)} tasks completed
	  </div>
	</div>
  </div>
))}

			</div>

			{/* Total Summary */}
			<div className="mt-4 p-2.5 bg-blue-50 rounded-lg border border-blue-200">
			  <div className="flex items-center justify-between">
				<span className="text-sm font-medium text-blue-900">Total Tasks</span>
				<span className="text-base font-bold text-blue-900">{totalTasks}</span>
			  </div>
			  <div className="text-xs text-blue-700">
				Across all projects and statuses
			  </div>
			</div>
		  </div>
		</div>
	  </div>

	  {/* Table */}
	<div className="overflow-x-auto">
  <CTable
	align="middle"
	className="mb-0 border text-sm min-w-[700px]"
	hover
	responsive
  >
	<CTableHead className="bg-light text-xs text-gray-500">
	  <CTableRow>
		<CTableHeaderCell scope="col">Code</CTableHeaderCell>
		<CTableHeaderCell scope="col">Task</CTableHeaderCell>
		<CTableHeaderCell scope="col">Project</CTableHeaderCell>
		<CTableHeaderCell scope="col">Client</CTableHeaderCell>
		<CTableHeaderCell scope="col">Due Date</CTableHeaderCell>
	  </CTableRow>
	</CTableHead>
	<CTableBody>
	  <CTableRow>
		<CTableDataCell>PW-99</CTableDataCell>
		<CTableDataCell>Track payment made and advanced paid</CTableDataCell>
		<CTableDataCell>Packworkz</CTableDataCell>
		<CTableDataCell>-</CTableDataCell>
		<CTableDataCell className="text-danger">11-03-2025</CTableDataCell>
	  </CTableRow>
	  <CTableRow>
		<CTableDataCell>PW-98</CTableDataCell>
		<CTableDataCell>APIs to write rejections to DB</CTableDataCell>
		<CTableDataCell>Packworkz</CTableDataCell>
		<CTableDataCell>-</CTableDataCell>
		<CTableDataCell className="text-danger">11-03-2025</CTableDataCell>
	  </CTableRow>
	  <CTableRow>
		<CTableDataCell>PW-97</CTableDataCell>
		<CTableDataCell>Partially reject or accept PO</CTableDataCell>
		<CTableDataCell>Packworkz</CTableDataCell>
		<CTableDataCell>-</CTableDataCell>
		<CTableDataCell className="text-danger">11-03-2025</CTableDataCell>
	  </CTableRow>
	</CTableBody>
  </CTable>
</div>
	</div>
  </div>
</div>

<Drawer
  maxWidth="300px"
  isOpen={isDrawerOpen}
  onClose={() => setIsDrawerOpen(false)}
  title="Filters"
>
  <div className="p-4 space-y-4 text-sm text-gray-700">

	{/* Client */}
	<div>
	  <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
	  <select className="w-full border rounded-md px-2 py-1.5">
		<option>All</option>
		<option>Packworkz</option>
		<option>Globex Corp</option>
		<option>Acme Inc</option>
	  </select>
	</div>

	{/* Assigned To */}
	<div>
	  <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
	  <select className="w-full border rounded-md px-2 py-1.5">
		<option>All</option>
		<option>John Doe</option>
		<option>Alice Smith</option>
		<option>Michael Lee</option>
	  </select>
	</div>

	{/* Assigned By */}
	<div>
	  <label className="block text-sm font-medium text-gray-700 mb-1">Assigned By</label>
	  <select className="w-full border rounded-md px-2 py-1.5">
		<option>All</option>
		<option>Manager 1</option>
		<option>Supervisor A</option>
	  </select>
	</div>

	{/* Label */}
	<div>
	  <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
	  <select className="w-full border rounded-md px-2 py-1.5">
		<option>All</option>
		<option>Urgent</option>
		<option>Review</option>
		<option>Blocked</option>
	  </select>
	</div>

	{/* Task Category */}
	<div>
	  <label className="block text-sm font-medium text-gray-700 mb-1">Task Category</label>
	  <select className="w-full border rounded-md px-2 py-1.5">
		<option>All</option>
		<option>Development</option>
		<option>Testing</option>
		<option>Design</option>
	  </select>
	</div>

	{/* Billable Task */}
	<div>
	  <label className="block text-sm font-medium text-gray-700 mb-1">Billable Task</label>
	  <select className="w-full border rounded-md px-2 py-1.5">
		<option>All</option>
		<option>Yes</option>
		<option>No</option>
	  </select>
	</div>

	{/* Clear Button */}
	<div className="pt-4">
	  <button
		onClick={() => console.log('Clear filters')}
		className="px-4 py-1.5 text-sm border rounded hover:bg-gray-100"
	  >
		Clear
	  </button>
	</div>
  </div>
</Drawer>


		</div>
	  
  );
};

export default EmployeeListReport;