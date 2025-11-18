'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type System = {
  id: string;
  name: string;
  description: string;
  approved: boolean;
  ownerId: string;
};

export default function EditSystemPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const systemId = params.id as string;

  const [users, setUsers] = useState<User[]>([]);
  const [system, setSystem] = useState<System | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [ownerId, setOwnerId] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const isAdmin = session?.user?.role === 'ADMIN';

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
        setName(data.name);
        setDescription(data.description);
        setOwnerId(data.ownerId);
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error fetching system:', error);
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      setUsers(data.filter((u: User) => u.role === 'ADMIN'));
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const response = await fetch(`/api/systems/${systemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          ownerId,
        }),
      });

      if (response.ok) {
        router.push(`/systems/${systemId}`);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to update system');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setSaving(false);
    }
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

  const canEdit = isAdmin || system.ownerId === session?.user?.id;

  if (!canEdit) {
    router.push(`/systems/${systemId}`);
    return null;
  }

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8">
        <Link
          href={`/systems/${systemId}`}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-4 inline-block"
        >
          ← Back to System
        </Link>

        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit System</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                System Name *
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Description *
              </label>
              <textarea
                id="description"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            {isAdmin && (
              <div>
                <label htmlFor="owner" className="block text-sm font-medium text-gray-700 mb-2">
                  System Owner *
                </label>
                <select
                  id="owner"
                  value={ownerId}
                  onChange={(e) => setOwnerId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <Link
                href={`/systems/${systemId}`}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2.5 px-4 rounded-lg transition text-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
    </div>
  );
}
