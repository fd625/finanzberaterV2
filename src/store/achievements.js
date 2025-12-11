export const achievements = {
    namespaced: true,
  
    state: () => ({
      achievements: [
        {
            id: 1,
            title: "Erste 100€ gespart",
            description: "Du hast die ersten 100€ erfolgreich gespart.",
            unlocked: false,
          },
          {
            id: 2,
            title: "Monatssparziel erreicht",
            description: "Du hast dein Sparziel erreicht.",
            unlocked: false,
          },
          {
            id: 3,
            title: "Notfallfonds aufgebaut",
            description: "Dein Notfallfonds steht.",
            unlocked: false,
          },
          {
            id: 4,
            title: "Investition gestartet",
            description: "Erste Investition getätigt!",
            unlocked: false,
          },
          {
            id: 5,
            title: "1 Woche ohne unnötige Ausgaben",
            description: "Du hast eine Woche nichts unnötiges gekauft!",
            unlocked: false,
          },
          {
            id: 6,
            title: "Cashback genutzt",
            description: "Cashback erfolgreich genutzt.",
            unlocked: false,
          },
          {
            id: 7,
            title: "Erstes Budget erstellt",
            description: "Erstes Budget erfolgreich angelegt.",
            unlocked: false,
          },
          {
            id: 8,
            title: "Abo-Falle entkommen",
            description: "Ein unnötiges Abo gekündigt.",
            unlocked: false,
          },
          {
            id: 9,
            title: "Spar-Challenge abgeschlossen",
            description: "Challenge abgeschlossen!",
            unlocked: false,
          },
          {
            id: 10,
            title: "Spontankauf widerstanden",
            description: "Du hast dem Drang widerstanden, etwas zu kaufen.",
            unlocked: false,
          },
          {
            id: 11,
            title: "Zweites Einkommen gefunden",
            description: "Neue Einnahmequelle gefunden.",
            unlocked: false,
          },
          {
            id: 12,
            title: "Monatsvergleich erstellt",
            description: "Ausgaben miteinander verglichen.",
            unlocked: false,
          },
          {
            id: 13,
            title: "Sparrate erhöht",
            description: "Du sparst jetzt mehr.",
            unlocked: false,
          },
          {
            id: 14,
            title: "Wunschziel erreicht",
            description: "Ein persönliches Sparziel erreicht!",
            unlocked: false,
          },
      ],
    }),
  
    mutations: {
        UNLOCK(state, id) {
            const achievement = state.achievements.find(a => a.id === id);
            if (!achievement) return; // Absicherung
            achievement.unlocked = true;
        },
        RESET_ALL(state) {
            state.achievements.forEach((a) => (a.unlocked = false));
        },
        SET(state, achievements) {
            state.achievements = achievements;
        },
    },
  
    actions: {
      unlock({ commit, dispatch }, index) {
        commit("UNLOCK", index);
        dispatch("save");
      },
  
      resetAll({ commit, dispatch }) {
        commit("RESET_ALL");
        dispatch("save");
      },
  
      save({ state }) {
        localStorage.setItem("achievements", JSON.stringify(state.achievements));
      },
  
      load({ commit }) {
        const data = localStorage.getItem("achievements");
        if (data) {
          commit("SET", JSON.parse(data));
        }
      },
    },
  
    getters: {
      all: (state) => state.achievements,
      unlockedCount: (state) =>
        state.achievements.filter((a) => a.unlocked).length,
      progressPercent: (state, getters) =>
        Math.round((getters.unlockedCount / state.achievements.length) * 100),
    },
  };