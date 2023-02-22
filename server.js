const express = require('express')
const cors = require('cors')

// create the server
const app = express()

// middleware
app.use(cors())

//routes
app.get('/', (req, res) => {
    const movieData = require('./movie_data/data.json')
    const resData = new MovieData(movieData)
    res.json(resData)
})

app.get('/favorite', (req, res) => {
    res.send('Welcome to Favorite Page')
})

// error handler
app.use((req, res, next) => {
    res.status(404)
    res.json({
        "status": 404,
        "responseText": "Page not found"
    })
})

app.use((err, req, res, next) => {
    console.error(err)
    res.status(500)
    res.json({
        "status": 500,
        "responseText": "Sorry, something went wrong"
    })
})

// start the server
const port = 3000
app.listen(port, () => console.log('server start at port: ' + port))


// util function
function MovieData({ title, poster_path, overview }) {
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
}

