import express, { json } from 'express';
import bcrypt from 'bcrypt';
import session from 'express-session';
import bodyParser from 'body-parser';
import fs from 'fs';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import { log } from 'console';
dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
 secret: 'secret',
 resave: true,
 saveUninitialized: true
}));

const connection_string = process.env.CONNECTION_STRING;

const uri =connection_string // Replace with your MongoDB Atlas connection string
const client = new MongoClient(uri);
let db

async function connectToDatabase() {
  try {
     await client.connect();
     console.log('Connected to MongoDB');
     db = client.db('ai_extension'); // Specify your database name
    // const db_list = await client.db().admin().listDatabases();
    // db_list.databases.forEach(db => console.log(` - ${db.name}`));

  } catch (err) {
     console.error("Error connecting to MongoDB:", err);
  }
 }


connectToDatabase();
const crypto = require('crypto');
const SECRET_KEY = crypto.randomBytes(64).toString('hex');

app.post('/register', async (req, res) => {
  const { username, password, email } = req.body;
  console.log('register', username, password, email);
  if (await usernameExists(username)) {
    console.log("Username already exists");
    res.send("1");
  }else if (await emailExists(email)) {
    console.log("Email already exists");
    res.send("2");
    
  }else{// Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert the new user into the 'users' collection
  await db.collection('users').insertOne({ username, password: hashedPassword, email });
  console.log('User registered successfully');
  res.send("0");
  // Generate JWT
  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });

  // Send JWT to the client
  res.send({ token });
  }

});
 
async function usernameExists(username) {
  try {
     const user = await db.collection('users').findOne({ username });
     return user !== null;
  } catch (error) {
     console.error("Error checking username:", error);
     throw error; // Rethrow the error to be handled by the caller
  }
 }
 
 async function emailExists(email) {
  try {
     const user = await db.collection('users').findOne({ email });
     return user !== null;
  } catch (error) {
     console.error("Error checking email:", error);
     throw error; // Rethrow the error to be handled by the caller
  }
 }

// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
 
  try {
     // Find the user by username
     const user = await db.collection('users').findOne({ username });
     if (!user) {
       return res.send('User not found');
     }
 
     // Compare the hashed password
     bcrypt.compare(password, user.password, (err, isMatch) => {
       if (err) throw err;
       if (isMatch) {
         // Generate JWT
        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });

        // Send JWT to the client
        res.send({ token });
         res.send('Login successful');
       } else {
         res.send('Incorrect password');
       }
     });
  } catch (error) {
     console.error("Error during login:", error);
     res.status(500).send("Server error");
  }
 });




app.listen(3000, () => {
 console.log('Server started on port 3000');
});

app.use(express.static('public'));

app.get('/register', (req, res) => {
  res.send(fs.readFileSync('./views/register.html', 'utf8'));
});

app.get('/login', (req, res) => {
  res.send(fs.readFileSync('./views/login.html', 'utf8'));
});