<template>
  <div class="achievements-container">
    <h2>Deine Spar-Achievements</h2>

    <div class="cards">
      <div
        v-for="achievement in all"
        :key="achievement.id"
        class="card"
        :class="{
          locked: !achievement.unlocked,
          [`bg-${achievement.id}`]: achievement.unlocked
        }"
        @click="openModal(achievement.id)"
      >
        <h3>{{ achievement.title }}</h3>
        <p>{{ achievement.description }}</p>
      </div>
    </div>

    <!-- MODAL -->
    <div
      v-if="showModal"
      class="modal-overlay"
      @click="closeModal"
    >
      <div class="modal" @click.stop>
        <h3>{{ currentAchievement?.title }}</h3>
        <p>Hast du dieses Achievement geschafft?</p>

        <div class="modal-buttons">
          <button class="yes" @click="unlockAchievement">Ja</button>
          <button class="no" @click="closeModal">Nein</button>

          <!-- Reset Button nur, wenn Achievement unlocked ist -->
          <button
            v-if="currentAchievement?.unlocked"
            class="reset"
            @click="lockAchievement"
          >
            Zurücksetzen
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "AchievementsView",
  data() {
    return {
      showModal: false,
      selectedId: null
    };
  },
  computed: {
    ...mapGetters("achievements", ["all", "progressPercent"]),
    currentAchievement() {
      if (!this.selectedId) return null;
      return this.all.find(a => a.id === this.selectedId);
    }
  },
  created() {
    this.$store.dispatch("achievements/load");
  },
  methods: {
    ...mapActions("achievements", ["unlock", "lock"]),

    openModal(id) {
      this.selectedId = id;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.selectedId = null;
    },

    unlockAchievement() {
      if (this.selectedId !== null) {
        this.unlock(this.selectedId);
      }
      this.closeModal();
    },

    lockAchievement() {
      if (this.selectedId !== null) {
        this.lock(this.selectedId);
      }
      this.closeModal();
    }
  }
};
</script>

<style lang="scss" scoped>
.achievements-container {
  width: 100%;
  padding: 20px;

  h2 {
    text-align: center;
    margin-bottom: 20px;
  }

  .cards {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;

    .card {
      flex: 1 1 200px;
      max-width: 250px;
      min-height: 150px;
      border-radius: 12px;
      padding: 20px;
      color: white;
      cursor: pointer;

      transition: transform 0.3s ease, box-shadow 0.3s ease, filter 0.3s ease;

      &:hover {
        transform: translateY(-5px);
      }

      &.locked {
        background: linear-gradient(135deg, #555, #333);
        filter: grayscale(0.8);
      }

      /* Farbverläufe */
      &.bg-1 { background: linear-gradient(135deg, #4facfe, #00f2fe); }
      &.bg-2 { background: linear-gradient(135deg, #43e97b, #38f9d7); }
      &.bg-3 { background: linear-gradient(135deg, #fa709a, #fee140); }
      &.bg-4 { background: linear-gradient(135deg, #f83600, #f9d423); }
      &.bg-5 { background: linear-gradient(135deg, #8e2de2, #4a00e0); }
      &.bg-6 { background: linear-gradient(135deg, #30cfd0, #330867); }
      &.bg-7 { background: linear-gradient(135deg, #ff9966, #ff5e62); }
      &.bg-8 { background: linear-gradient(135deg, #56ccf2, #2f80ed); }
      &.bg-9 { background: linear-gradient(135deg, #11998e, #38ef7d); }
      &.bg-10 { background: linear-gradient(135deg, #fc5c7d, #6a82fb); }
      &.bg-11 { background: linear-gradient(135deg, #f093fb, #f5576c); }
      &.bg-12 { background: linear-gradient(135deg, #4e54c8, #8f94fb); }
      &.bg-13 { background: linear-gradient(135deg, #c471ed, #f64f59); }
      &.bg-14 { background: linear-gradient(135deg, #00c6ff, #0072ff); }
    }
  }
}

.modal-overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: white;
  padding: 25px;
  border-radius: 10px;
  text-align: center;
  width: 300px;
}

.modal-buttons {
  margin-top: 20px;
  display: flex;
  justify-content: space-around;

  .yes {
    background: #4caf50;
    padding: 10px 20px;
    border-radius: 8px;
    color: white;
    border: none;
  }

  .no {
    background: #f44336;
    padding: 10px 20px;
    border-radius: 8px;
    color: white;
    border: none;
  }

  .reset {
    background: #888;
    padding: 10px 20px;
    border-radius: 8px;
    color: white;
    border: none;
  }
}
</style>
