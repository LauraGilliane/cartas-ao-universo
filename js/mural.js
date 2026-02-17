import { db } from './firebase.js';
import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const container = document.getElementById("cards-container");

// pega cap da URL
const urlParams = new URLSearchParams(window.location.search);
const capLiberado = urlParams.get("cap");

async function loadCapitulos() {
  try {
    const snapshot = await getDocs(collection(db, "capitulos"));

    const capitulos = snapshot.docs.map(doc => doc.data());

    capitulos.sort((a, b) => a.numero - b.numero);

    capitulos.forEach(cap => {
      const card = document.createElement("a");
      card.classList.add("card");
      card.textContent = cap.titulo;

      // 👇 REGRA NOVA
      if (capLiberado == cap.numero) {
        card.href = `capitulo.html?cap=${cap.numero}`;
      } else {
        card.classList.add("locked");
        card.href = "#";
      }

      container.appendChild(card);
    });

  } catch (error) {
    console.error("Erro ao carregar capítulos:", error);
  }
}

loadCapitulos();
