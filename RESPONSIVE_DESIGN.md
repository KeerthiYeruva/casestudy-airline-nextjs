# Responsive Design Documentation

## Overview
This airline management application is designed with a mobile-first, responsive approach supporting three device categories: **Mobile**, **Tablet**, and **Desktop**.

---

## Breakpoint System (Material-UI)

```typescript
xs: 0px      // Mobile phones (portrait & landscape)
sm: 600px    // Tablets (portrait) / Large phones
md: 900px    // Tablets (landscape) / Small laptops  
lg: 1200px   // Desktops / Large tablets
xl: 1536px   // Large desktops / Wide screens
```

### Usage Examples
```tsx
// Responsive padding
sx={{ py: { xs: 2, sm: 3 } }}

// Responsive font size
sx={{ fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' } }}

// Responsive Grid layout
<Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
```

---

## Device-Specific Optimizations

### 📱 Mobile (< 600px)

#### Layout
- **Full-width components**: All sections stack vertically
- **Flight selection**: Full width, scrollable list
- **Seat map**: Compact view with 36x36px seats
- **Passenger list**: Single column cards

#### Typography
- Page titles: `1.5rem`
- Section headers: `1rem - 1.25rem`
- Body text: `0.875rem`
- Captions: `0.65rem - 0.75rem`

#### Touch Targets
- **Minimum size**: 40x40px (WCAG AAA: 44x44px recommended)
- Icon buttons: `40px × 40px`
- Regular buttons: `minHeight: 36px`
- Increased padding for easier tapping

#### Navigation
- Nav buttons wrap to new line if needed
- Icons hidden on very small screens
- Flexible button widths with `flex: 1 1 auto`
- Smaller font sizes: `0.7rem`

#### Spacing
- Container padding: `16px` (py: 2)
- Grid spacing: `16px` (spacing: 2)
- Component gaps: `4-8px` (gap: 0.5-1)

---

### 📱 Tablet (600px - 1199px)

#### Layout
- **2-column layouts** where appropriate
- **Sidebar navigation**: 3 columns (sm), 4 columns (md)
- **Main content**: 9 columns (sm), 8 columns (md)
- **Flight details**: 2×2 grid (4 items)

#### Typography
- Page titles: `2rem`
- Section headers: `1.25rem - 1.5rem`
- Body text: `1rem`
- Captions: `0.75rem - 0.875rem`

#### Touch Targets
- Icon buttons: `36px × 36px`
- Regular buttons: Standard Material-UI sizing
- Comfortable spacing for tablet use

#### Seat Map
- Seat sizes: `44x44px`
- Better spacing between seats
- Max height: `600px`

---

### 🖥️ Desktop (≥ 1200px)

#### Layout
- **Multi-column layouts**: Sidebar (3 col) + Main (9 col)
- **Seat map + Passenger list**: 7-5 column split (lg breakpoint)
- **Admin dashboard**: 3-4 column grids for services

#### Typography
- Full-size text as per theme defaults
- Enhanced readability with optimal line lengths

#### Interactions
- Hover states fully enabled
- Tooltips for additional information
- Keyboard navigation optimized

---

## Component-Specific Responsiveness

### Navigation Bar (AppBar)
```tsx
// Mobile
- Wraps buttons to new line
- Hides icons in buttons
- Smaller font sizes
- Full-width button container

// Tablet+
- Single row layout
- Shows icons
- Standard spacing
```

### Flight Selection Panel
```tsx
// All devices
<Grid size={{ xs: 12, md: 3 }}>
// Full width on mobile, sidebar on desktop
```

### Seat Map Visual
```tsx
// Mobile (xs)
- Seat size: 36×36px
- Gap: 4px (0.5)
- Max height: 450px
- Compact labels

// Desktop (sm+)
- Seat size: 44×44px
- Gap: 8px (1)
- Max height: 600px
- Full labels
```

