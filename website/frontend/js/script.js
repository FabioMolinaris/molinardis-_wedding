const API_HOST = 'http://192.168.1.10:3001';

function loadHTML(pageName) {
    fetch(pageName)
    .then(response=> response.text())
    .then(text=> document.getElementById('container').innerHTML = text);
};

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

function clickCerimonia() {
    CodiceArticoloSelezionato = "";
    fetch(API_HOST + '/situazione')
        .then(response => Promise.resolve(response.text())
            .then(dati => {
                if (response.status != 200)
                    toastFeedback("Problema!", dati, response.status);
                else loadSituazione(JSON.parse(dati));
            })
        );
    navSituazione();
}

function clickRicevimento() {
    CodiceArticoloSelezionato = "";
    fetch(API_HOST + '/situazione/esauriti')
        .then(response => Promise.resolve(response.text())
            .then(dati => {
                if (response.status != 200)
                    toastFeedback("Problema!", dati, response.status);
                else loadSituazione(JSON.parse(dati));
            })
        );
    navSituazione();
}

function clickSottoscorta() {
    CodiceArticoloSelezionato = "";
    fetch(API_HOST + '/situazione/sottoscorta')
        .then(response => Promise.resolve(response.text())
            .then(dati => {
                if (response.status != 200)
                    toastFeedback("Problema!", dati, response.status);
                else loadSituazione(JSON.parse(dati));
            })
        );
    navSituazione();
}

function clickNuovoArticolo() {
    CodiceArticoloSelezionato = "";
    document.querySelector("#formArticolo").classList.remove('was-validated');
    document.querySelector("#canvasArticoloTitolo").textContent = "Nuovo Articolo";
    document.querySelector("#pulsantiNuovoArticolo").classList.remove("d-none");
    document.querySelector("#pulsantiBase").classList.add("d-none");
    document.querySelector("#pulsantiModifica").classList.add("d-none");
    document.querySelector("#articoloSelezionato").removeAttribute("disabled");
    let articoloVuoto = {
        Codice: ""
        , Descrizione: ""
        , QuantitaMinima: 0
        , Udm: "N°"
        , Note: ""
        , CatalogoWeb: ""
        , idProduttore: 2
        , idTipologia: 1
        , idLocazione: 1
    };

    loadArticolo(articoloVuoto, 0);
}

function clickNuovoMovimento() {
    document.querySelector("#formMovimento").classList.remove('was-validated');
    document.querySelector("#canvasMovimentoTitolo").textContent = "Nuovo Movimento";
    document.querySelector("#pulsantiNuovoMovimento").classList.remove("d-none");
    document.querySelector("#pulsantiBaseMovimento").classList.add("d-none");
    document.querySelector("#pulsantiModificaMovimento").classList.add("d-none");
    document.querySelector("#movimentoSelezionato").removeAttribute("disabled");

    let movimentoVuoto = {
        CodiceArticolo: CodiceArticoloSelezionato
        , Quantita: 0
        , Causale: ""
        , Note: ""
        , DataInserimento: new Date()
    };

    loadMovimento(movimentoVuoto);
}

function clickTuttiMovimenti() {
    CodiceArticoloSelezionato = "";
    fetch(API_HOST + '/movimenti/')
        .then(response => Promise.resolve(response.text())
            .then(dati => {
                if (response.status != 200)
                    toastFeedback("Problema!", dati, response.status);
                else
                    loadMovimenti(JSON.parse(dati));
            })
        );
    navMovimenti();
}

function clickArticolo(riga) {
    document.querySelector("#canvasArticoloTitolo").textContent = "Dettagli Articolo";
    document.querySelector("#pulsantiBase").classList.remove("d-none");
    document.querySelector("#pulsantiModifica").classList.add("d-none");
    document.querySelector("#pulsantiNuovoArticolo").classList.add("d-none");
    document.querySelector("#articoloSelezionato").setAttribute("disabled", true);

    CodiceArticoloSelezionato = riga.querySelector(".s_cod").textContent;

    fetch(API_HOST + '/articoli/' + encodeURIComponent(CodiceArticoloSelezionato))
        .then(response => Promise.resolve(response.text())
            .then(dati => {
                if (response.status != 200)
                    toastFeedback("Problema!", dati, response.status);
                else
                    loadArticolo(JSON.parse(dati)[0], riga.querySelector(".s_qta").textContent);
            })
        );
}

