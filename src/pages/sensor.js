import anime from "animejs"
import axios from "axios"
import http from 'http'

export default function sensors() {

    const elements = document.querySelectorAll('.status-elements')
    const icons = [...document.querySelectorAll('.status-elements span')]
        .reverse()

    // console.clear()
    console.warn(('b' + 'a' + +'a' + 'a').toLowerCase())
    console.log(
        `%cEaster Egg\n` +
        `%cCongrats you found the %ceaster egg!\n` + 
        `%cTo claim your prize: %ccontact this number: ` +
        `%c+639${Math.floor(parseInt(Infinity, 30)/100)}`,
        'font-size: 1.5rem;font-weight:600',
        '',
        'color: crimson;',
        '',
        'color: cornflowerblue;',
        'color: goldenrod;'
    )

    icons.forEach(el => {
        const { x, y } = el.getBoundingClientRect()
        el.style.position = 'fixed'
        el.style.left = x + 'px'
        el.style.top = y + 'px'
    })

    /** @type {Set<{anim: anime.AnimeInstance, el: HTMLElement}>} */
    const arr = new Set();
    
    document.addEventListener('click', e => {
        e.stopPropagation()

        
        /** @type {HTMLElement} */
        const el = e.target.closest('.status-elements span')
        if (!el || document.querySelector('.animating')) return
        
        if ([...arr.values()].find(val => val.el === el)) {
            const e = [...arr.values()].find(val => val.el === el)
            e.anim.reverse()
            e.anim.play()
            arr.delete(e)
            el.classList.remove('shown')
            return
        }

        el.classList.add('shown')
        arr.forEach((item) => {
            const { anim, el } = item
            
            anim.reverse()
            anim.play()
            arr.delete(item)
            el.classList.remove('shown')
        })

        const anim = anime({
            targets: el,
            keyframes: [
                { scale: ['100%', '150%'], easing: 'easeInQuad', duration: 200 },
                { left: '55vw', scale: '250%', duration: 0 },
                { top: [-100, '45vh'], duration: 600, easing: 'easeOutElastic(3, 1)' }
            ],
            changeBegin: () => el.classList.add('animating'),
            changeComplete: () => el.classList.remove('animating'),
        })
        arr.add({ anim, el })
    })

    async function fetchSensorData() {
        try {
            const response = await fetch('http://localhost:6969/sensor/info', {
            method: 'POST'
            });
            if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
        
            const soilState = data.soil === 1 ? "Wet" : "Dry";
        
            // Update element content using a helper function (explained below)
            updateSensorDisplay(data.temperature, data.humidity, data.light, soilState);
        
            } catch (error) {
                console.error('Error:', error);
            }
        }
        
        function updateSensorDisplay(temperature, humidity, light, soilState) {
            const tempEl = document.querySelector('#status-temperature > .data');
            const humidityElement = document.querySelector('#status-humidity > .data');
            const lightEl = document.querySelector('#status-sunlight > .data');
            const waterEl = document.querySelector('#status-droplet > .data');
          
            // Update temperature
            tempEl.innerText = temperature; // Set text content to numerical value
          
            // Update humidity
            humidityElement.innerText = humidity; // Append "%" symbol
          
            // Update light (assuming light value represents intensity)
            lightEl.innerText = light; // Set text content to light value
          
            // Update soil state (assuming soilState represents moisture level)
            waterEl.innerText = soilState; // Set text content to soilState value
          
            // Hide icons (assuming icons are child elements)
            const tempIcon = tempEl.querySelector('i'); // Select child with ".icon" class
            const humidityIcon = humidityElement.querySelector('i');
            const lightIcon = lightEl.querySelector('i');
            const waterIcon = waterEl.querySelector('i');
          
            if (tempIcon) tempIcon.style.display = 'none'; // Hide temperature icon
            if (humidityIcon) humidityIcon.style.display = 'none'; // Hide humidity icon
            if (lightIcon) lightIcon.style.display = 'none'; // Hide light icon
            if (waterIcon) waterIcon.style.display = 'none'; // Hide water icon
          }
          
    // Call the function to fetch data (assuming this is called appropriately)
    setInterval(fetchSensorData, 2000);
    
    // const socket = new WebSocket("ws://192.168.1.1:6969")

    // socket.onopen = function(event) {
    //     console.log("[open] Connection established");
    //     socket.send("Hello from client!");
    // };
    
    // socket.onmessage = function(event) {
    //     console.log(`[message] Data received from server: ${event.data}`);
    // };

    // // const http = require('http');
    // const hostname = '127.0.0.1';
    // const port = 3000;
    // const arduinoIP = '192.168.1.1'; // Arduino static IP

    // const httpOptions = {
    // hostname: arduinoIP,
    // port: 80, // Assuming Arduino web server is on port 80
    // path: '/sensor/data', // Assuming the data endpoint on Arduino
    // method: 'GET', // Assuming data is sent via GET request
    // };

    // function getSensorData(callback) {
    // const req = http.request(httpOptions, (res) => {
    //     console.log(`statusCode: ${res.statusCode}`);

    //     let data = '';
    //     res.on('data', (chunk) => {
    //     data += chunk;
    //     });

    //     res.on('end', () => {
    //     try {
    //         const sensorValues = JSON.parse(data);
    //         callback(sensorValues); // Pass received data to callback
    //     } catch (error) {
    //         console.error('Error parsing sensor data:', error);
    //         callback(null); // Pass null on parsing error
    //     }
    //     });
    // });

    // req.on('error', (error) => {
    //     console.error('Error fetching sensor data:', error);
    //     callback(null); // Pass null on error
    // });

    // req.end();
    // }

    // const server = http.createServer((req, res) => {
    // console.log(`Request received: ${req.url}`);

    // if (req.url === '/') {
    //     getSensorData((sensorValues) => {
    //     if (sensorValues) {
    //         // Process sensor values (e.g., display, store)
    //         res.statusCode = 200;
    //         res.setHeader('Content-Type', 'text/plain');
    //         res.end(`Received sensor data: ${JSON.stringify(sensorValues)}`);
    //     } else {
    //         res.statusCode = 500;
    //         res.setHeader('Content-Type', 'text/plain');
    //         res.end('Error fetching sensor data');
    //     }
    //     });
    // } else {
    //     res.statusCode = 404;
    //     res.setHeader('Content-Type', 'text/plain');
    //     res.end('Not Found');
    // }
    // });

    // server.listen(port, hostname, () => {
    // console.log(`Server running at http://${hostname}:${port}/`);
    // }); 
}