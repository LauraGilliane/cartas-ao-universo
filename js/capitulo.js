import { db } from "./firebase.js";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const params = new URLSearchParams(window.location.search);
const capNumero = params.get("cap");

const chapterTitle = document.getElementById("chapter-title");
const lettersList = document.getElementById("letters-list");
const submitBtn = document.getElementById("submit-btn");

const modal = document.getElementById("letter-modal");
const modalBody = document.getElementById("modal-body");
const closeModal = document.getElementById("close-modal");

const prevBtn = document.getElementById("prev-page");
const nextBtn = document.getElementById("next-page");
const pageInfo = document.getElementById("page-info");

let todasCartas = [];
let paginaAtual = 1;
const cartasPorPagina = 5;
// Inicializa Quill
const quill = new Quill("#editor", {
  theme: "snow"
});

async function loadCapitulo() {
  const docRef = doc(db, "capitulos", `cap${capNumero}`);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    document.body.innerHTML = "<p>Capítulo não encontrado.</p>";
    return;
  }

  const data = docSnap.data();

  if (!data.liberado) {
    document.body.innerHTML = "<p>Este capítulo ainda está bloqueado.</p>";
    return;
  }

  chapterTitle.textContent = data.titulo;

  loadCartas();
}

async function loadCartas() {
  const q = query(
    collection(db, "capitulos", `cap${capNumero}`, "cartas"),
    orderBy("data", "desc")
  );

  const snapshot = await getDocs(q);

  todasCartas = snapshot.docs.map(doc => doc.data());
  paginaAtual = 1;

  renderPagina();
}

function renderPagina() {
  lettersList.innerHTML = "";

  const inicio = (paginaAtual - 1) * cartasPorPagina;
  const fim = inicio + cartasPorPagina;

  const cartasPagina = todasCartas.slice(inicio, fim);

  let contadorGlobal = todasCartas.length - inicio;

  cartasPagina.forEach((carta, index) => {

    const numeroCarta = todasCartas.length - (inicio + index);

    const dataFormatada = carta.data
      ? new Date(carta.data.seconds * 1000).toLocaleDateString("pt-BR")
      : "";

    const div = document.createElement("div");
    div.classList.add("letter-card", "letter-item");

    div.innerHTML = `
      <div class="letter-left">
        <span class="letter-date">${dataFormatada}</span>
        <span class="letter-number">Carta ${numeroCarta}</span>
      </div>
      <button class="expand-btn">Visualizar</button>
    `;

    div.querySelector(".expand-btn").addEventListener("click", () => {
      modalBody.innerHTML = `
        <h3>Carta ${numeroCarta}</h3>
        <p><em>${dataFormatada}</em></p>
        <hr>
        ${carta.conteudo}
      `;
      modal.classList.remove("hidden");
    });

    lettersList.appendChild(div);
  });


  const totalPaginas = Math.ceil(todasCartas.length / cartasPorPagina);

  pageInfo.textContent = `Página ${paginaAtual} de ${totalPaginas}`;

  prevBtn.disabled = paginaAtual === 1;
  nextBtn.disabled = paginaAtual === totalPaginas;
}

prevBtn.addEventListener("click", () => {
  if (paginaAtual > 1) {
    paginaAtual--;
    renderPagina();
  }
});

nextBtn.addEventListener("click", () => {
  const totalPaginas = Math.ceil(todasCartas.length / cartasPorPagina);

  if (paginaAtual < totalPaginas) {
    paginaAtual++;
    renderPagina();
  }
});


// Fechar modal
closeModal.addEventListener("click", () => {
  modal.classList.add("hidden");
});

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.add("hidden");
  }
});


// Enviar carta
submitBtn.addEventListener("click", async () => {
  const conteudo = quill.root.innerHTML;

  if (conteudo.trim() === "<p><br></p>") {
    alert("Escreva algo antes de enviar.");
    return;
  }

  await addDoc(
    collection(db, "capitulos", `cap${capNumero}`, "cartas"),
    {
      conteudo: conteudo,
      data: new Date()
    }
  );

  quill.setText("");
  loadCartas();
});


loadCapitulo();
