# Check-In Tab User Guide

## Overview
The **Check-In tab** is designed for airline staff at the airport to manage passenger check-in operations efficiently. This interface provides a comprehensive view of flight passengers, their seat assignments, and check-in status.

---

## Accessing the Check-In Tab

1. Log in to the Airline Management System
2. Click the **"Check-In"** button in the navigation bar (top of the page)
3. You'll see three main sections:
   - Flight Selection (left panel)
   - Passenger List and Seat Map (main area)
   - Passenger Details (when a passenger is selected)

---

## Main Features

### 1. Flight Selection

**Purpose**: Choose which flight you want to manage

**How to Use**:
- View the list of all current and upcoming flights in the left panel
- Each flight shows:
  - Flight number (e.g., AA101)
  - Route (Origin → Destination)
  - Departure and arrival times
- Click on any flight to view its passengers

**Visual Indicator**: The selected flight is highlighted with a different background color

---

### 2. Visual Seat Map

**Purpose**: See the aircraft layout and seat occupancy at a glance

**Seat Color Codes**:
- 🟢 **Green** = Passenger is checked in
- 🔵 **Blue** = Seat assigned but passenger not checked in yet
- ⚪ **Gray** = Unoccupied seat (available)

**How to Use**:
- Click on any occupied seat to view that passenger's details
- The seat map shows rows 1-10 with columns A-F
- Aisle is between columns C and D

**Layout**:
```
   A  B  C    D  E  F
1  🔵 🔵 🔵    🟢 🟢 🟢
2  🔵 🟢 ⚪    🔵 🟢 🔵
...
```

---

### 3. Passenger List

**Purpose**: View all passengers on the selected flight with their details

**Information Displayed**:
- Passenger name
- Seat number (displayed as a chip/badge)
- Status badges:
  - **"Wheelchair"** (orange badge) - Requires wheelchair assistance
  - **"Infant"** (blue badge) - Traveling with an infant
  - **"Checked In"** (green badge) - Already checked in
- Ancillary services requested

**Actions Available**:
Each passenger has three buttons:

1. **Check In** (Blue button)
   - Marks passenger as checked in
   - Disabled if already checked in
   - Updates seat color to green on the map

2. **Undo** (Outlined button)
   - Reverses the check-in status
   - Disabled if not checked in
   - Use this if check-in was done by mistake

3. **Change Seat** (Outlined button)
   - Opens a dialog to reassign the passenger to a different seat
   - Always available
   - Useful for accommodating family seating requests

---

### 4. Filtering Options

**Purpose**: Quickly find specific passengers or view specific groups

**Available Filters**:

#### Check-In Status
Select from dropdown:
- **All** - Show all passengers
- **Checked In** - Show only passengers who have completed check-in
- **Not Checked In** - Show only passengers who haven't checked in yet

#### Special Requirements (Checkboxes)
- ☑️ **Wheelchair** - Show only passengers requiring wheelchair assistance
- ☑️ **Infant** - Show only passengers traveling with infants

**Clear Filters**: Click the "Clear" button to reset all filters and show all passengers

---

### 5. Passenger Details Panel

**Purpose**: View complete information about the selected passenger

**Information Displayed**:
- **Name** - Full passenger name
- **Seat** - Current seat assignment
- **Booking Reference** - Unique booking code (format: 3 letters + 3-7 digits)
- **Passport Number** - Travel document number
- **Address** - Passenger's address
- **Date of Birth** - In YYYY-MM-DD format
- **Special Meal** - Meal preference (e.g., Vegetarian, Halal, Regular)
- **Ancillary Services** - Additional services requested (e.g., Extra Baggage, Priority Boarding)
- **Wheelchair/Infant Status** - Special assistance requirements
- **Check-In Status** - Current check-in state

---

## Common Workflows

### Standard Check-In Process

1. **Select the flight** from the left panel
2. **Locate the passenger**:
   - Scroll through the passenger list, OR
   - Click their seat on the seat map
3. **Review passenger details** in the details panel
4. **Verify identity** (passport, booking reference)
5. **Click "Check In"** button
6. **Confirm** the seat turns green on the map and "Checked In" badge appears

### Handling Seat Change Requests

**Scenario**: Family wants to sit together

1. **Select the passenger** who needs to move
2. **Click "Change Seat"** button
3. **Enter new seat number** in the dialog (e.g., "5A")
4. **Click "Change"** to confirm
5. **Verify** the passenger appears in the new seat on the map

