const SUPABASE_URL = 'https://ibjlpnjqudwmtpcigyzb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImliamxwbmpxdWR3bXRwY2lneXpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzODg5NTAsImV4cCI6MjA2OTk2NDk1MH0.RHi-VzTRxhksK_iuxQTF4n4lgJkEa142HHkWBTzJd_E';

// State
let currentTab = null;
let pageMetadata = null;
let tags = [];

// DOM Elements
let loginView, mainView, loginBtn, logoutBtn, saveBtn;
let emailInput, passwordInput, loginError;
let fetchingState, previewState;
let previewImage, previewFallback, previewFavicon, previewDomain;
let previewTitle, previewUrl, previewDescription;
let notesInput, tagsInput, tagsContainer, saveStatus, userEmail;

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    initElements();
    bindEvents();
    await checkAuth();
});

function initElements() {
    loginView = document.getElementById('login-view');
    mainView = document.getElementById('main-view');
    loginBtn = document.getElementById('login-btn');
    logoutBtn = document.getElementById('logout-btn');
    saveBtn = document.getElementById('save-btn');
    emailInput = document.getElementById('email');
    passwordInput = document.getElementById('password');
    loginError = document.getElementById('login-error');
    fetchingState = document.getElementById('fetching-state');
    previewState = document.getElementById('preview-state');
    previewImage = document.getElementById('preview-image');
    previewFallback = document.getElementById('preview-fallback');
    previewFavicon = document.getElementById('preview-favicon');
    previewDomain = document.getElementById('preview-domain');
    previewTitle = document.getElementById('preview-title');
    previewUrl = document.getElementById('preview-url');
    previewDescription = document.getElementById('preview-description');
    notesInput = document.getElementById('notes');
    tagsInput = document.getElementById('tags-input');
    tagsContainer = document.getElementById('tags-container');
    saveStatus = document.getElementById('save-status');
    userEmail = document.getElementById('user-email');
}

function bindEvents() {
    loginBtn.addEventListener('click', handleLogin);
    logoutBtn.addEventListener('click', handleLogout);
    saveBtn.addEventListener('click', handleSave);
    tagsInput.addEventListener('keydown', handleTagInput);
    
    // Allow Enter to submit login
    passwordInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleLogin();
    });
    emailInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') passwordInput.focus();
    });
}

async function checkAuth() {
    const { session } = await chrome.storage.local.get('session');
    
    if (session && session.access_token) {
        showMainView(session);
    } else {
        showLoginView();
    }
}

function showLoginView() {
    loginView.classList.remove('hidden');
    mainView.classList.add('hidden');
    emailInput.focus();
}

async function showMainView(session) {
    loginView.classList.add('hidden');
    mainView.classList.remove('hidden');
    
    // Show user email
    if (session.user?.email) {
        userEmail.textContent = session.user.email;
    }
    
    // Get current tab and fetch metadata
    await loadCurrentTab();
}

async function loadCurrentTab() {
    fetchingState.classList.remove('hidden');
    previewState.classList.add('hidden');
    
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        currentTab = tab;
        
        if (!tab || !tab.url) {
            throw new Error('No active tab');
        }
        
        // Set basic info immediately
        const url = new URL(tab.url);
        previewTitle.textContent = tab.title || 'Untitled';
        previewUrl.textContent = tab.url;
        previewDomain.textContent = url.hostname.replace('www.', '');
        previewFavicon.src = `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=32`;
        
        // Try to get page metadata
        try {
            const metadata = await getPageMetadata(tab);
            pageMetadata = metadata;
            
            if (metadata.title) {
                previewTitle.textContent = metadata.title;
            }
            
            if (metadata.description) {
                previewDescription.textContent = metadata.description;
                previewDescription.classList.remove('hidden');
            }
            
            if (metadata.image) {
                previewImage.src = metadata.image;
                previewImage.classList.remove('hidden');
                previewFallback.classList.add('hidden');
                
                previewImage.onerror = () => {
                    previewImage.classList.add('hidden');
                    previewFallback.classList.remove('hidden');
                };
            } else {
                previewImage.classList.add('hidden');
                previewFallback.classList.remove('hidden');
            }
        } catch (err) {
            console.log('Could not fetch page metadata:', err);
            previewImage.classList.add('hidden');
            previewFallback.classList.remove('hidden');
        }
        
        fetchingState.classList.add('hidden');
        previewState.classList.remove('hidden');
        
    } catch (error) {
        console.error('Error loading tab:', error);
        fetchingState.classList.add('hidden');
        previewState.classList.remove('hidden');
    }
}