function clickMovimentiArticolo() {
    fetch(API_HOST + '/movimenti/articolo/' + encodeURIComponent(CodiceArticoloSelezionato))
        .then(response => Promise.resolve(response.text())
            .then(dati => {
                if (response.status != 200)
                    toastFeedback("Problema!", dati, response.status);
                else {
                    loadMovimenti(JSON.parse(dati));
                    navMovimenti();
                    document.getElementById("btnChiudiCanvasArticolo").click();
                }
            })
        );
}

function clickModifica() {
    document.querySelector("#formArticolo").classList.remove('was-validated');
    document.querySelector("#canvasArticoloTitolo").textContent = "Modifica Articolo";
    document.querySelector("#pulsantiBase").classList.add("d-none");
    document.querySelector("#pulsantiModifica").classList.remove("d-none");
    document.querySelector("#articoloSelezionato").removeAttribute("disabled");
}

function clickAnnullaModificaArticolo() {
    document.querySelector("#canvasArticoloTitolo").textContent = "Dettagli Articolo";
    document.querySelector("#pulsantiBase").classList.remove("d-none");
    document.querySelector("#pulsantiModifica").classList.add("d-none");
    document.querySelector("#articoloSelezionato").setAttribute("disabled", true);

    fetch(API_HOST + '/articoli/' + encodeURIComponent(CodiceArticoloSelezionato))
        .then(response => Promise.resolve(response.text())
            .then(dati => {
                if (response.status != 200)
                    toastFeedback("Problema!", dati, response.status);
                else
                    loadArticolo(JSON.parse(dati)[0], document.querySelector("#a_qta").value);
            })
        );
}

function clickConfermaModificaArticolo() {
    let form = document.querySelector("#formArticolo");
    form.classList.add('was-validated');
    if (form.checkValidity()) {
        let valoriCampi = JSON.stringify({
            codice: document.querySelector("#a_cod").value.trim()
            , quantitaMinima: parseFloat(document.querySelector("#a_qtamin").value)
            , note: document.querySelector("#a_note").value.trim()
            , descrizione: document.querySelector("#a_desc").value.trim()
            , tipologia: parseInt(document.querySelector("#a_tpl").value)
            , produttore: parseInt(document.querySelector("#a_prd").value)
            , udm: document.querySelector("#a_udm").value.trim()
            , catalogoWeb: document.querySelector("#a_catweb").value.trim()
            , locazione: parseInt(document.querySelector("#a_loc").value)
        });

        fetch(API_HOST + '/articoli/' + encodeURIComponent(CodiceArticoloSelezionato), {
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            body: valoriCampi
        }).then(response => Promise.resolve(response.text())
            .then(dati => {
                if (response.status != 200) {
                    toastFeedback("Problema!", dati, response.status);
                    fetch(API_HOST + '/articoli/' + encodeURIComponent(CodiceArticoloSelezionato))
                        .then(response => Promise.resolve(response.text())
                            .then(dati => {
                                if (response.status != 200)
                                    toastFeedback("Problema!", dati, response.status);
                                else
                                    loadArticolo(JSON.parse(dati)[0], document.querySelector("#a_qta").value);
                            })
                        );
                } else {
                    loadArticolo(JSON.parse(dati)[0], document.querySelector("#a_qta").value);
                    CodiceArticoloSelezionato = document.querySelector("#a_cod").value;
                    fetch(API_HOST + '/situazione')
                        .then(response => Promise.resolve(response.text())
                            .then(dati => {
                                if (response.status != 200)
                                    toastFeedback("Problema!", dati, response.status);
                                else {
                                    loadSituazione(JSON.parse(dati));
                                    document.querySelector("#canvasArticoloTitolo").textContent = "Dettagli Articolo";
                                    document.querySelector("#pulsantiBase").classList.remove("d-none");
                                    document.querySelector("#pulsantiModifica").classList.add("d-none");
                                    document.querySelector("#articoloSelezionato").setAttribute("disabled", true);
                                }
                            })
                        );
                }
            })
        );
    }
}

