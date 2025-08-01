import React, { useEffect } from 'react';
import PatientIntake from './components/PatientIntake';
import AssessmentDemo from './components/AssessmentDemo';
import Results from './components/Results';
import { useAssessmentStore } from './stores/assessmentStore';

function App() {
  const { 
    uiState, 
    patientInfo, 
    assessmentComplete,
    startAssessment, 
    resetAssessment,
    setCurrentView 
  } = useAssessmentStore();

  const currentView = uiState.currentView;

  const handleStartAssessment = (info: any) => {
    startAssessment(info);
  };

  const handleStartNewAssessment = () => {
    resetAssessment();
  };

  const handleReturnToDashboard = () => {
    resetAssessment();
  };

  // Auto-navigate to results when assessment is complete
  useEffect(() => {
    if (assessmentComplete && currentView !== 'results') {
      setCurrentView('results');
    }
  }, [assessmentComplete, currentView, setCurrentView]);

  const showResultsDemo = () => {
    setCurrentView('results');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'intake':
        return (
          <div>
            <PatientIntake onStartAssessment={handleStartAssessment} />
            {/* Demo button to view results */}
            <div className="fixed bottom-4 right-4">
              <button
                onClick={showResultsDemo}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
              >
                View Results Demo
              </button>
            </div>
          </div>
        );
      case 'assessment':
        return (
          <AssessmentDemo 
            patientInfo={patientInfo} 
            onBackToIntake={() => setCurrentView('intake')}
          />
        );
      case 'results':
        return (
          <Results 
            patientInfo={patientInfo || undefined}
            onStartNewAssessment={handleStartNewAssessment}
            onReturnToDashboard={handleReturnToDashboard}
          />
        );
      default:
        return <PatientIntake onStartAssessment={handleStartAssessment} />;
    }
  };

  return (
    <div className="App">
      {renderCurrentView()}
      </div>
  );
}

export default App;
