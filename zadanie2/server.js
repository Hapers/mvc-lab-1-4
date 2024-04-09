const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;
const studentsController = require('./controllers/students');
const errorController = require('./controllers/error');

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.get('/', studentsController.getAddNewStudentPage);


app.get('/success', (req, res) => {
  res.render('Success');
});

app.get('/students-list', (req, res) => {
  res.render('List');
});
app.post('/add-student', (req, res) => {
  res.redirect('/students-list');
});

app.use(errorController.getNotFoundPage);

app.use((req, res) => {
  res.status(404).render('NotFound');
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});