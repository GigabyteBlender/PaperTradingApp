'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Hash } from 'lucide-react';
import { getUser, saveUser } from '@/utils/localStorage';
import { mockUser } from '@/data/mockData';
import { useBalance } from '@/contexts/BalanceContext';
import type { User as UserType } from '@/types';

export default function SettingsPage() {
  const [user, setUser] = useState<UserType>(mockUser);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserType>(mockUser);
  const { refreshBalance } = useBalance();

  useEffect(() => {
    const currentUser = getUser();
    if (currentUser) {
      setUser(currentUser);
      setFormData(currentUser);
    }
  }, []);


  const handleSave = () => {
    saveUser(formData);
    setUser(formData);
    setIsEditing(false);
    refreshBalance();
  };

  const handleCancel = () => {
    setFormData(user);
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof UserType, value: string | number | Date) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          User Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your user profile information
        </p>
      </div>

      <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile Information
          </h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
            >
              Edit
            </button>
          )}
        </div>

        <div className="space-y-6">
          {/* User ID */}
          <div className="flex items-center gap-3">
            <Hash className="w-5 h-5 text-gray-500" />
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                User ID
              </label>
              <div className="text-gray-900 dark:text-white font-mono text-sm bg-gray-100 dark:bg-neutral-700 px-3 py-2 rounded">
                {user.userId}
              </div>
            </div>
          </div>

          {/* Username */}
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-gray-500" />
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Username
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:text-white"
                />
              ) : (
                <div className="text-gray-900 dark:text-white">{user.username}</div>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-gray-500" />
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:text-white"
                />
              ) : (
                <div className="text-gray-900 dark:text-white">{user.email}</div>
              )}
            </div>
          </div>

          {/* Balance */}
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 text-gray-500 flex items-center justify-center">$</div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Balance
              </label>
              {isEditing ? (
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.balance}
                  onChange={(e) => handleInputChange('balance', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:text-white"
                />
              ) : (
                <div className="text-gray-900 dark:text-white">${user.balance.toLocaleString()}</div>
              )}
            </div>
          </div>



          {/* Action Buttons */}
          {isEditing && (
            <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-neutral-700">
              <button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
              >
                Save Changes
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}