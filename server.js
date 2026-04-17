const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const http = require('http');
const https = require('https');
const { URL } = require('url');

const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'formei_secret_key_2024_ultraSeguro';

// Supabase initialization
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://rjjsjxzoyxerztxxovjp.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'sb_publishable_LtLhUq0cZNG-N49NXpUj2g_Lw9dPQo-';
const supabase = (SUPABASE_URL && SUPABASE_KEY) ? createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
}) : null;
const isVercel = process.env.VERCEL === '1' || !!process.env.NOW_REGION;

if (!supabase) {
  if (isVercel) {
    console.error('❌ CRITICAL ERROR on Vercel: SUPABASE_URL or SUPABASE_KEY missing in Environment Variables!');
  } else {
    console.warn('⚠️ Supabase credentials not found. Local JSON DB will be used.');
  }
} else {
  console.log('✅ Supabase integrated successfully.');
}

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Disable browser cache so changes are always picked up
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  res.set('Surrogate-Control', 'no-store');
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

// File upload setup
// For local fallback (wrapped in try-catch for Vercel read-only FS)
const uploadsDir = path.join(__dirname, 'public', 'uploads');
try {
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
} catch (e) {
  console.log('ℹ️ Running in read-only environment (normal for Vercel). Disabling local uploads.');
}

