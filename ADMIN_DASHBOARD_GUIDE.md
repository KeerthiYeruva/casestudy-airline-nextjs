# Admin Dashboard - Passengers Tab User Guide

## Overview
The **Admin Dashboard - Passengers Tab** is the central hub for managing all passenger data across flights. This interface is designed for airline administrators to add, edit, delete, and manage passenger information with comprehensive filtering and validation capabilities.

---

## Accessing the Admin Dashboard

### Prerequisites
- **User Role**: Admin access required
- **Authentication**: Must be logged in with admin credentials

### Navigation
1. Log in to the Airline Management System
2. Click the **"Admin"** button in the top navigation bar
3. Select the **"Passengers"** tab (default view)

---

## Main Features

### 1. Passenger Management Overview

The Passengers tab is organized into several key sections:
- **Flight Filter & Search** (top row)
- **Missing Information Filters** (second row)
- **Action Buttons** (Add Passenger, Reset Data)
- **Passenger Table** (main display area)

---

## Flight Selection and Search

### Flight Filter Dropdown
**Purpose**: Filter passengers by specific flight

**How to Use**:
1. Click the **"Select Flight"** dropdown at the top
2. Choose from available flights (e.g., "AA101 - NYC to LAX")
3. The passenger list automatically updates to show only passengers on that flight
4. Select **"All Flights"** to view all passengers across all flights

**Visual Indicator**: Selected flight appears in the dropdown field

---

### Search by Passenger Name
**Purpose**: Quickly find specific passengers

**How to Use**:
1. Type the passenger's name in the **"Search by Name"** field
2. Search is case-insensitive and matches partial names
3. Results update in real-time as you type
4. Works in combination with flight filter and missing info filters

**Example**: 
- Type "John" to find "John Doe", "Johnny Smith", etc.
- Type "doe" to find "John Doe", "Jane Doe", etc.

---

## Missing Information Filters

### Purpose
Quickly identify passengers with incomplete data that needs attention before flight departure.

### Available Filters

#### 1. Missing Passport
**Checkbox**: "Missing Passport"
- Shows passengers without passport numbers
- Critical for international flights
- Highlighted with ⚠️ warning badge in passenger table

#### 2. Missing Address
**Checkbox**: "Missing Address"
- Shows passengers without address information
- May be required for customs/immigration

#### 3. Missing Date of Birth
**Checkbox**: "Missing Date of Birth"
- Shows passengers without DOB
- Important for age-related services (child meals, infant status)

### How to Use Filters
1. **Select Multiple**: Check any combination of filters
2. **View Results**: Passenger list updates automatically
3. **Clear All**: Click the **"Clear Filters"** button to reset all checkboxes and view all passengers

**Tip**: Use filters to prioritize data entry tasks before flight departure

---

## Passenger Table

### Column Layout
| Column | Description |
|--------|-------------|
| **Name** | Passenger full name |
| **Flight** | Flight number and route |
| **Seat** | Assigned seat number (e.g., "12A") |
| **Booking Ref** | Booking reference code (format: ABC1234567) |
| **Passport** | Passport number (⚠️ if missing) |
| **Address** | Home address (⚠️ if missing) |
| **DOB** | Date of birth (⚠️ if missing) |
| **Wheelchair** | ♿ icon if wheelchair assistance required |
| **Infant** | 👶 icon if traveling with infant |
| **Actions** | Edit and Delete buttons |

### Visual Indicators
- **⚠️ Warning Badge**: Appears on missing critical information (red background)
- **♿ Wheelchair Icon**: Indicates passenger requires wheelchair assistance
- **👶 Infant Icon**: Indicates passenger traveling with infant
- **Hover Effects**: Table rows highlight on hover for better readability

---

## Adding a New Passenger

### Step-by-Step Process

#### 1. Open Add Passenger Dialog
- Click the **"Add Passenger"** button (top right of table)
- A dialog window opens with a blank form

#### 2. Fill Required Fields

**Flight Selection** (Required)
- Dropdown showing all available flights
- Format: "AA101 - NYC to LAX (08:00)"
- **Validation**: Cannot proceed without selecting a flight

**Personal Information** (Required)
| Field | Format | Example | Validation |
|-------|--------|---------|------------|
| **Name** | Full name | John Doe | Required, minimum 2 characters |
| **Passport Number** | Alphanumeric | AB123456 | Optional, alphanumeric characters |
| **Address** | Street address | 123 Main St, City | Optional, minimum 5 characters |
| **Date of Birth** | YYYY-MM-DD | 1990-05-15 | Required, cannot be future date |

