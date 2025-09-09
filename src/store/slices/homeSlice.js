import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchHomeInventories = createAsyncThunk(
  "customFields/fetchHomeInventories",
  async ({ page, pageSize, search, sortField, sortOrder, filters }, { rejectWithValue }) => {
    try {
      const params = {
        page,
        limit: pageSize,
        search,
        sortBy: sortField,
        sortOrder,
        ...filters,
      };

      const response = await api.get(`/home/inventories`, { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch home inventories"
      );
    }
  }
);


export const fetchSingleHomeInventory = createAsyncThunk(
  "customFields/fetchSingleHomeInventory",
  async (inventoryId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/home/inventories/${inventoryId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch home inventory"
      );
    }
  }
);

export const fetchHomeInventoryItems = createAsyncThunk(
  "customFields/fetchHomeInventoryItems",
  async ({ inventoryId, search, sort, order, page, limit, ...filters }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({
        search,
        sort,
        order,
        page,
        limit,
        ...filters,
      }).toString();

      const response = await api.get(`/home/items/${inventoryId}?${params}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch home inventory items"
      );
    }
  }
);


export const fetchSingleHomeInventoryItem = createAsyncThunk(
  "customFields/fetchSingleHomeInventoryItem",
  async (itemId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/home/items/${itemId}/single`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch single home inventory item"
      );
    }
  }
);

const homeSlice = createSlice({
  name: "home",
  initialState: {
    inventories: [],
    items: [],
    singleInventory: null,
    singleItem: null,
    loading: false,
    error: null,
    inventoryTotal: 0,
    inventoryPages: 0,
    itemTotal: 0,
    itemPages: 0,
    customFields: []
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomeInventories.fulfilled, (state, action) => {
        state.loading = false;
        state.inventories = action.payload.inventories;
        state.inventoryTotal = action.payload.total;
        state.inventoryPages = action.payload.pages;
      })
      .addCase(fetchSingleHomeInventory.fulfilled, (state, action) => {
        state.loading = false;
        state.singleInventory = action.payload.inventory;
      })
      .addCase(fetchHomeInventoryItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.itemTotal = action.payload.total;
        state.itemPages = action.payload.pages;
        state.customFields = action.payload.customFields;
      })
      .addCase(fetchSingleHomeInventoryItem.fulfilled, (state, action) => {
        state.loading = false;
        state.singleItem = action.payload;
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

export const { clearError } =
  homeSlice.actions;
export default homeSlice.reducer;