function clickEliminaArticolo() {
    document.getElementById("bodyCodice").innerHTML = "Codice: <strong>" + document.getElementById("a_cod").value + "</strong>";
    document.getElementById("bodyDescrizione").innerHTML = "Descrizione: <strong>" + document.getElementById("a_desc").value + "</strong>";
    document.getElementById("btnConfermaEliminaArticolo").addEventListener('click', () => { clickConfermaEliminaArticolo(document.getElementById("a_cod").value) });
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

function clickConfermaNuovoArticolo() {
    let form = document.querySelector("#formArticolo");
    form.classList.add('was-validated');
    if (form.checkValidity()) {
        let valoriCampi = JSON.stringify({
            quantitaMinima: parseFloat(document.querySelector("#a_qtamin").value)
            , note: document.querySelector("#a_note").value.trim()
            , descrizione: document.querySelector("#a_desc").value.trim()
            , tipologia: parseInt(document.querySelector("#a_tpl").value)
            , produttore: parseInt(document.querySelector("#a_prd").value)
            , udm: document.querySelector("#a_udm").value.trim()
            , catalogoWeb: document.querySelector("#a_catweb").value.trim()
            , locazione: parseInt(document.querySelector("#a_loc").value)
        });

        fetch(API_HOST + '/articoli/' + encodeURIComponent(document.querySelector("#a_cod").value.trim()), {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: valoriCampi
        }).then(response => Promise.resolve(response.text())
            .then(dati => {
                if (response.status != 200)
                    toastFeedback("Problema!", dati, response.status);
                else {
                    loadSituazione(JSON.parse(dati));
                    toastFeedback("Articolo aggiunto", "Hai aggiunto con successo l'articolo " + document.querySelector("#a_cod").value.trim(), 200);
                    document.getElementById("btnChiudiCanvasArticolo").click();
                }
            })
        );
    }
}

function clickMovimento(idMovimento) {
    document.querySelector("#canvasMovimentoTitolo").textContent = "Dettagli Movimento";
    document.querySelector("#pulsantiBaseMovimento").classList.remove("d-none");
    document.querySelector("#pulsantiModificaMovimento").classList.add("d-none");
    document.querySelector("#pulsantiNuovoMovimento").classList.add("d-none");
    document.querySelector("#movimentoSelezionato").setAttribute("disabled", true);

    fetch(API_HOST + '/movimenti/' + idMovimento)
        .then(response => Promise.resolve(response.text())
            .then(dati => {
                if (response.status != 200)
                    toastFeedback("Problema!", dati, response.status);
                else
                    loadMovimento(JSON.parse(dati)[0]);
            })
        );
}

function clickModificaMovimento() {
    document.querySelector("#formMovimento").classList.remove('was-validated');
    document.querySelector("#canvasMovimentoTitolo").textContent = "Modifica Movimento";
    document.querySelector("#pulsantiBaseMovimento").classList.add("d-none");
    document.querySelector("#pulsantiModificaMovimento").classList.remove("d-none");
    document.querySelector("#movimentoSelezionato").removeAttribute("disabled");
}

function clickAnnullaModificaMovimento() {
    document.querySelector("#canvasMovimentoTitolo").textContent = "Dettagli Movimento";
    document.querySelector("#pulsantiBaseMovimento").classList.remove("d-none");
    document.querySelector("#pulsantiModificaMovimento").classList.add("d-none");
    document.querySelector("#movimentoSelezionato").setAttribute("disabled", true);

    fetch(API_HOST + '/movimenti/' + encodeURIComponent(idMovimentoSelezionato))
        .then(response => Promise.resolve(response.text())
            .then(dati => {
                if (response.status != 200)
                    toastFeedback("Problema!", dati, response.status);
                else
                    loadMovimento(JSON.parse(dati)[0]);
            })
        );
}

function clickConfermaModificaMovimento() {
    let form = document.querySelector("#formMovimento");
    form.classList.add('was-validated');
    if (form.checkValidity()) {
        document.querySelector("#canvasMovimentoTitolo").textContent = "Dettagli Movimento";
        document.querySelector("#pulsantiBaseMovimento").classList.remove("d-none");
        document.querySelector("#pulsantiModificaMovimento").classList.add("d-none");
        document.querySelector("#movimentoSelezionato").setAttribute("disabled", true);

        let valoriCampi = JSON.stringify({
            codice: document.querySelector("#m_cod").value.trim()
            , dataInserimento: document.querySelector("#m_dti").value
            , quantita: parseFloat(document.querySelector("#m_qta").value)
            , causale: document.querySelector("#m_caus").value.trim()
            , note: document.querySelector("#m_note").value.trim()
        });

        fetch(API_HOST + '/movimenti/' + encodeURIComponent(idMovimentoSelezionato), {
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            body: valoriCampi
        }).then(response => Promise.resolve(response.text())
            .then(dati => {
                if (response.status != 200)
                    toastFeedback("Problema!", dati, response.status);
                else {
                    loadMovimento(JSON.parse(dati)[0]);
                    if (CodiceArticoloSelezionato !== "")
                        fetch(API_HOST + '/movimenti/articolo/' + encodeURIComponent(CodiceArticoloSelezionato))
                            .then(response => Promise.resolve(response.text())
                                .then(dati => {
                                    if (response.status != 200)
                                        toastFeedback("Problema!", dati, response.status);
                                    else
                                        loadMovimenti(JSON.parse(dati));
                                })
                            );
                    else
                        fetch(API_HOST + '/movimenti/')
                            .then(response => Promise.resolve(response.text())
                                .then(dati => {
                                    if (response.status != 200)
                                        toastFeedback("Problema!", dati, response.status);
                                    else
                                        loadMovimenti(JSON.parse(dati));
                                })
                            );
                }
            })
        );
    }
}

function clickEliminaMovimento() {
    document.getElementById("bodyCodiceArticolo").innerHTML = "Codice Articolo: <strong>" + document.getElementById("m_cod").value + "</strong>";
    document.getElementById("bodyData").innerHTML = "Data: <strong>" + document.getElementById("m_dti").value + "</strong>";
    document.getElementById("btnConfermaEliminaMovimento").addEventListener('click', () => { clickConfermaEliminaMovimento(idMovimentoSelezionato) });
}

function clickConfermaEliminaMovimento(id) {
    fetch(API_HOST + '/movimenti/' + encodeURIComponent(id), {
        method: "DELETE",
        headers: { 'Content-Type': 'application/json' }
    }).then(response => Promise.resolve(response.text())
        .then(dati => {
            if (response.status != 200)
                toastFeedback("Problema!", dati, response.status);
            else {
                if (CodiceArticoloSelezionato !== "")
                    fetch(API_HOST + '/movimenti/articolo/' + encodeURIComponent(CodiceArticoloSelezionato))
                        .then(response => Promise.resolve(response.text())
                            .then(dati => {
                                if (response.status != 200)
                                    toastFeedback("Problema!", dati, response.status);
                                else
                                    loadMovimenti(JSON.parse(dati));
                            })
                        );
                else
                    fetch(API_HOST + '/movimenti/')
                        .then(response => Promise.resolve(response.text())
                            .then(dati => {
                                if (response.status != 200)
                                    toastFeedback("Problema!", dati, response.status);
                                else
                                    loadMovimenti(JSON.parse(dati));
                            })
                        );
                toastFeedback("Movimento eliminato", "Hai rimosso con successo il movimento " + id, 200);
                document.getElementById("btnChiudiCanvasMovimento").click();
            }
        })
    );
}

function clickConfermaNuovoMovimento() {
    let form = document.querySelector("#formMovimento");
    form.classList.add('was-validated');
    if (form.checkValidity()) {
        let valoriCampi = JSON.stringify({
            codice: document.querySelector("#m_cod").value.trim()
            , quantita: parseFloat(document.querySelector("#m_qta").value)
            , dataInserimento: document.querySelector("#m_dti").value
            , note: document.querySelector("#m_note").value.trim()
            , causale: document.querySelector("#m_caus").value.trim()
        });

        fetch(API_HOST + '/movimenti/', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: valoriCampi
        }).then(response => Promise.resolve(response.text())
            .then(dati => {
                if (response.status != 200)
                    toastFeedback("Problema!", dati, response.status);
                else {
                    if (CodiceArticoloSelezionato !== "")
                        fetch(API_HOST + '/movimenti/articolo/' + encodeURIComponent(CodiceArticoloSelezionato))
                            .then(response => Promise.resolve(response.text())
                                .then(dati => {
                                    if (response.status != 200)
                                        toastFeedback("Problema!", dati, response.status);
                                    else
                                        loadMovimenti(JSON.parse(dati));
                                })
                            );
                    else
                        fetch(API_HOST + '/movimenti/')
                            .then(response => Promise.resolve(response.text())
                                .then(dati => {
                                    if (response.status != 200)
                                        toastFeedback("Problema!", dati, response.status);
                                    else
                                        loadMovimenti(JSON.parse(dati));
                                })
                            );
                    toastFeedback("Movimento aggiunto", "Hai aggiunto con successo il movimento dell'articolo " + document.querySelector("#m_cod").value.trim(), 200);
                    document.getElementById("btnChiudiCanvasMovimento").click();
                }
            })
        );
    }
}

