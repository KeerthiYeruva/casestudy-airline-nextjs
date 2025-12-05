# Admin Dashboard - Services & Menu Tab User Guide

## Overview
The **Services & Menu Tab** in the Admin Dashboard is the central management interface for all flight services, meal options, and in-flight shop items. This tab allows airline administrators to configure what services and products are available to passengers during their flights.

---

## Accessing Services & Menu Tab

### Prerequisites
- **User Role**: Admin access required
- **Authentication**: Must be logged in with admin credentials

### Navigation
1. Log in to the Airline Management System
2. Click the **"Admin"** button in the top navigation bar
3. Click the **"Services & Menu"** tab (second tab)

---

## Tab Overview

The Services & Menu tab is divided into three main sections:

1. **Ancillary Services** - Extra services that can be added to passenger bookings
2. **Meal Options** - Special meal preferences available to passengers
3. **Shop Items** - Products available for purchase in the in-flight shop

Each section has its own management interface with add, edit, and delete capabilities.

---

## Section 1: Ancillary Services

### What Are Ancillary Services?
Ancillary services are optional add-ons that enhance the passenger experience:
- Extra Baggage
- Priority Boarding
- Lounge Access
- Wi-Fi Access
- Premium Seat Selection
- Travel Insurance
- Pet Transport
- Unaccompanied Minor Service

### Service List Display
Services are shown in a grid of cards, each displaying:
- **Service Name**: e.g., "Extra Baggage"
- **Edit Button**: Pencil icon (✏️) to modify the service
- **Delete Button**: Trash icon (🗑️) to remove the service

---

### Adding a New Ancillary Service

#### Step-by-Step Process

1. **Open Add Dialog**
   - Click the **"Add Service"** button at the top of the Ancillary Services section
   - A dialog window opens with a blank form

2. **Enter Service Name**
   - Type the service name in the **"Service Name"** field
   - Examples: "Extra Legroom", "Priority Check-In", "Airport Transfer"
   - **Required**: Cannot be empty

3. **Save Service**
   - Click the **"Add"** button
   - Success message appears: "Service added successfully"
   - New service appears in the services grid
   - Dialog closes automatically

#### Validation Rules
- ✅ Service name must not be empty
- ✅ Service names should be descriptive and clear
- ✅ Duplicate names are allowed (but not recommended)

#### Best Practices
- Use clear, passenger-friendly names
- Be consistent with naming conventions
- Group similar services (e.g., all baggage-related services)
- Consider alphabetical ordering for easier browsing

---

### Editing an Existing Ancillary Service

#### Step-by-Step Process

1. **Open Edit Dialog**
   - Locate the service card you want to edit
   - Click the **✏️ Edit** button on the card
   - Dialog opens with current service name pre-filled

2. **Modify Service Name**
   - Update the text in the **"Service Name"** field
   - Make your changes (e.g., rename "WiFi" to "In-Flight Wi-Fi")

3. **Save Changes**
   - Click the **"Update"** button
   - Success message appears: "Service updated successfully"
   - Service card updates with new name
   - Dialog closes automatically

#### What Happens to Existing Bookings
⚠️ **Important**: When you edit a service:
- Passengers who already have this service will see the updated name
- The change applies system-wide immediately
- Historical data is updated (not versioned)

---

### Deleting an Ancillary Service

#### ⚠️ Warning
Deleting a service is permanent and affects existing passenger bookings!

#### Step-by-Step Process

1. **Initiate Delete**
   - Locate the service card you want to remove
   - Click the **🗑️ Delete** button on the card
   - **Confirmation dialog** appears

2. **Review Confirmation**
   **Dialog Content**:
   - **Title**: "Confirm Delete"
   - **Message**: "Are you sure you want to delete [Service Name]?"
   - **Severity**: Warning (yellow background)

3. **Confirm or Cancel**
   - **Cancel**: Closes dialog, service is not deleted
   - **Confirm**: Proceeds with deletion

