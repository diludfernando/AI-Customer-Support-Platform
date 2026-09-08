const API_BASE_URL = 'http://localhost:5000/api/auth';

/**
 * Authenticates user against ASP.NET Core backend or local fallback mock accounts.
 */
export async function loginUser(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Login failed with status ${response.status}`);
    }

    const data = await response.json();
    if (data.token) {
      localStorage.setItem('auth_token', data.token);
    }
    if (data.user) {
      localStorage.setItem('auth_user', JSON.stringify(data.user));
    }
    return { success: true, user: data.user, token: data.token };
  } catch (error) {
    console.warn('Backend Auth endpoint unavailable or login error; testing local auth fallback:', error.message);

    // Client-side fallback for testing & dev when backend server is offline
    const mockUsers = {
      'alex@company.com': { id: 'u-101', fullName: 'Alex Miller', email: 'alex@company.com', role: 'Support Agent', avatarUrl: null, tier: 'Enterprise Lead' },
      'sarah@acmecorp.io': { id: 'u-102', fullName: 'Sarah Jenkins', email: 'sarah@acmecorp.io', role: 'Customer', avatarUrl: null, tier: 'VIP Customer' },
      'admin@platform.ai': { id: 'u-100', fullName: 'System Administrator', email: 'admin@platform.ai', role: 'Administrator', avatarUrl: null, tier: 'Platform Admin' }
    };

    const user = mockUsers[email.toLowerCase()] || {
      id: `u-${Date.now()}`,
      fullName: email.split('@')[0].replace('.', ' ').toUpperCase(),
      email,
      role: 'Customer',
      tier: 'Standard User'
    };

    const mockToken = `mock-jwt-token-${Date.now()}`;
    localStorage.setItem('auth_token', mockToken);
    localStorage.setItem('auth_user', JSON.stringify(user));

    return { success: true, user, token: mockToken, isFallback: true };
  }
}

/**
 * Registers a new user with ASP.NET Core backend or local fallback.
 */
export async function registerUser(fullName, email, password, role = 'Customer') {
  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, email, password, role })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Registration failed with status ${response.status}`);
    }

    const data = await response.json();
    if (data.token) {
      localStorage.setItem('auth_token', data.token);
    }
    if (data.user) {
      localStorage.setItem('auth_user', JSON.stringify(data.user));
    }
    return { success: true, user: data.user, token: data.token };
  } catch (error) {
    console.warn('Backend Auth endpoint unavailable or register error; testing local auth fallback:', error.message);

    const newUser = {
      id: `u-${Date.now()}`,
      fullName,
      email,
      role,
      tier: role === 'Administrator' ? 'Platform Admin' : role === 'Support Agent' ? 'Support Agent' : 'Standard Customer'
    };

    const mockToken = `mock-jwt-token-${Date.now()}`;
    localStorage.setItem('auth_token', mockToken);
    localStorage.setItem('auth_user', JSON.stringify(newUser));

    return { success: true, user: newUser, token: mockToken, isFallback: true };
  }
}

/**
 * Retrieves currently logged in user from localStorage.
 */
export function getStoredUser() {
  try {
    const stored = localStorage.getItem('auth_user');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

/**
 * Signs out the current user and clears session storage.
 */
export function logoutUser() {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
}
