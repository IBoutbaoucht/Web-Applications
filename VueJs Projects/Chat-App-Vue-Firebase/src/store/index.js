/* eslint-disable */
import { createStore } from "vuex";

export default createStore({
  state: {
    user: null,
    darkMode: false,
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
    SET_DARK_MODE(state, isDark) {
      state.darkMode = isDark;
    },
  },
  actions: {
    setUser({ commit }, user) {
      commit("SET_USER", user);
    },
    setDarkMode({ commit }, isDark) {
      commit("SET_DARK_MODE", isDark);
      localStorage.setItem("darkMode", isDark.toString());
      if (isDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.user,
    currentUser: (state) => state.user,
    isDarkMode: (state) => state.darkMode,
  },
});