4. **Result**
   - Success message: "Service deleted successfully"
   - Service card removed from grid immediately
   - Service no longer available for new bookings

#### Impact on Passengers
- **Existing Bookings**: Passengers who already have this service retain it (data preserved)
- **New Bookings**: Service is no longer available for selection
- **In-Flight Tab**: Service may still show for passengers who have it

#### When to Delete
- Discontinued services
- Seasonal services (end of season)
- Duplicate or incorrect entries
- Services being replaced by new offerings

---

## Section 2: Meal Options

### What Are Meal Options?
Special meal preferences available to accommodate dietary restrictions or preferences:
- Vegetarian
- Vegan
- Gluten-Free
- Kosher
- Halal
- Diabetic-Friendly
- Low-Sodium
- Child Meal
- None (standard meal)

### Meal Options Display
Meals are shown in a grid of cards, each displaying:
- **Meal Name**: e.g., "Vegetarian"
- **Edit Button**: Pencil icon (✏️) to modify the meal option
- **Delete Button**: Trash icon (🗑️) to remove the meal option

---

### Adding a New Meal Option

#### Step-by-Step Process

1. **Open Add Dialog**
   - Click the **"Add Meal"** button at the top of the Meal Options section
   - A dialog window opens with a blank form

2. **Enter Meal Name**
   - Type the meal option name in the **"Meal Name"** field
   - Examples: "Pescatarian", "Nut-Free", "Lactose-Free"
   - **Required**: Cannot be empty

3. **Save Meal**
   - Click the **"Add"** button
   - Success message appears: "Meal added successfully"
   - New meal option appears in the meals grid
   - Dialog closes automatically

#### Naming Guidelines
- Be specific and clear (e.g., "Gluten-Free" not "GF")
- Use standard dietary terminology
- Include any relevant allergen information
- Maintain consistency with airline catering standards

---

### Editing an Existing Meal Option

#### Step-by-Step Process

1. **Open Edit Dialog**
   - Locate the meal card you want to edit
   - Click the **✏️ Edit** button on the card
   - Dialog opens with current meal name pre-filled

2. **Modify Meal Name**
   - Update the text in the **"Meal Name"** field
   - Make your changes (e.g., rename "Veggie" to "Vegetarian")

3. **Save Changes**
   - Click the **"Update"** button
   - Success message appears: "Meal updated successfully"
   - Meal card updates with new name
   - Dialog closes automatically

#### What Happens to Passengers
⚠️ **Important**: When you edit a meal option:
- All passengers with this meal preference will see the updated name
- Changes reflect immediately in passenger profiles
- In-flight service staff will see the updated meal name

---

### Deleting a Meal Option

#### ⚠️ Warning
Deleting a meal option affects passengers who have selected it!

#### Step-by-Step Process

1. **Initiate Delete**
   - Locate the meal card you want to remove
   - Click the **🗑️ Delete** button on the card
   - **Confirmation dialog** appears

2. **Review Confirmation**
   **Dialog Content**:
   - **Title**: "Confirm Delete"
   - **Message**: "Are you sure you want to delete [Meal Name]?"
   - **Severity**: Warning (yellow background)

3. **Confirm or Cancel**
   - **Cancel**: Closes dialog, meal option is not deleted
   - **Confirm**: Proceeds with deletion

4. **Result**
   - Success message: "Meal deleted successfully"
   - Meal card removed from grid immediately
   - Meal no longer available for selection

#### Impact on Passengers
- **Existing Selections**: Passengers who have this meal may have issues
- **New Bookings**: Meal no longer available for selection
- **Catering Orders**: May affect flight catering manifest

#### When to Delete
- ⚠️ Use with extreme caution
- Only delete if meal is permanently discontinued
- Consider editing instead of deleting
- Ensure no upcoming flights have passengers with this meal

---

## Section 3: Shop Items

