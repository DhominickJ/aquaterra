import anime from "animejs"

export default function sensors() {

    const elements = document.querySelectorAll('.status-elements')
    const icons = [...document.querySelectorAll('.status-elements span')]
        .reverse()

    console.clear()
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
        const el = e.target.closest('span')
        if (!el || document.querySelector('.animating')) return

        if ([...arr.values()].find(val => val.el === el)) {
            const e = [...arr.values()].find(val => val.el === el)
            e.anim.reverse()
            e.anim.play()
            arr.delete(e)
            return
        }

        arr.forEach((item) => {
            const { anim, el } = item

            anim.reverse()
            anim.play()
            arr.delete(item)
        })

        const anim = anime({
            targets: el,
            keyframes: [
                { scale: ['100%', '150%'], easing: 'easeInQuad', duration: 200 },
                { left: '55vw', scale: '100%', duration: 0 },
                { top: [-100, '45vh'], duration: 600, easing: 'easeOutElastic(3, 1)' }
            ],
            changeBegin: () => el.classList.add('animating'),
            changeComplete: () => el.classList.remove('animating'),
        })
        arr.add({ anim, el })
    })


    // function fetchSensorData() {
    //     // fetch('/sensor/info', {
    //         // method: 'POST',
    //         // // body: 'temperature=value1&humidity=value2&light_sensor=value3&soil_sensor=value4' // replace value1, value2, value3 with actual values
    //     // })
    //         // .then(response => response.json())
    //         // .then(data => {
    //             // const soil_state = data.soil === 1 ? "Wet" : "Dry";
    //             // // Measuring the different thresholds of the sensors and displaying them with colors
    //             // if (data.temperature > 30) {
    //                 // document.getElementById('temperature').style.color = "red";
    //                 // document.querySelector('.temperature').style.backgroundColor = "orange";
    //             // }
    //             // if (data.humidity < 50) {
    //                 // document.getElementById('humidity').style.color = "red";
    //                 // document.querySelector('.humidity').style.backgroundColor = "orange";
    //             // }
    //             // if (data.light < 100) {
    //                 // document.getElementById('light').style.color = "red";
    //                 // document.querySelector('.light').style.backgroundColor = "orange";
    //             // }
    //             // if (soil_state === "Dry") {
    //                 // document.getElementById('soil').style.color = "red";
    //                 // document.querySelector('.soil').style.backgroundColor = "orange";
    //             // }
    //             // document.getElementById('temperature').innerHTML = parseInt(data.temperature) + "°C";
    //             // document.getElementById('humidity').innerHTML = parseInt(data.humidity) + "%";
    //             // document.getElementById('light').innerHTML = data.light + "&deg;";
    //             // document.getElementById('soil').innerHTML = soil_state;
    //         // })
    //         // .catch((error) => {
    //             // console.error('Error:', error);
    //         // });
    // }

    // //Change the value of the sensor data every 5 seconds
    // fetchSensorData();
    // setInterval(fetchSensorData, 2000);
}