const main = document.querySelector('main');

async function getData() {
    try {
        let data = await fetch('https://majazocom.github.io/Data/solaris.json');
        data = await data.json();
        console.log(data)
    } catch(err) {
        main.innerHTML = '<h1>ur doing it wrong</h1>'
    }
}