### What Are Shop Items?
Products available for purchase in the in-flight shop:
- **Perfumes & Cosmetics**: Fragrances, skincare, makeup
- **Electronics**: Headphones, chargers, adapters
- **Accessories**: Travel pillows, eye masks, bags
- **Snacks & Beverages**: Chips, candy, drinks
- **Duty-Free**: Alcohol, tobacco, luxury goods

### Shop Items Display
Items are shown in a table format with columns:
- **Name**: Product name
- **Category**: Product category
- **Price**: Cost in USD
- **Actions**: Edit and Delete buttons

---

### Adding a New Shop Item

#### Step-by-Step Process

1. **Open Add Dialog**
   - Click the **"Add Shop Item"** button at the top of the Shop Items section
   - A detailed dialog window opens with multiple fields

2. **Fill Item Details**

   **Item Name** (Required)
   - Enter the product name
   - Examples: "Wireless Headphones", "Travel Pillow", "Perfume Gift Set"
   - Be descriptive and specific

   **Category** (Required)
   - Select from dropdown:
     - Perfumes & Cosmetics
     - Electronics  
     - Accessories
     - Snacks & Beverages
     - Duty-Free
   - Default: "Perfumes & Cosmetics"

   **Price** (Required)
   - Enter the price as a number
   - Format: Decimal number (e.g., 29.99, 150, 5.50)
   - **Validation**: Must be greater than 0
   - No currency symbol needed

   **Currency** (Required)
   - Select from dropdown: USD, EUR, GBP
   - Default: "USD"
   - Determines how price is displayed to passengers

3. **Save Shop Item**
   - Click the **"Add"** button
   - **Validation** occurs:
     - Item name cannot be empty
     - Price must be a valid positive number
   - Success message appears: "Shop item added successfully"
   - New item appears in the shop items table
   - Dialog closes automatically

#### Validation Rules
| Field | Validation | Error Message |
|-------|------------|---------------|
| **Name** | Cannot be empty | "Item name is required" |
| **Category** | Must select one | Auto-selected |
| **Price** | Must be > 0 | "Price must be greater than 0" |
| **Currency** | Must select one | Auto-selected |

#### Pricing Guidelines
- Use competitive market rates
- Consider duty-free pricing advantages
- Factor in overhead costs
- Maintain consistency with category pricing
- Include any applicable taxes/fees

---

### Editing an Existing Shop Item

#### Step-by-Step Process

1. **Open Edit Dialog**
   - Locate the item in the shop items table
   - Click the **✏️ Edit** button in the Actions column
   - Dialog opens with all current item details pre-filled

2. **Modify Item Information**
   - **Name**: Update product name
   - **Category**: Change category if needed
   - **Price**: Adjust pricing (e.g., sales, updates)
   - **Currency**: Change currency (affects all passengers)

3. **Save Changes**
   - Click the **"Update"** button
   - Same validation rules apply as adding
   - Success message appears: "Shop item updated successfully"
   - Table updates with new information
   - Dialog closes automatically

#### Common Edit Scenarios

**Price Update**
- Seasonal sales
- Bulk discounts
- Currency exchange rate adjustments
- Promotional pricing

**Category Change**
- Reclassification of products
- Organizing inventory better
- Aligning with new category structure

**Name Update**
- Correcting typos
- Adding brand names
- Making descriptions clearer
- Updating product versions

---

### Deleting a Shop Item

#### ⚠️ Warning
Deleting a shop item removes it from availability but may affect existing passenger orders.

#### Step-by-Step Process

1. **Initiate Delete**
   - Locate the item in the shop items table
   - Click the **🗑️ Delete** button in the Actions column
   - **Confirmation dialog** appears

2. **Review Confirmation**
   **Dialog Content**:
   - **Title**: "Confirm Delete"
   - **Message**: "Are you sure you want to delete [Item Name]?"
   - **Severity**: Warning (yellow background)

3. **Confirm or Cancel**
   - **Cancel**: Closes dialog, item is not deleted
   - **Confirm**: Proceeds with deletion