// We'll use memory storage for Supabase uploads, and disk storage for local fallback
const memoryStorage = multer.memoryStorage();
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`);
  }
});

const upload = multer({
  storage: supabase ? memoryStorage : diskStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx|csv|txt|zip|mp4|webm/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    cb(null, ext);
  }
});

// ==================== JSON FILE DATABASE ====================
const DB_PATH = path.join(__dirname, 'db', 'data.json');
const dbDir = path.join(__dirname, 'db');

// ==================== DATABASE HELPERS (Supabase) ====================

// Since the whole server is being migrated to async Supabase calls, 
// we will replace direct loadDB/saveDB usage inside routes.
// The loadDB/saveDB functions below are kept for backwards compatibility during migration.

function loadDB() {
  try {
    // Skip file creation on Vercel
    if (!isVercel) {
      if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
    }
    
    if (!fs.existsSync(DB_PATH)) {
      const initial = { users: [], forms: [], responses: [], notifications: [], resetTokens: [], folders: [], nextId: 1 };
      if (!isVercel) fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2));
      return initial;
    }
    const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
    if (!db.notifications) db.notifications = [];
    if (!db.resetTokens) db.resetTokens = [];
    if (!db.folders) db.folders = [];
    return db;
  } catch (err) {
    return { users: [], forms: [], responses: [], notifications: [], resetTokens: [], nextId: 1 };
  }
}

function saveDB(db) {
  if (isVercel) return; // Cannot save to disk on Vercel
  try {
    if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
  } catch (e) {}
}

function genId(db) {
  const id = db.nextId || 1;
  db.nextId = id + 1;
  return id;
}

// ==================== AUTH MIDDLEWARE ====================
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    req.userEmail = decoded.email;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
}

// ==================== AUTH ROUTES ====================

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
    }

    if (!supabase) {
      // Fallback to local DB if no Supabase
      const db = loadDB();
      const existing = db.users.find(u => u.email === email);
      if (existing) return res.status(409).json({ error: 'Este email já está cadastrado' });
      const hashedPassword = bcrypt.hashSync(password, 10);
      const user = { id: genId(db), name, email, password: hashedPassword, avatar_color: '#7c3aed', plan: 'free', created_at: new Date().toISOString() };
      db.users.push(user);
      saveDB(db);
      const token = jwt.sign({ id: user.id, email }, JWT_SECRET, { expiresIn: '7d' });
      return res.status(201).json({ token, user: { id: user.id, name, email, avatar_color: user.avatar_color, plan: 'free' } });
    }

    // Supabase Auth Register
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }
      }
    });

    if (authError) return res.status(400).json({ error: authError.message });
    if (!authData.user) return res.status(400).json({ error: 'Erro ao criar usuário' });

    // Profile is created by trigger in SQL script
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    const token = jwt.sign({ id: authData.user.id, email }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({
      token,
      user: { 
        id: authData.user.id, 
        name: profile?.name || name, 
        email, 
        avatar_color: profile?.avatar_color || '#7c3aed', 
        plan: profile?.plan || 'free' 
      }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    if (!supabase) {
      const db = loadDB();
      const user = db.users.find(u => u.email === email);
      if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ error: 'Email ou senha incorretos' });
      }
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({ token, user: { id: user.id, name: user.name, email: user.email, avatar_color: user.avatar_color, plan: user.plan } });
    }

    // Supabase Auth Login
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      console.error("Supabase Auth Error:", authError);
      return res.status(401).json({ error: authError.message || 'Email ou senha incorretos' });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    const token = jwt.sign({ id: authData.user.id, email: authData.user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      user: { 
        id: authData.user.id, 
        name: profile?.name || authData.user.user_metadata?.name || '', 
        email: authData.user.email, 
        avatar_color: profile?.avatar_color || '#7c3aed', 
        plan: profile?.plan || 'free' 
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Get current user
app.get('/api/auth/me', authMiddleware, async (req, res) => {
  if (!supabase) {
    const db = loadDB();
    const user = db.users.find(u => u.id === req.userId);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
    return res.json({ user: { id: user.id, name: user.name, email: user.email, avatar_color: user.avatar_color, plan: user.plan, created_at: user.created_at } });
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', req.userId)
    .single();

  if (error || !profile) return res.status(404).json({ error: 'Usuário não encontrado' });
  res.json({ user: { ...profile, email: req.userEmail } });
});

// Update user profile
app.put('/api/auth/me', authMiddleware, async (req, res) => {
  const { name, email, avatar_color } = req.body;

  if (!supabase) {
    const db = loadDB();
    const user = db.users.find(u => u.id === req.userId);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
    if (name) user.name = name;
    if (email) user.email = email;
    if (avatar_color) user.avatar_color = avatar_color;
    saveDB(db);
    return res.json({ user: { id: user.id, name: user.name, email: user.email, avatar_color: user.avatar_color, plan: user.plan } });
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .update({ name, avatar_color })
    .eq('id', req.userId)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  if (email && email !== req.userEmail) {
    await supabase.auth.updateUser({ email });
  }

  res.json({ user: { ...profile, email: email || req.userEmail } });
});

// Change password
app.put('/api/auth/password', authMiddleware, async (req, res) => {
  const { newPassword } = req.body;
  if (!newPassword || newPassword.length < 6) return res.status(400).json({ error: 'Nova senha deve ter pelo menos 6 caracteres' });

  if (!supabase) {
    const { currentPassword } = req.body;
    const db = loadDB();
    const user = db.users.find(u => u.id === req.userId);
    if (!user || !bcrypt.compareSync(currentPassword, user.password)) return res.status(401).json({ error: 'Senha atual incorreta' });
    user.password = bcrypt.hashSync(newPassword, 10);
    saveDB(db);
    return res.json({ success: true, message: 'Senha alterada com sucesso' });
  }

  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) return res.status(400).json({ error: error.message });
  res.json({ success: true, message: 'Senha alterada com sucesso' });
});

// Request password reset
app.post('/api/auth/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email é obrigatório' });

  if (!supabase) {
    const db = loadDB();
    const user = db.users.find(u => u.email === email);
    if (!user) return res.json({ success: true, message: 'Se o email existir, você receberá um link de recuperação.' });
    const resetToken = crypto.randomBytes(32).toString('hex');
    db.resetTokens = db.resetTokens.filter(t => t.email !== email);
    db.resetTokens.push({ email, token: resetToken, expires: new Date(Date.now() + 3600000).toISOString() });
    saveDB(db);
    return res.json({ success: true, message: 'Se o email existir, você receberá um link de recuperação.', _devToken: resetToken });
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${req.headers.origin}/index.html`
  });

  if (error) return res.status(400).json({ error: error.message });
  res.json({ success: true, message: 'Se o email existir, você receberá um link de recuperação.' });
});

