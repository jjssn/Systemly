// Mock data for Employee System Access Management

export type User = {
  id: string;
  name: string;
  email: string;
  department: string;
};

export type SystemOwner = {
  userId: string;
  name: string;
  email: string;
};

export type System = {
  id: string;
  name: string;
  description: string;
  category: 'HR' | 'Finance' | 'IT' | 'Operations' | 'Sales' | 'Marketing';
  owner: SystemOwner;
  coOwners?: SystemOwner[]; // Optional co-owners who have same permissions as owner
};

export type AccessRecord = {
  id: string;
  userId: string;
  systemId: string;
  role?: string; // Optional: Admin, User, Viewer, etc.
  grantedDate: string;
  grantedBy?: string; // Who granted this access
};

export type OffboardingRequest = {
  id: string;
  userId: string;
  systemIds: string[]; // Changed to array to support multiple systems or 'all'
  requestedBy: string;
  removalDate: string;
  status: 'pending' | 'completed';
  notes?: string;
  createdAt: string;
  allSystems?: boolean; // Flag to indicate if removing from all systems
};

// Mock Users
export const mockUsers: User[] = [
  { id: '1', name: 'John Doe', email: 'john.doe@company.com', department: 'IT' },
  { id: '2', name: 'Jane Smith', email: 'jane.smith@company.com', department: 'HR' },
  { id: '3', name: 'Mike Johnson', email: 'mike.johnson@company.com', department: 'Finance' },
  { id: '4', name: 'Sarah Williams', email: 'sarah.williams@company.com', department: 'Operations' },
  { id: '5', name: 'Tom Brown', email: 'tom.brown@company.com', department: 'IT' },
  { id: '6', name: 'Emily Davis', email: 'emily.davis@company.com', department: 'HR' },
  { id: '7', name: 'David Wilson', email: 'david.wilson@company.com', department: 'Finance' },
  { id: '8', name: 'Lisa Anderson', email: 'lisa.anderson@company.com', department: 'Sales' },
  { id: '9', name: 'Robert Taylor', email: 'robert.taylor@company.com', department: 'Marketing' },
  { id: '10', name: 'Maria Garcia', email: 'maria.garcia@company.com', department: 'Operations' },
];

// Mock Systems
export const mockSystems: System[] = [
  {
    id: '1',
    name: 'Workday',
    description: 'Human Capital Management system for HR processes, payroll, and employee data',
    category: 'HR',
    owner: { userId: '2', name: 'Jane Smith', email: 'jane.smith@company.com' },
    coOwners: [
      { userId: '6', name: 'Emily Davis', email: 'emily.davis@company.com' }
    ],
  },
  {
    id: '2',
    name: 'SAP Finance',
    description: 'Enterprise resource planning system for financial management and reporting',
    category: 'Finance',
    owner: { userId: '3', name: 'Mike Johnson', email: 'mike.johnson@company.com' },
    coOwners: [
      { userId: '7', name: 'David Wilson', email: 'david.wilson@company.com' }
    ],
  },
  {
    id: '3',
    name: 'Jira',
    description: 'Project management and issue tracking tool for software development teams',
    category: 'IT',
    owner: { userId: '1', name: 'John Doe', email: 'john.doe@company.com' },
    coOwners: [
      { userId: '5', name: 'Tom Brown', email: 'tom.brown@company.com' }
    ],
  },
  {
    id: '4',
    name: 'Salesforce',
    description: 'Customer relationship management platform for sales and customer service',
    category: 'Sales',
    owner: { userId: '8', name: 'Lisa Anderson', email: 'lisa.anderson@company.com' },
  },
  {
    id: '5',
    name: 'Slack',
    description: 'Team communication and collaboration platform',
    category: 'IT',
    owner: { userId: '1', name: 'John Doe', email: 'john.doe@company.com' },
  },
  {
    id: '6',
    name: 'NetSuite',
    description: 'Cloud-based ERP system for accounting and business management',
    category: 'Finance',
    owner: { userId: '7', name: 'David Wilson', email: 'david.wilson@company.com' },
  },
  {
    id: '7',
    name: 'BambooHR',
    description: 'HR software for employee records, time-off tracking, and performance management',
    category: 'HR',
    owner: { userId: '6', name: 'Emily Davis', email: 'emily.davis@company.com' },
  },
  {
    id: '8',
    name: 'HubSpot',
    description: 'Marketing automation and CRM platform',
    category: 'Marketing',
    owner: { userId: '9', name: 'Robert Taylor', email: 'robert.taylor@company.com' },
  },
  {
    id: '9',
    name: 'ServiceNow',
    description: 'IT service management and operations platform',
    category: 'IT',
    owner: { userId: '5', name: 'Tom Brown', email: 'tom.brown@company.com' },
  },
  {
    id: '10',
    name: 'Monday.com',
    description: 'Work operating system for project and workflow management',
    category: 'Operations',
    owner: { userId: '4', name: 'Sarah Williams', email: 'sarah.williams@company.com' },
  },
];

