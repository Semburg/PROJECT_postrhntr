const express = require('express');
const fetch = require('node-fetch');
const mongoose = require('mongoose');
const filmItem = require('./models/filmItem')
var cors = require('cors');
require('dotenv').config()



//initialize Server
const app = express()

// init cors middleware
app.use(cors())
// initialize Port (externe server||local)
const PORT = process.env.PORT || 5005

// Connection to DB

const DbUri = "mongodb+srv://super2:super@sb2.hlqlz.mongodb.net/favorites_films?retryWrites=true&w=majority"

mongoose.connect(DbUri, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }, () => {
    console.log('Database connected')

    //! listening to server at Port (externe server Port||local port)
    //! inside of the mongoconnection
    app.listen(PORT, () => {
        console.log(`http://localhost:${PORT}`)
    })

})



// Define static folder 
app.use(express.static('public'))

// Define view engine
app.set('view engine', 'ejs')


// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))

// parse application/json
app.use(express.json())

let lookedID;

//first route

app.get('/', (req, res) => {
    res.redirect('/movies/1')
})
// app.get('/movies/1', (req, res) => {
//     res.render('pages/index')
// })
app.get('/movies/:id', (req, res) => {
    console.log(req.params.id)
    lookedID = req.params.id
    fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${process.env.API_KEY}&language=en-US&page=${req.params.id}`)
        .then(result => result.json())
        .then(data => {
            res.render('pages/index', { page: Number(req.params.id), data: data.results })
        })
})

app.get('/movieDetails/:id', (req, res) => {
    console.log(req.params.id)
    fetch(`https://api.themoviedb.org/3/movie/${req.params.id}?api_key=${process.env.API_KEY}&language=en-US`)
        .then(result => result.json())
        .then(data => {
            res.render('pages/movieDetails', { data })
        })
})
app.post('/search', (req, res) => {
    console.log(req.body.searchInput)

    res.redirect(`/search/${req.body.searchInput}/1`)
})

app.get('/search/:word/:page', (req, res) => {
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.API_KEY}&language=en-US&query=${req.params.word}&page=${req.params.page}&include_adult=false`)
        .then(result => result.json())
        .then(data => {
            console.log(data);
            res.render('pages/index', { data: data.results, page: req.params.page })
        })
})

app.get('/favorites', (req, res) => {
    // res.render("pages/favorites")
    filmItem.find()
        .then(data =>{
            res.render('pages/favorites', {data})
        })
})

app.get('/movieDetailsFavs/:id', (req, res) => {
    console.log(req.params.id)
    fetch(`https://api.themoviedb.org/3/movie/${req.params.id}?api_key=${process.env.API_KEY}&language=en-US`)
        .then(result => result.json())
        .then(data => {
            res.render('pages/movieDetailsFav', { data })
        })
})

app.post('/add/:id', (req, res) => {

    console.log("Catch you! - " + req.params.id);

    fetch(`https://api.themoviedb.org/3/movie/${req.params.id}?api_key=${process.env.API_KEY}&language=en-US`)
        .then(result => result.json())
        .then(data => {
            // res.json(data)
            // res.render('pages/movieDetails', { data })

            const newFilm = new filmItem({

                id: data.id,

                url: data.poster_path,
                title: data.title,
                overview: data.overview,
                genres: data.genres,
                release_date: data.release_date,
            })
            newFilm.save()
                .then(result => res.redirect("/favorites"))
                .catch(err => console.log(err));
        })
    // res.render('pages/favorites')
})

app.get('/delete/:id', (req, res) => {

    res.send(req.params.id)

    // console.log(req.params.id);
    // res.redirect("/favorites")

    // filmItem.findByIdAndDelete(req.params)
    // .then(data => {
    //     res.redirect("/")
    //     //  res.send(result)
    // }).catch(err => console.log(err))
})
