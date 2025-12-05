# In-Flight Service Tab User Guide

## Overview
The **In-Flight Service Tab** is designed for cabin crew to manage passenger services during the flight. This interface allows flight attendants to view passenger details, add ancillary services, change meal preferences, and process in-flight shop purchases in real-time.

---

## Accessing the In-Flight Tab

### Prerequisites
- **User Role**: Staff or Admin access
- **Authentication**: Must be logged in
- **Flight Status**: Works with active and scheduled flights

### Navigation
1. Log in to the Airline Management System
2. Click the **"In-Flight"** button in the top navigation bar
3. The In-Flight Service interface loads with flight selection

---

## Main Features Overview

The In-Flight tab is organized into several key sections:
1. **Flight Selection Panel** (left side)
2. **Flight Details Display** (top center)
3. **Visual Seat Map** (center left)
4. **Passenger List** (center right)
5. **Passenger Service Panel** (bottom, when passenger selected)

---

## Section 1: Flight Selection

### Purpose
Select which flight you're currently working on to view and manage its passengers.

### How to Use

#### Flight List Display
Each flight card shows:
- **Flight Number**: e.g., "AA101"
- **Route**: Origin → Destination (e.g., "NYC → LAX")
- **Time**: Departure and arrival times
- **Gate**: Departure gate number
- **Status**: On Time, Boarding, Departed, etc.

#### Selecting a Flight
1. Review the list of flights in the left panel
2. Click on the flight card you're working on
3. The card highlights with a blue background
4. Flight details and passenger information load automatically

**Visual Indicator**: Selected flight has a distinct blue background color

#### Flight Details Header
Once a flight is selected, the top section displays:
- Flight name (e.g., "American Airlines 101")
- Departure time
- Route (From → To)
- Gate number
- Current status

---

## Section 2: Visual Seat Map

### Purpose
Visual representation of the aircraft cabin showing all seat assignments and passenger locations.

### Seat Map Layout
- **10 rows** (1-10)
- **6 columns** (A, B, C, D, E, F)
- **Aisle**: Space between columns C and D
- **Color-coded seats** for easy identification

### Seat Color Codes

| Color | Status | Meaning |
|-------|--------|---------|
| 🟢 **Green** | Checked In | Passenger has checked in |
| 🔵 **Blue** | Assigned | Seat assigned but not checked in |
| ⚪ **Gray** | Empty | Unoccupied seat |

### How to Use the Seat Map

#### Clicking a Seat
1. **Click on any occupied seat** (green or blue)
2. The passenger in that seat is selected
3. Passenger details appear in the Passenger Service Panel below
4. The seat is highlighted on the map

#### Visual Benefits
- **Quick Location**: Instantly see where passengers are seated
- **Service Tracking**: Color coding shows check-in status
- **Row Navigation**: Easy to find specific rows and seats
- **Aisle Reference**: Clear aisle marking between C and D

**Tip**: Use the seat map for quick passenger selection when walking through the cabin.

---

## Section 3: Passenger List Panel

### Purpose
Shows all passengers on the selected flight with their meal preferences and service counts.

### Passenger List Display

Each passenger entry shows:
- **Name**: Full passenger name
- **Seat**: Assigned seat number
- **Meal**: Current meal preference (e.g., "Vegetarian", "None")
- **Services**: Count of ancillary services (e.g., "2 services")

### How to Use

#### Selecting a Passenger
1. **Scroll through the list** to find a passenger
2. **Click on the passenger card**
3. The card highlights (selected state)
4. Passenger Service Panel appears below
5. Same passenger highlights on seat map

#### Visual Indicators
- **Selected State**: Highlighted background on selected passenger
- **Meal Badge**: Shows meal preference in a chip/badge
- **Service Count**: Displays number of ancillary services

**Alternative**: You can select passengers either from the list or by clicking their seat on the seat map.

---

## Section 4: Passenger Service Panel

### Purpose
Comprehensive interface for managing all services for the selected passenger during the flight.

