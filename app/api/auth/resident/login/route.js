import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { email, password, rememberMe } = await request.json();

    // TODO: Implement actual authentication logic
    // 1. Validate credentials against database
    // 2. Check if user is a resident
    // 3. Generate JWT token
    // 4. Return user data and token

    // Mock validation (replace with real DB check)
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Mock authentication (replace with actual auth)
    // Example: const user = await db.users.findOne({ email, role: 'resident' })
    // Example: const isValid = await bcrypt.compare(password, user.password)

    // For development/testing only - remove in production
    if (email === 'test@example.com' && password === 'password123') {
      const mockToken = 'mock-jwt-token-' + Date.now();
      const mockUser = {
        id: '1',
        fullName: 'Test Resident',
        email: email,
        roomNumber: 'A-101',
        phone: '9876543210',
        role: 'resident',
        isFirstLogin: true, // Set to true for first-time login
        profileComplete: false // Set to true if profile is complete
      };

      return NextResponse.json({
        success: true,
        message: 'Login successful',
        token: mockToken,
        user: mockUser
      });
    }

    // Invalid credentials
    return NextResponse.json(
      { message: 'Invalid email or password' },
      { status: 401 }
    );

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
