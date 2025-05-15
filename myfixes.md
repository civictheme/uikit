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

### Component: grid
- Action: Fixed
- Description:
  - Fixed schema definition by adding proper items structure to the items array
  - Replaced boolean default filters with ternary conditions for use_container, is_fluid, and fill_width
  - This ensures proper validation of the boolean properties and items array in the component schema

### Component: menu
- Action: Fixed
- Description:
  - Fixed schema definition by adding proper items structure to the items array with detailed menu item properties
  - Fixed unknown variable error by removing `classes` parameter from the menu_links_below macro call
  - Added comprehensive item structure including title, url, below, attributes, and link properties

### Component: mobile-navigation-menu
- Action: Fixed
- Description:
  - Fixed unused variables issues by removing the unused `parent_key` parameter from the menu_links macro
  - Fixed unused `key` variable by using `for item in items` instead of `for key, item in items`
  - Fixed unknown variable error by replacing `classes` with `modifier_class` in the menu_links_below call
  - Maintained compatibility with related components to ensure tests continue to pass

### Component: group-filter
- Action: Fixed
- Description:
  - Fixed unused variable warning for `filters_slot` by renaming the `filters` block to `filters_slot`
  - This ensures the block name matches the slot name defined in the component schema
  - Maintained the same functionality while fixing the validation issue

### Component: promo
- Action: Fixed
- Description:
  - Fixed ternary test with boolean result issue in the is_contained variable setting
  - Replaced complex conditional expression with a simpler ternary operator
  - Changed from `is_contained is not defined or is_contained != false ? true : false` to `is_contained is defined ? is_contained : true`
  - This maintains the same functionality while fixing the validation issue

### Component: basic-content
- Action: Fixed
- Description:
  - Fixed ternary test with boolean result issue in the is_contained variable setting
  - Replaced complex conditional expression with a simpler ternary operator
  - Changed from `is_contained is not defined or is_contained != false ? true : false` to `is_contained is defined ? is_contained : true`
  - This maintains the same functionality while fixing the validation issue

### Component: back-to-top
- Action: Skipped
- Reason:
  - Attempted to add attributes property and usage to fix unused variable warning
  - Adding attributes to the component broke tests for the page component
  - The back-to-top component is embedded in the page component which relies on specific HTML structure
  - Making this change would require updating multiple snapshots across dependent components

### Component: field
- Action: Skipped
- Reason:
  - Component has multiple chained ternary operations which are flagged in validation
  - Attempted to fix by using intermediate variables but this broke tests due to whitespace changes
  - Component is used by many other components and changing it would require updating numerous snapshots
  - Decision was made to skip to avoid breaking dependent components

### Component: snippet
- Action: Fixed
- Description:
  - Fixed schema definition by adding proper items structure to the tags array
  - Added object type definition with text, url, and is_new_window properties for tag items
  - This ensures proper validation of the tags array in the component schema

### Component: attachment
- Action: Fixed
- Description:
  - Replaced null ternary operator (??) with default filter
  - Changed from `file.ext ?? file.size` to `file.ext|default(file.size)` in the extension parameter
  - This maintains the same functionality while following Twig best practices

### Component: paragraph
- Action: Fixed
- Description:
  - Fixed boolean default filter usage with a ternary condition
  - Changed from `allow_html|default(false)` to `allow_html is defined ? allow_html : false`
  - This maintains the same functionality while avoiding the default filter with booleans

### Component: label
- Action: Fixed
- Description:
  - Fixed boolean default filter usage with a ternary condition
  - Changed from `allow_html|default(false)` to `allow_html is defined ? allow_html : false`
  - This maintains the same functionality while avoiding the default filter with booleans

### Component: field-description
- Action: Fixed
- Description:
  - Fixed boolean default filter usage with a ternary condition
  - Changed from `allow_html|default(false)` to `allow_html is defined ? allow_html : false`
  - This maintains the same functionality while avoiding the default filter with booleans

### Component: field-message
- Action: Fixed
- Description:
  - Fixed boolean default filter usage with a ternary condition
  - Changed from `allow_html|default(false)` to `allow_html is defined ? allow_html : false`
  - This maintains the same functionality while avoiding the default filter with booleans

### Component: item-list
- Action: Fixed
- Description:
  - Fixed schema definition by adding proper items structure to items array
  - Added string type definition for list items
  - This ensures proper validation of the items array in the component schema

### Component: layout
- Action: Fixed
- Description:
  - Fixed multiple boolean default filter issues by replacing them with ternary conditions
  - Changed from `hide_sidebar_left|default(false)` to `hide_sidebar_left is defined ? hide_sidebar_left : false`
  - Changed from `hide_sidebar_right|default(false)` to `hide_sidebar_right is defined ? hide_sidebar_right : false`
  - Changed from `is_contained|default(false)` to `is_contained is defined ? is_contained : false`
  - This maintains the same functionality while avoiding the default filter with booleans

### Component: button
- Action: Fixed
- Description:
  - Fixed boolean default filter issues in the text-icon include
  - Changed from `icon_group_disabled|default(false)` to `icon_group_disabled is defined ? icon_group_disabled : false`
  - Changed from `icon_single_only|default(false)` to `icon_single_only is defined ? icon_single_only : false`
  - This maintains the same functionality while avoiding the default filter with booleans

### Component: link
- Action: Fixed
- Description:
  - Fixed boolean default filter issues in the text-icon include
  - Changed from `icon_group_disabled|default(false)` to `icon_group_disabled is defined ? icon_group_disabled : false`
  - Changed from `icon_single_only|default(false)` to `icon_single_only is defined ? icon_single_only : false`
  - This maintains the same functionality while avoiding the default filter with booleans