function loadProduttori(data) {
    const selectProduttori = document.querySelector("#a_prd");
    let selectHTML = '';
    data.forEach(function ({ Id, Nome }) {
        selectHTML += '<option value="' + Id + '">' + Nome + '</option>';
    });
    selectProduttori.innerHTML = selectHTML;
}

function loadTipologie(data) {
    const selectTipologie = document.querySelector("#a_tpl");
    let selectHTML = '';
    data.forEach(function ({ Id, Nome }) {
        selectHTML += '<option value="' + Id + '">' + Nome + '</option>';
    });
    selectTipologie.innerHTML = selectHTML;
}

function loadLocazioni(data) {
    const selectLocazioni = document.querySelector("#a_loc");
    let selectHTML = '';
    data.forEach(function ({ Id, Descrizione }) {
        selectHTML += '<option value="' + Id + '">' + Descrizione + '</option>';
    });
    selectLocazioni.innerHTML = selectHTML;
}

function loadArticolo(articolo, qta) {
    document.querySelector("#a_cod").value = articolo.Codice;
    document.querySelector("#a_desc").value = articolo.Descrizione;
    document.querySelector("#a_qta").value = qta;
    document.querySelector("#a_qtamin").value = articolo.QuantitaMinima;
    document.querySelector("#a_udm").value = articolo.Udm;
    document.querySelector("#a_note").value = articolo.Note;
    document.querySelector("#a_catweb").value = articolo.CatalogoWeb;

    document.querySelector("#a_prd").value = articolo.idProduttore;
    document.querySelector("#a_tpl").value = articolo.idTipologia;
    document.querySelector("#a_loc").value = articolo.idLocazione;
}

