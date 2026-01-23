# Employee System Access Management App

A comprehensive web application built with Next.js 14 and TailAdmin for managing employee access to various company systems.

## Features

### Core Functionality
- **System Directory**: Browse all company systems with detailed information
- **Access Management**: Track which employees have access to which systems
- **User Roles**: Optional role-based access (Admin, User, Viewer)
- **Offboarding Workflow**: Request access removal with target dates and notify system owners
- **Public Directory**: All users can view systems and find system owners for support/access requests

### Pages

1. **Dashboard** (`/access-dashboard`)
   - Overview with statistics (total systems, users with access, pending offboarding requests)
   - Quick access to recent systems
   - Personal access summary

2. **Systems Directory** (`/systems-directory`)
   - Searchable and filterable list of all systems
   - Filter by category (HR, Finance, IT, Operations, Sales, Marketing)
   - Shows system name, owner, description, and user count
   - Contact system owners via mailto links

3. **System Detail Page** (`/system/[id]`)
   - Complete list of users with access to the system
   - Sortable table by name, role, or date granted
   - System owner contact information
   - Search users within the system

4. **My Access** (`/my-access`)
   - View current user's system access list
   - Filter by category
   - Quick stats (total systems, admin access, user access)
   - Direct contact buttons for system owners

5. **Offboarding Requests** (`/offboarding`)
   - Form to create access removal requests
   - Select user, system, removal date, and add notes
   - View pending and completed requests
   - Admin can mark requests as completed
   - Filter by status (All, Pending, Completed)

6. **Admin: Manage Access** (`/admin/manage-access`)
   - Add/remove user access to systems
   - Assign roles to users
   - Search and filter access records
   - Statistics on total access records

7. **Admin: Manage Systems** (`/admin/manage-systems`)
   - Create, edit, and delete systems
   - Assign system owners
   - Categorize systems
   - View user count per system

## Authentication

The app uses **mock authentication** for demonstration purposes:
- No password required - just enter an email address
- Users from the IT department automatically have admin privileges
- Authentication state is stored in localStorage

### Demo Users

| Name | Email | Department | Admin? |
|------|-------|-----------|--------|
| John Doe | john.doe@company.com | IT | Yes |
| Jane Smith | jane.smith@company.com | HR | No |
| Mike Johnson | mike.johnson@company.com | Finance | No |
| Sarah Williams | sarah.williams@company.com | Operations | No |
| Tom Brown | tom.brown@company.com | IT | Yes |
| Emily Davis | emily.davis@company.com | HR | No |
| David Wilson | david.wilson@company.com | Finance | No |
| Lisa Anderson | lisa.anderson@company.com | Sales | No |
| Robert Taylor | robert.taylor@company.com | Marketing | No |
| Maria Garcia | maria.garcia@company.com | Operations | No |

## Data Structure

### Systems
```typescript
{
  id: string;
  name: string;
  description: string;
  category: 'HR' | 'Finance' | 'IT' | 'Operations' | 'Sales' | 'Marketing';
  owner: {
    name: string;
    email: string;
  };
}
```

### Users
```typescript
{
  id: string;
  name: string;
  email: string;
  department: string;
}
```

### Access Records
```typescript
{
  id: string;
  userId: string;
  systemId: string;
  role?: string; // Optional: Admin, User, Viewer
  grantedDate: string;
}
```

### Offboarding Requests
```typescript
{
  id: string;
  userId: string;
  systemId: string;
  requestedBy: string;
  removalDate: string;
  status: 'pending' | 'completed';
  notes?: string;
  createdAt: string;
}
```

## Mock Data

The application comes with pre-populated mock data:
- 10 users across different departments
- 10 systems (Workday, SAP Finance, Jira, Salesforce, Slack, NetSuite, BambooHR, HubSpot, ServiceNow, Monday.com)
- 33 access records
- 3 offboarding requests (2 pending, 1 completed)

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run the development server**
   ```bash
   npm run dev
   ```

3. **Open the application**
   Navigate to [http://localhost:3000](http://localhost:3000)

4. **Login**
   - Enter any email from the demo users list
   - Or click on a user from the quick select list
   - Users in IT department (John Doe, Tom Brown) have admin access

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with TailAdmin design system
- **State Management**: React Context API for authentication
- **Type Safety**: TypeScript
- **Icons**: Inline SVG icons

## Features Breakdown

### User Features
- View all available systems in the company
- See who owns each system and contact them directly
- Check personal access across all systems
- Filter and search systems by name, category, or owner

### Admin Features
- Add/remove user access to any system
- Assign roles (Admin, User, Viewer) to users
- Create and manage system definitions
- Edit system details and owners
- Track offboarding requests and mark them complete

### Security Features
- Protected admin routes (redirects non-admin users)
- Role-based access control
- Contact system owners via secure mailto links

## UI/UX Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Search & Filters**: Powerful search and filtering on all pages
- **Sortable Tables**: Sort users by name, role, or date
- **Status Badges**: Visual indicators for roles, status, and categories
- **Modal Forms**: Clean modal dialogs for creating/editing records
- **Statistics Cards**: Visual dashboard with key metrics
- **Gradient Design**: Modern gradient backgrounds and buttons
- **Smooth Animations**: Hover effects and transitions

## File Structure

```
app/
  access-login/           # Login page
  access-dashboard/       # Main dashboard
  systems-directory/      # Public systems directory
  system/[id]/           # Individual system detail page
  my-access/             # User's personal access page
  offboarding/           # Offboarding requests page
  admin/
    manage-access/       # Admin: Manage user access
    manage-systems/      # Admin: Manage systems (CRUD)

components/
  AccessLayout.tsx       # Main layout with navigation

context/
  AuthContext.tsx        # Authentication context

lib/
  mock-data.ts          # Mock data and helper functions
```

## Future Enhancements

Potential improvements for production use:
- Real authentication with JWT/OAuth
- Database integration (PostgreSQL, MongoDB)
- API endpoints for CRUD operations
- Email notifications for offboarding requests
- Audit logs for access changes
- Export functionality (CSV, Excel)
- Advanced reporting and analytics
- Multi-tenant support
- Role-based permissions system
- Integration with Active Directory/LDAP
- Automated access reviews
- Compliance reports

## License

This is a demonstration application. Modify as needed for your use case.
