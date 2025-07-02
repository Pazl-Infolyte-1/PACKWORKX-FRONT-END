import React, { useEffect, useState } from 'react';
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
import { reportsApi } from '../../api/reports';
import ReportsTable from '../../components/New/ReportsTable';
import CommonReportLayout from './CommonReportLayout';


const ClientReport = () => {

 return <CommonReportLayout
 clientEntity={true}
 reportTitle="Client Report"
  fetchReportsApi={reportsApi.getClientReports} 
    exportReports={reportsApi.exportClientReports} 
  />;
};

export default ClientReport;