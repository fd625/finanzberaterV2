import { describe, it, expect, beforeEach, vi } from "vitest";
import { createStore } from "vuex";
import { achievements } from "../../src/store/achievements";

describe("Achievements Store", () => {
    let store;

    beforeEach(() => {
        store = createStore({
            modules: {
                achievements: {
                    ...achievements,
                    namespaced: true
                }
            }
        });
    
        // Clear localStorage mock
        vi.clearAllMocks();
    });

    it("should have initial state with 14 locked achievements", () => {
        const state = store.state.achievements;
        expect(state.achievements).toHaveLength(14);
        expect(state.achievements.every(a => !a.unlocked)).toBe(true);
    });

    it("should unlock an achievement by id", () => {
        store.commit("achievements/UNLOCK", 1);
    
        const achievement = store.state.achievements.achievements.find(a => a.id === 1);
        expect(achievement.unlocked).toBe(true);
    });

    it("should reset all achievements", () => {
    // Unlock some achievements first
        store.commit("achievements/UNLOCK", 1);
        store.commit("achievements/UNLOCK", 2);
    
        // Reset all
        store.commit("achievements/RESET_ALL");
    
        const allLocked = store.state.achievements.achievements.every(a => !a.unlocked);
        expect(allLocked).toBe(true);
    });

    it("should calculate unlocked count correctly", () => {
        store.commit("achievements/UNLOCK", 1);
        store.commit("achievements/UNLOCK", 2);
        store.commit("achievements/UNLOCK", 3);
    
        const unlockedCount = store.getters["achievements/unlockedCount"];
        expect(unlockedCount).toBe(3);
    });

    it("should calculate progress percent correctly", () => {
    // Unlock 7 out of 14 achievements (50%)
        for (let i = 1; i <= 7; i++) {
            store.commit("achievements/UNLOCK", i);
        }
    
        const progress = store.getters["achievements/progressPercent"];
        expect(progress).toBe(50);
    });

    it("should get all achievements", () => {
        const all = store.getters["achievements/all"];
        expect(all).toHaveLength(14);
        expect(all[0]).toHaveProperty("id");
        expect(all[0]).toHaveProperty("title");
        expect(all[0]).toHaveProperty("description");
        expect(all[0]).toHaveProperty("unlocked");
    });
});
