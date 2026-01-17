const daten = {
  thema1: [
    { id: "t1-1", frage: "Was bedeutet Vorfahrt?", antwort: "Andere Verkehrsteilnehmer dürfen zuerst fahren." },
    { id: "t1-2", frage: "Was bedeutet Vorfahrt gewähren?", antwort: "Ich muss warten." },
    { id: "t1-3", frage: "Wann gilt rechts vor links?", antwort: "Wenn keine andere Regelung vorhanden ist." }
  ],
  thema2: [],
  thema3: [],
  thema4: []
};

let aktuelleKarten = [];
let aktuellePosition = 0;

function themaWechseln() {
  const thema = document.getElementById("themaSelect").value;
  aktuelleKarten = thema === "alle"
    ? Object.values(daten).flat()
    : daten[thema];

  aktuellePosition = 0;
  zeigeKarte();
}

function zeigeKarte() {
  if (aktuelleKarten.length === 0) {
    document.getElementById("frage").innerText = "Keine Karten vorhanden";
    document.getElementById("antwort").style.display = "none";
    document.getElementById("kartenInfo").innerText = "";
    document.getElementById("lernStatusInfo").innerText = "";
    return;
  }

  const karte = aktuelleKarten[aktuellePosition];
  document.getElementById("frage").innerText = karte.frage;
  document.getElementById("antwort").innerText = karte.antwort;
  document.getElementById("antwort").style.display = "none";

  document.getElementById("kartenInfo").innerText =
    `Karte ${aktuellePosition + 1} von ${aktuelleKarten.length}`;

  const status = JSON.parse(localStorage.getItem("gelerntStatus")) || {};
  const stufe = status[karte.id] || 0;

  document.getElementById("lernStatusInfo").innerText =
    stufe === 0 ? "Status: Nicht gelernt"
    : stufe === 1 ? "Status: Gelernt"
    : "Status: Sicher gelernt";
}

function naechsteKarte() {
  aktuellePosition = (aktuellePosition + 1) % aktuelleKarten.length;
  zeigeKarte();
}

function zufallsKarte() {
  const status = JSON.parse(localStorage.getItem("gelerntStatus")) || {};
  let pool = [];

  aktuelleKarten.forEach((karte, index) => {
    const stufe = status[karte.id] || 0;
    const gewicht = stufe === 0 ? 5 : stufe === 1 ? 2 : 1;
    for (let i = 0; i < gewicht; i++) pool.push(index);
  });

  aktuellePosition = pool[Math.floor(Math.random() * pool.length)];
  zeigeKarte();
}

function antwortZeigen() {
  const a = document.getElementById("antwort");
  a.style.display = a.style.display === "none" ? "block" : "none";
}

function gelernt() {
  const status = JSON.parse(localStorage.getItem("gelerntStatus")) || {};
  const id = aktuelleKarten[aktuellePosition].id;
  status[id] = Math.min((status[id] || 0) + 1, 2);
  localStorage.setItem("gelerntStatus", JSON.stringify(status));
  zeigeKarte();
}

function gelerntZuruecksetzen() {
  const status = JSON.parse(localStorage.getItem("gelerntStatus")) || {};
  delete status[aktuelleKarten[aktuellePosition].id];
  localStorage.setItem("gelerntStatus", JSON.stringify(status));
  zeigeKarte();
}

function geheZuKarte() {
  const n = parseInt(document.getElementById("kartenNummer").value);
  if (n >= 1 && n <= aktuelleKarten.length) {
    aktuellePosition = n - 1;
    zeigeKarte();
  }
}

themaWechseln();