**Booking Reference** (Auto-generated)
- Format: 3 uppercase letters + 3-7 digits
- Example: `BKG1234567`
- Auto-fills with timestamp-based reference
- Helper text displays format requirement
- Can be manually edited if needed

**Special Needs**
- ☑️ **Wheelchair Assistance**: Check if passenger needs wheelchair
- ☑️ **Traveling with Infant**: Check if passenger has infant
- ☑️ **Check-In Status**: Pre-check if passenger is already checked in

**Meal Preference** (Required)
- Dropdown with meal options
- Default: "None"
- Options include: Vegetarian, Vegan, Gluten-Free, Kosher, Halal, etc.

#### 3. Inline Validation
**Real-time Field Validation**:
- Error messages appear **below each field** (not as toast notifications)
- Fields validate on blur (when you click away)
- All required fields must be filled before seat selection

**Common Validation Messages**:
- "Name is required"
- "Date of birth is required"
- "Date of birth cannot be in the future"
- "Booking reference must be 3 letters + 3-7 digits (e.g., ABC123)"
- "Please select a flight"

#### 4. Seat Selection (Progressive)
**When Enabled**:
- Only after all required fields are filled correctly
- **"Select Seat"** button becomes clickable (blue)

**How to Select Seat**:
1. Click the **"Select Seat"** button
2. A seat selection dialog opens showing:
   - Visual 10x6 seat map (rows 1-10, columns A-F)
   - Color-coded seat availability
3. Click on an available seat
4. Selected seat appears in the form

**Seat Map Color Codes**:
- 🟢 **Green**: Your selected seat
- 🔴 **Red**: Occupied by another passenger (disabled)
- 🟦 **Blue**: Available seat (clickable)
- **Aisle**: Empty space between columns C and D

**Seat Selection Rules**:
- Can only select from available seats
- Seat availability is flight-specific
- Previously occupied seats cannot be selected
- Must select a seat before saving passenger

#### 5. Save Passenger
- Click the **"Add"** button (bottom right of dialog)
- System validates all fields again
- Success message appears: "Passenger added successfully"
- Dialog closes automatically
- New passenger appears in the table

### Error Handling
**If Add Fails**:
- Error message displays actual API validation errors
- Examples:
  - "Passenger with this booking reference already exists"
  - "Seat 12A is already occupied on this flight"
  - "Invalid date of birth format"
- Fix the indicated errors and try again

---

## Editing an Existing Passenger

### Step-by-Step Process

#### 1. Open Edit Dialog
- Locate the passenger in the table
- Click the **✏️ Edit** button in the Actions column
- Dialog opens with pre-filled passenger data

#### 2. Modify Information
- All fields are editable
- Same validation rules apply as adding new passenger
- Seat selection available via **"Change Seat"** button
- Booking reference can be updated

#### 3. Change Seat
- Click **"Change Seat"** button
- Seat map shows current selection highlighted in green
- Other occupied seats shown in red
- Click a new available seat to change
- Changes reflect immediately in the form

#### 4. Update Validation
- Fields validate on blur (same as add)
- Error messages appear below fields
- All required fields must remain filled

#### 5. Save Changes
- Click the **"Update"** button
- Success message: "Passenger updated successfully"
- Table updates with new information
- Dialog closes automatically

### What Can Be Changed
✅ **Allowed**:
- Name, Passport, Address, Date of Birth
- Booking reference
- Flight assignment (reassign to different flight)
- Seat number (within same or new flight)
- Wheelchair and infant status
- Check-in status
- Meal preference

❌ **Not Allowed**:
- Passenger ID (system-generated, immutable)

---

## Deleting a Passenger

### Warning
⚠️ **Deletion is permanent and cannot be undone!**

### Step-by-Step Process

#### 1. Initiate Delete
- Locate the passenger in the table
- Click the **🗑️ Delete** button in the Actions column
- **Confirmation dialog** appears

#### 2. Confirm Deletion
**Dialog Content**:
- **Title**: "Confirm Delete"
- **Message**: "Are you sure you want to delete [Passenger Name]? This action cannot be undone."
- **Severity**: Warning (yellow background)

**Options**:
- **Cancel**: Closes dialog, no action taken
- **Confirm**: Proceeds with deletion

#### 3. Result
- Success message: "Passenger deleted successfully"
- Passenger removed from table immediately
- Seat becomes available on the flight

