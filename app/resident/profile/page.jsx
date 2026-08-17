'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ResidentProfile() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    // Personal Info
    name: 'Priya Sharma',
    email: 'priya.sharma@email.com',
    phone: '+91 98765 43210',
    dateOfBirth: '1998-05-15',
    bloodGroup: 'A+',
    
    // Emergency Contact
    emergencyContactName: 'Rajesh Sharma',
    emergencyRelation: 'Father',
    emergencyPhone: '+91 98765 43211',
    emergencyEmail: 'rajesh.sharma@email.com',
    
    // Hostel Details
    roomNumber: '204',
    blockName: 'A Block',
    joinedDate: '2026-01-15',
    
    // Lifestyle
    sleepSchedule: 'Early Riser',
    studyPreference: 'Night Owl',
    cleanliness: 'Very Organized',
    
    // About
    bio: 'Computer Science student passionate about AI and machine learning. Love reading and playing badminton.',
    interests: ['Reading', 'Badminton', 'Coding', 'Music']
  });

  useEffect(() => {
    const token = localStorage.getItem('residentToken');
    if (!token) {
      router.push('/resident/login');
      return;
    }
    setIsLoading(false);
  }, [router]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    // TODO: API call to save profile data
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50">
      <Navbar />
      
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-400 to-purple-600 flex items-center justify-center text-white font-bold text-3xl shadow-lg">
                {profileData.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{profileData.name}</h1>
                <p className="text-gray-600 mt-1">Room {profileData.roomNumber} • {profileData.blockName}</p>
                <p className="text-sm text-gray-500 mt-1">Member since {new Date(profileData.joinedDate).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</p>
              </div>
            </div>
            
            <button
              onClick={isEditing ? handleSave : handleEditToggle}
              className={`px-6 py-2.5 rounded-lg font-semibold transition-colors ${
                isEditing 
                  ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:opacity-90' 
                  : 'border-2 border-pink-600 text-pink-600 hover:bg-pink-50'
              }`}
            >
              {isEditing ? 'Save Changes' : 'Edit Profile'}
            </button>
          </div>
        </div>

        {/* Profile Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Personal Information */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="h-5 w-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Personal Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  disabled={!isEditing}
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-900 disabled:bg-gray-50 disabled:cursor-not-allowed"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Phone</label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  disabled={!isEditing}
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-900 disabled:bg-gray-50 disabled:cursor-not-allowed"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Date of Birth</label>
                  <input
                    type="date"
                    value={profileData.dateOfBirth}
                    onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                    disabled={!isEditing}
                    className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-900 disabled:bg-gray-50 disabled:cursor-not-allowed"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Blood Group</label>
                  <input
                    type="text"
                    value={profileData.bloodGroup}
                    onChange={(e) => handleChange('bloodGroup', e.target.value)}
                    disabled={!isEditing}
                    className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-900 disabled:bg-gray-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Emergency Contact
            </h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Name</label>
                  <input
                    type="text"
                    value={profileData.emergencyContactName}
                    onChange={(e) => handleChange('emergencyContactName', e.target.value)}
                    disabled={!isEditing}
                    className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-900 disabled:bg-gray-50 disabled:cursor-not-allowed"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Relation</label>
                  <input
                    type="text"
                    value={profileData.emergencyRelation}
                    onChange={(e) => handleChange('emergencyRelation', e.target.value)}
                    disabled={!isEditing}
                    className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-900 disabled:bg-gray-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Phone</label>
                <input
                  type="tel"
                  value={profileData.emergencyPhone}
                  onChange={(e) => handleChange('emergencyPhone', e.target.value)}
                  disabled={!isEditing}
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-900 disabled:bg-gray-50 disabled:cursor-not-allowed"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <input
                  type="email"
                  value={profileData.emergencyEmail}
                  onChange={(e) => handleChange('emergencyEmail', e.target.value)}
                  disabled={!isEditing}
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-900 disabled:bg-gray-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Lifestyle Preferences */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
              Lifestyle Preferences
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Sleep Schedule</label>
                <select
                  value={profileData.sleepSchedule}
                  onChange={(e) => handleChange('sleepSchedule', e.target.value)}
                  disabled={!isEditing}
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-900 disabled:bg-gray-50 disabled:cursor-not-allowed"
                >
                  <option>Early Riser</option>
                  <option>Night Owl</option>
                  <option>Flexible</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Study Preference</label>
                <select
                  value={profileData.studyPreference}
                  onChange={(e) => handleChange('studyPreference', e.target.value)}
                  disabled={!isEditing}
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-900 disabled:bg-gray-50 disabled:cursor-not-allowed"
                >
                  <option>Morning Person</option>
                  <option>Night Owl</option>
                  <option>Afternoon</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Cleanliness Level</label>
                <select
                  value={profileData.cleanliness}
                  onChange={(e) => handleChange('cleanliness', e.target.value)}
                  disabled={!isEditing}
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-900 disabled:bg-gray-50 disabled:cursor-not-allowed"
                >
                  <option>Very Organized</option>
                  <option>Moderately Clean</option>
                  <option>Casual</option>
                </select>
              </div>
            </div>
          </div>

          {/* About & Interests */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="h-5 w-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              About & Interests
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Bio</label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) => handleChange('bio', e.target.value)}
                  disabled={!isEditing}
                  rows="4"
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-900 disabled:bg-gray-50 disabled:cursor-not-allowed resize-none"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600 mb-2 block">Interests</label>
                <div className="flex flex-wrap gap-2">
                  {profileData.interests.map((interest, idx) => (
                    <span key={idx} className="px-3 py-1 bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 rounded-full text-sm font-medium">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Documents Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="h-5 w-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Documents
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-lg p-4 hover:border-pink-300 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Aadhaar Card</span>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">Verified</span>
              </div>
              <button className="text-sm text-pink-600 hover:text-pink-700 font-medium">View Document</button>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4 hover:border-pink-300 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Photo ID</span>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">Verified</span>
              </div>
              <button className="text-sm text-pink-600 hover:text-pink-700 font-medium">View Document</button>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4 hover:border-pink-300 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Educational Doc</span>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">Verified</span>
              </div>
              <button className="text-sm text-pink-600 hover:text-pink-700 font-medium">View Document</button>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
