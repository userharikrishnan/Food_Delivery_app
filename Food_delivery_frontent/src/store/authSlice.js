import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isInitialized: false,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      window.localStorage.setItem("user", JSON.stringify(action.payload));
      state.isInitialized = true;
    },
    removeUser: (state) => {
      state.user = null;
      window.localStorage.removeItem("user");
      state.isInitialized = true;
    },
    setUserFromLocalStorage: (state) => {
      const user = window.localStorage.getItem("user");
      state.user = user ? JSON.parse(user) : null;
      state.isInitialized = true;
    },
  },
});

export const { setUser, removeUser, setUserFromLocalStorage } = authSlice.actions;
export default authSlice.reducer;
