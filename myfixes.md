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
