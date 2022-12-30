const API_HOST = 'http://192.168.1.108:3001';

let theme;

function loadHTML(pageName) {
    fetch(pageName)
        .then(response => response.text())
        .then(text => document.getElementById('container').innerHTML = text);

    if (pageName == 'home.html')
        getCountdown();
};

function changeTheme(themeNumber) {
    if (themeNumber === undefined)
        themeNumber = Math.floor(Math.random() * 5) + 1;

    switch (themeNumber) {
        case 1:
            theme = 'theme-bologna';
            break;
        case 2:
            theme = 'theme-bolzano';
            break;
        case 3:
            theme = 'theme-calabria';
            break;
        case 4:
            theme = 'theme-piemonte';
            break;
        case 5:
            theme = 'theme-undefined';
            break;
    }
    localStorage.setItem('theme', theme);
    document.documentElement.className = theme;
}

function getCountdown() {
    console.log("conto alla rovescia");

    let countDownDate = new Date("Feb 4, 2023 11:00:00").getTime();

    // Update the count down every 1 second
    let x = setInterval(function () {

        // Get today's date and time
        let now = new Date().getTime();

        // Find the distance between now and the count down date
        let distance = countDownDate - now;

        // Time calculations for days, hours, minutes and seconds
        let days = Math.floor(distance / (1000 * 60 * 60 * 24));
        let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Display the result in the element with id="demo"
        document.getElementById("countdown").innerHTML = days + " giorni " + hours + " ore "
            + minutes + " minuti " + seconds + " secondi ";

        // If the count down is finished, write some text
        if (distance < 0) {
            clearInterval(x);
            document.getElementById("countdown").innerHTML = "IT'S HAPPENING";
        }
    }, 1000);
}

function inviaMessaggio(nome, testo) {
    let messaggio = JSON.stringify({
        nome: nome,
        testo: testo
    });

    fetch(API_HOST + '/messaggio/', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: messaggio
    }).then(response => Promise.resolve(response.text())
        .then(dati => {
            if (response.status != 200)
                toastFeedback("Problema!", dati, response.status);
            else {
                toastFeedback("Grazie!", "Il messaggio è stato registrato con successo", "");
            }
        })
    );
}
/*
function inizializzazione() {
    fetch(API_HOST + '/situazione')
        .then(response => Promise.resolve(response.text())
            .then(dati => {
                if (response.status != 200)
                    toastFeedback("Problema!", dati, response.status);
                else loadSituazione(JSON.parse(dati));
            })
        );

    fetch(API_HOST + '/produttori')
        .then(response => Promise.resolve(response.text())
            .then(dati => {
                if (response.status != 200)
                    toastFeedback("Problema!", dati, response.status);
                else loadProduttori(JSON.parse(dati));
            })
        );

    fetch(API_HOST + '/tipologie')
        .then(response => Promise.resolve(response.text())
            .then(dati => {
                if (response.status != 200)
                    toastFeedback("Problema!", dati, response.status);
                else loadTipologie(JSON.parse(dati));
            })
        );

    fetch(API_HOST + '/locazioni')
        .then(response => Promise.resolve(response.text())
            .then(dati => {
                if (response.status != 200)
                    toastFeedback("Problema!", dati, response.status);
                else loadLocazioni(JSON.parse(dati));
            })
        );

    navSituazione();
}

function clickConfermaEliminaArticolo(codice) {
    fetch(API_HOST + '/articoli/' + encodeURIComponent(codice), {
        method: "DELETE",
        headers: { 'Content-Type': 'application/json' }
    }).then(response => Promise.resolve(response.text())
        .then(dati => {
            if (response.status != 200)
                toastFeedback("Problema!", dati, response.status);
            else {
                loadSituazione(JSON.parse(dati));
                toastFeedback("Articolo eliminato", "Hai rimosso con successo l'articolo " + codice, 200);
                document.getElementById("btnChiudiCanvasArticolo").click();
            }
        })
    );
}
*/

function toastFeedback(titolo, descrizione, status) {
    document.getElementById("titoloToast").textContent = " " + titolo;
    document.getElementById("descToast").textContent = descrizione;
    if (status == 200) {
        document.getElementById("iconaToast").setAttribute("class", "bi bi-check2-circle");
        document.getElementById("toastHeader").setAttribute("class", "toast-header text-bg-success");
    } else if (status >= 400 && status <= 500) {
        document.getElementById("iconaToast").setAttribute("class", "bi bi-exclamation-triangle");
        document.getElementById("toastHeader").setAttribute("class", "toast-header text-bg-warning");
    } else if (status >= 500 && status <= 600) {
        document.getElementById("iconaToast").setAttribute("class", "bi bi-bug");
        document.getElementById("toastHeader").setAttribute("class", "toast-header text-bg-danger");
    } else {
        document.getElementById("iconaToast").setAttribute("class", "bi bi-info-circle");
        document.getElementById("toastHeader").setAttribute("class", "toast-header");
    }

    const toast = new bootstrap.Toast(document.getElementById('toastFeedback'))
    toast.show()
}