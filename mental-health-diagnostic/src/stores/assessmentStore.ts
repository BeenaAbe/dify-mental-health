import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { 
  PatientInfo, 
  Question, 
  QuestionOption, 
  DiagnosisProbability, 
  ClinicalObservation, 
  RiskAlert, 
  AssessmentSession 
} from '../types';
import { Gender, AssessmentType, QuestionType, QuestionCategory, RiskLevel } from '../types';

// Extended interfaces for store-specific data
interface AnswerHistory {
  questionId: string;
  questionText: string;
  selectedAnswer: string | number;
  answerText: string;
  points: number;
  timestamp: Date;
  category: QuestionCategory;
}

interface SessionMetrics {
  sessionId: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // in seconds
  questionsCompleted: number;
  totalQuestions: number;
  completionPercentage: number;
}

interface ProbabilityUpdate {
  diagnosis: string;
  probability: number;
  confidenceRange: { lower: number; upper: number };
  supportingFactors: string[];
  timestamp: Date;
}

interface UIState {
  isLoading: boolean;
  error: string | null;
  currentView: 'intake' | 'assessment' | 'results';
  showRiskAlert: boolean;
  showCompletionDialog: boolean;
  formValidationErrors: Record<string, string>;
}

// Main store interface
interface AssessmentStore {
  // Patient State
  patientInfo: PatientInfo | null;
  sessionMetrics: SessionMetrics | null;
  currentStep: number;
  totalSteps: number;
  timeRemaining: number; // in seconds
  
  // Question Flow State
  currentQuestion: Question | null;
  questionIndex: number;
  answerHistory: AnswerHistory[];
  availableQuestions: Question[];
  selectedAnswer: string | number | undefined;
  
  // Real-Time Probability Assessment
  currentProbabilities: DiagnosisProbability[];
  probabilityHistory: ProbabilityUpdate[];
  supportingEvidence: Array<{
    category: string;
    score: number;
    maxScore: number;
    findings: string[];
  }>;
  
  // Clinical Observations
  clinicalObservations: ClinicalObservation[];
  observationCategories: string[];
  
  // Risk Assessment
  suicideRiskLevel: RiskLevel;
  riskFlags: string[];
  emergencyProtocolTriggered: boolean;
  riskAlerts: RiskAlert[];
  
  // Assessment Results
  finalDiagnoses: DiagnosisProbability[];
  assessmentComplete: boolean;
  resultsReady: boolean;
  
  // UI State
  uiState: UIState;
  
  // Actions
  startAssessment: (patientInfo: PatientInfo) => void;
  submitAnswer: (answer: string | number, answerText: string, points: number) => void;
  addClinicalObservation: (observation: string, category: string) => void;
  removeClinicalObservation: (observationId: string) => void;
  updateRiskAssessment: (riskLevel: RiskLevel, flags?: string[]) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  completeAssessment: () => void;
  resetAssessment: () => void;
  
  // UI Actions
  setCurrentView: (view: 'intake' | 'assessment' | 'results') => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setShowRiskAlert: (show: boolean) => void;
  clearValidationErrors: () => void;
  
  // Timer Actions
  startTimer: () => void;
  pauseTimer: () => void;
  updateTimer: () => void;
}

// Mock questions data
const mockQuestions: Question[] = [
  {
    id: "phq9-1",
    text: "Over the last 2 weeks, how often have you been bothered by little interest or pleasure in doing things?",
    category: QuestionCategory.MOOD,
    type: QuestionType.RATING_SCALE,
    options: [
      { value: 0, text: "Not at all", score: 0, points: 0 },
      { value: 1, text: "Several days", score: 1, points: 1 },
      { value: 2, text: "More than half the days", score: 2, points: 2 },
      { value: 3, text: "Nearly every day", score: 3, points: 3 }
    ],
    required: true,
    order: 1
  },
  {
    id: "phq9-2", 
    text: "Over the last 2 weeks, how often have you been bothered by feeling down, depressed, or hopeless?",
    category: QuestionCategory.MOOD,
    type: QuestionType.RATING_SCALE,
    options: [
      { value: 0, text: "Not at all", score: 0, points: 0 },
      { value: 1, text: "Several days", score: 1, points: 1 },
      { value: 2, text: "More than half the days", score: 2, points: 2 },
      { value: 3, text: "Nearly every day", score: 3, points: 3 }
    ],
    required: true,
    order: 2
  },
  {
    id: "gad7-1",
    text: "Over the last 2 weeks, how often have you been bothered by feeling nervous, anxious, or on edge?",
    category: QuestionCategory.ANXIETY,
    type: QuestionType.RATING_SCALE,
    options: [
      { value: 0, text: "Not at all", score: 0, points: 0 },
      { value: 1, text: "Several days", score: 1, points: 1 },
      { value: 2, text: "More than half the days", score: 2, points: 2 },
      { value: 3, text: "Nearly every day", score: 3, points: 3 }
    ],
    required: true,
    order: 3
  },
  {
    id: "suicide-risk-1",
    text: "Over the past 2 weeks, have you had thoughts that you would be better off dead or of hurting yourself?",
    category: QuestionCategory.SELF_HARM,
    type: QuestionType.YES_NO,
    options: [
      { value: 0, text: "Not at all", score: 0, points: 0 },
      { value: 1, text: "Several days", score: 1, points: 1 },
      { value: 2, text: "More than half the days", score: 2, points: 2 },
      { value: 3, text: "Nearly every day", score: 3, points: 3 }
    ],
    required: true,
    order: 4
  }
];

