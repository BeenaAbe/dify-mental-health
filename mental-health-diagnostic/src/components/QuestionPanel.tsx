import React, { useState } from 'react';
import { useAssessmentStore } from '../stores/assessmentStore';

interface QuestionPanelProps {
  // Keep existing props for backward compatibility, but use store as primary source
  selectedAnswer?: string | number;
  onAnswerSelect?: (value: string | number) => void;
  onObservationAdd?: (observation: string, category: string) => void;
  onNextQuestion?: () => void;
}

const QuestionPanel: React.FC<QuestionPanelProps> = ({
  // These props are now optional fallbacks
}) => {
  const [observationText, setObservationText] = useState('');

  // Use Zustand store for state management
  const {
    currentQuestion,
    selectedAnswer: storeSelectedAnswer,
    clinicalObservations,
    submitAnswer,
    nextQuestion,
    addClinicalObservation,
    removeClinicalObservation,
    sessionMetrics
  } = useAssessmentStore();

  const selectedAnswer = storeSelectedAnswer;

  const quickObservations = [
    "Patient appears agitated and restless",
    "Observed visible hand tremors",
    "Patient became tearful when discussing family",
    "Noticed poor eye contact and withdrawn behavior",
    "Patient appears disheveled and has poor hygiene",
    "Observed hypervigilance and startle response",
    "Patient exhibited rapid, pressured speech"
  ];

  const handleAnswerSelect = (value: string | number) => {
    if (!currentQuestion) return;
    
    const selectedOption = currentQuestion.options.find(opt => opt.value === value);
    if (selectedOption) {
      submitAnswer(value, selectedOption.text, selectedOption.points);
    }
  };

  const handleAddObservation = () => {
    if (observationText.trim()) {
      addClinicalObservation(observationText.trim(), 'behavioral');
      setObservationText('');
    }
  };

  const handleQuickObservationToggle = (observation: string) => {
    const existingObs = clinicalObservations.find(obs => obs.text === observation);
    if (existingObs) {
      removeClinicalObservation(existingObs.id);
    } else {
      addClinicalObservation(observation, 'behavioral');
    }
  };

  const handleRemoveObservation = (observationId: string) => {
    removeClinicalObservation(observationId);
  };

  const handleNextQuestion = () => {
    nextQuestion();
  };

  // If no current question, show loading or completion message
  if (!currentQuestion) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-medium text-gray-900 mb-2">Assessment Complete</div>
          <div className="text-sm text-gray-600">Preparing your results...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 h-full">
      {/* Assessment Category Header */}
      <div className="border-l-4 border-blue-600 bg-blue-50 px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">
            {currentQuestion.category.charAt(0).toUpperCase() + currentQuestion.category.slice(1).replace('-', ' ')} Assessment
          </h2>
          {sessionMetrics && (
            <div className="text-sm text-blue-600">
              Question {sessionMetrics.questionsCompleted + 1} of {sessionMetrics.totalQuestions}
            </div>
          )}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Selected Clinical Observations - At the Top */}
        {clinicalObservations.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-blue-800">
                Selected Clinical Observations ({clinicalObservations.length})
              </h3>
              <div className="text-xs text-blue-600">
                Active observations affecting diagnostic analysis
              </div>
            </div>
            <div className="space-y-2">
              {clinicalObservations.map((observation) => (
                <div
                  key={observation.id}
                  className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-blue-200"
                >
                  <span className="text-sm text-gray-800 flex-1">
                    {observation.text}
                  </span>
                  <button
                    onClick={() => handleRemoveObservation(observation.id)}
                    className="ml-2 text-red-500 hover:text-red-700 focus:outline-none"
                    title="Remove observation"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Question */}
        <div>
          <h3 className="text-xl font-medium text-gray-900 mb-4">
            {currentQuestion.text}
          </h3>

          {/* Answer Options */}
          <div className="space-y-2">
            {currentQuestion.options.map((option) => (
              <label
                key={option.value}
                className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedAnswer === option.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="question-answer"
                  value={option.value}
                  checked={selectedAnswer === option.value}
                  onChange={() => handleAnswerSelect(option.value)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 mr-4"
                />
                <span className="text-gray-900 font-medium flex-1">
                  {option.text}
                </span>
                <span className="text-gray-500 text-sm">
                  ({option.points} points)
                </span>
              </label>
            ))}
          </div>

          {/* Selection prompt or Next button */}
          <div className="mt-4">
            {selectedAnswer === undefined ? (
              <p className="text-gray-600 text-sm italic">
                Please select an option to continue.
              </p>
            ) : (
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  {sessionMetrics && (
                    <span>Progress: {sessionMetrics.completionPercentage}% complete</span>
                  )}
                </div>
                <button
                  onClick={handleNextQuestion}
                  className="flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {sessionMetrics && sessionMetrics.questionsCompleted + 1 >= sessionMetrics.totalQuestions ? 'Complete Assessment' : 'Next Question'}
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Clinical Observations Section */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Clinical Observations
          </h3>

          {/* Quick Select Clinical Findings */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Quick Select Clinical Findings:
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {quickObservations.map((obs, index) => {
                const isSelected = clinicalObservations.some(observation => observation.text === obs);
                return (
                  <button
                    key={index}
                    onClick={() => handleQuickObservationToggle(obs)}
                    className={`px-4 py-3 text-sm font-medium rounded-full transition-colors duration-200 ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    }`}
                  >
                    {obs}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Observation Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter Clinical Observations:
            </label>
            <div className="flex gap-2">
              <textarea
                value={observationText}
                onChange={(e) => setObservationText(e.target.value)}
                placeholder="Enter clinical observations (e.g., 'Patient exhibited hand tremors', 'Observed tearfulness during interview', 'Reports hearing voices')"
                className="flex-1 min-h-[80px] px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                rows={3}
              />
              <button
                onClick={handleAddObservation}
                disabled={!observationText.trim()}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Add
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Press Enter to add observation, or Shift+Enter for new line
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionPanel; 