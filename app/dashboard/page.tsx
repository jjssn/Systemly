'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';

type System = {
  id: string;
  name: string;
  description: string;
  approved: boolean;
  owner: {
    id: string;
    name: string;
    email: string;
  };
  assignedUsers: Array<{
    user: {
      id: string;
      name: string;
      email: string;
    };
  }>;
};

export default function DashboardPage() {
  const { data: session } = useSession();
  const [systems, setSystems] = useState<System[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSystems();
  }, []);

  const fetchSystems = async () => {
    try {
      const response = await fetch('/api/systems');
      const data = await response.json();
      setSystems(data);
    } catch (error) {
      console.error('Error fetching systems:', error);
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = session?.user?.role === 'ADMIN';
  const userId = session?.user?.id;

  // Filter systems where user is assigned
  const myAssignedSystems = systems.filter((system) =>
    system.assignedUsers.some((au) => au.user.id === userId)
  );

  // Filter systems where user is the owner
  const myOwnedSystems = systems.filter((system) => system.owner.id === userId);

  // For admins, show all other systems they don't own or aren't assigned to
  const otherSystems = isAdmin
    ? systems.filter(
        (system) =>
          system.owner.id !== userId &&
          !system.assignedUsers.some((au) => au.user.id === userId)
      )
    : [];

  const SystemListItem = ({ system }: { system: System }) => (
    <Link
      href={`/systems/${system.id}`}
      className="group block bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-200 p-5 hover:border-indigo-300"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
              {system.name}
            </h3>
            <span
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg flex-shrink-0 ${
                system.approved
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-amber-100 text-amber-700'
              }`}
            >
              {system.approved ? 'Approved' : 'Pending'}
            </span>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">{system.description}</p>
          <div className="flex items-center space-x-6 text-sm text-gray-500">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span className="font-medium">{system.owner.name}</span>
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <span className="font-medium">{system.assignedUsers.length}</span>
              <span className="ml-1">users</span>
            </span>
          </div>
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
    </Link>
  );

  return (
    <DashboardLayout>
      <div>
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-gray-600">
              Manage and access your systems
            </p>
          </div>
          {isAdmin && (
            <Link
              href="/systems/new"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-sm hover:shadow-md inline-flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>New System</span>
            </Link>
          )}
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-100 text-sm font-medium">Total Systems</p>
                <p className="text-3xl font-bold mt-2">{systems.length}</p>
              </div>
              <div className="bg-white/20 rounded-lg p-3">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm font-medium">Systems I Own</p>
                <p className="text-3xl font-bold mt-2">{myOwnedSystems.length}</p>
              </div>
              <div className="bg-white/20 rounded-lg p-3">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-violet-100 text-sm font-medium">Assigned to Me</p>
                <p className="text-3xl font-bold mt-2">{myAssignedSystems.length}</p>
              </div>
              <div className="bg-white/20 rounded-lg p-3">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-14 w-14 border-4 border-gray-200 border-t-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-500 font-medium">Loading systems...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Systems I Own */}
            {myOwnedSystems.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-xl font-bold text-gray-900">Systems I Own</h2>
                  <span className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-3.5 py-1.5 rounded-lg">
                    {myOwnedSystems.length} {myOwnedSystems.length === 1 ? 'system' : 'systems'}
                  </span>
                </div>
                <div className="space-y-4">
                  {myOwnedSystems.map((system) => (
                    <SystemListItem key={system.id} system={system} />
                  ))}
                </div>
              </div>
            )}

            {/* My Assigned Systems */}
            {myAssignedSystems.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-xl font-bold text-gray-900">My Systems</h2>
                  <span className="text-sm font-semibold text-violet-600 bg-violet-50 px-3.5 py-1.5 rounded-lg">
                    {myAssignedSystems.length} {myAssignedSystems.length === 1 ? 'system' : 'systems'}
                  </span>
                </div>
                <div className="space-y-4">
                  {myAssignedSystems.map((system) => (
                    <SystemListItem key={system.id} system={system} />
                  ))}
                </div>
              </div>
            )}

            {/* Other Systems (Admin Only) */}
            {isAdmin && otherSystems.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-xl font-bold text-gray-900">All Other Systems</h2>
                  <span className="text-sm font-semibold text-gray-600 bg-gray-100 px-3.5 py-1.5 rounded-lg">
                    {otherSystems.length} {otherSystems.length === 1 ? 'system' : 'systems'}
                  </span>
                </div>
                <div className="space-y-4">
                  {otherSystems.map((system) => (
                    <SystemListItem key={system.id} system={system} />
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {myOwnedSystems.length === 0 && myAssignedSystems.length === 0 && otherSystems.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <div className="bg-indigo-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-10 h-10 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No systems yet</h3>
                <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                  {isAdmin
                    ? "Get started by creating your first system and start organizing your resources"
                    : "You haven't been assigned to any systems yet"}
                </p>
                {isAdmin && (
                  <Link
                    href="/systems/new"
                    className="inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-sm hover:shadow-md"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Your First System
                  </Link>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
