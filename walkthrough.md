# Savedit Web Experience Walkthrough

I have implemented the core web experience for Savedit, mirroring the mobile app's functionality.

## Changes Made

### Layout & Navigation
- **Sidebar**: Added a responsive sidebar for desktop navigation.
- **Mobile Nav**: Added a hamburger menu using a Sheet component for mobile.
- **Dashboard Layout**: Wrapped all dashboard pages in a persistent layout.

### Home Feed
- **Toolbar**: Added search, filter (by tag/provider), sort (newest/oldest/title), and view toggle (grid/list).
- **Filtering**: Implemented client-side filtering and sorting for instant feedback.

### Collections
- **List View**: View all collections with item counts.
- **Create Collection**: Dialog to create new collections.
- **Detail View**: View items within a specific collection.

### Reminders
- **Reminders Page**: List all saved items that have an active reminder.

### Settings
- **Profile Settings**: View and update your profile information (Full Name).

## Verification Steps

1.  **Navigation**:
    - Go to `/dashboard`.
    - Click "Collections", "Reminders", "Settings" in the sidebar.
    - Verify the URL changes and the correct page loads.
    - On mobile, use the hamburger menu to navigate.

2.  **Home Feed**:
    - **Search**: Type in the search bar. Verify items filter in real-time.
    - **Filter**: Click the filter icon. Select "All Items" or other options (if implemented in backend).
    - **Sort**: Click the sort icon. Choose "Oldest" or "Title". Verify order changes.
    - **View**: Toggle between Grid and List view.

3.  **Collections**:
    - Click "Create Collection". Enter a name. Click "Create".
    - Verify the new collection appears in the list.
    - Click on a collection card. Verify you see the detail page.

4.  **Reminders**:
    - Go to "Reminders". Verify you see items with reminders (if any).

5.  **Settings**:
    - Go to "Settings".
    - Change your "Full Name". Click "Save Changes".
    - Verify the success toast appears.