function loadMovimento(movimento) {
    idMovimentoSelezionato = movimento.Id;
    document.querySelector("#m_cod").value = movimento.CodiceArticolo;
    document.querySelector("#m_qta").value = movimento.Quantita;
    document.querySelector("#m_caus").value = movimento.Causale;
    document.querySelector("#m_note").value = movimento.Note;
    document.querySelector("#m_dti").valueAsDate = new Date(movimento.DataInserimento);
}

function loadSituazione(articoli) {
    //popolo header tabella
    const tableHead = document.querySelector('Table thead');
    let headHTML = '<tr>';
    headHTML += '<th><div>Codice</div></th>';
    headHTML += '<th><div>Descrizione</div></th>';
    headHTML += '<th><div>Quantità</div></th>';
    headHTML += '<th><div>Udm</div></th>';
    headHTML += '<th><div>Tipologia</div></th>';
    headHTML += '<th><div>Produttore</div></th>';
    headHTML += '<th><div>Locazione</div></th>';
    headHTML += '<th><div>Note</div></th>';
    headHTML += '</tr>';

    //popolo body tabella
    let bodyHTML = "";
    const tableBody = document.querySelector('table tbody');
    if (articoli.length === undefined || articoli.length == 0) {
        bodyHTML = '<tr><td>Nessun articolo trovato</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>';
    } else {
        articoli.forEach(function ({ Codice, Descrizione, Quantita, Tipologia, Produttore, Udm, QuantitaMinima, Locazione, Note }) {
            if (Quantita < QuantitaMinima)
                bodyHTML += '<tr data-bs-toggle="offcanvas" onclick="clickArticolo(this)" data-bs-target="#canvasArticolo" class="table-warning">';
            else if (Quantita <= 0)
                bodyHTML += '<tr data-bs-toggle="offcanvas" onclick="clickArticolo(this) "data-bs-target="#canvasArticolo" class="table-danger">';
            else
                bodyHTML += '<tr data-bs-toggle="offcanvas" onclick="clickArticolo(this)" data-bs-target="#canvasArticolo">';
            bodyHTML += '<td class="s_cod">' + Codice + '</td>';
            bodyHTML += '<td>' + Descrizione + '</td>';
            bodyHTML += '<td class="s_qta">' + Quantita + '</td>';
            bodyHTML += '<td>' + Udm + '</td>';
            bodyHTML += '<td>' + Tipologia + '</td>';
            bodyHTML += '<td>' + Produttore + '</td>';
            bodyHTML += '<td>' + Locazione + '</td>';
            bodyHTML += '<td>' + Note + '</td>';
            bodyHTML += '</tr>';
        });
    }

    //inserisco html nella tabella
    tableHead.innerHTML = headHTML;
    tableBody.innerHTML = bodyHTML;
}

