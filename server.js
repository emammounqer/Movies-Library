require('dotenv').config()
const express = require('express')
const cors = require('cors')
const axios = require('axios')

// create the server
const app = express()

// middleware
app.use(cors())

//routes
app.get('/', getHome)
app.get('/favorite', getFavorite)
app.get('/trending', getTrending)
app.get('/search', getSearchMovie)
app.get('/get-upcoming', getUpcoming)
app.get('/popular-actor', getPopularActor)

// error handler
app.use(errorHandler404)
app.use(errorHandler500)

// start the server
const port = 3000
app.listen(port, () => console.log('Server start ,listen at port: ' + port))

// ----------------------------------------------------------------------------
// route handler functions
function getHome(req, res) {
    const movieData = require('./movie_data/data.json')
    const resData = new MovieData(movieData)
    res.json(resData)

}

function getFavorite(req, res) {
    res.send('Welcome to Favorite Page')
}

function getTrending(req, res, next) {
    const key = process.env.API_KEY
    const url = `https://api.themoviedb.org/3/trending/all/week?api_key=${key}&language=en-US`
    const params = {
        page: req.query.page
    }

    axios.get(url, { params }).then(resp => {
        resp.data.results = resp.data.results.map(movie => new Movie(movie))
        res.json(resp.data)
    }).catch(err => {
        next(err)
    })
}

function getSearchMovie(req, res, next) {
    const key = process.env.API_KEY
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${key}&language=en-US`
    const params = {
        query: req.query.query,
        page: req.query.page
    }

    axios.get(url, { params }).then(resp => {
        resp.data.results = resp.data.results.map(movie => new Movie(movie))
        res.json(resp.data)
    }).catch(err => {
        next(err)
    })
}

function getUpcoming(req, res, next) {
    const key = process.env.API_KEY
    const url = `https://api.themoviedb.org/3/movie/upcoming?api_key=${key}&language=en-US`
    const params = {
        page: req.query.page
    }

    axios.get(url, { params }).then(resp => {
        resp.data.results = resp.data.results.map(movie => new Movie(movie))
        res.json(resp.data)
    }).catch(err => {
        next(err)
    })
}

function getPopularActor(req, res, next) {
    const key = process.env.API_KEY
    const url = `https://api.themoviedb.org/3/person/popular?api_key=${key}&language=en-US`
    const params = {
        page: req.query.page
    }

    axios.get(url, { params }).then(resp => {
        res.json(resp.data)
    }).catch(err => {
        next(err)
    })
}

// error handler functions
function errorHandler404(req, res, next) {
    res.status(404)
    res.json({
        "status": 404,
        "responseText": "Page not found"
    })
}

function errorHandler500(err, req, res, next) {
    console.error(err)
    res.status(500)
    res.json({
        "status": 500,
        "responseText": "Sorry, something went wrong"
    })
}

// ctr function
function MovieData({ title, poster_path, overview }) {
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
}

function Movie({ id, title, release_date, poster_path, overview }) {
    this.id = id
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview;
}

