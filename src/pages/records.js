import { Chart, TimeScale } from "chart.js/auto";
import 'chartjs-adapter-moment'
import 'chartjs-plugin-streaming'

Chart.register(TimeScale)

export default function records() {
    const chart = new Chart(document.getElementById('sensorChart'), {
        type: 'line',
        data: {
            datasets: [
                {
                    label: 'Temperature (°C)',
                    data: [],
                    borderColor: 'red',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    pointRadius: 3,
                }],
            datasets: [
                {
                    label: 'Humidity (%)',
                    data: [],
                    borderColor: 'blue',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    pointRadius: 3,
                }],
            datasets: [
                {
                    label: 'Light (Lux)',
                    data: [],
                    borderColor: 'green',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    pointRadius: 3,
                }],
            datasets: [
                {
                    label: 'Soil Moisture (%)',
                    data: [],
                    borderColor: 'brown',
                    backgroundColor: 'rgba(153, 102, 49, 0.2)',
                    pointRadius: 3,
                }
            ]
        },
        options: {
            responsive: true,
            // maintainAspectRatio: false,
            layout: {
                padding: {
                    top: 20,
                    right: 20,
                    bottom: 20,
                    left: 20
                  }
            },
            scales: {
                xAxes: [{
                    stacked: true, // Stack bars if needed for multiple charts
                    ticks: {
                    display: false // Hide x-axis labels for individual charts
                    }
                }],
                yAxes: [{
                    ticks: {
                    display: true // Show y-axis labels
                    }
                }]
            }   
            },
        plugins: {
            streaming: {
                options: {
                    duration: 20000, // Display 10 seconds of data (adjust as needed)
                }
            }
        }
    });

    const MAX_ENTRIES = 20; // Define the maximum number of entries to display

    const fetchData = async () => {
    try {
        const response = await fetch('http://localhost:6969/sensor/info', {
        method: 'POST'
        });
        const data = await response.json();
        const timestamp = new Date().getTime();
        const latestIndex = chart.data.datasets[0].data.length - 1

        // Limit data before pushing to chart
        chart.data.datasets[0].data[latestIndex] = chart.data.datasets[0].data.slice(-MAX_ENTRIES).concat({ x: timestamp, y: data.temperature });
        chart.data.datasets[1].data[latestIndex] = chart.data.datasets[1].data.slice(-MAX_ENTRIES).concat({ x: timestamp, y: data.humidity });
        chart.data.datasets[2].data[latestIndex] = chart.data.datasets[2].data.slice(-MAX_ENTRIES).concat({ x: timestamp, y: data.light });
        chart.data.datasets[3].data[latestIndex] = chart.data.datasets[3].data.slice(-MAX_ENTRIES).concat({ x: timestamp, y: data.soil });

        chart.update();

    } catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        setTimeout(fetchData, 2000);
    }
    }

    fetchData(); // Call initially to start data retrieval

    const resizeChart = () => {
        // Get the width of the container element (adjust as needed)
        const chartCanvas = document.getElementById('sensorChart')

        const availableHeight = window.innerHeight - 40; // Adjust padding value

        // Set the container's height to the minimum of available height and 80vh
        const containerHeight = Math.min(availableHeight, window.innerHeight * 0.5);
        chartCanvas.parentElement.style.height = containerHeight + 'px';
        // const containerWidth = chartCanvas.parentElement.clientWidth;
      
        // Define an aspect ratio to maintain chart proportions (optional)
        const aspectRatio = 2;
      
        // Set the canvas width and height based on container width and aspect ratio
        chartCanvas.width = containerWidth;
        chartCanvas.height = containerWidth / aspectRatio;
        console.log(chartCanvas.height)
      
        // Update the chart to reflect the new size
        chart.update();
      };
      
    // Call the resize function initially to set the size
    resizeChart();
    
    // Add an event listener for window resize to update the chart on window resize
    window.addEventListener('resize', resizeChart);  
}