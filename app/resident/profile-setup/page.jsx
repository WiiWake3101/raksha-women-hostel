'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';

export default function ProfileSetup() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    // Step 1: Personal Details
    dateOfBirth: '',
    bloodGroup: '',
    medicalConditions: '',
    dietaryPreferences: '',
    
    // Step 2: Emergency Contact (verification/update)
    emergencyContactName: '',
    emergencyContactRelation: '',
    emergencyContactPhone: '',
    emergencyContactEmail: '',
    
    // Step 3: Preferences & Habits
    sleepSchedule: 'early-bird', // early-bird, night-owl, flexible
    studyHabits: 'quiet', // quiet, moderate, social
    cleanliness: 'very-clean', // very-clean, moderate, relaxed
    musicPreference: 'quiet', // quiet, moderate, loud
    visitors: 'rarely', // rarely, occasionally, frequently
    
    // Step 4: Interests & Bio
    hobbies: [],
    interests: [],
    bio: '',
    
    // Step 5: Document Upload
    aadhaarCard: null, // Single PDF with both front & back
    photoId: null,
    educationalDoc: null,
    
    // Step 6: Profile Picture & Terms
    profilePicture: null,
    
    // Terms
    agreeToRules: false,
    agreeToPrivacy: false
  });

  // Document preview URLs
  const [documentPreviews, setDocumentPreviews] = useState({
    aadhaarCard: null,
    photoId: null,
    educationalDoc: null
  });

  // Document validation status
  const [documentValidation, setDocumentValidation] = useState({
    aadhaarCard: { status: 'pending', message: '' }, // pending, validating, valid, invalid
    photoId: { status: 'pending', message: '' }
  });

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const dietaryOptions = ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Jain', 'No Preference'];
  const hobbiesOptions = ['Reading', 'Music', 'Dancing', 'Cooking', 'Yoga', 'Gym', 'Art', 'Photography', 'Writing', 'Gardening', 'Gaming', 'Sports'];
  const interestsOptions = ['Technology', 'Fashion', 'Travel', 'Food', 'Movies', 'Books', 'Fitness', 'Science', 'Business', 'Social Service', 'Environment'];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleMultiSelect = (name, value) => {
    setFormData(prev => {
      const currentValues = prev[name] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      return { ...prev, [name]: newValues };
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, profilePicture: 'Image size must be less than 2MB' }));
        return;
      }
      // Validate file type
      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        setErrors(prev => ({ ...prev, profilePicture: 'Only JPG, JPEG, and PNG files are allowed' }));
        return;
      }
      setFormData(prev => ({ ...prev, profilePicture: file }));
      setErrors(prev => ({ ...prev, profilePicture: '' }));
    }
  };

  const handleDocumentUpload = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB for documents)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, [fieldName]: 'File size must be less than 5MB' }));
        return;
      }
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, [fieldName]: 'Only JPG, PNG, and PDF files are allowed' }));
        return;
      }

      // Validate Aadhaar document specifically
      if (fieldName === 'aadhaarCard') {
        // Validation will be done by validateAadhaarPDF function
      }

      // Create preview URL for the document
      const previewUrl = URL.createObjectURL(file);
      setDocumentPreviews(prev => ({ ...prev, [fieldName]: previewUrl }));
      
      setFormData(prev => ({ ...prev, [fieldName]: file }));
      setErrors(prev => ({ ...prev, [fieldName]: '' }));

      // Validate Aadhaar PDF content
      if (fieldName === 'aadhaarCard') {
        validateAadhaarPDF(file);
      }
    }
  };

  const removeDocument = (fieldName) => {
    // Revoke the preview URL to free memory
    if (documentPreviews[fieldName]) {
      URL.revokeObjectURL(documentPreviews[fieldName]);
    }
    setDocumentPreviews(prev => ({ ...prev, [fieldName]: null }));
    setFormData(prev => ({ ...prev, [fieldName]: null }));
    setErrors(prev => ({ ...prev, [fieldName]: '', [fieldName + '_warning']: '' }));
    // Reset validation status
    if (documentValidation[fieldName]) {
      setDocumentValidation(prev => ({ ...prev, [fieldName]: { status: 'pending', message: '' } }));
    }
  };

  // Validate Aadhaar PDF content
  const validateAadhaarPDF = async (file) => {
    setDocumentValidation(prev => ({ 
      ...prev, 
      aadhaarCard: { status: 'validating', message: 'Validating document...' } 
    }));

    try {
      // Basic filename validation
      const fileName = file.name.toLowerCase();
      const validKeywords = ['aadhaar', 'aadhar', 'masked', 'uidai'];
      const hasValidKeyword = validKeywords.some(keyword => fileName.includes(keyword));

      if (!hasValidKeyword) {
        setDocumentValidation(prev => ({ 
          ...prev, 
          aadhaarCard: { 
            status: 'warning', 
            message: 'Filename doesn\'t contain "aadhaar" or "masked". Please verify you uploaded the correct document.' 
          } 
        }));
        return;
      }

      // If PDF, try to validate content (requires pdf.js library)
      if (file.type === 'application/pdf') {
        // Check if pdf.js is available
        if (typeof window !== 'undefined' && window.pdfjsLib) {
          const arrayBuffer = await file.arrayBuffer();
          const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
          
          // Check number of pages (Aadhaar should have 1-2 pages)
          if (pdf.numPages < 1 || pdf.numPages > 3) {
            setDocumentValidation(prev => ({ 
              ...prev, 
              aadhaarCard: { 
                status: 'warning', 
                message: `Document has ${pdf.numPages} pages. Masked Aadhaar usually has 1-2 pages.` 
              } 
            }));
            return;
          }

          // Extract text from first page to check for Aadhaar keywords
          const page = await pdf.getPage(1);
          const textContent = await page.getTextContent();
          const text = textContent.items.map(item => item.str).join(' ').toLowerCase();
          
          // Check for required keywords
          const hasAadhaar = text.includes('aadhaar') || text.includes('aadhar');
          const hasUidai = text.includes('uidai') || text.includes('unique identification');
          const hasMasked = /xxxx\s*xxxx\s*\d{4}/.test(text) || /\*{4}\s*\*{4}\s*\d{4}/.test(text);
          
          if (!hasAadhaar && !hasUidai) {
            setDocumentValidation(prev => ({ 
              ...prev, 
              aadhaarCard: { 
                status: 'invalid', 
                message: '❌ This doesn\'t appear to be an Aadhaar document. Please upload the correct file.' 
              } 
            }));
            return;
          }

          if (!hasMasked) {
            setDocumentValidation(prev => ({ 
              ...prev, 
              aadhaarCard: { 
                status: 'warning', 
                message: '⚠️ Could not detect masked Aadhaar number pattern (XXXX XXXX 1234). Please ensure you uploaded MASKED Aadhaar, not regular Aadhaar.' 
              } 
            }));
            return;
          }

          // All checks passed
          setDocumentValidation(prev => ({ 
            ...prev, 
            aadhaarCard: { 
              status: 'valid', 
              message: '✅ Masked Aadhaar document verified successfully!' 
            } 
          }));
        } else {
          // PDF.js not loaded, use basic validation
          setDocumentValidation(prev => ({ 
            ...prev, 
            aadhaarCard: { 
              status: 'valid', 
              message: '✅ Document uploaded successfully. Manual verification will be done by admin.' 
            } 
          }));
        }
      } else {
        // For images, we can't read content easily, so just validate filename
        setDocumentValidation(prev => ({ 
          ...prev, 
          aadhaarCard: { 
            status: 'valid', 
            message: '✅ Document uploaded successfully. Please ensure it shows your masked Aadhaar with XXXX XXXX [last 4 digits].' 
          } 
        }));
      }
    } catch (error) {
      console.error('PDF validation error:', error);
      setDocumentValidation(prev => ({ 
        ...prev, 
        aadhaarCard: { 
          status: 'warning', 
          message: '⚠️ Could not validate PDF content. Manual verification will be done by admin.' 
        } 
      }));
    }
  };

  const validateStep = () => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
      if (!formData.bloodGroup) newErrors.bloodGroup = 'Blood group is required';
    }

    if (step === 2) {
      if (!formData.emergencyContactName) newErrors.emergencyContactName = 'Emergency contact name is required';
      if (!formData.emergencyContactRelation) newErrors.emergencyContactRelation = 'Relation is required';
      if (!formData.emergencyContactPhone || !/^[0-9]{10}$/.test(formData.emergencyContactPhone)) {
        newErrors.emergencyContactPhone = 'Valid 10-digit phone number is required';
      }
    }

    if (step === 5) {
      if (!formData.aadhaarCard) {
        newErrors.aadhaarCard = 'Masked Aadhaar document is required';
      } else if (documentValidation.aadhaarCard.status === 'invalid') {
        newErrors.aadhaarCard = 'Please upload a valid Masked Aadhaar document';
      }
      
      if (!formData.photoId) {
        newErrors.photoId = 'Photo ID is required';
      }
      
      // Ensure educational document is uploaded
      if (!formData.educationalDoc) {
        newErrors.educationalDoc = 'Educational/Employment document is required';
      }
    }

    if (step === 6) {
      if (!formData.agreeToRules) newErrors.agreeToRules = 'You must agree to hostel rules';
      if (!formData.agreeToPrivacy) newErrors.agreeToPrivacy = 'You must agree to privacy policy';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep()) {
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Replace with actual API call
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'hobbies' || key === 'interests') {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else if (key === 'profilePicture' || key === 'aadhaarCard' || key === 'photoId' || key === 'educationalDoc') {
          // Handle file uploads
          if (formData[key]) {
            formDataToSend.append(key, formData[key]);
          }
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await fetch('/api/resident/profile-setup', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('residentToken')}`
        },
        body: formDataToSend,
      });

      if (response.ok) {
        // Mark profile as complete in localStorage
        localStorage.setItem('profileComplete', 'true');
        // Redirect to dashboard
        router.push('/resident/dashboard');
      } else {
        const error = await response.json();
        setErrors({ submit: error.message || 'Profile setup failed. Please try again.' });
      }
    } catch (error) {
      console.error('Profile setup error:', error);
      setErrors({ submit: 'Network error. Please check your connection.' });
    } finally {
      setIsLoading(false);
    }
  };

  const totalSteps = 6;
  const progress = (step / totalSteps) * 100;

  return (
    <>
      {/* Load PDF.js library for PDF validation */}
      <Script 
        src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
        strategy="beforeInteractive"
        onLoad={() => {
          if (typeof window !== 'undefined' && window.pdfjsLib) {
            window.pdfjsLib.GlobalWorkerOptions.workerSrc = 
              'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
          }
        }}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-8 px-4">
        <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
            <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Complete Your Profile</h1>
          <p className="mt-2 text-sm text-gray-600">
            Help us personalize your experience and match you with compatible roommates
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Step {step} of {totalSteps}</span>
            <span className="text-sm font-medium text-gray-700">{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-gradient-to-r from-pink-500 to-purple-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Step 1: Personal Details */}
            {step === 1 && (
              <div className="space-y-5">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h2>
                
                <div>
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className={`block w-full text-gray-900 px-3 py-3 border ${errors.dateOfBirth ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500`}
                    max={new Date().toISOString().split('T')[0]}
                  />
                  {errors.dateOfBirth && <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>}
                </div>

                <div>
                  <label htmlFor="bloodGroup" className="block text-sm font-medium text-gray-700 mb-1">
                    Blood Group *
                  </label>
                  <select
                    id="bloodGroup"
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    className={`block w-full text-gray-900 px-3 py-3 border ${errors.bloodGroup ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500`}
                  >
                    <option value="">Select Blood Group</option>
                    {bloodGroups.map(group => (
                      <option key={group} value={group}>{group}</option>
                    ))}
                  </select>
                  {errors.bloodGroup && <p className="mt-1 text-sm text-red-600">{errors.bloodGroup}</p>}
                </div>

                <div>
                  <label htmlFor="medicalConditions" className="block text-sm font-medium text-gray-700 mb-1">
                    Medical Conditions (if any)
                  </label>
                  <textarea
                    id="medicalConditions"
                    name="medicalConditions"
                    value={formData.medicalConditions}
                    onChange={handleChange}
                    rows="3"
                    className="block w-full text-gray-900 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 placeholder:text-gray-400"
                    placeholder="e.g., Allergies, Asthma, Diabetes..."
                  />
                </div>

                <div>
                  <label htmlFor="dietaryPreferences" className="block text-sm font-medium text-gray-700 mb-1">
                    Dietary Preference
                  </label>
                  <select
                    id="dietaryPreferences"
                    name="dietaryPreferences"
                    value={formData.dietaryPreferences}
                    onChange={handleChange}
                    className="block w-full text-gray-900 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  >
                    <option value="">Select Preference</option>
                    {dietaryOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Step 2: Emergency Contact */}
            {step === 2 && (
              <div className="space-y-5">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Emergency Contact Details</h2>
                
                <div>
                  <label htmlFor="emergencyContactName" className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Name *
                  </label>
                  <input
                    type="text"
                    id="emergencyContactName"
                    name="emergencyContactName"
                    value={formData.emergencyContactName}
                    onChange={handleChange}
                    className={`block w-full text-gray-900 px-3 py-3 border ${errors.emergencyContactName ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 placeholder:text-gray-400`}
                    placeholder="Parent/Guardian name"
                  />
                  {errors.emergencyContactName && <p className="mt-1 text-sm text-red-600">{errors.emergencyContactName}</p>}
                </div>

                <div>
                  <label htmlFor="emergencyContactRelation" className="block text-sm font-medium text-gray-700 mb-1">
                    Relationship *
                  </label>
                  <select
                    id="emergencyContactRelation"
                    name="emergencyContactRelation"
                    value={formData.emergencyContactRelation}
                    onChange={handleChange}
                    className={`block w-full text-gray-900 px-3 py-3 border ${errors.emergencyContactRelation ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500`}
                  >
                    <option value="">Select Relationship</option>
                    <option value="Mother">Mother</option>
                    <option value="Father">Father</option>
                    <option value="Guardian">Guardian</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.emergencyContactRelation && <p className="mt-1 text-sm text-red-600">{errors.emergencyContactRelation}</p>}
                </div>

                <div>
                  <label htmlFor="emergencyContactPhone" className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Phone *
                  </label>
                  <input
                    type="tel"
                    id="emergencyContactPhone"
                    name="emergencyContactPhone"
                    value={formData.emergencyContactPhone}
                    onChange={handleChange}
                    maxLength="10"
                    className={`block w-full text-gray-900 px-3 py-3 border ${errors.emergencyContactPhone ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 placeholder:text-gray-400`}
                    placeholder="9876543210"
                  />
                  {errors.emergencyContactPhone && <p className="mt-1 text-sm text-red-600">{errors.emergencyContactPhone}</p>}
                </div>

                <div>
                  <label htmlFor="emergencyContactEmail" className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Email (Optional)
                  </label>
                  <input
                    type="email"
                    id="emergencyContactEmail"
                    name="emergencyContactEmail"
                    value={formData.emergencyContactEmail}
                    onChange={handleChange}
                    className="block w-full text-gray-900 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 placeholder:text-gray-400"
                    placeholder="email@example.com"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Preferences & Habits */}
            {step === 3 && (
              <div className="space-y-5">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Lifestyle Preferences</h2>
                <p className="text-sm text-gray-600 mb-4">Help us match you with compatible roommates</p>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sleep Schedule
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { value: 'early-bird', label: 'Early Bird', desc: 'Sleep before 10 PM, wake up early' },
                      { value: 'night-owl', label: 'Night Owl', desc: 'Sleep after midnight, wake up late' },
                      { value: 'flexible', label: 'Flexible', desc: 'No fixed schedule' }
                    ].map(option => (
                      <label key={option.value} className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${formData.sleepSchedule === option.value ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:border-pink-300'}`}>
                        <input
                          type="radio"
                          name="sleepSchedule"
                          value={option.value}
                          checked={formData.sleepSchedule === option.value}
                          onChange={handleChange}
                          className="mt-1 h-4 w-4 text-pink-600 focus:ring-pink-500"
                        />
                        <div className="ml-3">
                          <div className="font-medium text-gray-900">{option.label}</div>
                          <div className="text-sm text-gray-500">{option.desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Study Habits
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { value: 'quiet', label: 'Prefer Quiet', desc: 'Need silence to focus' },
                      { value: 'moderate', label: 'Moderate Noise OK', desc: 'Can work with some background noise' },
                      { value: 'social', label: 'Social Learner', desc: 'Like studying in groups' }
                    ].map(option => (
                      <label key={option.value} className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${formData.studyHabits === option.value ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:border-pink-300'}`}>
                        <input
                          type="radio"
                          name="studyHabits"
                          value={option.value}
                          checked={formData.studyHabits === option.value}
                          onChange={handleChange}
                          className="mt-1 h-4 w-4 text-pink-600 focus:ring-pink-500"
                        />
                        <div className="ml-3">
                          <div className="font-medium text-gray-900">{option.label}</div>
                          <div className="text-sm text-gray-500">{option.desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cleanliness Level
                  </label>
                  <select
                    name="cleanliness"
                    value={formData.cleanliness}
                    onChange={handleChange}
                    className="block w-full text-gray-900 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  >
                    <option value="very-clean">Very Clean - Everything organized</option>
                    <option value="moderate">Moderate - Tidy most of the time</option>
                    <option value="relaxed">Relaxed - Comfortable with some mess</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Visitor Frequency
                  </label>
                  <select
                    name="visitors"
                    value={formData.visitors}
                    onChange={handleChange}
                    className="block w-full text-gray-900 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  >
                    <option value="rarely">Rarely - Almost never</option>
                    <option value="occasionally">Occasionally - Once in a while</option>
                    <option value="frequently">Frequently - Often have guests</option>
                  </select>
                </div>
              </div>
            )}

            {/* Step 4: Interests & Bio */}
            {step === 4 && (
              <div className="space-y-5">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Tell Us About Yourself</h2>
                <p className="text-sm text-gray-600 mb-4">This helps build your community profile</p>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hobbies (Select all that apply)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {hobbiesOptions.map(hobby => (
                      <label key={hobby} className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${formData.hobbies.includes(hobby) ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:border-pink-300'}`}>
                        <input
                          type="checkbox"
                          checked={formData.hobbies.includes(hobby)}
                          onChange={() => handleMultiSelect('hobbies', hobby)}
                          className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-900">{hobby}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interests (Select all that apply)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {interestsOptions.map(interest => (
                      <label key={interest} className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${formData.interests.includes(interest) ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:border-pink-300'}`}>
                        <input
                          type="checkbox"
                          checked={formData.interests.includes(interest)}
                          onChange={() => handleMultiSelect('interests', interest)}
                          className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-900">{interest}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                    About You (Optional)
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows="4"
                    maxLength="300"
                    className="block w-full text-gray-900 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 placeholder:text-gray-400"
                    placeholder="Share a bit about yourself, your goals, what you're studying..."
                  />
                  <p className="mt-1 text-xs text-gray-500">{formData.bio.length}/300 characters</p>
                </div>
              </div>
            )}

            {/* Step 5: Document Upload */}
            {step === 5 && (
              <div className="space-y-5">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Identity & Verification Documents</h2>
                <p className="text-sm text-gray-600 mb-4">Please upload the following documents for verification</p>

                {/* Important Notice - Masked Aadhaar */}
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-5">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-semibold text-yellow-800">⚠️ Important: Upload Masked Aadhaar Only</p>
                      <p className="text-xs text-yellow-700 mt-1">
                        For your security, please upload <strong>Masked Aadhaar PDF</strong> (with first 8 digits hidden). 
                        Do NOT upload regular Aadhaar with full number visible. The PDF contains both front and back pages.
                      </p>
                      <a 
                        href="https://myaadhaar.uidai.gov.in/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-xs font-medium text-yellow-800 hover:text-yellow-900 mt-2 underline"
                      >
                        📥 Download Masked Aadhaar PDF from UIDAI Official Website
                        <svg className="ml-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                      <p className="text-xs text-yellow-700 mt-2 font-medium">
                        💡 <strong>Tip:</strong> After downloading, rename the file to: <code className="bg-yellow-100 px-1 py-0.5 rounded text-yellow-900">FIRSTNAME_LASTNAME_Aadhaar_Card_Mask.pdf</code>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Reference Image - What Masked Aadhaar Looks Like */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg p-4 mb-5">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-purple-900 mb-2">✓ What Your Masked Aadhaar Should Look Like:</p>
                      <ul className="text-xs text-purple-800 space-y-1 ml-4 list-disc">
                        <li>Aadhaar number should show as: <strong>XXXX XXXX 1234</strong> (first 8 digits masked)</li>
                        <li>Contains both <strong>front page</strong> (with photo & masked number) and <strong>back page</strong> (with address)</li>
                        <li>Downloaded from official UIDAI website: <strong>myaadhaar.uidai.gov.in</strong></li>
                        <li>Please rename to: <strong>"FIRSTNAME_LASTNAME_Aadhaar_Card_Mask.pdf"</strong> before uploading</li>
                        <li>Watermark may be present indicating it's a masked copy</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Aadhaar Card Upload (Single PDF with both pages) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Masked Aadhaar Card (PDF with Front & Back) *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-pink-400 transition-colors">
                    <input
                      type="file"
                      id="aadhaarCard"
                      accept="image/jpeg,image/jpg,image/png,application/pdf"
                      onChange={(e) => handleDocumentUpload(e, 'aadhaarCard')}
                      className="hidden"
                    />
                    {formData.aadhaarCard ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-center">
                          <svg className="h-12 w-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-700 font-medium">{formData.aadhaarCard.name}</p>
                          <p className="text-xs text-gray-500">{(formData.aadhaarCard.size / 1024).toFixed(2)} KB</p>
                        </div>
                        
                        {/* Document Preview */}
                        {documentPreviews.aadhaarCard && (
                          <div className="mt-3 border border-gray-200 rounded-lg p-3 bg-gray-50">
                            <p className="text-xs font-semibold text-gray-700 mb-2">📄 Preview:</p>
                            {formData.aadhaarCard.type === 'application/pdf' ? (
                              <div className="flex items-center justify-center bg-white border border-gray-300 rounded p-6">
                                <div className="text-center">
                                  <svg className="mx-auto h-16 w-16 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                  </svg>
                                  <p className="text-sm text-gray-600 mt-2">PDF Document</p>
                                  <a 
                                    href={documentPreviews.aadhaarCard} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-xs text-pink-600 hover:text-pink-700 underline mt-1 inline-block"
                                  >
                                    Open PDF in new tab to verify
                                  </a>
                                </div>
                              </div>
                            ) : (
                              <img 
                                src={documentPreviews.aadhaarCard} 
                                alt="Aadhaar preview" 
                                className="w-full h-auto rounded border border-gray-300"
                              />
                            )}
                          </div>
                        )}
                        
                        <button
                          type="button"
                          onClick={() => removeDocument('aadhaarCard')}
                          className="w-full py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                        >
                          🗑️ Remove Document
                        </button>
                      </div>
                    ) : (
                      <label htmlFor="aadhaarCard" className="cursor-pointer text-center block">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="mt-2 text-sm text-gray-600">Click to upload Masked Aadhaar</p>
                        <p className="text-xs text-gray-500">PDF preferred (or JPG/PNG). Max 5MB</p>
                        <p className="text-xs text-pink-600 mt-1">The PDF contains both front and back pages</p>
                      </label>
                    )}
                  </div>
                  {errors.aadhaarCard && <p className="mt-1 text-sm text-red-600">❌ {errors.aadhaarCard}</p>}
                  {errors.aadhaarCard_warning && (
                    <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded">
                      <p className="text-xs text-orange-700">⚠️ {errors.aadhaarCard_warning}</p>
                    </div>
                  )}
                  
                  {/* Validation Status */}
                  {formData.aadhaarCard && documentValidation.aadhaarCard.status !== 'pending' && (
                    <div className={`mt-2 p-3 rounded-lg border ${
                      documentValidation.aadhaarCard.status === 'validating' ? 'bg-blue-50 border-blue-200' :
                      documentValidation.aadhaarCard.status === 'valid' ? 'bg-green-50 border-green-200' :
                      documentValidation.aadhaarCard.status === 'warning' ? 'bg-orange-50 border-orange-200' :
                      'bg-red-50 border-red-200'
                    }`}>
                      <div className="flex items-start gap-2">
                        <div className="flex-shrink-0 mt-0.5">
                          {documentValidation.aadhaarCard.status === 'validating' && (
                            <svg className="animate-spin h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          )}
                          {documentValidation.aadhaarCard.status === 'valid' && (
                            <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                          {documentValidation.aadhaarCard.status === 'warning' && (
                            <svg className="h-5 w-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          )}
                          {documentValidation.aadhaarCard.status === 'invalid' && (
                            <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                        </div>
                        <p className={`text-xs font-medium ${
                          documentValidation.aadhaarCard.status === 'validating' ? 'text-blue-800' :
                          documentValidation.aadhaarCard.status === 'valid' ? 'text-green-800' :
                          documentValidation.aadhaarCard.status === 'warning' ? 'text-orange-800' :
                          'text-red-800'
                        }`}>
                          {documentValidation.aadhaarCard.message}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Photo ID Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Photo ID (College ID/Passport/Driving License) *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-pink-400 transition-colors">
                    <input
                      type="file"
                      id="photoId"
                      accept="image/jpeg,image/jpg,image/png,application/pdf"
                      onChange={(e) => handleDocumentUpload(e, 'photoId')}
                      className="hidden"
                    />
                    {formData.photoId ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-center">
                          <svg className="h-12 w-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-700 font-medium">{formData.photoId.name}</p>
                          <p className="text-xs text-gray-500">{(formData.photoId.size / 1024).toFixed(2)} KB</p>
                        </div>
                        
                        {/* Document Preview */}
                        {documentPreviews.photoId && (
                          <div className="mt-3 border border-gray-200 rounded-lg p-3 bg-gray-50">
                            <p className="text-xs font-semibold text-gray-700 mb-2">📄 Preview:</p>
                            {formData.photoId.type === 'application/pdf' ? (
                              <div className="flex items-center justify-center bg-white border border-gray-300 rounded p-6">
                                <div className="text-center">
                                  <svg className="mx-auto h-16 w-16 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                  </svg>
                                  <p className="text-sm text-gray-600 mt-2">PDF Document</p>
                                  <a 
                                    href={documentPreviews.photoId} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-xs text-pink-600 hover:text-pink-700 underline mt-1 inline-block"
                                  >
                                    Open PDF in new tab
                                  </a>
                                </div>
                              </div>
                            ) : (
                              <img 
                                src={documentPreviews.photoId} 
                                alt="Photo ID preview" 
                                className="w-full h-auto rounded border border-gray-300"
                              />
                            )}
                          </div>
                        )}
                        
                        <button
                          type="button"
                          onClick={() => removeDocument('photoId')}
                          className="w-full py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                        >
                          🗑️ Remove Document
                        </button>
                      </div>
                    ) : (
                      <label htmlFor="photoId" className="cursor-pointer text-center block">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="mt-2 text-sm text-gray-600">Click to upload Photo ID</p>
                        <p className="text-xs text-gray-500">JPG, PNG or PDF (Max 5MB)</p>
                      </label>
                    )}
                  </div>
                  {errors.photoId && <p className="mt-1 text-sm text-red-600">❌ {errors.photoId}</p>}
                </div>

                {/* Educational/Employment Document Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Educational/Employment Document <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    <strong>For Students:</strong> College admission letter, student ID, or enrollment certificate<br />
                    <strong>For Working Professionals:</strong> Employee ID card, offer letter, or employment certificate
                  </p>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-pink-400 transition-colors">
                    <input
                      type="file"
                      id="educationalDoc"
                      accept="image/jpeg,image/jpg,image/png,application/pdf"
                      onChange={(e) => handleDocumentUpload(e, 'educationalDoc')}
                      className="hidden"
                    />
                    {formData.educationalDoc ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-center">
                          <svg className="h-12 w-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-700 font-medium">{formData.educationalDoc.name}</p>
                          <p className="text-xs text-gray-500">{(formData.educationalDoc.size / 1024).toFixed(2)} KB</p>
                        </div>
                        
                        {/* Document Preview */}
                        {documentPreviews.educationalDoc && (
                          <div className="mt-3 border border-gray-200 rounded-lg p-3 bg-gray-50">
                            <p className="text-xs font-semibold text-gray-700 mb-2">📄 Preview:</p>
                            {formData.educationalDoc.type === 'application/pdf' ? (
                              <div className="flex items-center justify-center bg-white border border-gray-300 rounded p-6">
                                <div className="text-center">
                                  <svg className="mx-auto h-16 w-16 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                  </svg>
                                  <p className="text-sm text-gray-600 mt-2">PDF Document</p>
                                  <a 
                                    href={documentPreviews.educationalDoc} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-xs text-pink-600 hover:text-pink-700 underline mt-1 inline-block"
                                  >
                                    Open PDF in new tab
                                  </a>
                                </div>
                              </div>
                            ) : (
                              <img 
                                src={documentPreviews.educationalDoc} 
                                alt="Educational/Employment document preview" 
                                className="w-full h-auto rounded border border-gray-300"
                              />
                            )}
                          </div>
                        )}
                        
                        <button
                          type="button"
                          onClick={() => removeDocument('educationalDoc')}
                          className="w-full py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                        >
                          🗑️ Remove Document
                        </button>
                      </div>
                    ) : (
                      <label htmlFor="educationalDoc" className="cursor-pointer text-center block">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="mt-2 text-sm text-gray-600">Click to upload document</p>
                        <p className="text-xs text-gray-500">JPG, PNG or PDF (Max 5MB)</p>
                      </label>
                    )}
                  </div>
                  {errors.educationalDoc && <p className="mt-1 text-sm text-red-600">❌ {errors.educationalDoc}</p>}
                </div>

                {/* Validation Warning */}
                <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-xs text-orange-800">
                        ⚠️ <strong>Important:</strong> You cannot proceed to the next step if your Aadhaar document fails validation. Please ensure you upload a valid Masked Aadhaar PDF.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Security Note */}
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-blue-700">
                        🔒 <strong>Your documents are secure:</strong> All uploaded documents will be encrypted and stored securely in our database. Only authorized hostel administrators can access them for verification purposes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Profile Picture & Terms */}
            {step === 6 && (
              <div className="space-y-5">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Final Steps</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Picture (Optional)
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        {formData.profilePicture ? (
                          <img 
                            src={URL.createObjectURL(formData.profilePicture)} 
                            alt="Profile" 
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <input
                        type="file"
                        id="profilePicture"
                        accept="image/jpeg,image/jpg,image/png"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="profilePicture"
                        className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                      >
                        <svg className="h-5 w-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Choose Photo
                      </label>
                      <p className="mt-2 text-xs text-gray-500">JPG, JPEG or PNG. Max 2MB.</p>
                      {errors.profilePicture && <p className="mt-1 text-sm text-red-600">{errors.profilePicture}</p>}
                    </div>
                  </div>
                </div>

                <div className="border-t pt-5">
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="agreeToRules"
                          name="agreeToRules"
                          type="checkbox"
                          checked={formData.agreeToRules}
                          onChange={handleChange}
                          className={`h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded ${errors.agreeToRules ? 'border-red-300' : ''}`}
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="agreeToRules" className="font-medium text-gray-700">
                          I agree to the{' '}
                          <a href="/hostel-rules" target="_blank" className="text-pink-600 hover:text-pink-500">
                            hostel rules and regulations
                          </a>
                        </label>
                        {errors.agreeToRules && <p className="mt-1 text-sm text-red-600">{errors.agreeToRules}</p>}
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="agreeToPrivacy"
                          name="agreeToPrivacy"
                          type="checkbox"
                          checked={formData.agreeToPrivacy}
                          onChange={handleChange}
                          className={`h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded ${errors.agreeToPrivacy ? 'border-red-300' : ''}`}
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="agreeToPrivacy" className="font-medium text-gray-700">
                          I agree to the{' '}
                          <a href="/privacy-policy" target="_blank" className="text-pink-600 hover:text-pink-500">
                            privacy policy
                          </a>
                        </label>
                        {errors.agreeToPrivacy && <p className="mt-1 text-sm text-red-600">{errors.agreeToPrivacy}</p>}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-4 border border-pink-200">
                  <div className="flex items-start">
                    <svg className="h-5 w-5 text-pink-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="ml-3 text-sm text-gray-700">
                      Your profile information helps our AI Virtual Warden provide personalized assistance and helps us match you with compatible roommates.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Error */}
            {errors.submit && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-3">
                <p className="text-sm text-red-600">{errors.submit}</p>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition duration-150"
                >
                  <svg className="inline h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
              ) : (
                <div></div>
              )}

              {step < totalSteps ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition duration-150"
                >
                  Next
                  <svg className="inline h-5 w-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin inline h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Completing...
                    </>
                  ) : (
                    <>
                      Complete Profile
                      <svg className="inline h-5 w-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center text-sm text-gray-500">
          Need help? <a href="/contact" className="text-pink-600 hover:text-pink-500">Contact Support</a>
        </div>
      </div>
    </div>
    </>
  );
}
