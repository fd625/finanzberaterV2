<template>
  <div class="home">
    <authMessageBox v-if="!isAuthenticated" />
    <div v-else>
      <h2>Statistiken - Dein Überblick!</h2>
      <h6>
        Hier bekommst du alle wichtigen Einblicke zu deinen Ausgaben, Verträgen und deinem verfügbaren Budget. Die Statistiken zeigen dir auf einen Blick, was wirklich zählt, wo dein Geld hingeht und wo Sparpotenzial steckt – übersichtlich, verständlich und immer aktuell.
      </h6>
      <tipps-message-box />
      <div class="card__container">
        <div class="card --bar">
          <h5>Deine wichtigsten Verträge im Überblick:</h5>
          <h6>
            Diese Statistik zeigt dir, welche deiner Verträge und Abos am wichtigsten sind. Anhand der festgelegten Wichtigkeit erkennst du schnell, auf welche Ausgaben du verzichten kannst.
          </h6>
          <Chart 
            type="bar" 
            :data="barChartData" 
            :options="barChartOptions" 
            style="height: 350px" 
          />
        </div>
        <div class="card --pie">
          <h5>Budgetverteilung:</h5>
          <h6>
            „Dieses Diagramm zeigt dir, wie sich deine gesamten Ausgaben im Verhältnis zu deinem verbleibenden Budget verteilen. So erkennst du auf einen Blick, wie viel Geld für Verpflichtungen draufgeht – und wie viel wirklich übrig bleibt.“
          </h6>
          <div style="display: flex; justify-content: center;">
            <Chart 
              style="height: 350px"
              type="pie" 
              :data="pieChartData" 
              :options="pieChartOptions" 
              class="pie"
            />
          </div>
        </div>
      </div>
      <div>
        <Achievements />
      </div>
    </div>
  </div>
</template>

<script>
import Chart from "primevue/chart";
import contractManager from "../services/contractManager";
import { mapGetters, mapActions } from "vuex";
import tippsMessageBox from "../components/tipps-message-box.vue";
import authMessageBox from "../components/auth-message-box.vue";
import Achievements from "../components/Achievements.vue";

export default {
    name: "StatisticsView", // Changed to multi-word
    components: {
        Chart,
        tippsMessageBox,
        authMessageBox,
        Achievements
    },
    data() {
        return {
            barChartData: null,
            barChartOptions: null,
            pieChartData: null,
            pieChartOptions: null,
            contracts: [],
            pie: {
                labels: [],
                data: []
            },
            bar: {
                labels: [],
                data: []
            }
        };
    },
    computed: { // Moved computed before mounted
        ...mapGetters("currentUser", ["remainingSalary","isAuthenticated"]),
        remainingSalary() {
            return this.$store.getters["currentUser/remainingSalary"];
        }
    },
    created() {
        this.checkAuthState();
    },
    mounted() {
        this.loadContracts();
    },
    methods: {
        ...mapActions("currentUser", ["checkAuthState"]),
        setData() {
            this.formatData();
            this.barChartData = this.setBarChartData();
            this.barChartOptions = this.setBarChartOptions();
            this.pieChartData = this.setPieChartData();
            this.pieChartOptions = this.setPieChartOptions();
        },
        formatData() {
            this.contracts.forEach(x => {
                this.pie.labels.push(x.company);
                this.bar.labels.push(x.company);
                this.pie.data.push(x.amount);
                this.bar.data.push(x.importance);
            });
            // Removed console.log
            this.pie.labels.push("Restliches Gehalt");
            this.pie.data.push(this.remainingSalary);
        },
        async loadContracts() {
            this.loading = true;
            try {
                this.contracts = await contractManager.getAllContracts();
                this.setData();
            } catch (err) {
                console.error("Fehler beim Laden der Verträge:", err);
            } finally {
                this.loading = false;
            }
        },
        setPieChartData() {
            const documentStyle = getComputedStyle(document.body);
            return {
                labels: this.pie.labels,
                datasets: [
                    {
                        data: this.pie.data,
                        backgroundColor: [
                            documentStyle.getPropertyValue("--p-cyan-500"),
                            documentStyle.getPropertyValue("--p-orange-500"),
                            documentStyle.getPropertyValue("--p-gray-400"),
                            documentStyle.getPropertyValue("--p-red-400"),
                            documentStyle.getPropertyValue("--p-blue-400"),
                            documentStyle.getPropertyValue("--p-green-400")
                        ],
                        hoverBackgroundColor: [
                            documentStyle.getPropertyValue("--p-cyan-500"),
                            documentStyle.getPropertyValue("--p-orange-500"),
                            documentStyle.getPropertyValue("--p-gray-400"),
                            documentStyle.getPropertyValue("--p-red-400"),
                            documentStyle.getPropertyValue("--p-blue-400"),
                            documentStyle.getPropertyValue("--p-green-400")
                        ]
                    }
                ]
            };
        },
        setPieChartOptions() {
            const documentStyle = getComputedStyle(document.documentElement);
            const textColor = documentStyle.getPropertyValue("--p-text-color");

            return {
                plugins: {
                    legend: {
                        labels: {
                            usePointStyle: true,
                            color: textColor
                        }
                    }
                }
            };
        },
        setBarChartData() {
            const documentStyle = getComputedStyle(document.documentElement);

            return {
                labels: this.bar.labels,
                datasets: [
                    {
                        label: "Relevanz",
                        backgroundColor: [
                            documentStyle.getPropertyValue("--p-cyan-500"),
                            documentStyle.getPropertyValue("--p-orange-500"),
                            documentStyle.getPropertyValue("--p-gray-400"),
                            documentStyle.getPropertyValue("--p-red-400"),
                            documentStyle.getPropertyValue("--p-blue-400"),
                            documentStyle.getPropertyValue("--p-green-400")
                        ],
                        borderColor: documentStyle.getPropertyValue("--p-cyan-500"),
                        data: this.bar.data
                    }
                ]
            };
        },
        setBarChartOptions() {
            const documentStyle = getComputedStyle(document.documentElement);
            const textColor = documentStyle.getPropertyValue("--p-text-color");
            const textColorSecondary = documentStyle.getPropertyValue("--p-text-muted-color");
            const surfaceBorder = documentStyle.getPropertyValue("--p-content-border-color");

            return {
                indexAxis: "y",
                maintainAspectRatio: false,
                aspectRatio: 0.8,
                plugins: {
                    legend: {
                        labels: {
                            color: textColor
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: textColorSecondary,
                            font: {
                                weight: 500
                            }
                        },
                        grid: {
                            display: false,
                            drawBorder: false
                        }
                    },
                    y: {
                        ticks: {
                            color: textColorSecondary
                        },
                        grid: {
                            color: surfaceBorder,
                            drawBorder: false
                        }
                    }
                }
            };
        }
    }
};
</script>
<style lang="scss" scoped>
.card {
    margin: 0.5rem;
    box-shadow: 0 0 5px rgb(208, 208, 208);
    border-radius: 10px;
    padding: 10px 30px;
    &.--bar {
        width: 50%;
    }
    &.--pie {
        width: 50%;

    }
    &__container {
        display: flex;
        flex-direction: row;
        
    }

}
h6 {
   font-weight: 400;
}

</style>