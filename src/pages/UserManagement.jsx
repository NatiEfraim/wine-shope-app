import React, { useState, useEffect } from 'react';
import { Users, Shield, Mail, CreditCard } from 'lucide-react';
import Card from '../components/Card';
import { axiosInstance } from '../api/axios';
import { useAuthStore } from '../store/useAuthStore';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  
  // get current user from auth store to prevent self-role changes
  const currentUser = useAuthStore((state) => state.user);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersResponse, rolesResponse] = await Promise.all([
        axiosInstance.get('/users'),
        axiosInstance.get('/users/roles')
      ]);
      
      setUsers(usersResponse.data || []);
      setRoles(rolesResponse.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRoleId) => {
    if (!window.confirm('האם אתה בטוח שברצונך לשנות את הרשאת המשתמש?')) return;

    try {
      setUpdatingId(userId);
      await axiosInstance.put(`/users/${userId}`, {
        role_id: parseInt(newRoleId)
      });
      // Refresh the user list to reflect changes
      await fetchData();
    } catch (error) {
      console.error('Error updating role:', error);
      alert('שגיאה בעדכון הרשאות המשתמש');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-800 mx-auto"></div>
        <p className="mt-4 text-slate-500">טוען משתמשים...</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <header className="mb-10">
        <h2 className="text-3xl font-black text-slate-800 mb-2 flex items-center gap-3">
          <Shield className="text-red-800" size={32} /> ניהול הרשאות ומשתמשים
        </h2>
        <p className="text-slate-500 italic">צפייה בכלל המשתמשים וניהול רמות הגישה במערכת (אדמין בלבד)</p>
      </header>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="border-b text-slate-400 text-sm">
                <th className="pb-3 pr-2">מזהה</th>
                <th className="pb-3">פרטי משתמש</th>
                <th className="pb-3">תעודת זהות</th>
                <th className="pb-3">הרשאה (תפקיד)</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map(user => {
                const userRole = user.roles && user.roles.length > 0 ? user.roles[0].id : '';
                const isSelf = currentUser?.id === user.id;

                return (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 font-bold text-slate-700">{user.id}</td>
                    <td>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800 flex items-center gap-2">
                          <Users size={14} className="text-slate-400"/> {user.name}
                        </span>
                        <span className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                          <Mail size={12}/> {user.email}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="text-sm text-slate-600 flex items-center gap-1">
                        <CreditCard size={14} className="text-slate-400"/> {user.personal_id}
                      </span>
                    </td>
                    <td>
                      <select
                        className={`border border-slate-200 text-sm rounded-lg p-2 outline-none ${
                          isSelf ? 'bg-slate-100 cursor-not-allowed opacity-60' : 'bg-white focus:ring-1 focus:ring-red-800 cursor-pointer'
                        }`}
                        disabled={updatingId === user.id || isSelf}
                        value={userRole}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        title={isSelf ? "לא ניתן לשנות הרשאה לעצמך" : "שנה הרשאה"}
                      >
                        {roles.map(role => (
                          <option key={role.id} value={role.id}>
                            {role.name}
                          </option>
                        ))}
                      </select>
                      {isSelf && <span className="text-[10px] text-red-600 ml-2 block mt-1">זהו המשתמש שלך</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}