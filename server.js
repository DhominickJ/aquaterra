const express = require('express');
// const bodyParser = require('body-parser');
const app = express();

const PORT = process.env.PORT || 6969;

app.set('view engine', 'ejs');
app.set('views', './client'); // Setting up the views environment and folder structure to look for the ejs files\
app.use(express.static("client")); // Making sure that all of the files are uploaded to the client's computer

app.use(express.urlencoded({extended: false}));
// app.use(express.json())

// // Set a 5-minute timeout (adjust as needed)
// app.use(function(req, res, next) {
//   req.setTimeout(5 * 60 * 1000, function() {
//     console.error('Request timed out!');
//     res.send(500, 'Request timed out'); // Or send a custom error response
//   });
//   next();
// });

// Define the variables 
// const temperature = 0, humidity = 0, light = , soil;
let temperature = 0;
let humidity = 0;
let light = 0;
let soil = 0;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
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

// Interfacing the app
app.post('/sensor/data', (req, res) => {

  // const postData = req.body;

  // console.log(req.headers)
  // console.log(req.on('data'))

  // let rawData = '';
  // // Listen for incoming data chunks
  // req.on('data', (chunk) => {
  //   rawData += chunk.toString();
  // });

  // // console.log(rawData)
  // // Process data after receiving the entire request body
  // req.on('end', () => {
  //   console.log('Received raw data:', rawData);
  //   // You might need to decode or parse the raw data further based on its format

  //   // Send a response (modify as needed)
  //   res.send('Data received successfully!');

  // });

  // console.log(req.body);

  temperature = req.body.temperature;
  humidity = req.body.humidity;
  light = req.body.light_sensor;
  soil = req.body.soil_sensor;

  // Process the data (temperature, humidity, lightSensor)
  // console.log(`Temperature: ${temperature}, Humidity: ${humidity}, Light Sensor: ${light}, Soil Sensor: ${soil}`);

  // Send a response (modify as needed)
  // res.send('Data received successfully!'); 
  // res.send("Message Received!").status(200);
  res.sendStatus(200);

  // // res.sendStatus(200);

})

app.post('/sensor/info', (req, res) => {
  const data = {
    temperature: temperature,
    humidity: humidity,
    light: light,
    soil: soil
  };
  res.json(data);
  // console.log(temperature, humidity, light, soil);
})

const userRouter = require("./routes/user")

app.use("/users", userRouter)
