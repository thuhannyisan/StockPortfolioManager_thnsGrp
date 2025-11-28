// Dashboard Quality of Life Enhancements

// Auto-dismiss alerts after 5 seconds
function autoDismissAlerts() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1 && node.classList && node.classList.contains('alert')) {
          setTimeout(() => {
            node.style.opacity = '0';
            node.style.transform = 'translateY(-20px)';
            setTimeout(() => node.remove(), 300);
          }, 5000);
        }
      });
    });
  });

  observer.observe(document.getElementById('stockMsg'), { childList: true });
  observer.observe(document.getElementById('protectedResult'), { childList: true });
}

// Add keyboard shortcuts
function addKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + R: Refresh stock
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
      e.preventDefault();
      document.getElementById('refreshStock').click();
    }
    
    // Ctrl/Cmd + P: Call protected API
    if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
      e.preventDefault();
      document.getElementById('protectedCall').click();
    }
    
    // Escape: Clear custom symbol input
    if (e.key === 'Escape') {
      document.getElementById('customSymbol').value = '';
      document.getElementById('customSymbol').blur();
    }
    
    // Enter in custom symbol input: Load stock
    if (e.key === 'Enter' && document.activeElement.id === 'customSymbol') {
      e.preventDefault();
      document.getElementById('loadSymbol').click();
    }
  });
}

// Add loading spinner to buttons
function enhanceButtons() {
  const originalRefreshClick = document.getElementById('refreshStock').onclick;
  const originalProtectedClick = document.getElementById('protectedCall').onclick;
  
  document.getElementById('refreshStock').addEventListener('click', function() {
    this.innerHTML = '<span class="spinner"></span> Loading...';
    this.disabled = true;
    setTimeout(() => {
      this.innerHTML = 'Refresh';
      this.disabled = false;
    }, 1000);
  });
  
  document.getElementById('protectedCall').addEventListener('click', function() {
    this.innerHTML = '<span class="spinner"></span> Calling...';
    this.disabled = true;
    setTimeout(() => {
      this.innerHTML = 'Call Protected API';
      this.disabled = false;
    }, 1000);
  });
}

