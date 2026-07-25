import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

// Built-in demo account — always available
const DEMO_ACCOUNT = {
  username: 'kavinraja',
  email: 'demo@stockdashboard.com',
  password: 'demo123',
  name: 'Kavin Raja',
  plan: 'Pro',
  avatar: 'KR',
  balance: 100000,
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount: restore session from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('auth_user');
      if (saved) setUser(JSON.parse(saved));
    } catch {}
    setLoading(false);
  }, []);

  // Persist user to localStorage whenever it changes
  useEffect(() => {
    if (user) localStorage.setItem('auth_user', JSON.stringify(user));
    else localStorage.removeItem('auth_user');
  }, [user]);

  const login = async (email, password) => {
    // Load all registered accounts
    let accounts = [];
    try { accounts = JSON.parse(localStorage.getItem('registered_accounts')) || []; } catch {}

    // Always allow demo account
    const allAccounts = [DEMO_ACCOUNT, ...accounts];

    const found = allAccounts.find(
      a => (a.email.toLowerCase() === email.toLowerCase() || a.username?.toLowerCase() === email.toLowerCase()) && a.password === password
    );

    if (!found) throw new Error('Invalid email or password');

    const { password: _, ...safeUser } = found;
    setUser(safeUser);
    return safeUser;
  };

  const register = async (username, email, password) => {
    let accounts = [];
    try { accounts = JSON.parse(localStorage.getItem('registered_accounts')) || []; } catch {}

    // Check duplicate
    const exists = accounts.find(a => a.email.toLowerCase() === email.toLowerCase() || a.username?.toLowerCase() === username.toLowerCase());
    if (exists) {
      const err = new Error('Email or username already in use');
      err.response = { data: { msg: 'Email or username already in use' } };
      throw err;
    }

    const newUser = {
      username, email, password,
      name: username,
      plan: 'Free',
      avatar: username.slice(0, 2).toUpperCase(),
      balance: 50000,
    };

    accounts.push(newUser);
    localStorage.setItem('registered_accounts', JSON.stringify(accounts));

    const { password: _, ...safeUser } = newUser;
    setUser(safeUser);
    return safeUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
  };

  const updateUser = (updates) => {
    const updated = { ...user, ...updates };
    setUser(updated);
  };

  // token is null — no backend needed
  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser, token: null }}>
      {children}
    </AuthContext.Provider>
  );
};
