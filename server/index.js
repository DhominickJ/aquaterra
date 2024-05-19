import express from 'express'
import { MongoClient } from 'mongodb'

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

const uri = "mongodb://localhost:2102/sensors"
const collectionName = "sensor_data";

const threshold = 0.1; // Threshold for significant change (10%)

app.post('/sensor/data', async (req, res) => {
  temperature = req.body.temperature;
  humidity = req.body.humidity;
  light = req.body.light_sensor;
  soil = req.body.soil_sensor;

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db();
    const collection = db.collection(collectionName);
    await collection.createIndex({ timestamp: 1 });

    // Check for significant change before adding
    const lastData = await collection.findOne({}, { sort: { timestamp: -1 } }); // Get latest data
    let hasSignificantChange = false;

    if (lastData) {
      const lastTemp = lastData.temperature;
      const lastHumid = lastData.humidity;
      const lastLight = lastData.light;
      const lastSoil = lastData.soil;

      hasSignificantChange = (
        Math.abs((temperature - lastTemp) / lastTemp) > threshold ||
        Math.abs((humidity - lastHumid) / lastHumid) > threshold ||
        Math.abs((light - lastLight) / lastLight) > threshold ||
        Math.abs((soil - lastSoil) / lastSoil) > threshold
      );
    } else {
      // No previous data, consider any value significant for first entry
      hasSignificantChange = true;
    }

    if (hasSignificantChange) {
      const timestamp = new Date().toISOString();
      const data = {
        timestamp: timestamp,
        temperature: temperature,
        humidity: humidity,
        light: light,
        soil: soil
      };
      await collection.insertOne(data);
      console.log("Sensor data saved to MongoDB");
    } else {
      console.log("Sensor data skipped due to minimal change");
    }

    res.sendStatus(200);

  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  } finally {
    await client.close();
  }
});

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