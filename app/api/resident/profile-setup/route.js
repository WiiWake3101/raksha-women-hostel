import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Get authorization token
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    
    // TODO: Verify JWT token and get user ID
    // Example: const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // const userId = decoded.id;

    // Parse form data
    const formData = await request.formData();
    
    const profileData = {
      // Personal Details
      dateOfBirth: formData.get('dateOfBirth'),
      bloodGroup: formData.get('bloodGroup'),
      medicalConditions: formData.get('medicalConditions'),
      dietaryPreferences: formData.get('dietaryPreferences'),
      
      // Emergency Contact
      emergencyContactName: formData.get('emergencyContactName'),
      emergencyContactRelation: formData.get('emergencyContactRelation'),
      emergencyContactPhone: formData.get('emergencyContactPhone'),
      emergencyContactEmail: formData.get('emergencyContactEmail'),
      
      // Preferences & Habits
      sleepSchedule: formData.get('sleepSchedule'),
      studyHabits: formData.get('studyHabits'),
      cleanliness: formData.get('cleanliness'),
      musicPreference: formData.get('musicPreference'),
      visitors: formData.get('visitors'),
      
      // Interests & Bio
      hobbies: JSON.parse(formData.get('hobbies') || '[]'),
      interests: JSON.parse(formData.get('interests') || '[]'),
      bio: formData.get('bio'),
      
      // Identity & Verification Documents
      aadhaarCard: formData.get('aadhaarCard'),
      photoId: formData.get('photoId'),
      educationalDoc: formData.get('educationalDoc'), // Student ID or Employee ID
      
      // Profile Picture
      profilePicture: formData.get('profilePicture'),
      
      // Terms
      agreeToRules: formData.get('agreeToRules') === 'true',
      agreeToPrivacy: formData.get('agreeToPrivacy') === 'true'
    };

    // Validate required fields
    if (!profileData.dateOfBirth || !profileData.bloodGroup) {
      return NextResponse.json(
        { message: 'Date of birth and blood group are required' },
        { status: 400 }
      );
    }

    if (!profileData.emergencyContactName || !profileData.emergencyContactPhone) {
      return NextResponse.json(
        { message: 'Emergency contact details are required' },
        { status: 400 }
      );
    }

    if (!profileData.aadhaarCard || !profileData.photoId) {
      return NextResponse.json(
        { message: 'Masked Aadhaar Card and Photo ID are required for verification' },
        { status: 400 }
      );
    }

    if (!profileData.educationalDoc) {
      return NextResponse.json(
        { message: 'Educational/Employment document is required' },
        { status: 400 }
      );
    }

    if (!profileData.agreeToRules || !profileData.agreeToPrivacy) {
      return NextResponse.json(
        { message: 'You must agree to hostel rules and privacy policy' },
        { status: 400 }
      );
    }

    // TODO: Upload documents if exist
    // if (profileData.aadhaarCard) {
    //   const aadhaarBuffer = await profileData.aadhaarCard.arrayBuffer();
    //   const aadhaarUpload = await uploadToStorage(aadhaarBuffer, profileData.aadhaarCard.name);
    //   profileData.aadhaarCardUrl = aadhaarUpload.url;
    // }
    
    // if (profileData.photoId) {
    //   const photoIdBuffer = await profileData.photoId.arrayBuffer();
    //   const photoIdUpload = await uploadToStorage(photoIdBuffer, profileData.photoId.name);
    //   profileData.photoIdUrl = photoIdUpload.url;
    // }
    
    // if (profileData.educationalDoc) {
    //   const educationalDocBuffer = await profileData.educationalDoc.arrayBuffer();
    //   const educationalDocUpload = await uploadToStorage(educationalDocBuffer, profileData.educationalDoc.name);
    //   profileData.educationalDocUrl = educationalDocUpload.url;
    // }

    // TODO: Upload profile picture if exists
    // if (profileData.profilePicture) {
    //   const file = profileData.profilePicture;
    //   const buffer = await file.arrayBuffer();
    //   const uploadResult = await uploadToStorage(buffer, file.name);
    //   profileData.profilePictureUrl = uploadResult.url;
    // }

    // TODO: Update user profile in database
    // Example: await db.residentProfiles.update({
    //   where: { userId },
    //   data: {
    //     ...profileData,
    //     profileComplete: true,
    //     isFirstLogin: false,
    //     profileCompletedAt: new Date()
    //   }
    // });

    // TODO: Trigger AI roommate matching algorithm
    // Example: await triggerRoommateMatching(userId, profileData);

    // Mock response
    console.log('Profile setup completed for user with data:', profileData);

    return NextResponse.json({
      success: true,
      message: 'Profile setup completed successfully',
      data: {
        profileComplete: true
      }
    });

  } catch (error) {
    console.error('Profile setup error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
