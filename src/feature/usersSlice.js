import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const userState = {
  updateState: false,
  loading: false,
  usersList: [],
  error: "",
  response: "",
};

export const fetchUsers = createAsyncThunk("user/fetchUsers", async () => {
  const response = await axios.get(
    "https://jsonplaceholder.typicode.com/users"
  );
  return response.data.response;
});

export const addUser = createAsyncThunk("user/addUser", async (data) => {
  const {
    name,
    username,
    email,
    street,
    suite,
    city,
    zipcode,
    phone,
    companyName,
  } = data;
  const response = await axios.post(
    "https://jsonplaceholder.typicode.com/users",
    {
      id: Math.random().toString,
      name,
      username,
      email,
      address: {
        street,
        suite,
        city,
        zipcode,
        geo: {
          lat: -37.3159,
          lng: 81.1496,
        },
      },
      phone,
      website: "hildegard.org",
      company: {
        name: companyName,
        catchPhrase: "Multi-layered client-server neural-net",
        bs: "harness real-time e-markets",
      },
    }
  );
  return response.data.response;
});

export const removeUser = createAsyncThunk("user/removeUser", async (data) => {
  const response = await axios.delete(
    `https://jsonplaceholder.typicode.com/users/${data}`
  );
  return response.data.response;
});

export const modifiedUser = createAsyncThunk(
  "user/modifiedUser",
  async (data) => {
    const {
      name,
      username,
      email,
      street,
      suite,
      city,
      zipcode,
      phone,
      companyName,
    } = data;
    const response = await axios.put(
      `https://jsonplaceholder.typicode.com/users/${data.id}`,
      {
        name,
        username,
        email,
        street,
        suite,
        city,
        zipcode,
        phone,
        companyName,
      }
    );
    return response.data.response;
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: userState,
  reducers: {
    changeStateTrue: (state) => {
      state.updateState = true;
    },
    changeStateFalse: (state) => {
      state.updateState = false;
    },
    clearResponse: (state) => {
      state.response = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.loading = false;
        state.usersList.push(action.payload);
        state.response = "add";
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    builder
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.usersList = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.error = action.error.message;
      });

    builder.addCase(removeUser.fulfilled, (state, action) => {
      state.usersList = state.usersList.filter(
        (item) => item._id !== action.payload
      );
      state.response = "delete";
    });

    builder.addCase(modifiedUser.fulfilled, (state, action) => {
      const updateItem = action.payload;
      console.log(updateItem);
      const index = state.usersList.findIndex(
        (item) => item._id === updateItem._id
      );
      if (index !== -1) {
        state.usersList[index] = updateItem;
      }
      state.response = "update";
    });
  },
});

export default userSlice.reducer;
export const { changeStateTrue, changeStateFalse, clearResponse } =
  userSlice.actions;
