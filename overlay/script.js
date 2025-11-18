// Utility functions - moved here to prevent scope errors
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
}

function adjustColor(color, amount) {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * amount);
  const R = Math.max(0, Math.min(255, (num >> 16) + amt));
  const G = Math.max(0, Math.min(255, (num >> 8 & 0x00FF) + amt));
  const B = Math.max(0, Math.min(255, (num & 0x0000FF) + amt));
  return `#${(0x1000000 + (R * 0x10000) + (G * 0x100) + B).toString(16).slice(1)}`;
}

function applyUIColors(primary, accent, background, text) {
  // Add custom theme class to body to enable custom styling
  document.body.classList.add('custom-theme');
  
  // Get all settings first before using them
  const cardBackgroundColor = localStorage.getItem('customCardBackground') || adjustColor(background, 15);
  const streamerNameColor = localStorage.getItem('customStreamerNameColor') || accent;
  const websiteColor = localStorage.getItem('customWebsiteColor') || primary;
  const gambleAwareColor = localStorage.getItem('customGambleAwareColor') || '#ff6b6b';
  
  // Glass effect settings - declare these first
  const glassEnabled = localStorage.getItem('glassEffectEnabled') === 'true';
  const glassOpacity = localStorage.getItem('glassOpacity') || '0.3';
  const glassBlur = localStorage.getItem('glassBlur') || '10';
  
  // Sidebar styling
  const sidebar = document.querySelector('.sidebar');
  const sidebarButtons = document.querySelectorAll('.sidebar-btn');
  const sidebarToggle = document.getElementById('sidebar-toggle');
  
  if (sidebar) {
    sidebar.style.background = `linear-gradient(135deg, ${adjustColor(background, 10)} 0%, ${adjustColor(background, -10)} 100%)`;
    sidebar.style.border = `2px solid ${accent}`;
    sidebar.style.boxShadow = `0 8px 32px rgba(${hexToRgb(accent).r}, ${hexToRgb(accent).g}, ${hexToRgb(accent).b}, 0.3)`;
    sidebar.style.backdropFilter = 'none';
  }
  
  if (sidebarToggle) {
    // Hide the square background for custom themes
    sidebarToggle.style.background = 'transparent';
    sidebarToggle.style.border = 'none';
    sidebarToggle.style.boxShadow = 'none';
  }
  
  sidebarButtons.forEach(btn => {
    btn.style.background = `linear-gradient(135deg, ${adjustColor(background, 20)} 0%, ${adjustColor(background, -5)} 100%)`;
    btn.style.borderColor = `rgba(${hexToRgb(accent).r}, ${hexToRgb(accent).g}, ${hexToRgb(accent).b}, 0.3)`;
    btn.style.color = text;
    
    // Active state
    if (btn.classList.contains('active')) {
      btn.style.background = `linear-gradient(135deg, ${primary} 0%, ${adjustColor(primary, -20)} 100%)`;
      btn.style.borderColor = accent;
      btn.style.boxShadow = `0 0 20px rgba(${hexToRgb(accent).r}, ${hexToRgb(accent).g}, ${hexToRgb(accent).b}, 0.5)`;
    }
  });
  
  // Navbar styling with glass effect control
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    if (glassEnabled) {
      navbar.style.background = `rgba(${hexToRgb(adjustColor(background, 10)).r}, ${hexToRgb(adjustColor(background, 10)).g}, ${hexToRgb(adjustColor(background, 10)).b}, ${parseFloat(glassOpacity) + 0.2})`;
    } else {
      navbar.style.background = `rgb(${hexToRgb(adjustColor(background, 10)).r}, ${hexToRgb(adjustColor(background, 10)).g}, ${hexToRgb(adjustColor(background, 10)).b})`;
    }
    navbar.style.borderBottom = `1px solid ${accent}`;
    navbar.style.backdropFilter = 'none';
  }
  
  // Time display styling with glass effect control
  const currentTimeElement = document.getElementById('current-time');
  if (currentTimeElement) {
    if (glassEnabled) {
      currentTimeElement.style.background = `rgba(255, 255, 255, ${parseFloat(glassOpacity) + 0.1})`;
    } else {
      currentTimeElement.style.background = `transparent`;
    }
  }
  
  // Website button styling with glass effect control
  const websiteButton = document.querySelector('.navbar-website-btn');
  if (websiteButton) {
    if (glassEnabled) {
      websiteButton.style.background = `rgba(${hexToRgb(websiteColor).r}, ${hexToRgb(websiteColor).g}, ${hexToRgb(websiteColor).b}, ${parseFloat(glassOpacity) + 0.2})`;
    } else {
      websiteButton.style.background = `rgb(${hexToRgb(websiteColor).r}, ${hexToRgb(websiteColor).g}, ${hexToRgb(websiteColor).b})`;
    }
  }
  
  // Navbar text elements with custom colors
  const streamerName = document.getElementById('streamer-name');
  const websiteBtn = document.querySelector('.navbar-website-btn');
  const websiteText = document.getElementById('website-text');
  const currentTime = document.getElementById('current-time');
  const gambleAwareLink = document.querySelector('.aware-link');
  
  if (streamerName) {
    streamerName.style.color = streamerNameColor || '#ffffff';
    streamerName.style.textShadow = `0 1px 2px rgba(0, 0, 0, 0.7)`;
    streamerName.style.fontWeight = 'bold';
    streamerName.style.filter = 'none';
  }
  if (currentTime) {
    currentTime.style.color = text || '#ffffff';
    currentTime.style.textShadow = `0 1px 2px rgba(0, 0, 0, 0.7)`;
    currentTime.style.filter = 'none';
  }
  if (websiteBtn) {
    websiteBtn.style.background = `linear-gradient(135deg, ${websiteColor} 0%, ${adjustColor(websiteColor, -20)} 100%)`;
    websiteBtn.style.borderColor = accent;
    websiteBtn.style.color = text || '#ffffff';
  }
  if (websiteText) {
    websiteText.style.color = websiteColor || '#ffffff';
    websiteText.style.textShadow = `0 1px 2px rgba(0, 0, 0, 0.7)`;
    websiteText.style.fontWeight = 'bold';
    websiteText.style.filter = 'none';
  }
  if (gambleAwareLink) {
    gambleAwareLink.style.color = gambleAwareColor || '#ffffff';
    gambleAwareLink.style.textShadow = `0 1px 2px rgba(0, 0, 0, 0.7)`;
    gambleAwareLink.style.fontWeight = 'bold';
    gambleAwareLink.style.filter = 'none';
  }
  
  // Apply glass effect to card elements only when enabled
  const cardElements = document.querySelectorAll('.info-section, .bonus-hunt-stat, .slot-card, .slot-highlight-card, .info-panel');
  cardElements.forEach(card => {
    if (glassEnabled) {
      const adjustedOpacity = Math.min(parseFloat(glassOpacity) + 0.3, 0.95);
      card.style.background = `rgba(${hexToRgb(cardBackgroundColor).r}, ${hexToRgb(cardBackgroundColor).g}, ${hexToRgb(cardBackgroundColor).b}, ${adjustedOpacity})`;
      card.style.backdropFilter = 'none';
      card.style.border = `1px solid rgba(${hexToRgb(accent).r}, ${hexToRgb(accent).g}, ${hexToRgb(accent).b}, 0.4)`;
    } else {
      // Solid backgrounds when glass effect is disabled
      card.style.background = `rgb(${hexToRgb(cardBackgroundColor).r}, ${hexToRgb(cardBackgroundColor).g}, ${hexToRgb(cardBackgroundColor).b})`;
      card.style.backdropFilter = 'none';
      card.style.border = `1px solid rgba(${hexToRgb(accent).r}, ${hexToRgb(accent).g}, ${hexToRgb(accent).b}, 0.3)`;
    }
  });
  
  console.log('Applied custom color scheme to all UI elements');
}

function applyColorScheme(primary, accent, background, text) {
  const root = document.documentElement;
  root.style.setProperty('--primary-color', primary);
  root.style.setProperty('--accent-color', accent);
  root.style.setProperty('--background-color', background);
  root.style.setProperty('--text-color', text);
  
  // Apply background only if no custom background image is set
  const savedBackgroundImage = localStorage.getItem('customBackgroundImage');
  if (!savedBackgroundImage) {
    document.body.style.background = `linear-gradient(135deg, ${background} 0%, ${adjustColor(background, 20)} 100%)`;
  }
  
  // Apply colors to all UI elements
  applyUIColors(primary, accent, background, text);
}

// Enhanced Bonus Hunt Tracker Calculation - Fixed Mathematics
function calculateBonusHunt(startMoney, stopMoney, betSize, bonuses) {
  // Validate inputs
  const safeStartMoney = typeof startMoney === 'number' && !isNaN(startMoney) ? startMoney : 0;
  const safeStopMoney = typeof stopMoney === 'number' && !isNaN(stopMoney) ? stopMoney : 0;
  
  const totalSpent = Math.max(0, safeStartMoney - safeStopMoney);
  
  // Calculate average bet from bonuses array with proper validation
  let averageBet = 0;
  let totalBet = 0;
  let validBonuses = 0;
  
  if (bonuses && bonuses.length) {
    bonuses.forEach(b => {
      if (b && typeof b.bet === 'number' && !isNaN(b.bet) && b.bet > 0) {
        totalBet += b.bet;
        validBonuses++;
      }
    });
    averageBet = validBonuses > 0 ? totalBet / validBonuses : 0;
  }
  
  const breakEvenPerBonus = bonuses.length ? totalSpent / bonuses.length : 0;
  const totalBreakEven = totalSpent;
  
  // Calculate actual return with proper validation
  const actualReturn = bonuses.reduce((sum, b) => {
    if (b && typeof b.value === 'number' && !isNaN(b.value)) {
      return sum + b.value;
    }
    return sum;
  }, 0);
  
  const profit = actualReturn - totalSpent;
  const profitPercent = totalSpent !== 0 ? (profit / totalSpent) * 100 : 0;
  
  // Fixed BE X calculation: break even amount divided by average bet
  let beX = 0;
  if (averageBet > 0) {
    beX = breakEvenPerBonus / averageBet;
  }
  
  return {
    totalSpent: Math.round(totalSpent * 100) / 100,
    averageBet: Math.round(averageBet * 100) / 100,
    breakEvenPerBonus: Math.round(breakEvenPerBonus * 100) / 100,
    totalBreakEven: Math.round(totalBreakEven * 100) / 100,
    actualReturn: Math.round(actualReturn * 100) / 100,
    profit: Math.round(profit * 100) / 100,
    profitPercent: Math.round(profitPercent * 10) / 10,
    beX: Math.round(beX * 100) / 100
  };
}

// 🧠 Fixed Bonus Hunt Stats Calculation
function calculateBonusHuntStats(startBalance, openingBalance, bonuses) {
  // Validate inputs
  const safeStart = typeof startBalance === 'number' && !isNaN(startBalance) ? startBalance : 0;
  const safeOpening = typeof openingBalance === 'number' && !isNaN(openingBalance) ? openingBalance : 0;
  const safeBonuses = Array.isArray(bonuses) ? bonuses : [];
  
  const bonusesCount = safeBonuses.length;
  const totalCost = Math.max(0, safeStart - safeOpening);
  
  // Calculate totals with proper validation
  let totalReturn = 0;
  let totalBet = 0;
  let validBonusCount = 0;
  let validMultipliers = [];
  
  safeBonuses.forEach(b => {
    if (b) {
      // Handle result/payout - check both properties
      const result = typeof b.result === 'number' && !isNaN(b.result) ? b.result : 0;
      const bet = typeof b.bet === 'number' && !isNaN(b.bet) && b.bet > 0 ? b.bet : 0;
      
      totalReturn += result;
      
      if (bet > 0) {
        totalBet += bet;
        validBonusCount++;
        
        // Calculate individual multiplier for proper average
        const multiplier = result / bet;
        if (!isNaN(multiplier) && isFinite(multiplier)) {
          validMultipliers.push(multiplier);
        }
      }
    }
  });
  
  const averageBetSize = validBonusCount > 0 ? totalBet / validBonusCount : 0;
  const averageWin = bonusesCount > 0 ? totalReturn / bonusesCount : 0;
  
  // Fixed average X calculation - proper mathematical average
  const averageX = validMultipliers.length > 0 
    ? validMultipliers.reduce((sum, x) => sum + x, 0) / validMultipliers.length 
    : 0;
  
  const breakEven = totalCost;
  const breakEvenPerBonus = bonusesCount > 0 ? breakEven / bonusesCount : 0;
  
  // Fixed break-even X calculation
  const breakEvenX = averageBetSize > 0 ? breakEvenPerBonus / averageBetSize : 0;
  
  const totalProfit = totalReturn - totalCost;
  
  return {
    bonuses: bonusesCount,
    totalCost: Math.round(totalCost * 100) / 100,
    totalReturn: Math.round(totalReturn * 100) / 100,
    averageBetSize: Math.round(averageBetSize * 100) / 100,
    averageWin: Math.round(averageWin * 100) / 100,
    averageX: Math.round(averageX * 100) / 100,
    breakEven: Math.round(breakEven * 100) / 100,
    breakEvenPerBonus: Math.round(breakEvenPerBonus * 100) / 100,
    breakEvenX: Math.round(breakEvenX * 100) / 100,
    totalProfit: Math.round(totalProfit * 100) / 100
  };
}

function updateTime() {
  const el = document.getElementById('current-time');
  if (!el) return;
  const now = new Date();
  el.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}
setInterval(updateTime, 1000);
updateTime();

// --- Slot Database (Global) ---

