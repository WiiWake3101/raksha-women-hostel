'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminApplications() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('pending'); // pending, approved, rejected, all
  
  // Mock applications data
  const [applications, setApplications] = useState([
    {
      id: 1,
      name: 'Kavita Singh',
      email: 'kavita.singh@example.com',
      phone: '+91 98765 43210',
      age: 22,
      profession: 'Student',
      institution: 'IIT Delhi',
      course: 'B.Tech Computer Science',
      address: 'Mumbai, Maharashtra',
      emergencyContact: 'Raj Singh (Father) - +91 98765 43211',
      appliedDate: '2026-08-15',
      status: 'pending',
      aadhaarVerified: true,
      documentsSubmitted: true,
      roomPreference: 'Single'
    },
    {
      id: 2,
      name: 'Meera Patel',
      email: 'meera.patel@example.com',
      phone: '+91 87654 32109',
      age: 25,
      profession: 'Working Professional',
      company: 'Google India',
      designation: 'Software Engineer',
      address: 'Pune, Maharashtra',
      emergencyContact: 'Amit Patel (Brother) - +91 87654 32110',
      appliedDate: '2026-08-14',
      status: 'pending',
      aadhaarVerified: true,
      documentsSubmitted: true,
      roomPreference: 'Shared'
    },
    {
      id: 3,
      name: 'Sneha Reddy',
      email: 'sneha.reddy@example.com',
      phone: '+91 76543 21098',
      age: 21,
      profession: 'Student',
      institution: 'Delhi University',
      course: 'M.Sc Physics',
      address: 'Hyderabad, Telangana',
      emergencyContact: 'Lakshmi Reddy (Mother) - +91 76543 21099',
      appliedDate: '2026-08-13',
      status: 'pending',
      aadhaarVerified: false,
      documentsSubmitted: true,
      roomPreference: 'Shared'
    },
    {
      id: 4,
      name: 'Divya Sharma',
      email: 'divya.sharma@example.com',
      phone: '+91 65432 10987',
      age: 24,
      profession: 'Working Professional',
      company: 'Infosys',
      designation: 'Data Analyst',
      address: 'Bangalore, Karnataka',
      emergencyContact: 'Suresh Sharma (Father) - +91 65432 10988',
      appliedDate: '2026-08-12',
      status: 'approved',
      aadhaarVerified: true,
      documentsSubmitted: true,
      roomPreference: 'Single',
      approvedDate: '2026-08-13',
      allocatedRoom: '208'
    },
    {
      id: 5,
      name: 'Rani Gupta',
      email: 'rani.gupta@example.com',
      phone: '+91 54321 09876',
      age: 19,
      profession: 'Student',
      institution: 'AIIMS Delhi',
      course: 'MBBS',
      address: 'Lucknow, UP',
      emergencyContact: 'Prakash Gupta (Father) - +91 54321 09877',
      appliedDate: '2026-08-11',
      status: 'rejected',
      aadhaarVerified: false,
      documentsSubmitted: false,
      roomPreference: 'Shared',
      rejectedDate: '2026-08-12',
      rejectionReason: 'Incomplete documentation'
    }
  ]);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    setIsLoading(false);
  }, [router]);

  const handleViewDetails = (app) => {
    setSelectedApplication(app);
    setShowModal(true);
  };

  const handleApprove = (appId) => {
    const roomNumber = prompt('Enter room number to allocate:');
    if (!roomNumber) return;

    setApplications(prev => prev.map(app => 
      app.id === appId 
        ? { ...app, status: 'approved', approvedDate: new Date().toISOString().split('T')[0], allocatedRoom: roomNumber }
        : app
    ));
    setShowModal(false);
    alert('Application approved and room allocated!');
  };

  const handleReject = (appId) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;

    setApplications(prev => prev.map(app => 
      app.id === appId 
        ? { ...app, status: 'rejected', rejectedDate: new Date().toISOString().split('T')[0], rejectionReason: reason }
        : app
    ));
    setShowModal(false);
    alert('Application rejected.');
  };

  const filteredApplications = applications.filter(app => 
    filter === 'all' ? true : app.status === filter
  );

  const statusCounts = {
    pending: applications.filter(a => a.status === 'pending').length,
    approved: applications.filter(a => a.status === 'approved').length,
    rejected: applications.filter(a => a.status === 'rejected').length
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
                <Link href="/admin/applications" className="px-3 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg">
                  Applications
                  <span className="ml-2 px-2 py-0.5 text-xs bg-orange-500 text-white rounded-full">{statusCounts.pending}</span>
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
                <Link href="/admin/staff" className="px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Resident Applications</h1>
          <p className="text-gray-600 mt-1">Review and manage new resident applications</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{statusCounts.pending}</p>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{statusCounts.approved}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{statusCounts.rejected}</p>
              </div>
              <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                filter === 'pending' 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pending ({statusCounts.pending})
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                filter === 'approved' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Approved ({statusCounts.approved})
            </button>
            <button
              onClick={() => setFilter('rejected')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                filter === 'rejected' 
                  ? 'bg-red-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Rejected ({statusCounts.rejected})
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                filter === 'all' 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({applications.length})
            </button>
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profession</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verification</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{app.name}</div>
                        <div className="text-sm text-gray-500">{app.roomPreference} Room</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{app.email}</div>
                      <div className="text-sm text-gray-500">{app.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{app.profession}</div>
                      <div className="text-sm text-gray-500">
                        {app.profession === 'Student' ? app.institution : app.company}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(app.appliedDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          app.aadhaarVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {app.aadhaarVerified ? '✓' : '✗'} Aadhaar
                        </span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          app.documentsSubmitted ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {app.documentsSubmitted ? '✓' : '✗'} Docs
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        app.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                        app.status === 'approved' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleViewDetails(app)}
                        className="text-purple-600 hover:text-purple-900 font-medium"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredApplications.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No applications</h3>
            <p className="mt-1 text-sm text-gray-500">No applications in this category.</p>
          </div>
        )}
      </div>

      {/* Application Details Modal */}
      {showModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Application Details</h2>
                <button onClick={() => setShowModal(false)} className="text-white hover:text-gray-200">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Full Name</p>
                    <p className="text-sm font-medium text-gray-900">{selectedApplication.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Age</p>
                    <p className="text-sm font-medium text-gray-900">{selectedApplication.age} years</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="text-sm font-medium text-gray-900">{selectedApplication.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="text-sm font-medium text-gray-900">{selectedApplication.phone}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="text-sm font-medium text-gray-900">{selectedApplication.address}</p>
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Professional Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Profession</p>
                    <p className="text-sm font-medium text-gray-900">{selectedApplication.profession}</p>
                  </div>
                  {selectedApplication.profession === 'Student' ? (
                    <>
                      <div>
                        <p className="text-sm text-gray-600">Institution</p>
                        <p className="text-sm font-medium text-gray-900">{selectedApplication.institution}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm text-gray-600">Course</p>
                        <p className="text-sm font-medium text-gray-900">{selectedApplication.course}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <p className="text-sm text-gray-600">Company</p>
                        <p className="text-sm font-medium text-gray-900">{selectedApplication.company}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm text-gray-600">Designation</p>
                        <p className="text-sm font-medium text-gray-900">{selectedApplication.designation}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Emergency Contact */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Emergency Contact</h3>
                <p className="text-sm font-medium text-gray-900">{selectedApplication.emergencyContact}</p>
              </div>

              {/* Room Preference */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Room Preference</h3>
                <p className="text-sm font-medium text-gray-900">{selectedApplication.roomPreference} Room</p>
              </div>

              {/* Verification Status */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Verification Status</h3>
                <div className="flex gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedApplication.aadhaarVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedApplication.aadhaarVerified ? '✓' : '✗'} Aadhaar Verified
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedApplication.documentsSubmitted ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedApplication.documentsSubmitted ? '✓' : '✗'} Documents Submitted
                  </span>
                </div>
              </div>

              {/* Status Information */}
              {selectedApplication.status === 'approved' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-green-900">✓ Approved on {selectedApplication.approvedDate}</p>
                  <p className="text-sm text-green-700 mt-1">Allocated Room: {selectedApplication.allocatedRoom}</p>
                </div>
              )}

              {selectedApplication.status === 'rejected' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-red-900">✗ Rejected on {selectedApplication.rejectedDate}</p>
                  <p className="text-sm text-red-700 mt-1">Reason: {selectedApplication.rejectionReason}</p>
                </div>
              )}

              {/* Action Buttons */}
              {selectedApplication.status === 'pending' && (
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => handleApprove(selectedApplication.id)}
                    className="flex-1 bg-green-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-green-700 transition-colors"
                  >
                    ✓ Approve Application
                  </button>
                  <button
                    onClick={() => handleReject(selectedApplication.id)}
                    className="flex-1 bg-red-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-red-700 transition-colors"
                  >
                    ✗ Reject Application
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