// Mock Access Records
export const mockAccessRecords: AccessRecord[] = [
  // Workday access
  { id: '1', userId: '2', systemId: '1', role: 'Admin', grantedDate: '2024-01-15' },
  { id: '2', userId: '6', systemId: '1', role: 'User', grantedDate: '2024-02-01' },
  { id: '3', userId: '3', systemId: '1', role: 'Viewer', grantedDate: '2024-03-10' },

  // SAP Finance access
  { id: '4', userId: '3', systemId: '2', role: 'Admin', grantedDate: '2024-01-10' },
  { id: '5', userId: '7', systemId: '2', role: 'User', grantedDate: '2024-01-20' },
  { id: '6', userId: '4', systemId: '2', role: 'Viewer', grantedDate: '2024-02-15' },

  // Jira access
  { id: '7', userId: '1', systemId: '3', role: 'Admin', grantedDate: '2024-01-05' },
  { id: '8', userId: '5', systemId: '3', role: 'User', grantedDate: '2024-01-08' },
  { id: '9', userId: '8', systemId: '3', role: 'User', grantedDate: '2024-03-01' },
  { id: '10', userId: '9', systemId: '3', role: 'Viewer', grantedDate: '2024-03-15' },

  // Salesforce access
  { id: '11', userId: '8', systemId: '4', role: 'Admin', grantedDate: '2024-01-12' },
  { id: '12', userId: '9', systemId: '4', role: 'User', grantedDate: '2024-02-01' },
  { id: '13', userId: '4', systemId: '4', role: 'User', grantedDate: '2024-02-20' },

  // Slack access (everyone)
  { id: '14', userId: '1', systemId: '5', grantedDate: '2024-01-01' },
  { id: '15', userId: '2', systemId: '5', grantedDate: '2024-01-01' },
  { id: '16', userId: '3', systemId: '5', grantedDate: '2024-01-01' },
  { id: '17', userId: '4', systemId: '5', grantedDate: '2024-01-01' },
  { id: '18', userId: '5', systemId: '5', grantedDate: '2024-01-01' },
  { id: '19', userId: '6', systemId: '5', grantedDate: '2024-01-01' },
  { id: '20', userId: '7', systemId: '5', grantedDate: '2024-01-01' },
  { id: '21', userId: '8', systemId: '5', grantedDate: '2024-01-01' },
  { id: '22', userId: '9', systemId: '5', grantedDate: '2024-01-01' },
  { id: '23', userId: '10', systemId: '5', grantedDate: '2024-01-01' },

  // NetSuite access
  { id: '24', userId: '7', systemId: '6', role: 'Admin', grantedDate: '2024-01-18' },
  { id: '25', userId: '3', systemId: '6', role: 'User', grantedDate: '2024-02-05' },

  // BambooHR access
  { id: '26', userId: '6', systemId: '7', role: 'Admin', grantedDate: '2024-01-22' },
  { id: '27', userId: '2', systemId: '7', role: 'User', grantedDate: '2024-02-10' },

  // HubSpot access
  { id: '28', userId: '9', systemId: '8', role: 'Admin', grantedDate: '2024-01-25' },
  { id: '29', userId: '8', systemId: '8', role: 'User', grantedDate: '2024-02-12' },

  // ServiceNow access
  { id: '30', userId: '5', systemId: '9', role: 'Admin', grantedDate: '2024-01-30' },
  { id: '31', userId: '1', systemId: '9', role: 'User', grantedDate: '2024-02-15' },

  // Monday.com access
  { id: '32', userId: '4', systemId: '10', role: 'Admin', grantedDate: '2024-02-01' },
  { id: '33', userId: '10', systemId: '10', role: 'User', grantedDate: '2024-02-18' },
];