function loadMovimenti(movimenti) {
    //popolo header tabella
    const tableHead = document.querySelector('Table thead');
    let headHTML = '<tr>';
    headHTML += '<th class="cd"><div>Codice Articolo</div></th>';
    headHTML += '<th class="qt"><div>Data Inserimento</div></th>';
    headHTML += '<th class="tp"><div>Quantità</div></th>';
    headHTML += '<th class="prd"><div>Causale</div></th>';
    headHTML += '<th class="nt"><div>Note</div></th>';
    headHTML += '</tr>';

    //popolo body tabella
    let bodyHTML = "";
    const tableBody = document.querySelector('Table tbody');
    if (movimenti === undefined || movimenti.length == 0) {
        bodyHTML = '<tr><td>Nessun movimento trovato</td><td></td><td></td><td></td><td></td></tr>';
    } else {
        movimenti.forEach(function ({ Id, CodiceArticolo, Quantita, DataInserimento, Causale, Note, }) {
            if (Quantita < 0)
                bodyHTML += '<tr data-bs-toggle="offcanvas" onclick="clickMovimento(' + Id + ')" data-bs-target="#canvasMovimento" class="table-danger">';
            else if (Quantita > 0)
                bodyHTML += '<tr data-bs-toggle="offcanvas" onclick="clickMovimento(' + Id + ')" data-bs-target="#canvasMovimento" class="table-success">';
            else
                bodyHTML += '<tr data-bs-toggle="offcanvas" onclick="clickMovimento(' + Id + ')" data-bs-target="#canvasMovimento">';
            bodyHTML += '<td class="m_cod">' + CodiceArticolo + '</td>';
            bodyHTML += '<td class="m_dti">' + new Date(DataInserimento).toLocaleDateString() + '</td>';
            bodyHTML += '<td class="m_qta">' + Quantita + '</td>';
            bodyHTML += '<td class="m_caus">' + Causale + '</td>';
            bodyHTML += '<td class="m_note">' + Note + '</td>';
            bodyHTML += '</tr>';
        });
    }
    //inserisco html nella tabella
    tableHead.innerHTML = headHTML;
    tableBody.innerHTML = bodyHTML;
}

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