### Panel Sections
The Passenger Service Panel is divided into four main areas:
1. **Basic Information**
2. **Meal Preference**
3. **Ancillary Services**
4. **Shop Requests**

---

## Managing Basic Passenger Information

### Information Displayed
When a passenger is selected, you'll see:

| Field | Description | Example |
|-------|-------------|---------|
| **Name** | Full passenger name | John Doe |
| **Seat** | Assigned seat number | 12A |
| **Booking Reference** | Booking confirmation code | BKG1234567 |
| **Flight** | Flight number | AA101 |
| **Special Meal** | Current meal preference | Vegetarian |
| **Check-In Status** | Whether checked in | ✓ Checked In |
| **Wheelchair** | Assistance required | ♿ Yes / No |
| **Infant** | Traveling with infant | 👶 Yes / No |

### View-Only Information
✏️ **Note**: Basic information is **view-only** in the In-Flight tab. To edit passenger details, use the Admin Dashboard.

---

## Managing Meal Preferences

### Current Meal Display
Shows the passenger's currently selected meal preference with a distinct visual indicator.

### Changing a Meal Preference

#### When to Change Meals
- Passenger requests different meal
- Original meal not available
- Passenger has new dietary restrictions
- Upgrade to premium meal option

#### Step-by-Step Process

1. **Locate Meal Section**
   - In the Passenger Service Panel
   - Under "Meal Preference" heading

2. **Open Change Meal Dialog**
   - Click the **"Change Meal"** button
   - Dialog window opens

3. **Review Current Selection**
   - Dialog shows current meal preference
   - Format: "Current: Vegetarian"

4. **Select New Meal**
   - Click the **"New Meal"** dropdown
   - Available options appear:
     - None
     - Vegetarian
     - Vegan
     - Gluten-Free
     - Kosher
     - Halal
     - Diabetic-Friendly
     - Low-Sodium
     - Child Meal
     - (Other options configured by admin)

5. **Confirm Change**
   - Click the **"Change Meal"** button
   - Success message appears: "Meal changed to [New Meal] for [Passenger Name]"
   - Dialog closes automatically
   - Passenger panel updates with new meal
   - Passenger list updates to show new meal

#### Cancel Change
- Click **"Cancel"** button or **X** to close without changing
- Original meal preference remains unchanged

### Meal Change Best Practices
- ✅ **Verify Availability**: Confirm galley has requested meal
- ✅ **Note Allergies**: Ask about allergies before confirming
- ✅ **Update Galley**: Inform catering staff of change
- ✅ **Document**: Meal change is automatically recorded

---

## Managing Ancillary Services

### What Are Ancillary Services?
Optional add-on services that enhance the passenger experience:
- Extra Baggage
- Priority Boarding
- Lounge Access
- Wi-Fi Access
- Premium Seat
- Travel Insurance
- And more (configured by admin)

### Current Services Display
Shows all ancillary services currently assigned to the passenger in a list format with remove option for each.

---

### Adding an Ancillary Service

#### When to Add Services
- Passenger purchases service in-flight
- Upgrade opportunities
- Service recovery situations
- Complimentary service provision

#### Step-by-Step Process

1. **Open Add Service Dialog**
   - Locate "Ancillary Services" section
   - Click the **"Add Service"** button
   - Dialog window opens

2. **Select Service**
   - Click the **"Service"** dropdown
   - Available services appear
   - Only services **not already assigned** to passenger are shown

3. **Confirm Addition**
   - Click the **"Add Service"** button
   - Success message appears: "[Service Name] added for [Passenger Name]"
   - Dialog closes automatically
   - Service appears in passenger's service list
   - Service count updates in passenger list panel

#### If No Services Available
- All available services already assigned to passenger
- Dropdown will be empty or show "No available services"
- Cancel dialog and review current services

#### Cancel Add
- Click **"Cancel"** button or **X** to close without adding
- No changes made to passenger services

---

### Removing an Ancillary Service

#### When to Remove Services
- Passenger requests refund
- Service not applicable/available
- Correction of error
- Service already fulfilled

#### Step-by-Step Process

1. **Locate Service**
   - In the Ancillary Services section
   - Find the service in the list

