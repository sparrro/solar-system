//sätter slumpat startläge för omloppsbanorna
function randomiseOrbits() {
    const orbitEls = document.querySelectorAll('.planets>div');
    const randomOrbitDelay = Math.random()*-1000000
    orbitEls.forEach(orbit => orbit.style.animationDelay = `${randomOrbitDelay}s`)
    document.querySelector('.rings-of-saturn').style.animationDelay = `${randomOrbitDelay}s`
}

//gör planeterna klickbara
function addPlanetClicks() {
    const planetEls = document.querySelectorAll('.planets aside:not(aside>aside)');
    console.log(planetEls);
    planetEls.forEach(planetEl => planetEl.addEventListener('click', () => {testFunk(planetEl)}))
}


async function testFunk(planet) {
    let planetData = await getData();
    console.log(planetData[planet.id])
}



async function printPlanet(planet) {
    let planetsData = await getData();
    console.log(planetsData)
}



async function getData() {
    try {
        let data = await fetch('https://majazocom.github.io/Data/solaris.json');
        data = await data.json();
        return data
    } catch(err) {
    }
}


async function renderSolarSystem() {
    let planets = await getData();
    planets.forEach(planet => {
        let planetEl;
        if (planet.id == 0) {
            planetEl = document.createElement('aside');
            planetEl.classList.add('Solen');
            planetEl.title = 'Solen';
            planetEl.id = '0';
        } else {
            planetEl = document.createElement('div');
            planetEl.classList.add(`orbit-of-${planet.name}`);
            let reverseOrbitEl = document.createElement('div');
            reverseOrbitEl.classList.add('orbit-reverser');
            let planetProperEl = document.createElement('aside');
            planetProperEl.classList.add(planet.name);
            planetProperEl.title = planet.name;
            planetProperEl.id = planet.id;
            if (planet.id == 6) {
                let ringsEl = document.createElement('aside');
                ringsEl.classList.add('rings-of-saturn');
                planetProperEl.appendChild(ringsEl)
            };
            reverseOrbitEl.appendChild(planetProperEl);
            planetEl.appendChild(reverseOrbitEl);
        }
        document.querySelector('.planets').insertAdjacentElement('afterbegin', planetEl);
    });
    randomiseOrbits();
    addPlanetClicks();
}

renderSolarSystem()













async function printMars() {
    let data = await getData();
    let mars = data[4];
    console.log(mars.desc)
    console.log(mars)
    console.log(`${mars.moons.length}: ${mars.moons.join(', ')}`)
}

//printMars()