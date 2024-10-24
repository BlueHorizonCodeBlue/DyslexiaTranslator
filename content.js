// Store original styles to allow toggling
let originalStyles = new Map();

function applyDyslexiaFriendlyStyles(enabled, settings = {}) {
  const elements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a, li, td, th, div');
  
  elements.forEach(element => {
    if (enabled) {
      // Store original styles if not already stored
      if (!originalStyles.has(element)) {
        originalStyles.set(element, {
          font: element.style.font,
          fontSize: element.style.fontSize,
          lineHeight: element.style.lineHeight,
          letterSpacing: element.style.letterSpacing
        });
      }
      
      // Apply dyslexia-friendly styles
      element.style.fontFamily = 'OpenDyslexic, Arial, sans-serif';
      element.style.fontSize = `${settings.fontSize || 16}px`;
      element.style.lineHeight = settings.lineSpacing || '1.5';
      element.style.letterSpacing = '0.5px';
    } else {
      // Restore original styles
      const originalStyle = originalStyles.get(element);
      if (originalStyle) {
        element.style.font = originalStyle.font;
        element.style.fontSize = originalStyle.fontSize;
        element.style.lineHeight = originalStyle.lineHeight;
        element.style.letterSpacing = originalStyle.letterSpacing;
      }
    }
  });
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggle') {
    applyDyslexiaFriendlyStyles(request.enabled, {
      fontSize: request.fontSize,
      lineSpacing: request.lineSpacing
    });
    sendResponse({success: true});
  }
});

// Check for stored settings on page load
chrome.storage.sync.get(['enabled', 'fontSize', 'lineSpacing'], function(data) {
  if (data.enabled) {
    applyDyslexiaFriendlyStyles(true, {
      fontSize: data.fontSize,
      lineSpacing: data.lineSpacing
    });
  }
});
