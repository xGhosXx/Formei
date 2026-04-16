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

const app = express();
const PORT = 3000;
const JWT_SECRET = 'formei_secret_key_2024_ultraSeguro';

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
const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`);
  }
});
const upload = multer({
  storage,
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

function loadDB() {
  try {
    if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
    if (!fs.existsSync(DB_PATH)) {
      const initial = { users: [], forms: [], responses: [], notifications: [], resetTokens: [], nextId: 1 };
      fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2));
      return initial;
    }
    const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
    if (!db.notifications) db.notifications = [];
    if (!db.resetTokens) db.resetTokens = [];
    return db;
  } catch {
    return { users: [], forms: [], responses: [], notifications: [], resetTokens: [], nextId: 1 };
  }
}

function saveDB(db) {
  if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
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
app.post('/api/auth/register', (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres' });
    }

    const db = loadDB();
    const existing = db.users.find(u => u.email === email);
    if (existing) {
      return res.status(409).json({ error: 'Este email já está cadastrado' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const colors = ['#7c3aed', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#8b5cf6'];
    const avatarColor = colors[Math.floor(Math.random() * colors.length)];

    const user = {
      id: genId(db),
      name,
      email,
      password: hashedPassword,
      avatar_color: avatarColor,
      plan: 'free',
      created_at: new Date().toISOString()
    };
    db.users.push(user);
    saveDB(db);

    const token = jwt.sign({ id: user.id, email }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({
      token,
      user: { id: user.id, name, email, avatar_color: avatarColor, plan: 'free' }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Login
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    const db = loadDB();
    const user = db.users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, avatar_color: user.avatar_color, plan: user.plan }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Get current user
app.get('/api/auth/me', authMiddleware, (req, res) => {
  const db = loadDB();
  const user = db.users.find(u => u.id === req.userId);
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
  res.json({ user: { id: user.id, name: user.name, email: user.email, avatar_color: user.avatar_color, plan: user.plan, created_at: user.created_at } });
});

// Update user profile
app.put('/api/auth/me', authMiddleware, (req, res) => {
  const db = loadDB();
  const user = db.users.find(u => u.id === req.userId);
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
  if (req.body.name) user.name = req.body.name;
  if (req.body.email) {
    const dup = db.users.find(u => u.email === req.body.email && u.id !== req.userId);
    if (dup) return res.status(409).json({ error: 'Este email já está em uso' });
    user.email = req.body.email;
  }
  if (req.body.avatar_color) user.avatar_color = req.body.avatar_color;
  saveDB(db);
  res.json({ user: { id: user.id, name: user.name, email: user.email, avatar_color: user.avatar_color, plan: user.plan } });
});

// Change password
app.put('/api/auth/password', authMiddleware, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) return res.status(400).json({ error: 'Senhas são obrigatórias' });
  if (newPassword.length < 6) return res.status(400).json({ error: 'Nova senha deve ter pelo menos 6 caracteres' });

  const db = loadDB();
  const user = db.users.find(u => u.id === req.userId);
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

  if (!bcrypt.compareSync(currentPassword, user.password)) {
    return res.status(401).json({ error: 'Senha atual incorreta' });
  }

  user.password = bcrypt.hashSync(newPassword, 10);
  saveDB(db);
  res.json({ success: true, message: 'Senha alterada com sucesso' });
});

// Request password reset
app.post('/api/auth/forgot-password', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email é obrigatório' });

  const db = loadDB();
  const user = db.users.find(u => u.email === email);
  if (!user) {
    // Don't reveal if email exists
    return res.json({ success: true, message: 'Se o email existir, você receberá um link de recuperação.' });
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  db.resetTokens = db.resetTokens.filter(t => t.email !== email); // Remove old tokens
  db.resetTokens.push({
    email,
    token: resetToken,
    expires: new Date(Date.now() + 3600000).toISOString() // 1 hour
  });
  saveDB(db);

  // In production, send email. Here we return the token for demo purposes
  console.log(`[Password Reset] Token for ${email}: ${resetToken}`);
  res.json({ success: true, message: 'Se o email existir, você receberá um link de recuperação.', _devToken: resetToken });
});

// Reset password with token
app.post('/api/auth/reset-password', (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) return res.status(400).json({ error: 'Token e nova senha são obrigatórios' });
  if (newPassword.length < 6) return res.status(400).json({ error: 'Nova senha deve ter pelo menos 6 caracteres' });

  const db = loadDB();
  const resetEntry = db.resetTokens.find(t => t.token === token && new Date(t.expires) > new Date());
  if (!resetEntry) return res.status(400).json({ error: 'Token inválido ou expirado' });

  const user = db.users.find(u => u.email === resetEntry.email);
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

  user.password = bcrypt.hashSync(newPassword, 10);
  db.resetTokens = db.resetTokens.filter(t => t.token !== token);
  saveDB(db);
  res.json({ success: true, message: 'Senha redefinida com sucesso' });
});

// Delete account
app.delete('/api/auth/me', authMiddleware, (req, res) => {
  const db = loadDB();
  const userForms = db.forms.filter(f => f.user_id === req.userId).map(f => f.id);
  db.responses = db.responses.filter(r => !userForms.includes(r.form_id));
  db.forms = db.forms.filter(f => f.user_id !== req.userId);
  db.notifications = db.notifications.filter(n => n.user_id !== req.userId);
  db.users = db.users.filter(u => u.id !== req.userId);
  saveDB(db);
  res.json({ success: true });
});

// ==================== FORMS ROUTES ====================

// List user forms
app.get('/api/forms', authMiddleware, (req, res) => {
  const db = loadDB();
  const forms = db.forms.filter(f => f.user_id === req.userId).sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
  forms.forEach(f => {
    f.response_count = db.responses.filter(r => r.form_id === f.id).length;
  });
  res.json({ forms });
});

// Get single form
app.get('/api/forms/:id', authMiddleware, (req, res) => {
  const db = loadDB();
  const id = parseInt(req.params.id);
  const form = db.forms.find(f => f.id === id && f.user_id === req.userId);
  if (!form) return res.status(404).json({ error: 'Formulário não encontrado' });
  form.response_count = db.responses.filter(r => r.form_id === form.id).length;
  res.json({ form });
});

// Create form
app.post('/api/forms', authMiddleware, (req, res) => {
  const db = loadDB();
  const { title, description, emoji, fields, status, theme_color, webhook_url, conditional_rules } = req.body;
  const form = {
    id: genId(db),
    user_id: req.userId,
    title: title || 'Formulário sem título',
    description: description || '',
    emoji: emoji || '📋',
    fields: fields || [],
    status: status || 'draft',
    theme_color: theme_color || '#7c3aed',
    webhook_url: webhook_url || '',
    conditional_rules: conditional_rules || [],
    views: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  db.forms.push(form);
  saveDB(db);
  form.response_count = 0;
  res.status(201).json({ form });
});

// Update form
app.put('/api/forms/:id', authMiddleware, (req, res) => {
  const db = loadDB();
  const id = parseInt(req.params.id);
  const form = db.forms.find(f => f.id === id && f.user_id === req.userId);
  if (!form) return res.status(404).json({ error: 'Formulário não encontrado' });

  const { title, description, emoji, fields, status, theme_color, webhook_url, conditional_rules } = req.body;
  if (title !== undefined) form.title = title;
  if (description !== undefined) form.description = description;
  if (emoji !== undefined) form.emoji = emoji;
  if (fields !== undefined) form.fields = fields;
  if (status !== undefined) form.status = status;
  if (theme_color !== undefined) form.theme_color = theme_color;
  if (webhook_url !== undefined) form.webhook_url = webhook_url;
  if (conditional_rules !== undefined) form.conditional_rules = conditional_rules;
  form.updated_at = new Date().toISOString();
  saveDB(db);

  form.response_count = db.responses.filter(r => r.form_id === form.id).length;
  res.json({ form });
});

// Duplicate form
app.post('/api/forms/:id/duplicate', authMiddleware, (req, res) => {
  const db = loadDB();
  const id = parseInt(req.params.id);
  const original = db.forms.find(f => f.id === id && f.user_id === req.userId);
  if (!original) return res.status(404).json({ error: 'Formulário não encontrado' });

  const duplicate = {
    id: genId(db),
    user_id: req.userId,
    title: original.title + ' (cópia)',
    description: original.description,
    emoji: original.emoji,
    fields: JSON.parse(JSON.stringify(original.fields)),
    status: 'draft',
    theme_color: original.theme_color,
    webhook_url: original.webhook_url || '',
    conditional_rules: original.conditional_rules ? JSON.parse(JSON.stringify(original.conditional_rules)) : [],
    views: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  db.forms.push(duplicate);
  saveDB(db);
  duplicate.response_count = 0;
  res.status(201).json({ form: duplicate });
});

// Delete form
app.delete('/api/forms/:id', authMiddleware, (req, res) => {
  const db = loadDB();
  const id = parseInt(req.params.id);
  const idx = db.forms.findIndex(f => f.id === id && f.user_id === req.userId);
  if (idx === -1) return res.status(404).json({ error: 'Formulário não encontrado' });
  db.forms.splice(idx, 1);
  db.responses = db.responses.filter(r => r.form_id !== id);
  saveDB(db);
  res.json({ success: true });
});

// ==================== FILE UPLOAD ====================
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Nenhum arquivo enviado' });
  res.json({
    success: true,
    file: {
      filename: req.file.filename,
      originalname: req.file.originalname,
      size: req.file.size,
      url: `/uploads/${req.file.filename}`
    }
  });
});

// ==================== PUBLIC FORM (for respondents) ====================
app.get('/api/public/forms/:id', (req, res) => {
  const db = loadDB();
  const id = parseInt(req.params.id);
  const form = db.forms.find(f => f.id === id && f.status === 'published');
  if (!form) return res.status(404).json({ error: 'Formulário não encontrado ou não publicado' });
  form.views = (form.views || 0) + 1;
  saveDB(db);
  res.json({
    form: {
      id: form.id, title: form.title, description: form.description,
      fields: form.fields, theme_color: form.theme_color,
      conditional_rules: form.conditional_rules || []
    }
  });
});

// Submit response (public)
app.post('/api/public/forms/:id/responses', (req, res) => {
  const db = loadDB();
  const id = parseInt(req.params.id);
  const form = db.forms.find(f => f.id === id && f.status === 'published');
  if (!form) return res.status(404).json({ error: 'Formulário não encontrado' });

  const response = {
    id: genId(db),
    form_id: id,
    data: req.body.data || {},
    submitted_at: new Date().toISOString()
  };
  db.responses.push(response);

  // Create notification for form owner
  db.notifications.push({
    id: genId(db),
    user_id: form.user_id,
    type: 'new_response',
    form_id: form.id,
    form_title: form.title,
    message: `Nova resposta no formulário "${form.title}"`,
    read: false,
    created_at: new Date().toISOString()
  });

  saveDB(db);

  // Webhook
  if (form.webhook_url) {
    try {
      const payload = JSON.stringify({ form_id: form.id, form_title: form.title, response: response.data, submitted_at: response.submitted_at });
      const urlObj = new URL(form.webhook_url);
      const options = {
        hostname: urlObj.hostname,
        port: urlObj.port,
        path: urlObj.pathname + urlObj.search,
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) },
        timeout: 5000
      };
      const mod = urlObj.protocol === 'https:' ? https : http;
      const wreq = mod.request(options, () => {});
      wreq.on('error', (e) => console.log('Webhook error:', e.message));
      wreq.write(payload);
      wreq.end();
    } catch (e) { console.log('Webhook error:', e.message); }
  }

  res.status(201).json({ success: true });
});

// ==================== RESPONSES ROUTES ====================
app.get('/api/forms/:id/responses', authMiddleware, (req, res) => {
  const db = loadDB();
  const id = parseInt(req.params.id);
  const form = db.forms.find(f => f.id === id && f.user_id === req.userId);
  if (!form) return res.status(404).json({ error: 'Formulário não encontrado' });
  const responses = db.responses.filter(r => r.form_id === id).sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at));
  res.json({ responses });
});

// Export CSV
app.get('/api/forms/:id/export/csv', authMiddleware, (req, res) => {
  const db = loadDB();
  const id = parseInt(req.params.id);
  const form = db.forms.find(f => f.id === id && f.user_id === req.userId);
  if (!form) return res.status(404).json({ error: 'Formulário não encontrado' });

  const responses = db.responses.filter(r => r.form_id === id);
  const fields = form.fields || [];

  // Build CSV
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
app.delete('/api/responses/:id', authMiddleware, (req, res) => {
  const db = loadDB();
  const rid = parseInt(req.params.id);
  const response = db.responses.find(r => r.id === rid);
  if (!response) return res.status(404).json({ error: 'Resposta não encontrada' });
  const form = db.forms.find(f => f.id === response.form_id && f.user_id === req.userId);
  if (!form) return res.status(404).json({ error: 'Resposta não encontrada' });
  db.responses = db.responses.filter(r => r.id !== rid);
  saveDB(db);
  res.json({ success: true });
});

// ==================== NOTIFICATIONS ====================
app.get('/api/notifications', authMiddleware, (req, res) => {
  const db = loadDB();
  const notifications = db.notifications
    .filter(n => n.user_id === req.userId)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 50);
  const unreadCount = notifications.filter(n => !n.read).length;
  res.json({ notifications, unreadCount });
});

app.put('/api/notifications/read-all', authMiddleware, (req, res) => {
  const db = loadDB();
  db.notifications.filter(n => n.user_id === req.userId).forEach(n => n.read = true);
  saveDB(db);
  res.json({ success: true });
});

app.put('/api/notifications/:id/read', authMiddleware, (req, res) => {
  const db = loadDB();
  const id = parseInt(req.params.id);
  const notif = db.notifications.find(n => n.id === id && n.user_id === req.userId);
  if (notif) { notif.read = true; saveDB(db); }
  res.json({ success: true });
});

// ==================== PLANS ====================
app.post('/api/plans/upgrade', authMiddleware, (req, res) => {
  const { plan } = req.body;
  if (!['pro', 'business'].includes(plan)) return res.status(400).json({ error: 'Plano inválido' });
  const db = loadDB();
  const user = db.users.find(u => u.id === req.userId);
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
  user.plan = plan;
  saveDB(db);
  res.json({ success: true, user: { id: user.id, name: user.name, email: user.email, avatar_color: user.avatar_color, plan: user.plan } });
});

// ==================== STATS ====================
app.get('/api/stats', authMiddleware, (req, res) => {
  const db = loadDB();
  const userForms = db.forms.filter(f => f.user_id === req.userId);
  const formIds = userForms.map(f => f.id);
  const totalForms = userForms.length;
  const totalResponses = db.responses.filter(r => formIds.includes(r.form_id)).length;
  const totalViews = userForms.reduce((sum, f) => sum + (f.views || 0), 0);
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
