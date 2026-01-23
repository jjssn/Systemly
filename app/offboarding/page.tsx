'use client';

import { useState } from 'react';
import AccessLayout from '@/components/AccessLayout';
import { useAuth } from '@/context/AuthContext';
import {
  mockOffboardingRequests,
  mockUsers,
  mockSystems,
  getUserById,
  getSystemById,
  OffboardingRequest,
} from '@/lib/mock-data';

export default function OffboardingPage() {
  const { currentUser, isAdmin } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    userId: '',
    allSystems: true,
    selectedSystemIds: [] as string[],
    removalDate: '',
    notes: '',
  });
  const [requests, setRequests] = useState<OffboardingRequest[]>(mockOffboardingRequests);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate that at least one system is selected if not all systems
    if (!formData.allSystems && formData.selectedSystemIds.length === 0) {
      alert('Please select at least one system or choose "All Systems"');
      return;
    }

    // Create new offboarding request
    const newRequest: OffboardingRequest = {
      id: String(requests.length + 1),
      userId: formData.userId,
      systemIds: formData.allSystems ? [] : formData.selectedSystemIds,
      allSystems: formData.allSystems,
      requestedBy: currentUser?.name || '',
      removalDate: formData.removalDate,
      status: 'pending',
      notes: formData.notes,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setRequests([...requests, newRequest]);
    setShowModal(false);
    setFormData({ userId: '', allSystems: true, selectedSystemIds: [], removalDate: '', notes: '' });
  };

  const handleSystemToggle = (systemId: string) => {
    if (formData.selectedSystemIds.includes(systemId)) {
      setFormData({
        ...formData,
        selectedSystemIds: formData.selectedSystemIds.filter(id => id !== systemId)
      });
    } else {
      setFormData({
        ...formData,
        selectedSystemIds: [...formData.selectedSystemIds, systemId]
      });
    }
  };

  const handleCompleteRequest = (requestId: string) => {
    setRequests(requests.map(req =>
      req.id === requestId ? { ...req, status: 'completed' as const } : req
    ));
  };

  const filteredRequests = requests.filter(req => {
    if (filter === 'all') return true;
    return req.status === filter;
  });

  return (
    <AccessLayout>
      <div>
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Offboarding Requests</h1>
            <p className="mt-2 text-gray-600">
              Request access removal with a target date and track offboarding status
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl inline-flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>New Request</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-sm font-medium">Pending</p>
                <p className="text-3xl font-bold mt-2">
                  {requests.filter(r => r.status === 'pending').length}
                </p>
              </div>
              <div className="bg-white/20 rounded-lg p-3">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm font-medium">Completed</p>
                <p className="text-3xl font-bold mt-2">
                  {requests.filter(r => r.status === 'completed').length}
                </p>
              </div>
              <div className="bg-white/20 rounded-lg p-3">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-100 text-sm font-medium">Total Requests</p>
                <p className="text-3xl font-bold mt-2">{requests.length}</p>
              </div>
              <div className="bg-white/20 rounded-lg p-3">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors ${
                filter === 'all'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All Requests ({requests.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors ${
                filter === 'pending'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Pending ({requests.filter(r => r.status === 'pending').length})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors ${
                filter === 'completed'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Completed ({requests.filter(r => r.status === 'completed').length})
            </button>
          </div>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {filteredRequests.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No requests found</h3>
              <p className="text-gray-600 mb-6">
                {filter === 'all'
                  ? 'No offboarding requests have been created yet'
                  : `No ${filter} requests at this time`}
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-sm hover:shadow-md"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create First Request
              </button>
            </div>
          ) : (
            filteredRequests.map((request) => {
              const user = getUserById(request.userId);
              const systems = request.allSystems
                ? mockSystems
                : request.systemIds.map(id => getSystemById(id)).filter(Boolean) as typeof mockSystems;

              return (
                <div
                  key={request.id}
                  className={`bg-white border rounded-xl p-6 ${
                    request.status === 'pending'
                      ? 'border-amber-200 bg-amber-50/30'
                      : 'border-emerald-200 bg-emerald-50/30'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-lg ${
                            request.status === 'pending'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                        <span className="text-xs text-gray-500">
                          Created: {new Date(request.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">User</p>
                          <p className="font-semibold text-gray-900">{user?.name}</p>
                          <p className="text-sm text-gray-600">{user?.email}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Systems</p>
                          {request.allSystems ? (
                            <div>
                              <p className="font-semibold text-gray-900">All Systems</p>
                              <p className="text-sm text-gray-600">{mockSystems.length} systems total</p>
                            </div>
                          ) : (
                            <div className="space-y-1">
                              {systems.slice(0, 2).map((system) => (
                                <p key={system.id} className="font-semibold text-gray-900">{system.name}</p>
                              ))}
                              {systems.length > 2 && (
                                <p className="text-sm text-gray-600">+{systems.length - 2} more</p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Requested By</p>
                          <p className="text-sm font-medium text-gray-900">{request.requestedBy}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Target Removal Date</p>
                          <p className="text-sm font-medium text-gray-900">
                            {new Date(request.removalDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {request.notes && (
                        <div className="bg-white/70 rounded-lg p-3 border border-gray-200">
                          <p className="text-xs text-gray-500 mb-1">Notes</p>
                          <p className="text-sm text-gray-700">{request.notes}</p>
                        </div>
                      )}
                    </div>

                    {isAdmin && request.status === 'pending' && (
                      <button
                        onClick={() => handleCompleteRequest(request.id)}
                        className="ml-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Mark Complete
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Create Request Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">New Offboarding Request</h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-2">
                    Select User
                  </label>
                  <select
                    id="userId"
                    value={formData.userId}
                    onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all bg-white"
                    required
                  >
                    <option value="">Select a user...</option>
                    {mockUsers.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Systems to Remove Access
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="radio"
                        checked={formData.allSystems}
                        onChange={() => setFormData({ ...formData, allSystems: true, selectedSystemIds: [] })}
                        className="mt-1 w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                      />
                      <div>
                        <p className="font-medium text-gray-900">All Systems</p>
                        <p className="text-sm text-gray-600">Remove user access from all {mockSystems.length} systems (recommended for offboarding)</p>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="radio"
                        checked={!formData.allSystems}
                        onChange={() => setFormData({ ...formData, allSystems: false })}
                        className="mt-1 w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                      />
                      <div>
                        <p className="font-medium text-gray-900">Specific Systems</p>
                        <p className="text-sm text-gray-600">Select individual systems to remove access from</p>
                      </div>
                    </label>

                    {!formData.allSystems && (
                      <div className="ml-7 mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200 max-h-60 overflow-y-auto">
                        <p className="text-sm font-medium text-gray-700 mb-3">Select Systems</p>
                        <div className="space-y-2">
                          {mockSystems.map((system) => (
                            <label key={system.id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded">
                              <input
                                type="checkbox"
                                checked={formData.selectedSystemIds.includes(system.id)}
                                onChange={() => handleSystemToggle(system.id)}
                                className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 rounded"
                              />
                              <span className="text-sm text-gray-900">{system.name}</span>
                              <span className="text-xs text-gray-500">({system.category})</span>
                            </label>
                          ))}
                        </div>
                        {formData.selectedSystemIds.length === 0 && (
                          <p className="text-sm text-red-600 mt-2">Please select at least one system</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="removalDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Target Removal Date
                  </label>
                  <input
                    type="date"
                    id="removalDate"
                    value={formData.removalDate}
                    onChange={(e) => setFormData({ ...formData, removalDate: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={4}
                    placeholder="Add any additional notes or reasons for this request..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all shadow-lg"
                  >
                    Create Request
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
