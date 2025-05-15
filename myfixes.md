# Component Fixes Log

This file tracks the fixes applied to SDC components.

### Component: service-card
- Action: Fixed
- Description: 
  - Removed unnecessary `is not empty` checks and replaced with direct variable testing
  - Fixed boolean default values by using ternary conditional expressions instead of default filter

### Component: promo-card
- Action: Fixed
- Description: 
  - Fixed schema definition by adding missing items property to the tags array
  - Added proper type definitions for tag objects including text, url, and is_new_window properties

### Component: event-card
- Action: Fixed
- Description: 
  - Enhanced the tag item object schema with proper property definitions 
  - Added text, url, and is_new_window properties to define the tag structure

### Component: slide
- Action: Fixed
- Description: 
  - Added proper definition for tags array items structure
  - Replaced null ternary operator (??) with default filter for date_end_iso parameter

### Component: skip-link
- Action: Fixed
- Description: 
  - Added attributes property to component schema to fix unused variable warning
  - Updated component Twig template to use attributes parameter
  - Updated component documentation to include attributes parameter

### Component: footer
- Action: Fixed
- Description: 
  - Added attributes property to component schema to fix unused variable warning
  - Updated Twig template to properly use the attributes parameter
  - Updated component documentation to include attributes parameter

### Component: mobile-navigation
- Action: Fixed
- Description: 
  - Added attributes property to component schema to fix unused variable warning
  - Updated Twig template to render the HTML attributes parameter
  - Updated component documentation to include attributes parameter

### Component: mobile-navigation-trigger
- Action: Fixed
- Description: 
  - Added attributes property to component schema to fix unused variable warning
  - Updated Twig template to combine custom attributes with default attributes
  - Updated component documentation to include attributes parameter

### Component: campaign
- Action: Fixed
- Description: 
  - Enhanced the tag item object schema with proper property definitions
  - Added text, url, and is_new_window properties to define the tag structure

### Component: header
- Action: Fixed
- Description: 
  - Added attributes property to component schema to fix unused variable warning
  - Updated Twig template to properly use the attributes parameter
  - Updated component documentation to include attributes parameter

### Component: text-icon
- Action: Skipped
- Reason: 
  - The text-icon component is a utility component without a container element
  - Adding a wrapper span element to apply attributes causes test failures across many components
  - This component is used by other components like links and buttons which handle their own attributes

### Component: tag-list
- Action: Fixed
- Description:
  - Fixed schema definition by adding proper items structure to the tags array
  - Added string type definition for tag items
  - This ensures proper validation of the tags array in the component schema
