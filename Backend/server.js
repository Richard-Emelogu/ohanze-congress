const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, 'database.json');

if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, JSON.stringify({ users: [], orders: [] }, null, 2));
  console.log('Created database.json');
}

global.db = {
  read: () => {
    try {
      const data = fs.readFileSync(dbPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading database:', error);
      return { users: [], orders: [] };
    }
  },
  write: (data) => {
    try {
      fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Error writing database:', error);
    }
  }
};

console.log('Using File-Based Storage');

try {
  const authRoutes = require('./routes/auth');
  const ordersRoutes = require('./routes/orders');

  app.use('/api/auth', authRoutes);
  app.use('/api/orders', ordersRoutes);
  
  console.log('Routes loaded successfully');
} catch (error) {
  console.error('Error loading routes:', error.message);
}

app.get('/', (req, res) => {
  res.json({ message: 'Ohanze Congress API is running' });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
  console.log('Visit: http://localhost:' + PORT);
});