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
