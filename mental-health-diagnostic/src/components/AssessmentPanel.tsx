import React from 'react';
import { useAssessmentStore } from '../stores/assessmentStore';
import type { DiagnosisProbability } from '../types';

interface AssessmentPanelProps {
  diagnoses?: DiagnosisProbability[];
  supportingEvidence?: Array<{
    category: string;
    score: number;
    maxScore: number;
    findings: string[];
  }>;
  showSuicideRisk?: boolean;
}

const AssessmentPanel: React.FC<AssessmentPanelProps> = ({
  showSuicideRisk = true
}) => {
  // Use Zustand store for real-time data
  const {
    currentProbabilities,
    supportingEvidence,
    suicideRiskLevel,
    riskAlerts
  } = useAssessmentStore();

  // Use store data instead of props
  const diagnoses = currentProbabilities;

  const getColorClasses = (color: string) => {
    const colorMap = {
      red: 'bg-red-500',
      orange: 'bg-orange-500',
      purple: 'bg-purple-500',
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      yellow: 'bg-yellow-500'
    };
    return colorMap[color as keyof typeof colorMap] || 'bg-gray-500';
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

  const getRiskMessage = (level: string) => {
    switch(level) {
      case 'high':
      case 'critical':
        return "Immediate intervention required - Safety planning essential";
      case 'moderate':
        return "Enhanced monitoring and safety planning recommended";
      case 'low':
        return "Standard care with routine risk monitoring";
      default:
        return "Risk level being assessed";
    }
  };

  return (
    <div className="space-y-4">
      {/* Suicide Risk Alert */}
      {(showSuicideRisk && suicideRiskLevel !== 'low') && (
        <div className={`text-white rounded-lg p-4 ${getRiskLevelColor(suicideRiskLevel)}`}>
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold">
                {suicideRiskLevel.toUpperCase()} SUICIDE RISK
              </h3>
              <p className="text-sm">{getRiskMessage(suicideRiskLevel)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Assessment Panel */}
      <div className="bg-white rounded-lg border border-gray-200 h-full">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Real-Time Probability Assessment
          </h2>
        </div>

        <div className="p-6 space-y-6">
          {/* Diagnoses List */}
          <div className="space-y-4">
            {diagnoses.length > 0 ? (
              diagnoses.map((diagnosis, index) => (
                <div key={diagnosis.diagnosis}>
                  {/* Diagnosis Header */}
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-medium text-gray-900">
                      {diagnosis.diagnosis}
                    </h3>
                    <div className="text-right">
                      <span className="text-lg font-bold text-gray-900">
                        {diagnosis.probability}%
                      </span>
                      <span className="text-sm text-gray-500 ml-1">
                        ± {Math.round((diagnosis.confidenceRange.upper - diagnosis.confidenceRange.lower) / 2)}%
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className={`h-full rounded-full transition-all duration-700 ease-out ${getColorClasses(diagnosis.color)}`}
                      style={{ width: `${Math.max(diagnosis.probability, 5)}%` }}
                    ></div>
                  </div>

                  {/* Range indicator */}
                  <div className="text-xs text-gray-500">
                    Range: {diagnosis.confidenceRange.lower}% - {diagnosis.confidenceRange.upper}%
                  </div>

                  {/* Supporting Symptoms */}
                  {diagnosis.supportingSymptoms && diagnosis.supportingSymptoms.length > 0 && (
                    <div className="mt-2">
                      <div className="text-xs text-gray-600 mb-1">Supporting Evidence:</div>
                      <div className="text-xs text-gray-500">
                        {diagnosis.supportingSymptoms.slice(0, 2).join(", ")}
                        {diagnosis.supportingSymptoms.length > 2 && "..."}
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">Assessment in progress...</p>
                <p className="text-xs mt-1">Probabilities will appear as questions are answered</p>
              </div>
            )}
          </div>

          {/* Supporting Evidence */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Supporting Evidence
            </h3>
            
            <div className="space-y-3">
              {supportingEvidence.map((evidence, index) => {
                const percentage = evidence.maxScore > 0 ? Math.round((evidence.score / evidence.maxScore) * 100) : 0;
                const severity = percentage >= 70 ? 'severe' : 
                               percentage >= 40 ? 'moderate' : 
                               percentage >= 20 ? 'mild' : 'minimal';
                
                const colorClass = percentage >= 70 ? 'bg-red-50 border-red-200' :
                                 percentage >= 40 ? 'bg-orange-50 border-orange-200' :
                                 percentage >= 20 ? 'bg-yellow-50 border-yellow-200' :
                                 'bg-green-50 border-green-200';
                
                const textColorClass = percentage >= 70 ? 'text-red-800' :
                                     percentage >= 40 ? 'text-orange-800' :
                                     percentage >= 20 ? 'text-yellow-800' :
                                     'text-green-800';

                return (
                  <div key={index} className={`flex items-center justify-between p-3 rounded-lg border ${colorClass}`}>
                    <span className={`text-sm font-medium ${textColorClass}`}>
                      {evidence.category}:
                    </span>
                    <div className="text-right">
                      <div className={`text-sm ${textColorClass}`}>
                        Score: <span className="font-semibold">{evidence.score}</span>/{evidence.maxScore} ({severity})
                      </div>
                      {evidence.findings.length > 0 && (
                        <div className="text-xs text-gray-600 mt-1">
                          {evidence.findings.length} findings recorded
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              
              {supportingEvidence.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  <p className="text-sm">No evidence recorded yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentPanel; 