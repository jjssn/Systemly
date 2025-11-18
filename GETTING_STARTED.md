# Getting Started with Sysly

## Quick Start

The application is now running at: **http://localhost:3000**

## Demo Credentials

### Admin Account (Full Access)
- **Email**: `admin@systemly.com`
- **Password**: `admin123`

### Regular User Accounts (Read-Only)
- **Email**: `john@systemly.com` | **Password**: `user123`
- **Email**: `jane@systemly.com` | **Password**: `user123`

## What You Can Do

### As an Admin
1. **View Dashboard** - See all systems (approved and pending)
2. **Create Systems** - Click "+ New System" on the dashboard
3. **Edit Systems** - Click on any system card, then click "Edit"
4. **Approve/Reject Systems** - Toggle approval status on system detail pages
5. **Manage Users** - Add or remove users from systems
6. **Delete Systems** - Remove systems from the platform
7. **View Users** - Browse all users in the User Directory

### As a Regular User
1. **View Approved Systems** - See only approved systems on the dashboard
2. **View System Details** - Click on any system to see owner and assigned users
3. **View User Directory** - Browse all users in the organization

## Sample Data

The database has been seeded with:
- **3 Users**: 1 Admin (Admin User) and 2 Regular Users (John Doe, Jane Smith)
- **3 Systems**:
  - HR Management System (Approved)
  - Finance Portal (Approved)
  - Project Tracker (Not Approved)
- **User Assignments**: Various users assigned to different systems

## Key Features to Explore

### 1. System Management
- Navigate to the dashboard to see all systems
- Click on a system card to view details
- Try creating a new system (Admin only)
- Edit system information (Admin/Owner only)

### 2. User Assignment
- Open any system detail page
- Click "Add User" to assign users
- Click "Remove" next to a user to unassign them

### 3. Approval Workflow
- View unapproved systems (Admin only)
- Toggle approval status on system detail pages
- Filter dashboard by "All Systems" or "Approved Only"

### 4. User Directory
- Click "Users" in the navigation bar
- Search for users by name or email
- View user roles and join dates

## Application Structure

```
Sysly/
├── Dashboard         → http://localhost:3000/dashboard
├── User Directory    → http://localhost:3000/users
├── System Detail     → http://localhost:3000/systems/[id]
├── New System        → http://localhost:3000/systems/new (Admin only)
└── Edit System       → http://localhost:3000/systems/[id]/edit (Admin/Owner)
```

## Access Control Summary

| Feature | Admin | System Owner | Regular User |
|---------|-------|--------------|--------------|
| View Approved Systems | ✓ | ✓ | ✓ |
| View Pending Systems | ✓ | ✓ (own) | ✗ |
| Create Systems | ✓ | ✗ | ✗ |
| Edit Systems | ✓ | ✓ (own) | ✗ |
| Delete Systems | ✓ | ✗ | ✗ |
| Approve Systems | ✓ | ✗ | ✗ |
| Assign Users | ✓ | ✓ (own) | ✗ |
| View User Directory | ✓ | ✓ | ✓ |

## Testing Scenarios

### Scenario 1: Create and Approve a System (Admin)
1. Login as `admin@systemly.com`
2. Click "+ New System" on the dashboard
3. Fill in system details and create
4. View the system detail page
5. Toggle approval status

### Scenario 2: Assign Users to a System (Admin)
1. Login as `admin@systemly.com`
2. Click on any system card
3. Click "Add User"
4. Select a user from the dropdown
5. Click "Add" to assign

### Scenario 3: View as Regular User
1. Login as `john@systemly.com`
2. Notice only approved systems are visible
3. Click on a system to view details
4. Notice you cannot edit or manage users

### Scenario 4: System Owner Capabilities
1. Login as `john@systemly.com`
2. View "Project Tracker" (owned by John)
3. As the owner, John can edit and assign users
4. But cannot delete or approve the system

## Development Commands

```bash
# Start development server
npm run dev

# Seed database with fresh data
npm run seed

# Run database migrations
npx prisma migrate dev

# Open Prisma Studio (database GUI)
npx prisma studio

# Build for production
npm run build

# Start production server
npm start
```

## Troubleshooting

### Cannot login
- Make sure the database is seeded: `npm run seed`
- Check that the server is running: http://localhost:3000

### Changes not reflected
- Hard refresh the browser (Ctrl+Shift+R or Cmd+Shift+R)
- Clear browser cache
- Restart the dev server

### Port 3000 already in use
- Kill the process using port 3000
- Or set a different port: `PORT=3001 npm run dev`

## Next Steps

1. Explore all pages and features
2. Test different user roles
3. Try creating, editing, and managing systems
4. Experiment with the user assignment interface
5. Check the README.md for more detailed information

Enjoy using Sysly!
