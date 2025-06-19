// Available CoreUI Icons for Dashboard
// Use this reference to avoid import errors

// CONFIRMED WORKING ICONS:
export const AVAILABLE_ICONS = {
  // Navigation & Actions
  cilOptions: 'cilOptions',          // Three dots menu
  cilSearch: 'cilSearch',            // Search icon
  cilFilter: 'cilFilter',            // Filter icon
  cilPlus: 'cilPlus',               // Plus/Add icon
  cilX: 'cilX',                     // Close/Remove icon
  
  // Arrows & Trends
  cilArrowTop: 'cilArrowTop',        // Up arrow
  cilArrowBottom: 'cilArrowBottom',  // Down arrow
  
  // Business & CRM
  cilPeople: 'cilPeople',            // Users/Leads icon
  cilUser: 'cilUser',                // Single user
  cilUserFemale: 'cilUserFemale',    // Female user
  cilDollar: 'cilDollar',            // Money/Revenue
  cilChart: 'cilChart',              // Charts/Analytics
  cilCheckCircle: 'cilCheckCircle',  // Success/Completed
  
  // Communication
  cilPhone: 'cilPhone',              // Phone calls
  cilEnvelopeClosed: 'cilEnvelopeClosed', // Email
  cilBell: 'cilBell',                // Notifications
  
  // Time & Calendar
  cilClock: 'cilClock',              // Time/Activities
  cilCalendar: 'cilCalendar',        // Calendar/Meetings
  
  // Status & Info
  cilInfo: 'cilInfo',                        // Information
  cilExclamationTriangle: 'cilExclamationTriangle', // Warning
  cilCheckCircle: 'cilCheckCircle',          // Success
  
  // Actions
  cilCloudDownload: 'cilCloudDownload', // Download/Export
  cilLocationPin: 'cilLocationPin',     // Location
}

// ICONS TO AVOID (NOT AVAILABLE):
// cilTarget - Use cilChart instead
// cilFile - Use cilChart instead  
// cilBullseye - Use cilChart instead
// cilGoal - Use cilChart instead
// cilTrendUp - Use cilArrowTop instead
// cilTrendDown - Use cilArrowBottom instead

// Usage in components:
// import CIcon from '@coreui/icons-react'
// import { cilChart, cilPeople, cilDollar } from '@coreui/icons'
// 
// <CIcon icon={cilChart} />

export default AVAILABLE_ICONS