'use client';

import { use, useState } from 'react';
import AccessLayout from '@/components/AccessLayout';
import {
  getSystemById,
  getUsersWithAccessToSystem,
  isSystemOwnerOrCoOwner,
  isGlobalAdmin,
  mockUsers,
  mockAccessRecords,
  type AccessRecord
} from '@/lib/mock-data';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function SystemDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const system = getSystemById(resolvedParams.id);
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'role' | 'date'>('name');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showManageCoOwnersModal, setShowManageCoOwnersModal] = useState(false);
  const [accessRecords, setAccessRecords] = useState<AccessRecord[]>(mockAccessRecords);
  const [addUserForm, setAddUserForm] = useState({
    userId: '',
    role: 'User',
  });
  const [coOwnerUserId, setCoOwnerUserId] = useState('');

  if (!system) {
    return (
      <AccessLayout>
        <div className="text-center py-16">
          <div className="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">System Not Found</h2>
          <p className="text-gray-600 mb-6">The system you're looking for doesn't exist.</p>
          <Link
            href="/systems-directory"
            className="inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all"
          >
            Back to Directory
          </Link>
        </div>
      </AccessLayout>
    );
  }

  const canManageUsers = currentUser && (
    isGlobalAdmin(currentUser.id) || isSystemOwnerOrCoOwner(currentUser.id, system.id)
  );

  const systemAccessRecords = accessRecords.filter(ar => ar.systemId === resolvedParams.id);
  const usersWithAccess = systemAccessRecords.map(ar => {
    const user = mockUsers.find(u => u.id === ar.userId);
    return {
      ...user,
      role: ar.role,
      grantedDate: ar.grantedDate,
      accessRecordId: ar.id,
    };
  }).filter(u => u.id);

  const availableUsers = mockUsers.filter(user =>
    !systemAccessRecords.some(ar => ar.userId === user.id)
  );

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();

    const user = mockUsers.find(u => u.id === addUserForm.userId);
    if (!user) {
      alert('Please select a user');
      return;
    }

    const newAccessRecord: AccessRecord = {
      id: String(accessRecords.length + 1),
      userId: addUserForm.userId,
      systemId: resolvedParams.id,
      role: addUserForm.role,
      grantedDate: new Date().toISOString().split('T')[0],
      grantedBy: currentUser?.name,
    };

    setAccessRecords([...accessRecords, newAccessRecord]);
    setShowAddUserModal(false);
    setAddUserForm({
      userId: '',
      role: 'User',
    });
  };

  const handleRemoveUser = (accessRecordId: string) => {
    const record = accessRecords.find(ar => ar.id === accessRecordId);
    const user = mockUsers.find(u => u.id === record?.userId);

    if (confirm(`Are you sure you want to remove ${user?.name}'s access to ${system.name}?`)) {
      setAccessRecords(accessRecords.filter(ar => ar.id !== accessRecordId));
    }
  };

  const handleAddCoOwner = (e: React.FormEvent) => {
    e.preventDefault();

    const user = mockUsers.find(u => u.id === coOwnerUserId);
    if (!user) {
      alert('Please select a user');
      return;
    }

    // In a real app, this would update the system's coOwners in the database
    // For now, we'll just show a success message
    alert(`${user.name} has been added as a co-owner of ${system.name}`);
    setShowManageCoOwnersModal(false);
    setCoOwnerUserId('');
  };

  const handleRemoveCoOwner = (coOwnerUserId: string) => {
    const coOwner = mockUsers.find(u => u.id === coOwnerUserId);

    if (confirm(`Are you sure you want to remove ${coOwner?.name} as a co-owner?`)) {
      // In a real app, this would update the system's coOwners in the database
      alert(`${coOwner?.name} has been removed as a co-owner of ${system.name}`);
    }
  };

  const filteredUsers = usersWithAccess.filter(user =>
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortBy === 'name') {
      return (a.name || '').localeCompare(b.name || '');
    } else if (sortBy === 'role') {
      return (a.role || '').localeCompare(b.role || '');
    } else {
      return (a.grantedDate || '').localeCompare(b.grantedDate || '');
    }
  });

  return (
    <AccessLayout>
      <div>
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/systems-directory" className="hover:text-indigo-600 transition-colors">
              Systems Directory
            </Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 font-medium">{system.name}</span>
          </nav>
        </div>

        {/* System Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-3xl font-bold text-gray-900">{system.name}</h1>
                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-sm font-semibold rounded-lg">
                  {system.category}
                </span>
              </div>
              <p className="text-gray-600 text-lg">{system.description}</p>
            </div>
          </div>

          {/* System Owner Info */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {system.owner.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">System Owner</p>
                  <p className="text-xl font-bold text-gray-900">{system.owner.name}</p>
                  <p className="text-sm text-gray-600">{system.owner.email}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <a
                  href={`mailto:${system.owner.email}`}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Contact
                </a>
                {canManageUsers && (
                  <button
                    onClick={() => setShowManageCoOwnersModal(true)}
                    className="px-6 py-3 bg-white hover:bg-gray-50 text-indigo-700 font-semibold rounded-xl transition-all border border-indigo-200 flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Manage Co-Owners
                  </button>
                )}
              </div>
            </div>

            {/* Co-Owners */}
            {system.coOwners && system.coOwners.length > 0 && (
              <div className="pt-4 border-t border-indigo-200">
                <p className="text-sm font-semibold text-gray-700 mb-3">Co-Owners</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {system.coOwners.map((coOwner) => (
                    <div key={coOwner.userId} className="flex items-center justify-between bg-white rounded-lg p-3 border border-indigo-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold">
                          {coOwner.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{coOwner.name}</p>
                          <p className="text-xs text-gray-600">{coOwner.email}</p>
                        </div>
                      </div>
                      {canManageUsers && (
                        <button
                          onClick={() => handleRemoveCoOwner(coOwner.userId)}
                          className="text-red-600 hover:text-red-700 p-1"
                          title="Remove co-owner"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Users with Access */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Users with Access</h2>
              <p className="text-gray-600">
                <span className="font-semibold text-gray-900">{usersWithAccess.length}</span> users currently have access to this system
              </p>
            </div>
            {canManageUsers && (
              <button
                onClick={() => setShowAddUserModal(true)}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl inline-flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add User</span>
              </button>
            )}
          </div>

          {/* Search and Sort */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="search-users" className="block text-sm font-medium text-gray-700 mb-2">
                Search Users
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="search-users"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, email, or role..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                />
                <svg
                  className="absolute left-3 top-3.5 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <div>
              <label htmlFor="sort-by" className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                id="sort-by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'role' | 'date')}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all bg-white"
              >
                <option value="name">Name (A-Z)</option>
                <option value="role">Role</option>
                <option value="date">Date Granted</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          {sortedUsers.length === 0 ? (
            <div className="text-center py-12 border border-gray-200 rounded-xl">
              <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-600 text-sm">
                {searchQuery ? 'Try adjusting your search criteria' : 'No users have access to this system yet'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">User</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Department</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Role</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Access Granted</th>
                    {canManageUsers && (
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {sortedUsers.map((user, index) => (
                    <tr
                      key={user.accessRecordId}
                      className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                      }`}
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold">
                            {user.name?.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-gray-900">{user.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-600">{user.email}</td>
                      <td className="py-4 px-4">
                        <span className="px-2.5 py-1 bg-purple-50 text-purple-700 text-xs font-semibold rounded-lg">
                          {user.department}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        {user.role ? (
                          <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg ${
                            user.role === 'Admin' ? 'bg-red-100 text-red-700' :
                            user.role === 'User' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {user.role}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-gray-600 text-sm">
                        {user.grantedDate ? new Date(user.grantedDate).toLocaleDateString() : '-'}
                      </td>
                      {canManageUsers && (
                        <td className="py-4 px-4 text-right">
                          <button
                            onClick={() => handleRemoveUser(user.accessRecordId!)}
                            className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold rounded-lg transition-colors"
                          >
                            Remove
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Manage Co-Owners Modal */}
        {showManageCoOwnersModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Add Co-Owner</h2>
                  <button
                    onClick={() => setShowManageCoOwnersModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <form onSubmit={handleAddCoOwner} className="p-6 space-y-6">
                <div>
                  <label htmlFor="coOwnerUserId" className="block text-sm font-medium text-gray-700 mb-2">
                    Select User
                  </label>
                  <select
                    id="coOwnerUserId"
                    value={coOwnerUserId}
                    onChange={(e) => setCoOwnerUserId(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all bg-white"
                    required
                  >
                    <option value="">Select a user...</option>
                    {mockUsers
                      .filter(user =>
                        user.id !== system.owner.userId &&
                        !system.coOwners?.some(co => co.userId === user.id)
                      )
                      .map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name} ({user.department})
                        </option>
                      ))}
                  </select>
                  <p className="text-sm text-gray-500 mt-2">
                    Co-owners have the same permissions as the system owner to manage users and settings.
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowManageCoOwnersModal(false)}
                    className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all shadow-lg"
                  >
                    Add Co-Owner
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add User Modal */}
        {showAddUserModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Add User to {system.name}</h2>
                  <button
                    onClick={() => setShowAddUserModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <form onSubmit={handleAddUser} className="p-6 space-y-6">
                <div>
                  <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-2">
                    Select User
                  </label>
                  <select
                    id="userId"
                    value={addUserForm.userId}
                    onChange={(e) => setAddUserForm({ ...addUserForm, userId: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all bg-white"
                    required
                  >
                    <option value="">Select a user...</option>
                    {availableUsers.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.department})
                      </option>
                    ))}
                  </select>
                  {availableUsers.length === 0 && (
                    <p className="text-sm text-gray-500 mt-2">All users already have access to this system</p>
                  )}
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <select
                    id="role"
                    value={addUserForm.role}
                    onChange={(e) => setAddUserForm({ ...addUserForm, role: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all bg-white"
                    required
                  >
                    <option value="Admin">Admin</option>
                    <option value="User">User</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddUserModal(false)}
                    className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={availableUsers.length === 0}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add User
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AccessLayout>
  );
}