### Passenger Cards
```tsx
// Mobile
- Avatar: 36-40px
- Compact spacing
- Stacked layout
- Full-width buttons

// Desktop
- Avatar: 40-56px
- Comfortable spacing
- Side-by-side actions
```

### Flight Details Grid
```tsx
// Mobile
<Grid size={{ xs: 6, sm: 3 }}>
// 2×2 grid on mobile, 1×4 row on tablet+

// Responsive typography
sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
```

---

## Accessibility Considerations

### Touch Target Sizes
Following **WCAG 2.5.5 Target Size (AAA)**:
- Minimum: 44×44 CSS pixels
- Our implementation: 36-40px (mobile), 44px+ (tablet/desktop)

### Focus Indicators
```scss
*:focus {
  outline: 3px solid #1976d2;
  outline-offset: 2px;
}
```

### Screen Reader Support
- Semantic HTML elements
- ARIA labels on interactive elements
- Skip-to-main-content link
- Proper heading hierarchy

### Reduced Motion
```scss
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Testing Recommendations

### Device Testing Matrix

| Device Category | Viewport Sizes | Key Test Areas |
|----------------|----------------|----------------|
| Small Mobile | 320×568, 375×667 | Navigation wrapping, touch targets |
| Large Mobile | 414×896, 428×926 | Button layouts, seat map usability |
| Tablet Portrait | 768×1024 | Grid layouts, passenger cards |
| Tablet Landscape | 1024×768 | Horizontal layouts, multi-column |
| Desktop | 1280×720, 1920×1080 | Full features, hover states |

### Browser Testing
- ✅ Chrome (mobile & desktop)
- ✅ Safari (iOS & macOS)
- ✅ Firefox
- ✅ Edge
- ✅ Samsung Internet

### Key Scenarios to Test
1. **Check-in flow** on mobile portrait
2. **Seat selection** on tablet
3. **Admin dashboard** on desktop
4. **In-flight services** across all devices
5. **Dialog/modal interactions** on mobile (should be fullscreen)
6. **Landscape orientation** on phones

---

## Performance Optimizations

### Mobile-Specific
- Lazy loading for components
- Image optimization
- Reduced animation complexity
- Touch event optimization

### Code Splitting
```tsx
const StaffCheckIn = lazy(() => import("@/components/StaffCheckIn"));
const InFlight = lazy(() => import("@/components/InFlight"));
const AdminDashboard = lazy(() => import("@/components/AdminDashboard"));
```

---

## Future Enhancements

### Planned Improvements
1. **PWA Support**: Add manifest and service workers
2. **Offline Mode**: Cache critical data for offline access
3. **Hamburger Menu**: Collapsible mobile navigation
4. **Gesture Support**: Swipe navigation between views
5. **Adaptive Loading**: Different component versions for slow connections
6. **Dark Mode**: Complete dark theme implementation
7. **Tablet-Specific Layouts**: Optimized for iPad Pro and similar

### Experimental Features
- Split-screen support for large tablets
- Picture-in-Picture for video content
- Haptic feedback on mobile interactions

---

## Best Practices

### DO ✅
- Use MUI `sx` prop with responsive objects
- Test on real devices when possible
- Use semantic HTML for better accessibility
- Implement touch-friendly spacing
- Provide visual feedback for interactions

### DON'T ❌
- Hardcode pixel values without responsive alternatives
- Ignore landscape orientation on mobile
- Use hover-only interactions (ensure touch alternatives)
- Forget to test with larger font sizes (accessibility)
- Neglect keyboard navigation

---

## Resources

- [Material-UI Breakpoints](https://mui.com/material-ui/customization/breakpoints/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Responsive Web Design Basics](https://web.dev/responsive-web-design-basics/)
- [Mobile Touch Target Sizes](https://web.dev/accessible-tap-targets/)

---

**Last Updated**: December 5, 2025  
**Version**: 1.0.0
