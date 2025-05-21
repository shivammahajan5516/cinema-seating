// // app.js
// const express = require('express');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const { MongoClient } = require('mongodb');

// const app = express();
// const MONGO_URI = 'mongodb://localhost:27017';
// const DB_NAME = 'cinemaApp';

// app.use(cors());
// app.use(bodyParser.json());

// let usersCollection;

// // Mongo connection (exposed for tests)
// async function connectDB() {
//   const client = await MongoClient.connect(MONGO_URI, { useUnifiedTopology: true });
//   const db = client.db(DB_NAME);
//   usersCollection = db.collection('users');
//   return client;
// }

// // API Routes
// app.post('/signin', async (req, res) => {
//   const { username, password } = req.body;
//   const user = await usersCollection.findOne({ username, password });
//   if (user) {
//     res.json({ success: true, user: { username: user.username, userType: user.userType } });
//   } else {
//     res.status(401).json({ success: false, message: 'Invalid credentials' });
//   }
// });

// app.post('/signup', async (req, res) => {
//   const { username, password, userType } = req.body;
//   const existingUser = await usersCollection.findOne({ username });
//   if (existingUser) {
//     return res.status(409).json({ success: false, message: 'User already exists' });
//   }
//   await usersCollection.insertOne({ username, password, userType });
//   res.json({ success: true });
// });

// app.get('/users', async (req, res) => {
//   const { userType } = req.query;
//   if (userType !== 'admin') {
//     return res.status(403).json({ success: false, message: 'Forbidden: Admins only' });
//   }
//   try {
//     const users = await usersCollection.find().toArray();
//     res.json(users);
//   } catch (error) {
//     console.error('Error fetching users:', error);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// module.exports = { app, connectDB };
