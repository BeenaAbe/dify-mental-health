/**
 * Mental Health Diagnostic Tool - TypeScript Interface Definitions
 * 
 * This file contains all the core type definitions for the mental health
 * diagnostic application, ensuring type safety and proper data structure
 * throughout the application.
 */

// ============================================================================
// ENUMS AND CONSTANTS
// ============================================================================

/**
 * Gender options for patient information
 */
export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  NON_BINARY = 'non-binary',
  PREFER_NOT_TO_SAY = 'prefer-not-to-say',
  OTHER = 'other'
}

/**
 * Types of mental health assessments available
 */
export enum AssessmentType {
  DEPRESSION_SCREENING = 'depression-screening',
  ANXIETY_ASSESSMENT = 'anxiety-assessment',
  BIPOLAR_SCREENING = 'bipolar-screening',
  PTSD_ASSESSMENT = 'ptsd-assessment',
  GENERAL_WELLNESS = 'general-wellness',
  COMPREHENSIVE = 'comprehensive',
  FOLLOW_UP = 'follow-up'
}

/**
 * Categories for grouping questions by mental health domain
 */
export enum QuestionCategory {
  MOOD = 'mood',
  ANXIETY = 'anxiety',
  SLEEP = 'sleep',
  ENERGY = 'energy',
  CONCENTRATION = 'concentration',
  APPETITE = 'appetite',
  SOCIAL_FUNCTIONING = 'social-functioning',
  TRAUMA = 'trauma',
  SUBSTANCE_USE = 'substance-use',
  SELF_HARM = 'self-harm',
  PSYCHOSIS = 'psychosis',
  MANIA = 'mania',
  GENERAL = 'general'
}

/**
 * Types of question formats
 */
export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple-choice',
  RATING_SCALE = 'rating-scale',
  YES_NO = 'yes-no',
  TEXT_INPUT = 'text-input',
  SLIDER = 'slider',
  CHECKBOX = 'checkbox'
}

/**
 * Risk levels for clinical alerts
 */
export enum RiskLevel {
  LOW = 'low',
  MODERATE = 'moderate',
  HIGH = 'high',
  CRITICAL = 'critical'
}

/**
 * Types of risk alerts
 */
export enum RiskAlertType {
  SUICIDE_RISK = 'suicide-risk',
  SELF_HARM = 'self-harm',
  SUBSTANCE_ABUSE = 'substance-abuse',
  PSYCHOSIS = 'psychosis',
  SEVERE_DEPRESSION = 'severe-depression',
  PANIC_DISORDER = 'panic-disorder',
  IMMEDIATE_DANGER = 'immediate-danger'
}

/**
 * Assessment session status
 */
export enum SessionStatus {
  NOT_STARTED = 'not-started',
  IN_PROGRESS = 'in-progress',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  EXPIRED = 'expired',
  TERMINATED = 'terminated'
}

// ============================================================================
// CORE INTERFACES
// ============================================================================

/**
 * Patient demographic and basic information
 * 
 * Contains essential patient data needed for assessment context
 * while maintaining privacy and HIPAA compliance
 */
export interface PatientInfo {
  /** Patient initials for identification (e.g., "J.D.") */
  initials: string;
  
  /** Patient age in years */
  age: number;
  
  /** Patient gender identity */
  gender: Gender;
  
  /** Primary mental health concern or reason for assessment */
  primaryConcern: string;
  
  /** Type of assessment being conducted */
  assessmentType: AssessmentType;
  
  /** Optional additional demographic information */
  ethnicity?: string;
  
  /** Optional occupation information */
  occupation?: string;
  
  /** Optional relationship status */
  relationshipStatus?: 'single' | 'married' | 'divorced' | 'widowed' | 'partnered' | 'other';
  
  /** Whether patient has history of mental health treatment */
  previousTreatment?: boolean;
  
  /** Current medications (anonymized) */
  currentMedications?: string[];
  
  /** Emergency contact initials (if provided) */
  emergencyContactInitials?: string;
}

/**
 * Individual question within an assessment
 * 
 * Represents a single diagnostic question with all necessary
 * metadata for proper administration and scoring
 */
export interface Question {
  /** Unique identifier for the question */
  id: string;
  
  /** The question text displayed to the patient */
  text: string;
  
  /** Mental health category this question assesses */
  category: QuestionCategory;
  
  /** Type of question format */
  type: QuestionType;
  
  /** Available response options */
  options: QuestionOption[];
  
  /** Whether this question is required to complete the assessment */
  required: boolean;
  
  /** Order/sequence number in the assessment */
  order: number;
  
  /** Optional additional instructions or context */
  instructions?: string;
  
  /** Optional follow-up questions based on responses */
  followUpQuestions?: string[];
  
  /** Weight/importance of this question in scoring */
  weight?: number;
  
  /** Minimum score possible for this question */
  minScore?: number;
  
  /** Maximum score possible for this question */
  maxScore?: number;
  
  /** Whether this question can trigger a risk alert */
  riskIndicator?: boolean;
  
