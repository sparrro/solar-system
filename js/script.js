const infoBox = document.querySelector('.info')
const searchField = document.querySelector('.search-area input')
const searchResults = document.querySelector('.search-area ul')
let matchedPlanets = []

function hide(element) {
    element.classList.add('invisible')
}
function reveal(element) {
    element.classList.remove('invisible')
}
async function getData() {
    try {
        let data = await fetch('https://majazocom.github.io/Data/solaris.json');
        data = await data.json();
        return data
    } catch(err) {
        alert(err)
    }
}

//renderar infosidan
async function renderInfoPage(planetObj) {
    let planetData = await getData();
    let planetInQuestion = planetData[planetObj.id]

    let moons;
    if (planetInQuestion.moons.length == 0){
        moons = 'inga'
    } else {
        moons = planetInQuestion.moons.join(', ')
    }

    let orbitPlural;
    if (planetInQuestion.orbitalPeriod == 1) {
        orbitPlural = 'dag'
    } else {
        orbitPlural = 'dagar'
    }

    let rotationPlural;
    if (planetInQuestion.rotation == 1) {
        rotationPlural = 'dag'
    } else {
        rotationPlural = 'dagar'
    }

    let infoContent = `
    <nav>
        <button type="button" class="back-btn">Tillbaka till solsystemet</button>
    </nav>
    <button type="button" class="left-btn invisible" title="Förra sökresultatet">&leftarrow;</button>
    <article class="planet">
        <h2 class="latin-name">${planetInQuestion.latinName}</h2>
        <h2 class="swedish-name">${planetInQuestion.name}</h2>
        <aside class="${planetInQuestion.name}-spinner"></aside>
        <p>
            ${planetInQuestion.desc}
        </p>
        <ul>
            <li>Omkrets: ${planetInQuestion.circumference}km</li>
            <li>Avstånd från Solen: ${planetInQuestion.distance}km</li>
            <li>Omloppsperiod: ${planetInQuestion.orbitalPeriod} ${orbitPlural}</li>
            <li>Rotationsperiod: ${planetInQuestion.rotation} ${rotationPlural}</li>
            <li>Högsta temperatur: ${planetInQuestion.temp.day}&deg;</li>
            <li>Lägsta temperatur: ${planetInQuestion.temp.night}&deg;</li>
            <li>Månar: ${moons}</li>
        </ul>
    </article>
    <button type="button" class="right-btn invisible" title="Nästa sökresultat">&rightarrow;</button>
    `
    infoBox.innerHTML = infoContent;

    //paginationsknapparna
    const rightPage = document.querySelector('.right-btn');
    const leftPage = document.querySelector('.left-btn');
    let planetIndex = matchedPlanets.indexOf(planetObj);

    rightPage.addEventListener('click', () => {
        renderInfoPage(matchedPlanets[planetIndex+1])
    })
    leftPage.addEventListener('click', () => {
        renderInfoPage(matchedPlanets[planetIndex-1])
    })

    let resultEls = document.querySelectorAll('.search-area li');

    if (resultEls.length > 0) {
        if (planetIndex > 0) {
            reveal(leftPage)
        }
        if (planetIndex < resultEls.length-1) {
            reveal(rightPage)
        }
    }

    //bakåtknappen med nollställning av sökresultat
    const backBtn = document.querySelector('.back-btn')
    backBtn.addEventListener('click', () => {
        infoBox.innerHTML = '';
        searchResults.innerHTML = '';
        searchField.value = ''
        matchedPlanets = []
        hide(infoBox)
    })

    reveal(infoBox);
}

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
    planetEls.forEach(planetEl => planetEl.addEventListener('click', () => {
        matchedPlanets = []
        renderInfoPage(planetEl)
    }))
}

//renderar ut solsystemet
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

//sökning
searchField.addEventListener('keyup', async () => {
    let planetData = await getData();
    matchedPlanets = []
    let searchTerm = searchField.value.toLowerCase();
    planetData.forEach(planet => {
        if (searchTerm != '' && planet.name.toLowerCase().includes(searchTerm) || searchTerm != '' && planet.latinName.toLowerCase().includes(searchTerm)) {
            matchedPlanets.push(planet);
        }
    })
    searchResults.innerHTML = ''
    matchedPlanets.forEach(match => {
        let searchResult = document.createElement('li');
        searchResult.innerText = `${match.name}`;
        searchResults.appendChild(searchResult)
    })
    let resultEls = Array.from(document.querySelectorAll('.search-area li')); //nodelist kunde visst inte ta indexOf()
    resultEls.forEach(el => {
        el.addEventListener('click', async () => {
            renderInfoPage(matchedPlanets[resultEls.indexOf(el)]);
        })
    })
})

renderSolarSystem()