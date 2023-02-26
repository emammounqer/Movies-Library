# Movie Library - 1.0.0

**Author Name**: Emam Al Mouqner

## WRRC

Web-Request-Response-Cycle

![wrrc img](./assets/wrrc.jpg)
![wrrc2 img](./assets/wrrc-2.png)

## Overview

Movie app ,server built to get movie data, built as learning project.

## Getting Started

to start run these command in you machine

- clone this repo

```sh
git clone <this repo url>
```

- install packages

```sh
npm install
```

- start the server

```sh
npm start
```

## Project Features

get `movies` data in json format

---
***Get Trending movie From This Url***

`http://localhost:3000/trending`

query :

- page : number

example : `http://localhost:3000/trending?page=2`

---
***Search movie From This Url***

`http://localhost:3000/search`

query :

- query: string
- page : number

example : `http://localhost:3000/search?query=The&page=2`

---
***Get upcoming movie From This Url***

`http://localhost:3000/get-Upcoming`

query :

- page : number

---
***Get upcoming movie From This Url***

`http://localhost:3000/popular-actor`

query :

- page : number
