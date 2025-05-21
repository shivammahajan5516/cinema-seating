const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 5000;
const MONGO_URI = 'mongodb://localhost:27017';
const DB_NAME = 'cinemaApp';
const SECRET_KEY = 'your-secret-key'; // Use env in production

app.use(cors());
app.use(bodyParser.json());

let usersCollection;

// MongoDB Connection
MongoClient.connect(MONGO_URI, { useUnifiedTopology: true })
  .then(client => {
    const db = client.db(DB_NAME);
    usersCollection = db.collection('users');
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch(error => console.error('MongoDB connection error:', error));

// JWT Middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ success: false, message: 'No token provided' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'Token missing' });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// SIGNUP
app.post('/signup', async (req, res) => {
  const { username, password, userType } = req.body;
  const existingUser = await usersCollection.findOne({ username });

  if (existingUser) {
    return res.status(409).json({ success: false, message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await usersCollection.insertOne({ username, password: hashedPassword, userType });

  res.json({ success: true, userId: result.insertedId });
});

// SIGNIN
app.post('/signin', async (req, res) => {
  const { username, password } = req.body;
  const user = await usersCollection.findOne({ username });

  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign(
      { username: user.username, userType: user.userType },
      SECRET_KEY,
      { expiresIn: '1h' }
    );
    res.json({ success: true, token, userId: user._id });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// GET ALL USERS (Admin only)
app.get('/users', verifyToken, async (req, res) => {
  if (req.user.userType !== 'admin') {
    return res.status(403).json({ success: false, message: 'Forbidden: Admins only' });
  }

  try {
    const users = await usersCollection.find({}, { projection: { password: 0 } }).toArray();
    res.json(users);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET USER BY ID (Admin only)
app.get('/users/:id', verifyToken, async (req, res) => {
  if (req.user.userType !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admins only' });
  }

  try {
    const user = await usersCollection.findOne({ _id: new ObjectId(req.params.id) }, { projection: { password: 0 } });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving user' });
  }
});

// UPDATE USER BY ID (Admin only)
app.put('/users/:id', verifyToken, async (req, res) => {
  if (req.user.userType !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admins only' });
  }

  const { username, password, userType } = req.body;
  const updates = {};

  if (username) updates.username = username;
  if (userType) updates.userType = userType;
  if (password) updates.password = await bcrypt.hash(password, 10);

  try {
    const result = await usersCollection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updates }
    );
    if (result.modifiedCount === 0) {
      return res.status(404).json({ success: false, message: 'User not found or no changes made' });
    }
    res.json({ success: true, message: 'User updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Update failed' });
  }
});

// DELETE USER BY ID (Admin only)
app.delete('/users/:id', verifyToken, async (req, res) => {
  if (req.user.userType !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admins only' });
  }

  try {
    const result = await usersCollection.deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Delete failed' });
  }
});

module.exports = app;

