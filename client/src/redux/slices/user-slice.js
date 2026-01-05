import { apiCLient } from "@/api/apiClient";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import userPlaceholderImage from "@/assets/user/user-placeholder.jpg";

const initialState = {
  // basic user info (can be expanded later)
  id: null,
  username: null,
  email: null,
  fullName: null,

  // avatar for UI
  profileImageUrl: userPlaceholderImage,

  // async state
  loading: false,
  error: null,
};

export const uploadProfileImage = createAsyncThunk(
  "user/uploadProfileImage",
  async ({ formData }, { rejectWithValue }) => {
    try {
      const res = await apiCLient.post("/user/avatar-upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

export const fetchMe = createAsyncThunk(
  "user/fetchMe",
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiCLient.get("/user/me");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

const user = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      const user = action.payload;

      state.id = user.id || null;
      state.username = user.username || null;
      state.email = user.email || null;
      state.fullName = user.fullName || null;

      state.profileImageUrl = user.profilePicture || userPlaceholderImage;

      state.error = null;
    },
    clearUser() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadProfileImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadProfileImage.fulfilled, (state, action) => {
        state.loading = false;
        state.profileImageUrl = action.payload.url;
      })
      .addCase(uploadProfileImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        const user = action.payload;

        state.id = user.id;
        state.username = user.username;
        state.email = user.email;
        state.fullName = user.fullName;
        state.profileImageUrl = user.profilePicture || userPlaceholderImage;
      });
  },
});
export const { setUser, clearUser } = user.actions;
export default user.reducer;