// Mock Offboarding Requests
export const mockOffboardingRequests: OffboardingRequest[] = [
  {
    id: '1',
    userId: '10',
    systemIds: [], // Empty means all systems
    allSystems: true,
    requestedBy: 'Sarah Williams',
    removalDate: '2026-02-01',
    status: 'pending',
    notes: 'Employee leaving the company',
    createdAt: '2026-01-15',
  },
  {
    id: '2',
    userId: '9',
    systemIds: ['3', '8'], // Specific systems
    allSystems: false,
    requestedBy: 'John Doe',
    removalDate: '2026-01-30',
    status: 'pending',
    notes: 'No longer needs access to Jira and HubSpot',
    createdAt: '2026-01-20',
  },
  {
    id: '3',
    userId: '8',
    systemIds: ['3'],
    allSystems: false,
    requestedBy: 'Lisa Anderson',
    removalDate: '2026-01-25',
    status: 'completed',
    notes: 'Project completed',
    createdAt: '2026-01-10',
  },
];

// Helper functions
export const getSystemById = (systemId: string): System | undefined => {
  return mockSystems.find(s => s.id === systemId);
};

export const getUserById = (userId: string): User | undefined => {
  return mockUsers.find(u => u.id === userId);
};

export const getAccessRecordsBySystem = (systemId: string): AccessRecord[] => {
  return mockAccessRecords.filter(ar => ar.systemId === systemId);
};

export const getAccessRecordsByUser = (userId: string): AccessRecord[] => {
  return mockAccessRecords.filter(ar => ar.userId === userId);
};

export const getUsersWithAccessToSystem = (systemId: string) => {
  const accessRecords = getAccessRecordsBySystem(systemId);
  return accessRecords.map(ar => {
    const user = getUserById(ar.userId);
    return {
      ...user,
      role: ar.role,
      grantedDate: ar.grantedDate,
      accessRecordId: ar.id,
    };
  }).filter(u => u.id); // Filter out undefined users
};

export const getSystemsForUser = (userId: string) => {
  const accessRecords = getAccessRecordsByUser(userId);
  return accessRecords.map(ar => {
    const system = getSystemById(ar.systemId);
    return {
      ...system,
      role: ar.role,
      grantedDate: ar.grantedDate,
      accessRecordId: ar.id,
    };
  }).filter(s => s.id); // Filter out undefined systems
};

export const getTotalUsersWithAccess = (): number => {
  const uniqueUserIds = new Set(mockAccessRecords.map(ar => ar.userId));
  return uniqueUserIds.size;
};

export const getPendingOffboardingRequests = (): OffboardingRequest[] => {
  return mockOffboardingRequests.filter(r => r.status === 'pending');
};

// Check if user is system owner or co-owner
export const isSystemOwnerOrCoOwner = (userId: string, systemId: string): boolean => {
  const system = getSystemById(systemId);
  if (!system) return false;

  if (system.owner.userId === userId) return true;
  if (system.coOwners?.some(co => co.userId === userId)) return true;

  return false;
};

// Get all systems where user is owner or co-owner
export const getSystemsOwnedByUser = (userId: string): System[] => {
  return mockSystems.filter(system =>
    system.owner.userId === userId ||
    system.coOwners?.some(co => co.userId === userId)
  );
};

// Check if user is Global Admin (IT department)
export const isGlobalAdmin = (userId: string): boolean => {
  const user = getUserById(userId);
  return user?.department === 'IT';
};
