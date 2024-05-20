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
                { scale: ['100%', '250%'], easing: 'easeInQuad', duration: 200 },
                { left: '55vw', scale: '150%', duration: 0 },
                { top: [-100, '45vh'], duration: 600, easing: 'easeOutElastic(3, 1)' }
            ],
            changeBegin: () => el.classList.add('animating'),
            changeComplete: () => el.classList.remove('animating'),
        })
        arr.add({ anim, el })
    })
}