# Monthly Budget App

A clean, responsive web application for managing personal monthly budgets with real-time calculations and local storage persistence.

## Features

- **Income Tracking**: Set and modify your monthly income with auto-resizing input
- **Dual Category System**:
  - Fixed Expenses (rent, utilities, insurance, etc.)
  - Discretionary Spending (entertainment, dining out, hobbies, etc.)
- **Real-time Calculations**: Automatic budget summary updates as you type
- **Visual Budget Status**: Color-coded remaining balance (green for surplus, red for over-budget)
- **Persistent Storage**: Your budget data is automatically saved to local storage
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Clean UI**: Modern, intuitive interface with smooth animations

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- No additional software or dependencies required

### Installation

1. Download or clone the project files
2. Ensure you have all three files in the same directory:
   - `index.html`
   - `script.js`
   - `styles.css`
3. Open `index.html` in your web browser

### File Structure

```
budget-app/
├── index.html      # Main HTML structure
├── script.js       # JavaScript functionality
└── styles.css      # CSS styling
```

## Usage

### Setting Up Your Budget

1. **Add Monthly Income**: Click on the income field and enter your monthly income
2. **Add Fixed Expenses**:
   - Click "Add Fixed Expense"
   - Enter category name (e.g., "Rent", "Car Payment")
   - Enter the amount
   - Repeat for all fixed expenses
3. **Add Discretionary Items**:
   - Click "Add Discretionary Item"
   - Enter category name (e.g., "Entertainment", "Dining Out")
   - Enter estimated amount
   - Repeat as needed

### Managing Categories

- **Edit**: Click on any field to modify names or amounts
- **Remove**: Click the "Remove" button next to any category
- **Quick Add**: Press Enter while typing a category name to add another category of the same type

### Understanding the Summary

The budget summary at the bottom shows:

- **Monthly Income**: Your total monthly income
- **Fixed Expenses**: Sum of all fixed expense categories
- **Discretionary Spending**: Sum of all discretionary categories
- **Total Allocated**: Combined fixed and discretionary spending
- **Remaining**: Income minus total allocated (color-coded for status)

## Technical Details

### Browser Support

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

### Storage

The app uses `localStorage` to automatically save your budget data. Your information persists between browser sessions but remains private to your device.

### Responsive Breakpoints

- Desktop: Full layout with side-by-side elements
- Tablet (768px and below): Stacked layout with adjusted spacing
- Mobile (480px and below): Single-column layout with full-width inputs

## Customization

### Styling

The app uses CSS custom properties (variables) for easy theming. Key variables in `:root`:

```css
--primary-color: #007bff;
--success-color: #28a745;
--danger-color: #dc3545;
--warning-color: #ffc107;
```

### Currency

Currently formatted for USD. To change currency, modify the `formatCurrency()` function in `script.js`:

```javascript
return new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD", // Change to desired currency code
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
}).format(amount);
```

## Keyboard Shortcuts

- **Enter**: When typing in a category name field, adds a new category of the same type
- **Tab**: Navigate between input fields
- **Arrow Keys**: Navigate through number inputs

## Contributing

This is a standalone web application. To contribute:

1. Fork or download the project
2. Make your changes
3. Test across different browsers and screen sizes
4. Submit your improvements

## License

This project is open source. Feel free to use, modify, and distribute as needed.

## Troubleshooting

### Data Not Saving

- Ensure your browser allows localStorage
- Check that you're not in incognito/private browsing mode

### Layout Issues

- Clear browser cache and refresh
- Ensure all three files are in the same directory
- Check browser console for any JavaScript errors

### Mobile Display Problems

- Try refreshing the page
- Ensure you're using a supported browser version

## Version History

- **v1.0**: Initial release with core budgeting functionality
- Auto-resizing inputs based on content
- Responsive design for all device sizes
- Local storage integration