// Add spinner CSS dynamically
function addSpinnerStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .spinner {
      display: inline-block;
      width: 14px;
      height: 14px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    .toast-container {
      position: fixed;
      top: 80px;
      right: 20px;
      z-index: 9999;
    }
    
    .toast {
      background: white;
      border-radius: 12px;
      padding: 1rem 1.5rem;
      margin-bottom: 10px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      animation: toastSlideIn 0.3s ease;
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 250px;
    }
    
    @keyframes toastSlideIn {
      from {
        opacity: 0;
        transform: translateX(100%);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
    
    .toast.success { border-left: 4px solid #10b981; }
    .toast.error { border-left: 4px solid #ef4444; }
    .toast.info { border-left: 4px solid #667eea; }
    
    .recent-searches {
      background: rgba(102, 126, 234, 0.05);
      border-radius: 8px;
      padding: 0.5rem;
      margin-top: 0.5rem;
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
    }
    
    .recent-search-chip {
      background: white;
      border: 1px solid #667eea;
      color: #667eea;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.85rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .recent-search-chip:hover {
      background: #667eea;
      color: white;
      transform: translateY(-2px);
    }
    
    .price-change {
      font-size: 1rem;
      font-weight: 600;
      margin-top: 0.5rem;
    }
    
    .price-change.positive { color: #10b981; }
    .price-change.negative { color: #ef4444; }
    
    .last-updated {
      font-size: 0.8rem;
      color: #6b7280;
      margin-top: 0.5rem;
      font-style: italic;
    }
  `;
  document.head.appendChild(style);
}

// Toast notification system
function createToastContainer() {
  const container = document.createElement('div');
  container.className = 'toast-container';
  container.id = 'toastContainer';
  document.body.appendChild(container);
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
  toast.innerHTML = `<strong>${icon}</strong> <span>${message}</span>`;
  
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Recent searches functionality
function initRecentSearches() {
  const recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
  
  if (recentSearches.length > 0) {
    const container = document.createElement('div');
    container.className = 'recent-searches';
    container.innerHTML = '<small style="color: #6b7280; width: 100%;">Recent:</small>';
    
    recentSearches.slice(0, 5).forEach(symbol => {
      const chip = document.createElement('span');
      chip.className = 'recent-search-chip';
      chip.textContent = symbol;
      chip.onclick = () => {
        document.getElementById('customSymbol').value = symbol;
        document.getElementById('loadSymbol').click();
      };
      container.appendChild(chip);
    });
    
    document.querySelector('.form-label').parentElement.appendChild(container);
  }
}

function saveRecentSearch(symbol) {
  let recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
  recentSearches = recentSearches.filter(s => s !== symbol);
  recentSearches.unshift(symbol);
  recentSearches = recentSearches.slice(0, 5);
  localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
}

// Price change tracking
let previousPrice = null;

function trackPriceChange(newPrice) {
  if (previousPrice !== null && previousPrice !== newPrice) {
    const change = newPrice - previousPrice;
    const changePercent = ((change / previousPrice) * 100).toFixed(2);
    const changeClass = change >= 0 ? 'positive' : 'negative';
    const changeSymbol = change >= 0 ? '▲' : '▼';
    
    const priceElement = document.getElementById('price');
    const existingChange = priceElement.parentElement.querySelector('.price-change');
    if (existingChange) existingChange.remove();
    
    const changeElement = document.createElement('div');
    changeElement.className = `price-change ${changeClass}`;
    changeElement.textContent = `${changeSymbol} $${Math.abs(change).toFixed(2)} (${Math.abs(changePercent)}%)`;
    priceElement.parentElement.appendChild(changeElement);
  }
  previousPrice = newPrice;
}

// Add last updated timestamp
function addLastUpdated() {
  const priceContainer = document.getElementById('price').parentElement;
  const timestamp = document.createElement('div');
  timestamp.className = 'last-updated';
  timestamp.id = 'lastUpdated';
  priceContainer.appendChild(timestamp);
}

function updateTimestamp() {
  const element = document.getElementById('lastUpdated');
  if (element) {
    const now = new Date();
    element.textContent = `Last updated: ${now.toLocaleTimeString()}`;
  }
}

// Auto-refresh functionality
let autoRefreshInterval = null;

function createAutoRefreshToggle() {
  const buttonContainer = document.querySelector('.mt-4.d-flex.gap-2');
  const toggle = document.createElement('button');
  toggle.className = 'btn btn-outline-secondary';
  toggle.id = 'autoRefreshToggle';
  toggle.innerHTML = '🔄 Auto-refresh: OFF';
  toggle.style.fontSize = '0.9rem';
  
  toggle.addEventListener('click', () => {
    if (autoRefreshInterval) {
      clearInterval(autoRefreshInterval);
      autoRefreshInterval = null;
      toggle.innerHTML = '🔄 Auto-refresh: OFF';
      toggle.classList.remove('active');
      showToast('Auto-refresh disabled', 'info');
    } else {
      autoRefreshInterval = setInterval(() => {
        document.getElementById('refreshStock').click();
      }, 30000); // 30 seconds
      toggle.innerHTML = '🔄 Auto-refresh: ON';
      toggle.classList.add('active');
      showToast('Auto-refresh enabled (30s)', 'success');
    }
  });
  
  buttonContainer.appendChild(toggle);
}

// Copy to clipboard functionality
function addCopyButtons() {
  ['companyName', 'symbol', 'exchange'].forEach(id => {
    const element = document.getElementById(id);
    if (element && element.parentElement) {
      const copyBtn = document.createElement('button');
      copyBtn.innerHTML = '📋';
      copyBtn.className = 'btn btn-sm btn-link';
      copyBtn.style.padding = '0 0.5rem';
      copyBtn.style.fontSize = '1rem';
      copyBtn.onclick = () => {
        navigator.clipboard.writeText(element.textContent);
        showToast('Copied to clipboard!', 'success');
      };
      element.parentElement.appendChild(copyBtn);
    }
  });
}

// Favorite stocks functionality
function createFavoritesSection() {
  const favorites = JSON.parse(localStorage.getItem('favoriteStocks') || '[]');
  
  if (favorites.length > 0) {
    const card = document.querySelector('.col-lg-6:first-child .card');
    const favSection = document.createElement('div');
    favSection.className = 'mt-3 pt-3';
    favSection.style.borderTop = '1px solid #e5e7eb';
    favSection.innerHTML = '<small style="color: #6b7280;">⭐ Favorites:</small>';
    
    const favContainer = document.createElement('div');
    favContainer.style.display = 'flex';
    favContainer.style.gap = '5px';
    favContainer.style.flexWrap = 'wrap';
    favContainer.style.marginTop = '0.5rem';
    
    favorites.forEach(symbol => {
      const chip = document.createElement('span');
      chip.className = 'recent-search-chip';
      chip.innerHTML = `⭐ ${symbol}`;
      chip.onclick = () => {
        document.getElementById('customSymbol').value = symbol;
        document.getElementById('loadSymbol').click();
      };
      favContainer.appendChild(chip);
    });
    
    favSection.appendChild(favContainer);
    card.querySelector('.mb-3').after(favSection);
  }
}

function addFavoriteButton() {
  const buttonContainer = document.querySelector('.mt-4.d-flex.gap-2');
  const favBtn = document.createElement('button');
  favBtn.className = 'btn btn-outline-warning';
  favBtn.innerHTML = '⭐';
  favBtn.title = 'Add to favorites';
  favBtn.onclick = () => {
    const symbol = document.getElementById('symbol').textContent;
    if (symbol && symbol !== '—') {
      let favorites = JSON.parse(localStorage.getItem('favoriteStocks') || '[]');
      if (!favorites.includes(symbol)) {
        favorites.push(symbol);
        localStorage.setItem('favoriteStocks', JSON.stringify(favorites));
        showToast(`${symbol} added to favorites!`, 'success');
      } else {
        showToast(`${symbol} is already in favorites`, 'info');
      }
    }
  };
  buttonContainer.appendChild(favBtn);
}

// Enhanced stock loading with all QoL features
function enhanceStockLoading() {
  const originalLoadStock = window.loadStock;
  
  window.loadStock = async function(symbol = 'AAPL') {
    await originalLoadStock(symbol);
    
    // Track recent searches
    if (symbol !== 'AAPL') {
      saveRecentSearch(symbol);
    }
    
    // Update timestamp
    updateTimestamp();
    
    // Track price changes
    const priceText = document.getElementById('price').textContent;
    const price = parseFloat(priceText.replace('$', ''));
    if (!isNaN(price)) {
      trackPriceChange(price);
    }
    
    // Show toast notification
    const companyName = document.getElementById('companyName').textContent;
    showToast(`Loaded ${companyName} (${symbol})`, 'success');
  };
}

// Help tooltip
function addHelpTooltip() {
  const nav = document.querySelector('.navbar .d-flex');
  const helpBtn = document.createElement('button');
  helpBtn.className = 'btn btn-outline-light me-3';
  helpBtn.innerHTML = '❓';
  helpBtn.style.borderRadius = '50%';
  helpBtn.style.width = '40px';
  helpBtn.style.height = '40px';
  helpBtn.style.padding = '0';
  helpBtn.onclick = () => {
    const shortcuts = `
      Keyboard Shortcuts:
      • Ctrl/Cmd + R: Refresh stock
      • Ctrl/Cmd + P: Call protected API
      • Enter: Load symbol (when in input)
      • Escape: Clear input
    `;
    alert(shortcuts);
  };
  nav.prepend(helpBtn);
}

// Initialize all enhancements
function initEnhancements() {
  addSpinnerStyles();
  createToastContainer();
  autoDismissAlerts();
  addKeyboardShortcuts();
  initRecentSearches();
  addLastUpdated();
  createAutoRefreshToggle();
  addCopyButtons();
  createFavoritesSection();
  addFavoriteButton();
  enhanceStockLoading();
  addHelpTooltip();
  
  console.log('✨ Dashboard enhancements loaded!');
  showToast('Dashboard enhanced! Press ❓ for shortcuts', 'info');
}

// Run when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initEnhancements);
} else {
  initEnhancements();
}