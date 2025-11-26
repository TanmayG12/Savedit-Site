const SUPABASE_URL = 'https://ibjlpnjqudwmtpcigyzb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImliamxwbmpxdWR3bXRwY2lneXpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzODg5NTAsImV4cCI6MjA2OTk2NDk1MH0.RHi-VzTRxhksK_iuxQTF4n4lgJkEa142HHkWBTzJd_E';

// Simple Supabase Auth implementation for Extension
async function signIn(email, password) {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error_description || data.msg || 'Login failed');
    return data;
}

async function saveItem(accessToken, url, title) {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/saved_items`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${accessToken}`,
            'Prefer': 'return=minimal',
        },
        body: JSON.stringify({ url, title, created_at: new Date().toISOString() }),
    });
    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to save');
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const loginView = document.getElementById('login-view');
    const mainView = document.getElementById('main-view');
    const loginBtn = document.getElementById('login-btn');
    const saveBtn = document.getElementById('save-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginError = document.getElementById('login-error');
    const currentUrlEl = document.getElementById('current-url');
    const saveStatus = document.getElementById('save-status');

    // Check auth state
    const { session } = await chrome.storage.local.get('session');

    if (session) {
        showMainView();
    } else {
        showLoginView();
    }

    function showLoginView() {
        loginView.classList.remove('hidden');
        mainView.classList.add('hidden');
    }

    function showMainView() {
        loginView.classList.add('hidden');
        mainView.classList.remove('hidden');

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const tab = tabs[0];
            if (tab) {
                currentUrlEl.textContent = tab.url;
            }
        });
    }

    loginBtn.addEventListener('click', async () => {
        const email = emailInput.value;
        const password = passwordInput.value;
        loginError.textContent = '';
        loginBtn.disabled = true;
        loginBtn.textContent = 'Signing in...';

        try {
            const data = await signIn(email, password);
            await chrome.storage.local.set({ session: data });
            showMainView();
        } catch (error) {
            loginError.textContent = error.message;
        } finally {
            loginBtn.disabled = false;
            loginBtn.textContent = 'Sign In';
        }
    });

    saveBtn.addEventListener('click', async () => {
        saveBtn.disabled = true;
        saveBtn.textContent = 'Saving...';
        saveStatus.textContent = '';
        saveStatus.className = '';

        try {
            const { session } = await chrome.storage.local.get('session');
            if (!session) throw new Error('Not logged in');

            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            if (!tab) throw new Error('No active tab');

            await saveItem(session.access_token, tab.url, tab.title);

            saveStatus.textContent = 'Saved!';
            saveStatus.className = 'success';
            setTimeout(() => {
                window.close();
            }, 1500);
        } catch (error) {
            saveStatus.textContent = error.message;
            saveStatus.className = 'error';
            saveBtn.disabled = false;
            saveBtn.textContent = 'Save Current Page';
        }
    });

    logoutBtn.addEventListener('click', async () => {
        await chrome.storage.local.remove('session');
        showLoginView();
    });
});
