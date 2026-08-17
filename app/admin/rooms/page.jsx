'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminRooms() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [filterFloor, setFilterFloor] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  
  const [rooms, setRooms] = useState([
    // Floor 1
    { id: 1, number: '101', floor: 1, type: 'Single', status: 'occupied', resident: 'Meera Agarwal', occupancy: '1/1', rent: 12000 },
    { id: 2, number: '102', floor: 1, type: 'Shared', status: 'occupied', resident: 'Neha Patel', occupancy: '1/2', rent: 8000 },
    { id: 3, number: '103', floor: 1, type: 'Shared', status: 'available', resident: null, occupancy: '0/2', rent: 8000 },
    { id: 4, number: '104', floor: 1, type: 'Single', status: 'available', resident: null, occupancy: '0/1', rent: 12000 },
    { id: 5, number: '105', floor: 1, type: 'Shared', status: 'occupied', resident: 'Kavita Singh, Ritu Jain', occupancy: '2/2', rent: 8000 },
    // Floor 2
    { id: 6, number: '201', floor: 2, type: 'Single', status: 'occupied', resident: 'Anita Kumar', occupancy: '1/1', rent: 12000 },
    { id: 7, number: '202', floor: 2, type: 'Single', status: 'maintenance', resident: null, occupancy: '0/1', rent: 12000 },
    { id: 8, number: '203', floor: 2, type: 'Shared', status: 'occupied', resident: 'Pooja Shah, Simran Gill', occupancy: '2/2', rent: 8000 },
    { id: 9, number: '204', floor: 2, type: 'Single', status: 'occupied', resident: 'Priya Sharma', occupancy: '1/1', rent: 12000 },
    { id: 10, number: '205', floor: 2, type: 'Shared', status: 'occupied', resident: 'Anjali Mehta', occupancy: '1/2', rent: 8000 },
    // Floor 3
    { id: 11, number: '301', floor: 3, type: 'Single', status: 'available', resident: null, occupancy: '0/1', rent: 12000 },
    { id: 12, number: '302', floor: 3, type: 'Shared', status: 'available', resident: null, occupancy: '0/2', rent: 8000 },
    { id: 13, number: '303', floor: 3, type: 'Single', status: 'occupied', resident: 'Divya Sharma', occupancy: '1/1', rent: 12000 },
  ]);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    setIsLoading(false);
  }, [router]);

  const filteredRooms = rooms.filter(r => {
    const matchesFloor = filterFloor === 'all' || r.floor === parseInt(filterFloor);
    const matchesStatus = filterStatus === 'all' || r.status === filterStatus;
    return matchesFloor && matchesStatus;
  });

  const stats = {
    total: rooms.length,
    occupied: rooms.filter(r => r.status === 'occupied').length,
    available: rooms.filter(r => r.status === 'available').length,
    maintenance: rooms.filter(r => r.status === 'maintenance').length
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
                <Link href="/admin/rooms" className="px-3 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg">
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
          <h1 className="text-3xl font-bold text-gray-900">Room Management</h1>
          <p className="text-gray-600 mt-1">Manage room allocation and availability</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Rooms</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Occupied</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.occupied}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Available</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.available}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Maintenance</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.maintenance}</p>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex gap-4">
            <select
              value={filterFloor}
              onChange={(e) => setFilterFloor(e.target.value)}
              className="px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Floors</option>
              <option value="1">Floor 1</option>
              <option value="2">Floor 2</option>
              <option value="3">Floor 3</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="occupied">Occupied</option>
              <option value="available">Available</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
        </div>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room) => (
            <div key={room.id} className={`bg-white rounded-xl shadow-md p-6 border-l-4 ${
              room.status === 'occupied' ? 'border-green-500' :
              room.status === 'available' ? 'border-blue-500' :
              'border-orange-500'
            }`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Room {room.number}</h3>
                  <p className="text-sm text-gray-600">Floor {room.floor} • {room.type}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  room.status === 'occupied' ? 'bg-green-100 text-green-800' :
                  room.status === 'available' ? 'bg-blue-100 text-blue-800' :
                  'bg-orange-100 text-orange-800'
                }`}>
                  {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Occupancy:</span>
                  <span className="font-medium text-gray-900">{room.occupancy}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Rent:</span>
                  <span className="font-medium text-gray-900">₹{room.rent}/month</span>
                </div>
                {room.resident && (
                  <div className="pt-2 border-t">
                    <p className="text-xs text-gray-600 mb-1">Current Resident(s):</p>
                    <p className="text-sm font-medium text-gray-900">{room.resident}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button className="flex-1 px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                  View Details
                </button>
                {room.status === 'available' && (
                  <button className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:opacity-90 transition-opacity">
                    Allocate
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
