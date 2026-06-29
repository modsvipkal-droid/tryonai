const USERS_KEY = 'trx_users';
const COUNTS_KEY = 'trx_pred_counts';
const HISTORY_KEY = 'trx_unlimited_history';

export function getUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); }
  catch { return []; }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export async function addUser(user) {
  const users = getUsers();
  let existing = users.find(u => u.email === user.email);
  if (!existing) {
    existing = {
      email: user.email,
      displayName: user.displayName || '',
      photoURL: user.photoURL || '',
      unlimited: false,
      unlimitedAt: null,
      createdAt: Date.now(),
    };
    users.push(existing);
    saveUsers(users);
  }
  
  // Always sync to the backend database so they show up in the admin panel
  await syncUserToDB(existing);
  // Synchronize unlimited status from server
  await syncUnlimitedFromServer(user.email);
  
  return getUsers();
}

async function syncUserToDB(user, retries = 2) {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, displayName: user.displayName, photoURL: user.photoURL }),
      });
      if (res.ok) return;
    } catch {}
    if (i < retries) await new Promise(r => setTimeout(r, 1000));
  }
}

async function syncUnlimitedFromServer(email) {
  try {
    const res = await fetch(`/api/admin/users/check?email=${encodeURIComponent(email)}`);
    const data = await res.json();
    if (data.found && data.unlimited) {
      const users = getUsers();
      const user = users.find(u => u.email === email);
      if (user) {
        user.unlimited = true;
        user.unlimitedAt = Date.now();
        saveUsers(users);
      }
    }
  } catch {}
}

export function setUnlimited(email, value) {
  const users = getUsers();
  const user = users.find(u => u.email === email);
  if (user) {
    user.unlimited = value;
    user.unlimitedAt = value ? Date.now() : null;
    saveUsers(users);
    if (value) addUnlimitedHistory(email);
    return true;
  }
  return false;
}

export async function isUnlimited(email) {
  const users = getUsers();
  const user = users.find(u => u.email === email);
  if (user?.unlimited) return true;
  try {
    const res = await fetch(`/api/admin/users/check?email=${encodeURIComponent(email)}`);
    const data = await res.json();
    if (data.unlimited) {
      if (user) {
        user.unlimited = true;
        user.unlimitedAt = Date.now();
        saveUsers(users);
      }
      return true;
    }
  } catch {}
  return false;
}

function getDailyKey(email) {
  const d = new Date();
  return `${email}_${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

export function getPredictionCount(email) {
  try {
    const data = JSON.parse(localStorage.getItem(COUNTS_KEY) || '{}');
    return data[getDailyKey(email)] || 0;
  } catch { return 0; }
}

export function incrementPredictionCount(email) {
  const data = JSON.parse(localStorage.getItem(COUNTS_KEY) || '{}');
  const key = getDailyKey(email);
  data[key] = (data[key] || 0) + 1;
  localStorage.setItem(COUNTS_KEY, JSON.stringify(data));
  return data[key];
}

export async function getRemainingPredictions(email) {
  if (await isUnlimited(email)) return -1;
  return 0;
}

export function getUnlimitedHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); }
  catch { return []; }
}

function addUnlimitedHistory(email) {
  const history = getUnlimitedHistory();
  history.push({ email, activatedAt: Date.now() });
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}
