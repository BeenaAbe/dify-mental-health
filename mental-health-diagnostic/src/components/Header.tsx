import React from 'react';
import type { PatientInfo } from '../types';

interface HeaderProps {
  patientInfo?: PatientInfo;
  progressPercent?: number;
  timeRemaining?: string;
}

const Header: React.FC<HeaderProps> = ({
  patientInfo = {
    initials: "W",
    age: 22,
    gender: 'female' as const,
    primaryConcern: "Feeling sad or depressed",
    assessmentType: 'depression-screening' as const
  },
  progressPercent = 0,
  timeRemaining = "23:48"
}) => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="px-6 py-4">
        {/* Main Header Row */}
        <div className="flex items-center justify-between mb-4">
          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900">
            Mental Health Diagnostic Software
          </h1>

          {/* Time and Progress */}
          <div className="flex items-center space-x-6 text-sm">
            <span className="text-gray-600">
              Time Remaining: <span className="font-semibold text-gray-900">{timeRemaining}</span>
            </span>
            <span className="text-gray-600">
              Progress: <span className="font-semibold text-gray-900">{progressPercent}%</span>
            </span>
          </div>
        </div>

        {/* Patient Info and Progress Row */}
        <div className="flex items-center justify-between">
          {/* Patient Information */}
          <div className="text-sm text-gray-600">
            <span className="font-medium">Patient:</span> {patientInfo.initials} | 
            <span className="font-medium"> Age:</span> {patientInfo.age} | 
            <span className="font-medium"> Chief Complaint:</span> {patientInfo.primaryConcern}
          </div>

          {/* Progress Bar */}
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-gray-700">{progressPercent}% Complete</span>
            <div className="w-48 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 