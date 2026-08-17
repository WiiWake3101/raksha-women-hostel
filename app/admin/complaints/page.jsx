'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminComplaints() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  const [complaints, setComplaints] = useState([
    { id: 1, residentName: 'Priya Sharma', room: '204', category: 'Maintenance', priority: 'High', subject: 'AC not working', description: 'The AC in my room has stopped working since yesterday. It\'s very hot.', status: 'pending', submittedDate: '2026-08-16' },
    { id: 2, residentName: 'Sneha Reddy', room: '315', category: 'Internet', priority: 'Medium', subject: 'Slow Wi-Fi speed', description: 'Wi-Fi connection is very slow in my room. Can barely load websites.', status: 'in-progress', submittedDate: '2026-08-15', assignedTo: 'Raj Kumar (IT Staff)' },
    { id: 3, residentName: 'Anjali Mehta', room: '112', category: 'Housekeeping', priority: 'Low', subject: 'Bathroom cleaning', description: 'Bathroom needs deep cleaning. Some stains are hard to remove.', status: 'pending', submittedDate: '2026-08-14' },
    { id: 4, residentName: 'Neha Patel', room: '102', category: 'Maintenance', priority: 'High', subject: 'Water leakage', description: 'Water is leaking from the ceiling in the bathroom.', status: 'in-progress', submittedDate: '2026-08-13', assignedTo: 'Amit Verma (Plumber)' },
    { id: 5, residentName: 'Divya Sharma', room: '208', category: 'Security', priority: 'Medium', subject: 'Gate lock issue', description: 'The main gate lock is not working properly after 10 PM.', status: 'resolved', submittedDate: '2026-08-12', resolvedDate: '2026-08-14' },
  ]);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    setIsLoading(false);
  }, [router]);

  const filteredComplaints = filter === 'all' ? complaints : complaints.filter(c => c.status === filter);

  const stats = {
    pending: complaints.filter(c => c.status === 'pending').length,
    inProgress: complaints.filter(c => c.status === 'in-progress').length,
    resolved: complaints.filter(c => c.status === 'resolved').length,
    total: complaints.length
  };

  const handleViewDetails = (complaint) => {
    setSelectedComplaint(complaint);
    setShowModal(true);
  };

  const handleStatusChange = (complaintId, newStatus) => {
    setComplaints(prev => prev.map(c => 
      c.id === complaintId ? { ...c, status: newStatus, resolvedDate: newStatus === 'resolved' ? new Date().toISOString().split('T')[0] : undefined } : c
    ));
    setShowModal(false);
    alert(`Complaint status updated to: ${newStatus}`);
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
                <Link href="/admin/complaints" className="px-3 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg">
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
          <h1 className="text-3xl font-bold text-gray-900">Complaint Management</h1>
          <p className="text-gray-600 mt-1">Track and resolve resident complaints</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.pending}</p>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.inProgress}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.resolved}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={() => setFilter('pending')} className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${filter === 'pending' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              Pending ({stats.pending})
            </button>
            <button onClick={() => setFilter('in-progress')} className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${filter === 'in-progress' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              In Progress ({stats.inProgress})
            </button>
            <button onClick={() => setFilter('resolved')} className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${filter === 'resolved' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              Resolved ({stats.resolved})
            </button>
            <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${filter === 'all' ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              All ({stats.total})
            </button>
          </div>
        </div>

        {/* Complaints Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resident</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredComplaints.map((complaint) => (
                  <tr key={complaint.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{complaint.residentName}</div>
                        <div className="text-sm text-gray-500">Room {complaint.room}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {complaint.category}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{complaint.subject}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        complaint.priority === 'High' ? 'bg-red-100 text-red-800' :
                        complaint.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {complaint.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        complaint.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                        complaint.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {complaint.status === 'in-progress' ? 'In Progress' : complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(complaint.submittedDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button onClick={() => handleViewDetails(complaint)} className="text-purple-600 hover:text-purple-900 font-medium">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredComplaints.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No complaints</h3>
            <p className="mt-1 text-sm text-gray-500">No complaints in this category.</p>
          </div>
        )}
      </div>

      {/* Complaint Details Modal */}
      {showModal && selectedComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Complaint Details</h2>
                <button onClick={() => setShowModal(false)} className="text-white hover:text-gray-200">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-600">Resident</h3>
                <p className="text-lg font-semibold text-gray-900">{selectedComplaint.residentName} - Room {selectedComplaint.room}</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-600">Category</h3>
                  <p className="text-sm font-semibold text-gray-900">{selectedComplaint.category}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600">Priority</h3>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    selectedComplaint.priority === 'High' ? 'bg-red-100 text-red-800' :
                    selectedComplaint.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedComplaint.priority}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600">Status</h3>
                  <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                    selectedComplaint.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                    selectedComplaint.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {selectedComplaint.status === 'in-progress' ? 'In Progress' : selectedComplaint.status.charAt(0).toUpperCase() + selectedComplaint.status.slice(1)}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-600">Subject</h3>
                <p className="text-lg font-semibold text-gray-900">{selectedComplaint.subject}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-600">Description</h3>
                <p className="text-sm text-gray-900 bg-gray-50 p-4 rounded-lg">{selectedComplaint.description}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-600">Submitted Date</h3>
                <p className="text-sm text-gray-900">{new Date(selectedComplaint.submittedDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>

              {selectedComplaint.assignedTo && (
                <div>
                  <h3 className="text-sm font-medium text-gray-600">Assigned To</h3>
                  <p className="text-sm text-gray-900">{selectedComplaint.assignedTo}</p>
                </div>
              )}

              {selectedComplaint.status === 'resolved' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-green-900">✓ Resolved on {selectedComplaint.resolvedDate}</p>
                </div>
              )}

              {/* Action Buttons */}
              {selectedComplaint.status !== 'resolved' && (
                <div className="flex gap-3 pt-4 border-t">
                  {selectedComplaint.status === 'pending' && (
                    <button
                      onClick={() => handleStatusChange(selectedComplaint.id, 'in-progress')}
                      className="flex-1 bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors"
                    >
                      Start Working
                    </button>
                  )}
                  <button
                    onClick={() => handleStatusChange(selectedComplaint.id, 'resolved')}
                    className="flex-1 bg-green-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-green-700 transition-colors"
                  >
                    Mark as Resolved
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
