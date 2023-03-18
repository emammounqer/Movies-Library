require('dotenv').config()
const express = require('express')
const cors = require('cors')
const axios = require('axios')
const pg = require('pg')

// Data base
const dbClient = new pg.Client(process.env.DB_URL)

// create the server
const app = express()

// middleware
app.use(cors())
app.use(express.json())

//routes
app.get('/', getHome)
app.get('/favorite', getFavorite)

app.get('/trending', getTrending)
app.get('/search', getSearchMovie)
app.get('/get-upcoming', getUpcoming)
app.get('/popular-actor', getPopularActor)

app.get('/movies', getMoviesHandler)
app.post('/movies', addMovieHandler)
app.get('/movies/:id', getMovieHandler)
app.put('/movies/:id', updateMovieHandler)
app.delete('/movies/:id', deleteMovieHandler)

// error handler
app.use(errorHandler404)
app.use(errorHandler)

// start the server
startServer()

// ----------------------------------------------------------------------------
async function startServer() {
    try {
        const port = process.env.PORT || 3000
        await dbClient.connect()
        app.listen(port, () => console.log('Server start ,listen at port: ' + port))
    } catch (error) {
        console.error(error)
    }
}

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

// movies route handler
async function getMoviesHandler(req, res, next) {
    try {
        const movies = await getMovies()
        res.json(movies)
    } catch (error) {
        next(error)
    }
}

async function addMovieHandler(req, res, next) {
    const body = req.body;
    const movie = new Movie(body)
    try {
        const resp = await addMovie(movie, body.comment)
        res.status(201).json(resp)
    } catch (error) {
        next(error)
    }
}

async function updateMovieHandler(req, res, next) {
    const id = req.params.id
    const body = req.body;
    const updatedMovie = new Movie(body)
    try {
        const resp = await updateMovie(id, updatedMovie)
        res.json(resp)
    } catch (error) {
        next(error)
    }
}

async function deleteMovieHandler(req, res, next) {
    const id = req.params.id
    try {
        await deleteMovie(id)
        res.status(204).json({})
    } catch (error) {
        next(error)
    }
}

async function getMovieHandler(req, res, next) {
    const id = req.params.id
    try {
        const movies = await getMovie(id)
        if(movies.length === 0 ) return res.status(204).send();
        res.json(movies)
    } catch (error) {
        next(error)
    }
}

// movies services function
async function getMovies() {
    const sql = `SELECT * FROM movies`
    const resp = await dbClient.query(sql)
    return resp.rows
}

async function addMovie(movie) {
    const sql = `INSERT INTO movies 
                (title, release_date, poster_path, overview, comment)
                VALUES ($1, $2, $3, $4, $5) 
                RETURNING *;`
    const resp = await dbClient.query(sql, [movie.title, movie.release_date, movie.poster_path, movie.overview, movie.comment])
    return resp.rows


}

async function updateMovie(id, updatedMovie) {
    const setValues = []
    const movie = await getMovie(id)
    const newMovie ={...movie,...updatedMovie} 

    const sql = `UPDATE movies 
                SET title = $1, release_date = $2 , poster_path = $3 , overview = $4 ,comment = $5
                WHERE id=${id}
                RETURNING *`
    
    const resp = await dbClient.query(sql,[newMovie.title,newMovie.release_date,newMovie.poster_path,newMovie.overview,newMovie.comment])
    return resp.rows
}

async function deleteMovie(id) {
    const sql = `DELETE FROM movies WHERE id = ${id}`
    const resp = await dbClient.query(sql)
    return resp.rows
}

async function getMovie(id) {
    const sql = `SELECT * FROM movies WHERE id = ${id}`
    const resp = await dbClient.query(sql)
    return resp.rows
}

// error handler functions
function errorHandler404(req, res, next) {
    res.status(404)
    res.json({
        "status": 404,
        "responseText": "Page not found"
    })
}

function errorHandler(err, req, res, next) {
    if (err.code && (err.code.slice(0, 2) === '23' || err.code.slice(0, 2) === '22')) {
        console.error(err.message)
        res.status(400)
        return res.json({
            "status": 400,
            "responseText": "Bad Request",
            "message": err.message
        })
    }
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

function Movie({ id, title, release_date, poster_path, overview ,comment}) {
    this.id = id
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview;
    this.comment = comment
}

