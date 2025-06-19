// ✅ VERIFIED WORKING COREUI ICONS ONLY
// Use this list to avoid import errors

export const CONFIRMED_WORKING_ICONS = {
  // ✅ VERIFIED - These icons definitely work
  cilOptions: 'cilOptions',
  cilSearch: 'cilSearch', 
  cilPlus: 'cilPlus',
  cilArrowTop: 'cilArrowTop',
  cilArrowBottom: 'cilArrowBottom',
  cilPeople: 'cilPeople',
  cilUser: 'cilUser',
  cilUserFemale: 'cilUserFemale',
  cilDollar: 'cilDollar',
  cilChart: 'cilChart',
  cilPhone: 'cilPhone',
  cilEnvelopeClosed: 'cilEnvelopeClosed',
  cilCalendar: 'cilCalendar',
  cilClock: 'cilClock',
  cilCheckCircle: 'cilCheckCircle',
  cilInfo: 'cilInfo',
  cilBell: 'cilBell',
  cilCloudDownload: 'cilCloudDownload',
  cilLocationPin: 'cilLocationPin',
  cilFilter: 'cilFilter',
}

// ❌ DO NOT USE - These icons cause import errors:
export const BROKEN_ICONS = [
  'cilTarget',           // → Use cilChart instead
  'cilTrendUp',          // → Use cilArrowTop instead  
  'cilTrendDown',        // → Use cilArrowBottom instead
  'cilExclamationTriangle', // → Use cilBell instead
  'cilFile',             // → Use cilChart instead
  'cilBullseye',         // → Use cilChart instead
  'cilGoal',             // → Use cilChart instead
  'cilWarning',          // → Use cilBell instead
  'cilAlert',            // → Use cilBell instead
]

// ✅ SAFE IMPORT TEMPLATE:
export const SAFE_IMPORT_EXAMPLE = `
import CIcon from '@coreui/icons-react'
import {
  cilOptions,
  cilSearch, 
  cilPlus,
  cilArrowTop,
  cilArrowBottom,
  cilPeople,
  cilUser,
  cilDollar,
  cilChart,
  cilPhone,
  cilEnvelopeClosed,
  cilCalendar,
  cilClock,
  cilCheckCircle,
  cilInfo,
  cilBell,
  cilCloudDownload,
  cilLocationPin,
  cilFilter,
} from '@coreui/icons'
`

// Icon replacement guide
export const ICON_REPLACEMENTS = {
  'cilTarget': 'cilChart',
  'cilTrendUp': 'cilArrowTop',
  'cilTrendDown': 'cilArrowBottom', 
  'cilExclamationTriangle': 'cilBell',
  'cilFile': 'cilChart',
  'cilBullseye': 'cilChart',
  'cilGoal': 'cilChart',
  'cilWarning': 'cilBell',
  'cilAlert': 'cilBell',
}

export default CONFIRMED_WORKING_ICONS