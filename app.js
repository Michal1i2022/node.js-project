const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Pliki statyczne (CSS)

// Ustawienia EJS
app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
    const posts = await Post.find(); // Pobieramy wszystkie posty z bazy danych
    res.render('index', { posts }); // Renderujemy widok EJS i przekazujemy dane (posty)
  });

// Połączenie z MongoDB
mongoose.connect('mongodb://localhost:27017/blogDB');


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Błąd połączenia z MongoDB:'));
db.once('open', () => {
  console.log('Połączono z MongoDB!');
});

// Serwer
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Serwer działa na http://localhost:${PORT}`);
});


const Post = require('./models/Post');

app.post('/add-post', async (req, res) => {
  try {
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      grade: req.body.grade
    });
    await post.save();
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Wystąpił błąd podczas dodawania posta.');
  }
});
