# Accessibility Implementation Guide

## WCAG 2.0 Level A Compliance

### Implemented Features

#### 1. Focus Management
- **Focus Indicators**: All interactive elements have visible 3px blue outline on focus
- **Skip to Main Content**: Skip navigation link for keyboard users
- **Keyboard Navigation**: All features accessible via keyboard

#### 2. Screen Reader Support
- **ARIA Labels**: 
  - Navigation buttons include aria-label attributes
  - Buttons describe their action (e.g., "Navigate to Check-In")
  - Loading states marked with role="status" and aria-live="polite"
  - Current page indicated with aria-current="page"
- **Semantic HTML**:
  - `<nav role="navigation">` for navigation bar
  - `<main role="main">` for main content area
  - `<h1>` for page title, proper heading hierarchy
- **Screen Reader Only Content**: `.sr-only` class for hidden descriptive text

#### 3. Visual Accessibility
- **High Contrast Support**: Styles adapt to high contrast mode
- **Reduced Motion**: Respects prefers-reduced-motion for animations
- **Touch Targets**: Minimum 44x44px for mobile interactions
- **Color Contrast**: Material-UI default colors meet WCAG AA standards

#### 4. Forms & Interactions
- **Label Association**: All form inputs have associated labels
- **Error Messages**: Clear error feedback for failed operations
- **Required Fields**: Marked and announced to screen readers
- **Progress Indicators**: Loading states visible and announced

### Code Examples

#### Adding ARIA Labels to Buttons
```javascript
<Button
  aria-label="Navigate to Check-In"
  aria-current={currentView === 'checkin' ? 'page' : undefined}
>
  Check-In
</Button>
```

#### Loading States
```javascript
<Box role="status" aria-live="polite">
  <CircularProgress aria-label="Loading content" />
  <Typography>Loading...</Typography>
</Box>
```

#### Skip Navigation
```javascript
<a href="#main-content" className="skip-to-main">
  Skip to main content
</a>
```

### Testing Recommendations

1. **Keyboard Navigation**
   - Tab through all interactive elements
   - Verify focus indicators are visible
   - Test Enter/Space key activation

2. **Screen Reader Testing**
   - NVDA (Windows - Free)
   - JAWS (Windows - Commercial)
   - VoiceOver (macOS/iOS - Built-in)
   - TalkBack (Android - Built-in)

3. **Automated Testing**
   - axe DevTools browser extension
   - Lighthouse Accessibility audit
   - WAVE Web Accessibility Evaluation Tool

4. **Manual Checks**
   - Color contrast ratio (4.5:1 for normal text)
   - Touch target size (44x44px minimum)
   - Form validation messages
   - Error recovery

### Components Enhancement Suggestions

#### StaffCheckIn Component
- Add aria-label to flight selection list items
- Mark checked-in passengers with aria-checked
- Announce check-in success with aria-live region

#### AdminDashboard Component
- Add aria-label to table headers
- Mark required form fields with aria-required
- Announce CRUD operation success/failure

#### InFlight Component
- Label shop item quantity controls
- Announce total price changes
- Mark selected meal preferences

### Resources
- [WCAG 2.0 Guidelines](https://www.w3.org/WAI/WCAG20/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [Material-UI Accessibility Guide](https://mui.com/material-ui/guides/accessibility/)
- [WebAIM Articles](https://webaim.org/articles/)
