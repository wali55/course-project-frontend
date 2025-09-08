import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchItems = createAsyncThunk('items/fetchItems', 
  async ({ inventoryId, ...params }, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams(params).toString();
      const response = await api.get(`/items/inventory/${inventoryId}/items?${query}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch items");
    }
  }
);

export const fetchSingleItem = createAsyncThunk('items/fetchSingleItem', 
  async (itemId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/items/inventory/${itemId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch single item");
    }
  }
);

export const createItem = createAsyncThunk('items/create', 
  async ({ inventoryId, data }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/items/inventory/${inventoryId}/items`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create item");
    }
  }
);

export const updateItem = createAsyncThunk('items/update', 
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/items/inventory/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update item");
    }
  }
);

export const deleteItem = createAsyncThunk('items/delete', async (id, { rejectWithValue }) => {
  try {
    await fetch(`/items/inventory/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to delete item");
  }
});

export const bulkAction = createAsyncThunk('items/bulkAction', 
  async ({ action, itemIds, inventoryId, data }, { rejectWithValue }) => {
    try {
      const response = await api.post('/items/bulk', { action, itemIds, inventoryId, data });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Bulk action failed");
    }
  }
);

const itemsSlice = createSlice({
  name: 'items',
  initialState: {
    items: [],
    customFields: [],
    pagination: {},
    loading: false,
    error: null,
    selectedItems: [],
    showForm: false,
    currentItem: null
  },
  reducers: {
    setSelectedItems: (state, action) => {
      state.selectedItems = action.payload;
    },
    setShowForm: (state, action) => {
      state.showForm = action.payload;
    },
    setCurrentItem: (state, action) => {
      state.currentItem = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.customFields = action.payload.customFields;
        state.pagination = action.payload.pagination;
        state.loading = false;
      })
      .addCase(fetchSingleItem.fulfilled, (state, action) => {
        state.currentItem = action.payload;
        state.loading = false;
      })
      .addCase(createItem.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        state.showForm = false;
        state.currentItem = null;
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.showForm = false;
        state.currentItem = null;
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
        state.selectedItems = state.selectedItems.filter(id => id !== action.payload);
      })
      .addCase(bulkAction.fulfilled, (state) => {
        state.selectedItems = [];
      })
      .addMatcher(
        action => action.type.endsWith('/pending'),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        action => action.type.endsWith('/rejected'),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  }
});

export const { setSelectedItems, setShowForm, setCurrentItem, clearError } = itemsSlice.actions;
export default itemsSlice.reducer;