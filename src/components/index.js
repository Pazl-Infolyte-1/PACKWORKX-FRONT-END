// // components/index.js
// export { default as AppBreadcrumb } from './AppBreadcrumb'
// export { default as AppHeader } from './AppHeader'
// export { default as AppSidebar } from './AppSidebar'  
// export { default as AppContent } from './AppContent'
// export { default as AppFooter } from './AppFooter'
// export { default as AppHeaderDropdown} from './header/AppHeaderDropdown'
// export { default as DocsComponents } from './DocsComponents'
// export { default as DocsIcons } from './DocsIcons'
// export { default as DocsLink } from './DocsLink'
// export { default as DocsExample } from './DocsExample'



// components/index.js - Fixed version

// Import each component first to check they exist
import AppBreadcrumb from './AppBreadcrumb'
import AppContent from './AppContent'
import AppFooter from './AppFooter'
import AppHeader from './AppHeader'
import AppHeaderDropdown from './header/AppHeaderDropdown'
import AppSidebar from './AppSidebar'
import DocsComponents from './DocsComponents'
import DocsIcons from './DocsIcons'
import DocsLink from './DocsLink'
import DocsExample from './DocsExample'

// Debug: Log each import to console
console.log('Component imports:', {
  AppBreadcrumb: !!AppBreadcrumb,
  AppContent: !!AppContent,
  AppFooter: !!AppFooter,
  AppHeader: !!AppHeader,
  AppHeaderDropdown: !!AppHeaderDropdown,
  AppSidebar: !!AppSidebar,
  DocsComponents: !!DocsComponents,
  DocsIcons: !!DocsIcons,
  DocsLink: !!DocsLink,
  DocsExample: !!DocsExample,
})

// Export as named exports
export {
  AppBreadcrumb,
  AppContent,
  AppFooter,
  AppHeader,
  AppHeaderDropdown,
  AppSidebar,
  DocsComponents,
  DocsIcons,
  DocsLink,
  DocsExample,
}