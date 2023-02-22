//initiala variabler
const main = document.querySelector('main');
const orbitEls = document.querySelectorAll('.planets>div')
const planetEls = document.querySelectorAll('.planets aside');
const searchHTML = `<input type="text" name="planet" id="planet-search">
            <button type="button">Sök</button>`

//sätter slumpat startläge för omloppsbanorna
const randomOrbitDelay = Math.random()*-1000000
orbitEls.forEach(orbit => orbit.style.animationDelay = `${randomOrbitDelay}s`)
document.querySelector('.rings-of-saturn').style.animationDelay = `${randomOrbitDelay}s`

async function getData() {
    try {
        let data = await fetch('https://majazocom.github.io/Data/solaris.json');
        data = await data.json();
        return data
    } catch(err) {
        main.innerHTML = '<h1>ur doing it wrong</h1>'
    }
}

async function printMars() {
    let data = await getData();
    let mars = data[4];
    console.log(mars.desc)
    console.log(mars)
}

printMars()

async function printNames() {
    let planets = await getData();
    planets.forEach(planet => {
        console.log(planet.name)
    })
}


async function printPlanet(planet) {
    let planets = await getData();
    console.log(planets[planet.id].latinName)
}


planetEls.forEach(planet => {
    planet.addEventListener('click', () => {printPlanet(planet)})
})