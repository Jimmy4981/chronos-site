import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { fetchUsers, addUser, updateUserRoles } from '../utils/api';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState('');

  // Load users once on mount
  useEffect(() => {
    fetchUsers().then(setUsers).catch(console.error);
  }, []);

  // Invite a new user (backend must resolve AAD details)
  const onAdd = async () => {
    if (!email) return alert('Please enter an email');
    try {
      const updated = await addUser({ email, roles: ['member'] });
      setUsers(updated);
      setEmail('');
    } catch (err) {
      console.error('Invite failed', err);
      alert('Could not invite user; check console.');
    }
  };

  // Toggle one role on/off
  const toggleRole = async (aadId, role) => {
    const user = users.find(u => u.aadId === aadId);
    if (!user) return;
    const newRoles = user.roles.includes(role)
      ? user.roles.filter(r => r !== role)
      : [...user.roles, role];

    try {
      const updated = await updateUserRoles(aadId, newRoles);
      setUsers(updated);
    } catch (err) {
      console.error('Failed to update roles', err);
      alert('Could not update roles; see console.');
    }
  };

  return (
    <Layout>
      <h2 className="text-3xl font-bold text-indigo-900 mb-6">User Management</h2>
      <div className="mb-4 flex gap-2">
        <input
          type="email"
          placeholder="User email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="flex-1 border rounded px-3 py-2"
        />
        <button
          onClick={onAdd}
          className="bg-amber-400 text-indigo-900 font-semibold px-4 py-2 rounded"
        >
          Invite
        </button>
      </div>

      <table className="min-w-full bg-white shadow rounded">
        <thead>
          <tr className="text-left">
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Roles</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.aadId} className="border-t">
              <td className="p-2">{u.displayName || '—'}</td>
              <td className="p-2">{u.email}</td>
              <td className="p-2 space-x-4">
                {['member', 'manager'].map(r => (
                  <label key={r} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={u.roles.includes(r)}
                      onChange={() => toggleRole(u.aadId, r)}
                      className="mr-1"
                    />
                    {r}
                  </label>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
}
