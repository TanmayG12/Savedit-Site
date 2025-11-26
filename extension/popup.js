const SUPABASE_URL = 'https://ibjlpnjqudwmtpcigyzb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImliamxwbmpxdWR3bXRwY2lneXpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzODg5NTAsImV4cCI6MjA2OTk2NDk1MH0.RHi-VzTRxhksK_iuxQTF4n4lgJkEa142HHkWBTzJd_E';

// State
let currentTab = null;
let pageMetadata = null;
let tags = [];
let collections = [];
let selectedCollectionId = null;
let session = null;

// DOM Elements
let loginView, mainView, loginBtn, logoutBtn, saveBtn, dashboardBtn;
let emailInput, passwordInput, loginError;
let loadingState, previewState;
let previewImage, previewFallback, previewFavicon, previewDomain;
let previewTitle, previewUrl, previewDescription;
let notesInput, tagsInput, tagsContainer, saveStatus, userEmail;
let collectionBtn, collectionDropdown, selectedCollectionName;

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
    dashboardBtn = document.getElementById('dashboard-btn');
    saveBtn = document.getElementById('save-btn');
    emailInput = document.getElementById('email');
    passwordInput = document.getElementById('password');
    loginError = document.getElementById('login-error');
    loadingState = document.getElementById('loading-state');
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
    collectionBtn = document.getElementById('collection-btn');
    collectionDropdown = document.getElementById('collection-dropdown');
    selectedCollectionName = document.getElementById('selected-collection-name');
}

function bindEvents() {
    loginBtn.addEventListener('click', handleLogin);
    logoutBtn.addEventListener('click', handleLogout);
    dashboardBtn.addEventListener('click', () => {
        chrome.tabs.create({ url: 'https://saveditapp.com/dashboard' });
    });
    saveBtn.addEventListener('click', handleSave);
    tagsInput.addEventListener('keydown', handleTagInput);
    collectionBtn.addEventListener('click', toggleCollectionDropdown);
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!collectionBtn.contains(e.target) && !collectionDropdown.contains(e.target)) {
            collectionDropdown.classList.add('hidden');
            collectionBtn.classList.remove('open');
        }
    });
    
    // Allow Enter to submit login
    passwordInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleLogin();
    });
    emailInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') passwordInput.focus();
    });
}

async function checkAuth() {
    const storage = await chrome.storage.local.get('session');
    session = storage.session;
    
    if (session && session.access_token) {
        // Check if token is expired and try to refresh
        const isExpired = isTokenExpired(session);
        if (isExpired && session.refresh_token) {
            console.log('Token expired, attempting refresh...');
            const refreshed = await refreshSession();
            if (!refreshed) {
                showLoginView();
                return;
            }
        } else if (isExpired) {
            console.log('Token expired and no refresh token');
            showLoginView();
            return;
        }
        showMainView();
    } else {
        showLoginView();
    }
}

function isTokenExpired(sess) {
    if (!sess?.expires_at) return true;
    // expires_at is in seconds, Date.now() is in ms
    // Add 60 second buffer
    return (sess.expires_at * 1000) < (Date.now() + 60000);
}

async function refreshSession() {
    if (!session?.refresh_token) return false;
    
    try {
        const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_ANON_KEY,
            },
            body: JSON.stringify({ refresh_token: session.refresh_token }),
        });
        
        if (!response.ok) {
            console.error('Token refresh failed:', response.status);
            return false;
        }
        
        const data = await response.json();
        session = data;
        await chrome.storage.local.set({ session: data });
        console.log('Token refreshed successfully');
        return true;
    } catch (err) {
        console.error('Token refresh error:', err);
        return false;
    }
}

function showLoginView() {
    loginView.classList.remove('hidden');
    mainView.classList.add('hidden');
    emailInput.focus();
}

async function showMainView() {
    loginView.classList.add('hidden');
    mainView.classList.remove('hidden');
    
    // Show user email
    if (session?.user?.email) {
        userEmail.textContent = session.user.email;
    }
    
    // Load collections and current tab
    await Promise.all([
        loadCollections(),
        loadCurrentTab()
    ]);
}

