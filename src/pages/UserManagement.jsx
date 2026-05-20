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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-boutique-burgundy mx-auto"></div>
        <p className="mt-4 text-boutique-muted">טוען רשימת משתמשים...</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500" dir="rtl">
      <header className="mb-12 border-b border-boutique-linen pb-6">
        <p className="mb-2 font-sans text-[10px] font-medium uppercase tracking-luxury text-boutique-gold-muted">
          System Access Control
        </p>
        <h2 className="font-serif text-4xl font-bold text-boutique-ink mb-2 flex items-center gap-3">
          <Shield className="text-boutique-gold-muted" size={32} /> ניהול הרשאות ומשתמשים
        </h2>
        <p className="text-boutique-muted font-sans text-sm">צפייה בכלל המשתמשים וניהול רמות הגישה במערכת (הרשאת מנהל על בלבד)</p>
      </header>

      <Card className="shadow-boutique">
        <div className="overflow-x-auto">
          <table className="w-full text-right font-sans">
            <thead className="bg-boutique-parchment/50">
              <tr className="border-b border-boutique-linen text-boutique-muted text-sm">
                <th className="py-4 pr-6 font-medium">מזהה</th>
                <th className="py-4 font-medium">פרטי משתמש</th>
                <th className="py-4 font-medium">תעודת זהות</th>
                <th className="py-4 font-medium pl-6">הרשאה (תפקיד)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-boutique-linen bg-white">
              {users.map(user => {
                const userRole = user.roles && user.roles.length > 0 ? user.roles[0].id : '';
                const isSelf = currentUser?.id === user.id;

                return (
                  <tr key={user.id} className="hover:bg-boutique-parchment/30 transition-colors">
                    <td className="py-4 pr-6 font-semibold text-boutique-ink">{user.id}</td>
                    <td className="py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-boutique-ink flex items-center gap-2">
                          <Users size={14} className="text-boutique-gold-muted"/> {user.name}
                        </span>
                        <span className="text-xs text-boutique-muted flex items-center gap-1 mt-1">
                          <Mail size={12}/> {user.email}
                        </span>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="text-sm text-boutique-ink flex items-center gap-1.5">
                        <CreditCard size={14} className="text-boutique-gold-muted"/> {user.personal_id}
                      </span>
                    </td>
                    <td className="py-4 pl-6">
                      <select
                        className={`border border-boutique-linen text-sm rounded-sm p-2 outline-none w-full max-w-[200px] ${
                          isSelf ? 'bg-boutique-parchment cursor-not-allowed opacity-60 text-boutique-muted' : 'bg-white focus:border-boutique-gold focus:ring-1 focus:ring-boutique-gold cursor-pointer text-boutique-ink'
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
                      {isSelf && <span className="text-[10px] text-boutique-burgundy font-medium ml-2 block mt-1">זהו המשתמש שלך</span>}
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