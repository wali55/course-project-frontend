import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const loadIdFormat = createAsyncThunk(
  "idFormat/load",
  async (inventoryId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/inventories/${inventoryId}/id-format`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load custom id format"
      );
    }
  }
);

export const generatePreview = createAsyncThunk(
  "idFormat/generatePreview",
  async (elements, { rejectWithValue }) => {
    try {
      const response = await api.post("/inventories/id-format/preview", {
        elements,
      });
      return response.data.preview;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to generate preview"
      );
    }
  }
);

export const saveIdFormat = createAsyncThunk(
  "idFormat/save",
  async ({ inventoryId, elements }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/inventories/${inventoryId}/id-format`, {
        elements,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to save custom id format"
      );
    }
  }
);

const idFormatSlice = createSlice({
  name: 'idFormat',
  initialState: {
    elements: [],
    preview: '',
    isLoading: false,
    error: null,
    isSaved: false
  },
  reducers: {
    addElement: (state, action) => {
      state.elements.push({
        id: Date.now().toString(),
        ...action.payload
      });
      state.isSaved = false;
    },
    updateElement: (state, action) => {
      const { id, updates } = action.payload;
      const element = state.elements.find(e => e.id === id);
      if (element) {
        Object.assign(element, updates);
        state.isSaved = false;
      }
    },
    removeElement: (state, action) => {
      state.elements = state.elements.filter(e => e.id !== action.payload);
      state.isSaved = false;
    },
    reorderElements: (state, action) => {
      const { dragIndex, hoverIndex } = action.payload;
      const [draggedElement] = state.elements.splice(dragIndex, 1);
      state.elements.splice(hoverIndex, 0, draggedElement);
      state.isSaved = false;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadIdFormat.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadIdFormat.fulfilled, (state, action) => {
        state.isLoading = false;
        state.elements = action.payload.format?.elements || [];
        state.preview = action.payload.preview || '';
        state.isSaved = true;
      })
      .addCase(loadIdFormat.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(generatePreview.fulfilled, (state, action) => {
        state.preview = action.payload;
      })
      .addCase(saveIdFormat.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(saveIdFormat.fulfilled, (state) => {
        state.isLoading = false;
        state.isSaved = true;
      })
      .addCase(saveIdFormat.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  }
});

export const { addElement, updateElement, removeElement, reorderElements, clearError } = idFormatSlice.actions;
export default idFormatSlice.reducer;