  /** Time limit for answering (in seconds) */
  timeLimit?: number;
}

/**
 * Individual response option for a question
 * 
 * Represents each possible answer choice with associated
 * scoring and clinical significance
 */
export interface QuestionOption {
  /** Unique value identifier for this option */
  value: string | number;
  
  /** Display text for this option */
  text: string;
  
  /** Clinical score associated with selecting this option */
  score: number;
  
  /** Points awarded for assessment scoring */
  points: number;
  
  /** Whether selecting this option indicates clinical significance */
  clinicallySignificant?: boolean;
  
  /** Whether this option should trigger a risk alert */
  triggersAlert?: boolean;
  
  /** Risk level associated with this option */
  riskLevel?: RiskLevel;
  
  /** Additional metadata for clinical interpretation */
  metadata?: {
    severity?: 'minimal' | 'mild' | 'moderate' | 'severe';
    frequency?: 'never' | 'rarely' | 'sometimes' | 'often' | 'always';
    intensity?: 'low' | 'medium' | 'high';
  };
}

/**
 * Diagnosis probability and confidence metrics
 * 
 * Represents the likelihood of a specific mental health
 * diagnosis based on assessment responses
 */
export interface DiagnosisProbability {
  /** Name/code of the potential diagnosis */
  diagnosis: string;
  
  /** Probability percentage (0-100) */
  probability: number;
  
  /** Confidence interval for the probability */
  confidenceRange: {
    lower: number;
    upper: number;
  };
  
  /** Clinical range classification */
  range: 'minimal' | 'mild' | 'moderate' | 'severe' | 'critical';
  
  /** Color coding for UI display */
  color: 'green' | 'yellow' | 'orange' | 'red' | 'purple';
  
  /** Detailed description of the diagnosis */
  description?: string;
  
  /** Associated symptoms that led to this probability */
  supportingSymptoms?: string[];
  
  /** Recommended next steps or interventions */
  recommendations?: string[];
  
  /** Clinical criteria met for this diagnosis */
  criteriaMet?: string[];
  
  /** Standard diagnostic code (ICD-10, DSM-5) */
  diagnosticCode?: string;
  
  /** Reliability score of this prediction */
  reliabilityScore?: number;
}

/**
 * Clinical observation or note
 * 
 * Represents observations made during the assessment
 * process for clinical review and documentation
 */
export interface ClinicalObservation {
  /** Unique identifier for the observation */
  id: string;
  
  /** Observation text content */
  text: string;
  
  /** Timestamp when observation was made */
  timestamp: Date;
  
  /** Category of the observation */
  category: QuestionCategory | 'behavioral' | 'cognitive' | 'emotional' | 'physical';
  
  /** Severity level of the observed issue */
  severity?: 'low' | 'moderate' | 'high' | 'critical';
  
  /** Whether this observation requires immediate attention */
  urgent?: boolean;
  
  /** Source of the observation */
  source: 'patient-response' | 'behavioral-analysis' | 'clinical-algorithm' | 'manual-entry';
  
  /** Associated question ID if observation stems from specific response */
  questionId?: string;
  
  /** Tags for categorization and searching */
  tags?: string[];
  
  /** Follow-up actions required */
  followUpRequired?: boolean;
  
  /** Clinician notes or additional context */
  clinicianNotes?: string;
}

/**
 * Risk alert for immediate clinical attention
 * 
 * Represents urgent clinical situations that require
 * immediate intervention or escalation
 */
export interface RiskAlert {
  /** Unique identifier for the alert */
  id: string;
  
  /** Type of risk identified */
  type: RiskAlertType;
  
  /** Severity level of the risk */
  level: RiskLevel;
  
  /** Alert message for clinical staff */
  message: string;
  
  /** Whether immediate action is required */
  requiresAction: boolean;
  
  /** Timestamp when alert was triggered */
  timestamp: Date;
  
  /** Specific responses that triggered this alert */
  triggerResponses?: {
    questionId: string;
    response: string | number;
    score: number;
  }[];
  
  /** Recommended immediate actions */
  recommendedActions?: string[];
  
  /** Priority level for triage */
  priority: 'low' | 'medium' | 'high' | 'emergency';
  
  /** Whether emergency services should be contacted */
  emergencyContact?: boolean;
  
  /** Additional context or details */
  details?: string;
  
  /** Whether alert has been acknowledged by clinician */
  acknowledged?: boolean;
  
  /** Timestamp when alert was acknowledged */
  acknowledgedAt?: Date;
  
  /** Clinician who acknowledged the alert */
  acknowledgedBy?: string;
  
  /** Resolution status of the alert */
  resolved?: boolean;
  
  /** Resolution notes */
  resolutionNotes?: string;
}

/**
 * Current assessment session state
 * 
 * Tracks the complete state of an ongoing or completed
 * mental health assessment session
 */
export interface AssessmentSession {
  /** Unique session identifier */
  sessionId: string;
  
  /** Patient information for this session */
  patientInfo: PatientInfo;
  
