//put crud requests in index for now then do separation of concerrns and move crud to its own fodler with files

//importing modules etc
const express = require('express')
const morgan = require('morgan')
const app = express()
const path = require('path')


//setting up middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
//allow the views to read css files from the public folder
app.use(express.static(path.join(__dirname, "public")));

//other middleware for misc stuff
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(express.json());

// app.locals.playerData = require('./data/playerData.json')



//router files
const apiRouter = require('./routes/apiRouter')
const viewsRouter = require('./routes/viewsRouter')


//setting all the routers
app.use('/api', apiRouter)
app.use('/views', viewsRouter)





const PORT = 3000;

app.listen(PORT, () => console.log(`server listening at ${PORT} beep boop`))




