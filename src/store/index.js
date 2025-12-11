import { createStore } from 'vuex';
import { currentUser } from './currentUser';
import { achievements } from "./achievements"

export default createStore({
  modules: {
    currentUser,
    achievements
  }
});