import Router from './managers/router'

Router.instance.init()

let counter;

async function checkThreshold() {

    counter++;
    const thresholds = {
        temperature: {
            normal: 20,
            critical: 40,
            warning: 35,
        },
        humidity: {
            normal: 50,
            critical: 80,
            warning: 60,
        },
        light: {
            normal: 300,
            critical: 100,
            upperWarning: 800,
            warning: 200,
        },
        soil: {
            normal: 1,
            critical: 0,
            warning: 2,
        },
    };
    
    const response = await fetch('http://localhost:6969/sensor/info', {
        method: 'POST'
    })
        
    if(!response.ok){
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json()

    const classes = {
        temperature: "",
        humidity: "",
        light: "",
        soil: "",
    };

    // console.log(data)

    let value;
    let threshold;

    // Creating the calculation for the state of the plant
    let plantState = document.getElementById("plantState");

    for (const key in data) {
        value = data[key];
        threshold = thresholds[key];

        // console.log(threshold)

        if (!threshold) {
            console.log(`No threshold defined for ${key}`);
            continue;
          }
        
        // console.log(threshold)

        if (value >= threshold.critical) {
            classes[key] = "critical";
        } else if ((value > threshold.warning || value > threshold.upperWarning) && value < threshold.critical) {
            classes[key] = "warning";
        } else {
            classes[key] = "normal";
        }   

        // Pausing and Playing the Video
        // videoElement.pause()

        if (data.temperature > thresholds.light.critical) {
            plantState.setAttribute('src', '/plant/heating.mp4')
        }else if((data.soil == thresholds.soil.critical) && counter > 300){
            plantState.setAttribute('src', '/plant/hungry.mp4')
        } else {
            plantState.setAttribute('src','/plant/idle.mp4')
        }
    }

    const labelKeys = ['critical', 'warning', 'normal']
    // console.log(classes)

    document.getElementById("status-temperature").classList.remove(labelKeys);
    document.getElementById("status-temperature").classList.add(classes.temperature);
    
    document.getElementById("status-humidity").classList.remove(labelKeys);
    document.getElementById("status-humidity").classList.add(classes.humidity);
    
    document.getElementById("status-sunlight").classList.remove(labelKeys);
    document.getElementById("status-sunlight").classList.add(classes.light);
    
    document.getElementById("status-droplet").classList.remove(labelKeys);
    document.getElementById("status-droplet").classList.add(classes.soil);

    const soilState = data.soil === 1 ? "Wet" : "Dry";

    try{
        const sensorPage = document.getElementsByClassName("status-elements");
        if(sensorPage) {
            // Updating the values of the sensors
            updateSensorDisplay(data.temperature, data.humidity, data.light, soilState);
        }
    } catch(error){
        console.log("Not Found on the Current Page!")
    }
} 

// For video parsing 
let videoElement = document.getElementById("plantVideo");
// videoElement.load()
videoElement.addEventListener('canplaythrough', function() {
    videoElement.play();  // Optional: Play the video after it's loaded
  });

function updateSensorDisplay(temperature, humidity, light, soilState) {
    const tempEl = document.querySelector('#status-temperature > .data');
    const humidityElement = document.querySelector('#status-humidity > .data');
    const lightEl = document.querySelector('#status-sunlight > .data');
    const waterEl = document.querySelector('#status-droplet > .data');
    
    tempEl.innerText = parseInt(temperature) + `°`;
    humidityElement.innerText = parseInt(humidity) + '%'; 
    lightEl.innerText = parseInt(light); 
    waterEl.innerText = soilState;
    }

try{
    const homePage = document.getElementsByClassName("status-container")
    if(homePage) {
        setInterval(checkThreshold, 2000)
    } 
} catch(error) {
    console.log(`Element not Found probably don't need to! Error: ${error}`)
}
