import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchCustomFields = createAsyncThunk(
  "customFields/fetchFields",
  async (inventoryId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/inventories/${inventoryId}/fields`);
      return response.data.customFields;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch custom fields"
      );
    }
  }
);

export const createCustomField = createAsyncThunk(
  "customFields/createField",
  async ({ inventoryId, fieldData }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/inventories/${inventoryId}/fields`,
        fieldData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create custom field"
      );
    }
  }
);

export const updateCustomField = createAsyncThunk(
  "customFields/updateField",
  async ({ inventoryId, fieldId, updates }) => {
    try {
      const response = await api.put(
        `/inventories/${inventoryId}/fields/${fieldId}`,
        updates
      );
      return { fieldId, updates: response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update custom field"
      );
    }
  }
);

export const deleteCustomField = createAsyncThunk(
  "customFields/deleteField",
  async ({ inventoryId, fieldId }, { rejectWithValue }) => {
    try {
      await api.delete(`/inventories/${inventoryId}/fields/${fieldId}`);
      return fieldId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete custom field"
      );
    }
  }
);

export const reorderCustomFields = createAsyncThunk(
  "customFields/reorderFields",
  async ({ inventoryId, fields }, { rejectWithValue }) => {
    try {
      await api.put(`/inventories/${inventoryId}/fields/reorder-fields`, {
        fieldOrders: fields,
      });
      return fields;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to reorder custom fields"
      );
    }
  }
);

const customFieldsSlice = createSlice({
  name: "customFields",
  initialState: {
    fields: [],
    isLoading: false,
    error: null,
    pendingFields: [],
  },
  reducers: {
    addPendingField: (state, action) => {
      state.pendingFields.push({
        id: `temp-${Date.now()}`,
        title: "",
        description: "",
        fieldType: action.payload.fieldType,
        showInTable: false,
        sortOrder: state.fields.length + state.pendingFields.length,
        isNew: true,
      });
    },
    updatePendingField: (state, action) => {
      const { id, updates } = action.payload;
      const field = state.pendingFields.find((f) => f.id === id);
      if (field) {
        Object.assign(field, updates);
      }
    },
    removePendingField: (state, action) => {
      state.pendingFields = state.pendingFields.filter(
        (f) => f.id !== action.payload
      );
    },
    reorderFields: (state, action) => {
      const { dragIndex, hoverIndex } = action.payload;
      const allFields = [...state.fields, ...state.pendingFields];
      const [draggedField] = allFields.splice(dragIndex, 1);
      allFields.splice(hoverIndex, 0, draggedField);

      const serverFields = allFields.filter((f) => !f.id.startsWith("temp-"));
      const pendingFields = allFields.filter((f) => f.id.startsWith("temp-"));

      state.fields = serverFields.map((f, i) => ({ ...f, sortOrder: i }));
      state.pendingFields = pendingFields.map((f, i) => ({
        ...f,
        sortOrder: serverFields.length + i,
      }));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomFields.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCustomFields.fulfilled, (state, action) => {
        state.isLoading = false;
        state.fields = action.payload;
      })
      .addCase(fetchCustomFields.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(createCustomField.fulfilled, (state, action) => {
        const tempId = state.pendingFields[0]?.id;
        state.pendingFields = state.pendingFields.slice(1);
        state.fields.push(action.payload);
      })
      .addCase(updateCustomField.fulfilled, (state, action) => {
        const { fieldId, updates } = action.payload;
        const field = state.fields.find((f) => f.id === fieldId);
        if (field) Object.assign(field, updates);
      })
      .addCase(deleteCustomField.fulfilled, (state, action) => {
        state.fields = state.fields.filter((f) => f.id !== action.payload);
      })
      .addCase(reorderCustomFields.fulfilled, (state, action) => {
        state.fields = action.payload;
      });
  },
});

export const {
  addPendingField,
  updatePendingField,
  removePendingField,
  reorderFields,
} = customFieldsSlice.actions;
export default customFieldsSlice.reducer;