### Finding Passengers with Special Needs

**Scenario**: Prepare for passengers needing wheelchair assistance

1. **Select the flight**
2. **Check the "Wheelchair" filter** checkbox
3. **Review the filtered list** - shows only wheelchair passengers
4. **Note their seat locations** for boarding priority
5. **Click "Clear"** to return to full passenger list

### Correcting Accidental Check-Ins

1. **Find the passenger** who was checked in by mistake
2. **Click "Undo"** button next to their name
3. **Confirm** the seat color changes from green to blue
4. **"Checked In" badge is removed**

---

## 6. Advanced Seat Management Features ⭐

The Check-In tab includes advanced seat arrangement tools to optimize passenger seating and accommodations:

### Seat Preferences Dialog

**Purpose**: Set individual passenger seat preferences (window/aisle, front/back, exit row)

**Access**:
1. Select a passenger from the list
2. Click **"Seat Preferences"** button in passenger details
3. Dialog opens with preference options

**Available Preferences**:
- **Position**: Window, Aisle, Middle
- **Location**: Front (rows 1-3), Back (rows 8-10)
- **Special Seats**: Exit row preference
- **Family Seating**: Keep near family option

**How to Use**:
1. Check desired preferences for the passenger
2. Select seat type (Standard, Premium, Exit Row)
3. Click **"Save"** to apply preferences
4. Visual indicators appear on seat map for this passenger

**Visual Indicators** 🎨:
- 💙 Blue border = Window preference
- 🟪 Purple mark = Aisle preference
- ⭐ Star icon = Exit row eligible
- ❤️ Heart = Family seating preferred

---

### Group Seating Dialog

**Purpose**: Keep multiple passengers seated together

**Access**:
1. Select a passenger who is part of a group
2. Click **"Group Seating"** button
3. Enter group size and group members

**How to Use**:
1. **Enter Group Size**: Number of passengers to keep together (2-6)
2. **Select Group Members**: Choose passengers from dropdown list
3. **Mark Group Leader**: Designate primary passenger
4. **Enable Keep Together**: Checkbox to enforce consecutive seating
5. Click **"Save"** to apply group seating rules

**Features**:
- 🔗 Visual link indicators showing group members
- 📍 Highlighted seats on map for group
- ⚠️ Warning if insufficient consecutive seats
- 🔄 Auto-adjust if seats modified

**Example**:
- Family of 4 traveling together (seats 5A, 5B, 5C, 5D)
- Create group of 4, mark as keep together
- System highlights these 4 seats as linked

---

### Family Seating Dialog

**Purpose**: Allocate seating for families with automatic safety compliance

**Access**:
1. Select a passenger (family member)
2. Click **"Family Seating"** button
3. Configure family composition

**How to Use**:
1. **Enter Family Composition**:
   - Number of adults (required)
   - Number of children (optional, under 12)
   - Number of infants (optional, under 2)

2. **Configure Auto-Allocation**:
   - ☑️ Enable "Auto-Allocate": System finds optimal seats
   - ☑️ Safety Rules: Ensures adult supervision of children

3. **Review Allocation**:
   - System highlights assigned family seats on map
   - Shows infant seating rules (safety seat locations)
   - Displays child safety requirements

4. Click **"Allocate"** to confirm and apply seating

**Auto-Allocation Rules** 📋:
- ✅ Adults positioned strategically to supervise children
- ✅ Infants in safe locations away from exits
- ✅ Children between adults when possible
- ✅ Family kept in adjacent rows if needed
- ✅ Extra legroom consideration for families with multiple children

**Safety Indicators** 🛡️:
- 👨‍👩‍👧 Family group linked visual
- 👶 Infant safety zone (green background)
- 👧 Child supervision zone (yellow border)
- 👨 Adult position priority (blue highlight)

**Example**:
- Family: 2 adults + 2 children + 1 infant
- System allocates: 5A (adult), 5B (child), 5C (child), 5D (adult), 6A (infant safe zone)
- Visual links connect all seats with family icons

---

### Premium Seat Upsell Dialog

**Purpose**: Offer premium seat upgrades with pricing and features

**Access**:
1. Select a passenger
2. Click **"Premium Seat"** button in details panel
3. Upsell dialog displays available premium seats