// Tournament-related functions
function initializeTournamentSlotSuggestions() {
  const tournamentSlotInputs = document.querySelectorAll('.tournament-slot-input');
  
  tournamentSlotInputs.forEach((input, index) => {
    const container = input.closest('.slot-input-container');
    if (!container) return;
    
    // Create suggestion box for this input
    let suggestionBox = document.createElement('div');
    suggestionBox.className = 'tournament-slot-suggestion-box';
    suggestionBox.style.display = 'none';
    
    container.appendChild(suggestionBox);
    
    input.addEventListener('input', function () {
      const value = input.value.trim();
      if (value.length < 3) {
        suggestionBox.style.display = 'none';
        return;
      }
      
      // Make sure slotDatabase is available
      if (typeof slotDatabase === 'undefined') return;
      
      const matches = slotDatabase.filter(slot =>
        slot.name.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 6); // Limit to 6 for better UX in smaller boxes
      
      if (matches.length === 0) {
        suggestionBox.style.display = 'none';
        return;
      }
      
      suggestionBox.innerHTML = '';
      matches.forEach(slot => {
        const item = document.createElement('div');
        item.className = 'tournament-slot-suggestion-item';
        item.innerHTML = `
          <span class="slot-suggestion-name">${slot.name}</span>
          <span class="slot-suggestion-provider">${slot.provider}</span>
        `;
        
        const selectSlot = function(e) {
          e.preventDefault();
          e.stopPropagation();
          input.value = slot.name;
          suggestionBox.style.display = 'none';
          input.dispatchEvent(new Event('input'));
        };
        
        item.addEventListener('click', selectSlot);
        item.addEventListener('mousedown', selectSlot);
        
        suggestionBox.appendChild(item);
      });
      
      suggestionBox.style.display = 'block';
    });
    
    input.addEventListener('blur', function () {
      setTimeout(() => { suggestionBox.style.display = 'none'; }, 200);
    });
    
    // Hide other suggestion boxes when this one gets focus
    input.addEventListener('focus', function () {
      tournamentSlotInputs.forEach((otherInput, otherIndex) => {
        if (otherIndex !== index) {
          const otherContainer = otherInput.closest('.slot-input-container');
          const otherSuggestionBox = otherContainer ? otherContainer.querySelector('.tournament-slot-suggestion-box') : null;
          if (otherSuggestionBox) {
            otherSuggestionBox.style.display = 'none';
          }
        }
      });
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const bhBtn = document.getElementById('bh-btn');
  const boBtn = document.getElementById('bo-btn');
  const randomSlotBtn = document.getElementById('random-slot-btn');
  const tournamentBtn = document.getElementById('tournament-btn'); // Trophy button
  const infoPanel = document.querySelector('.info-panel');
  const middlePanel = document.getElementById('middle-panel');
  const randomSlotPanel = document.getElementById('random-slot-panel');
  const tournamentPanel = document.getElementById('tournament-panel');
  let panelVisible = false;
  let randomSlotPanelVisible = false;
  let tournamentPanelVisible = false;
  let tournamentInitialized = false;
  
  // Tournament manager will be initialized after class definition
  let tournamentManager;

  // Helper to update info panel visibility with slide
  function updateInfoPanelVisibility() {
    const bhActive = bhBtn && bhBtn.classList.contains('active');
    const boActive = boBtn && boBtn.classList.contains('active');
    const randomSlotActive = randomSlotBtn && randomSlotBtn.classList.contains('active');
    const tournamentActive = tournamentBtn && tournamentBtn.classList.contains('active');
    
    if (infoPanel) {
      // Hide info panel when tournament panel is active, keep visible for others
      if (tournamentActive) {
        infoPanel.classList.remove('info-panel--visible');
      } else if (bhActive || boActive || randomSlotActive) {
        infoPanel.classList.add('info-panel--visible');
      } else {
        infoPanel.classList.remove('info-panel--visible');
      }
    }
  }
  // Patch BH button logic
  bhBtn.addEventListener('click', () => {
    panelVisible = !panelVisible;
    middlePanel.style.display = panelVisible ? 'flex' : 'none';
    bhBtn.classList.toggle('active', panelVisible);
    
    // Hide selected slot display when BH panel is closed
    if (!panelVisible) {
      hideSelectedSlot();
    }
    
    // Hide random slot panel when BH is shown
    const randomSlotPanel = document.getElementById('random-slot-panel');
    if (randomSlotPanel && panelVisible) {
      randomSlotPanel.style.display = 'none';
    }
    // Remove 'active' from all sidebar buttons except BH
    if (panelVisible) {
      document.querySelectorAll('.sidebar-btn').forEach(btn => {
        if (btn !== bhBtn) btn.classList.remove('active');
      });
    }
    updateInfoPanelVisibility();
  });

  // Random Slot Button Logic
  if (randomSlotBtn && randomSlotPanel) {
    randomSlotBtn.addEventListener('click', () => {
      randomSlotPanelVisible = !randomSlotPanelVisible;
      randomSlotPanel.style.display = randomSlotPanelVisible ? 'flex' : 'none';
      randomSlotBtn.classList.toggle('active', randomSlotPanelVisible);
      
      // Hide BH panel when random slot is shown
      if (randomSlotPanelVisible) {
        middlePanel.style.display = 'none';
        panelVisible = false;
        hideSelectedSlot(); // Hide selected slot display when random slot panel opens
      }
      
      // Remove 'active' from all sidebar buttons except random slot
      if (randomSlotPanelVisible) {
        document.querySelectorAll('.sidebar-btn').forEach(btn => {
          if (btn !== randomSlotBtn) btn.classList.remove('active');
        });
      }
      updateInfoPanelVisibility();
    });
  }

  // Tournament Button Logic
  if (tournamentBtn && tournamentPanel) {
    tournamentBtn.addEventListener('click', () => {
      console.log('Tournament button clicked');
      
      // Check if tournament is active - if so, show control panel and bracket
      if (tournamentManager && tournamentManager.state.isActive) {
        console.log('Tournament is active, showing control panel and bracket');
        tournamentManager.showControlPanel();
        tournamentManager.showTournamentBracket();
        return;
      }
      
      // Show/hide tournament setup panel
      tournamentPanelVisible = !tournamentPanelVisible;
      tournamentPanel.style.display = tournamentPanelVisible ? 'flex' : 'none';
      tournamentBtn.classList.toggle('active', tournamentPanelVisible);
      console.log('Tournament panel visibility:', tournamentPanelVisible);
      
      // Hide control panel if showing tournament setup
      const controlPanel = document.getElementById('tournament-control-panel');
      if (controlPanel) {
        controlPanel.style.display = 'none';
        console.log('Control panel hidden');
      }
      
      // Initialize tournament slot suggestions on first open
      if (tournamentPanelVisible && !tournamentInitialized) {
        initializeTournamentSlotSuggestions();
        tournamentInitialized = true;
      }
      
      // Hide other panels when tournament is shown
      if (tournamentPanelVisible) {
        middlePanel.style.display = 'none';
        randomSlotPanel.style.display = 'none';
        panelVisible = false;
        randomSlotPanelVisible = false;
        hideSelectedSlot(); // Hide selected slot display when tournament panel opens
      }
      
      // Remove 'active' from all sidebar buttons except tournament
      if (tournamentPanelVisible) {
        document.querySelectorAll('.sidebar-btn').forEach(btn => {
          if (btn !== tournamentBtn) btn.classList.remove('active');
        });
      }
      updateInfoPanelVisibility();
    });
  }

  const adInput = document.getElementById('ad-image-input');
  const logoUploadInput = document.getElementById('logo-upload-input');
  const navbarLogo = document.getElementById('navbar-logo');

  // Image upload functionality with draggable and resizable display
  adInput.addEventListener('change', (e) => {
    const file = adInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(evt) {
        createDraggableImage(evt.target.result);
      };
      reader.readAsDataURL(file);
    }
  });

  // Logo upload functionality
  if (navbarLogo && logoUploadInput) {
    // Load saved logo from localStorage on page load
    const savedLogo = localStorage.getItem('customNavbarLogo');
    if (savedLogo) {
      navbarLogo.src = savedLogo;
    }

    // Click handler for logo to trigger file input
    navbarLogo.addEventListener('click', () => {
      if (window.isDragLocked) {
        console.log('Logo editing disabled - interface is locked');
        return;
      }
      logoUploadInput.click();
    });

    // File input change handler
    logoUploadInput.addEventListener('change', (e) => {
      const file = logoUploadInput.files[0];
      if (file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          alert('Please select an image file.');
          return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert('Please select an image smaller than 5MB.');
          return;
        }

        const reader = new FileReader();
        reader.onload = function(evt) {
          const newLogoSrc = evt.target.result;
          // Update the logo image
          navbarLogo.src = newLogoSrc;
          // Save to localStorage
          localStorage.setItem('customNavbarLogo', newLogoSrc);
        };
        reader.readAsDataURL(file);
      }
    });

    // Right-click context menu for logo reset
    navbarLogo.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      if (window.isDragLocked) {
        console.log('Logo editing disabled - interface is locked');
        return;
      }
      if (confirm('Reset logo to default Twitch logo?')) {
        const defaultLogo = 'https://static.twitchcdn.net/assets/favicon-32-e29e246c157142c94346.png';
        navbarLogo.src = defaultLogo;
        localStorage.removeItem('customNavbarLogo');
      }
    });
  }

  // Streamer name editing functionality
  const streamerNameSpan = document.getElementById('streamer-name');
  const streamerNameInput = document.getElementById('streamer-name-input');
  
  if (streamerNameSpan && streamerNameInput) {
    // Load saved streamer name from localStorage
    const savedStreamerName = localStorage.getItem('customStreamerName');
    if (savedStreamerName) {
      streamerNameSpan.textContent = savedStreamerName;
    }

    // Click to edit streamer name
    streamerNameSpan.addEventListener('click', () => {
      if (window.isDragLocked) {
        console.log('Streamer name editing disabled - interface is locked');
        return;
      }
      streamerNameInput.value = streamerNameSpan.textContent;
      streamerNameSpan.style.display = 'none';
      streamerNameInput.style.display = 'inline-block';
      streamerNameInput.focus();
      streamerNameInput.select();
    });

    // Save on Enter or blur
    function saveStreamerName() {
      const newName = streamerNameInput.value.trim();
      if (newName) {
        streamerNameSpan.textContent = newName;
        localStorage.setItem('customStreamerName', newName);
      }
      streamerNameInput.style.display = 'none';
      streamerNameSpan.style.display = 'inline-block';
    }

    streamerNameInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        saveStreamerName();
      }
    });

    streamerNameInput.addEventListener('blur', saveStreamerName);

    // Right-click to reset streamer name
    streamerNameSpan.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      if (window.isDragLocked) {
        console.log('Streamer name editing disabled - interface is locked');
        return;
      }
      if (confirm('Reset streamer name to default?')) {
        streamerNameSpan.textContent = 'Osecaadegas95';
        localStorage.removeItem('customStreamerName');
      }
    });
  }

  // Website URL editing functionality
  const websiteLink = document.getElementById('website-link');
  const websiteText = document.getElementById('website-text');
  const websiteInput = document.getElementById('website-input');
  
  if (websiteLink && websiteText && websiteInput) {
    // Load saved website URL from localStorage
    const savedWebsiteUrl = localStorage.getItem('customWebsiteUrl');
    const savedWebsiteText = localStorage.getItem('customWebsiteText');
    
    if (savedWebsiteUrl) {
      websiteLink.href = savedWebsiteUrl;
    }
    if (savedWebsiteText) {
      websiteText.textContent = savedWebsiteText;
    }

    // Click to edit website
    websiteText.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (window.isDragLocked) {
        console.log('Website editing disabled - interface is locked');
        return;
      }
      websiteInput.value = websiteLink.href;
      websiteText.style.display = 'none';
      websiteInput.style.display = 'inline-block';
      websiteInput.focus();
      websiteInput.select();
    });

    // Save on Enter or blur
    function saveWebsiteUrl() {
      const newUrl = websiteInput.value.trim();
      if (newUrl) {
        // Add https:// if no protocol specified
        const fullUrl = newUrl.startsWith('http') ? newUrl : `https://${newUrl}`;
        websiteLink.href = fullUrl;
        
        // Display text without protocol for cleaner look
        const displayText = newUrl.replace(/^https?:\/\//, '');
        websiteText.textContent = displayText;
        
        localStorage.setItem('customWebsiteUrl', fullUrl);
        localStorage.setItem('customWebsiteText', displayText);
      }
      websiteInput.style.display = 'none';
      websiteText.style.display = 'inline-block';
    }

    websiteInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        saveWebsiteUrl();
      }
    });

    websiteInput.addEventListener('blur', saveWebsiteUrl);

    // Escape key to cancel editing for both inputs
    if (streamerNameInput) {
      streamerNameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          streamerNameInput.style.display = 'none';
          streamerNameSpan.style.display = 'inline-block';
        }
      });
    }

    websiteInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        websiteInput.style.display = 'none';
        websiteText.style.display = 'inline-block';
      }
    });

    // Right-click to reset website URL
    websiteText.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      if (window.isDragLocked) {
        console.log('Website editing disabled - interface is locked');
        return;
      }
      if (confirm('Reset website URL to default?')) {
        websiteLink.href = 'https://osecaadegas.github.io/95/';
        websiteText.textContent = 'osecaadegas.github.io/95/';
        localStorage.removeItem('customWebsiteUrl');
        localStorage.removeItem('customWebsiteText');
      }
    });
  }

  // Function to create draggable and resizable image
  function createDraggableImage(imageSrc) {
    const imageContainer = document.createElement('div');
    imageContainer.className = 'draggable-image-container';
    imageContainer.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 250px;
      height: 150px;
      border: 2px solid rgba(147, 70, 255, 0.5);
      border-radius: 8px;
      overflow: visible;
      cursor: move;
      z-index: 1000;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
      background: rgba(0, 0, 0, 0.05);
      
      display: flex;
      align-items: center;
      justify-content: center;
    `;

    const image = document.createElement('img');
    image.src = imageSrc;
    image.style.cssText = `
      width: 100%;
      height: 100%;
      object-fit: contain;
      pointer-events: none;
    `;

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '×';
    closeBtn.style.cssText = `
      position: absolute;
      top: -10px;
      right: -10px;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: rgba(255, 69, 58, 0.9);
      color: white;
      border: none;
      cursor: pointer;
      font-size: 16px;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1001;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    `;

    // Resize handle
    const resizeHandle = document.createElement('div');
    resizeHandle.className = 'resize-handle';
    resizeHandle.style.cssText = `
      position: absolute;
      bottom: -5px;
      right: -5px;
      width: 15px;
      height: 15px;
      background: rgba(147, 70, 255, 0.8);
      cursor: se-resize;
      border-radius: 3px;
      z-index: 1001;
      transition: all 0.2s ease;
    `;

    imageContainer.appendChild(image);
    imageContainer.appendChild(closeBtn);
    imageContainer.appendChild(resizeHandle);
    document.body.appendChild(imageContainer);

    // Close functionality
    closeBtn.addEventListener('click', (e) => {
      if (window.isDragLocked) return;
      e.stopPropagation();
      imageContainer.remove();
    });

    // Make the image container draggable
    window.dragHandler.makeDraggable(imageContainer);
    
    // Update cursor and visibility based on lock state
    function updateCursor() {
      if (window.isDragLocked) {
        imageContainer.style.cursor = 'default';
        imageContainer.style.border = 'none';
        imageContainer.style.background = 'transparent';
        imageContainer.style.backdropFilter = 'none';
        imageContainer.style.boxShadow = 'none';
        closeBtn.style.display = 'none';
        resizeHandle.style.display = 'none';
      } else {
        imageContainer.style.cursor = 'move';
        imageContainer.style.border = '2px solid rgba(147, 70, 255, 0.5)';
        imageContainer.style.background = 'rgba(0, 0, 0, 0.05)';
        imageContainer.style.backdropFilter = 'blur(5px)';
        imageContainer.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.3)';
        closeBtn.style.display = 'flex';
        resizeHandle.style.display = 'block';
      }
    }
    
    // Check lock state periodically
    const lockCheckInterval = setInterval(() => {
      updateCursor();
    }, 100);
    
    // Cleanup interval when image is removed
    const originalRemove = imageContainer.remove;
    imageContainer.remove = function() {
      clearInterval(lockCheckInterval);
      originalRemove.call(this);
    };
    
    updateCursor();

    // Resize functionality
    let isResizing = false;
    let startX, startY, startWidth, startHeight;

    resizeHandle.addEventListener('mousedown', (e) => {
      if (window.isDragLocked) return;
      
      e.stopPropagation();
      isResizing = true;
      startX = e.clientX;
      startY = e.clientY;
      startWidth = parseInt(document.defaultView.getComputedStyle(imageContainer).width, 10);
      startHeight = parseInt(document.defaultView.getComputedStyle(imageContainer).height, 10);
      
      imageContainer.style.cursor = 'se-resize';
      
      document.addEventListener('mousemove', doResize);
      document.addEventListener('mouseup', stopResize);
    });

    function doResize(e) {
      if (!isResizing) return;
      
      const newWidth = startWidth + e.clientX - startX;
      const newHeight = startHeight + e.clientY - startY;
      
      // Minimum size constraints
      if (newWidth > 50 && newHeight > 50) {
        imageContainer.style.width = newWidth + 'px';
        imageContainer.style.height = newHeight + 'px';
        
        // Check if Shift is held for cropping mode
        if (e.shiftKey) {
          // Crop mode: change image object-fit to cover and allow overflow
          image.style.objectFit = 'cover';
          imageContainer.style.overflow = 'hidden';
          
          // Add visual indicator for crop mode
          imageContainer.style.borderColor = 'rgba(255, 165, 0, 0.8)';
          imageContainer.style.boxShadow = '0 4px 16px rgba(255, 165, 0, 0.4)';
        } else {
          // Normal resize mode: show full image
          image.style.objectFit = 'contain';
          imageContainer.style.overflow = 'visible';
          
          // Normal border color
          imageContainer.style.borderColor = 'rgba(147, 70, 255, 0.5)';
          imageContainer.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.3)';
        }
      }
    }

    function stopResize() {
      isResizing = false;
      imageContainer.style.cursor = 'move';
      document.removeEventListener('mousemove', doResize);
      document.removeEventListener('mouseup', stopResize);
    }

    // Touch support for resize
    resizeHandle.addEventListener('touchstart', (e) => {
      if (window.isDragLocked) return;
      
      e.stopPropagation();
      const touch = e.touches[0];
      isResizing = true;
      startX = touch.clientX;
      startY = touch.clientY;
      startWidth = parseInt(document.defaultView.getComputedStyle(imageContainer).width, 10);
      startHeight = parseInt(document.defaultView.getComputedStyle(imageContainer).height, 10);
      
      document.addEventListener('touchmove', doResizeTouch, { passive: false });
      document.addEventListener('touchend', stopResizeTouch);
    });

    function doResizeTouch(e) {
      if (!isResizing) return;
      e.preventDefault();
      
      const touch = e.touches[0];
      const newWidth = startWidth + touch.clientX - startX;
      const newHeight = startHeight + touch.clientY - startY;
      
      if (newWidth > 50 && newHeight > 50) {
        imageContainer.style.width = newWidth + 'px';
        imageContainer.style.height = newHeight + 'px';
        
        // For touch, we can detect multi-touch as "shift" equivalent
        if (e.touches.length > 1) {
          // Crop mode: change image object-fit to cover and allow overflow
          image.style.objectFit = 'cover';
          imageContainer.style.overflow = 'hidden';
          
          // Add visual indicator for crop mode
          imageContainer.style.borderColor = 'rgba(255, 165, 0, 0.8)';
          imageContainer.style.boxShadow = '0 4px 16px rgba(255, 165, 0, 0.4)';
        } else {
          // Normal resize mode: show full image
          image.style.objectFit = 'contain';
          imageContainer.style.overflow = 'visible';
          
          // Normal border color
          imageContainer.style.borderColor = 'rgba(147, 70, 255, 0.5)';
          imageContainer.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.3)';
        }
      }
    }

    function stopResizeTouch() {
      isResizing = false;
      document.removeEventListener('touchmove', doResizeTouch);
      document.removeEventListener('touchend', stopResizeTouch);
    }

    console.log('Created draggable and resizable image');
  }

  // Focus bet size after pressing Enter in slot name
  const slotNameInput = document.getElementById('slot-name-input');
  const betSizeInput = document.getElementById('bet-size-input');
  if (slotNameInput && betSizeInput) {
    slotNameInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        betSizeInput.focus();
      }
    });
  }

  // Slot image URL button/input toggle
  const slotImgUrlBtn = document.getElementById('slot-img-url-btn');
  const slotImgUrlInput = document.getElementById('slot-img-url-input');
  if (slotImgUrlBtn && slotImgUrlInput) {
    slotImgUrlBtn.addEventListener('click', () => {
      slotImgUrlBtn.style.display = 'none';
      slotImgUrlInput.style.display = 'inline-block';
      slotImgUrlInput.focus();
    });
    slotImgUrlInput.addEventListener('blur', () => {
      slotImgUrlInput.style.display = 'none';
      slotImgUrlBtn.style.display = 'inline-flex';
    });
    slotImgUrlInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        slotImgUrlInput.blur();
      }
    });
  }

  // --- Bonus Opening / BO Button Logic ---
  const bonusOpenBtn = document.getElementById('bonus-opening-btn'); // "Bonus opening" button in BH panel
  const bhPanel = document.getElementById('middle-panel'); // BH panel element

  // Slot image URL (replace with your logic to get the actual image)
  let slotImageUrl = '';
  const slotImgInput = document.getElementById('slot-img-url-input');
  if (slotImgInput) {
    slotImgInput.addEventListener('input', (e) => {
      slotImageUrl = e.target.value;
    });
  }

  // Patch Bonus Opening button in BH panel
  if (bonusOpenBtn) {
    bonusOpenBtn.addEventListener('click', () => {
      if (middlePanel) middlePanel.style.display = 'none';
      showPayoutPanel();
      // Set BO button as active, BH as inactive
      if (boBtn) boBtn.classList.add('active');
      if (bhBtn) bhBtn.classList.remove('active');
      updateInfoPanelVisibility();
      // --- Ensure slot highlight card updates immediately ---
      setTimeout(updateSlotHighlightCard, 50);
    });
  }

  // Hide info panel by default on load
  if (infoPanel) infoPanel.classList.remove('info-panel--visible');

  // --- Twitch Login/Logout Mockup ---
  // REMOVE Twitch login logic, username span, and related code
  // const twitchLoginBtn = document.getElementById('twitch-login-btn');
  // const twitchUsernameSpan = document.getElementById('twitch-username');
  // function mockTwitchLogin() { ... }
  // if (twitchLoginBtn) { ... }

  // Update Start/Stop Money display in right sidebar
  const startMoneyInput = document.getElementById('start-money-input');
  const stopMoneyInput = document.getElementById('stop-money-input');
  const startMoneyDisplay = document.getElementById('start-money-display');
  const stopMoneyDisplay = document.getElementById('stop-money-display');
  const startMoneyDisplayMain = document.getElementById('start-money-display-main');
  const stopMoneyDisplayMain = document.getElementById('stop-money-display-main');

  function updateStartMoneyDisplays(val) {
    const formatted = val ? `€${parseFloat(val).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : '--';
    if (startMoneyDisplay) startMoneyDisplay.textContent = formatted;
    if (startMoneyDisplayMain) startMoneyDisplayMain.textContent = formatted;
  }
  function updateStopMoneyDisplays(val) {
    const formatted = val ? `€${parseFloat(val).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : '--';
    if (stopMoneyDisplay) stopMoneyDisplay.textContent = formatted;
    if (stopMoneyDisplayMain) stopMoneyDisplayMain.textContent = formatted;
  }

  if (startMoneyInput) {
    startMoneyInput.addEventListener('input', () => {
      updateStartMoneyDisplays(startMoneyInput.value);
    });
  }
  if (stopMoneyInput) {
    stopMoneyInput.addEventListener('input', () => {
      updateStopMoneyDisplays(stopMoneyInput.value);
    });
  }

  // --- Slot Name Suggestion Dropdown ---
  if (slotNameInput) {
    let suggestionBox = document.createElement('div');
    suggestionBox.style.position = 'absolute';
    suggestionBox.style.background = 'linear-gradient(135deg, #23243a 0%, #2d2e4a 100%)';
    suggestionBox.style.color = '#fff';
    suggestionBox.style.borderRadius = '12px';
    suggestionBox.style.boxShadow = '0 4px 16px rgba(0,225,255,0.2)';
    suggestionBox.style.border = '1px solid #00e1ff';
    suggestionBox.style.zIndex = '1010';
    suggestionBox.style.display = 'none';
    suggestionBox.style.maxHeight = '200px';
    suggestionBox.style.overflowY = 'auto';
    suggestionBox.style.fontSize = '0.95rem';
    suggestionBox.style.padding = '0.3rem 0';
    suggestionBox.style.backdropFilter = 'blur(8px)';
    suggestionBox.style.left = '0';
    suggestionBox.style.top = '100%';
    suggestionBox.style.width = '100%';
    suggestionBox.style.marginTop = '0.3rem';
    suggestionBox.className = 'slot-suggestion-box';
    
    // Append to the slot name input's parent container for proper positioning
    const slotNameContainer = slotNameInput.closest('.middle-input-label');
    if (slotNameContainer) {
      slotNameContainer.style.position = 'relative';
      slotNameContainer.appendChild(suggestionBox);
    } else {
      document.body.appendChild(suggestionBox);
    }

    slotNameInput.addEventListener('input', function () {
      const value = slotNameInput.value.trim();
      if (value.length < 3) {
        suggestionBox.style.display = 'none';
        return;
      }
      const matches = slotDatabase.filter(slot =>
        slot.name.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 8);
      if (matches.length === 0) {
        suggestionBox.style.display = 'none';
        return;
      }
      suggestionBox.innerHTML = '';
      matches.forEach(slot => {
        const item = document.createElement('div');
        item.style.display = 'flex';
        item.style.alignItems = 'center';
        item.style.padding = '0.5rem 0.8rem';
        item.style.cursor = 'pointer';
        item.style.borderRadius = '8px';
        item.style.margin = '0.1rem 0.3rem';
        item.style.transition = 'all 0.2s ease';
        item.innerHTML = `
          <img src="${slot.image}" alt="${slot.name}" style="width:28px;height:28px;object-fit:cover;border-radius:6px;margin-right:0.6rem;border:1px solid #00e1ff;">
          <div>
            <div style="font-weight:600;font-size:0.9rem;">${slot.name}</div>
            <div style="font-size:0.8rem;color:#b0b3b8;">${slot.provider}</div>
          </div>
        `;
        // Handle both click and mousedown to ensure selection works
        const selectSlot = function(e) {
          e.preventDefault();
          e.stopPropagation();
          slotNameInput.value = slot.name;
          suggestionBox.style.display = 'none';
          slotNameInput.dispatchEvent(new Event('input'));
          // Show selected slot in right-side display
          showSelectedSlot(slot);
          // Focus bet size input after selecting a suggestion
          if (betSizeInput) {
            setTimeout(() => betSizeInput.focus(), 50);
          }
        };
        
        item.addEventListener('click', selectSlot);
        item.addEventListener('mousedown', selectSlot);
        item.addEventListener('mouseover', function () {
          item.style.background = 'linear-gradient(90deg, #9147ff 0%, #00e1ff 100%)';
          item.style.transform = 'scale(1.02)';
        });
        item.addEventListener('mouseout', function () {
          item.style.background = 'transparent';
          item.style.transform = 'scale(1)';
        });
        suggestionBox.appendChild(item);
      });
      suggestionBox.style.display = 'block';
    });

    // Hide suggestions on blur
    slotNameInput.addEventListener('blur', function () {
      setTimeout(() => { suggestionBox.style.display = 'none'; }, 200);
    });
  }

  // Add slot to Bonus List on Enter in Bet Size input
  // Ensure there is a <ul> inside .bonus-list, create if missing
  let bonusListUl = document.querySelector('.bonus-list ul');
  if (!bonusListUl) {
    const bonusListDiv = document.querySelector('.bonus-list');
    if (bonusListDiv) {
      bonusListUl = document.createElement('ul');
      bonusListDiv.appendChild(bonusListUl);
    }
  }
  // --- Super checkbox logic ---
  const superCheckbox = document.getElementById('super-checkbox');
  if (betSizeInput && slotNameInput && bonusListUl) {
    betSizeInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        const slotName = slotNameInput.value.trim();
        const betSize = betSizeInput.value.trim();
        if (slotName && betSize) {
          // Try to find slot in database for image
          let slot = slotDatabase.find(s => s.name.toLowerCase() === slotName.toLowerCase());
          let imgSrc = slot ? slot.image : DEFAULT_SLOT_IMAGE;
          // Create new list item with image and highlight classes
          const li = document.createElement('li');
          li.innerHTML = `
            <img src="${imgSrc}" alt="${slotName}" class="slot-img">
            <span class="slot-name">${slotName}</span>
            <span class="slot-payout">--</span>
            <span class="slot-bet">€${parseFloat(betSize).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
          `;
          // Highlight if super checkbox is checked
          if (superCheckbox && superCheckbox.checked) {
            li.classList.add('super-slot');
            superCheckbox.checked = false; // Optionally uncheck after use
          }
          bonusListUl.appendChild(li);

          // Optionally clear inputs
          slotNameInput.value = '';
          betSizeInput.value = '';
          slotNameInput.focus();

          renderBonusHuntResults();
          updateBonusListCarousel();
        }
      }
    });
  }

  // --- Bonus Opening Payout Panel Logic (Vanilla JS, styled to match your app) ---

  function getBonusListData() {
    const bonusListUl = document.querySelector('.bonus-list ul');
    if (!bonusListUl) return [];
    // Only use non-clone lis for calculations and payout
    return Array.from(bonusListUl.children)
      .filter(li => !li.classList.contains('carousel-clone'))
      .map(li => {
        const spans = li.querySelectorAll('span');
        return {
          name: spans[0] ? spans[0].textContent : '',
          bet: spans[1] ? parseFloat(spans[1].textContent.replace(/[^\d.]/g, '')) : 0,
          payout: li.dataset && li.dataset.payout ? parseFloat(li.dataset.payout) : null
        };
      });
  }

  let payoutPanel = null;
  let payoutBonuses = [];
  let payoutIndex = 0;

  function showPayoutPanel() {
    if (payoutPanel) return;
    payoutBonuses = getBonusListData();
    if (!payoutBonuses.length) return;

    payoutIndex = 0;
    payoutPanel = document.createElement('div');
    payoutPanel.className = 'middle-panel';
    payoutPanel.style.display = 'flex';
    payoutPanel.style.flexDirection = 'column';
    payoutPanel.style.alignItems = 'center';
    payoutPanel.style.position = 'fixed';
    payoutPanel.style.top = '50%';
    payoutPanel.style.left = '50%';
    payoutPanel.style.transform = 'translate(-50%, -50%)';
    payoutPanel.style.zIndex = '1001';
    payoutPanel.style.background = 'rgba(36, 38, 48, 0.97)';
    payoutPanel.style.borderRadius = '24px';
    payoutPanel.style.boxShadow = '0 6px 24px 0 rgba(0,0,0,0.18)';
    payoutPanel.style.padding = '2rem 1.5rem';
    payoutPanel.style.width = '400px';
    payoutPanel.style.height = '420px';

    document.body.appendChild(payoutPanel);
    
    // Make the payout panel draggable
    if (window.dragHandler) {
      window.dragHandler.makeDraggable(payoutPanel);
    }
    
    renderPayoutStep();
  }

  function renderPayoutStep() {
    if (!payoutPanel) return;
    const bonus = payoutBonuses[payoutIndex];
    payoutPanel.innerHTML = `
      <div class="middle-panel-title" style="margin-bottom:1.2rem;">
        Enter Payout (${payoutIndex + 1}/${payoutBonuses.length})
      </div>
      <img src="${getSlotImage(bonus.name)}" alt="${bonus.name}" style="width:120px;height:80px;object-fit:cover;border-radius:12px;margin-bottom:12px;box-shadow:0 2px 8px 0 rgba(0,0,0,0.18);">
      <div style="color:#fff;font-weight:600;margin-bottom:12px;font-size:1.15rem;">${bonus.name}</div>
      <form id="payout-form" style="display:flex;gap:8px;margin-bottom:1.5rem;">
        <input
          id="payout-input"
          type="number"
          min="0"
          step="any"
          value="${bonus.payout !== null ? bonus.payout : ''}"
          placeholder="Enter payout"
          class="middle-input"
          style="width:140px;"
          autofocus
        />
        <button type="submit" class="middle-btn small-btn" style="width:auto;">
          OK
        </button>
      </form>
      <div style="flex:1"></div>
      <button id="cancel-payout-panel" class="middle-btn small-btn" style="margin-top:auto;background:#ff5c5c;color:#fff;">Cancel</button>
    `;

    const form = payoutPanel.querySelector('#payout-form');
    form.onsubmit = function (e) {
      e.preventDefault();
      const val = payoutPanel.querySelector('#payout-input').value;
      if (val && !isNaN(val)) {
        payoutBonuses[payoutIndex].payout = parseFloat(val);
        setBonusPayout(bonus.name, parseFloat(val)); // <-- update sidebar
        if (payoutIndex < payoutBonuses.length - 1) {
          payoutIndex++;
          renderPayoutStep();
        } else {
          document.body.removeChild(payoutPanel);
          payoutPanel = null;
          // Optionally: display results or update sidebar
          // Example: console.log(payoutBonuses);
        }
      }
    };

    payoutPanel.querySelector('#cancel-payout-panel').onclick = function () {
      document.body.removeChild(payoutPanel);
      payoutPanel = null;
      // Optionally: show the BH panel again
      const bhPanel = document.getElementById('middle-panel');
      if (bhPanel) bhPanel.style.display = 'flex';
    };
  }

  function getSlotImage(slotName) {
    // Use the slotDatabase defined in this script
    const slot = slotDatabase.find(s => s.name.toLowerCase() === slotName.toLowerCase());
    const imageUrl = slot ? slot.image : DEFAULT_SLOT_IMAGE;
    console.log(`Getting image for slot: ${slotName}, found: ${!!slot}, image: ${imageUrl}`);
    return imageUrl;
  }

  // --- Hook up Bonus Opening button ---
  // Remove duplicate event listener for bonusOpenBtn
  // Only keep the payout panel logic, not the slot card logic, for the "Bonus Opening" button
  if (bonusOpenBtn) {
    bonusOpenBtn.addEventListener('click', () => {
      if (middlePanel) middlePanel.style.display = 'none';
      showPayoutPanel();
    });
  }

  // Hide selected slot by default
  hideSelectedSlot();

  function renderBonusHuntResults() {
    const startBalance = parseFloat(document.getElementById('start-money-input')?.value) || 0;
    const openingBalance = parseFloat(document.getElementById('stop-money-input')?.value) || 0;
    // Only use non-clone lis for calculations
    const bonusListUl = document.querySelector('.bonus-list ul');
    const bonuses = bonusListUl
      ? Array.from(bonusListUl.children)
          .filter(li => !li.classList.contains('carousel-clone'))
          .map(li => {
            const spans = li.querySelectorAll('span');
            let slot = spans[0] ? spans[0].textContent.trim() : '';
            
            // Extract bet amount more reliably
            let bet = 0;
            const betSpan = li.querySelector('.slot-bet');
            if (betSpan) {
              const betText = betSpan.textContent.replace(/[^\d.]/g, '');
              bet = parseFloat(betText) || 0;
            } else if (spans[1]) {
              const betText = spans[1].textContent.replace(/[^\d.]/g, '');
              bet = parseFloat(betText) || 0;
            }
            
            // Extract result/payout more reliably
            let result = 0;
            if (li.dataset && li.dataset.payout) {
              result = parseFloat(li.dataset.payout) || 0;
            } else {
              const payoutSpan = li.querySelector('.slot-payout');
              if (payoutSpan && payoutSpan.textContent !== '--') {
                const payoutText = payoutSpan.textContent.replace(/[^\d.]/g, '');
                result = parseFloat(payoutText) || 0;
              }
            }
            
            return { slot, bet, result };
          })
      : [];

    const stats = calculateBonusHuntStats(startBalance, openingBalance, bonuses);

    const resultsDiv = document.getElementById('bonus-hunt-results');
    if (!resultsDiv) return;
    resultsDiv.innerHTML = `
      <div class="bhr-compact" style="
        display:grid;
        grid-template-columns: repeat(2, minmax(0,1fr));
        gap: 0.07rem 0.2rem;
        font-size: 0.89rem;
        line-height: 1.08;
        ">
        <div><span class="bhr-label">Bon:</span> <span class="bhr-value">${stats.bonuses}</span></div>
        <div><span class="bhr-label">Pft:</span> <span class="bhr-value ${stats.totalProfit >= 0 ? 'bhr-profit' : 'bhr-loss'}">€${stats.totalProfit.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits: 2})}</span></div>
        <div><span class="bhr-label">Bet:</span> <span class="bhr-value">€${stats.averageBetSize.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits: 2})}</span></div>
        <div><span class="bhr-label">Win:</span> <span class="bhr-value">€${stats.averageWin.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits: 2})}</span></div>
        <div><span class="bhr-label">X:</span> <span class="bhr-value">${stats.averageX.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}x</span></div>
        <div><span class="bhr-label">BE X:</span> <span class="bhr-value">${stats.breakEvenX.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}x</span></div>
        <div><span class="bhr-label">BEB:</span> <span class="bhr-value">€${stats.breakEvenPerBonus.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</span></div>
        <div><span class="bhr-label">BE:</span> <span class="bhr-value">€${stats.breakEven.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</span></div>
        <div><span class="bhr-label">Cost:</span> <span class="bhr-value">€${stats.totalCost.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits: 2})}</span></div>
        <div><span class="bhr-label">Ret:</span> <span class="bhr-value">€${stats.totalReturn.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits: 2})}</span></div>
      </div>
    `;
  }

  // --- Call renderBonusHuntResults on relevant changes ---

  // After start/stop money input
  if (startMoneyInput) {
    startMoneyInput.addEventListener('input', renderBonusHuntResults);
  }
  if (stopMoneyInput) {
    stopMoneyInput.addEventListener('input', renderBonusHuntResults);
  }
  // After bet size input
  if (betSizeInput) {
    betSizeInput.addEventListener('input', renderBonusHuntResults);
  }

  // After adding a bonus to the list, update the results
  if (betSizeInput && slotNameInput && bonusListUl) {
    betSizeInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        // ...existing code...
        // After adding the li:
        renderBonusHuntResults();
      }
    });
  }

  // When a payout is entered in the payout panel, store it as a data attribute and update results
  function setBonusPayout(slotName, payout) {
    const bonusListUl = document.querySelector('.bonus-list ul');
    if (!bonusListUl) return;
    
    // Validate payout
    const safePayout = typeof payout === 'number' && !isNaN(payout) ? payout : 0;
    
    Array.from(bonusListUl.children)
      // Update both original and carousel-clone items for visual consistency
      .forEach(li => {
        const spans = li.querySelectorAll('span');
        const slotNameSpan = li.querySelector('.slot-name') || spans[0];
        
        if (slotNameSpan && slotNameSpan.textContent.trim() === slotName.trim()) {
          // Store payout data
          li.dataset.payout = safePayout.toString();
          
          // Update payout display span
          const payoutSpan = li.querySelector('.slot-payout');
          if (payoutSpan) {
            if (safePayout > 0) {
              payoutSpan.textContent = `€${safePayout.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}`;
              payoutSpan.style.color = '#00ffb8'; // Green for positive payout
            } else {
              payoutSpan.textContent = '€0.00';
              payoutSpan.style.color = '#ff5c5c'; // Red for zero payout
            }
          }
        }
      });
    
    // Update calculations
    renderBonusHuntResults();
  }

  // In renderPayoutStep, after payout is entered, call setBonusPayout
  function renderPayoutStep() {
    if (!payoutPanel) return;
    const bonus = payoutBonuses[payoutIndex];
    payoutPanel.innerHTML = `
      <div class="middle-panel-title" style="margin-bottom:1.2rem;">
        Enter Payout (${payoutIndex + 1}/${payoutBonuses.length})
      </div>
      <img src="${getSlotImage(bonus.name)}" alt="${bonus.name}" style="width:120px;height:80px;object-fit:cover;border-radius:12px;margin-bottom:12px;box-shadow:0 2px 8px 0 rgba(0,0,0,0.18);">
      <div style="color:#fff;font-weight:600;margin-bottom:12px;font-size:1.15rem;">${bonus.name}</div>
      <form id="payout-form" style="display:flex;gap:8px;margin-bottom:1.5rem;">
        <input
          id="payout-input"
          type="number"
          min="0"
          step="any"
          value="${bonus.payout !== null ? bonus.payout : ''}"
          placeholder="Enter payout"
          class="middle-input"
          style="width:140px;"
          autofocus
        />
        <button type="submit" class="middle-btn small-btn" style="width:auto;">
          OK
        </button>
      </form>
      <div style="flex:1"></div>
      <button id="cancel-payout-panel" class="middle-btn small-btn" style="margin-top:auto;background:#ff5c5c;color:#fff;">Cancel</button>
    `;

    const form = payoutPanel.querySelector('#payout-form');
    form.onsubmit = function (e) {
      e.preventDefault();
      const val = payoutPanel.querySelector('#payout-input').value;
      if (val && !isNaN(val)) {
        payoutBonuses[payoutIndex].payout = parseFloat(val);
        setBonusPayout(bonus.name, parseFloat(val)); // <-- update sidebar
        if (payoutIndex < payoutBonuses.length - 1) {
          payoutIndex++;
          renderPayoutStep();
        } else {
          document.body.removeChild(payoutPanel);
          payoutPanel = null;
          // Optionally: display results or update sidebar
          // Example: console.log(payoutBonuses);
        }
      }
    };

    payoutPanel.querySelector('#cancel-payout-panel').onclick = function () {
      document.body.removeChild(payoutPanel);
      payoutPanel = null;
      // Optionally: show the BH panel again
      const bhPanel = document.getElementById('middle-panel');
      if (bhPanel) bhPanel.style.display = 'flex';
    };
  }

  // Initial render on page load
  document.addEventListener('DOMContentLoaded', () => {
    // ...existing code...
    renderBonusHuntResults();
  });

  // --- Professional Carousel Animation for Bonus List ---
  function setupBonusListCarousel() {
    const bonusListUl = document.querySelector('.bonus-list ul');
    if (!bonusListUl) return;
    
    // Remove previous clones if any
    Array.from(bonusListUl.querySelectorAll('.carousel-clone')).forEach(clone => clone.remove());

    // Only clone the original items (not clones)
    const items = Array.from(bonusListUl.children).filter(li => !li.classList.contains('carousel-clone'));
    if (items.length === 0) return;

    // Clone all original li elements and append for seamless loop
    items.forEach(li => {
      const clone = li.cloneNode(true);
      clone.classList.add('carousel-clone');
      // Add a subtle opacity to clones to enhance the looping effect
      clone.style.opacity = '0.95';
      bonusListUl.appendChild(clone);
    });

    // Add smooth scroll behavior
    bonusListUl.style.scrollBehavior = 'smooth';
  }

  function updateBonusListCarousel() {
    setupBonusListCarousel();
    const bonusListUl = document.querySelector('.bonus-list ul');
    if (!bonusListUl) return;
    
    // Only count original items (not clones)
    const itemCount = Array.from(bonusListUl.children).filter(li => !li.classList.contains('carousel-clone')).length;
    
    // Professional timing: slower for better readability, adaptive to content
    let duration;
    if (itemCount <= 3) {
      // Fewer items: slower, more graceful movement
      duration = Math.max(15, itemCount * 5);
      bonusListUl.style.animationName = 'bonus-carousel-few-items';
    } else {
      // More items: standard professional speed
      duration = Math.max(18, itemCount * 3);
      bonusListUl.style.animationName = 'bonus-carousel-smooth';
    }
    
    bonusListUl.style.animationDuration = duration + 's';
    bonusListUl.style.animationTimingFunction = 'cubic-bezier(0.4, 0.0, 0.6, 1)';
    
    // Add intersection observer for performance optimization
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            bonusListUl.style.animationPlayState = 'running';
          } else {
            bonusListUl.style.animationPlayState = 'paused';
          }
        });
      }, { threshold: 0.1 });
      
      observer.observe(bonusListUl.closest('.bonus-list'));
    }
  }

  // Enhanced add-to-list logic with smooth transitions
  function addItemToCarousel(listItem) {
    const bonusListUl = document.querySelector('.bonus-list ul');
    if (!bonusListUl) return;
    
    // Add item with entrance animation
    listItem.style.opacity = '0';
    listItem.style.transform = 'translateY(20px)';
    listItem.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    
    bonusListUl.appendChild(listItem);
    
    // Trigger entrance animation
    requestAnimationFrame(() => {
      listItem.style.opacity = '1';
      listItem.style.transform = 'translateY(0)';
    });
    
    // Update carousel after animation
    setTimeout(() => {
      updateBonusListCarousel();
    }, 100);
  }

  // On page load, setup carousel if there are items
  document.addEventListener('DOMContentLoaded', () => {
    updateBonusListCarousel();
  });

  // --- Navbar Image Switcher ---
  const navbarImages = [
    {
      src: "https://i.imgur.com/KBHsq6S.png",
      alt: "C.balance"
    },
    {
      src: "https://i.imgur.com/bdpt4I7.png",
      alt: "Raw"
    },
    {
      src: "https://i.imgur.com/H5lK0WA.png",
      alt: "wager"
    }
  ];
  let navbarImageIndex = 0;
  const navbarImg = document.getElementById('navbar-image-switcher');
  const navbarLink = document.getElementById('navbar-image-link');
  function updateNavbarImage() {
    if (!navbarImg || !navbarLink) return;
    navbarImg.src = navbarImages[navbarImageIndex].src;
    navbarImg.alt = navbarImages[navbarImageIndex].alt;
    navbarLink.href = navbarImages[navbarImageIndex].link;
  }
  if (navbarImg && navbarLink) {
    navbarImg.addEventListener('click', (e) => {
      e.preventDefault();
      navbarImageIndex = (navbarImageIndex + 1) % navbarImages.length;
      updateNavbarImage();
    });
    // Also allow clicking the link to cycle (optional)
    navbarLink.addEventListener('click', (e) => {
      // Only cycle if clicking the image, not the link itself
      if (e.target === navbarImg) return;
      e.preventDefault();
      navbarImageIndex = (navbarImageIndex + 1) % navbarImages.length;
      updateNavbarImage();
    });
    updateNavbarImage();
  }

  // --- Slot Highlight Card (Bottom Left) ---
  let slotHighlightCard = null;
  function updateSlotHighlightCard() {
    // Only show if BO is active
    const boBtn = document.getElementById('bo-btn');
    if (!boBtn || !boBtn.classList.contains('active')) {
      if (slotHighlightCard) {
        slotHighlightCard.remove();
        slotHighlightCard = null;
      }
      return;
    }

    // Remove old card if present
    if (slotHighlightCard) {
      slotHighlightCard.remove();
      slotHighlightCard = null;
    }

    // Get bonus list data (with payouts)
    const bonusListUl = document.querySelector('.bonus-list ul');
    if (!bonusListUl) return;
    const bonuses = Array.from(bonusListUl.children)
      .filter(li => !li.classList.contains('carousel-clone'))
      .map(li => {
        const spans = li.querySelectorAll('span');
        return {
          name: spans[0] ? spans[0].textContent : '',
          bet: spans[1] ? parseFloat(spans[1].textContent.replace(/[^\d.]/g, '')) : 0,
          payout: li.dataset && li.dataset.payout ? parseFloat(li.dataset.payout) : null,
          img: li.querySelector('img') ? li.querySelector('img').src : DEFAULT_SLOT_IMAGE
        };
      });

    if (!bonuses.length) return;

    // Find best (highest payout), worst (lowest payout), and current (first with payout==null)
    let best = null, worst = null, current = null;
    const bonusesWithPayout = bonuses.filter(b => typeof b.payout === 'number' && !isNaN(b.payout));
    if (bonusesWithPayout.length) {
      best = bonusesWithPayout.reduce((a, b) => (b.payout > a.payout ? b : a), bonusesWithPayout[0]);
      worst = bonusesWithPayout.reduce((a, b) => (b.payout < a.payout ? b : a), bonusesWithPayout[0]);
    }
    current = bonuses.find(b => b.payout === null || isNaN(b.payout));

    // Always show 3 slots: left=best, middle=current, right=worst (even if some are the same)
    const slotsToShow = [
      best ? { ...best, type: 'best' } : null,
      current ? { ...current, type: 'current' } : null,
      worst ? { ...worst, type: 'worst' } : null
    ];

    // If all are null, don't show
    if (!slotsToShow[0] && !slotsToShow[1] && !slotsToShow[2]) return;

    // Card container (bigger, with gradient background)
    slotHighlightCard = document.createElement('div');
    slotHighlightCard.style.position = 'fixed';
    slotHighlightCard.style.left = '24px';
    slotHighlightCard.style.bottom = '8px';
    slotHighlightCard.style.width = '540px';
    slotHighlightCard.style.height = '210px';
    slotHighlightCard.style.background = 'linear-gradient(120deg, #23243a 0%, #3a2d4a 60%, #1a1c2e 100%)';
    slotHighlightCard.style.borderRadius = '32px';
    slotHighlightCard.style.boxShadow = '0 12px 48px 0 rgba(0,0,0,0.28), 0 2px 0 0 #00e1ff inset';
    slotHighlightCard.style.display = 'flex';
    slotHighlightCard.style.alignItems = 'center';
    slotHighlightCard.style.justifyContent = 'space-between';
    slotHighlightCard.style.zIndex = '1000';
    slotHighlightCard.style.padding = '0 38px';
    slotHighlightCard.style.gap = '0px';
    slotHighlightCard.style.border = '2.5px solid #23243a';
    slotHighlightCard.style.backdropFilter = 'blur(12px)';
    slotHighlightCard.style.transition = 'box-shadow 0.3s, background 0.3s, border-radius 0.3s';

    // Pill colors
    const pillColors = {
      best: '#00ff7a',
      current: '#ffe600',
      worst: '#ff3b7a'
    };
    const pillLabels = {
      best: 'Best',
      current: 'Current',
      worst: 'Worst'
    };

    // Helper to render a slot card (empty if slot is null)
    function renderSlot(slot, type) {
      // Outer container (bigger)
      const card = document.createElement('div');
      card.style.position = 'relative';
      card.style.width = '160px';
      card.style.height = '190px';
      card.style.borderRadius = '28px';
      card.style.overflow = 'hidden';
      card.style.background = '#23242a';
      card.style.display = 'flex';
      card.style.alignItems = 'center';
      card.style.justifyContent = 'center';
      card.style.boxShadow = '0 2px 12px 0 rgba(0,0,0,0.18)';
      card.style.margin = '0 8px';

      if (!slot) {
        // Empty placeholder
        card.style.opacity = '0.25';
        card.style.background = '#444';
        return card;
      }

      // Slot image fills card
      const img = document.createElement('img');
      img.src = slot.img;
      img.alt = slot.name;
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'cover';
      img.style.position = 'absolute';
      img.style.top = '0';
      img.style.left = '0';
      img.style.borderRadius = '28px';
      card.appendChild(img);

      // Top pill (type) - move higher (closer to top)
      const topPill = document.createElement('div');
      topPill.textContent = pillLabels[type];
      topPill.style.position = 'absolute';
      topPill.style.top = '3px'; // was 14px, now much closer to top
      topPill.style.left = '50%';
      topPill.style.transform = 'translateX(-50%)';
      topPill.style.background = pillColors[type];
      topPill.style.color = '#23242a';
      topPill.style.fontWeight = 'bold';
      topPill.style.fontSize = '1.0rem';
      topPill.style.padding = '6px 26px';
      topPill.style.borderRadius = '999px';
      topPill.style.boxShadow = '0 1px 8px 0 rgba(0,0,0,0.13)';
      topPill.style.letterSpacing = '0.5px';
      card.appendChild(topPill);

      // Bottom pill (payout)
      const payoutPill = document.createElement('div');
      payoutPill.textContent = typeof slot.payout === 'number' && !isNaN(slot.payout)
        ? `€${slot.payout.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}`
        : '--';
      payoutPill.style.position = 'absolute';
      payoutPill.style.bottom = '3px';
      payoutPill.style.left = '50%';
      payoutPill.style.transform = 'translateX(-50%)';
      payoutPill.style.background = '#f3f4f6';
      payoutPill.style.color = '#23242a';
      payoutPill.style.fontWeight = 'bold';
      payoutPill.style.fontSize = '1.0rem';
      payoutPill.style.padding = '7px 22px';
      payoutPill.style.borderRadius = '999px';
      payoutPill.style.boxShadow = '0 1px 8px 0 rgba(0,0,0,0.13)';
      payoutPill.style.letterSpacing = '0.5px';
      card.appendChild(payoutPill);

      return card;
    }

    // Render left (best), middle (current), right (worst)
    slotHighlightCard.appendChild(renderSlot(slotsToShow[0], 'best'));
    slotHighlightCard.appendChild(renderSlot(slotsToShow[1], 'current'));
    slotHighlightCard.appendChild(renderSlot(slotsToShow[2], 'worst'));

    document.body.appendChild(slotHighlightCard);
    
    // Make the slot highlight card draggable
    if (window.dragHandler) {
      window.dragHandler.makeDraggable(slotHighlightCard);
    }
  }

  // Call updateSlotHighlightCard whenever the bonus list or payouts change
  function patchSlotHighlightCardUpdates() {
    // After adding a bonus
    if (betSizeInput && slotNameInput && bonusListUl) {
      betSizeInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
          setTimeout(updateSlotHighlightCard, 50);
        }
      });
    }
    // After payout is set
    const origSetBonusPayout = setBonusPayout;
    setBonusPayout = function(slotName, payout) {
      origSetBonusPayout(slotName, payout);
      setTimeout(updateSlotHighlightCard, 50);
    };
    // On page load
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(updateSlotHighlightCard, 100);
    });
    // Also update when BO button is toggled
    const boBtn = document.getElementById('bo-btn');
    if (boBtn) {
      boBtn.addEventListener('click', () => {
        setTimeout(updateSlotHighlightCard, 50);
      });
    }
  }
  patchSlotHighlightCardUpdates();

  // --- Edit Slots Panel Logic ---
  const editSlotsBtn = document.getElementById('edit-slots-btn');
  let editSlotsPanel = null;

  function getBonusListUl() {
    return document.querySelector('.bonus-list ul');
  }

  function showEditSlotsPanel() {
    if (editSlotsPanel) return;
    const bonusListUl = getBonusListUl();
    if (!bonusListUl) return;
    // Only original items (not clones)
    const bonuses = Array.from(bonusListUl.children)
      .filter(li => !li.classList.contains('carousel-clone'))
      .map(li => {
        const spans = li.querySelectorAll('span');
        return {
          li,
          name: spans[0] ? spans[0].textContent : '',
          bet: spans[1] ? parseFloat(spans[1].textContent.replace(/[^\d.]/g, '')) : 0,
          img: li.querySelector('img') ? li.querySelector('img').src : ''
        };
      });

    // Create panel
    editSlotsPanel = document.createElement('div');
    editSlotsPanel.className = 'middle-panel';
    editSlotsPanel.style.display = 'flex';
    editSlotsPanel.style.flexDirection = 'column';
    editSlotsPanel.style.alignItems = 'center';
    editSlotsPanel.style.position = 'fixed';
    editSlotsPanel.style.top = '50%';
    editSlotsPanel.style.left = '50%';
    editSlotsPanel.style.transform = 'translate(-50%, -50%)';
    editSlotsPanel.style.zIndex = '1002';
    editSlotsPanel.style.background = 'rgba(36, 38, 48, 0.97)';
    editSlotsPanel.style.borderRadius = '24px';
    editSlotsPanel.style.boxShadow = '0 6px 24px 0 rgba(0,0,0,0.18)';
    editSlotsPanel.style.padding = '2rem 1.5rem';
    editSlotsPanel.style.width = '440px';
    editSlotsPanel.style.maxHeight = '480px';
    editSlotsPanel.style.overflowY = 'auto';

    // Build slot list with bin icon
    let html = `
      <div class="middle-panel-title" style="margin-bottom:1.2rem;">Edit Slots</div>
      <form id="edit-slots-form" style="width:100%;">
        <div id="edit-slots-list" style="display:flex;flex-direction:column;gap:1.1rem;">
    `;
    bonuses.forEach((bonus, idx) => {
      html += `
        <div class="edit-slot-row" style="display:flex;align-items:center;gap:0.7rem;" data-idx="${idx}">
          <img src="${bonus.img}" alt="" style="width:38px;height:38px;object-fit:cover;border-radius:8px;box-shadow:0 1px 4px 0 rgba(0,0,0,0.13);">
          <input type="text" class="middle-input" style="width:120px;" value="${bonus.name.replace(/"/g, '&quot;')}" data-idx="${idx}" data-type="name" />
          <input type="number" class="middle-input" style="width:90px;" value="${bonus.bet}" min="0" step="any" data-idx="${idx}" data-type="bet" />
          <button type="button" class="delete-slot-btn" title="Delete slot" style="background:none;border:none;cursor:pointer;padding:0 0.5rem;">
            <span style="font-size:1.5rem;color:#ff5c5c;">🗑️</span>
          </button>
        </div>
      `;
    });
    html += `
        </div>
        <div style="display:flex;gap:1rem;justify-content:center;margin-top:2.2rem;">
          <button type="submit" class="middle-btn small-btn" style="width:120px;">Save</button>
          <button type="button" id="close-edit-slots-btn" class="middle-btn small-btn" style="width:120px;background:#ff5c5c;color:#fff;">Close</button>
        </div>
      </form>
    `;
    editSlotsPanel.innerHTML = html;
    document.body.appendChild(editSlotsPanel);
    
    // Make the edit slots panel draggable
    if (window.dragHandler) {
      window.dragHandler.makeDraggable(editSlotsPanel);
    }

    // Delete slot logic
    editSlotsPanel.querySelectorAll('.delete-slot-btn').forEach((btn, i) => {
      btn.addEventListener('click', function() {
        // Remove from DOM
        const row = btn.closest('.edit-slot-row');
        if (row) row.remove();
        // Remove from bonus list UI
        if (bonuses[i] && bonuses[i].li && bonuses[i].li.parentNode) {
          bonuses[i].li.parentNode.removeChild(bonuses[i].li);
        }
        renderBonusHuntResults();
        updateBonusListCarousel();
        setTimeout(updateSlotHighlightCard, 50);
      });
    });

    // Save handler
    editSlotsPanel.querySelector('#edit-slots-form').onsubmit = function(e) {
      e.preventDefault();
      // Get all input values
      const nameInputs = editSlotsPanel.querySelectorAll('input[data-type="name"]');
      const betInputs = editSlotsPanel.querySelectorAll('input[data-type="bet"]');
      nameInputs.forEach((input, i) => {
        const idx = parseInt(input.dataset.idx, 10);
        // Only update if the row still exists (not deleted)
        const li = bonuses[idx] && bonuses[idx].li && document.body.contains(bonuses[idx].li) ? bonuses[idx].li : null;
        if (li) {
          const spans = li.querySelectorAll('span');
          if (spans[0]) spans[0].textContent = input.value;
        }
      });
      betInputs.forEach((input, i) => {
        const idx = parseInt(input.dataset.idx, 10);
        const li = bonuses[idx] && bonuses[idx].li && document.body.contains(bonuses[idx].li) ? bonuses[idx].li : null;
        if (li) {
          const spans = li.querySelectorAll('span');
          if (spans[1]) spans[1].textContent = '€' + (parseFloat(input.value) || 0).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2});
        }
      });
      renderBonusHuntResults();
      updateBonusListCarousel();
      setTimeout(updateSlotHighlightCard, 50);
      document.body.removeChild(editSlotsPanel);
      editSlotsPanel = null;
    };

    // Close handler
    editSlotsPanel.querySelector('#close-edit-slots-btn').onclick = function() {
      document.body.removeChild(editSlotsPanel);
      editSlotsPanel = null;
    };
  }

  if (editSlotsBtn) {
    editSlotsBtn.addEventListener('click', () => {
      showEditSlotsPanel();
    });
  }

  // --- Random Slot Picker Functionality ---
  let currentRandomSlot = null;
  let isShuffling = false;

  function getFilteredSlots() {
    const checkedProviders = Array.from(document.querySelectorAll('.provider-checkbox input:checked'))
      .map(cb => cb.value);
    
    return slotDatabase.filter(slot => checkedProviders.includes(slot.provider));
  }

  function getRandomSlot() {
    const filteredSlots = getFilteredSlots();
    if (filteredSlots.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * filteredSlots.length);
    return filteredSlots[randomIndex];
  }

  function updateRandomSlotDisplay(slot) {
    const slotCard = document.getElementById('random-slot-card');
    const slotImage = slotCard.querySelector('.slot-image');
    const slotName = slotCard.querySelector('.slot-name');
    const slotProvider = slotCard.querySelector('.slot-provider');

    if (slot) {
      slotImage.src = slot.image;
      slotImage.alt = slot.name;
      slotName.textContent = slot.name;
      slotProvider.textContent = slot.provider;
      currentRandomSlot = slot;
    } else {
      slotImage.src = 'https://i.imgur.com/8E3ucNx.png';
      slotName.textContent = 'No slots available';
      slotProvider.textContent = 'Check filter settings';
      currentRandomSlot = null;
    }
  }

  function shuffleSlot() {
    if (isShuffling) return;
    
    isShuffling = true;
    const slotCard = document.getElementById('random-slot-card');
    const shuffleBtn = document.getElementById('shuffle-slot-btn');
    
    slotCard.classList.add('shuffling');
    shuffleBtn.textContent = '🎲 Shuffling...';
    shuffleBtn.disabled = true;

    // Shuffle multiple times for effect
    let shuffleCount = 0;
    const maxShuffles = 8;
    
    const shuffleInterval = setInterval(() => {
      const randomSlot = getRandomSlot();
      if (randomSlot) {
        updateRandomSlotDisplay(randomSlot);
      }
      
      shuffleCount++;
      if (shuffleCount >= maxShuffles) {
        clearInterval(shuffleInterval);
        
        setTimeout(() => {
          slotCard.classList.remove('shuffling');
          shuffleBtn.innerHTML = '<span class="middle-icon">🎲</span><span>Shuffle Slot</span>';
          shuffleBtn.disabled = false;
          isShuffling = false;
        }, 300);
      }
    }, 100);
  }

  function useRandomSlot() {
    if (!currentRandomSlot) return;
    
    // Fill the slot name input in the BH panel
    const slotNameInput = document.getElementById('slot-name-input');
    if (slotNameInput) {
      slotNameInput.value = currentRandomSlot.name;
      slotNameInput.dispatchEvent(new Event('input'));
    }
    
    // Switch to BH panel
    const bhBtn = document.getElementById('bh-btn');
    const randomSlotBtn = document.getElementById('random-slot-btn');
    const middlePanel = document.getElementById('middle-panel');
    const randomSlotPanel = document.getElementById('random-slot-panel');
    
    if (bhBtn && middlePanel) {
      // Hide random slot panel
      randomSlotPanel.style.display = 'none';
      randomSlotPanelVisible = false;
      randomSlotBtn.classList.remove('active');
      
      // Show BH panel
      middlePanel.style.display = 'flex';
      panelVisible = true;
      bhBtn.classList.add('active');
      
      // Focus bet size input
      const betSizeInput = document.getElementById('bet-size-input');
      if (betSizeInput) {
        setTimeout(() => betSizeInput.focus(), 100);
      }
      
      updateInfoPanelVisibility();
    }
  }

  // Initialize random slot functionality
  const shuffleBtn = document.getElementById('shuffle-slot-btn');
  const useSlotBtn = document.getElementById('use-random-slot-btn');

  if (shuffleBtn) {
    shuffleBtn.addEventListener('click', shuffleSlot);
  }

  if (useSlotBtn) {
    useSlotBtn.addEventListener('click', useRandomSlot);
  }

  // Provider filter change handler
  document.addEventListener('change', (e) => {
    if (e.target.matches('.provider-checkbox input')) {
      // Update available slots count or show message if no slots available
      const filteredSlots = getFilteredSlots();
      if (filteredSlots.length === 0 && currentRandomSlot) {
        updateRandomSlotDisplay(null);
      }
    }
  });

  // Initialize with a random slot
  document.addEventListener('DOMContentLoaded', () => {
    const initialSlot = getRandomSlot();
    updateRandomSlotDisplay(initialSlot);
  });

  // Function to show selected slot in right-side display
  function showSelectedSlot(slot) {
    const selectedSlotDisplay = document.getElementById('selected-slot-display');
    const selectedSlotImage = document.getElementById('selected-slot-image');
    
    if (selectedSlotDisplay && selectedSlotImage && slot) {
      selectedSlotImage.src = slot.image || DEFAULT_SLOT_IMAGE;
      selectedSlotImage.alt = slot.name;
      
      selectedSlotDisplay.style.display = 'flex';
      selectedSlotDisplay.classList.add('visible');
    }
  }

  // Function to hide selected slot display
  function hideSelectedSlot() {
    const selectedSlotDisplay = document.getElementById('selected-slot-display');
    if (selectedSlotDisplay) {
      selectedSlotDisplay.style.display = 'none';
      selectedSlotDisplay.classList.remove('visible');
    }
  }

  // Show selected slot when slot name input changes
  if (slotNameInput) {
    slotNameInput.addEventListener('input', function() {
      const slotName = slotNameInput.value.trim();
      if (slotName) {
        const slot = slotDatabase.find(s => s.name.toLowerCase() === slotName.toLowerCase());
        if (slot) {
          showSelectedSlot(slot);
        } else {
          hideSelectedSlot();
        }
      } else {
        hideSelectedSlot();
      }
    });
    
    slotNameInput.addEventListener('blur', function() {
      // Keep the selected slot display visible even when input loses focus
      // Only hide when the input is actually empty
      const slotName = slotNameInput.value.trim();
      if (!slotName) {
        hideSelectedSlot();
      }
    });
  }

  // ==================== TOURNAMENT SYSTEM ====================
  
  // Tournament State Management
  let tournamentState = {
    isActive: false,
    participants: [],
    brackets: [],
    currentPhase: 0,
    currentMatch: 0,
    settings: {
      size: 8,
      format: 'single-elimination'
    },
    history: [],
    winner: null
  };

  // Tournament Class for better organization
  class TournamentManager {
    constructor() {
      this.state = tournamentState;
      this.initializeEventListeners();
      this.generateParticipantInputs();
    }

    // Initialize all tournament event listeners
    initializeEventListeners() {
      // Tournament size change
      const sizeSelect = document.getElementById('tournament-size');
      if (sizeSelect) {
        sizeSelect.addEventListener('change', (e) => {
          this.state.settings.size = parseInt(e.target.value);
          this.generateParticipantInputs();
          this.updateParticipantCount();
        });
      }

      // Tournament format change
      const formatSelect = document.getElementById('tournament-format');
      if (formatSelect) {
        formatSelect.addEventListener('change', (e) => {
          this.state.settings.format = e.target.value;
        });
      }

      // Quick fill buttons
      document.getElementById('fill-random-slots')?.addEventListener('click', () => this.fillRandomPlayersAndSlots());
      document.getElementById('clear-all-participants')?.addEventListener('click', () => this.clearAllParticipants());
      document.getElementById('import-participants')?.addEventListener('click', () => this.importParticipants());

      // Tournament actions
      document.getElementById('start-tournament-btn')?.addEventListener('click', () => this.startTournament());
      document.getElementById('validate-tournament-btn')?.addEventListener('click', () => this.validateSetup());
      document.getElementById('save-template-btn')?.addEventListener('click', () => this.saveTemplate());

      // Control panel actions
      document.getElementById('prev-match-btn')?.addEventListener('click', () => this.previousMatch());
      document.getElementById('next-match-btn')?.addEventListener('click', () => this.nextMatch());
      document.getElementById('determine-winner-btn')?.addEventListener('click', () => this.determineWinner());
      document.getElementById('reset-match-btn')?.addEventListener('click', () => this.resetCurrentMatch());
      document.getElementById('advance-phase-btn')?.addEventListener('click', () => this.advancePhase());
      document.getElementById('end-tournament-btn')?.addEventListener('click', () => this.endTournament());
    }

    // Generate participant input fields based on tournament size
    generateParticipantInputs() {
      const grid = document.getElementById('participants-grid');
      if (!grid) return;

      grid.innerHTML = '';
      
      for (let i = 0; i < this.state.settings.size; i++) {
        const participantEntry = document.createElement('div');
        participantEntry.className = 'participant-entry';
        participantEntry.innerHTML = `
          <div class="participant-number">Player ${i + 1}</div>
          <input type="text" class="participant-input" placeholder="Enter player name" data-index="${i}">
          <div class="slot-input-container">
            <input type="text" class="slot-input" placeholder="Enter slot name" data-index="${i}">
            <div class="slot-suggestion-dropdown" style="display: none;"></div>
          </div>
        `;
        grid.appendChild(participantEntry);

        // Add event listeners for this participant
        const playerInput = participantEntry.querySelector('.participant-input');
        const slotInput = participantEntry.querySelector('.slot-input');

        playerInput.addEventListener('input', () => this.onParticipantChange());
        slotInput.addEventListener('input', (e) => this.onSlotInputChange(e, i));
        
        // Mark as filled when both fields have values
        const updateFilledState = () => {
          const isFilled = playerInput.value.trim() && slotInput.value.trim();
          participantEntry.classList.toggle('filled', isFilled);
          this.updateParticipantCount();
        };

        playerInput.addEventListener('input', updateFilledState);
        slotInput.addEventListener('input', updateFilledState);
      }

      this.updateParticipantCount();
    }

    // Handle slot input changes and show suggestions
    onSlotInputChange(event, index) {
      const input = event.target;
      const query = input.value.trim().toLowerCase();
      const dropdown = input.parentElement.querySelector('.slot-suggestion-dropdown');

      if (query.length < 2) {
        dropdown.style.display = 'none';
        return;
      }

      // Get slot suggestions (assuming slotDatabase exists)
      let suggestions = [];
      if (typeof slotDatabase !== 'undefined' && slotDatabase.length > 0) {
        suggestions = slotDatabase
          .filter(slot => slot.name.toLowerCase().includes(query))
          .slice(0, 5);
      } else {
        // Fallback suggestions
        const fallbackSlots = [
          { name: 'Book of Dead', provider: 'Play\'n GO' },
          { name: 'Starburst', provider: 'NetEnt' },
          { name: 'Sweet Bonanza', provider: 'Pragmatic Play' },
          { name: 'Gates of Olympus', provider: 'Pragmatic Play' },
          { name: 'The Dog House', provider: 'Pragmatic Play' }
        ];
        suggestions = fallbackSlots.filter(slot => slot.name.toLowerCase().includes(query));
      }

      if (suggestions.length > 0) {
        dropdown.innerHTML = suggestions.map(slot => `
          <div class="slot-suggestion-item" data-slot-name="${slot.name}">
            <span class="slot-suggestion-name">${slot.name}</span>
            <span class="slot-suggestion-provider">${slot.provider}</span>
          </div>
        `).join('');

        // Add click handlers for suggestions
        dropdown.querySelectorAll('.slot-suggestion-item').forEach(item => {
          item.addEventListener('click', () => {
            input.value = item.dataset.slotName;
            dropdown.style.display = 'none';
            this.onParticipantChange();
          });
        });

        dropdown.style.display = 'block';
      } else {
        dropdown.style.display = 'none';
      }
    }

    // Update participant count display
    updateParticipantCount() {
      const participants = this.getValidParticipants();
      const countDisplay = document.getElementById('participant-count');
      if (countDisplay) {
        countDisplay.textContent = `(${participants.length}/${this.state.settings.size})`;
      }

      // Enable/disable start button based on participant count
      const startBtn = document.getElementById('start-tournament-btn');
      if (startBtn) {
        const canStart = participants.length >= 2;
        startBtn.disabled = !canStart;
        startBtn.title = canStart ? '' : 'Need at least 2 participants to start';
      }
    }

    // Handle participant input changes
    onParticipantChange() {
      this.updateParticipantCount();
      // Hide dropdowns when typing in player names
      document.querySelectorAll('.slot-suggestion-dropdown').forEach(dropdown => {
        dropdown.style.display = 'none';
      });
    }

    // Get all valid participants
    getValidParticipants() {
      const participants = [];
      const playerInputs = document.querySelectorAll('.participant-input');
      const slotInputs = document.querySelectorAll('.slot-input');

      for (let i = 0; i < playerInputs.length; i++) {
        const player = playerInputs[i].value.trim();
        const slot = slotInputs[i].value.trim();

        if (player && slot) {
          participants.push({
            id: i + 1,
            player: player,
            slot: slot,
            eliminated: false
          });
        }
      }

      return participants;
    }

    // Fill random slots
    fillRandomSlots() {
      const slotInputs = document.querySelectorAll('.slot-input');
      
      // Use slot database if available, otherwise fallback
      let availableSlots = [];
      if (typeof slotDatabase !== 'undefined' && slotDatabase.length > 0) {
        availableSlots = slotDatabase.map(slot => slot.name);
      } else {
        availableSlots = [
          'Book of Dead', 'Starburst', 'Gonzo\'s Quest', 'Reactoonz', 'Sweet Bonanza',
          'The Dog House', 'Gates of Olympus', 'Dead or Wild', 'Money Train 2', 'Razor Shark',
          'Jammin\' Jars', 'Buffalo King', 'Rise of Olympus', 'Moon Princess', 'Viking Runecraft'
        ];
      }

      // Shuffle and assign
      const shuffled = [...availableSlots].sort(() => 0.5 - Math.random());
      
      slotInputs.forEach((input, index) => {
        if (index < shuffled.length) {
          input.value = shuffled[index];
          input.dispatchEvent(new Event('input'));
        }
      });

      this.showFeedback('fill-random-slots', 'Random slots filled!', 'success');
    }

    // Fill random players and slots
    fillRandomPlayersAndSlots() {
      const playerInputs = document.querySelectorAll('.participant-input');
      const slotInputs = document.querySelectorAll('.slot-input');
      
      // Random player names
      const randomNames = [
        'ProGamer', 'SlotMaster', 'LuckyStreamer', 'BigWinner', 'CasinoKing', 'SpinLord', 
        'BonusHunter', 'RollMaster', 'WildCard', 'MegaSpin', 'JackpotJoe', 'LuckyLuke',
        'SpinDoctor', 'SlotBeast', 'CasinoAce', 'MegaWin', 'BonusKing', 'SpinMaster',
        'LuckyCharm', 'SlotHero', 'WinWizard', 'CasinoLord', 'SpinLegend', 'BonusBoss'
      ];
      
      // Use slot database if available, otherwise fallback
      let availableSlots = [];
      if (typeof slotDatabase !== 'undefined' && slotDatabase.length > 0) {
        availableSlots = slotDatabase.map(slot => slot.name);
      } else {
        availableSlots = [
          'Book of Dead', 'Starburst', 'Gonzo\'s Quest', 'Reactoonz', 'Sweet Bonanza',
          'The Dog House', 'Gates of Olympus', 'Dead or Wild', 'Money Train 2', 'Razor Shark',
          'Jammin\' Jars', 'Buffalo King', 'Rise of Olympus', 'Moon Princess', 'Viking Runecraft'
        ];
      }

      // Shuffle both arrays
      const shuffledNames = [...randomNames].sort(() => 0.5 - Math.random());
      const shuffledSlots = [...availableSlots].sort(() => 0.5 - Math.random());
      
      // Fill player names
      playerInputs.forEach((input, index) => {
        if (index < shuffledNames.length) {
          input.value = shuffledNames[index];
          input.dispatchEvent(new Event('input'));
        }
      });

      // Fill slot names
      slotInputs.forEach((input, index) => {
        if (index < shuffledSlots.length) {
          input.value = shuffledSlots[index];
          input.dispatchEvent(new Event('input'));
        }
      });

      this.showFeedback('fill-random-slots', 'Random players and slots filled!', 'success');
    }

    // Clear all participants
    clearAllParticipants() {
      const playerInputs = document.querySelectorAll('.participant-input');
      const slotInputs = document.querySelectorAll('.slot-input');

      playerInputs.forEach(input => {
        input.value = '';
        input.dispatchEvent(new Event('input'));
      });

      slotInputs.forEach(input => {
        input.value = '';
        input.dispatchEvent(new Event('input'));
      });

      this.showFeedback('clear-all-participants', 'All participants cleared!', 'success');
    }

    // Import participants (placeholder)
    importParticipants() {
      // For now, fill with demo data
      const demoPlayers = ['ProGamer', 'SlotMaster', 'LuckyStreamer', 'BigWinner', 'CasinoKing', 'SpinLord', 'BonusHunter', 'RollMaster'];
      const demoSlots = ['Book of Dead', 'Starburst', 'Sweet Bonanza', 'Gates of Olympus', 'The Dog House', 'Money Train 2', 'Razor Shark', 'Jammin\' Jars'];

      const playerInputs = document.querySelectorAll('.participant-input');
      const slotInputs = document.querySelectorAll('.slot-input');

      playerInputs.forEach((input, index) => {
        if (index < demoPlayers.length) {
          input.value = demoPlayers[index];
          input.dispatchEvent(new Event('input'));
        }
      });

      slotInputs.forEach((input, index) => {
        if (index < demoSlots.length) {
          input.value = demoSlots[index];
          input.dispatchEvent(new Event('input'));
        }
      });

      this.showFeedback('import-participants', 'Demo data imported!', 'success');
    }

    // Validate tournament setup
    validateSetup() {
      const participants = this.getValidParticipants();
      const issues = [];

      if (participants.length < 2) {
        issues.push('Need at least 2 participants');
      }

      // Check for duplicate names
      const playerNames = participants.map(p => p.player.toLowerCase());
      const duplicatePlayers = playerNames.filter((name, index) => playerNames.indexOf(name) !== index);
      if (duplicatePlayers.length > 0) {
        issues.push('Duplicate player names detected');
      }

      // Check for duplicate slots
      const slotNames = participants.map(p => p.slot.toLowerCase());
      const duplicateSlots = slotNames.filter((slot, index) => slotNames.indexOf(slot) !== index);
      if (duplicateSlots.length > 0) {
        issues.push('Duplicate slot names detected');
      }

      if (issues.length === 0) {
        this.showFeedback('validate-tournament-btn', 'Setup validated successfully!', 'success');
        document.getElementById('start-tournament-btn').disabled = false;
      } else {
        this.showFeedback('validate-tournament-btn', `Issues found: ${issues.join(', ')}`, 'error');
      }
    }

    // Save tournament template (placeholder)
    saveTemplate() {
      const participants = this.getValidParticipants();
      const template = {
        settings: this.state.settings,
        participants: participants
      };

      // Save to localStorage
      localStorage.setItem('tournament-template', JSON.stringify(template));
      this.showFeedback('save-template-btn', 'Template saved!', 'success');
    }

    // Start tournament
    startTournament() {
      const participants = this.getValidParticipants();
      
      if (participants.length < 2) {
        this.showFeedback('start-tournament-btn', 'Need at least 2 participants!', 'error');
        return;
      }

      // Initialize tournament state
      this.state.isActive = true;
      this.state.participants = [...participants];
      this.state.currentPhase = 0;
      this.state.currentMatch = 0;
      this.state.history = [];
      this.state.winner = null;

      // Generate tournament brackets
      this.generateBrackets();

      // Switch to control panel
      this.showControlPanel();
      
      // Delay bracket display to ensure DOM is ready
      setTimeout(() => {
        this.showTournamentBracket();
        this.updateControlPanel();
      }, 100);

      this.showFeedback('start-tournament-btn', 'Tournament started!', 'success');
    }

    // Generate tournament brackets
    generateBrackets() {
      const participants = [...this.state.participants];
      
      // Shuffle participants for randomness
      for (let i = participants.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [participants[i], participants[j]] = [participants[j], participants[i]];
      }

      this.state.brackets = [];
      let currentRound = participants;

      // Generate all rounds
      while (currentRound.length > 1) {
        const matches = [];
        const nextRound = [];

        // Create matches for current round
        for (let i = 0; i < currentRound.length; i += 2) {
          if (i + 1 < currentRound.length) {
            matches.push({
              id: matches.length,
              participant1: currentRound[i],
              participant2: currentRound[i + 1],
              winner: null,
              loser: null,
              completed: false,
              bet1: 0,
              payout1: 0,
              bet2: 0,
              payout2: 0
            });
            nextRound.push(null); // Placeholder for winner
          } else {
            // Bye - participant advances automatically
            matches.push({
              id: matches.length,
              participant1: currentRound[i],
              participant2: null,
              winner: currentRound[i],
              loser: null,
              completed: true,
              bet1: 0,
              payout1: 0,
              bet2: 0,
              payout2: 0
            });
            nextRound.push(currentRound[i]);
          }
        }

        // Determine phase name
        let phaseName = '';
        if (matches.length === 1) phaseName = 'Final';
        else if (matches.length === 2) phaseName = 'Semi-Finals';
        else if (matches.length === 4) phaseName = 'Quarter-Finals';
        else phaseName = `Round of ${matches.length * 2}`;

        this.state.brackets.push({
          phase: this.state.brackets.length,
          name: phaseName,
          matches: matches,
          completed: false
        });

        currentRound = nextRound;
      }
    }

    // Show control panel
    showControlPanel() {
      const setupPanel = document.getElementById('tournament-panel');
      const controlPanel = document.getElementById('tournament-control-panel');
      const infoPanel = document.querySelector('.info-panel');

      if (setupPanel) setupPanel.style.display = 'none';
      if (controlPanel) controlPanel.style.display = 'flex';
      
      // Ensure info panel (right sidebar) is visible for bracket display
      if (infoPanel) {
        infoPanel.classList.add('info-panel--visible');
      }
    }

    // Show tournament bracket in right panel
    showTournamentBracket() {
      // Make sure info panel is visible
      const infoPanel = document.querySelector('.info-panel');
      if (infoPanel) {
        infoPanel.classList.add('info-panel--visible');
      }

      const bracket = document.getElementById('tournament-bracket');
      if (bracket) {
        bracket.style.display = 'block';
      }

      // Hide other info sections during tournament
      const bonusHuntResults = document.getElementById('bonus-hunt-results');
      const bonusList = document.querySelector('.info-section.bonus-list');
      const discordSection = document.querySelector('.info-section.discord');
      const moneyRowMain = document.querySelector('.money-row-main');
      
      if (bonusHuntResults) bonusHuntResults.style.display = 'none';
      if (bonusList) bonusList.style.display = 'none';
      if (discordSection) discordSection.style.display = 'none';
      if (moneyRowMain) moneyRowMain.style.display = 'none';

      this.updateBracketDisplay();
    }

    // Update control panel display
    updateControlPanel() {
      if (!this.state.isActive || !this.state.brackets.length) return;

      const currentBracket = this.state.brackets[this.state.currentPhase];
      const currentMatch = currentBracket.matches[this.state.currentMatch];

      // Update status
      const statusPhase = document.getElementById('status-phase');
      const statusProgress = document.getElementById('status-progress');
      
      if (statusPhase) statusPhase.textContent = currentBracket.name;
      if (statusProgress) {
        statusProgress.textContent = `Match ${this.state.currentMatch + 1} of ${currentBracket.matches.length}`;
      }

      // Update match title
      const matchTitle = document.getElementById('match-title');
      if (matchTitle) {
        matchTitle.textContent = `${currentBracket.name} - Match ${this.state.currentMatch + 1}`;
      }

      // Update contestants
      this.updateContestantDisplay(currentMatch);

      // Update button states
      this.updateControlButtons();
    }

    // Update contestant display
    updateContestantDisplay(match) {
      if (!match) return;

      // Contestant 1
      const contestant1Name = document.getElementById('contestant-1-name');
      const contestant1Slot = document.getElementById('contestant-1-slot');
      const contestant1Img = document.getElementById('contestant-1-img');
      const contestant1Bet = document.getElementById('contestant-1-bet');
      const contestant1Payout = document.getElementById('contestant-1-payout');
      const contestant1Multiplier = document.getElementById('contestant-1-multiplier');
      const contestant1Card = document.getElementById('contestant-1-card');

      if (match.participant1) {
        if (contestant1Name) contestant1Name.textContent = match.participant1.player;
        if (contestant1Slot) contestant1Slot.textContent = match.participant1.slot;
        if (contestant1Img) {
          contestant1Img.src = this.getSlotImage(match.participant1.slot);
          contestant1Img.alt = match.participant1.slot;
        }
        if (contestant1Bet) {
          contestant1Bet.value = match.bet1 || '';
          contestant1Bet.addEventListener('input', () => this.updateMultiplier(1, match));
        }
        if (contestant1Payout) {
          contestant1Payout.value = match.payout1 || '';
          contestant1Payout.addEventListener('input', () => this.updateMultiplier(1, match));
        }
        this.updateMultiplier(1, match);
      }

      // Contestant 2
      const contestant2Name = document.getElementById('contestant-2-name');
      const contestant2Slot = document.getElementById('contestant-2-slot');
      const contestant2Img = document.getElementById('contestant-2-img');
      const contestant2Bet = document.getElementById('contestant-2-bet');
      const contestant2Payout = document.getElementById('contestant-2-payout');
      const contestant2Multiplier = document.getElementById('contestant-2-multiplier');
      const contestant2Card = document.getElementById('contestant-2-card');

      if (match.participant2) {
        if (contestant2Name) contestant2Name.textContent = match.participant2.player;
        if (contestant2Slot) contestant2Slot.textContent = match.participant2.slot;
        if (contestant2Img) {
          contestant2Img.src = this.getSlotImage(match.participant2.slot);
          contestant2Img.alt = match.participant2.slot;
        }
        if (contestant2Bet) {
          contestant2Bet.value = match.bet2 || '';
          contestant2Bet.addEventListener('input', () => this.updateMultiplier(2, match));
        }
        if (contestant2Payout) {
          contestant2Payout.value = match.payout2 || '';
          contestant2Payout.addEventListener('input', () => this.updateMultiplier(2, match));
        }
        this.updateMultiplier(2, match);
      }

      // Update winner indicators
      this.updateWinnerIndicators(match);
    }

    // Update multiplier display
    updateMultiplier(contestantNumber, match) {
      const betInput = document.getElementById(`contestant-${contestantNumber}-bet`);
      const payoutInput = document.getElementById(`contestant-${contestantNumber}-payout`);
      const multiplierDisplay = document.getElementById(`contestant-${contestantNumber}-multiplier`);

      if (betInput && payoutInput && multiplierDisplay) {
        const bet = parseFloat(betInput.value) || 0;
        const payout = parseFloat(payoutInput.value) || 0;
        const multiplier = bet > 0 ? (payout / bet) : 0;

        multiplierDisplay.textContent = `${multiplier.toFixed(2)}x`;

        // Store values in match
        if (contestantNumber === 1) {
          match.bet1 = bet;
          match.payout1 = payout;
        } else {
          match.bet2 = bet;
          match.payout2 = payout;
        }
      }
    }

    // Update winner indicators
    updateWinnerIndicators(match) {
      const indicator1 = document.getElementById('winner-indicator-1');
      const indicator2 = document.getElementById('winner-indicator-2');
      const card1 = document.getElementById('contestant-1-card');
      const card2 = document.getElementById('contestant-2-card');

      // Reset
      if (indicator1) indicator1.classList.remove('visible');
      if (indicator2) indicator2.classList.remove('visible');
      if (card1) card1.classList.remove('winner');
      if (card2) card2.classList.remove('winner');

      // Show winner
      if (match.winner) {
        if (match.winner === match.participant1) {
          if (indicator1) indicator1.classList.add('visible');
          if (card1) card1.classList.add('winner');
        } else if (match.winner === match.participant2) {
          if (indicator2) indicator2.classList.add('visible');
          if (card2) card2.classList.add('winner');
        }
      }
    }

    // Update control buttons
    updateControlButtons() {
      const prevBtn = document.getElementById('prev-match-btn');
      const nextBtn = document.getElementById('next-match-btn');
      const advanceBtn = document.getElementById('advance-phase-btn');

      const currentBracket = this.state.brackets[this.state.currentPhase];
      
      if (prevBtn) {
        prevBtn.disabled = this.state.currentMatch === 0;
      }

      if (nextBtn) {
        nextBtn.disabled = this.state.currentMatch >= currentBracket.matches.length - 1;
      }

      if (advanceBtn) {
        const allMatchesComplete = currentBracket.matches.every(match => match.completed);
        const isLastPhase = this.state.currentPhase >= this.state.brackets.length - 1;
        
        advanceBtn.disabled = !allMatchesComplete;
        
        if (isLastPhase && allMatchesComplete) {
          advanceBtn.innerHTML = '<span>🏆</span> Tournament Complete';
        } else if (allMatchesComplete) {
          advanceBtn.innerHTML = '<span>⚡</span> Advance to Next Phase';
        } else {
          advanceBtn.innerHTML = '<span>⚡</span> Complete All Matches First';
        }
      }
    }

    // Navigate to previous match
    previousMatch() {
      if (this.state.currentMatch > 0) {
        this.state.currentMatch--;
        this.updateControlPanel();
      }
    }

    // Navigate to next match
    nextMatch() {
      const currentBracket = this.state.brackets[this.state.currentPhase];
      if (this.state.currentMatch < currentBracket.matches.length - 1) {
        this.state.currentMatch++;
        this.updateControlPanel();
      }
    }

    // Determine match winner
    determineWinner() {
      const currentBracket = this.state.brackets[this.state.currentPhase];
      const currentMatch = currentBracket.matches[this.state.currentMatch];

      if (!currentMatch || currentMatch.completed) return;

      // Auto bye
      if (!currentMatch.participant2) {
        currentMatch.winner = currentMatch.participant1;
        currentMatch.completed = true;
        this.updateControlPanel();
        this.addToHistory(currentMatch, 'BYE');
        return;
      }

      const bet1 = currentMatch.bet1 || 0;
      const payout1 = currentMatch.payout1 || 0;
      const bet2 = currentMatch.bet2 || 0;
      const payout2 = currentMatch.payout2 || 0;

      if (bet1 <= 0 || bet2 <= 0) {
        this.showFeedback('determine-winner-btn', 'Enter valid bet amounts!', 'error');
        return;
      }

      const multiplier1 = payout1 / bet1;
      const multiplier2 = payout2 / bet2;

      if (multiplier1 > multiplier2) {
        currentMatch.winner = currentMatch.participant1;
        currentMatch.loser = currentMatch.participant2;
      } else if (multiplier2 > multiplier1) {
        currentMatch.winner = currentMatch.participant2;
        currentMatch.loser = currentMatch.participant1;
      } else {
        this.showFeedback('determine-winner-btn', 'Cannot have a tie! Adjust payouts.', 'error');
        return;
      }

      currentMatch.completed = true;
      this.updateControlPanel();
      this.updateBracketDisplay();
      this.addToHistory(currentMatch, 'COMPLETED');
      
      this.showFeedback('determine-winner-btn', `Winner: ${currentMatch.winner.player}!`, 'success');
    }

    // Reset current match
    resetCurrentMatch() {
      const currentBracket = this.state.brackets[this.state.currentPhase];
      const currentMatch = currentBracket.matches[this.state.currentMatch];

      if (!currentMatch) return;

      currentMatch.winner = null;
      currentMatch.loser = null;
      currentMatch.completed = false;
      currentMatch.bet1 = 0;
      currentMatch.payout1 = 0;
      currentMatch.bet2 = 0;
      currentMatch.payout2 = 0;

      this.updateControlPanel();
      this.updateBracketDisplay();
      this.showFeedback('reset-match-btn', 'Match reset!', 'success');
    }

    // Advance to next phase
    advancePhase() {
      const currentBracket = this.state.brackets[this.state.currentPhase];
      
      // Check if all matches are complete
      const allComplete = currentBracket.matches.every(match => match.completed);
      if (!allComplete) {
        this.showFeedback('advance-phase-btn', 'Complete all matches first!', 'error');
        return;
      }

      // Mark current phase as completed
      currentBracket.completed = true;

      // Check if tournament is complete
      if (this.state.currentPhase >= this.state.brackets.length - 1) {
        this.completeTournament();
        return;
      }

      // Advance winners to next phase
      const winners = currentBracket.matches.map(match => match.winner).filter(w => w !== null);
      const nextBracket = this.state.brackets[this.state.currentPhase + 1];

      // Update next phase matches with winners
      let winnerIndex = 0;
      nextBracket.matches.forEach(match => {
        if (winners[winnerIndex]) match.participant1 = winners[winnerIndex++];
        if (winners[winnerIndex]) match.participant2 = winners[winnerIndex++];
      });

      // Move to next phase
      this.state.currentPhase++;
      this.state.currentMatch = 0;

      this.updateControlPanel();
      this.updateBracketDisplay();
      this.showFeedback('advance-phase-btn', `Advancing to ${nextBracket.name}!`, 'success');
    }

    // Complete tournament
    completeTournament() {
      const finalBracket = this.state.brackets[this.state.brackets.length - 1];
      const finalMatch = finalBracket.matches[0];
      
      if (finalMatch && finalMatch.winner) {
        this.state.winner = finalMatch.winner;
        this.showFeedback('advance-phase-btn', `🏆 ${this.state.winner.player} wins the tournament!`, 'success');
        
        // Update bracket to show champion
        this.updateBracketDisplay();
      }
    }

    // End tournament
    endTournament() {
      if (!confirm('Are you sure you want to end the tournament?')) return;

      // Reset state
      this.state.isActive = false;
      this.state.participants = [];
      this.state.brackets = [];
      this.state.currentPhase = 0;
      this.state.currentMatch = 0;
      this.state.history = [];
      this.state.winner = null;

      // Hide control panel and bracket
      const controlPanel = document.getElementById('tournament-control-panel');
      const setupPanel = document.getElementById('tournament-panel');
      const bracket = document.getElementById('tournament-bracket');

      if (controlPanel) controlPanel.style.display = 'none';
      if (setupPanel) setupPanel.style.display = 'flex';
      if (bracket) bracket.style.display = 'none';

      // Show other info sections again
      const bonusHuntResults = document.getElementById('bonus-hunt-results');
      const bonusList = document.querySelector('.info-section.bonus-list');
      const moneyRowMain = document.querySelector('.money-row-main');
      if (bonusHuntResults) bonusHuntResults.style.display = 'block';
      if (bonusList) bonusList.style.display = 'block';
      if (moneyRowMain) moneyRowMain.style.display = 'flex';

      this.showFeedback('end-tournament-btn', 'Tournament ended!', 'success');
    }

    // Update bracket display in right panel - Traditional Tournament Tree
    updateBracketDisplay() {
      const bracketContent = document.getElementById('tournament-bracket-content');
      const formatDisplay = document.getElementById('tournament-format-display');
      const playersCount = document.getElementById('tournament-players-count');
      const currentPhase = document.getElementById('tournament-current-phase');

      if (!bracketContent || !this.state.isActive) {
        return;
      }

      // Hide overview section - we don't need it
      const overviewSection = document.querySelector('.tournament-overview');
      if (overviewSection) overviewSection.style.display = 'none';

      // Show winner if tournament is complete
      if (this.state.winner) {
        bracketContent.innerHTML = `
          <div class="tournament-champion">
            <div class="champion-crown">👑</div>
            <img src="${this.getSlotImage(this.state.winner.slot)}" alt="${this.state.winner.slot}" class="champion-slot-icon">
            <div class="champion-name">${this.state.winner.player}</div>
            <div class="champion-slot">${this.state.winner.slot}</div>
          </div>
        `;
        return;
      }

      // Show only current phase - no scrolling needed
      const currentBracket = this.state.brackets[this.state.currentPhase];
      
      let html = '<div class="tournament-tree">';
      html += `<div class="tree-column">`;
      html += `<div class="column-header">${currentBracket.name}</div>`;
        
      currentBracket.matches.forEach((match, matchIndex) => {
        const isCurrentMatch = matchIndex === this.state.currentMatch;
        
        html += `
          <div class="tree-match ${match.completed ? 'completed' : ''} ${isCurrentMatch ? 'active' : ''}">
        `;
        
        html += `<div class="tree-match-horizontal">`;
        
        // Player 1
        if (match.participant1) {
          html += `
            <div class="tree-player ${match.winner === match.participant1 ? 'winner' : ''}">
              <div class="tree-player-name">${match.participant1.player}</div>
              <img src="${this.getSlotImage(match.participant1.slot)}" class="tree-slot-icon">
              <div class="tree-slot-name">${match.participant1.slot}</div>
            </div>
          `;
        }
        
        // VS or BYE
        if (match.participant2) {
          html += `<div class="tree-vs">VS</div>`;
        } else if (match.participant1) {
          html += `<div class="tree-vs">BYE</div>`;
        }
        
        // Player 2
        if (match.participant2) {
          html += `
            <div class="tree-player ${match.winner === match.participant2 ? 'winner' : ''}">
              <div class="tree-player-name">${match.participant2.player}</div>
              <img src="${this.getSlotImage(match.participant2.slot)}" class="tree-slot-icon">
              <div class="tree-slot-name">${match.participant2.slot}</div>
            </div>
          `;
        }
        
        html += `</div>`;
        html += `</div>`;
      });
      
      html += `</div>`;
      html += '</div>';
      bracketContent.innerHTML = html;
      
      // Add click handlers for matches
      this.addBracketInteractivity();
    }

    // Add bracket view toggle functionality
    addBracketViewToggle() {
      const bracketHeader = document.querySelector('.tournament-bracket-header');
      if (!bracketHeader || document.getElementById('bracket-view-toggle')) return;
      
      const toggleButton = document.createElement('button');
      toggleButton.id = 'bracket-view-toggle';
      toggleButton.className = 'bracket-control-btn';
      toggleButton.innerHTML = '🌳';
      toggleButton.title = 'Toggle Tree View';
      
      const controls = bracketHeader.querySelector('.bracket-controls');
      if (controls) {
        controls.appendChild(toggleButton);
        
        toggleButton.addEventListener('click', () => {
          this.toggleBracketView();
        });
      }
    }

    // Toggle between list and tree bracket views
    toggleBracketView() {
      const bracketContent = document.getElementById('tournament-bracket-content');
      const toggleButton = document.getElementById('bracket-view-toggle');
      
      if (!bracketContent || !toggleButton) return;
      
      const isTreeView = bracketContent.classList.contains('tree-view');
      
      if (isTreeView) {
        // Switch to list view
        bracketContent.classList.remove('tree-view');
        toggleButton.innerHTML = '🌳';
        toggleButton.title = 'Toggle Tree View';
        this.updateBracketDisplay(); // Refresh with list view
      } else {
        // Switch to tree view
        bracketContent.classList.add('tree-view');
        toggleButton.innerHTML = '📋';
        toggleButton.title = 'Toggle List View';
        this.createTreeBracketView();
      }
    }

    // Create tree-style bracket visualization
    createTreeBracketView() {
      const bracketContent = document.getElementById('tournament-bracket-content');
      if (!bracketContent || !this.state.isActive) return;
      
      // Calculate tournament rounds
      const totalParticipants = this.state.participants.length;
      const rounds = Math.ceil(Math.log2(totalParticipants));
      
      let html = '<div class=\"tournament-tree\">';
      
      // Build tree from final backwards
      for (let round = rounds - 1; round >= 0; round--) {
        const roundName = this.state.brackets[round]?.name || `Round ${round + 1}`;
        const matches = this.state.brackets[round]?.matches || [];
        
        html += `<div class=\"tree-round\" data-round=\"${round}\">`;
        html += `<div class=\"tree-round-title\">${roundName}</div>`;
        html += `<div class=\"tree-matches\">`;
        
        matches.forEach((match, matchIndex) => {
          const isActive = round === this.state.currentPhase && matchIndex === this.state.currentMatch;
          
          html += `<div class=\"tree-match ${match.completed ? 'completed' : ''} ${isActive ? 'active' : ''}\">`;
          
          if (match.participant1) {
            html += `
              <div class=\"tree-participant ${match.winner === match.participant1 ? 'winner' : ''}\">
                <img src=\"${this.getSlotImage(match.participant1.slot)}\" class=\"tree-slot-icon\">
                <div class=\"tree-participant-info\">
                  <div class=\"tree-participant-name\">${match.participant1.player}</div>
                  <div class=\"tree-participant-slot\">${match.participant1.slot}</div>
                </div>
              </div>
            `;
          }
          
          if (match.participant2) {
            html += `
              <div class=\"tree-participant ${match.winner === match.participant2 ? 'winner' : ''}\">
                <img src=\"${this.getSlotImage(match.participant2.slot)}\" class=\"tree-slot-icon\">
                <div class=\"tree-participant-info\">
                  <div class=\"tree-participant-name\">${match.participant2.player}</div>
                  <div class=\"tree-participant-slot\">${match.participant2.slot}</div>
                </div>
              </div>
            `;
          } else if (match.participant1) {
            html += `<div class=\"tree-bye\">BYE</div>`;
          }
          
          html += `</div>`; // tree-match
        });
        
        html += `</div></div>`; // tree-matches, tree-round
      }
      
      html += '</div>'; // tournament-tree
      
      bracketContent.innerHTML = html;
    }

    // Add interactivity to bracket matches
    addBracketInteractivity() {
      const matches = document.querySelectorAll('.bracket-match');
      matches.forEach((matchElement, globalIndex) => {
        matchElement.addEventListener('click', (e) => {
          e.preventDefault();
          this.jumpToMatch(globalIndex);
        });
        
        // Add hover effects
        matchElement.addEventListener('mouseenter', () => {
          if (!matchElement.classList.contains('completed')) {
            matchElement.style.transform = 'translateY(-2px)';
            matchElement.style.boxShadow = '0 8px 24px rgba(0, 225, 255, 0.2)';
          }
        });
        
        matchElement.addEventListener('mouseleave', () => {
          if (!matchElement.classList.contains('active')) {
            matchElement.style.transform = '';
            matchElement.style.boxShadow = '';
          }
        });
      });
    }

    // Jump to specific match in control panel
    jumpToMatch(globalMatchIndex) {
      let currentIndex = 0;
      
      for (let phaseIndex = 0; phaseIndex < this.state.brackets.length; phaseIndex++) {
        const phase = this.state.brackets[phaseIndex];
        
        if (currentIndex + phase.matches.length > globalMatchIndex) {
          // Found the phase
          this.state.currentPhase = phaseIndex;
          this.state.currentMatch = globalMatchIndex - currentIndex;
          
          // Show control panel and update display
          this.showControlPanel();
          this.updateControlPanel();
          this.updateBracketDisplay();
          
          // Visual feedback
          const jumpFeedback = document.createElement('div');
          jumpFeedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 225, 255, 0.9);
            color: white;
            padding: 0.8rem 1.2rem;
            border-radius: 8px;
            font-weight: 600;
            z-index: 10000;
            animation: fadeInOut 2s ease-in-out forwards;
          `;
          jumpFeedback.textContent = `Jumped to ${phase.name} - Match ${this.state.currentMatch + 1}`;
          document.body.appendChild(jumpFeedback);
          
          // Add CSS animation
          const style = document.createElement('style');
          style.textContent = `
            @keyframes fadeInOut {
              0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
              20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
              80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
              100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
            }
          `;
          document.head.appendChild(style);
          
          setTimeout(() => {
            document.body.removeChild(jumpFeedback);
            document.head.removeChild(style);
          }, 2000);
          
          return;
        }
        
        currentIndex += phase.matches.length;
      }
    }

    // Add match to history
    addToHistory(match, type) {
      this.state.history.push({
        timestamp: new Date(),
        phase: this.state.brackets[this.state.currentPhase].name,
        match: match,
        type: type
      });
    }

    // Get slot image URL
    getSlotImage(slotName) {
      // Try to find in slot database
      if (typeof slotDatabase !== 'undefined' && slotDatabase.length > 0) {
        const slot = slotDatabase.find(s => s.name.toLowerCase() === slotName.toLowerCase());
        if (slot && slot.image) return slot.image;
      }
      
      // Fallback image
      return 'https://i.imgur.com/8E3ucNx.png';
    }

    // Show feedback on buttons
    showFeedback(buttonId, message, type = 'info') {
      const button = document.getElementById(buttonId);
      if (!button) return;

      const originalContent = button.innerHTML;
      const originalStyle = button.style.background;

      // Update button appearance
      button.innerHTML = message;
      
      switch (type) {
        case 'success':
          button.style.background = 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)';
          break;
        case 'error':
          button.style.background = 'linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%)';
          break;
        default:
          button.style.background = 'linear-gradient(135deg, #00e1ff 0%, #9147ff 100%)';
      }

      // Reset after delay
      setTimeout(() => {
        button.innerHTML = originalContent;
        button.style.background = originalStyle;
      }, 2000);
    }
  }

  // Initialize tournament system after class definition
  tournamentManager = new TournamentManager();







  // ==================== END TOURNAMENT SYSTEM ====================
});

// Set your fallback slot image here:
const DEFAULT_SLOT_IMAGE = 'https://i.imgur.com/8E3ucNx.png';



// Drag functionality for all panels
class DragHandler {
  constructor() {
    this.isDragging = false;
    this.currentElement = null;
    this.offset = { x: 0, y: 0 };
    this.originalPositions = new Map();
    this.init();
  }

  init() {
    // Make all panels draggable
    const draggableSelectors = [
      '.navbar',
      '.info-panel', 
      '.middle-panel',
      '.bottom-panel',
      '.tournament-panel',
      '.tournament-control-panel',
      '.draggable-image-container'
    ];

    draggableSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        this.makeDraggable(element);
      });
    });
  }

  makeDraggable(element) {
    // Don't make sidebar draggable
    if (element.classList.contains('sidebar') || element.closest('.sidebar')) {
      return;
    }
    
    // Add draggable cursor style
    element.style.cursor = 'move';
    
    // Store original position but don't change position yet
    if (!this.originalPositions.has(element)) {
      const rect = element.getBoundingClientRect();
      this.originalPositions.set(element, {
        left: rect.left,
        top: rect.top,
        position: getComputedStyle(element).position
      });
    }
    
    // Only make position absolute when dragging starts
    element.addEventListener('mousedown', (e) => this.startDrag(e, element));
    element.addEventListener('touchstart', (e) => this.startDrag(e, element), { passive: false });
  }

  startDrag(e, element) {
    // Check if dragging is locked
    if (window.isDragLocked) {
      return;
    }
    
    // Don't drag if clicking on interactive elements or sidebar buttons
    const interactiveElements = ['INPUT', 'BUTTON', 'SELECT', 'TEXTAREA', 'A', 'LABEL'];
    if (interactiveElements.includes(e.target.tagName) || 
        e.target.closest('input, button, select, textarea, a, label') ||
        e.target.closest('.sidebar-btn')) {
      return;
    }
    
    e.preventDefault();
    
    this.isDragging = true;
    this.currentElement = element;
    
    // Only now convert to absolute positioning for dragging
    const rect = element.getBoundingClientRect();
    element.style.position = 'absolute';
    element.style.left = rect.left + 'px';
    element.style.top = rect.top + 'px';
    
    // Get touch or mouse position
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    // Calculate offset from element's top-left corner
    this.offset.x = clientX - rect.left;
    this.offset.y = clientY - rect.top;
    
    // Add visual feedback
    element.style.opacity = '0.8';
    element.style.zIndex = '10000';
    element.style.transition = 'none';
    
    // Add event listeners
    document.addEventListener('mousemove', this.drag.bind(this));
    document.addEventListener('mouseup', this.stopDrag.bind(this));
    document.addEventListener('touchmove', this.drag.bind(this), { passive: false });
    document.addEventListener('touchend', this.stopDrag.bind(this));
  }

  drag(e) {
    if (!this.isDragging || !this.currentElement) return;
    
    e.preventDefault();
    
    // Get touch or mouse position
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    // Calculate new position
    let newX = clientX - this.offset.x;
    let newY = clientY - this.offset.y;
    
    // Apply new position (no bounds checking - allow free movement)
    this.currentElement.style.left = newX + 'px';
    this.currentElement.style.top = newY + 'px';
  }

  stopDrag() {
    if (!this.isDragging) return;
    
    this.isDragging = false;
    
    if (this.currentElement) {
      // Remove visual feedback
      this.currentElement.style.opacity = '';
      this.currentElement.style.zIndex = '';
      this.currentElement.style.transition = '';
    }
    
    this.currentElement = null;
    
    // Remove event listeners
    document.removeEventListener('mousemove', this.drag.bind(this));
    document.removeEventListener('mouseup', this.stopDrag.bind(this));
    document.removeEventListener('touchmove', this.drag.bind(this));
    document.removeEventListener('touchend', this.stopDrag.bind(this));
  }
}

// Initialize drag functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize drag lock state
  window.isDragLocked = false;
  
  window.dragHandler = new DragHandler();
  
  // Function to update editing element states based on lock
  function updateEditingElementsState() {
    const navbarLogo = document.getElementById('navbar-logo');
    const streamerNameSpan = document.getElementById('streamer-name');
    const websiteText = document.getElementById('website-text');
    
    const isLocked = window.isDragLocked;
    const cursor = isLocked ? 'default' : 'pointer';
    const opacity = isLocked ? '0.7' : '1';
    
    if (navbarLogo) {
      navbarLogo.style.cursor = cursor;
      navbarLogo.style.opacity = opacity;
      navbarLogo.title = isLocked ? 'Unlock to edit logo' : 'Click to change logo';
    }
    
    if (streamerNameSpan) {
      streamerNameSpan.style.cursor = cursor;
      streamerNameSpan.style.opacity = opacity;
      streamerNameSpan.title = isLocked ? 'Unlock to edit streamer name' : 'Click to edit streamer name';
    }
    
    if (websiteText) {
      websiteText.style.cursor = cursor;
      websiteText.style.opacity = opacity;
      websiteText.title = isLocked ? 'Unlock to edit website URL' : 'Click to edit website URL';
    }
  }
  
  // Lock button functionality
  const lockBtn = document.getElementById('lock-btn');
  const lockIcon = document.getElementById('lock-icon');
  
  if (lockBtn && lockIcon) {
    lockBtn.addEventListener('click', () => {
      window.isDragLocked = !window.isDragLocked;
      lockIcon.src = window.isDragLocked ? '../assets/lock.png' : '../assets/unlock.png';
      
      // Visual feedback
      lockBtn.classList.toggle('active', window.isDragLocked);
      
      // Update editing elements visual state
      updateEditingElementsState();
      
      console.log('Drag lock state:', window.isDragLocked ? 'LOCKED' : 'UNLOCKED');
    });
    
    // Initialize editing elements state on page load
    setTimeout(updateEditingElementsState, 100);
  }
  
  // --- Customization Panel ---
  const customizationBtn = document.getElementById('customization-btn');
  const customizationPanel = document.getElementById('customization-panel');
  const customizationClose = document.getElementById('customization-close');
  
  if (customizationBtn && customizationPanel) {
    customizationBtn.addEventListener('click', () => {
      customizationPanel.style.display = 'flex';
      loadCurrentSettings();
    });
  }
  
  if (customizationClose) {
    customizationClose.addEventListener('click', () => {
      customizationPanel.style.display = 'none';
    });
  }
  
  // Close panel when clicking outside
  if (customizationPanel) {
    customizationPanel.addEventListener('click', (e) => {
      if (e.target === customizationPanel) {
        customizationPanel.style.display = 'none';
      }
    });
  }
  
  // Load current settings into the panel
  function loadCurrentSettings() {
    const streamerNameInput = document.getElementById('custom-streamer-name');
    const websiteUrlInput = document.getElementById('custom-website-url');
    const primaryColorInput = document.getElementById('primary-color');
    const accentColorInput = document.getElementById('accent-color');
    const backgroundColorInput = document.getElementById('background-color');
    const textColorInput = document.getElementById('text-color');
    const cardBackgroundInput = document.getElementById('card-background-color');
    const streamerNameColorInput = document.getElementById('streamer-name-color');
    const websiteColorInput = document.getElementById('website-color');
    const gambleAwareColorInput = document.getElementById('gamble-aware-color');
    const glassEffectToggle = document.getElementById('glass-effect-toggle');
    const glassOpacity = document.getElementById('glass-opacity');
    const glassBlur = document.getElementById('glass-blur');
    
    // Load saved values or defaults
    if (streamerNameInput) {
      streamerNameInput.value = localStorage.getItem('customStreamerName') || 'Osecaadegas95';
    }
    if (websiteUrlInput) {
      websiteUrlInput.value = localStorage.getItem('customWebsiteUrl') || 'https://osecaadegas.github.io/95/';
    }
    if (primaryColorInput) {
      primaryColorInput.value = localStorage.getItem('customPrimaryColor') || '#9346ff';
    }
    if (accentColorInput) {
      accentColorInput.value = localStorage.getItem('customAccentColor') || '#00e1ff';
    }
    if (backgroundColorInput) {
      backgroundColorInput.value = localStorage.getItem('customBackgroundColor') || '#1a1b2e';
    }
    if (textColorInput) {
      textColorInput.value = localStorage.getItem('customTextColor') || '#ffffff';
    }
    if (streamerNameColorInput) {
      streamerNameColorInput.value = localStorage.getItem('customStreamerNameColor') || '#ffffff';
    }
    if (websiteColorInput) {
      websiteColorInput.value = localStorage.getItem('customWebsiteColor') || '#ffffff';
    }
    if (gambleAwareColorInput) {
      gambleAwareColorInput.value = localStorage.getItem('customGambleAwareColor') || '#ffffff';
    }
    if (glassEffectToggle) {
      glassEffectToggle.checked = localStorage.getItem('glassEffectEnabled') === 'true';
    }
  }
  
  // Background type switcher
  const backgroundTypeSelect = document.getElementById('background-type');
  const gradientControls = document.getElementById('gradient-controls');
  const imageControls = document.getElementById('image-controls');
  
  if (backgroundTypeSelect) {
    backgroundTypeSelect.addEventListener('change', () => {
      const type = backgroundTypeSelect.value;
      if (gradientControls) gradientControls.style.display = type === 'gradient' ? 'flex' : 'none';
      if (imageControls) imageControls.style.display = type === 'image' ? 'flex' : 'none';
    });
  }
  
  // Helper function to convert hex to RGB
  // Functions moved to top of file to prevent scope errors
  
  // Glass effect controls
  const glassEffectToggle = document.getElementById('glass-effect-toggle');
  const glassOpacity = document.getElementById('glass-opacity');
  const glassBlur = document.getElementById('glass-blur');
  
  function toggleGlassControls() {
    const glassOpacityRow = document.getElementById('glass-opacity-row');
    const glassBlurRow = document.getElementById('glass-blur-row');
    const isEnabled = glassEffectToggle && glassEffectToggle.checked;
    
    if (glassOpacityRow) glassOpacityRow.style.display = isEnabled ? 'flex' : 'none';
    if (glassBlurRow) glassBlurRow.style.display = isEnabled ? 'flex' : 'none';
  }
  
  if (glassEffectToggle) {
    glassEffectToggle.addEventListener('change', () => {
      toggleGlassControls();
      localStorage.setItem('glassEffectEnabled', glassEffectToggle.checked);
      
      // Apply glass effect immediately
      const primaryColor = localStorage.getItem('customPrimaryColor') || '#9346ff';
      const accentColor = localStorage.getItem('customAccentColor') || '#00e1ff';
      const backgroundColor = localStorage.getItem('customBackgroundColor') || '#1a1b2e';
      const textColor = localStorage.getItem('customTextColor') || '#ffffff';
      applyUIColors(primaryColor, accentColor, backgroundColor, textColor);
    });
  }
  
  if (glassOpacity) {
    glassOpacity.addEventListener('input', () => {
      const value = glassOpacity.value;
      document.getElementById('glass-opacity-value').textContent = Math.round(value * 100) + '%';
      localStorage.setItem('glassOpacity', value);
      
      // Apply changes immediately
      const primaryColor = localStorage.getItem('customPrimaryColor') || '#9346ff';
      const accentColor = localStorage.getItem('customAccentColor') || '#00e1ff';
      const backgroundColor = localStorage.getItem('customBackgroundColor') || '#1a1b2e';
      const textColor = localStorage.getItem('customTextColor') || '#ffffff';
      applyUIColors(primaryColor, accentColor, backgroundColor, textColor);
    });
  }
  
  if (glassBlur) {
    glassBlur.addEventListener('input', () => {
      const value = glassBlur.value;
      document.getElementById('glass-blur-value').textContent = value + 'px';
      localStorage.setItem('glassBlur', value);
      
      // Apply changes immediately
      const primaryColor = localStorage.getItem('customPrimaryColor') || '#9346ff';
      const accentColor = localStorage.getItem('customAccentColor') || '#00e1ff';
      const backgroundColor = localStorage.getItem('customBackgroundColor') || '#1a1b2e';
      const textColor = localStorage.getItem('customTextColor') || '#ffffff';
      applyUIColors(primaryColor, accentColor, backgroundColor, textColor);
    });
  }
  
  // File upload handlers will be initialized in the delayed customization setup
  
  // Apply customization
  const applyBtn = document.getElementById('apply-customization');
  if (applyBtn) {
    applyBtn.addEventListener('click', applyCustomization);
  }
  
  // Reset functions
  const resetLogoBtn = document.getElementById('reset-logo-btn');
  const resetBgBtn = document.getElementById('reset-bg-btn');
  const resetAllBtn = document.getElementById('reset-all-btn');
  
  if (resetLogoBtn) {
    resetLogoBtn.addEventListener('click', () => {
      localStorage.removeItem('customNavbarLogo');
      const navbarLogo = document.getElementById('navbar-logo');
      if (navbarLogo) navbarLogo.src = 'https://static.twitchcdn.net/assets/favicon-32-e29e246c157142c94346.png';
    });
  }
  
  if (resetBgBtn) {
    resetBgBtn.addEventListener('click', () => {
      localStorage.removeItem('customBackgroundImage');
      // Remove custom background class to restore star animations
      document.body.classList.remove('custom-background');
      // Clear custom background styles
      document.body.style.removeProperty('background');
      document.body.style.removeProperty('background-image');
      document.body.style.removeProperty('background-size');
      document.body.style.removeProperty('background-position');
      document.body.style.removeProperty('background-repeat');
      document.body.style.removeProperty('background-attachment');
      console.log('Background reset to default');
    });
  }
  
  if (resetAllBtn) {
    resetAllBtn.addEventListener('click', () => {
      if (confirm('Reset all customizations to default?')) {
        // Clear all custom settings
        const customKeys = [
          'customStreamerName', 'customWebsiteUrl', 'customWebsiteText',
          'customNavbarLogo', 'customPrimaryColor', 'customAccentColor',
          'customBackgroundColor', 'customTextColor', 'customBackgroundImage',
          'customCardBackground', 'customStreamerNameColor', 'customWebsiteColor',
          'customGambleAwareColor', 'glassEffectEnabled', 'glassOpacity', 'glassBlur'
        ];
        customKeys.forEach(key => localStorage.removeItem(key));
        
        // Remove custom theme class to restore default styling
        document.body.classList.remove('custom-theme');
        
        // Reload page to apply defaults
        location.reload();
      }
    });
  }
  
  // Theme presets
  const themePresets = document.querySelectorAll('.theme-preset');
  themePresets.forEach(preset => {
    preset.addEventListener('click', () => {
      const theme = preset.dataset.theme;
      applyThemePreset(theme);
      
      // Update active state
      themePresets.forEach(p => p.classList.remove('active'));
      preset.classList.add('active');
    });
  });
  
  function applyCustomization() {
    const streamerName = document.getElementById('custom-streamer-name')?.value;
    const websiteUrl = document.getElementById('custom-website-url')?.value;
    const primaryColor = document.getElementById('primary-color')?.value;
    const accentColor = document.getElementById('accent-color')?.value;
    const backgroundColor = document.getElementById('background-color')?.value;
    const textColor = document.getElementById('text-color')?.value;
    const streamerNameColor = document.getElementById('streamer-name-color')?.value;
    const websiteColor = document.getElementById('website-color')?.value;
    const gambleAwareColor = document.getElementById('gamble-aware-color')?.value;
    const glassEffectToggle = document.getElementById('glass-effect-toggle')?.checked;
    
    // Apply streamer name
    if (streamerName) {
      const streamerNameSpan = document.getElementById('streamer-name');
      if (streamerNameSpan) streamerNameSpan.textContent = streamerName;
      localStorage.setItem('customStreamerName', streamerName);
    }
    
    // Apply website URL
    if (websiteUrl) {
      const websiteLink = document.getElementById('website-link');
      const websiteText = document.getElementById('website-text');
      if (websiteLink) websiteLink.href = websiteUrl;
      if (websiteText) {
        const displayText = websiteUrl.replace(/^https?:\/\//, '');
        websiteText.textContent = displayText;
        localStorage.setItem('customWebsiteText', displayText);
      }
      localStorage.setItem('customWebsiteUrl', websiteUrl);
    }
    
    // Apply colors
    applyColorScheme(primaryColor, accentColor, backgroundColor, textColor);
    
    // Save all colors and glass effect
    localStorage.setItem('customPrimaryColor', primaryColor);
    localStorage.setItem('customAccentColor', accentColor);
    localStorage.setItem('customBackgroundColor', backgroundColor);
    localStorage.setItem('customTextColor', textColor);
    localStorage.setItem('customStreamerNameColor', streamerNameColor);
    localStorage.setItem('customWebsiteColor', websiteColor);
    localStorage.setItem('customGambleAwareColor', gambleAwareColor);
    localStorage.setItem('glassEffectEnabled', glassEffectToggle);
    
    // Re-apply background image if it exists (after color scheme application)
    const savedBackgroundImage = localStorage.getItem('customBackgroundImage');
    if (savedBackgroundImage) {
      setTimeout(() => {
        applyBackgroundImage(savedBackgroundImage);
        console.log('Background image re-applied after customization');
      }, 100);
    }
    
    customizationPanel.style.display = 'none';
  }
  
  function applyBackgroundImage(imageSrc) {
    console.log('Applying background image:', imageSrc ? 'Image data found' : 'No image data');
    
    if (!imageSrc) {
      console.warn('No image source provided to applyBackgroundImage');
      return;
    }
    
    // Add a class to body to hide star animations
    document.body.classList.add('custom-background');
    
    // Clear any existing background first and use setProperty with important
    document.body.style.setProperty('background', '', 'important');
    document.body.style.setProperty('background-color', '', 'important');
    
    // Apply the background image with !important to override CSS
    document.body.style.setProperty('background-image', `url("${imageSrc}")`, 'important');
    document.body.style.setProperty('background-size', 'cover', 'important');
    document.body.style.setProperty('background-position', 'center', 'important');
    document.body.style.setProperty('background-repeat', 'no-repeat', 'important');
    document.body.style.setProperty('background-attachment', 'fixed', 'important');
    
    // Force a repaint to ensure the background shows immediately
    document.body.offsetHeight;
    
    console.log('Background image applied successfully with !important');
    
    // Provide visual feedback that the background was applied
    const customizationPanel = document.getElementById('customization-panel');
    if (customizationPanel && customizationPanel.style.display === 'flex') {
      // Show a brief success message
      const successMsg = document.createElement('div');
      successMsg.textContent = 'Background applied successfully!';
      successMsg.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(0, 225, 255, 0.9);
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        font-weight: 600;
        z-index: 10000;
        transition: opacity 0.3s ease;
      `;
      document.body.appendChild(successMsg);
      
      setTimeout(() => {
        successMsg.style.opacity = '0';
        setTimeout(() => successMsg.remove(), 300);
      }, 2000);
    }
  }
  
  function applyThemePreset(theme) {
    const themes = {
      default: { 
        primary: '#9346ff', accent: '#00e1ff', background: '#1a1b2e', text: '#ffffff',
        cardBg: '#2a2b3d', streamerName: '#00e1ff', website: '#9346ff', gambleAware: '#ff6b6b'
      },
      purple: { 
        primary: '#8b5cf6', accent: '#a78bfa', background: '#1e1b4b', text: '#ffffff',
        cardBg: '#2d1b69', streamerName: '#a78bfa', website: '#8b5cf6', gambleAware: '#f87171'
      },
      blue: { 
        primary: '#3b82f6', accent: '#60a5fa', background: '#1e3a8a', text: '#ffffff',
        cardBg: '#1e40af', streamerName: '#60a5fa', website: '#3b82f6', gambleAware: '#ef4444'
      },
      green: { 
        primary: '#10b981', accent: '#34d399', background: '#064e3b', text: '#ffffff',
        cardBg: '#065f46', streamerName: '#34d399', website: '#10b981', gambleAware: '#f59e0b'
      },
      red: { 
        primary: '#ef4444', accent: '#f87171', background: '#7f1d1d', text: '#ffffff',
        cardBg: '#991b1b', streamerName: '#f87171', website: '#ef4444', gambleAware: '#fbbf24'
      },
      dark: { 
        primary: '#6b7280', accent: '#9ca3af', background: '#111827', text: '#f9fafb',
        cardBg: '#1f2937', streamerName: '#9ca3af', website: '#6b7280', gambleAware: '#f59e0b'
      }
    };
    
    const selectedTheme = themes[theme];
    if (selectedTheme) {
      // Update all color inputs safely
      const primaryColorInput = document.getElementById('primary-color');
      const accentColorInput = document.getElementById('accent-color');
      const backgroundColorInput = document.getElementById('background-color');
      const textColorInput = document.getElementById('text-color');
      const streamerNameColorInput = document.getElementById('streamer-name-color');
      const websiteColorInput = document.getElementById('website-color');
      const gambleAwareColorInput = document.getElementById('gamble-aware-color');
      
      if (primaryColorInput) primaryColorInput.value = selectedTheme.primary;
      if (accentColorInput) accentColorInput.value = selectedTheme.accent;
      if (backgroundColorInput) backgroundColorInput.value = selectedTheme.background;
      if (textColorInput) textColorInput.value = selectedTheme.text;
      if (streamerNameColorInput) streamerNameColorInput.value = selectedTheme.streamerName;
      if (websiteColorInput) websiteColorInput.value = selectedTheme.website;
      if (gambleAwareColorInput) gambleAwareColorInput.value = selectedTheme.gambleAware;
      
      // Apply the theme immediately
      applyColorScheme(selectedTheme.primary, selectedTheme.accent, selectedTheme.background, selectedTheme.text);
    }
  }
  
  // Load saved customizations on page load
  function loadSavedCustomizations() {
    console.log('Loading saved customizations...');
    const primaryColor = localStorage.getItem('customPrimaryColor');
    const accentColor = localStorage.getItem('customAccentColor');
    const backgroundColor = localStorage.getItem('customBackgroundColor');
    const textColor = localStorage.getItem('customTextColor');
    const backgroundImage = localStorage.getItem('customBackgroundImage');
    
    console.log('Saved background image found:', !!backgroundImage);
    
    if (primaryColor && accentColor && backgroundColor && textColor) {
      console.log('Applying saved color scheme...');
      applyColorScheme(primaryColor, accentColor, backgroundColor, textColor);
    }
    
    if (backgroundImage) {
      console.log('Applying saved background image...');
      applyBackgroundImage(backgroundImage);
    }
    
    // Also apply colors when new elements are dynamically created
    setTimeout(() => {
      if (primaryColor && accentColor && backgroundColor && textColor) {
        applyUIColors(primaryColor, accentColor, backgroundColor, textColor);
      }
      // Re-apply background image after UI colors to ensure it's not overridden
      if (backgroundImage) {
        console.log('Re-applying background image after UI color update...');
        applyBackgroundImage(backgroundImage);
      }
    }, 500);
  }
  
  // Initialize customizations
  setTimeout(loadSavedCustomizations, 100);
  
  // Re-initialize drag for dynamically created panels
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) { // Element node
          const draggableSelectors = [
            '.tournament-panel',
            '.tournament-control-panel'
          ];
          
          draggableSelectors.forEach(selector => {
            if (node.matches && node.matches(selector)) {
              window.dragHandler.makeDraggable(node);
              console.log('Made dynamically created panel draggable:', selector);
            }
            
            const elements = node.querySelectorAll && node.querySelectorAll(selector);
            if (elements) {
              elements.forEach(element => {
                window.dragHandler.makeDraggable(element);
                console.log('Made nested panel draggable:', selector);
              });
            }
          });
        }
      });
    });
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
});