2. **Click Remove**
   - Each service has a **"Remove"** button (or X icon)
   - Click the remove button for the service

3. **Confirm Removal**
   - Success message appears: "[Service Name] removed"
   - Service disappears from list immediately
   - Service count updates in passenger list panel
   - Service becomes available to add again

#### No Confirmation Dialog
⚠️ **Note**: Service removal happens immediately without confirmation. Be careful when clicking remove buttons.

---

## Managing In-Flight Shop Requests

### What Is the In-Flight Shop?
A catalog of products passengers can purchase during the flight:
- **Perfumes & Cosmetics**: Fragrances, skincare products
- **Electronics**: Headphones, chargers, adapters
- **Accessories**: Travel pillows, bags, eye masks
- **Snacks & Beverages**: Chips, candy, drinks
- **Duty-Free**: Alcohol, tobacco, luxury items

### Current Shop Cart Display
Shows all items the passenger has requested/purchased with:
- Item name
- Quantity
- Price per unit
- Subtotal (quantity × price)
- Quantity adjustment buttons (+/-)
- Remove button

### Cart Total
Displays the **total cost** of all items in the passenger's cart at the bottom of the shop section.

---

### Adding Items to Shop Cart

#### Step-by-Step Process

1. **Open Shop Dialog**
   - Locate "Shop Requests" section
   - Click the **"Add Shop Item"** button
   - Large shop catalog dialog opens

2. **Browse by Category**
   - **Category Filter** dropdown at top
   - Options: All, Perfumes & Cosmetics, Electronics, Accessories, Snacks & Beverages, Duty-Free
   - Select a category to filter items
   - Default: "All" (shows all items)

3. **View Item Details**
   - Items displayed in a grid layout
   - Each item card shows:
     - Product name
     - Category
     - Price (with currency)
     - Image placeholder or icon

4. **Select an Item**
   - Click on an item card
   - Selected item **highlights** with a border or background color
   - Only one item can be selected at a time

5. **Set Quantity**
   - **Quantity selector** appears when item selected
   - Shows current quantity (default: 1)
   - **"-" Button**: Decrease quantity
   - **"+" Button**: Increase quantity
   - Minimum quantity: 1
   - No maximum limit

6. **Add to Cart**
   - Click the **"Add to Cart"** button
   - Success message appears: "[Item Name] (x[Quantity]) added to cart"
   - Dialog closes automatically
   - Item appears in passenger's shop requests list
   - Total updates automatically

#### Cancel Add
- Click **"Cancel"** button or **X** to close without adding
- No items added to cart

#### Navigation Tips
- **Browse Categories**: Use filter to narrow down items
- **Quick Selection**: Click directly on familiar items
- **Quantity First**: Set quantity before clicking Add to Cart
- **Multiple Items**: Close and reopen dialog to add more items

---

### Updating Item Quantity in Cart

#### When to Update Quantity
- Passenger wants more of the same item
- Passenger wants less of an item
- Stock availability changes

#### Step-by-Step Process

1. **Locate Item in Cart**
   - In the Shop Requests section
   - Find the item in the list

2. **Adjust Quantity**
   - Each item has **+** and **-** buttons
   - **"+"**: Increases quantity by 1
   - **"-"**: Decreases quantity by 1
   - Quantity updates immediately
   - Price subtotal recalculates automatically
   - Cart total updates automatically

3. **Minimum Quantity**
   - Cannot decrease below 1
   - To remove item completely, use Remove button

#### Instant Updates
✓ Changes are saved immediately - no confirm button needed.

---

### Removing Items from Shop Cart

#### When to Remove Items
- Passenger changes mind
- Item out of stock
- Correction of error
- Payment declined

#### Step-by-Step Process

1. **Locate Item in Cart**
   - In the Shop Requests section
   - Find the item in the list

2. **Click Remove**
   - Each item has a **"Remove"** button or X icon
   - Click the remove button

3. **Confirm Removal**
   - Success message appears: "[Item Name] removed from cart"
   - Item disappears from list immediately
   - Cart total recalculates

