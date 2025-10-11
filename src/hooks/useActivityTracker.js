/**
 * 🔥 HOOK PARA INTEGRAR TRACKING EN COMPONENTES REACT
 * Conecta automáticamente el tracking con los componentes
 */

import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import userActivityTracker from '../services/UserActivityTracker';

export const useActivityTracker = () => {
  const { user } = useAuth();
  const componentMountTime = useRef(Date.now());

  // Establecer usuario cuando cambie
  useEffect(() => {
    if (user) {
      userActivityTracker.setUser(user);
    }
  }, [user]);

  // Tracking methods para componentes
  const trackingMethods = {
    // 🔐 Auth tracking
    trackLogin: (method, success, userData = {}) => {
      userActivityTracker.trackLogin(method, success, userData);
    },

    trackLogout: () => {
      userActivityTracker.trackLogout();
    },

    // 📝 Form tracking
    trackInput: (fieldName, value, step = null) => {
      userActivityTracker.trackFormInput(fieldName, value, step);
    },

    trackStep: (step, completed = false) => {
      userActivityTracker.trackFormStep(step, completed);
    },

    trackSubmission: (formType, success, errorMessage = null) => {
      userActivityTracker.trackFormSubmission(formType, success, errorMessage);
    },

    // 📱 Navigation tracking
    trackPageView: (page, referrer = null) => {
      userActivityTracker.trackPageView(page, referrer);
    },

    trackClick: (buttonType, buttonText, context = null) => {
      userActivityTracker.trackButtonClick(buttonType, buttonText, context);
    },

    // 📷 Media tracking
    trackPhotoUpload: (fileName, fileSize, uploadType) => {
      userActivityTracker.trackPhotoUpload(fileName, fileSize, uploadType);
    },

    // ⚽ FutPro specific
    trackProfile: (actionType, profileData = {}) => {
      userActivityTracker.trackProfileAction(actionType, profileData);
    },

    trackGame: (actionType, gameData = {}) => {
      userActivityTracker.trackGameAction(actionType, gameData);
    },

    trackSocial: (interactionType, targetUser = null) => {
      userActivityTracker.trackSocialInteraction(interactionType, targetUser);
    },

    // 📊 General tracking
    track: (actionType, data = {}, saveImmediate = false) => {
      return userActivityTracker.trackAction(actionType, data, saveImmediate);
    },

    // 📈 Stats
    getStats: () => {
      return userActivityTracker.getStats();
    }
  };

  return trackingMethods;
};

/**
 * 🎯 HOOK PARA TRACKING AUTOMÁTICO DE PÁGINAS
 */
export const usePageTracker = (pageName, additionalData = {}) => {
  const { trackPageView } = useActivityTracker();

  useEffect(() => {
    // Track page view on mount
    trackPageView(pageName, document.referrer);

    // Track page duration on unmount
    const startTime = Date.now();
    return () => {
      const duration = Date.now() - startTime;
      userActivityTracker.trackAction('page_duration', {
        page: pageName,
        duration,
        ...additionalData
      });
    };
  }, [pageName, trackPageView]);
};

/**
 * 📝 HOOK PARA TRACKING AUTOMÁTICO DE FORMULARIOS
 */
export const useFormTracker = (formName, currentStep = null) => {
  const { trackInput, trackStep, trackSubmission } = useActivityTracker();
  const formStartTime = useRef(Date.now());

  // Auto-track cuando cambia el paso
  useEffect(() => {
    if (currentStep !== null) {
      trackStep(currentStep, false);
    }
  }, [currentStep, trackStep]);

  const trackField = (fieldName, value) => {
    trackInput(fieldName, value, currentStep);
  };

  const trackStepComplete = (step) => {
    trackStep(step, true);
  };

  const trackFormSubmit = (success, errorMessage = null) => {
    const duration = Date.now() - formStartTime.current;
    trackSubmission(formName, success, errorMessage);
    
    // Track additional form metrics
    userActivityTracker.trackAction('form_completion_time', {
      formName,
      duration,
      steps: currentStep,
      success
    });
  };

  return {
    trackField,
    trackStepComplete,
    trackFormSubmit
  };
};

/**
 * 📱 HOOK PARA TRACKING DE CLICKS AUTOMÁTICO
 */
export const useClickTracker = () => {
  const { trackClick } = useActivityTracker();

  const trackButtonClick = (event, context = null) => {
    const button = event.target;
    const buttonType = button.type || button.tagName.toLowerCase();
    const buttonText = button.textContent || button.value || button.alt || 'unknown';
    
    trackClick(buttonType, buttonText, context);
  };

  return { trackButtonClick };
};

/**
 * 🖼️ HOOK PARA TRACKING DE UPLOADS
 */
export const useUploadTracker = () => {
  const { trackPhotoUpload } = useActivityTracker();

  const trackUpload = (file, uploadType = 'profile') => {
    if (file) {
      trackPhotoUpload(file.name, file.size, uploadType);
      
      // Track additional upload metrics
      userActivityTracker.trackAction('upload_details', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        uploadType,
        timestamp: new Date().toISOString()
      });
    }
  };

  return { trackUpload };
};

/**
 * 📊 HOOK PARA TRACKING DE SCROLL (COMO TIKTOK)
 */
export const useScrollTracker = (pageName) => {
  useEffect(() => {
    let maxScroll = 0;
    
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      const scrollPercentage = Math.round((scrollTop / (documentHeight - windowHeight)) * 100);
      
      if (scrollPercentage > maxScroll) {
        maxScroll = scrollPercentage;
        userActivityTracker.trackScrollDepth(scrollPercentage, pageName);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pageName]);
};

export default useActivityTracker;