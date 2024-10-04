const express = require('express');
const mongoose = require('mongoose');

const app = express()

app.use(express.json());
app.use(express.urlencoded({extended:true}));

//connecting to mongoose
mongoose.connect('mongodb://localhost:27017/crud-example').then (()=> console.log("Connected"));

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    age: Number
});

const user = mongoose.model('User', userSchema);

app.get('/users', async (req, res)=> {
    try {
        var users = await user.find()
        if(users) res.send(users)
            else res.status(500).send("Internal Server error...")
    } catch (error) {
        console.error(error)
    }
})

app.get('/insert', (req, res) => {
    res.sendFile(path.join(__dirname, 'insert.html'))
})

app.listen(port=8080, ()=> console.log('[*] Express server listening on http://localhost'))