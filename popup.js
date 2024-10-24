document.addEventListener('DOMContentLoaded', function() {
    const fontToggle = document.getElementById('fontToggle');
    const fontSize = document.getElementById('fontSize');
    const lineSpacing = document.getElementById('lineSpacing');
    const fontSizeValue = document.getElementById('fontSizeValue');
    const lineSpacingValue = document.getElementById('lineSpacingValue');
  
    // Load saved settings
    chrome.storage.sync.get(['enabled', 'fontSize', 'lineSpacing'], function(data) {
      fontToggle.checked = data.enabled || false;
      fontSize.value = data.fontSize || 16;
      lineSpacing.value = data.lineSpacing || 1.5;
      updateValues();
    });
  
    function updateValues() {
      fontSizeValue.textContent = `${fontSize.value}px`;
      lineSpacingValue.textContent = lineSpacing.value;
    }
  
    function sendSettings() {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'toggle',
          enabled: fontToggle.checked,
          fontSize: fontSize.value,
          lineSpacing: lineSpacing.value
        });
      });
    }
  
    // Event listeners
    fontToggle.addEventListener('change', function() {
      chrome.storage.sync.set({ enabled: this.checked });
      sendSettings();
    });
  
    fontSize.addEventListener('input', function() {
      updateValues();
      chrome.storage.sync.set({ fontSize: this.value });
      sendSettings();
    });
  
    lineSpacing.addEventListener('input', function() {
      updateValues();
      chrome.storage.sync.set({ lineSpacing: this.value });
      sendSettings();
    });
  });