function navSituazione() {
    document.querySelector("#btnNuovoArticolo").classList.remove("d-none");
    document.querySelector("#btnNuovoMovimento").classList.add("d-none");
}

function navMovimenti() {
    document.querySelector("#btnNuovoArticolo").classList.add("d-none");
    document.querySelector("#btnNuovoMovimento").classList.remove("d-none");
}

function filtraTabella() {
    let filtro = document.getElementById("filtro").value.toLowerCase();
    let tr = document.getElementById("corpoTabella").getElementsByTagName("tr");
    for (let i = 0; i < tr.length; i++)
        if (tr[i].textContent.toLowerCase().indexOf(filtro) == -1)
            tr[i].style.display = "none";
        else
            tr[i].style.display = "";
}


// #region pagina Verifica Disponibilità
let iBtn = 0;
const reader = new FileReader();

function initVerificaDisponibilita() {
    reader.onload = function (event) {
        document.getElementById("btnVerificaDisponibilita").addEventListener('click', () => clickVerificaDisponibilita(convertiInJSON(event.target.result, false)));
        loadDistinta(convertiInJSON(event.target.result, true));
    };
}

function clickUploadDistinta() {

    document.querySelector("#btnVerificaDisponibilita").removeAttribute("disabled");
    document.querySelector("#btnEsportaCSV").classList.add("disabled");
    let file = document.querySelector("#importFileDistinta").files[0];
    reader.readAsText(file);
}

function loadDistinta(dati) {
    //popolo body tabella
    let bodyHTML = "";
    const tableBody = document.querySelector('table tbody');
    let i = 0;
    dati.forEach(function ({ codice, descrizione, quantita, quantitaMagazzino, disponibilita }) {
        i++;
        if (quantitaMagazzino == -1)
            bodyHTML += '<tr class="table-danger">';
        else if (quantitaMagazzino < quantita)
            bodyHTML += '<tr class="table-warning">';
        else if (quantitaMagazzino == "da verificare")
            bodyHTML += '<tr>';
        else
            bodyHTML += '<tr class="table-success">';
        bodyHTML += '<td>' + i + '</td>';
        bodyHTML += '<td id="codice' + i + '">' + codice + '</td>';
        bodyHTML += '<td>' + descrizione + '</td>';
        bodyHTML += '<td id="qta' + i + '">' + quantita + '</td>';
        if (quantitaMagazzino == -1)
            bodyHTML += '<td id="qtaMag' + i + '"></td>';
        else
            bodyHTML += '<td id="qtaMag' + i + '">' + quantitaMagazzino + '</td>';
        //bodyHTML += '<td>' + disponibilita + '</td>';
        if (quantitaMagazzino != "da verificare" && quantita <= quantitaMagazzino)
            bodyHTML += '<td><button id="btnScaloAutomatico' + i + '" type="button" class="btn btn-info" onClick="clickScaloAutomatico(' + i + ')" data-bs-toggle="modal" data-bs-target="#modalScaloAutomatico">Scala</button><button type="button" id="btnAnnullaScaloAutomatico' + i + '" onClick="clickAnnullaScaloAutomatico(' + i + ')" class="btn btn-warning d-none">Annulla</button></td>';
        else
            bodyHTML += '<td>' + disponibilita + '</td>';
        bodyHTML += '</tr>';
    });

    //inserisco html nella tabella
    tableBody.innerHTML = bodyHTML;
}

function convertiInJSON(file, esteso) {
    const json = new Array();
    let righe = file.split("\r\n");
    righe.forEach(riga => {
        let campi = riga.split(";");
        if (esteso)
            json.push({ codice: campi[0], descrizione: campi[1], quantita: campi[2], quantitaMagazzino: "da verificare", disponibilita: "da verificare" });
        else
            json.push({ codice: campi[0], descrizione: campi[1], quantita: campi[2] });
    });
    return json;
}

