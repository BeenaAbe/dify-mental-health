import React from 'react';
import Header from './Header';
import QuestionPanel from './QuestionPanel';
import AssessmentPanel from './AssessmentPanel';
import RiskAlert from './RiskAlert';
import { useAssessmentStore } from '../stores/assessmentStore';
import type { PatientInfo } from '../types';
import { Gender, AssessmentType } from '../types';

interface AssessmentDemoProps {
  patientInfo?: PatientInfo | null;
  onBackToIntake?: () => void;
}

const AssessmentDemo: React.FC<AssessmentDemoProps> = ({ 
  patientInfo, 
  onBackToIntake 
}) => {
  // Use Zustand store for state management
  const {
    uiState,
    sessionMetrics,
    riskAlerts,
    suicideRiskLevel,
    setShowRiskAlert
  } = useAssessmentStore();

  const handleRiskAlertAcknowledge = (alertId: string) => {
    console.log('Alert acknowledged:', alertId);
    setShowRiskAlert(false);
  };

  const handleRiskAlertDismiss = (alertId: string) => {
    console.log('Alert dismissed:', alertId);
    setShowRiskAlert(false);
  };

  const handleEmergencyAction = () => {
    console.log('Emergency action triggered');
    alert('Emergency protocols activated. Contact emergency services immediately.');
  };

  // Use provided patient info or store patient info
  const currentPatientInfo = patientInfo || useAssessmentStore.getState().patientInfo || {
    initials: "A.W.",
    age: 22,
    gender: Gender.FEMALE,
    primaryConcern: "Feeling sad or depressed",
    assessmentType: AssessmentType.COMPREHENSIVE
  };

  // Calculate progress from store
  const progressPercent = sessionMetrics ? sessionMetrics.completionPercentage : 0;
  
  // Calculate time remaining (this could be enhanced with actual timer)
  const timeRemaining = "23:48"; // This could come from store's timeRemaining state

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fef2f2' }}>
      {/* Header */}
      <Header 
        patientInfo={currentPatientInfo}
        progressPercent={progressPercent}
        timeRemaining={timeRemaining}
      />

      {/* Risk Alert - Show if there are active risk alerts */}
      {(uiState.showRiskAlert && riskAlerts.length > 0) && (
        <div className="max-w-full px-6 mt-6">
          <RiskAlert 
            onAcknowledge={handleRiskAlertAcknowledge}
            onDismiss={handleRiskAlertDismiss}
            onEmergencyAction={handleEmergencyAction}
          />
        </div>
      )}

      {/* Main Assessment Layout - 70/30 Split */}
      <main className="max-w-full px-6 py-6">
        <div className="flex gap-6 h-[calc(100vh-200px)]">
          {/* Left Panel - Question Panel (70% width) */}
          <div className="flex-[0_0_70%]">
            <QuestionPanel />
          </div>

          {/* Right Panel - Assessment Panel (30% width) */}
          <div className="flex-[0_0_30%]">
            <AssessmentPanel showSuicideRisk={suicideRiskLevel !== 'low'} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AssessmentDemo; 