// Reset password with token
app.post('/api/auth/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  if (!newPassword || newPassword.length < 6) return res.status(400).json({ error: 'Nova senha deve ter pelo menos 6 caracteres' });

  if (!supabase) {
    const db = loadDB();
    const resetEntry = db.resetTokens.find(t => t.token === token && new Date(t.expires) > new Date());
    if (!resetEntry) return res.status(400).json({ error: 'Token inválido ou expirado' });
    const user = db.users.find(u => u.email === resetEntry.email);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
    user.password = bcrypt.hashSync(newPassword, 10);
    db.resetTokens = db.resetTokens.filter(t => t.token !== token);
    saveDB(db);
    return res.json({ success: true, message: 'Senha redefinida com sucesso' });
  }

  // Supabase uses a different flow for reset-password (usually via a link that sets a session)
  // But if the user provides the token manually (e.g. from an email), we can update the user
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) return res.status(400).json({ error: error.message });
  res.json({ success: true, message: 'Senha redefinida com sucesso' });
});

// Delete account
app.delete('/api/auth/me', authMiddleware, async (req, res) => {
  if (!supabase) {
    const db = loadDB();
    const userForms = db.forms.filter(f => f.user_id === req.userId).map(f => f.id);
    db.responses = db.responses.filter(r => !userForms.includes(r.form_id));
    db.forms = db.forms.filter(f => f.user_id !== req.userId);
    db.notifications = db.notifications.filter(n => n.user_id !== req.userId);
    db.users = db.users.filter(u => u.id !== req.userId);
    saveDB(db);
    return res.json({ success: true });
  }

  const { error } = await supabase.from('profiles').delete().eq('id', req.userId);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// ==================== FORMS ROUTES ====================

// List user forms
app.get('/api/forms', authMiddleware, async (req, res) => {
  if (!supabase) {
    const db = loadDB();
    const forms = db.forms.filter(f => f.user_id === req.userId).sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    forms.forEach(f => {
      f.response_count = db.responses.filter(r => r.form_id === f.id).length;
    });
    return res.json({ forms });
  }

  // Supabase version
  const { data: forms, error } = await supabase
    .from('forms')
    .select('*, responses(count)')
    .eq('user_id', req.userId)
    .order('updated_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });

  // Map counts
  const formsWithCount = forms.map(f => ({
    ...f,
    response_count: f.responses?.[0]?.count || 0
  }));

  res.json({ forms: formsWithCount });
});

// Get single form
app.get('/api/forms/:id', authMiddleware, async (req, res) => {
  const id = req.params.id; // Could be numeric string or UUID depending on DB

  if (!supabase) {
    const db = loadDB();
    const form = db.forms.find(f => f.id === parseInt(id) && f.user_id === req.userId);
    if (!form) return res.status(404).json({ error: 'Formulário não encontrado' });
    form.response_count = db.responses.filter(r => r.form_id === form.id).length;
    return res.json({ form });
  }

  const { data: form, error } = await supabase
    .from('forms')
    .select('*, responses(count)')
    .eq('id', id)
    .eq('user_id', req.userId)
    .single();

  if (error || !form) return res.status(404).json({ error: 'Formulário não encontrado' });

  form.response_count = form.responses?.[0]?.count || 0;
  res.json({ form });
});

// Create form
app.post('/api/forms', authMiddleware, async (req, res) => {
  const { title, description, emoji, fields, status, theme_color, webhook_url, conditional_rules, folder_id } = req.body;

  if (!supabase) {
    const db = loadDB();
    const form = {
      id: genId(db), user_id: req.userId, title: title || 'Formulário sem título',
      description: description || '', emoji: emoji || '📋', fields: fields || [],
      status: status || 'draft', theme_color: theme_color || '#7c3aed',
      webhook_url: webhook_url || '', conditional_rules: conditional_rules || [],
      folder_id: folder_id || null,
      views: 0, created_at: new Date().toISOString(), updated_at: new Date().toISOString()
    };
    db.forms.push(form);
    saveDB(db);
    form.response_count = 0;
    return res.status(201).json({ form });
  }

  const { data: form, error } = await supabase
    .from('forms')
    .insert([{
      user_id: req.userId,
      title: title || 'Formulário sem título',
      description: description || '',
      emoji: emoji || '📋',
      fields: fields || [],
      status: status || 'draft',
      theme_color: theme_color || '#7c3aed',
      webhook_url: webhook_url || '',
      conditional_rules: conditional_rules || [],
      folder_id: folder_id || null,
      views: 0
    }])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  form.response_count = 0;
  res.status(201).json({ form });
});

// Update form
app.put('/api/forms/:id', authMiddleware, async (req, res) => {
  const id = req.params.id;
  const { title, description, emoji, fields, status, theme_color, webhook_url, conditional_rules, folder_id } = req.body;

  if (!supabase) {
    const db = loadDB();
    const form = db.forms.find(f => f.id === parseInt(id) && f.user_id === req.userId);
    if (!form) return res.status(404).json({ error: 'Formulário não encontrado' });
    if (title !== undefined) form.title = title;
    if (description !== undefined) form.description = description;
    if (emoji !== undefined) form.emoji = emoji;
    if (fields !== undefined) form.fields = fields;
    if (status !== undefined) form.status = status;
    if (theme_color !== undefined) form.theme_color = theme_color;
    if (webhook_url !== undefined) form.webhook_url = webhook_url;
    if (conditional_rules !== undefined) form.conditional_rules = conditional_rules;
    if (folder_id !== undefined) form.folder_id = folder_id;
    form.updated_at = new Date().toISOString();
    saveDB(db);
    form.response_count = db.responses.filter(r => r.form_id === form.id).length;
    return res.json({ form });
  }

  const { data: form, error } = await supabase
    .from('forms')
    .update({
      title, description, emoji, fields, status, theme_color, webhook_url, conditional_rules, folder_id,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .eq('user_id', req.userId)
    .select()
    .single();

  if (error || !form) return res.status(404).json({ error: 'Formulário não encontrado' });

  const { count } = await supabase
    .from('responses')
    .select('*', { count: 'exact', head: true })
    .eq('form_id', id);

  form.response_count = count || 0;
  res.json({ form });
});

// Duplicate form
app.post('/api/forms/:id/duplicate', authMiddleware, async (req, res) => {
  const id = req.params.id;

  if (!supabase) {
    const db = loadDB();
    const original = db.forms.find(f => f.id === parseInt(id) && f.user_id === req.userId);
    if (!original) return res.status(404).json({ error: 'Formulário não encontrado' });
    const duplicate = { id: genId(db), user_id: req.userId, title: original.title + ' (cópia)', description: original.description, emoji: original.emoji, fields: JSON.parse(JSON.stringify(original.fields)), status: 'draft', theme_color: original.theme_color, webhook_url: original.webhook_url || '', conditional_rules: original.conditional_rules ? JSON.parse(JSON.stringify(original.conditional_rules)) : [], views: 0, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    db.forms.push(duplicate);
    saveDB(db);
    duplicate.response_count = 0;
    return res.status(201).json({ form: duplicate });
  }

  const { data: original, error: fetchErr } = await supabase.from('forms').select('*').eq('id', id).eq('user_id', req.userId).single();
  if (fetchErr || !original) return res.status(404).json({ error: 'Formulário não encontrado' });

  const { id: _, created_at: __, updated_at: ___, views: ____, ...rest } = original;
  const { data: duplicate, error } = await supabase
    .from('forms')
    .insert([{
      ...rest,
      title: original.title + ' (cópia)',
      status: 'draft',
      views: 0
    }])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  duplicate.response_count = 0;
  res.status(201).json({ form: duplicate });
});

// Empty trash
app.delete('/api/forms/trash/empty', authMiddleware, async (req, res) => {
  if (!supabase) {
    const db = loadDB();
    const trashedForms = db.forms.filter(f => f.status === 'trash' && f.user_id === req.userId).map(f => f.id);
    db.forms = db.forms.filter(f => !trashedForms.includes(f.id));
    db.responses = db.responses.filter(r => !trashedForms.includes(r.form_id));
    saveDB(db);
    return res.json({ success: true, deleted_count: trashedForms.length });
  }

  // Supabase version: Delete all forms with status 'trash' for this user
  const { data, error } = await supabase
    .from('forms')
    .delete()
    .eq('user_id', req.userId)
    .eq('status', 'trash');

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// Delete form
app.delete('/api/forms/:id', authMiddleware, async (req, res) => {
  const id = req.params.id;

  if (!supabase) {
    const db = loadDB();
    const idx = db.forms.findIndex(f => f.id === parseInt(id) && f.user_id === req.userId);
    if (idx === -1) return res.status(404).json({ error: 'Formulário não encontrado' });
    db.forms.splice(idx, 1);
    db.responses = db.responses.filter(r => r.form_id !== parseInt(id));
    saveDB(db);
    return res.json({ success: true });
  }

  const { error } = await supabase
    .from('forms')
    .delete()
    .eq('id', id)
    .eq('user_id', req.userId);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// ==================== FOLDERS ROUTES ====================
app.get('/api/folders', authMiddleware, async (req, res) => {
  if (!supabase) {
    const db = loadDB();
    const folders = db.folders.filter(f => f.user_id === req.userId);
    return res.json({ folders });
  }
  const { data: folders, error } = await supabase.from('folders').select('*').eq('user_id', req.userId).order('name');
  if (error) return res.status(500).json({ error: error.message });
  res.json({ folders });
});

app.post('/api/folders', authMiddleware, async (req, res) => {
  const { name } = req.body;
  if (!supabase) {
    const db = loadDB();
    const folder = { id: genId(db), user_id: req.userId, name, created_at: new Date().toISOString() };
    if(!db.folders) db.folders = [];
    db.folders.push(folder);
    saveDB(db);
    return res.status(201).json({ folder });
  }
  const { data, error } = await supabase.from('folders').insert([{ user_id: req.userId, name }]).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ folder: data });
});

app.delete('/api/folders/:id', authMiddleware, async (req, res) => {
  const id = req.params.id;
  if (!supabase) {
    const db = loadDB();
    db.folders = db.folders.filter(f => f.id !== parseInt(id));
    saveDB(db);
    return res.json({ success: true });
  }
  const { error } = await supabase.from('folders').delete().eq('id', id).eq('user_id', req.userId);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// ==================== FILE UPLOAD ====================
app.post('/api/upload', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Nenhum arquivo enviado' });

  if (!supabase) {
    // Local fallback
    return res.json({
      success: true,
      file: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        size: req.file.size,
        url: `/uploads/${req.file.filename}`
      }
    });
  }

  // Supabase Storage upload
  try {
    const fileExt = path.extname(req.file.originalname);
    const fileName = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${fileExt}`;
    const filePath = `user_uploads/${fileName}`;

    const { data, error } = await supabase.storage
      .from('uploads')
      .upload(filePath, req.file.buffer, {
        contentType: req.file.mimetype,
        cacheControl: '3600'
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('uploads')
      .getPublicUrl(filePath);

    res.json({
      success: true,
      file: {
        filename: fileName,
        originalname: req.file.originalname,
        size: req.file.size,
        url: publicUrl
      }
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Erro ao fazer upload para o Supabase' });
  }
});

// ==================== PUBLIC FORM (for respondents) ====================
app.get('/api/public/forms/:id', async (req, res) => {
  const id = req.params.id;

  if (!supabase) {
    const db = loadDB();
    const form = db.forms.find(f => f.id === parseInt(id) && f.status === 'published');
    if (!form) return res.status(404).json({ error: 'Formulário não encontrado ou não publicado' });
    form.views = (form.views || 0) + 1;
    saveDB(db);
    return res.json({ form: { id: form.id, title: form.title, description: form.description, fields: form.fields, theme_color: form.theme_color, conditional_rules: form.conditional_rules || [] } });
  }

  const { data: form, error } = await supabase
    .from('forms')
    .select('id, title, description, fields, theme_color, conditional_rules')
    .eq('id', id)
    .eq('status', 'published')
    .single();

  if (error || !form) return res.status(404).json({ error: 'Formulário não encontrado' });

  // Increment views in background
  supabase.rpc('increment_form_views', { form_id_input: id }).then(() => {});

  res.json({ form });
});

// Submit response (public)
app.post('/api/public/forms/:id/responses', async (req, res) => {
  const id = req.params.id;
  const { data } = req.body;

  let webhookUrl = null;
  let formTitle = '';

  if (!supabase) {
    const db = loadDB();
    const form = db.forms.find(f => f.id === parseInt(id) && f.status === 'published');
    if (!form) return res.status(404).json({ error: 'Formulário não encontrado' });
    webhookUrl = form.webhook_url;
    formTitle = form.title;
    
    const response = { id: genId(db), form_id: parseInt(id), data: data || {}, submitted_at: new Date().toISOString() };
    db.responses.push(response);
    db.notifications.push({ id: genId(db), user_id: form.user_id, type: 'new_response', form_id: form.id, form_title: form.title, message: `Nova resposta no formulário "${form.title}"`, read: false, created_at: new Date().toISOString() });
    saveDB(db);
  } else {
    // Fetch form first to get webhook URL
    const { data: form, error: formError } = await supabase.from('forms').select('webhook_url, title').eq('id', id).single();
    if (!formError && form) {
      webhookUrl = form.webhook_url;
      formTitle = form.title;
    }

    const { data: respData, error } = await supabase
      .from('responses')
      .insert([{ form_id: id, data: data || {} }])
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
  }

  // Trigger Webhook if configured
  if (webhookUrl && webhookUrl.startsWith('http')) {
    const payload = {
      event: 'new_response',
      form_id: id,
      form_title: formTitle,
      data: data || {},
      submitted_at: new Date().toISOString()
    };
    
    // Non-blocking trigger
    fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(err => console.error('Webhook Error:', err.message));
  }

  res.status(201).json({ success: true });
});

// ==================== RESPONSES ROUTES ====================
app.get('/api/forms/:id/responses', authMiddleware, async (req, res) => {
  const id = req.params.id;

  if (!supabase) {
    const db = loadDB();
    const form = db.forms.find(f => f.id === parseInt(id) && f.user_id === req.userId);
    if (!form) return res.status(404).json({ error: 'Formulário não encontrado' });
    const responses = db.responses.filter(r => r.form_id === parseInt(id)).sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at));
    return res.json({ responses });
  }

  const { data: responses, error } = await supabase
    .from('responses')
    .select('*')
    .eq('form_id', id)
    .order('submitted_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json({ responses });
});

// Export CSV
app.get('/api/forms/:id/export/csv', authMiddleware, async (req, res) => {
  const id = req.params.id;

  let form, responses;
  if (!supabase) {
    const db = loadDB();
    form = db.forms.find(f => f.id === parseInt(id) && f.user_id === req.userId);
    responses = db.responses.filter(r => r.form_id === parseInt(id));
  } else {
    const { data: f } = await supabase.from('forms').select('*').eq('id', id).eq('user_id', req.userId).single();
    const { data: r } = await supabase.from('responses').select('*').eq('form_id', id);
    form = f; responses = r;
  }

  if (!form) return res.status(404).json({ error: 'Formulário não encontrado' });

  const fields = form.fields || [];
  const headers = fields.map(f => `"${(f.label || '').replace(/"/g, '""')}"`).concat(['"Data"']);
  const rows = responses.map(r => {
    const d = r.data || {};
    const cells = fields.map(f => {
      let val = d[f.id] || '';
      if (Array.isArray(val)) val = val.join('; ');
      return `"${String(val).replace(/"/g, '""')}"`;
    });
    cells.push(`"${new Date(r.submitted_at).toLocaleString('pt-BR')}"`);
    return cells.join(',');
  });

  const csv = '\uFEFF' + headers.join(',') + '\n' + rows.join('\n');
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${form.title.replace(/[^a-zA-Z0-9]/g, '_')}_respostas.csv"`);
  res.send(csv);
});

// Delete response
app.delete('/api/responses/:id', authMiddleware, async (req, res) => {
  const rid = req.params.id;

  if (!supabase) {
    const db = loadDB();
    const response = db.responses.find(r => r.id === parseInt(rid));
    if (!response) return res.status(404).json({ error: 'Resposta não encontrada' });
    const form = db.forms.find(f => f.id === response.form_id && f.user_id === req.userId);
    if (!form) return res.status(404).json({ error: 'Resposta não encontrada' });
    db.responses = db.responses.filter(r => r.id !== parseInt(rid));
    saveDB(db);
    return res.json({ success: true });
  }

  // Verify ownership via form
  const { data: response } = await supabase.from('responses').select('form_id').eq('id', rid).single();
  if (!response) return res.status(404).json({ error: 'Resposta não encontrada' });

  const { data: form } = await supabase.from('forms').select('id').eq('id', response.form_id).eq('user_id', req.userId).single();
  if (!form) return res.status(403).json({ error: 'Acesso negado' });

  const { error } = await supabase.from('responses').delete().eq('id', rid);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// ==================== NOTIFICATIONS ====================
app.get('/api/notifications', authMiddleware, async (req, res) => {
  if (!supabase) {
    const db = loadDB();
    const notifications = db.notifications.filter(n => n.user_id === req.userId).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 50);
    const unreadCount = notifications.filter(n => !n.read).length;
    return res.json({ notifications, unreadCount });
  }

  const { data: notifications, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', req.userId)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) return res.status(500).json({ error: error.message });
  const unreadCount = notifications.filter(n => !n.read).length;
  res.json({ notifications, unreadCount });
});

app.put('/api/notifications/read-all', authMiddleware, async (req, res) => {
  if (!supabase) {
    const db = loadDB();
    db.notifications.filter(n => n.user_id === req.userId).forEach(n => n.read = true);
    saveDB(db);
    return res.json({ success: true });
  }

  await supabase.from('notifications').update({ read: true }).eq('user_id', req.userId);
  res.json({ success: true });
});

app.put('/api/notifications/:id/read', authMiddleware, async (req, res) => {
  const id = req.params.id;
  if (!supabase) {
    const db = loadDB();
    const notif = db.notifications.find(n => n.id === parseInt(id) && n.user_id === req.userId);
    if (notif) { notif.read = true; saveDB(db); }
    return res.json({ success: true });
  }

  await supabase.from('notifications').update({ read: true }).eq('id', id).eq('user_id', req.userId);
  res.json({ success: true });
});

// ==================== PLANS ====================
app.post('/api/plans/upgrade', authMiddleware, async (req, res) => {
  const { plan } = req.body;
  if (!['pro', 'business'].includes(plan)) return res.status(400).json({ error: 'Plano inválido' });

  if (!supabase) {
    const db = loadDB();
    const user = db.users.find(u => u.id === req.userId);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
    user.plan = plan;
    saveDB(db);
    return res.json({ success: true, user: { id: user.id, name: user.name, email: user.email, avatar_color: user.avatar_color, plan: user.plan } });
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .update({ plan })
    .eq('id', req.userId)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, user: { ...profile, email: req.userEmail } });
});

// ==================== STATS ====================
app.get('/api/stats', authMiddleware, async (req, res) => {
  if (!supabase) {
    const db = loadDB();
    const userForms = db.forms.filter(f => f.user_id === req.userId);
    const formIds = userForms.map(f => f.id);
    const totalForms = userForms.length;
    const totalResponses = db.responses.filter(r => formIds.includes(r.form_id)).length;
    const totalViews = userForms.reduce((sum, f) => sum + (f.views || 0), 0);
    const conversionRate = totalViews > 0 ? Math.round((totalResponses / totalViews) * 100) : 0;
    return res.json({ totalForms, totalResponses, totalViews, conversionRate });
  }

  // Use RPC or sum in JS
  const { data: forms, error } = await supabase
    .from('forms')
    .select('id, views, responses(count)')
    .eq('user_id', req.userId);

  if (error) return res.status(500).json({ error: error.message });

  const totalForms = forms.length;
  const totalResponses = forms.reduce((sum, f) => sum + (f.responses?.[0]?.count || 0), 0);
  const totalViews = forms.reduce((sum, f) => sum + (f.views || 0), 0);
  const conversionRate = totalViews > 0 ? Math.round((totalResponses / totalViews) * 100) : 0;

  res.json({ totalForms, totalResponses, totalViews, conversionRate });
});

// ==================== SERVE PUBLIC FORM PAGE ====================
app.get('/form/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'form.html'));
});

// ==================== CATCH-ALL ====================
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ==================== START ====================
app.listen(PORT, () => {
  console.log(`\n  🚀 Formei Server rodando em http://localhost:${PORT}\n`);
});
