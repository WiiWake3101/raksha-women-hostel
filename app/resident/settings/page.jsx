'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ResidentSettings() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('account');
  const [settings, setSettings] = useState({
    // Account Settings
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    rentReminders: true,
    maintenanceAlerts: true,
    eventUpdates: true,
    
    // Privacy Settings
    profileVisibility: 'residents-only',
    showRoomNumber: true,
    showPhoneNumber: false,
    
    // AI Settings
    aiChatEnabled: true,
    aiPersonalization: true,
    voiceCommands: false
  });

  useEffect(() => {
    const token = localStorage.getItem('residentToken');
    if (!token) {
      router.push('/resident/login');
      return;
    }
    setIsLoading(false);
  }, [router]);

  const handleToggle = (field) => {
    setSettings(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = () => {
    if (settings.newPassword !== settings.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    // TODO: API call to change password
    alert('Password changed successfully!');
    setSettings(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));
  };

  const handleSaveSettings = () => {
    // TODO: API call to save settings
    alert('Settings saved successfully!');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'account', label: 'Account', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { id: 'notifications', label: 'Notifications', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
    { id: 'privacy', label: 'Privacy', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
    { id: 'ai', label: 'AI Preferences', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account preferences and settings</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Tabs */}
          <div className="lg:w-64">
            <div className="bg-white rounded-2xl shadow-lg p-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                  </svg>
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              
              {/* Account Tab */}
              {activeTab === 'account' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-1 block">Current Password</label>
                          <input
                            type="password"
                            value={settings.currentPassword}
                            onChange={(e) => handleChange('currentPassword', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                            placeholder="Enter current password"
                          />
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-1 block">New Password</label>
                          <input
                            type="password"
                            value={settings.newPassword}
                            onChange={(e) => handleChange('newPassword', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                            placeholder="Enter new password"
                          />
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-1 block">Confirm New Password</label>
                          <input
                            type="password"
                            value={settings.confirmPassword}
                            onChange={(e) => handleChange('confirmPassword', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                            placeholder="Confirm new password"
                          />
                        </div>
                        
                        <button
                          onClick={handlePasswordChange}
                          className="px-6 py-2.5 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
                        >
                          Update Password
                        </button>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Danger Zone</h3>
                      <button className="px-6 py-2.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors">
                        Deactivate Account
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Notification Preferences</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Channels</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between py-3 border-b border-gray-100">
                          <div>
                            <p className="font-medium text-gray-900">Email Notifications</p>
                            <p className="text-sm text-gray-500">Receive updates via email</p>
                          </div>
                          <button
                            onClick={() => handleToggle('emailNotifications')}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              settings.emailNotifications ? 'bg-pink-600' : 'bg-gray-200'
                            }`}
                          >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                            }`} />
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between py-3 border-b border-gray-100">
                          <div>
                            <p className="font-medium text-gray-900">SMS Notifications</p>
                            <p className="text-sm text-gray-500">Receive updates via SMS</p>
                          </div>
                          <button
                            onClick={() => handleToggle('smsNotifications')}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              settings.smsNotifications ? 'bg-pink-600' : 'bg-gray-200'
                            }`}
                          >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settings.smsNotifications ? 'translate-x-6' : 'translate-x-1'
                            }`} />
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between py-3 border-b border-gray-100">
                          <div>
                            <p className="font-medium text-gray-900">Push Notifications</p>
                            <p className="text-sm text-gray-500">Receive browser notifications</p>
                          </div>
                          <button
                            onClick={() => handleToggle('pushNotifications')}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              settings.pushNotifications ? 'bg-pink-600' : 'bg-gray-200'
                            }`}
                          >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settings.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                            }`} />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Types</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between py-3">
                          <div>
                            <p className="font-medium text-gray-900">Rent Reminders</p>
                            <p className="text-sm text-gray-500">Monthly payment reminders</p>
                          </div>
                          <button
                            onClick={() => handleToggle('rentReminders')}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              settings.rentReminders ? 'bg-pink-600' : 'bg-gray-200'
                            }`}
                          >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settings.rentReminders ? 'translate-x-6' : 'translate-x-1'
                            }`} />
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between py-3">
                          <div>
                            <p className="font-medium text-gray-900">Maintenance Alerts</p>
                            <p className="text-sm text-gray-500">Updates about maintenance work</p>
                          </div>
                          <button
                            onClick={() => handleToggle('maintenanceAlerts')}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              settings.maintenanceAlerts ? 'bg-pink-600' : 'bg-gray-200'
                            }`}
                          >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settings.maintenanceAlerts ? 'translate-x-6' : 'translate-x-1'
                            }`} />
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between py-3">
                          <div>
                            <p className="font-medium text-gray-900">Event Updates</p>
                            <p className="text-sm text-gray-500">Hostel events and activities</p>
                          </div>
                          <button
                            onClick={() => handleToggle('eventUpdates')}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              settings.eventUpdates ? 'bg-pink-600' : 'bg-gray-200'
                            }`}
                          >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settings.eventUpdates ? 'translate-x-6' : 'translate-x-1'
                            }`} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Privacy Tab */}
              {activeTab === 'privacy' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Privacy Settings</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Profile Visibility</label>
                      <select
                        value={settings.profileVisibility}
                        onChange={(e) => handleChange('profileVisibility', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      >
                        <option value="residents-only">Residents Only</option>
                        <option value="staff-and-residents">Staff & Residents</option>
                        <option value="private">Private</option>
                      </select>
                    </div>

                    <div className="space-y-4 pt-4">
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <div>
                          <p className="font-medium text-gray-900">Show Room Number</p>
                          <p className="text-sm text-gray-500">Display room number on profile</p>
                        </div>
                        <button
                          onClick={() => handleToggle('showRoomNumber')}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.showRoomNumber ? 'bg-pink-600' : 'bg-gray-200'
                          }`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.showRoomNumber ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between py-3">
                        <div>
                          <p className="font-medium text-gray-900">Show Phone Number</p>
                          <p className="text-sm text-gray-500">Display phone number on profile</p>
                        </div>
                        <button
                          onClick={() => handleToggle('showPhoneNumber')}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.showPhoneNumber ? 'bg-pink-600' : 'bg-gray-200'
                          }`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.showPhoneNumber ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* AI Preferences Tab */}
              {activeTab === 'ai' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">AI Preferences</h2>
                  
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-lg p-4 mb-6">
                      <p className="text-sm text-gray-700">
                        <strong>AI Virtual Warden</strong> uses machine learning to provide personalized assistance and improve your hostel experience.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <div>
                          <p className="font-medium text-gray-900">Enable AI Chat</p>
                          <p className="text-sm text-gray-500">Use AI Virtual Warden assistant</p>
                        </div>
                        <button
                          onClick={() => handleToggle('aiChatEnabled')}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.aiChatEnabled ? 'bg-pink-600' : 'bg-gray-200'
                          }`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.aiChatEnabled ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <div>
                          <p className="font-medium text-gray-900">AI Personalization</p>
                          <p className="text-sm text-gray-500">Let AI learn your preferences</p>
                        </div>
                        <button
                          onClick={() => handleToggle('aiPersonalization')}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.aiPersonalization ? 'bg-pink-600' : 'bg-gray-200'
                          }`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.aiPersonalization ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between py-3">
                        <div>
                          <p className="font-medium text-gray-900">Voice Commands</p>
                          <p className="text-sm text-gray-500">Control features with voice</p>
                        </div>
                        <button
                          onClick={() => handleToggle('voiceCommands')}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.voiceCommands ? 'bg-pink-600' : 'bg-gray-200'
                          }`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.voiceCommands ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handleSaveSettings}
                  className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity shadow-md"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
