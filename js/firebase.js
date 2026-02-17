// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCRvJjxTMDu2P-ZStkkhRpj3Uj4oYOEMME",
  authDomain: "cartasaouniverso-bd58f.firebaseapp.com",
  projectId: "cartasaouniverso-bd58f",
  storageBucket: "cartasaouniverso-bd58f.firebasestorage.app",
  messagingSenderId: "782732505983",
  appId: "1:782732505983:web:1772dd7f70b8bc562ea04a",
  measurementId: "G-B5EWW9W1EF"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
