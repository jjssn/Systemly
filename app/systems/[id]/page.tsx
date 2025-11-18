'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';

type User = {
  id: string;
  name: string;
  email: string;
};

type System = {
  id: string;
  name: string;
  description: string;
  approved: boolean;
  owner: User & { role: string };
  assignedUsers: Array<{
    id: string;
    user: User;
    tags: string | null;
  }>;
};

export default function SystemDetailPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const systemId = params.id as string;

  const [system, setSystem] = useState<System | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddUser, setShowAddUser] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [editingTagsFor, setEditingTagsFor] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState('');

  const isAdmin = session?.user?.role === 'ADMIN';
  const isOwner = system?.owner.id === session?.user?.id;
  const canEdit = isAdmin || isOwner;

  useEffect(() => {
    fetchSystem();
    fetchUsers();
  }, [systemId]);

  const fetchSystem = async () => {
    try {
      const response = await fetch(`/api/systems/${systemId}`);
      if (response.ok) {
        const data = await response.json();
        setSystem(data);
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error fetching system:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      setAllUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleApprovalToggle = async () => {
    if (!system) return;

    try {
      const response = await fetch(`/api/systems/${systemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved: !system.approved }),
      });

      if (response.ok) {
        const updated = await response.json();
        setSystem(updated);
      }
    } catch (error) {
      console.error('Error updating approval status:', error);
    }
  };

  const handleAddUser = async () => {
    if (!selectedUserId) return;

    try {
      const response = await fetch(`/api/systems/${systemId}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: selectedUserId }),
      });

      if (response.ok) {
        fetchSystem();
        setShowAddUser(false);
        setSelectedUserId('');
      }
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const handleRemoveUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/systems/${systemId}/users?userId=${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchSystem();
      }
    } catch (error) {
      console.error('Error removing user:', error);
    }
  };

  const handleDeleteSystem = async () => {
    if (!confirm('Are you sure you want to delete this system?')) return;

    try {
      const response = await fetch(`/api/systems/${systemId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error deleting system:', error);
    }
  };

  const handleUpdateTags = async (userId: string) => {
    try {
      const response = await fetch(`/api/systems/${systemId}/users/${userId}/tags`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tags: tagInput || null }),
      });

      if (response.ok) {
        fetchSystem();
        setEditingTagsFor(null);
        setTagInput('');
      }
    } catch (error) {
      console.error('Error updating tags:', error);
    }
  };

  const startEditingTags = (userId: string, currentTags: string | null) => {
    setEditingTagsFor(userId);
    setTagInput(currentTags || '');
  };

  if (loading) {
    return (
      <div className="px-4 py-6 md:px-6 lg:px-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!system) {
    return null;
  }

  const availableUsers = allUsers.filter(
    (user) => !system.assignedUsers.some((au) => au.user.id === user.id)
  );

  return (
    <DashboardLayout>
      <div>
        <Link
          href="/dashboard"
          className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-4 inline-block"
        >
          ← Back to Dashboard
        </Link>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{system.name}</h1>
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full ${
                    system.approved
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {system.approved ? 'Approved' : 'Pending Approval'}
                </span>
              </div>
              <p className="text-gray-600">{system.description}</p>
            </div>
            {canEdit && (
              <div className="flex space-x-2 ml-4">
                <Link
                  href={`/systems/${systemId}/edit`}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                >
                  Edit
                </Link>
                {isAdmin && (
                  <button
                    onClick={handleDeleteSystem}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                  >
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="border-t pt-6 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">System Owner</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                    {system.owner.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{system.owner.name}</p>
                    <p className="text-sm text-gray-500">{system.owner.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {isAdmin && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Approval Status</h2>
                <button
                  onClick={handleApprovalToggle}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    system.approved
                      ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {system.approved ? 'Revoke Approval' : 'Approve System'}
                </button>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-gray-900">
                  Assigned Users ({system.assignedUsers.length})
                </h2>
                {canEdit && (
                  <button
                    onClick={() => setShowAddUser(!showAddUser)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm font-medium transition"
                  >
                    + Add User
                  </button>
                )}
              </div>

              {showAddUser && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="flex space-x-2">
                    <select
                      value={selectedUserId}
                      onChange={(e) => setSelectedUserId(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    >
                      <option value="">Select a user...</option>
                      {availableUsers.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name} ({user.email})
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handleAddUser}
                      disabled={!selectedUserId}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => {
                        setShowAddUser(false);
                        setSelectedUserId('');
                      }}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg font-medium transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {system.assignedUsers.length === 0 ? (
                <p className="text-gray-500 text-sm">No users assigned yet</p>
              ) : (
                <div className="space-y-3">
                  {system.assignedUsers.map((assignment) => (
                    <div
                      key={assignment.id}
                      className="bg-gray-50 rounded-xl p-4 border border-gray-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold shadow-sm flex-shrink-0">
                            {assignment.user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 text-sm">
                              {assignment.user.name}
                            </p>
                            <p className="text-xs text-gray-500 mb-2">{assignment.user.email}</p>

                            {/* Custom Fields Section */}
                            {editingTagsFor === assignment.user.id ? (
                              <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                <label className="block text-xs font-medium text-gray-700 mb-2">
                                  Custom Fields (key:value format)
                                </label>
                                <textarea
                                  value={tagInput}
                                  onChange={(e) => setTagInput(e.target.value)}
                                  placeholder="role:admin&#10;server:se-prod&#10;environment:production&#10;access:read-write"
                                  rows={4}
                                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none mb-2 font-mono"
                                />
                                <p className="text-xs text-gray-500 mb-3">
                                  Enter one field per line in format: <code className="bg-gray-200 px-1 rounded">key:value</code>
                                </p>
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleUpdateTags(assignment.user.id)}
                                    className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition shadow-sm"
                                  >
                                    Save Fields
                                  </button>
                                  <button
                                    onClick={() => {
                                      setEditingTagsFor(null);
                                      setTagInput('');
                                    }}
                                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-medium transition"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="mt-3">
                                {assignment.tags ? (
                                  <div className="space-y-2">
                                    <div className="flex flex-wrap gap-2 items-start">
                                      {assignment.tags.split('\n').filter(line => line.trim()).map((field, idx) => {
                                        const [key, ...valueParts] = field.split(':');
                                        const value = valueParts.join(':');
                                        return (
                                          <span
                                            key={idx}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 text-gray-700"
                                          >
                                            <span className="font-semibold text-indigo-600">{key?.trim()}</span>
                                            {value && (
                                              <>
                                                <span className="text-gray-400">:</span>
                                                <span className="text-gray-700">{value.trim()}</span>
                                              </>
                                            )}
                                          </span>
                                        );
                                      })}
                                    </div>
                                    {canEdit && (
                                      <button
                                        onClick={() => startEditingTags(assignment.user.id, assignment.tags)}
                                        className="text-indigo-600 hover:text-indigo-700 text-xs font-medium inline-flex items-center gap-1"
                                      >
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        Edit Fields
                                      </button>
                                    )}
                                  </div>
                                ) : (
                                  canEdit && (
                                    <button
                                      onClick={() => startEditingTags(assignment.user.id, null)}
                                      className="text-gray-400 hover:text-indigo-600 text-xs font-medium inline-flex items-center gap-1 hover:gap-2 transition-all"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                      </svg>
                                      Add custom fields
                                    </button>
                                  )
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        {canEdit && (
                          <button
                            onClick={() => handleRemoveUser(assignment.user.id)}
                            className="text-red-600 hover:text-red-700 text-sm font-medium ml-3"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
