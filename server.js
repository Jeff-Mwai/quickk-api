// server.js
const express = require('express');
const admin = require('firebase-admin');

const app = express();

// Initialize Firebase Admin SDK
const serviceAccount = require('./path/to/serviceAccountKey.json'); // Replace with your service account key
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Fetch all users
app.get('/api/users', async (req, res) => {
  try {
    const userList = await admin.auth().listUsers();
    const users = userList.users.map(user => ({
      uid: user.uid,
      email: user.email,
      // Add other user properties as needed
    }));
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
