import React from 'react';
import { useAssessmentStore } from '../stores/assessmentStore';
import type { PatientInfo, DiagnosisProbability } from '../types';
import { Gender, AssessmentType } from '../types';

interface ResultsProps {
  patientInfo?: PatientInfo;
  finalDiagnoses?: DiagnosisProbability[];
  assessmentDuration?: string;
  questionsAnswered?: number;
  totalQuestions?: number;
  clinicalObservations?: string[];
  suicideRiskLevel?: 'low' | 'moderate' | 'high';
  onStartNewAssessment?: () => void;
  onReturnToDashboard?: () => void;
}

const Results: React.FC<ResultsProps> = ({
  onStartNewAssessment = () => {},
  onReturnToDashboard = () => {}
}) => {
  // Use Zustand store for results data
  const {
    patientInfo: storePatientInfo,
    finalDiagnoses: storeFinalDiagnoses,
    sessionMetrics,
    clinicalObservations: storeClinicalObservations,
    suicideRiskLevel: storeSuicideRiskLevel,
    supportingEvidence,
    resetAssessment
  } = useAssessmentStore();

  // Use store data as primary source
  const patientInfo = storePatientInfo || {
    initials: "A.W.",
    age: 22,
    gender: Gender.FEMALE,
    primaryConcern: "Feeling sad or depressed",
    assessmentType: AssessmentType.COMPREHENSIVE
  };

  const finalDiagnoses = storeFinalDiagnoses.length > 0 ? storeFinalDiagnoses : [
    {
      diagnosis: "Major Depressive Disorder",
      probability: 78,
      confidenceRange: { lower: 65, upper: 87 },
      range: "moderate-severe" as const,
      color: "red" as const,
      description: "Persistent sadness, loss of interest, and significant functional impairment",
      supportingSymptoms: ["Anhedonia", "Depressed mood", "Sleep disturbance", "Concentration difficulties"]
    }
  ];

  const assessmentDuration = sessionMetrics ? 
    `${Math.floor(sessionMetrics.duration / 60)}:${(sessionMetrics.duration % 60).toString().padStart(2, '0')}` : 
    "24:32";
  
  const questionsAnswered = sessionMetrics ? sessionMetrics.questionsCompleted : 15;
  const totalQuestions = sessionMetrics ? sessionMetrics.totalQuestions : 15;
  
  const clinicalObservations = storeClinicalObservations.map(obs => obs.text);
  const suicideRiskLevel = storeSuicideRiskLevel;

  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const primaryDiagnosis = finalDiagnoses[0];
  const secondaryDiagnoses = finalDiagnoses.slice(1);

  const getSeverityColor = (probability: number) => {
    if (probability >= 70) return 'text-red-600 bg-red-50 border-red-200';
    if (probability >= 40) return 'text-orange-600 bg-orange-50 border-orange-200';
    if (probability >= 20) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  const getRiskLevelColor = (level: string) => {
    switch(level) {
      case 'high': 
      case 'critical':
        return 'bg-red-600 text-white';
      case 'moderate': 
        return 'bg-orange-500 text-white';
      case 'low': 
        return 'bg-green-500 text-white';
      default: 
        return 'bg-gray-500 text-white';
    }
  };

  const getRecommendations = () => {
    const recommendations = [];
    
    if (primaryDiagnosis.probability >= 70) {
      recommendations.push("Immediate psychiatric evaluation recommended");
      recommendations.push("Consider combination therapy (psychotherapy + medication)");
    } else if (primaryDiagnosis.probability >= 40) {
      recommendations.push("Structured psychotherapy recommended");
      recommendations.push("Consider medication evaluation if symptoms persist");
    } else {
      recommendations.push("Supportive counseling and monitoring");
      recommendations.push("Lifestyle interventions and stress management");
    }

    if (suicideRiskLevel === 'high' || suicideRiskLevel === 'critical') {
      recommendations.unshift("IMMEDIATE safety planning required");
      recommendations.unshift("24-hour crisis intervention assessment");
    } else if (suicideRiskLevel === 'moderate') {
      recommendations.push("Safety planning and regular check-ins");
    }

    return recommendations;
  };

  const handleStartNewAssessment = () => {
    resetAssessment();
    onStartNewAssessment();
  };

  const handleReturnToDashboard = () => {
    resetAssessment(); 
    onReturnToDashboard();
  };

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#fef2f2' }}>
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Assessment Results</h1>
              <p className="text-gray-600 mt-1">Comprehensive Mental Health Diagnostic Report</p>
            </div>
            <div className="text-right text-sm text-gray-500">
              <p>Report Generated: {currentDate}</p>
              <p>Assessment ID: {sessionMetrics ? sessionMetrics.sessionId : `MHD-${Date.now().toString().slice(-6)}`}</p>
            </div>
          </div>
        </div>

        {/* Patient Information & Assessment Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Patient Information</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Patient Initials:</span>
                <span className="font-medium">{patientInfo.initials}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Age:</span>
                <span className="font-medium">{patientInfo.age} years</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Gender:</span>
                <span className="font-medium capitalize">{patientInfo.gender}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Primary Concern:</span>
                <span className="font-medium">{patientInfo.primaryConcern}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Assessment Type:</span>
                <span className="font-medium">{patientInfo.assessmentType.replace('-', ' ')}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Assessment Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Questions Completed:</span>
                <span className="font-medium">{questionsAnswered}/{totalQuestions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Assessment Duration:</span>
                <span className="font-medium">{assessmentDuration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Completion Rate:</span>
                <span className="font-medium">{Math.round((questionsAnswered / totalQuestions) * 100)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Clinical Observations:</span>
                <span className="font-medium">{clinicalObservations.length} recorded</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Completed:</span>
                <span className="font-medium">{currentDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Primary Diagnosis */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Primary Diagnosis</h2>
          <div className={`p-4 rounded-lg border-2 ${getSeverityColor(primaryDiagnosis.probability)}`}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">{primaryDiagnosis.diagnosis}</h3>
              <div className="text-right">
                <span className="text-2xl font-bold">{primaryDiagnosis.probability}%</span>
                <span className="text-sm ml-1">confidence</span>
              </div>
            </div>
            <p className="text-sm mb-3">{primaryDiagnosis.description}</p>
            <div className="w-full bg-white bg-opacity-50 rounded-full h-3">
              <div 
                className="h-full rounded-full bg-current opacity-60"
                style={{ width: `${primaryDiagnosis.probability}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs mt-1">
              <span>Confidence Range: {primaryDiagnosis.confidenceRange.lower}% - {primaryDiagnosis.confidenceRange.upper}%</span>
              <span className="font-medium">{primaryDiagnosis.range}</span>
            </div>
          </div>
        </div>

        {/* Secondary Diagnoses */}
        {secondaryDiagnoses.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Differential Diagnoses</h2>
            <div className="space-y-3">
              {secondaryDiagnoses.map((diagnosis, index) => (
                <div key={index} className={`p-3 rounded-lg border ${getSeverityColor(diagnosis.probability)}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{diagnosis.diagnosis}</h4>
                    <span className="text-lg font-semibold">{diagnosis.probability}%</span>
                  </div>
                  <div className="w-full bg-white bg-opacity-50 rounded-full h-2">
                    <div 
                      className="h-full rounded-full bg-current opacity-60"
                      style={{ width: `${diagnosis.probability}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span>{diagnosis.confidenceRange.lower}% - {diagnosis.confidenceRange.upper}%</span>
                    <span>{diagnosis.range}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Risk Assessment */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Risk Assessment</h2>
          <div className="flex items-center space-x-4">
            <div className={`px-4 py-2 rounded-lg font-semibold ${getRiskLevelColor(suicideRiskLevel)}`}>
              {suicideRiskLevel.toUpperCase()} SUICIDE RISK
            </div>
            <div className="text-sm text-gray-600">
              {suicideRiskLevel === 'high' && "Immediate intervention required - Safety planning essential"}
              {suicideRiskLevel === 'moderate' && "Enhanced monitoring and safety planning recommended"}
              {suicideRiskLevel === 'low' && "Standard care with routine risk monitoring"}
            </div>
          </div>
        </div>

        {/* Clinical Recommendations */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Clinical Recommendations</h2>
          <div className="space-y-2">
            {getRecommendations().map((recommendation, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">{recommendation}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Supporting Evidence */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Supporting Evidence</h2>
          
          {/* Assessment Scores */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Assessment Scores</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {supportingEvidence.map((evidence, index) => {
                const percentage = evidence.maxScore > 0 ? Math.round((evidence.score / evidence.maxScore) * 100) : 0;
                const severity = percentage >= 70 ? 'Severe' : 
                               percentage >= 40 ? 'Moderate' : 
                               percentage >= 20 ? 'Mild' : 'Minimal';
                
                const bgColor = percentage >= 70 ? 'bg-red-50 border-red-200' :
                              percentage >= 40 ? 'bg-orange-50 border-orange-200' :
                              percentage >= 20 ? 'bg-yellow-50 border-yellow-200' :
                              'bg-green-50 border-green-200';
                
                const textColor = percentage >= 70 ? 'text-red-900' :
                                percentage >= 40 ? 'text-orange-900' :
                                percentage >= 20 ? 'text-yellow-900' :
                                'text-green-900';

                return (
                  <div key={index} className={`p-3 border rounded-lg ${bgColor}`}>
                    <div className="text-sm font-medium text-gray-800">{evidence.category}</div>
                    <div className={`text-xl font-bold ${textColor}`}>{evidence.score}</div>
                    <div className="text-xs text-gray-700">{severity}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Clinical Observations */}
          {clinicalObservations.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">Clinical Observations</h3>
              <div className="space-y-2">
                {clinicalObservations.map((observation, index) => (
                  <div key={index} className="flex items-start space-x-3 p-2 bg-gray-50 rounded">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-gray-700">{observation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Export Options */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Report Options</h2>
          <div className="flex flex-wrap gap-4">
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download PDF Report
            </button>
            <button className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print Summary
            </button>
            <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Save to EHR
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex flex-wrap gap-4 justify-center">
            <button 
              onClick={handleStartNewAssessment}
              className="flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Start New Assessment
            </button>
            <button 
              onClick={handleReturnToDashboard}
              className="flex items-center px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              </svg>
              Return to Dashboard
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Results; 