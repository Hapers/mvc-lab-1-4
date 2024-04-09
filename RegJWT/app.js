const express = require('express');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt'); // Импорт bcrypt
const app = express();
const port = 3000;

const uri = 'mongodb+srv://Admin:1234567890@cluster0.uafcuqi.mongodb.net/node-auth?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
 try {
    await client.connect();
    console.log('Connected to MongoDB');
    // Здесь вы можете выполнять операции с базой данных
 } catch (error) {
    console.error('Error connecting to MongoDB', error);
 } finally {
    await client.close();
 }
}

run().catch(console.dir);

app.use(express.json()); // Для парсинга JSON запросов

// Функция для создания пользователя с хешированием пароля
async function createUser(username, password, email) {
 const usersCollection = client.db('yourDatabaseName').collection('users');

 // Хеширование пароля
 const saltRounds = 10; // Количество раундов для генерации соли
 const hashedPassword = await bcrypt.hash(password, saltRounds);

 const newUser = {
    username,
    password: hashedPassword, // Сохранение хешированного пароля
    email,
 };

 try {
    const result = await usersCollection.insertOne(newUser);
    console.log('User created', result.ops[0]);
 } catch (error) {
    console.error('Error creating user', error);
 }
}

// Обработчик регистрации
app.post('/register', async (req, res) => {
 const { username, password, email } = req.body;

 try {
    await createUser(username, password, email);
    res.status(200).json({ message: 'User registered successfully' });
 } catch (error) {
    res.status(500).send(error);
 }
});

app.listen(port, () => {
 console.log(`Server is running on http://localhost:${port}`);
});
const SECRET_KEY = 'your_secret_key'; // Замените на ваш секретный ключ

app.post('/register', async (req, res) => {
 const { username, password, email } = req.body;
 console.log('register', username, password, email);
 if (await usernameExists(username)) {
    console.log("Username already exists");
    res.send("1");
 } else if (await emailExists(email)) {
    console.log("Email already exists");
    res.send("2");
 } else {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the 'users' collection
    await db.collection('users').insertOne({ username, password: hashedPassword, email });
    console.log('User registered successfully');

    // Generate JWT
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });

    // Send JWT to the client
    res.send({ token });
 }
});