import { useEffect } from 'react';

export function useKeyboardNavigation(callbacks) {
  useEffect(() => {
    const handleKeyPress = (event) => {
      // Prevent default for navigation keys
      if (['ArrowLeft', 'ArrowRight', 'Space', 'Enter'].includes(event.code)) {
        event.preventDefault();
      }

      switch (event.code) {
        case 'ArrowLeft':
        case 'KeyA':
          callbacks.onPrevPage?.();
          break;
        case 'ArrowRight':
        case 'KeyD':
        case 'Space':
          callbacks.onNextPage?.();
          break;
        case 'Escape':
          callbacks.onClose?.();
          break;
        case 'KeyF':
          callbacks.onToggleFullscreen?.();
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [callbacks]);
}