4. **Result**
   - Success message: "Shop item deleted successfully"
   - Item removed from table immediately
   - Item no longer available in in-flight shop

#### Impact on In-Flight Shop
- **New Orders**: Item will not appear in shop catalog
- **Existing Orders**: Passengers who already ordered may still have it in their cart
- **Historical Data**: Past purchases are preserved

#### When to Delete
- Product discontinued
- Out of stock (permanently)
- Seasonal items (end of season)
- Compliance issues (regulatory)
- Low sales performance

---

## Common Workflows

### Workflow 1: Seasonal Menu Update
**Scenario**: Update meal options for holiday season

1. Navigate to Meal Options section
2. Click "Add Meal" for each new seasonal option:
   - Add "Holiday Special"
   - Add "Festive Vegetarian"
3. After season ends:
   - Delete seasonal meals
   - Or keep for next year

---

### Workflow 2: New Service Package Launch
**Scenario**: Launch "Premium Comfort" service bundle

1. Navigate to Ancillary Services section
2. Click "Add Service"
3. Add "Premium Comfort Package"
4. Include description in name: "Premium Comfort (Extra Legroom + Priority Boarding)"
5. Service now available for passenger selection

---

### Workflow 3: Shop Inventory Refresh
**Scenario**: Update shop for new product line

1. Navigate to Shop Items section
2. Review existing items
3. Delete discontinued products
4. Add new products:
   - Click "Add Shop Item"
   - Fill details for each product
   - Verify pricing and categories
5. Edit existing items for price updates

---

### Workflow 4: Price Adjustment Campaign
**Scenario**: 20% off all electronics for one month

1. Navigate to Shop Items section
2. Find all Electronics category items
3. For each item:
   - Click "Edit"
   - Calculate new price (original × 0.8)
   - Update price field
   - Click "Update"
4. After campaign:
   - Repeat process with original prices

---

### Workflow 5: Compliance Update
**Scenario**: Remove non-compliant meal option

1. Navigate to Meal Options section
2. Identify the non-compliant option
3. Click "Delete" on the meal card
4. Confirm deletion
5. Add replacement compliant option if needed
6. Notify relevant staff of change

---

## Data Management Best Practices

### Ancillary Services
1. ✅ **Clear Naming**: Use passenger-friendly, descriptive names
2. ✅ **Regular Review**: Audit services quarterly
3. ✅ **Consistency**: Maintain naming conventions
4. ✅ **Documentation**: Keep track of what each service includes
5. ✅ **Seasonal Management**: Add/remove based on demand

### Meal Options
1. ✅ **Standard Terms**: Use industry-standard dietary terms
2. ✅ **Catering Alignment**: Coordinate with catering partners
3. ✅ **Passenger Communication**: Ensure meal names are clear
4. ✅ **Allergen Awareness**: Include allergen info in names when critical
5. ✅ **Minimal Changes**: Avoid frequent changes that confuse passengers

### Shop Items
1. ✅ **Accurate Pricing**: Regularly review and update prices
2. ✅ **Category Organization**: Keep items in correct categories
3. ✅ **Inventory Sync**: Align with actual stock availability
4. ✅ **Competitive Analysis**: Monitor market pricing
5. ✅ **Quality Control**: Only add reputable products

---

## Troubleshooting

### Problem: Can't Delete Service with Validation Error
**Cause**: Service may be in use by passengers

**Solution**:
1. Check if passengers have active bookings with this service
2. Consider editing instead of deleting
3. Wait until flights complete before deleting
4. Contact system administrator if delete is critical

---

### Problem: Shop Item Price Shows Incorrectly
**Possible Causes**:
- Decimal point entered incorrectly
- Currency not matching display format
- Browser caching old prices

**Solution**:
1. Edit the shop item
2. Verify price field has correct decimal format (e.g., 29.99)
3. Check currency selection
4. Refresh browser after saving
5. Clear browser cache if needed

---

### Problem: Meal Option Not Appearing in Passenger Form
**Possible Causes**:
- Page needs refresh
- Meal was deleted after page loaded
- Browser cache issue

