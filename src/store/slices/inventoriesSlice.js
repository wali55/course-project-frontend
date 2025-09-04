import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchInventories = createAsyncThunk(
  "inventories/fetchAll",
  async ({ page, pageSize, search, sortField, sortOrder, filters }, { rejectWithValue }) => {
    try {
      const cleanedFilters = {};
      if (filters.category !== "all") cleanedFilters.category = filters.category;
      if (filters.visibility !== "all") cleanedFilters.visibility = filters.visibility;
      if (filters.creator !== "all") cleanedFilters.creator = filters.creator;

      const response = await api.get("/inventories", {
        params: {
          page,
          pageSize,
          search,
          sortField,
          sortOrder,
          ...cleanedFilters,
        },
      });

      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch inventories");
    }
  }
);


export const fetchCategories = createAsyncThunk(
  "inventories/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/inventories/categories");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch categories"
      );
    }
  }
);

export const fetchTags = createAsyncThunk(
  "inventories/tags",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/inventories/tags");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch tags"
      );
    }
  }
);

export const createInventory = createAsyncThunk(
  "inventories/create",
  async (inventoryData, { rejectWithValue }) => {
    try {
      const response = await api.post("/inventories", inventoryData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create inventory"
      );
    }
  }
);

export const updateInventory = createAsyncThunk(
  "inventories/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/inventories/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update the inventory"
      );
    }
  }
);

export const deleteInventory = createAsyncThunk(
  "inventories/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/inventories/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete the inventory"
      );
    }
  }
);

const inventoriesSlice = createSlice({
  name: "inventories",
  initialState: {
    inventories: [],
    categories: [],
    tags: [],
    loading: false,
    error: null,
    currentInventory: null,
    showForm: false,
    total: 0,
    pages: 0,
  },
  reducers: {
    setShowForm: (state, action) => {
      state.showForm = action.payload;
    },
    setCurrentInventory: (state, action) => {
      state.currentInventory = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventories.fulfilled, (state, action) => {
        state.loading = false;
        state.inventories = action.payload.inventories;
        state.total = action.payload.total;
        state.pages = action.payload.pages;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(fetchTags.fulfilled, (state, action) => {
        state.tags = action.payload;
      })
      .addCase(createInventory.fulfilled, (state, action) => {
        state.inventories.push(action.payload);
        state.showForm = false;
        state.currentInventory = null;
        state.loading = false;
      })
      .addCase(updateInventory.fulfilled, (state, action) => {
        const index = state.inventories.findIndex(
          (inv) => inv.id === action.payload.id
        );
        if (index !== -1) {
          state.inventories[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(deleteInventory.fulfilled, (state, action) => {
        state.inventories = state.inventories.filter(
          (inv) => inv.id !== action.payload
        );
        state.loading = false;
      })
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export const { setShowForm, setCurrentInventory, clearError } =
  inventoriesSlice.actions;
export default inventoriesSlice.reducer;
