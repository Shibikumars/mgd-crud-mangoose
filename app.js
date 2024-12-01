const express = require('express');
const mongoose = require('./db');
const Book = require('./models/bookModel');
const bodyParser = require('body-parser');
const path = require('path');
const hbs = require('hbs'); // Import Handlebars
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Register partials
hbs.registerPartials(path.join(__dirname, 'views', 'partials'));

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Home route - List all books
app.get('/', async (req, res) => {
  const books = await Book.find();
  res.render('main', { books });
});

// Add new book form
app.get('/add', (req, res) => {
  res.render('add-book');
});

// Add new book to the database
app.post('/add', async (req, res) => {
  const { title, author, genre, publishedDate } = req.body;
  const newBook = new Book({ title, author, genre, publishedDate });
  await newBook.save();
  res.redirect('/');
});

// Edit book form
app.get('/edit/:id', async (req, res) => {
  const book = await Book.findById(req.params.id);
  res.render('edit-book', { book });
});

// Update book
app.post('/edit/:id', async (req, res) => {
  const { title, author, genre, publishedDate } = req.body;
  await Book.findByIdAndUpdate(req.params.id, { title, author, genre, publishedDate });
  res.redirect('/');
});

// Delete book
app.get('/delete/:id', async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get('/view-books', async (req, res) => {
    try {
      const books = await Book.find();
      res.render('view-books', { books });
    } catch (error) {
      res.status(500).send('Error retrieving books');
    }
  });
  