**How to Use**:
1. **Review Premium Options**:
   - Seat number and location
   - Base price vs. upgrade price
   - Premium features (extra legroom, priority, etc.)
   - Availability status

2. **Select Premium Seat**:
   - Click desired premium seat
   - Review price difference (currency shown)
   - Check included features

3. **Confirm Upgrade**:
   - Click **"Upgrade to Premium"** button
   - System updates passenger seat to premium
   - Pricing applied to passenger record

4. **Visual Confirmation**:
   - Seat marked with 👑 Premium badge
   - Seat highlights with gold/premium color on map
   - Passenger details show premium upgrade status

**Premium Features** ✨:
- Extra legroom (5-8 inches additional space)
- Priority boarding
- Preferred location (front cabin)
- Enhanced comfort amenities
- Complimentary services

**Pricing Display**:
```
Standard Seat: $0 (included)
Premium Seat (5A): $89 → $45 upgrade cost
Features: Extra legroom + Priority boarding
```

**Currency Support** 💱:
- Prices display in passenger's preferred currency
- Exchange rates applied automatically
- Multi-currency support (USD, EUR, GBP, JPY, etc.)

---

## Seat Arrangement Visual Summary

**Seat Map Color Codes** with Arrangement Features:

| Color | Status | Feature |
|-------|--------|---------|
| 🟢 **Green** | Checked in | Standard passenger |
| 🔵 **Blue** | Assigned | Waiting to check in |
| ⚪ **Gray** | Empty | Available seat |
| 👑 **Gold** | Premium | Premium upgrade applied |
| 💙 **Blue Border** | Preference | Window preference set |
| 🔗 **Linked** | Group | Part of group seating |
| ❤️ **Heart** | Family | Family group member |
| ⭐ **Star** | Exit Row | Exit row eligible |

---

## Tips and Best Practices

### Efficiency Tips
- Use **filters** to quickly locate passengers instead of scrolling
- Click **seats on the map** for faster passenger selection than scrolling the list
- Keep the **details panel** visible to verify passenger information during check-in

### Common Scenarios

**Late Passenger Changes**:
- If a passenger doesn't show up, don't check them in
- Use filters to identify who hasn't checked in as boarding time approaches

**VIP or Special Assistance**:
- Filter by "Wheelchair" or "Infant" to identify these passengers first
- They often need priority boarding or special arrangements

**Group Bookings**:
- Family members usually have sequential booking references
- Use "Change Seat" to accommodate seating requests

**Overbooking**:
- Filter "Not Checked In" to see who hasn't arrived
- Check seat map for available seats if reassignment is needed

---

## Troubleshooting

### "Check-in failed" error
**Cause**: Network issue or passenger already checked in
**Solution**: 
- Refresh the page
- Verify passenger isn't already showing "Checked In" badge
- Try again

### "Seat change failed" error
**Causes**:
- Seat number format incorrect (must be row number + letter, e.g., "5A")
- Seat already occupied by another passenger
- Seat doesn't exist (rows 1-10, columns A-F only)

**Solution**:
- Check the seat map to see which seats are available (gray)
- Use correct format: number first, then letter (5A, not A5)
- Try a different available seat

### Passenger not appearing in list
**Causes**:
- Wrong flight selected
- Filter active (hiding the passenger)
- Passenger not on this flight

**Solution**:
- Click "Clear" button to remove all filters
- Verify correct flight is selected
- Check if passenger is on a different flight

---

## Keyboard Shortcuts (Future Enhancement)

*Note: These shortcuts are planned for future versions*
- `F` - Focus on flight search
- `C` - Check in selected passenger
- `U` - Undo check-in for selected passenger
- `S` - Open seat change dialog
- `Esc` - Close dialogs

---

## System Information

**Supported Browsers**: Chrome, Firefox, Safari, Edge (latest versions)

**Screen Resolution**: Optimized for 1280x720 and higher

**Mobile Support**: Responsive design works on tablets (iPad and above)

---

## Need Help?

For technical support or questions about check-in procedures:
- Contact IT Support: support@airline.com
- Training Materials: Available in the Help section
- Quick Reference Card: Available at check-in desks

---

## Related Documentation

- [Admin Dashboard Guide](./README.md) - For managing passengers and flights
- [In-Flight Guide](./README.md) - For cabin crew operations
- [User Guide](./README.md) - General system overview
