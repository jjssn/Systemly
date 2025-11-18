# Systemly

A modern system management platform for tracking internal systems and user assignments.

## Features

- **Authentication & Authorization**: Secure login with role-based access control (Admin/User)
- **System Management**: Create, read, update, and delete internal systems
- **User Assignment**: Assign and remove users from systems
- **Approval Workflow**: Admin approval system for new systems
- **User Directory**: Browse all users in the organization
- **Dashboard**: Overview of all systems with filtering options
- **Modern UI**: Clean, responsive design built with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js
- **Password Hashing**: bcryptjs

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Systemly
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
The `.env` file is already configured for local development with SQLite.

4. Run database migrations:
```bash
npx prisma migrate dev
```

5. Seed the database with sample data:
```bash
npm run seed
```

### Running the Application

Start the development server:
```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Demo Credentials

**Admin Account:**
- Email: `admin@systemly.com`
- Password: `admin123`

**Regular User Accounts:**
- Email: `john@systemly.com` | Password: `user123`
- Email: `jane@systemly.com` | Password: `user123`

## User Roles

### Admin/System Owner
- Create new systems
- Edit system details
- Assign/remove users from systems
- Approve or reject systems
- Delete systems
- View all systems (approved and pending)

### Normal User
- View approved systems only
- See system details (owner, assigned users)
- Browse user directory
- Read-only access

## Database Schema

### User Model
- `id`: Unique identifier
- `name`: User's full name
- `email`: User's email (unique)
- `password`: Hashed password
- `role`: ADMIN or USER
- `createdAt`: Account creation timestamp

### System Model
- `id`: Unique identifier
- `name`: System name
- `description`: System description
- `approved`: Approval status (boolean)
- `ownerId`: Reference to system owner (User)
- `createdAt`: System creation timestamp

### SystemUser Model (Join Table)
- Links users to systems they're assigned to
- Ensures unique user-system combinations

## Key Features Breakdown

### Dashboard
- Display all systems in card format
- Filter between all systems and approved systems (Admin only)
- Quick access to create new systems (Admin only)
- Visual indicators for approval status

### System Detail Page
- View system information, owner, and assigned users
- Add/remove users (Admin/Owner only)
- Toggle approval status (Admin only)
- Edit system details (Admin/Owner only)
- Delete system (Admin only)

### User Assignment Interface
- Select from available users
- Real-time updates when users are added/removed
- Prevents duplicate assignments

### User Directory
- Searchable list of all users
- Display user roles and join dates
- Statistics summary

## API Endpoints

### Systems
- `GET /api/systems` - List all systems
- `POST /api/systems` - Create new system (Admin only)
- `GET /api/systems/[id]` - Get system details
- `PATCH /api/systems/[id]` - Update system (Admin/Owner only)
- `DELETE /api/systems/[id]` - Delete system (Admin only)

### System Users
- `POST /api/systems/[id]/users` - Assign user to system
- `DELETE /api/systems/[id]/users` - Remove user from system

### Users
- `GET /api/users` - List all users

### Authentication
- `POST /api/auth/signin` - Sign in
- `POST /api/auth/signout` - Sign out

## Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run seed` - Seed database with sample data

## Project Structure

```
Systemly/
├── app/
│   ├── api/              # API routes
│   ├── dashboard/        # Dashboard page
│   ├── login/            # Login page
│   ├── systems/          # System pages
│   ├── users/            # User directory
│   ├── layout.tsx        # Root layout
│   └── providers.tsx     # Client-side providers
├── components/           # React components
├── lib/                  # Utility libraries
├── prisma/              # Database schema and migrations
├── types/               # TypeScript type definitions
└── public/              # Static assets
```

## Security Features

- Password hashing with bcrypt
- Session-based authentication with NextAuth.js
- Role-based access control
- Protected API routes
- Input validation
- CSRF protection

## Future Enhancements

- Email notifications for system approvals
- System activity logs
- Advanced search and filtering
- User profile management
- System categories/tags
- Export system data
- Multi-language support
- Dark mode

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