#### No Confirmation Dialog
⚠️ **Note**: Item removal happens immediately. Be careful when clicking remove buttons.

---

## Common Workflows

### Workflow 1: Passenger Service Request During Flight

**Scenario**: Passenger in 12A requests Wi-Fi access

1. **Locate Passenger**
   - Click seat 12A on seat map, OR
   - Find passenger in passenger list

2. **Open Service Dialog**
   - Passenger Service Panel appears
   - Click "Add Service" in Ancillary Services section

3. **Select Wi-Fi**
   - Choose "Wi-Fi Access" from dropdown
   - Click "Add Service"

4. **Confirm**
   - Success message appears
   - Service added to passenger's profile

5. **Process Payment** (external)
   - Collect payment via your payment system
   - Service is now recorded in passenger profile

---

### Workflow 2: Multiple Shop Purchases

**Scenario**: Passenger wants to buy headphones, travel pillow, and snacks

1. **Select Passenger** (via seat map or list)

2. **Add First Item (Headphones)**
   - Click "Add Shop Item"
   - Filter by "Electronics"
   - Select "Wireless Headphones"
   - Set quantity: 1
   - Click "Add to Cart"

3. **Add Second Item (Travel Pillow)**
   - Click "Add Shop Item" again
   - Filter by "Accessories"
   - Select "Travel Pillow"
   - Set quantity: 1
   - Click "Add to Cart"

4. **Add Third Item (Snacks)**
   - Click "Add Shop Item" again
   - Filter by "Snacks & Beverages"
   - Select preferred snack
   - Set quantity: 2
   - Click "Add to Cart"

5. **Review Total**
   - Check total at bottom of Shop Requests section
   - Verify all items and quantities
   - Process payment

---

### Workflow 3: Meal Change Due to Availability

**Scenario**: Vegetarian meal not available, passenger accepts Vegan alternative

1. **Select Passenger**
   - Find passenger with Vegetarian meal preference

2. **Open Change Meal Dialog**
   - Click "Change Meal" button in Meal Preference section

3. **Inform Passenger**
   - Explain Vegetarian meal unavailable
   - Offer Vegan alternative

4. **Change Meal**
   - Select "Vegan" from dropdown
   - Click "Change Meal"

5. **Confirm Change**
   - Success message appears
   - Meal updated in passenger profile
   - Inform galley of change

---

### Workflow 4: Service Recovery with Complimentary Service

**Scenario**: Passenger experienced delay, offer complimentary lounge access for next flight

1. **Select Passenger**
   - Find passenger in system

2. **Add Complimentary Service**
   - Click "Add Service"
   - Select "Lounge Access"
   - Click "Add Service"

3. **Document**
   - Service added to passenger profile
   - Note reason in external log if needed

4. **Inform Passenger**
   - Explain complimentary service
   - Provide access details

---

### Workflow 5: Cart Quantity Adjustment

**Scenario**: Passenger ordered 3 drinks but wants 5

1. **Locate Cart Item**
   - In passenger's Shop Requests
   - Find the drink item

2. **Increase Quantity**
   - Click **"+"** button twice
   - Quantity changes from 3 to 5
   - Price updates automatically

3. **Verify Total**
   - Check updated cart total
   - Process additional payment if needed

---

## Best Practices

### Passenger Service
1. ✅ **Select Correct Passenger**: Always verify seat/name before making changes
2. ✅ **Confirm Verbally**: Repeat orders back to passenger
3. ✅ **Check Availability**: Verify items/meals are available before confirming
4. ✅ **Process Payment**: Collect payment before adding shop items
5. ✅ **Update Immediately**: Record changes as they happen

### Meal Management
1. ✅ **Verify with Galley**: Check meal availability before promising to passenger
2. ✅ **Note Allergies**: Always ask about allergies when changing meals
3. ✅ **Document Reasons**: Note why meal was changed if relevant
4. ✅ **Inform Galley**: Communicate meal changes to catering staff
5. ✅ **Timing**: Make meal changes well before meal service

