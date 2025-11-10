'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Hash, Edit2, Check, X, DollarSign } from 'lucide-react';
import { getUser, saveUser } from '@/utils/localStorage';
import { mockUser } from '@/data/mockData';
import { useBalance } from '@/contexts/BalanceContext';
import type { User as UserType } from '@/types';

type EditingField = 'username' | 'email' | 'balance' | null;

export default function SettingsPage() {
  const [user, setUser] = useState<UserType>(mockUser);
  const [editingField, setEditingField] = useState<EditingField>(null);
  const [tempValue, setTempValue] = useState<string>('');
  const { refreshBalance } = useBalance();

  // Load user data from localStorage on mount
  useEffect(() => {
    const currentUser = getUser();
    if (currentUser) {
      setUser(currentUser);
    } else {
      saveUser(mockUser);
    }
  }, []);

  // Start editing a field and populate temp value
  const handleEdit = (field: EditingField) => {
    setEditingField(field);
    if (field === 'username') setTempValue(user.username);
    else if (field === 'email') setTempValue(user.email);
    else if (field === 'balance') setTempValue(user.balance.toString());
  };

  // Save edited field to localStorage and update context
  const handleSave = (field: EditingField) => {
    let updatedUser = { ...user };

    if (field === 'username') {
      updatedUser.username = tempValue;
    } else if (field === 'email') {
      updatedUser.email = tempValue;
    } else if (field === 'balance') {
      const numValue = parseFloat(tempValue);
      if (!isNaN(numValue) && numValue >= 0) {
        updatedUser.balance = numValue;
      } else {
        return;
      }
    }

    saveUser(updatedUser);
    setUser(updatedUser);
    setEditingField(null);
    setTempValue('');
    refreshBalance();
  };

  // Cancel editing and clear temp value
  const handleCancel = () => {
    setEditingField(null);
    setTempValue('');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Manage your profile and account preferences
          </p>
        </div>

        {/* Profile Section */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 mb-6">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-neutral-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Profile Information
            </h2>
          </div>

          <div className="p-6 space-y-6">
            {/* User ID - Read Only */}
            <div className="group">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Hash className="w-4 h-4 text-gray-500" />
                  User ID
                </label>
                <span className="text-xs text-gray-500 dark:text-gray-400">Read only</span>
              </div>
              <div className="bg-gray-50 dark:bg-neutral-700 px-4 py-3 rounded-lg border border-gray-200 dark:border-neutral-600">
                <span className="font-mono text-sm text-gray-700 dark:text-gray-300">
                  {user.userId}
                </span>
              </div>
            </div>

            {/* Username */}
            <div className="group">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  Username
                </label>
                {editingField !== 'username' && (
                  <button
                    onClick={() => handleEdit('username')}
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium flex items-center gap-1 transition-colors"
                  >
                    <Edit2 className="w-3 h-3" />
                    Edit
                  </button>
                )}
              </div>
              {editingField === 'username' ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-neutral-700 dark:text-white"
                    autoFocus
                  />
                  <button
                    onClick={() => handleSave('username')}
                    className="px-3 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-3 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="bg-gray-50 dark:bg-neutral-700 px-4 py-3 rounded-lg border border-gray-200 dark:border-neutral-600 group-hover:border-gray-300 dark:group-hover:border-neutral-500 transition-colors">
                  <span className="text-gray-900 dark:text-white">
                    {user.username}
                  </span>
                </div>
              )}
            </div>

            {/* Email */}
            <div className="group">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  Email Address
                </label>
                {editingField !== 'email' && (
                  <button
                    onClick={() => handleEdit('email')}
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium flex items-center gap-1 transition-colors"
                  >
                    <Edit2 className="w-3 h-3" />
                    Edit
                  </button>
                )}
              </div>
              {editingField === 'email' ? (
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-neutral-700 dark:text-white"
                    autoFocus
                  />
                  <button
                    onClick={() => handleSave('email')}
                    className="px-3 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-3 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="bg-gray-50 dark:bg-neutral-700 px-4 py-3 rounded-lg border border-gray-200 dark:border-neutral-600 group-hover:border-gray-300 dark:group-hover:border-neutral-500 transition-colors">
                  <span className="text-gray-900 dark:text-white">
                    {user.email}
                  </span>
                </div>
              )}
            </div>

            {/* Balance */}
            <div className="group">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-gray-500" />
                  Account Balance
                </label>
                {editingField !== 'balance' && (
                  <button
                    onClick={() => handleEdit('balance')}
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium flex items-center gap-1 transition-colors"
                  >
                    <Edit2 className="w-3 h-3" />
                    Edit
                  </button>
                )}
              </div>
              {editingField === 'balance' ? (
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-neutral-700 dark:text-white"
                    autoFocus
                  />
                  <button
                    onClick={() => handleSave('balance')}
                    className="px-3 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-3 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="bg-gray-50 dark:bg-neutral-700 px-4 py-3 rounded-lg border border-gray-200 dark:border-neutral-600 group-hover:border-gray-300 dark:group-hover:border-neutral-500 transition-colors">
                  <span className="text-gray-900 dark:text-white font-semibold text-lg">
                    ${user.balance.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}