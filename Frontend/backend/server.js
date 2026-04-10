const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 5002;
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret_for_production';
const EMAIL_HOST = process.env.EMAIL_HOST || 'smtp.gmail.com';
const EMAIL_PORT = parseInt(process.env.EMAIL_PORT || '465', 10);
const EMAIL_SECURE = process.env.EMAIL_SECURE !== 'false';
const EMAIL_USER = process.env.EMAIL_USER || '';
const EMAIL_PASS = process.env.EMAIL_PASS || '';
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || EMAIL_USER || 'admin@example.com';
const UPLOAD_DIR = path.join(__dirname, 'uploads');

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const safeName = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`;
    cb(null, safeName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed.'));
    }
    cb(null, true);
  }
});

let mailTransport;
if (EMAIL_USER && EMAIL_PASS) {
  mailTransport = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: EMAIL_SECURE,
    auth: { user: EMAIL_USER, pass: EMAIL_PASS }
  });
} else {
  console.warn('Email credentials are not configured. Notification emails will be logged instead of sent.');
}

async function sendNotificationEmail(subject, text, to = NOTIFY_EMAIL) {
  if (!mailTransport) {
    console.log('Email not sent because transport is not configured:', { subject, text, to });
    return false;
  }

  try {
    await mailTransport.sendMail({
      from: EMAIL_USER,
      to,
      subject,
      text
    });
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}

app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:3001'] }));
app.use(express.json());
app.use('/uploads', express.static(UPLOAD_DIR));

const users = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    passwordHash: bcrypt.hashSync('password123', 10),
    role: 'admin'
  }
];

const pendingApplications = [];

const products = [
  {
    id: 'prod-1',
    name: 'Walk8 Anniversary Polo - Navy Blue',
    category: 'polo',
    price: 7500,
    stock: 24,
    description: 'High-quality polo with the August 93 Club emblem.',
    imageUrl: 'https://placehold.co/600x600/7a0a0a/fff?text=Anniversary+Polo',
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 'prod-2',
    name: 'Ohanze Congress Cap',
    category: 'cap',
    price: 3500,
    stock: 40,
    description: 'Classic cap with embroidered club logo.',
    imageUrl: 'https://placehold.co/600x600/0d0d0d/fff?text=Cap',
    sizes: ['One size']
  }
];

const ads = [
  {
    id: 'ad-1',
    title: 'New Drop: Walk8 Merch',
    message: 'Featured club merch with fresh designs. Shop now and represent Ohanze Congress in style.',
    ctaText: 'Shop the drop',
    imageUrl: 'https://placehold.co/900x400/7a0a0a/fff?text=August+93+Promo',
    category: 'all',
    createdAt: new Date().toISOString()
  }
];

const orders = [];

function createToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '8h' });
}

function authenticate(req, res, next) {
  const token = req.header('x-auth-token') || req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token provided.' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = users.find((u) => u.id === decoded.id);
    if (!user) return res.status(401).json({ message: 'Invalid token.' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token is invalid or expired.' });
  }
}

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const token = createToken(user);
  return res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, phone, reason, password } = req.body;
  if (!name || !email || !password || !reason) {
    return res.status(400).json({ message: 'Name, email, password and reason are required.' });
  }

  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase()) || pendingApplications.some((p) => p.email.toLowerCase() === email.toLowerCase())) {
    return res.status(400).json({ message: 'An account or application already exists with that email.' });
  }

  pendingApplications.push({
    id: `${Date.now()}`,
    name,
    email,
    phone,
    reason,
    passwordHash: bcrypt.hashSync(password, 10),
    role: 'applicant'
  });

  return res.json({ message: 'Application submitted successfully.' });
});

app.get('/api/auth/me', authenticate, (req, res) => {
  const { id, name, email, role } = req.user;
  return res.json({ user: { id, name, email, role } });
});

app.get('/api/auth/pending', authenticate, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied.' });
  return res.json(pendingApplications.map(({ passwordHash, ...rest }) => rest));
});

app.put('/api/auth/approve/:id', authenticate, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied.' });
  const { action } = req.body;
  const applicationIndex = pendingApplications.findIndex((p) => p.id === req.params.id);
  if (applicationIndex === -1) {
    return res.status(404).json({ message: 'Application not found.' });
  }

  const application = pendingApplications[applicationIndex];
  pendingApplications.splice(applicationIndex, 1);

  const applicantAddress = application.email;
  const actionLabel = action === 'approve' ? 'approved' : 'declined';
  const subject = `Admin application ${actionLabel}`;
  const message = `Hello ${application.name},\n\n` +
    `Your admin application has been ${actionLabel}.\n` +
    `Reviewed by: ${req.user.name} (${req.user.email})\n\n` +
    (action === 'approve'
      ? 'You can now log in as an admin with your current email and password.\n'
      : 'Your request was declined, please contact the team if you need help.\n') +
    '\nThank you.\n';

  if (action === 'approve') {
    users.push({
      id: `${users.length + 1}`,
      name: application.name,
      email: application.email,
      role: 'admin',
      passwordHash: application.passwordHash
    });
    await sendNotificationEmail(subject, message, NOTIFY_EMAIL);
    await sendNotificationEmail(subject, message, applicantAddress);
    return res.json({ message: 'Application approved.' });
  }

  await sendNotificationEmail(subject, message, NOTIFY_EMAIL);
  await sendNotificationEmail(subject, message, applicantAddress);
  return res.json({ message: 'Application declined.' });
});

app.get('/api/products', (req, res) => {
  return res.json(products);
});

app.get('/api/ads', (req, res) => {
  return res.json(ads);
});

app.post('/api/orders', (req, res) => {
  const { name, email, phone, address, items } = req.body;
  if (!name || !email || !phone || !address || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Name, email, phone, address and cart items are required.' });
  }

  const totalAmount = items.reduce((sum, item) => sum + Number(item.price || 0), 0);
  const order = {
    id: `order-${Date.now()}`,
    name,
    email,
    phone,
    address,
    items,
    totalAmount,
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  orders.unshift(order);
  return res.status(201).json({ message: 'Order placed successfully.', order });
});

app.post('/api/ads', authenticate, upload.single('image'), (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied.' });
  const { title, message, ctaText, category, imageUrl } = req.body;
  if (!title || !message) {
    return res.status(400).json({ message: 'Ad title and message are required.' });
  }

  let finalImageUrl = imageUrl;
  if (req.file) {
    finalImageUrl = `/uploads/${req.file.filename}`;
  }
  if (!finalImageUrl) {
    finalImageUrl = 'https://placehold.co/900x400/7a0a0a/fff?text=August+93+Promo';
  }

  const newAd = {
    id: `ad-${Date.now()}`,
    title,
    message,
    ctaText: ctaText || 'Shop now',
    imageUrl: finalImageUrl,
    category: category || 'all',
    createdAt: new Date().toISOString()
  };

  ads.unshift(newAd);
  return res.status(201).json({ message: 'Ad created.', ad: newAd });
});

app.post('/api/products', authenticate, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied.' });
  const { name, category, price, stock, description, imageUrl, sizes } = req.body;
  if (!name || !category || price == null || stock == null) {
    return res.status(400).json({ message: 'Name, category, price, and stock are required.' });
  }

  const newProduct = {
    id: `prod-${Date.now()}`,
    name,
    category,
    price: Number(price),
    stock: Number(stock),
    description: description || '',
    imageUrl: imageUrl || 'https://placehold.co/600x600/f0eded/999?text=No+Image',
    sizes: Array.isArray(sizes) ? sizes : (sizes ? [sizes] : ['One size'])
  };

  products.unshift(newProduct);
  return res.status(201).json({ message: 'Product added.', product: newProduct });
});

app.get('/api/orders', authenticate, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied.' });
  return res.json(orders);
});

app.get('/api/orders/stats/summary', authenticate, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied.' });
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const completedOrders = orders.filter((o) => o.status === 'completed').length;
  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);
  return res.json({ totalOrders, pendingOrders, completedOrders, totalRevenue });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Server error: route not found.' });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