### Shop Operations
1. ✅ **Payment First**: Collect payment before adding items to cart
2. ✅ **Verify Stock**: Check item availability with inventory
3. ✅ **Review Cart**: Have passenger review items and total before finalizing
4. ✅ **Receipt**: Provide receipt or confirmation to passenger
5. ✅ **Packaging**: Ensure items are properly packaged for passenger

### System Usage
1. ✅ **Refresh Regularly**: Information updates automatically, but refresh if needed
2. ✅ **Deselect Between Passengers**: Click away to deselect before moving to next passenger
3. ✅ **Use Seat Map**: Visual seat map is often faster than scrolling passenger list
4. ✅ **Double-Check**: Verify passenger name/seat before confirming changes
5. ✅ **Handle Errors Gracefully**: If something fails, retry or contact support

---

## Troubleshooting

### Problem: Passenger Not Showing in List
**Possible Causes**:
- Wrong flight selected
- Passenger not checked in
- Page needs refresh

**Solution**:
1. Verify correct flight is selected in flight panel
2. Check if flight has passengers
3. Refresh page (F5)
4. Check passenger list in Admin Dashboard

---

### Problem: Can't Add Service - No Services Available
**Cause**: All available services already assigned to passenger

**Solution**:
1. Review passenger's current services
2. Verify passenger doesn't already have the service
3. If service was added by mistake, remove it first
4. Check Admin Dashboard for available services

---

### Problem: Meal Change Not Saving
**Possible Causes**:
- Network connectivity issue
- API error
- Validation failure

**Solution**:
1. Check internet connection
2. Try again after a few seconds
3. Verify meal option still exists in system
4. Check browser console for errors
5. Contact system administrator if persists

---

### Problem: Shop Total Not Calculating
**Possible Causes**:
- Browser issue
- Quantity not set properly
- Price data missing

**Solution**:
1. Refresh the page
2. Check each item has valid price
3. Verify quantities are positive numbers
4. Remove and re-add items if needed
5. Clear browser cache

---

### Problem: Seat Map Not Showing Passengers
**Possible Causes**:
- No flight selected
- Flight has no passengers
- Rendering issue

**Solution**:
1. Ensure a flight is selected (click flight card)
2. Verify flight has checked-in passengers
3. Refresh the page
4. Check browser console for errors

---

### Problem: Selected Passenger Details Not Appearing
**Possible Causes**:
- Passenger data not loaded
- Selection not registered
- Panel collapsed or hidden

**Solution**:
1. Click passenger again to reselect
2. Try selecting via seat map instead of list
3. Scroll down to see if panel is below view
4. Refresh page and try again

---

## Keyboard Shortcuts

### General Navigation
- **Tab**: Move between interactive elements
- **Shift + Tab**: Move backwards
- **Enter**: Confirm/Submit in dialogs
- **Escape**: Close open dialog

### Dialog Interactions
- **Escape**: Close any open dialog (service, meal, shop)
- **Enter**: Confirm action when button is focused
- **Arrow Keys**: Navigate dropdown options

### Accessibility
- Full keyboard navigation supported
- Screen reader compatible
- Focus indicators on all elements

---

## Tips and Tricks

### Efficient Service
- **Use Seat Map**: Faster to click seat than scroll passenger list
- **Keep Dialog Open**: When adding multiple services, work quickly to minimize clicks
- **Pre-select Category**: In shop, filter category before selecting passenger
- **Batch Similar Requests**: Process all drink orders together, then meals, etc.

### Customer Service
- **Confirm Verbally**: Always repeat orders back to passenger
- **Show Screen**: Turn tablet/screen toward passenger to verify selections
- **Explain Total**: For shop purchases, show breakdown of cart total
- **Print/Email Receipt**: If system supports, provide confirmation

### Time Savers
- **Learn Common Seats**: Memorize frequently served seats
- **Favorite Items**: Remember popular shop items for quick access
- **Service Codes**: Learn which services passengers commonly request
- **Meal Shortcuts**: Know meal codes for faster input

