<template>
    <div class="message-box" :style="backgroundStyle">
        <p class="tip-text">{{ currentTip }}</p>
    </div>
</template>
    
    
<script>
export default {
    name: "tipps-message-box",
    data() {
        return {
            tips: [
                "Lege jeden Monat mindestens 10% deines Einkommens zur Seite.",
                "Erstelle ein Haushaltsbudget und halte dich daran.",
                "Vermeide unnötige Schulden, besonders Konsumentenkredite.",
                "Setze dir klare Sparziele für die nächsten 1–5 Jahre.",
                "Baue einen Notfallfonds mit 3–6 Monatsausgaben auf.",
                "Vergleiche Preise, bevor du größere Anschaffungen machst.",
                "Nutze Studentenvorteile und Rabatte, solange du kannst.",
                "Lerne die Grundlagen von ETFs und Aktien kennen.",
                "Vermeide spontane Impulskäufe – schlafe eine Nacht darüber.",
                "Achte auf wiederkehrende Abos und kündige unnötige.",
                "Begrenze Ausgaben für Freizeit, ohne auf Spaß zu verzichten.",
                "Investiere früh für den Zinseszinseffekt.",
                "Nutze Cashback- und Bonusprogramme sinnvoll.",
                "Führe ein Ausgabenbuch, um Überblick zu behalten.",
                "Stelle Rücklagen für deine jährliche Steuererklärung bereit."
            ],
            currentIndex: 0,
            intervalId: null
        };
    },
    computed: {
        currentTip() {
            return this.tips[this.currentIndex];
        },
        backgroundStyle() {
            return {
                background: "linear-gradient(135deg, #3b82f6, #0db37d)",
                padding: "20px",
                borderRadius: "12px",
                color: "#000",
                fontSize: "18px",
                transition: "opacity 1s ease-in-out",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                textAlign: "center"
            };
        }
    },
    mounted() {
        this.intervalId = setInterval(() => {
            this.currentIndex = (this.currentIndex + 1) % this.tips.length;
        }, 10000);
    },
    beforeUnmount() {
      clearInterval(this.intervalId);
    }
};
</script>
    
<style scoped>
.message-box {
opacity: 1;
}
.tip-text {
font-weight: 600;
color: white;
}
</style>