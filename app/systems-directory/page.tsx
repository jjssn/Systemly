'use client';

import { useState, useMemo } from 'react';
import AccessLayout from '@/components/AccessLayout';
import { mockSystems, getAccessRecordsBySystem, System, isSystemOwnerOrCoOwner, isGlobalAdmin, mockUsers } from '@/lib/mock-data';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

type EditingSystem = System & { id: string };

export default function SystemsDirectoryPage() {
  const { currentUser } = useAuth();
  const [systems, setSystems] = useState<(System & { id: string })[]>(
    mockSystems.map(s => ({ ...s, id: s.id }))
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showModal, setShowModal] = useState(false);
  const [editingSystem, setEditingSystem] = useState<EditingSystem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'IT' as System['category'],
    ownerUserId: '',
  });

  const categories = ['All', ...Array.from(new Set(systems.map(s => s.category)))];
  const isUserGlobalAdmin = currentUser ? isGlobalAdmin(currentUser.id) : false;

  const filteredSystems = useMemo(() => {
    return systems.filter(system => {
      const matchesSearch =
        system.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        system.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        system.owner.name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'All' || system.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, systems]);

  const canEditSystem = (system: System) => {
    if (!currentUser) return false;
    return isUserGlobalAdmin || isSystemOwnerOrCoOwner(currentUser.id, system.id);
  };

  const handleOpenModal = (system?: EditingSystem) => {
    if (system) {
      setEditingSystem(system);
      setFormData({
        name: system.name,
        description: system.description,
        category: system.category,
        ownerUserId: system.owner.userId,
      });
    } else {
      setEditingSystem(null);
      setFormData({
        name: '',
        description: '',
        category: 'IT',
        ownerUserId: '',
      });
    }
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const owner = mockUsers.find(u => u.id === formData.ownerUserId);
    if (!owner) {
      alert('Please select a valid system owner');
      return;
    }

    if (editingSystem) {
      // Update existing system
      setSystems(systems.map(s =>
        s.id === editingSystem.id
          ? {
              ...s,
              name: formData.name,
              description: formData.description,
              category: formData.category,
              owner: {
                userId: owner.id,
                name: owner.name,
                email: owner.email,
              },
            }
          : s
      ));
    } else {
      // Create new system
      const newSystem = {
        id: String(systems.length + 1),
        name: formData.name,
        description: formData.description,
        category: formData.category,
        owner: {
          userId: owner.id,
          name: owner.name,
          email: owner.email,
        },
      };
      setSystems([...systems, newSystem]);
    }

    setShowModal(false);
    setEditingSystem(null);
    setFormData({
      name: '',
      description: '',
      category: 'IT',
      ownerUserId: '',
    });
  };

  const handleDelete = (system: EditingSystem) => {
    if (confirm(`Are you sure you want to delete "${system.name}"? This action cannot be undone.`)) {
      setSystems(systems.filter(s => s.id !== system.id));
    }
  };

  const getSystemUserCount = (systemId: string) => {
    return getAccessRecordsBySystem(systemId).length;
  };

  return (
    <AccessLayout>
      <div>
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Systems Directory</h1>
            <p className="mt-2 text-gray-600">
              Browse all systems and find system owners for support and access requests
            </p>
          </div>
          {isUserGlobalAdmin && (
            <button
              onClick={() => handleOpenModal()}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl inline-flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add System</span>
            </button>
          )}
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search Systems
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, description, or owner..."
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
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Category
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all bg-white"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <span>
              Showing <span className="font-semibold text-gray-900">{filteredSystems.length}</span> of{' '}
              <span className="font-semibold text-gray-900">{systems.length}</span> systems
            </span>
            {(searchQuery || selectedCategory !== 'All') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Systems Grid */}
        {filteredSystems.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No systems found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search or filter criteria
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-sm hover:shadow-md"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredSystems.map((system) => {
              const userCount = getSystemUserCount(system.id);
              const canEdit = canEditSystem(system);

              return (
                <div
                  key={system.id}
                  className="bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-200 p-6"
                >
                  <Link href={`/system/${system.id}`} className="group block">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors mb-1">
                          {system.name}
                        </h3>
                        <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-lg">
                          {system.category}
                        </span>
                      </div>
                      <svg
                        className="w-5 h-5 text-gray-400 flex-shrink-0 ml-4 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                      {system.description}
                    </p>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500">System Owner</p>
                          <p className="font-semibold text-gray-900 truncate">{system.owner.name}</p>
                        </div>
                        <a
                          href={`mailto:${system.owner.email}`}
                          onClick={(e) => e.stopPropagation()}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors"
                        >
                          Contact
                        </a>
                      </div>

                      <div className="flex items-center gap-2 text-sm pt-2 border-t border-gray-200">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        <span className="text-gray-600">
                          <span className="font-semibold text-gray-900">{userCount}</span> users with access
                        </span>
                      </div>
                    </div>
                  </Link>

                  {canEdit && (
                    <div className="flex gap-2 pt-4 mt-4 border-t border-gray-200">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleOpenModal(system);
                        }}
                        className="flex-1 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold rounded-lg transition-colors text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleDelete(system);
                        }}
                        className="flex-1 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-semibold rounded-lg transition-colors text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Add/Edit System Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingSystem ? 'Edit System' : 'Add New System'}
                  </h2>
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
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    System Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Salesforce, Jira, Workday"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    placeholder="Describe what this system does..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as System['category'] })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all bg-white"
                    required
                  >
                    <option value="HR">HR</option>
                    <option value="Finance">Finance</option>
                    <option value="IT">IT</option>
                    <option value="Operations">Operations</option>
                    <option value="Sales">Sales</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">System Owner</h3>

                  <div>
                    <label htmlFor="ownerUserId" className="block text-sm font-medium text-gray-700 mb-2">
                      Select Owner
                    </label>
                    <select
                      id="ownerUserId"
                      value={formData.ownerUserId}
                      onChange={(e) => setFormData({ ...formData, ownerUserId: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all bg-white"
                      required
                    >
                      <option value="">Select a user...</option>
                      {mockUsers.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name} ({user.email}) - {user.department}
                        </option>
                      ))}
                    </select>
                  </div>
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
                    {editingSystem ? 'Update System' : 'Create System'}
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
