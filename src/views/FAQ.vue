<template>
    <div class="faq-page">
      <h1>FAQ – Häufige Fragen</h1>
  
      <div class="faq-item" v-for="(faq, i) in faqs" :key="i">
        <button @click="toggle(i)" class="faq-question">
          {{ faq.question }}
        </button>
        <p v-if="faq.open" class="faq-answer">
          {{ faq.answer }}
        </p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "FAQ",
    data() {
      return {
        faqs: [
          {
            question: "Wie funktioniert die Spar-App?",
            answer:
              "Du kannst Sparziele erstellen, Ausgaben tracken und Achievements freischalten.",
            open: false,
          },
          {
            question: "Kostet die App etwas?",
            answer:
              "Nein, die Grundfunktionen sind komplett kostenlos.",
            open: false,
          },
          {
            question: "Wo werden meine Daten gespeichert?",
            answer:
              "Deine Daten werden sicher verschlüsselt und DSGVO-konform gespeichert.",
            open: false,
          },
          {
            question: "Wie lösche ich mein Konto?",
            answer:
              "Kontolöschung kannst du im Menü unter 'Einstellungen' → 'Konto löschen' durchführen.",
            open: false,
          },
          {
            question: "Kann ich mehrere Sparziele erstellen?",
            answer:
              "Ja, du kannst beliebig viele Ziele anlegen.",
            open: false,
          }
        ],
      };
    },
    methods: {
      toggle(i) {
        this.faqs[i].open = !this.faqs[i].open;
      },
    },
  };
  </script>
  
  <style scoped>
  .faq-page {
    padding: 30px;
    max-width: 800px;
    margin: auto;
  }
  
  .faq-item {
    margin-bottom: 15px;
  }
  
  .faq-question {
    width: 100%;
    padding: 15px;
    background: #1f1f1f;
    color: #fff;
    border: none;
    border-radius: 8px;
    text-align: left;
    cursor: pointer;
  }
  
  .faq-answer {
    margin-top: 10px;
    padding: 10px;
    background: #ececec;
    border-radius: 8px;
  }
  </style>
  