function clickVerificaDisponibilita(json) {
    fetch(API_HOST + '/verificaDisponibilita', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(json)
    }).then(response => Promise.resolve(response.text())
        .then(dati => {
            if (response.status != 200)
                toastFeedback("Problema!", dati, response.status);
            else {
                document.querySelector("#btnEsportaCSV").classList.remove("disabled");;
                preparaDownloadCSV(JSON.parse(dati));
                loadDistinta(JSON.parse(dati));
            }
        })
    );
}

function preparaDownloadCSV(dati) {
    let stringa = "";
    dati.forEach(function ({ codice, descrizione, quantita, quantitaMagazzino, disponibilita }) {
        stringa += codice + ";" + descrizione + ";" + quantita + ";" + quantitaMagazzino + ";" + disponibilita + "\r\n"
    });
    let a = document.getElementById("btnEsportaCSV");
    let file = new Blob([stringa], { type: 'text/plain' });
    a.href = URL.createObjectURL(file);
    a.download = 'DistintaVerificata.csv';
}

function clickScaloAutomatico(i) {
    iBtn = i
    document.getElementById("bodyCodiceArticolo").innerHTML = "Codice Articolo: <strong>" + document.getElementById("codice" + iBtn).textContent + "</strong>";
    document.getElementById("bodyQuantita").innerHTML = "Quantita: <strong>" + parseFloat(document.getElementById("qta" + iBtn).textContent) * -1 + "</strong>";
}

function clickAnnullaScaloAutomatico(i) {
    iBtn = i
    fetch(API_HOST + '/movimenti/' + encodeURIComponent(document.getElementById("btnAnnullaScaloAutomatico" + iBtn).value), {
        method: "DELETE",
        headers: { 'Content-Type': 'application/json' }
    }).then(response => Promise.resolve(response.text())
        .then(dati => {
            if (response.status != 200)
                toastFeedback("Problema!", dati, response.status);
            else {
                document.getElementById("btnAnnullaScaloAutomatico" + iBtn).classList.add("d-none");
                document.getElementById("btnScaloAutomatico" + iBtn).classList.remove("d-none");
                toastFeedback("Movimento eliminato", "Hai rimosso con successo il movimento " + document.getElementById("btnAnnullaScaloAutomatico" + iBtn).value, 200);
                document.getElementById("qtaMag" + iBtn).textContent = parseFloat(document.getElementById("qtaMag" + iBtn).textContent) + parseFloat(document.getElementById("qta" + iBtn).textContent);
            }
        })
    );
}

function clickConfermaScaloAutomatico() {
    const d = new Date();
    let valoriCampi = JSON.stringify({
        codice: document.getElementById("codice" + iBtn).textContent
        , quantita: parseFloat(document.getElementById("qta" + iBtn).textContent) * -1
        , dataInserimento: d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate()
        , note: ""
        , causale: ""
    });

    fetch(API_HOST + '/movimenti/', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: valoriCampi
    }).then(response => Promise.resolve(response.text())
        .then(dati => {
            if (response.status != 200) {
                toastFeedback("Problema!", dati, response.status);
            } else {
                document.getElementById("btnAnnullaScaloAutomatico" + iBtn).value = JSON.parse(dati)[0].Id;
                toastFeedback("Articolo Scalato", "Hai aggiunto con successo il movimento dell'articolo " + document.getElementById("codice" + iBtn).textContent, 200);
                document.getElementById("btnAnnullaScaloAutomatico" + iBtn).classList.remove("d-none");
                document.getElementById("btnScaloAutomatico" + iBtn).classList.add("d-none");
                document.getElementById("qtaMag" + iBtn).textContent = parseFloat(document.getElementById("qtaMag" + iBtn).textContent) - parseFloat(document.getElementById("qta" + iBtn).textContent) * -1;
            }
        })
    );
}

// #endregion