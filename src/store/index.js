import { createStore } from 'vuex';
import { currentUser } from './currentUser';

export default createStore({
  modules: {
    currentUser
  }
});