  /** Current progress through the assessment */
  progress: {
    /** Total number of questions in assessment */
    totalQuestions: number;
    
    /** Number of questions completed */
    completedQuestions: number;
    
    /** Percentage completion (0-100) */
    percentComplete: number;
    
    /** Current question index */
    currentQuestionIndex: number;
  };
  
  /** Time remaining for the session (in minutes) */
  timeRemaining?: number;
  
  /** Currently active question */
  currentQuestion?: Question;
  
  /** Session status */
  status: SessionStatus;
  
  /** Session start timestamp */
  startedAt: Date;
  
  /** Session completion timestamp */
  completedAt?: Date;
  
  /** Last activity timestamp */
  lastActivityAt: Date;
  
  /** All responses collected during this session */
  responses: AssessmentResponse[];
  
  /** Clinical observations made during session */
  observations: ClinicalObservation[];
  
  /** Risk alerts triggered during session */
  riskAlerts: RiskAlert[];
  
  /** Current diagnosis probabilities */
  diagnosisProbabilities: DiagnosisProbability[];
  
  /** Total session duration (in minutes) */
  duration?: number;
  
  /** Assessment version/template used */
  assessmentVersion: string;
  
  /** Session metadata */
  metadata: {
    /** Device/platform used for assessment */
    device?: string;
    
    /** Browser information */
    browser?: string;
    
    /** IP address (anonymized) */
    ipAddress?: string;
    
    /** Session quality metrics */
    qualityMetrics?: {
      responseTime: number;
      pauseDuration: number;
      retryCount: number;
    };
  };
  
  /** Whether session data has been backed up */
  backedUp?: boolean;
  
  /** Whether session is eligible for analysis */
  analysisReady?: boolean;
}

/**
 * Individual response to an assessment question
 * 
 * Captures patient responses with metadata for analysis
 */
export interface AssessmentResponse {
  /** Unique identifier for this response */
  id: string;
  
  /** Question that was answered */
  questionId: string;
  
  /** Selected answer value */
  answer: string | number | string[];
  
  /** Score assigned to this response */
  score: number;
  
  /** Timestamp when response was submitted */
  timestamp: Date;
  
  /** Time taken to answer (in seconds) */
  responseTime: number;
  
  /** Whether response was changed before submission */
  revised?: boolean;
  
  /** Number of times response was changed */
  revisionCount?: number;
  
  /** Additional text input (for open-ended questions) */
  textInput?: string;
  
  /** Confidence level of the response */
  confidence?: 'low' | 'medium' | 'high';
  
  /** Whether response triggered any alerts */
  triggeredAlerts?: string[];
}

/**
 * Complete assessment report
 * 
 * Comprehensive report generated after assessment completion
 */
export interface AssessmentReport {
  /** Unique report identifier */
  reportId: string;
  
  /** Associated session information */
  session: AssessmentSession;
  
  /** Summary of assessment results */
  summary: {
    /** Overall severity rating */
    overallSeverity: 'minimal' | 'mild' | 'moderate' | 'severe' | 'critical';
    
    /** Primary diagnosis suggestions */
    primaryDiagnoses: DiagnosisProbability[];
    
    /** Secondary diagnosis possibilities */
    secondaryDiagnoses: DiagnosisProbability[];
    
    /** Key clinical observations */
    keyFindings: string[];
    
    /** Risk assessment summary */
    riskSummary: {
      level: RiskLevel;
      factors: string[];
      recommendations: string[];
    };
  };
  
  /** Detailed analysis by category */
  categoryAnalysis: {
    [key in QuestionCategory]?: {
      score: number;
      severity: string;
      findings: string[];
    };
  };
  
  /** Clinical recommendations */
  recommendations: {
    /** Immediate actions needed */
    immediate: string[];
    
    /** Short-term recommendations */
    shortTerm: string[];
    
    /** Long-term care suggestions */
    longTerm: string[];
    
    /** Referral recommendations */
    referrals: string[];
  };
  
  /** Report generation timestamp */
  generatedAt: Date;
  
  /** Report version */
  version: string;
  
  /** Whether report has been reviewed by clinician */
  clinicallyReviewed?: boolean;
  
  /** Clinician review notes */
  reviewNotes?: string;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * API Response wrapper for consistent error handling
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: Date;
}

/**
 * Pagination parameters for list endpoints
 */
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

/**
 * Filter options for assessment queries
 */
export interface AssessmentFilters {
  assessmentType?: AssessmentType;
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
  riskLevel?: RiskLevel;
  status?: SessionStatus;
  ageRange?: {
    min: number;
    max: number;
  };
  gender?: Gender;
}

// ============================================================================
// EXPORT ALL TYPES
// ============================================================================

export type {
  PatientInfo,
  Question,
  QuestionOption,
  DiagnosisProbability,
  ClinicalObservation,
  RiskAlert,
  AssessmentSession,
  AssessmentResponse,
  AssessmentReport,
  ApiResponse,
  PaginationParams,
  PaginatedResponse,
  AssessmentFilters
}; 