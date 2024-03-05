const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.set('views', './client/'); // Setting up the views environment and folder structure to look for the ejs files\
app.use(express.static("client")); // Making sure that all of the files are uploaded to the client's computer


app.listen(6969, () => {
  console.log('Server is running on port 3000');
})

// .get is a method to get the information from the server where the request is made by the browser / client to reach the server

// app.get('/', (req, res) => {
//     // Req = request from server the information
//     // Res = response from server to client or browser
//     res.send('<h1> Hello World </h1>');
//     res.status(500).send('Hello World');
// })

app.get('/', (req, res) => {
    res.render('index');
})

app.get('/about', (req, res) => {
    res.send('<h1> About Page </h1>');
}) // The logic is it is simply like an if else statement, if the browser tries to request a particular page, the server checks if the routes exist and if it does, it will return the functions specified in the route.

app.get('/contact', (req, res) =>{
  res.sendStatus(200);
})

const userRouter = require("./routes/user")

app.use("/users", userRouter)