// Initial probability states
const initialProbabilities: DiagnosisProbability[] = [
  {
    diagnosis: "Major Depressive Disorder",
    probability: 0,
    confidenceRange: { lower: 0, upper: 5 },
    range: "minimal",
    color: "red",
    description: "Persistent sadness, loss of interest, and significant functional impairment",
    supportingSymptoms: []
  },
  {
    diagnosis: "Generalized Anxiety Disorder", 
    probability: 0,
    confidenceRange: { lower: 0, upper: 5 },
    range: "minimal",
    color: "orange",
    description: "Excessive worry and anxiety about multiple life areas",
    supportingSymptoms: []
  },
  {
    diagnosis: "Post-Traumatic Stress Disorder",
    probability: 0,
    confidenceRange: { lower: 0, upper: 5 },
    range: "minimal",
    color: "purple",
    description: "Trauma-related stress symptoms",
    supportingSymptoms: []
  }
];

export const useAssessmentStore = create<AssessmentStore>()(
  devtools(
    (set, get) => ({
      // Initial State
      patientInfo: null,
      sessionMetrics: null,
      currentStep: 0,
      totalSteps: mockQuestions.length,
      timeRemaining: 1800, // 30 minutes in seconds
      
      currentQuestion: null,
      questionIndex: 0,
      answerHistory: [],
      availableQuestions: mockQuestions,
      selectedAnswer: undefined,
      
      currentProbabilities: initialProbabilities,
      probabilityHistory: [],
      supportingEvidence: [
        { category: "Depression", score: 0, maxScore: 27, findings: [] },
        { category: "Anxiety", score: 0, maxScore: 21, findings: [] },
        { category: "PTSD", score: 0, maxScore: 80, findings: [] }
      ],
      
      clinicalObservations: [],
      observationCategories: [
        "Behavioral", 
        "Emotional", 
        "Cognitive", 
        "Physical", 
        "Social", 
        "Speech/Language"
      ],
      
      suicideRiskLevel: 'low',
      riskFlags: [],
      emergencyProtocolTriggered: false,
      riskAlerts: [],
      
      finalDiagnoses: [],
      assessmentComplete: false,
      resultsReady: false,
      
      uiState: {
        isLoading: false,
        error: null,
        currentView: 'intake',
        showRiskAlert: false,
        showCompletionDialog: false,
        formValidationErrors: {}
      },
      
      // Actions Implementation
      startAssessment: (patientInfo: PatientInfo) => {
        const sessionId = `MHD-${Date.now().toString(36).toUpperCase()}`;
        const startTime = new Date();
        
        set({
          patientInfo,
          sessionMetrics: {
            sessionId,
            startTime,
            duration: 0,
            questionsCompleted: 0,
            totalQuestions: mockQuestions.length,
            completionPercentage: 0
          },
          currentQuestion: mockQuestions[0] || null,
          questionIndex: 0,
          currentStep: 1,
          timeRemaining: 1800,
          answerHistory: [],
          currentProbabilities: [...initialProbabilities],
          clinicalObservations: [],
          assessmentComplete: false,
          resultsReady: false,
          uiState: {
            ...get().uiState,
            currentView: 'assessment',
            isLoading: false,
            error: null
          }
        });
      },

      submitAnswer: (answer: string | number, answerText: string, points: number) => {
        const state = get();
        const currentQuestion = state.currentQuestion;
        
        if (!currentQuestion) return;

        // Add to answer history
        const answerRecord: AnswerHistory = {
          questionId: currentQuestion.id,
          questionText: currentQuestion.text,
          selectedAnswer: answer,
          answerText,
          points,
          timestamp: new Date(),
          category: currentQuestion.category
        };

        // Update probabilities based on answer
        const updatedProbabilities = state.currentProbabilities.map(diagnosis => {
          let probabilityIncrease = 0;
          let newSupportingSymptoms = [...diagnosis.supportingSymptoms];

          // Simple probability calculation based on question category and points
          if (currentQuestion.category === QuestionCategory.MOOD && diagnosis.diagnosis.includes("Depression")) {
            probabilityIncrease = points * 8; // Each point increases depression probability
            if (points > 0) {
              newSupportingSymptoms.push(currentQuestion.text.substring(0, 50) + "...");
            }
          } else if (currentQuestion.category === QuestionCategory.ANXIETY && diagnosis.diagnosis.includes("Anxiety")) {
            probabilityIncrease = points * 6;
            if (points > 0) {
              newSupportingSymptoms.push(currentQuestion.text.substring(0, 50) + "...");
            }
                     } else if (currentQuestion.category === QuestionCategory.SELF_HARM && points > 1) {
            // Handle suicide risk
                         setTimeout(() => {
               get().updateRiskAssessment(points >= 3 ? RiskLevel.HIGH : RiskLevel.MODERATE, ['Suicidal ideation reported']);
             }, 100);
          }

                     const newProbability = Math.min(diagnosis.probability + probabilityIncrease, 100);
           const range: 'minimal' | 'mild' | 'moderate' | 'severe' | 'critical' = 
                        newProbability >= 70 ? "severe" : 
                        newProbability >= 40 ? "moderate" : 
                        newProbability >= 20 ? "mild" : "minimal";

          return {
            ...diagnosis,
            probability: newProbability,
            confidenceRange: {
              lower: Math.max(0, newProbability - 10),
              upper: Math.min(100, newProbability + 10)
            },
            range,
            supportingSymptoms: [...new Set(newSupportingSymptoms)] // Remove duplicates
          };
        });

        // Update supporting evidence scores
        const updatedEvidence = state.supportingEvidence.map(evidence => {
          if (evidence.category === "Depression" && currentQuestion.category === QuestionCategory.MOOD) {
            return {
              ...evidence,
              score: evidence.score + points,
              findings: points > 0 ? [...evidence.findings, answerText] : evidence.findings
            };
          } else if (evidence.category === "Anxiety" && currentQuestion.category === QuestionCategory.ANXIETY) {
            return {
              ...evidence,
              score: evidence.score + points,
              findings: points > 0 ? [...evidence.findings, answerText] : evidence.findings
            };
          }
          return evidence;
        });

        // Update session metrics
        const questionsCompleted = state.sessionMetrics ? state.sessionMetrics.questionsCompleted + 1 : 1;
        const totalQuestions = state.sessionMetrics ? state.sessionMetrics.totalQuestions : state.availableQuestions.length;
        const completionPercentage = Math.min(Math.round((questionsCompleted / totalQuestions) * 100), 100);
        
        const updatedMetrics = state.sessionMetrics ? {
          ...state.sessionMetrics,
          questionsCompleted,
          completionPercentage
        } : null;

        set({
          answerHistory: [...state.answerHistory, answerRecord],
          currentProbabilities: updatedProbabilities,
          supportingEvidence: updatedEvidence,
          sessionMetrics: updatedMetrics,
          selectedAnswer: answer
        });

        // Auto-complete assessment if this was the last question
        if (questionsCompleted >= totalQuestions) {
          setTimeout(() => {
            get().completeAssessment();
          }, 1000); // Small delay for smooth UX
        }
      },

      nextQuestion: () => {
        const state = get();
        const nextIndex = state.questionIndex + 1;
        
        if (nextIndex < state.availableQuestions.length) {
          set({
            questionIndex: nextIndex,
            currentQuestion: state.availableQuestions[nextIndex],
            currentStep: nextIndex + 1,
            selectedAnswer: undefined
          });
        } else {
          // Assessment complete
          get().completeAssessment();
        }
      },

      previousQuestion: () => {
        const state = get();
        const prevIndex = Math.max(0, state.questionIndex - 1);
        
        set({
          questionIndex: prevIndex,
          currentQuestion: state.availableQuestions[prevIndex],
          currentStep: prevIndex + 1,
          selectedAnswer: undefined
        });
      },

      addClinicalObservation: (observation: string, category: string) => {
        const state = get();
                 const newObservation: ClinicalObservation = {
           id: `obs-${Date.now()}`,
           text: observation,
           category: category as QuestionCategory | 'behavioral' | 'cognitive' | 'emotional' | 'physical',
           timestamp: new Date(),
           severity: 'moderate', // Default severity
           source: 'manual-entry'
         };

        set({
          clinicalObservations: [...state.clinicalObservations, newObservation]
        });
      },

      removeClinicalObservation: (observationId: string) => {
        const state = get();
        set({
          clinicalObservations: state.clinicalObservations.filter(obs => obs.id !== observationId)
        });
      },

      updateRiskAssessment: (riskLevel: 'low' | 'moderate' | 'high', flags: string[] = []) => {
        const state = get();
        
        // Create risk alert if risk level is moderate or high
        let newRiskAlerts = [...state.riskAlerts];
        if (riskLevel !== 'low') {
          const riskAlert: RiskAlert = {
            id: `risk-${Date.now()}`,
            level: riskLevel,
            message: riskLevel === 'high' 
              ? "HIGH SUICIDE RISK ALERT - Immediate Safety Assessment Required"
              : "Moderate Suicide Risk - Enhanced Monitoring Recommended",
            timestamp: new Date(),
            acknowledged: false,
            actions: riskLevel === 'high' 
              ? ["Contact emergency services", "Immediate safety planning", "Continuous supervision"]
              : ["Safety planning", "Regular check-ins", "Monitor closely"]
          };
          newRiskAlerts.push(riskAlert);
        }

        set({
          suicideRiskLevel: riskLevel,
                     riskFlags: [...new Set([...state.riskFlags, ...(flags || [])])],
          emergencyProtocolTriggered: riskLevel === 'high',
          riskAlerts: newRiskAlerts,
          uiState: {
            ...state.uiState,
            showRiskAlert: riskLevel !== 'low'
          }
        });
      },

      completeAssessment: () => {
        const state = get();
        const endTime = new Date();
        const duration = state.sessionMetrics ? 
          Math.floor((endTime.getTime() - state.sessionMetrics.startTime.getTime()) / 1000) : 0;

        // Finalize diagnoses
        const finalDiagnoses = state.currentProbabilities
          .filter(diagnosis => diagnosis.probability > 0)
          .sort((a, b) => b.probability - a.probability);

        set({
          finalDiagnoses,
          assessmentComplete: true,
          resultsReady: true,
          sessionMetrics: state.sessionMetrics ? {
            ...state.sessionMetrics,
            endTime,
            duration,
            completionPercentage: 100
          } : null,
          uiState: {
            ...state.uiState,
            currentView: 'results',
            showCompletionDialog: true
          }
        });
      },

      resetAssessment: () => {
        set({
          patientInfo: null,
          sessionMetrics: null,
          currentStep: 0,
          timeRemaining: 1800,
          currentQuestion: null,
          questionIndex: 0,
          answerHistory: [],
          selectedAnswer: undefined,
          currentProbabilities: [...initialProbabilities],
          probabilityHistory: [],
          supportingEvidence: [
            { category: "Depression", score: 0, maxScore: 27, findings: [] },
            { category: "Anxiety", score: 0, maxScore: 21, findings: [] },
            { category: "PTSD", score: 0, maxScore: 80, findings: [] }
          ],
          clinicalObservations: [],
          suicideRiskLevel: RiskLevel.LOW,
          riskFlags: [],
          emergencyProtocolTriggered: false,
          riskAlerts: [],
          finalDiagnoses: [],
          assessmentComplete: false,
          resultsReady: false,
          uiState: {
            isLoading: false,
            error: null,
            currentView: 'intake',
            showRiskAlert: false,
            showCompletionDialog: false,
            formValidationErrors: {}
          }
        });
      },

      // UI Actions
      setCurrentView: (view: 'intake' | 'assessment' | 'results') => {
        set(state => ({
          uiState: { ...state.uiState, currentView: view }
        }));
      },

      setLoading: (loading: boolean) => {
        set(state => ({
          uiState: { ...state.uiState, isLoading: loading }
        }));
      },

      setError: (error: string | null) => {
        set(state => ({
          uiState: { ...state.uiState, error }
        }));
      },

      setShowRiskAlert: (show: boolean) => {
        set(state => ({
          uiState: { ...state.uiState, showRiskAlert: show }
        }));
      },

      clearValidationErrors: () => {
        set(state => ({
          uiState: { ...state.uiState, formValidationErrors: {} }
        }));
      },

      // Timer Actions
      startTimer: () => {
        // Timer implementation would use setInterval
        // For now, just a placeholder
      },

      pauseTimer: () => {
        // Pause timer implementation
      },

      updateTimer: () => {
        const state = get();
        if (state.timeRemaining > 0) {
          set({ timeRemaining: state.timeRemaining - 1 });
        }
      }
    }),
    {
      name: 'mental-health-assessment-store',
      partialize: (state) => ({
        // Only persist essential data, not UI state
        patientInfo: state.patientInfo,
        answerHistory: state.answerHistory,
        clinicalObservations: state.clinicalObservations,
        sessionMetrics: state.sessionMetrics
      })
    }
  )
); 