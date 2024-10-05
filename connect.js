const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors()); 
app.use(express.json()); // For parsing JSON data
app.use(express.urlencoded({ extended: true })); 

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/crud-example', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));
  // Define a schema and model
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    age: Number,
}, { versionKey: false });

const User = mongoose.model('User', userSchema);

// Start the server
app.listen(3000, () => console.log('Server running on port 3000'));

app.get('/insert', (req, res) => {
    res.sendFile(path.join(__dirname, 'insert.html'));
});
app.get('/delete', (req, res) => {
    res.sendFile(path.join(__dirname, 'delete.html'));
});

app.get('/update', (req, res) => {
    res.sendFile(path.join(__dirname, 'update.html'));
});

app.post('/users', async (req, res) => {
    try {
        const user = new User(req.body); // Create a new user with the request data
        await user.save(); // Save the user to the database
        res.status(201).send(user); // Send the created user as a response
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});
app.get('/users', async (req, res) => {
    try {
        const users = await User.find(); // Find all users
        res.send(users); // Send the users as a response
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

app.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id); // Find user by ID
        if (!user) return res.status(404).send({ error: 'User not found' });
        res.send(user); // Send the user as a response
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});
app.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id); // Delete user
        if (!user) return res.status(404).send({ error: 'User not found' });
        res.send({ message: 'User deleted' }); // Send a success message
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

app.put('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }); // Update user
        if (!user) return res.status(404).send({ error: 'User not found' });
        res.send(user); // Send the updated user as a response
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});
