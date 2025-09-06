const http = require('http');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const { greenScore } = require('./utils/greenScore');

const prisma = new PrismaClient();
const app = express();
const server = http.createServer(app);

const { Server } = require('socket.io');
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_ORIGIN || '*', methods: ['GET', 'POST'] }
});

io.on('connection', (socket) => {
  socket.join('listings');
});

function emitListing(event, data) {
  io.to('listings').emit(event, data);
}

app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*' }));
app.use(express.json());
app.use(morgan('dev'));

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split?.(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (e) {
    return res.status(403).json({ error: 'Invalid token' });
  }
}

function sanitizeUser(u) {
  if (!u) return null;
  const { password, ...rest } = u;
  return rest;
}

// --- Auth
app.post('/signup', async (req, res) => {
  const { email, password, username } = req.body;
  if (!email || !password || !username) return res.status(400).json({ error: 'Missing fields' });
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return res.status(400).json({ error: 'Email already in use' });
  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { email, password: hashed, username } });
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '2h' });
  res.json({ token, user: sanitizeUser(user) });
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '2h' });
  res.json({ token, user: sanitizeUser(user) });
});

// --- Profile
app.get('/me', auth, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
  res.json(sanitizeUser(user));
});
app.put('/me', auth, async (req, res) => {
  const { email, username } = req.body;
  try {
    const user = await prisma.user.update({ where: { id: req.user.userId }, data: { email, username } });
    res.json(sanitizeUser(user));
  } catch (e) {
    res.status(400).json({ error: 'Could not update profile (email may be taken).' });
  }
});

// --- Listings CRUD + search + filter
app.post('/listings', auth, async (req, res) => {
  const { title, description, category, price, image } = req.body;
  if (!title || !category || price == null) return res.status(400).json({ error: 'Missing fields' });
  const listing = await prisma.listing.create({
    data: { title, description: description || '', category, price: Number(price), image: image || undefined, userId: req.user.userId }
  });
  const payload = { ...listing, greenScore: greenScore(listing) };
  emitListing('listing:created', payload);
  res.json(payload);
});

app.get('/listings', async (req, res) => {
  const { search = '', category } = req.query;
  const where = {
    AND: [
      { title: { contains: String(search || ''), mode: 'insensitive' } },
      ...(category ? [{ category: String(category) }] : [])
    ]
  };
  const listings = await prisma.listing.findMany({ where, orderBy: { createdAt: 'desc' } });
  res.json(listings.map(l => ({ ...l, greenScore: greenScore(l) })));
});

app.get('/listings/:id', async (req, res) => {
  const id = Number(req.params.id);
  const listing = await prisma.listing.findUnique({ where: { id } });
  if (!listing) return res.status(404).json({ error: 'Not found' });
  res.json({ ...listing, greenScore: greenScore(listing) });
});

app.put('/listings/:id', auth, async (req, res) => {
  const id = Number(req.params.id);
  const existing = await prisma.listing.findUnique({ where: { id } });
  if (!existing) return res.status(404).json({ error: 'Not found' });
  if (existing.userId !== req.user.userId) return res.status(403).json({ error: 'Not your listing' });
  const { title, description, category, price, image } = req.body;
  const updated = await prisma.listing.update({ where: { id }, data: { title, description, category, price: price != null ? Number(price) : undefined, image } });
  const payload = { ...updated, greenScore: greenScore(updated) };
  emitListing('listing:updated', payload);
  res.json(payload);
});

app.delete('/listings/:id', auth, async (req, res) => {
  const id = Number(req.params.id);
  const existing = await prisma.listing.findUnique({ where: { id } });
  if (!existing) return res.status(404).json({ error: 'Not found' });
  if (existing.userId !== req.user.userId) return res.status(403).json({ error: 'Not your listing' });
  await prisma.listing.delete({ where: { id } });
  emitListing('listing:deleted', { id });
  res.json({ success: true });
});

// --- Cart
app.post('/cart/:listingId', auth, async (req, res) => {
  const listingId = Number(req.params.listingId);
  await prisma.cart.create({ data: { userId: req.user.userId, listingId } });
  res.json({ success: true });
});

app.get('/cart', auth, async (req, res) => {
  const items = await prisma.cart.findMany({ where: { userId: req.user.userId }, include: { listing: true } });
  const payload = items.map(i => ({ id: i.id, listingId: i.listingId, addedAt: i.createdAt, listing: { ...i.listing, greenScore: greenScore(i.listing) } }));
  res.json(payload);
});

app.delete('/cart/:listingId', auth, async (req, res) => {
  const listingId = Number(req.params.listingId);
  await prisma.cart.deleteMany({ where: { userId: req.user.userId, listingId } });
  res.json({ success: true });
});

// --- Checkout -> convert cart items to purchases
app.post('/checkout', auth, async (req, res) => {
  const cartItems = await prisma.cart.findMany({ where: { userId: req.user.userId } });
  const ops = cartItems.map(ci => prisma.purchase.create({ data: { userId: req.user.userId, listingId: ci.listingId } }));
  await prisma.$transaction(ops);
  await prisma.cart.deleteMany({ where: { userId: req.user.userId } });
  res.json({ success: true });
});

// --- Purchases
app.get('/purchases', auth, async (req, res) => {
  const purchases = await prisma.purchase.findMany({ where: { userId: req.user.userId }, include: { listing: true }, orderBy: { createdAt: 'desc' } });
  res.json(purchases.map(p => ({ ...p, listing: { ...p.listing, greenScore: greenScore(p.listing) } })));
});

// --- health
app.get('/', (req, res) => res.json({ ok: true }));

const port = process.env.PORT || 4000;
server.listen(port, () => console.log(`EcoFinds API on http://localhost:${port}`));
