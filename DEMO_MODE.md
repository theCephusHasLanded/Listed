# Listed Demo Mode

The Listed platform includes a special demo mode that showcases the core UI and functionality of the talent discovery experience.

## What is Demo Mode?

Demo Mode is a standalone component that presents a simplified, non-Firebase-dependent version of the talent browsing interface. It's designed to:

1. Provide a quick preview of the platform's core functionality
2. Show stakeholders how the talent cards and filtering will look
3. Demonstrate the UI/UX without requiring authentication
4. Serve as a reference implementation for the main application

## Accessing Demo Mode

You can access the demo mode in two ways:

1. Visit `/demo` in the application (e.g., http://localhost:3001/demo)
2. Click the "Demo" link in the main navigation bar

## Features Showcased in Demo Mode

The demo mode includes:

- **Talent Cards**: Visual display of professional profiles with key information
- **Category Filtering**: Filter professionals by specialty category
- **Search Functionality**: Search for professionals by name, title, or services
- **Detail Modal**: View expanded information about a professional
- **Action Buttons**: Interactive pin and save buttons
- **Service Tags**: Visual representation of offered services

## Implementation Details

- The demo is implemented in `src/listed.tsx`
- It uses mock data rather than real Firebase data
- The UI matches the design system of the main application
- The demo is integrated as a route in the main application via `src/pages/DemoPage.tsx`

## How Demo Mode Differs from Production

While the demo provides a good representation of the final product, it has some notable differences:

1. **Data Source**: Uses hardcoded data instead of Firebase
2. **Authentication**: No login required to access the demo
3. **Interactivity**: Some buttons are for display only and don't trigger real actions
4. **Completeness**: Focused only on talent discovery, not the full application

## Usage Recommendations

- Use the demo to showcase the core concept to potential users
- Reference the UI components when implementing similar features in the main app
- Share the demo link with stakeholders who need a quick preview
- Toggle between demo and production modes to compare implementations

The demo mode will be maintained alongside the main application to showcase core functionality without requiring account creation.