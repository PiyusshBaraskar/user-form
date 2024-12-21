const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/user_management')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// MongoDB Connection Events
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connection is open'));

// User Schema
const userSchema = new mongoose.Schema({
    userCode: { type: String, unique: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    department: { type: String, required: true },
    gender: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

// Admin Schema
const adminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// Models
const User = mongoose.model('User', userSchema);
const Admin = mongoose.model('Admin', adminSchema);

module.exports = { User, Admin };

// JWT Middleware
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    
    if (!token) return res.status(401).json({ error: 'Access denied' });

    jwt.verify(token, 'your_jwt_secret', (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
};

// Routes
app.post('/api/users', async (req, res) => {
    try {
        const { userCode, username, password, department, gender } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = new User({
            userCode,
            username,
            password: hashedPassword,
            department,
            gender
        });
        
        await user.save();
        res.json({ message: 'User created successfully', id: user._id });
    } catch (error) {
        res.status(500).json({ error: 'Error saving user' });
    }
});

app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find({}, { password: 0 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching users' });
    }
});

app.put('/api/users/:id', async (req, res) => {
    try {
        const { username, department, gender, password } = req.body;
        const updates = { username, department, gender };
        
        if (password) {
            updates.password = await bcrypt.hash(password, 10);
        }
        
        await User.findByIdAndUpdate(req.params.id, updates);
        res.json({ message: 'User updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error updating user' });
    }
});

app.delete('/api/users/:id', authenticateToken, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting user' });
    }
});

// Admin routes
app.post('/api/admin/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const admin = await Admin.findOne({ username });
        
        if (!admin || !(await bcrypt.compare(password, admin.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const token = jwt.sign({ id: admin._id }, 'your_jwt_secret', { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

// Initialize admin account if none exists
async function initializeAdmin() {
    try {
        const adminCount = await Admin.countDocuments();
        if (adminCount === 0) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            const admin = new Admin({
                username: 'admin',
                password: hashedPassword
            });
            await admin.save();
            console.log('Admin account created');
        }
    } catch (error) {
        console.error('Error creating admin account:', error);
    }
}

initializeAdmin();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});