import React from 'react';
import type { RiskAlert as RiskAlertType } from '../types';
import { RiskLevel } from '../types';

interface RiskAlertProps {
  alert?: RiskAlertType;
  onAcknowledge?: (alertId: string) => void;
  onDismiss?: (alertId: string) => void;
  onEmergencyAction?: () => void;
}

const RiskAlert: React.FC<RiskAlertProps> = ({
  alert = {
    id: "alert-001",
    type: 'suicide-risk' as const,
    level: RiskLevel.CRITICAL,
    message: "HIGH SUICIDE RISK DETECTED - Immediate intervention required",
    requiresAction: true,
    timestamp: new Date(),
    priority: 'emergency',
    emergencyContact: true,
    recommendedActions: [
      "Do not leave patient unattended",
      "Contact emergency services if immediate danger",
      "Assess means and intent",
      "Consider involuntary hold if necessary",
      "Contact supervising clinician immediately"
    ],
    details: "Patient endorsed active suicidal ideation with plan and means. Score indicates high risk for self-harm."
  },
  onAcknowledge = () => {},
  onDismiss = () => {},
  onEmergencyAction = () => {}
}) => {
  const getLevelStyles = (level: RiskLevel) => {
    switch (level) {
      case RiskLevel.CRITICAL:
        return {
          container: 'bg-danger-600 border-danger-700',
          text: 'text-white',
          button: 'bg-white text-danger-600 hover:bg-danger-50',
          icon: 'text-white'
        };
      case RiskLevel.HIGH:
        return {
          container: 'bg-danger-500 border-danger-600',
          text: 'text-white',
          button: 'bg-white text-danger-500 hover:bg-danger-50',
          icon: 'text-white'
        };
      case RiskLevel.MODERATE:
        return {
          container: 'bg-warning-500 border-warning-600',
          text: 'text-white',
          button: 'bg-white text-warning-600 hover:bg-warning-50',
          icon: 'text-white'
        };
      default:
        return {
          container: 'bg-primary-500 border-primary-600',
          text: 'text-white',
          button: 'bg-white text-primary-600 hover:bg-primary-50',
          icon: 'text-white'
        };
    }
  };

  const styles = getLevelStyles(alert.level);

  if (alert.level === RiskLevel.LOW) return null;

  return (
    <div className={`${styles.container} border-2 rounded-medical-lg shadow-medical-xl mb-6 overflow-hidden animate-pulse-medical`}>
      {/* Alert Header */}
      <div className="flex items-center justify-between p-4 border-b border-current border-opacity-20">
        <div className="flex items-center">
          {/* Alert Icon */}
          <div className="mr-4">
            {alert.level === RiskLevel.CRITICAL ? (
              <svg className={`w-8 h-8 ${styles.icon} animate-pulse`} fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L1 21h22L12 2zm0 3.27L19.5 19h-15L12 5.27zM11 10v4h2v-4h-2zm0 6v2h2v-2h-2z"/>
              </svg>
            ) : (
              <svg className={`w-8 h-8 ${styles.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            )}
          </div>

          {/* Alert Content */}
          <div>
            <h2 className={`text-xl font-bold ${styles.text} mb-1`}>
              {alert.type.toUpperCase().replace('-', ' ')} - {alert.level.toUpperCase()} PRIORITY
            </h2>
            <p className={`text-lg ${styles.text} font-medium`}>
              {alert.message}
            </p>
            {alert.details && (
              <p className={`${styles.text} opacity-90 mt-1`}>
                {alert.details}
              </p>
            )}
          </div>
        </div>

        {/* Timestamp */}
        <div className={`text-right ${styles.text} opacity-75`}>
          <div className="text-sm font-medium">
            {alert.timestamp.toLocaleTimeString()}
          </div>
          <div className="text-xs">
            {alert.timestamp.toLocaleDateString()}
          </div>
        </div>
      </div>

             {/* Emergency Actions */}
       {alert.level === RiskLevel.CRITICAL && (
        <div className="bg-black bg-opacity-20 p-4 border-b border-current border-opacity-20">
          <h3 className={`text-lg font-bold ${styles.text} mb-3 flex items-center`}>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            IMMEDIATE ACTIONS REQUIRED
          </h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className={`font-semibold ${styles.text} mb-2`}>Emergency Protocols:</h4>
              <ul className={`space-y-1 ${styles.text} text-sm`}>
                {alert.recommendedActions?.map((action, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2 font-bold">•</span>
                    {action}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className={`font-semibold ${styles.text} mb-2`}>Emergency Contacts:</h4>
              <div className={`space-y-2 ${styles.text} text-sm`}>
                <div>National Suicide Prevention Lifeline: 988</div>
                <div>Crisis Text Line: Text HOME to 741741</div>
                <div>Emergency Services: 911</div>
                <div>Facility Security: Ext. 5555</div>
              </div>
            </div>
          </div>
        </div>
      )}

             {/* Recommended Actions */}
       {alert.level !== RiskLevel.CRITICAL && alert.recommendedActions && (
        <div className="p-4 border-b border-current border-opacity-20">
          <h3 className={`font-semibold ${styles.text} mb-2`}>Recommended Actions:</h3>
          <ul className={`space-y-1 ${styles.text} text-sm`}>
            {alert.recommendedActions.map((action, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-2">•</span>
                {action}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Buttons */}
      <div className="p-4 flex flex-wrap gap-3">
        {alert.emergencyContact && (
          <button
            onClick={onEmergencyAction}
            className="btn-medical bg-white text-danger-600 hover:bg-danger-50 border-2 border-white font-bold animate-pulse"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            EMERGENCY CONTACT
          </button>
        )}

        <button
          onClick={() => onAcknowledge(alert.id)}
          className={`btn-medical ${styles.button} font-semibold`}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          ACKNOWLEDGE ALERT
        </button>

        <button
          onClick={() => window.print()}
          className={`btn-medical ${styles.button} font-semibold`}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          PRINT PROTOCOL
        </button>

        <button
          onClick={() => onDismiss(alert.id)}
          className={`btn-medical ${styles.button} ml-auto opacity-75 hover:opacity-100`}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          DISMISS
        </button>
      </div>
    </div>
  );
};

export default RiskAlert; 