async function getPageMetadata(tab) {
    try {
        const results = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => {
                const getMeta = (name) => {
                    const el = document.querySelector(`meta[property="${name}"], meta[name="${name}"]`);
                    return el ? el.content : null;
                };
                
                return {
                    title: getMeta('og:title') || document.title,
                    description: getMeta('og:description') || getMeta('description'),
                    image: getMeta('og:image') || getMeta('twitter:image'),
                };
            },
        });
        
        return results[0]?.result || {};
    } catch (err) {
        return {};
    }
}

async function handleLogin() {
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    
    if (!email || !password) {
        showLoginError('Please enter email and password');
        return;
    }
    
    loginBtn.disabled = true;
    loginBtn.innerHTML = '<div class="spinner"></div><span>Signing in...</span>';
    hideLoginError();
    
    try {
        const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_ANON_KEY,
            },
            body: JSON.stringify({ email, password }),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error_description || data.msg || 'Login failed');
        }
        
        await chrome.storage.local.set({ session: data });
        showMainView(data);
        
    } catch (error) {
        showLoginError(error.message);
    } finally {
        loginBtn.disabled = false;
        loginBtn.innerHTML = '<span>Sign In</span>';
    }
}

async function handleLogout() {
    await chrome.storage.local.remove('session');
    showLoginView();
}

async function handleSave() {
    if (!currentTab) return;
    
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<div class="spinner"></div><span>Saving...</span>';
    hideStatus();
    
    try {
        const { session } = await chrome.storage.local.get('session');
        if (!session || !session.access_token) {
            throw new Error('Not logged in');
        }
        
        const notes = notesInput.value.trim() || null;
        const url = currentTab.url;
        const title = pageMetadata?.title || currentTab.title || 'Untitled';
        
        // Normalize URL
        let normalizedUrl = url;
        try {
            const urlObj = new URL(url);
            normalizedUrl = urlObj.href.toLowerCase().replace(/\/$/, '');
        } catch (e) {
            normalizedUrl = url.toLowerCase();
        }
        
        const payload = {
            url,
            url_normalized: normalizedUrl,
            title,
            notes,
            tags: tags.length > 0 ? tags : null,
            created_at: new Date().toISOString(),
            status: 'active',
        };
        
        const response = await fetch(`${SUPABASE_URL}/rest/v1/saved_items`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${session.access_token}`,
                'Prefer': 'return=minimal',
            },
            body: JSON.stringify(payload),
        });
        
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || data.details || 'Failed to save');
        }
        
        showStatus('Saved successfully!', 'success');
        saveBtn.classList.add('success');
        saveBtn.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>Saved!</span>
        `;
        
        setTimeout(() => window.close(), 1500);
        
    } catch (error) {
        showStatus(error.message, 'error');
        saveBtn.disabled = false;
        saveBtn.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                <polyline points="7 3 7 8 15 8"></polyline>
            </svg>
            <span>Save to Savedit</span>
        `;
    }
}

function handleTagInput(e) {
    if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        const value = tagsInput.value.trim().replace(/,/g, '');
        
        if (value && !tags.includes(value)) {
            tags.push(value);
            renderTags();
        }
        
        tagsInput.value = '';
    }
}

function removeTag(tag) {
    tags = tags.filter(t => t !== tag);
    renderTags();
}

function renderTags() {
    tagsContainer.innerHTML = tags.map(tag => `
        <span class="tag">
            ${escapeHtml(tag)}
            <button class="tag-remove" onclick="removeTag('${escapeHtml(tag)}')" title="Remove">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </span>
    `).join('');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showLoginError(message) {
    loginError.textContent = message;
    loginError.classList.remove('hidden');
}

function hideLoginError() {
    loginError.classList.add('hidden');
}

function showStatus(message, type) {
    saveStatus.textContent = message;
    saveStatus.className = `status-message ${type}`;
    saveStatus.classList.remove('hidden');
}

function hideStatus() {
    saveStatus.classList.add('hidden');
}

// Expose removeTag to global scope for onclick handler
window.removeTag = removeTag;