**Solution**:
1. Refresh the page (F5)
2. Navigate away and back to Services & Menu tab
3. Verify meal still exists in Meal Options section
4. Check browser console for errors

---

### Problem: Can't Add Service with Empty Name
**Cause**: Validation requires service name

**Solution**:
1. Ensure service name field is not empty
2. Service name must have at least one character
3. Avoid spaces-only names
4. Use descriptive, meaningful names

---

### Problem: Duplicate Shop Items Created
**Cause**: Adding same item multiple times

**Solution**:
1. Search table before adding new items
2. Use unique, specific names
3. Delete duplicate entries
4. Establish naming convention to prevent duplicates

---

## Keyboard Shortcuts

### General Navigation
- **Tab**: Move between fields in dialogs
- **Shift + Tab**: Move backwards between fields
- **Enter**: Submit form (when in dialog)
- **Escape**: Close open dialog

### Dialog Interactions
- **Enter**: Confirm/Save (when focused on button)
- **Escape**: Cancel/Close dialog
- **Space**: Toggle buttons (accessibility)

---

## Tips and Tricks

### Efficient Service Management
- **Batch Updates**: Plan changes in advance, execute together
- **Naming Conventions**: Use prefixes for categories (e.g., "BAG: Extra Luggage")
- **Regular Audits**: Review quarterly to remove unused services
- **Passenger Feedback**: Base additions on passenger requests

### Meal Option Strategies
- **Seasonal Variety**: Add seasonal options for holidays
- **Cultural Sensitivity**: Include diverse cultural meal options
- **Clear Labeling**: Use internationally recognized terms
- **Health Trends**: Stay current with dietary trends

### Shop Item Optimization
- **Category Balance**: Ensure variety in each category
- **Price Points**: Offer range from budget to premium
- **Popular Items**: Stock bestsellers prominently
- **Seasonal Products**: Rotate based on travel seasons
- **Bundle Opportunities**: Consider creating item bundles

### Data Integrity
- **Before Deleting**: Always check impact on existing bookings
- **Test Changes**: Verify changes in other tabs (In-Flight, Admin Passengers)
- **Backup Data**: Take notes of original values before bulk edits
- **Coordinate Updates**: Inform relevant staff before major changes

---

## Integration with Other Tabs

### Admin Dashboard - Passengers Tab
- Services added here appear in passenger service selection
- Meal options available when adding/editing passengers
- Changes reflect immediately in passenger data

### In-Flight Tab
- Ancillary services can be added to passengers during flight
- Meal options can be changed for passengers
- Shop items available in in-flight shop catalog
- Staff see real-time updates of all items

### Check-In Tab
- Special meal preferences display during check-in
- Wheelchair and infant services (if added) show in check-in
- Updates visible to check-in staff immediately

---

## Accessibility Features

### Screen Reader Support
- All buttons have descriptive labels
- Form fields have proper labels
- Dialogs announce when opened/closed
- Success/error messages are announced

### Keyboard Navigation
- Full keyboard support for all operations
- Logical tab order in forms
- Focus indicators on all interactive elements
- Dialogs can be closed with Escape key

### Visual Accessibility
- High contrast colors for warnings
- Clear visual hierarchy
- Icons supplement text
- Readable font sizes throughout

---

## Security and Permissions

### Admin-Only Access
- Only users with admin role can access this tab
- Changes require admin authentication
- All modifications are logged (if auditing enabled)

### Data Safety
- Confirmation dialogs prevent accidental deletions
- No undo function - changes are permanent
- Consider impact before deleting items in use

---

## Related Documentation

For additional information, see:
- **ADMIN_DASHBOARD_GUIDE.md**: Passenger management procedures
- **CHECK_IN_GUIDE.md**: How check-in staff use these services
- **INFLIGHT_GUIDE.md**: How in-flight staff use shop items
- **AUTHENTICATION_GUIDE.md**: Admin roles and permissions
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