### Error Prevention
- **Double-Check Seat**: Verify seat number before adding expensive items
- **Confirm Quantity**: Ask passenger to confirm quantity before adding
- **Review Before Submit**: Quick glance at details before clicking confirm
- **Undo Awareness**: Remember removals are immediate - be careful

---

## Integration with Other Tabs

### Check-In Tab
- Passengers must be checked in to appear with green seats
- Wheelchair/infant indicators set during check-in appear here
- Seat assignments from check-in visible in In-Flight tab

### Admin Dashboard
- Services available here are configured in Admin > Services & Menu
- Meal options configured by admin appear in Change Meal dialog
- Shop items configured by admin appear in shop catalog
- Passenger base information managed in Admin > Passengers

### Real-Time Updates
- Changes made here reflect in Admin Dashboard immediately
- Multiple crew members can work simultaneously
- Updates refresh automatically (or require page refresh)

---

## Security and Permissions

### Access Control
- Staff and Admin roles can access In-Flight tab
- All crew members see same data
- Changes are logged with user information (if auditing enabled)

### Data Privacy
- Passenger information visible to authorized crew only
- Payment processing should follow airline security protocols
- Personal data should be handled per airline privacy policy

---

## Accessibility Features

### Screen Reader Support
- All buttons and controls have descriptive labels
- Passenger information announced when selected
- Dialog titles and messages are announced
- Success/error messages are announced

### Keyboard Navigation
- Full keyboard support for all operations
- Logical tab order throughout interface
- Focus indicators on all interactive elements
- Escape key closes all dialogs

### Visual Accessibility
- High contrast seat map colors
- Clear visual hierarchy
- Icons supplement text labels
- Readable font sizes
- Color not sole indicator (text labels included)

---

## Payment Processing

### Important Notes
⚠️ **Payment Integration**: This interface does NOT process payments directly. It only records service/shop requests.

### Recommended Payment Workflow
1. **Select items** in the system
2. **Show total** to passenger
3. **Process payment** via your airline's payment system (POS, card reader, etc.)
4. **Confirm payment received** before adding to cart
5. **Add items** to passenger profile after payment confirmed
6. **Provide receipt** per airline policy

### Refund Handling
- If passenger requests refund, **remove item/service** from profile
- Process refund via your airline's payment system
- Document reason for refund per airline policy

---

## Related Documentation

For additional information, see:
- **CHECK_IN_GUIDE.md**: Pre-flight passenger check-in procedures
- **ADMIN_DASHBOARD_GUIDE.md**: Passenger data management
- **SERVICES_MENU_GUIDE.md**: Configuring available services and shop items
- **AUTHENTICATION_GUIDE.md**: User roles and permissions
- **ACCESSIBILITY.md**: Detailed accessibility features

---

## Support and Feedback

If you encounter issues not covered in this guide:
1. Check browser console for error messages
2. Verify staff/admin role permissions
3. Test with different browsers
4. Review network connectivity
5. Contact your system administrator
6. Report bugs to IT support team

---

## Quick Reference Card

### Essential Actions

| Task | Steps |
|------|-------|
| **Select Flight** | Click flight card in left panel |
| **Select Passenger** | Click seat on map OR click passenger in list |
| **Change Meal** | Click "Change Meal" → Select meal → Confirm |
| **Add Service** | Click "Add Service" → Select service → Confirm |
| **Remove Service** | Click "Remove" next to service |
| **Add Shop Item** | Click "Add Shop Item" → Select item → Set quantity → Add to Cart |
| **Update Quantity** | Click +/- buttons next to item in cart |
| **Remove Shop Item** | Click "Remove" next to item in cart |
| **View Total** | Check bottom of Shop Requests section |

### Color Codes
- 🟢 **Green Seat**: Checked in
- 🔵 **Blue Seat**: Assigned, not checked in
- ⚪ **Gray Seat**: Empty

### Common Shortcuts
- **Escape**: Close dialog
- **Enter**: Confirm action
- **Tab**: Navigate fields
- **Refresh (F5)**: Reload data

---

**Document Version**: 1.0  
**Last Updated**: December 2025  
**Applicable To**: Airline Management System v2.0+
