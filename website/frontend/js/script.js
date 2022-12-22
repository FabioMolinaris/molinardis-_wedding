const API_HOST = 'http://localhost:3001';

function loadHTML(pageName) {
    fetch(pageName)
        .then(response => response.text())
        .then(text => document.getElementById('container').innerHTML = text);
};

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