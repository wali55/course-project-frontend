import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchAccessList = createAsyncThunk(
  "accessControl/fetchAccessList",
  async (inventoryId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/inventories/${inventoryId}/access`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch access list"
      );
    }
  }
);

export const searchUsers = createAsyncThunk(
  'accessControl/searchUsers',
  async ({ inventoryId, query }, {rejectWithValue}) => {
    if (!query || query.length < 2) {
        return [];
    }
    try {
        const response = await api.get(`/inventories/${inventoryId}/users/search?q=${query}&limit=10`);
    return response.data;
    } catch (error) {
        return rejectWithValue(
        error.response?.data?.message || "Failed to fetch search users"
      );
    }
  }
);

export const addUserAccess = createAsyncThunk(
  'accessControl/addUserAccess',
  async ({ inventoryId, userId, user }, {rejectWithValue}) => {
    try {
        const response = await api.post(`/inventories/${inventoryId}/access`, { userId, user });
    return response.data;
    } catch (error) {
        return rejectWithValue(
        error.response?.data?.message || "Failed to add user access"
      );
    }
    
  }
);

export const removeUserAccess = createAsyncThunk(
  'accessControl/removeUserAccess',
  async ({ inventoryId, accessId }, {rejectWithValue}) => {
    try {
        await api.delete(`/inventories/${inventoryId}/access/${accessId}`);
    return accessId;
    } catch (error) {
        return rejectWithValue(
        error.response?.data?.message || "Failed to remove user access"
      );
    }
  }
);

const accessControlSlice = createSlice({
  name: 'accessControl',
  initialState: {
    inventory: null,
    accessList: [],
    userSearchResults: [],
    loading: false,
    searchLoading: false,
    error: null,
    searchQuery: ''
  },
  reducers: {
    clearAccessList: (state) => {
      state.inventory = null;
      state.accessList = [];
      state.error = null;
    },
    clearUserSearch: (state) => {
      state.userSearchResults = [];
      state.searchQuery = '';
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccessList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccessList.fulfilled, (state, action) => {
        state.loading = false;
        state.inventory = action.payload.inventory;
        state.accessList = action.payload.accessList;
      })
      .addCase(fetchAccessList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(searchUsers.pending, (state) => {
        state.searchLoading = true;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.userSearchResults = action.payload;
      })
      .addCase(searchUsers.rejected, (state) => {
        state.searchLoading = false;
      })

      .addCase(addUserAccess.fulfilled, (state, action) => {
        state.accessList.push(action.payload);
        state.userSearchResults = [];
        state.searchQuery = '';
      })
      

      .addCase(removeUserAccess.fulfilled, (state, action) => {
        state.accessList = state.accessList.filter(access => access.id !== action.payload);
      });
  }
});

export const { clearAccessList, clearUserSearch, setSearchQuery } = accessControlSlice.actions;
export default accessControlSlice.reducer;