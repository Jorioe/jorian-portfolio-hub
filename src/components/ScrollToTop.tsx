import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop component that scrolls the window to the top
 * whenever the location/route changes
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // For older browsers that might not support smooth scrolling
    const scrollToTop = () => {
      try {
        // Modern browsers with smooth scrolling
        window.scrollTo({
          top: 0,
          behavior: 'instant' // Changed to instant for immediate feedback
        });
      } catch (error) {
        // Fallback for older browsers
        window.scrollTo(0, 0);
      }
    };

    // Execute scroll after a small delay to ensure all content is rendered
    const timeoutId = setTimeout(scrollToTop, 0);
    
    return () => clearTimeout(timeoutId);
  }, [pathname]);

  return null; // This component doesn't render anything
};

export default ScrollToTop; 