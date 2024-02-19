import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./feature/usersSlice";

const store = configureStore({
  reducer: {
    userKey: userSlice,
  },
});

export default store;