### When to Delete
- Booking cancellation
- Duplicate entries
- Test data cleanup
- No-show passengers (after flight departure)

---

## Reset Data Feature

### Purpose
Restore the system to default/initial passenger data. Useful for:
- Testing and demos
- Recovering from data corruption
- Resetting to known good state

### How to Use

#### 1. Access Reset
- Click the **"Reset Data"** button (top right, near Add Passenger)
- **Warning dialog** appears

#### 2. Understand the Impact
**Dialog Message**:
"Are you sure you want to reset all passenger data to initial state? This will remove all changes and cannot be undone."

**What Gets Reset**:
- All passengers revert to initial demo data
- Custom passengers added are removed
- Edited passenger information is reverted
- Deleted demo passengers are restored

**What's Preserved**:
- Flight information (not affected)
- Services and menu items (not affected)
- User authentication (not affected)

#### 3. Confirm Reset
**Options**:
- **Cancel**: Closes dialog, no reset occurs
- **Confirm**: Resets data immediately

#### 4. Result
- Success message: "Data reset to initial state successfully"
- Passenger table reloads with demo data
- All filters and selections are cleared

### ⚠️ Use with Caution
This feature is destructive. Only use when:
- You want to start fresh
- You're demonstrating the system
- You need to recover from errors

---

## Data Validation Rules

### Booking Reference Format
**Pattern**: 3 uppercase letters + 3-7 digits

**Valid Examples**:
- `ABC123` ✅
- `BKG1234567` ✅
- `XYZ9876543` ✅

**Invalid Examples**:
- `AB123` ❌ (only 2 letters)
- `ABCD123` ❌ (4 letters)
- `ABC12` ❌ (only 2 digits)
- `abc123` ❌ (lowercase letters)

**Helper Text**: "Format: 3 letters + 3-7 digits (e.g., ABC123, BKG1234567)"

### Date of Birth Rules
- Format: YYYY-MM-DD
- Must be a valid date
- **Cannot be in the future**
- Maximum date: Today's date
- HTML5 date picker enforces these rules

**Examples**:
- `1990-05-15` ✅ (valid past date)
- `2025-12-31` ❌ (future date - blocked by picker)
- `1900-01-01` ✅ (very old date - valid)

### Name Validation
- Minimum: 2 characters
- Accepts letters, spaces, hyphens, apostrophes
- Examples: "John Doe", "Mary-Jane", "O'Brien"

### Passport Validation
- Optional field
- Alphanumeric characters
- Typical length: 6-9 characters
- No specific format enforced (varies by country)

### Address Validation
- Optional field
- Minimum: 5 characters when provided
- Free-form text field

---

## Keyboard Shortcuts

### General Navigation
- **Tab**: Move between form fields
- **Shift + Tab**: Move backwards between fields
- **Enter**: Submit form (when in text field)
- **Escape**: Close open dialog

### Table Interactions
- **Arrow Keys**: Navigate table cells (with accessibility features)
- **Tab**: Navigate to action buttons in each row

### Search and Filter
- **Ctrl/Cmd + F**: Quick focus on search field (browser default)

---

## Common Workflows

### Workflow 1: Add Multiple Passengers to a Flight
1. Select the target flight from flight dropdown
2. Click "Add Passenger" button
3. Fill all required fields
4. Select seat from seat map
5. Click "Add"
6. Repeat steps 2-5 for each passenger
7. Passengers appear in filtered list immediately

### Workflow 2: Find and Fix Missing Passport Numbers
1. Check the "Missing Passport" checkbox
2. Review filtered list of passengers
3. Click "Edit" on first passenger
4. Add passport number
5. Click "Update"
6. Passenger automatically removed from filtered view
7. Repeat for remaining passengers

### Workflow 3: Reassign Passenger to Different Flight
1. Find passenger in table (use search if needed)
2. Click "Edit" button
3. Change flight selection in dropdown
4. Click "Change Seat" to select new seat on new flight
5. Click "Update"
6. Passenger now appears in new flight's passenger list

### Workflow 4: Bulk Check Missing Information Before Departure
1. Select specific flight from dropdown
2. Check all three missing info filters:
   - Missing Passport
   - Missing Address  
   - Missing DOB
3. Review passengers needing attention
4. Edit each passenger to complete information
5. Click "Clear Filters" to verify all data complete

---

## Troubleshooting

### Problem: "Add" Button Not Working
**Possible Causes**:
- Not all required fields are filled
- Validation errors present
- No seat selected

