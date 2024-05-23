import express from 'express'
import exec from 'child_process'
import { InfluxDB, Point } from '@influxdata/influxdb-client';
import { get } from 'http';

const app = express();
const PORT = process.env.PORT || 6969;

app.set('view engine', 'ejs');
app.set('views', './client'); // Setting up the views environment and folder structure to look for the ejs files\
app.use(express.static("client")); // Making sure that all of the files are uploaded to the client's computer

app.use(express.urlencoded({ extended: false }));

let temperature = 0;
let humidity = 0;
let light = 0;
let soil = 0;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})

// // Interfacing the app
// app.post('/sensor/data', (req, res) => {
//   // console.log(req.body);
//   temperature = req.body.temperature;
//   humidity = req.body.humidity;
//   light = req.body.light_sensor;
//   soil = req.body.soil_sensor;

//   res.sendStatus(200)
// })

const token = await exec.exec(
  'sops -d --extract \'["TOKENS"][1]\' secrets.yaml',
  {cwd: '../.'},
)

const AquaTerraDB = Object.freeze({
  port: 8086,
  tokens: await token.stdout.toArray(),
  org: "BSCS 2A",
  bucket: "AquaTerra"
});

const db = new InfluxDB({
  url: `http://127.0.0.1:${AquaTerraDB.port}`,
  token: AquaTerraDB.tokens[0]
})
const writeApi = db.getWriteApi(AquaTerraDB.org, AquaTerraDB.bucket)
const readApi = db.getQueryApi(AquaTerraDB.org)

const threshold = 0.1; // Threshold for significant change (10%)

app.post('/sensor/data', async (req, res) => {
  temperature = req.body.temperature;
  humidity = req.body.humidity;
  light = req.body.light_sensor;
  soil = req.body.soil_sensor;

  res.sendStatus(200)

  const dbInputs = [ 
    new Point('temperature').floatField('value', temperature),
    new Point('humidity').floatField('value', humidity),
    new Point('light').floatField('value', light),
    new Point('soil').floatField('value', soil),
  ]

  dbInputs.forEach(item => console.log(`${item}`))

  // writeApi.writePoints(dbInputs)
})

app.post('/sensor/info', (req, res) => {
  const data = {
    temperature: temperature,
    humidity: humidity,
    light: light,
    soil: soil
  };

  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'POST');
    return res.sendStatus(200);
  }

  res.setHeader('Access-Control-Allow-Origin', '*'); // Set CORS headers to avoid errors
  res.json(data);
  res.end();
})

app.get('/', (req, res) => {
  console.log(temperature, humidity, light, soil)
})