async function loadCollections() {
    if (!session?.access_token || !session?.user?.id) return;
    
    try {
        // Try RPC function first (includes shared collections)
        const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/list_accessible_collections_for_user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({ p_user_id: session.user.id }),
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('Collections RPC response:', data);
            collections = data || [];
            renderCollectionOptions();
            return;
        }
        
        console.warn('RPC failed, trying direct table query. Status:', response.status);
    } catch (err) {
        console.error('RPC failed:', err);
    }
    
    // Fallback: query collections table directly (owned only)
    try {
        const fallbackResponse = await fetch(
            `${SUPABASE_URL}/rest/v1/collections?owner_id=eq.${session.user.id}&select=id,name,item_count,created_at&order=updated_at.desc`,
            {
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${session.access_token}`,
                },
            }
        );
        
        if (fallbackResponse.ok) {
            const data = await fallbackResponse.json();
            console.log('Collections fallback response:', data);
            // Map to same format as RPC
            collections = (data || []).map(c => ({
                collection_id: c.id,
                title: c.name,
                item_count: c.item_count,
            }));
            renderCollectionOptions();
        } else {
            console.error('Fallback query failed:', await fallbackResponse.text());
        }
    } catch (err) {
        console.error('Failed to load collections via fallback:', err);
    }
}

function renderCollectionOptions() {
    const html = `
        <button class="collection-option ${!selectedCollectionId ? 'selected' : ''}" data-id="">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
            </svg>
            No collection
        </button>
        ${collections.map(c => `
            <button class="collection-option ${selectedCollectionId === (c.collection_id || c.id) ? 'selected' : ''}" data-id="${c.collection_id || c.id}">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                </svg>
                ${escapeHtml(c.title || c.name || 'Untitled')}
            </button>
        `).join('')}
    `;
    
    collectionDropdown.innerHTML = html;
    
    // Bind click events
    collectionDropdown.querySelectorAll('.collection-option').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id || null;
            selectedCollectionId = id;
            const name = id ? btn.textContent.trim() : 'No collection';
            selectedCollectionName.textContent = name;
            collectionDropdown.classList.add('hidden');
            renderCollectionOptions();
        });
    });
}

function toggleCollectionDropdown() {
    const isHidden = collectionDropdown.classList.toggle('hidden');
    collectionBtn.classList.toggle('open', !isHidden);
}

async function loadCurrentTab() {
    loadingState.classList.remove('hidden');
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
        
        loadingState.classList.add('hidden');
        previewState.classList.remove('hidden');
        
    } catch (error) {
        console.error('Error loading tab:', error);
        loadingState.classList.add('hidden');
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
    loginBtn.innerHTML = '<div class="spinner"></div> Signing in...';
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
        
        session = data;
        await chrome.storage.local.set({ session: data });
        showMainView();
        
    } catch (error) {
        showLoginError(error.message);
    } finally {
        loginBtn.disabled = false;
        loginBtn.innerHTML = 'Sign In';
    }
}

async function handleLogout() {
    session = null;
    await chrome.storage.local.remove('session');
    showLoginView();
}

async function handleSave() {
    if (!currentTab || !session?.access_token || !session?.user?.id) {
        showStatus('Please sign in again', 'error');
        return;
    }
    
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<div class="spinner"></div> Saving...';
    hideStatus();
    
    try {
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
        
        // Build the payload - include user_id explicitly
        const payload = {
            url,
            url_normalized: normalizedUrl,
            title,
            notes,
            tags: tags.length > 0 ? tags : [],
            user_id: session.user.id,
            status: 'queued',
        };
        
        // Save the item
        const response = await fetch(`${SUPABASE_URL}/rest/v1/saved_items`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${session.access_token}`,
                'Prefer': 'return=representation',
            },
            body: JSON.stringify(payload),
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Save error:', errorData);
            throw new Error(errorData.message || errorData.details || errorData.hint || 'Failed to save');
        }
        
        const savedItems = await response.json();
        const savedItem = savedItems[0];
        
        // If a collection is selected, add to collection
        if (selectedCollectionId && savedItem?.id) {
            const collectionResponse = await fetch(`${SUPABASE_URL}/rest/v1/collection_items`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${session.access_token}`,
                    'Prefer': 'return=minimal',
                },
                body: JSON.stringify({
                    collection_id: selectedCollectionId,
                    saved_item_id: savedItem.id,
                }),
            });
            
            if (!collectionResponse.ok) {
                console.warn('Failed to add to collection, but item was saved');
            }
        }
        
        showStatus('Saved!', 'success');
        saveBtn.classList.add('success');
        saveBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Saved!
        `;
        
        setTimeout(() => window.close(), 1200);
        
    } catch (error) {
        console.error('Save failed:', error);
        showStatus(error.message, 'error');
        saveBtn.disabled = false;
        saveBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                <polyline points="7 3 7 8 15 8"></polyline>
            </svg>
            Save
        `;
    }
}

function handleTagInput(e) {
    if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        addTagsFromInput();
    }
}

function addTagsFromInput() {
    const input = tagsInput.value;
    // Split by comma and process each tag
    const newTags = input.split(',')
        .map(t => t.trim())
        .filter(t => t && !tags.includes(t));
    
    if (newTags.length > 0) {
        tags.push(...newTags);
        renderTags();
    }
    
    tagsInput.value = '';
}

function removeTag(tag) {
    tags = tags.filter(t => t !== tag);
    renderTags();
}

function renderTags() {
    tagsContainer.innerHTML = tags.map(tag => `
        <span class="tag">
            ${escapeHtml(tag)}
            <button class="tag-remove" data-tag="${escapeHtml(tag)}" title="Remove">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </span>
    `).join('');
    
    // Bind remove events
    tagsContainer.querySelectorAll('.tag-remove').forEach(btn => {
        btn.addEventListener('click', () => removeTag(btn.dataset.tag));
    });
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
    saveStatus.className = `alert alert-${type === 'error' ? 'error' : 'success'}`;
    saveStatus.classList.remove('hidden');
}

function hideStatus() {
    saveStatus.classList.add('hidden');
}