**Solution**:
1. Check for red error messages below fields
2. Ensure all required fields have values
3. Verify date of birth is not in future
4. Check booking reference format
5. Click "Select Seat" and choose a seat

---

### Problem: Can't See New Passenger After Adding
**Possible Causes**:
- Filters are active that exclude the passenger
- Wrong flight selected in filter

**Solution**:
1. Click "Clear Filters" button
2. Set flight filter to "All Flights"
3. Use search to find passenger by name

---

### Problem: Seat Already Occupied Error
**Cause**: Another passenger already has that seat on the same flight

**Solution**:
1. In seat map dialog, look for available seats (blue)
2. Avoid red seats (occupied)
3. Select a different seat
4. If all seats full, flight is at capacity

---

### Problem: Booking Reference Format Error
**Cause**: Booking reference doesn't match required format

**Solution**:
1. Use format: 3 UPPERCASE letters + 3-7 digits
2. Examples: ABC123, XYZ1234567
3. Auto-generated reference always valid
4. If manually editing, follow format exactly

---

### Problem: Date Picker Showing Future Dates
**Cause**: Browser may not enforce HTML5 date constraints

**Solution**:
1. Manually ensure date is not in future
2. System validates on submit
3. Error message will appear if date invalid
4. Use format YYYY-MM-DD

---

### Problem: Reset Data Button Not Working
**Possible Causes**:
- API connection issue
- Confirmation not completed

**Solution**:
1. Ensure you clicked "Confirm" in dialog
2. Check network connectivity
3. Refresh page and try again
4. Check browser console for errors

---

## Best Practices

### Data Entry
1. ✅ **Always validate before saving**: Check for error messages
2. ✅ **Use consistent formats**: Follow booking reference and date formats
3. ✅ **Complete critical fields first**: Name, DOB, Flight before selecting seat
4. ✅ **Double-check seat assignments**: Verify correct seat on seat map

### Passenger Management
1. ✅ **Regular audits**: Use missing info filters to find incomplete data
2. ✅ **Flight-specific views**: Filter by flight when managing specific departures
3. ✅ **Search for duplicates**: Before adding, search to avoid duplicate bookings
4. ✅ **Update rather than delete**: Edit existing records when possible

### System Maintenance
1. ✅ **Backup before reset**: Reset data is permanent
2. ✅ **Test with filters**: Use filters to verify data integrity
3. ✅ **Clear filters after use**: Avoid confusion with filtered views

---

## Tips and Tricks

### Efficient Data Entry
- **Tab Navigation**: Use Tab key to move quickly between fields
- **Auto-generated References**: Let system generate booking references
- **Copy-Paste Passport Numbers**: From external systems when available
- **Bulk Operations**: Filter by flight and update multiple passengers

### Finding Passengers Quickly
- **Partial Name Search**: Type few letters of name
- **Combine Filters**: Use flight + missing info filters together
- **Sort by Column**: Click column headers to sort (if enabled)

### Seat Management
- **Visual Seat Map**: Easier than typing seat numbers
- **Aisle Recognition**: Note space between C and D columns
- **Availability at Glance**: Color coding shows seat status instantly

### Error Prevention
- **Review Before Submit**: Check all fields before clicking Add/Update
- **Use Helper Text**: Read format hints below fields
- **Validate Early**: Tab through fields to trigger validation before submitting

---

## Accessibility Features

### Screen Reader Support
- All form fields have proper labels
- Error messages announced to screen readers
- Table has row and column headers
- Button purposes clearly stated

### Keyboard Navigation
- Full keyboard support (no mouse required)
- Tab order follows logical flow
- Focus indicators visible
- Dialogs can be closed with Escape key

### Visual Accessibility
- High contrast colors for warnings and errors
- Icons supplement text labels
- Clear visual hierarchy
- Readable font sizes

---

## Related Documentation

For additional information, see:
- **CHECK_IN_GUIDE.md**: Staff check-in procedures
- **INFLIGHT_GUIDE.md**: In-flight service management
- **SERVICES_MENU_GUIDE.md**: Managing services, meals, and shop items
- **AUTHENTICATION_GUIDE.md**: User roles and permissions
- **ACCESSIBILITY.md**: Detailed accessibility features

---

## Support and Feedback

If you encounter issues not covered in this guide:
1. Check browser console for error messages
2. Verify admin role permissions
3. Test with different browsers
4. Review network connectivity
5. Contact system administrator

---

**Document Version**: 1.0  
**Last Updated**: December 2025  
**Applicable To**: Airline Management System v2.0+
