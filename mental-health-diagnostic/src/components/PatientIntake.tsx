import React, { useState } from 'react';
import type { PatientInfo } from '../types';
import { AssessmentType, Gender } from '../types';

interface PatientIntakeProps {
  onStartAssessment: (patientInfo: PatientInfo) => void;
}

const PatientIntake: React.FC<PatientIntakeProps> = ({ onStartAssessment }) => {
  const [formData, setFormData] = useState({
    initials: '',
    age: '',
    gender: '' as Gender | '',
    primaryConcern: '',
    assessmentType: AssessmentType.COMPREHENSIVE
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const primaryConcerns = [
    "Feeling sad or depressed",
    "Anxiety or panic attacks", 
    "Sleep problems",
    "Trauma-related symptoms",
    "Mood swings",
    "Concentration difficulties",
    "Relationship problems",
    "Work-related stress",
    "Hearing voices or unusual experiences",
    "Substance use concerns",
    "Other (please specify)"
  ];

  const handleInputChange = (field: string, value: string | AssessmentType | Gender) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handlePrimaryConcernClick = (concern: string) => {
    setFormData(prev => ({ ...prev, primaryConcern: concern }));
    if (errors.primaryConcern) {
      setErrors(prev => ({ ...prev, primaryConcern: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.initials.trim()) {
      newErrors.initials = 'Patient initials are required';
    }

    if (!formData.age.trim()) {
      newErrors.age = 'Age is required';
    } else if (isNaN(Number(formData.age)) || Number(formData.age) < 1 || Number(formData.age) > 120) {
      newErrors.age = 'Please enter a valid age (1-120)';
    }

    if (!formData.gender) {
      newErrors.gender = 'Please select a gender';
    }

    if (!formData.primaryConcern) {
      newErrors.primaryConcern = 'Please select a primary concern';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const patientInfo: PatientInfo = {
        initials: formData.initials.trim(),
        age: Number(formData.age),
        gender: formData.gender as Gender,
        primaryConcern: formData.primaryConcern,
        assessmentType: formData.assessmentType
      };
      
      onStartAssessment(patientInfo);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: '#fef2f2' }}>
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Mental Health Diagnostic Software</h1>
        </div>

        {/* Main Form */}
        <div className="card-medical">
          <div className="card-medical-header">
            <h2 className="text-xl font-semibold text-gray-800">Patient Information</h2>
          </div>

          <form onSubmit={handleSubmit} className="card-medical-body space-y-6">
            {/* Patient Initials */}
            <div>
              <label className="form-medical-label">
                Patient Initials <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.initials}
                onChange={(e) => handleInputChange('initials', e.target.value)}
                placeholder="e.g., J.D."
                className={`form-medical-input ${errors.initials ? 'border-red-500 focus:ring-red-500' : ''}`}
                maxLength={10}
              />
              {errors.initials && <p className="form-medical-error">{errors.initials}</p>}
            </div>

            {/* Age */}
            <div>
              <label className="form-medical-label">
                Age <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                placeholder="Enter age"
                className={`form-medical-input ${errors.age ? 'border-red-500 focus:ring-red-500' : ''}`}
                min="1"
                max="120"
              />
              {errors.age && <p className="form-medical-error">{errors.age}</p>}
            </div>

            {/* Gender */}
            <div>
              <label className="form-medical-label">Gender</label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                {[Gender.MALE, Gender.FEMALE, Gender.OTHER, Gender.PREFER_NOT_TO_SAY].map((gender) => (
                  <label
                    key={gender}
                    className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      formData.gender === gender
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="gender"
                      value={gender}
                      checked={formData.gender === gender}
                      onChange={(e) => handleInputChange('gender', e.target.value as Gender)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 mr-3"
                    />
                    <span className="medical-body font-medium capitalize">
                      {gender === Gender.PREFER_NOT_TO_SAY ? 'Prefer not to say' : gender.replace('-', ' ')}
                    </span>
                  </label>
                ))}
              </div>
              {errors.gender && <p className="form-medical-error">{errors.gender}</p>}
            </div>

            {/* Primary Concern */}
            <div>
              <label className="form-medical-label">
                Primary Concern <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {primaryConcerns.map((concern) => (
                  <button
                    key={concern}
                    type="button"
                    onClick={() => handlePrimaryConcernClick(concern)}
                    className={`px-4 py-3 text-sm font-medium rounded-full transition-all duration-200 ${
                      formData.primaryConcern === concern
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    }`}
                  >
                    {concern}
                  </button>
                ))}
              </div>
              {errors.primaryConcern && <p className="form-medical-error">{errors.primaryConcern}</p>}
            </div>

            {/* Assessment Type */}
            <div>
              <label className="form-medical-label">Assessment Type</label>
              <div className="space-y-3 mt-2">
                <label
                  className={`flex p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    formData.assessmentType === AssessmentType.COMPREHENSIVE
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="assessmentType"
                    value={AssessmentType.COMPREHENSIVE}
                    checked={formData.assessmentType === AssessmentType.COMPREHENSIVE}
                    onChange={(e) => handleInputChange('assessmentType', e.target.value as AssessmentType)}
                    className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500 mt-1 mr-4"
                  />
                  <div>
                    <div className="font-medium text-gray-800">Comprehensive Assessment</div>
                    <div className="text-sm text-gray-600 mt-1">
                      Full diagnostic evaluation with detailed screening across multiple conditions
                    </div>
                    <div className="flex items-center text-xs text-gray-500 mt-2">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      25-30 minutes
                    </div>
                  </div>
                </label>

                <label
                  className={`flex p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    formData.assessmentType === AssessmentType.FOLLOW_UP
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="assessmentType"
                    value={AssessmentType.FOLLOW_UP}
                    checked={formData.assessmentType === AssessmentType.FOLLOW_UP}
                    onChange={(e) => handleInputChange('assessmentType', e.target.value as AssessmentType)}
                    className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500 mt-1 mr-4"
                  />
                  <div>
                    <div className="font-medium text-gray-800">Focused Assessment</div>
                    <div className="text-sm text-gray-600 mt-1">
                      Targeted screening based on specific concerns and symptoms
                    </div>
                    <div className="flex items-center text-xs text-gray-500 mt-2">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      15-20 minutes
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                className="w-full btn-medical btn-medical-primary text-lg py-4 font-semibold"
              >
                Start Diagnostic Session
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>

            {/* Disclaimer */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                This assessment uses evidence-based screening tools and real-time Bayesian analysis
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PatientIntake; 