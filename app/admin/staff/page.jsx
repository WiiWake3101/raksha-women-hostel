'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminStaff() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [filterRole, setFilterRole] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  
  const [staff, setStaff] = useState([
    { id: 1, name: 'Lakshmi Devi', role: 'Warden', phone: '+91 98765 43210', email: 'warden@raksha.com', shift: 'Day', joinDate: '2020-01-15', status: 'Active' },
    { id: 2, name: 'Raj Kumar', role: 'IT Staff', phone: '+91 98765 43211', email: 'raj.kumar@raksha.com', shift: 'Day', joinDate: '2022-03-20', status: 'Active' },
    { id: 3, name: 'Amit Verma', role: 'Maintenance', phone: '+91 98765 43212', email: 'amit.verma@raksha.com', shift: 'Day', joinDate: '2021-07-10', status: 'Active' },
    { id: 4, name: 'Sunita Sharma', role: 'Housekeeping', phone: '+91 98765 43213', email: 'sunita.sharma@raksha.com', shift: 'Morning', joinDate: '2023-01-05', status: 'Active' },
    { id: 5, name: 'Ravi Singh', role: 'Security', phone: '+91 98765 43214', email: 'ravi.singh@raksha.com', shift: 'Night', joinDate: '2022-11-12', status: 'Active' },
    { id: 6, name: 'Meena Patel', role: 'Housekeeping', phone: '+91 98765 43215', email: 'meena.patel@raksha.com', shift: 'Evening', joinDate: '2023-04-18', status: 'Active' },
    { id: 7, name: 'Vijay Kumar', role: 'Security', phone: '+91 98765 43216', email: 'vijay.kumar@raksha.com', shift: 'Day', joinDate: '2021-09-25', status: 'Active' },
  ]);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    setIsLoading(false);
  }, [router]);

  const filteredStaff = filterRole === 'all' ? staff : staff.filter(s => s.role === filterRole);

  const stats = {
    total: staff.length,
    warden: staff.filter(s => s.role === 'Warden').length,
    housekeeping: staff.filter(s => s.role === 'Housekeeping').length,
    security: staff.filter(s => s.role === 'Security').length,
    maintenance: staff.filter(s => s.role === 'Maintenance').length,
    it: staff.filter(s => s.role === 'IT Staff').length,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      
      {/* Admin Navbar */}
      <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/admin/dashboard" className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Raksha Admin
              </Link>
              <div className="hidden md:flex items-center gap-1">
                <Link href="/admin/dashboard" className="px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                  Dashboard
                </Link>
                <Link href="/admin/residents" className="px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                  Residents
                </Link>
                <Link href="/admin/applications" className="px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                  Applications
                </Link>
                <Link href="/admin/rooms" className="px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                  Rooms
                </Link>
                <Link href="/admin/payments" className="px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                  Payments
                </Link>
                <Link href="/admin/complaints" className="px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                  Complaints
                </Link>
                <Link href="/admin/staff" className="px-3 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg">
                  Staff
                </Link>
              </div>
            </div>
            <Link href="/admin/dashboard" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
            <p className="text-gray-600 mt-1">Manage hostel staff members and their roles</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-6 rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Staff
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-purple-500">
            <p className="text-xs font-medium text-gray-600 mb-1">Total Staff</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-pink-500">
            <p className="text-xs font-medium text-gray-600 mb-1">Warden</p>
            <p className="text-2xl font-bold text-gray-900">{stats.warden}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-blue-500">
            <p className="text-xs font-medium text-gray-600 mb-1">Housekeeping</p>
            <p className="text-2xl font-bold text-gray-900">{stats.housekeeping}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-green-500">
            <p className="text-xs font-medium text-gray-600 mb-1">Security</p>
            <p className="text-2xl font-bold text-gray-900">{stats.security}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-orange-500">
            <p className="text-xs font-medium text-gray-600 mb-1">Maintenance</p>
            <p className="text-2xl font-bold text-gray-900">{stats.maintenance}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-indigo-500">
            <p className="text-xs font-medium text-gray-600 mb-1">IT Staff</p>
            <p className="text-2xl font-bold text-gray-900">{stats.it}</p>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={() => setFilterRole('all')} className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${filterRole === 'all' ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              All Staff ({stats.total})
            </button>
            <button onClick={() => setFilterRole('Warden')} className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${filterRole === 'Warden' ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              Warden ({stats.warden})
            </button>
            <button onClick={() => setFilterRole('Housekeeping')} className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${filterRole === 'Housekeeping' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              Housekeeping ({stats.housekeeping})
            </button>
            <button onClick={() => setFilterRole('Security')} className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${filterRole === 'Security' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              Security ({stats.security})
            </button>
            <button onClick={() => setFilterRole('Maintenance')} className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${filterRole === 'Maintenance' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              Maintenance ({stats.maintenance})
            </button>
            <button onClick={() => setFilterRole('IT Staff')} className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${filterRole === 'IT Staff' ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              IT Staff ({stats.it})
            </button>
          </div>
        </div>

        {/* Staff Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStaff.map((member) => (
            <div key={member.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
                    <p className="text-sm text-gray-600">{member.role}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  member.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {member.status}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>{member.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="truncate">{member.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{member.shift} Shift</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Joined {new Date(member.joinDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <button className="flex-1 px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                  View Details
                </button>
                <button className="flex-1 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Add New Staff Member</h2>
                <button onClick={() => setShowAddModal(false)} className="text-white hover:text-gray-200">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                      <option>Select Role</option>
                      <option>Warden</option>
                      <option>Housekeeping</option>
                      <option>Security</option>
                      <option>Maintenance</option>
                      <option>IT Staff</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Shift</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                      <option>Select Shift</option>
                      <option>Day</option>
                      <option>Morning</option>
                      <option>Evening</option>
                      <option>Night</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Join Date</label>
                    <input
                      type="date"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-xl hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-6 rounded-xl hover:opacity-90 transition-opacity"
                  >
                    Add Staff Member
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