// Modern Circular Sidebar with Fan Effect
document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.querySelector('.sidebar');
  const sidebarToggle = document.getElementById('sidebar-toggle');
  let isOpen = false;

  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleSidebar();
    });

    // Close sidebar when clicking outside
    document.addEventListener('click', (e) => {
      if (isOpen && !sidebar.contains(e.target)) {
        closeSidebar();
      }
    });

    // Prevent sidebar from closing when clicking on fan buttons
    sidebar.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  function toggleSidebar() {
    isOpen = !isOpen;
    if (isOpen) {
      openSidebar();
    } else {
      closeSidebar();
    }
  }

  function openSidebar() {
    isOpen = true;
    sidebar.classList.add('open');
    sidebarToggle.classList.add('active');
    
    // Add a subtle animation delay for each button
    const buttons = sidebar.querySelectorAll('.sidebar-btn');
    buttons.forEach((btn, index) => {
      btn.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Apply custom colors if they exist
    setTimeout(() => {
      const primaryColor = localStorage.getItem('customPrimaryColor');
      const accentColor = localStorage.getItem('customAccentColor');
      const backgroundColor = localStorage.getItem('customBackgroundColor');
      const textColor = localStorage.getItem('customTextColor');
      
      if (primaryColor && accentColor && backgroundColor && textColor) {
        applyUIColors(primaryColor, accentColor, backgroundColor, textColor);
      }
    }, 100);
  }

  function closeSidebar() {
    isOpen = false;
    sidebar.classList.remove('open');
    sidebarToggle.classList.remove('active');
    
    // Reset animation delays
    const buttons = sidebar.querySelectorAll('.sidebar-btn');
    buttons.forEach((btn) => {
      btn.style.animationDelay = '';
    });
  }

  // Add click handlers for individual buttons to close sidebar after action
  const sidebarButtons = sidebar.querySelectorAll('.sidebar-btn');
  sidebarButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Small delay to allow the button action to complete
      setTimeout(() => {
        closeSidebar();
      }, 300);
    });
  });
  
  // Initialize customization panel
  setTimeout(() => {
    const customizationBtn = document.getElementById('customization-btn');
    const customizationPanel = document.getElementById('customization-panel');
    
    console.log('Checking customization elements...');
    console.log('Button found:', !!customizationBtn);
    console.log('Panel found:', !!customizationPanel);
    
    if (customizationBtn && customizationPanel) {
      customizationBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        console.log('Customization button clicked!');
        customizationPanel.style.display = 'flex';
        
        // Load current settings
        const streamerNameInput = document.getElementById('custom-streamer-name');
        const websiteUrlInput = document.getElementById('custom-website-url');
        
        if (streamerNameInput) {
          streamerNameInput.value = localStorage.getItem('customStreamerName') || 'Osecaadegas95';
        }
        if (websiteUrlInput) {
          websiteUrlInput.value = localStorage.getItem('customWebsiteUrl') || 'https://osecaadegas.github.io/95/';
        }
      });
      
      // Close button
      const customizationClose = document.getElementById('customization-close');
      if (customizationClose) {
        customizationClose.addEventListener('click', () => {
          customizationPanel.style.display = 'none';
        });
      }
      
      // Close when clicking outside
      customizationPanel.addEventListener('click', (e) => {
        if (e.target === customizationPanel) {
          customizationPanel.style.display = 'none';
        }
      });
      
      // Apply saved color scheme on page load only if customizations exist
      const savedPrimary = localStorage.getItem('customPrimaryColor');
      const savedAccent = localStorage.getItem('customAccentColor');
      const savedBackground = localStorage.getItem('customBackgroundColor');
      const savedText = localStorage.getItem('customTextColor');
      
      // Only apply custom scheme if at least one custom color exists
      if (savedPrimary || savedAccent || savedBackground || savedText) {
        applyColorScheme(
          savedPrimary || '#9346ff',
          savedAccent || '#00e1ff', 
          savedBackground || '#1a1b2e',
          savedText || '#ffffff'
        );
      }
      
      // Restore background image if it exists (after color scheme application)
      const savedBackgroundImage = localStorage.getItem('customBackgroundImage');
      if (savedBackgroundImage) {
        applyBackgroundImage(savedBackgroundImage);
      }
      
      // Initialize file upload handlers with proper timing
      const customLogoBtn = document.getElementById('custom-logo-btn');
      const customLogoFile = document.getElementById('custom-logo-file');
      const customBgBtn = document.getElementById('custom-bg-btn');
      const customBgFile = document.getElementById('custom-bg-file');
      
      console.log('File upload elements found:', {
        customLogoBtn: !!customLogoBtn,
        customLogoFile: !!customLogoFile,
        customBgBtn: !!customBgBtn,
        customBgFile: !!customBgFile
      });
      
      if (customLogoBtn && customLogoFile) {
        customLogoBtn.addEventListener('click', () => customLogoFile.click());
        customLogoFile.addEventListener('change', (e) => {
          const file = e.target.files[0];
          if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (evt) => {
              localStorage.setItem('customNavbarLogo', evt.target.result);
              const navbarLogo = document.getElementById('navbar-logo');
              if (navbarLogo) navbarLogo.src = evt.target.result;
            };
            reader.readAsDataURL(file);
          }
        });
      }
      
      if (customBgBtn && customBgFile) {
        customBgBtn.addEventListener('click', () => customBgFile.click());
        customBgFile.addEventListener('change', (e) => {
          const file = e.target.files[0];
          if (file && file.type.startsWith('image/')) {
            console.log('Background image file selected:', file.name);
            const reader = new FileReader();
            reader.onload = (evt) => {
              console.log('Background image loaded, saving to localStorage');
              const imageData = evt.target.result;
              localStorage.setItem('customBackgroundImage', imageData);
              
              // Apply immediately with a small delay to ensure DOM is ready
              setTimeout(() => {
                applyBackgroundImage(imageData);
                console.log('Background applied immediately after upload');
              }, 100);
            };
            reader.onerror = (err) => {
              console.error('Error reading background image file:', err);
            };
            reader.readAsDataURL(file);
          } else {
            console.log('Invalid file type selected for background image');
            alert('Please select a valid image file (PNG, JPG, GIF, etc.)');
          }
        });
      }
      
      console.log('Customization panel initialized successfully!');
    } else {
      console.error('Could not find customization elements');
    }
  }, 1000);
});
