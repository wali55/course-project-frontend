import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Plus,
  Edit2,
  Trash2,
  ChevronUp,
  ChevronDown,
  FileText,
} from "lucide-react";
import ItemForm from "./ItemForm";
import { 
  bulkAction, 
  clearError, 
  fetchItems, 
  fetchSingleItem, 
  setCurrentItem, 
  setSelectedItems, 
  setShowForm 
} from "../store/slices/itemsSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ItemManagement = ({ inventoryId, canEdit }) => {
  const dispatch = useDispatch();
  const {
    items,
    customFields,
    loading,
    error,
    selectedItems,
    showForm,
    currentItem,
    pagination,
  } = useSelector((state) => state.items);

  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({});

  const visibleFields = customFields.filter(field => field.showInTable).slice(0, 4);

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchItems({
      inventoryId,
      search,
      sort: sortField,
      order: sortOrder,
      page: currentPage,
      limit: 10,
      ...filters,
    })).unwrap();
  }, [dispatch, inventoryId, search, sortField, sortOrder, currentPage, filters]);

  const handleSort = (field) => {
    setSortOrder(sortField === field && sortOrder === "asc" ? "desc" : "asc");
    setSortField(field);
    setCurrentPage(1);
  };

  const handleSelectItem = (itemId) => {
    const newSelected = selectedItems.includes(itemId)
      ? selectedItems.filter(id => id !== itemId)
      : [...selectedItems, itemId];
    dispatch(setSelectedItems(newSelected));
  };

  const handleSelectAll = () => {
    dispatch(setSelectedItems(
      selectedItems.length === items.length ? [] : items.map(item => item.id)
    ));
  };

  const handleBulkAction = async (action) => {
    if (!selectedItems.length) return;
    
    if (action === "delete" && !window.confirm(`Delete ${selectedItems.length} items?`)) return;
    
    if (action === "edit" && selectedItems.length === 1) {
      const item = items.find(i => i.id === selectedItems[0]);
      dispatch(setCurrentItem(item));
      dispatch(setShowForm(true));
      return;
    }
    
    if (action === "delete") {
      await dispatch(bulkAction({
        action: "delete",
        itemIds: selectedItems,
        inventoryId,
      })).unwrap();
      toast('Action performed successfully');
      dispatch(fetchItems({ inventoryId, page: currentPage })).unwrap();
    }
  }

  const handleItemClick = async (id) => {
    await dispatch(fetchSingleItem(id)).unwrap();
    navigate(`/inventories/${inventoryId}/items/${id}`);
  }

  const renderFieldValue = (field, value) => {
    if (!value) return "-";
    
    switch (field.fieldType) {
      case "BOOLEAN":
        return value ? "✓" : "✗";
      case "DOCUMENT_LINK":
        return (
          <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            <FileText className="w-4 h-4 inline" />
          </a>
        );
      case "MULTI_TEXT":
        return value.substring(0, 50) + (value.length > 50 ? "..." : "");
      default:
        return String(value);
    }
  };

  const SortButton = ({ field, children }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 hover:text-blue-600 font-medium"
    >
      {children}
      {sortField === field && (
        sortOrder === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
      )}
    </button>
  );

  if (loading && items.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Items</h2>
        {canEdit && (
          <button
            onClick={() => {
              dispatch(setCurrentItem(null));
              dispatch(setShowForm(true));
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
          <button
            onClick={() => dispatch(clearError())}
            className="text-red-600 underline text-sm mt-1"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="bg-white rounded-lg border-gray-200">
        {selectedItems.length > 0 && canEdit && (
          <div className="p-4 bg-blue-50 border-b border-blue-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-800">
                {selectedItems.length} item{selectedItems.length !== 1 ? "s" : ""} selected
              </span>
              <div className="flex gap-2">
                {selectedItems.length === 1 && (
                  <button
                    onClick={() => handleBulkAction("edit")}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded hover:bg-blue-200 flex items-center gap-1"
                  >
                    <Edit2 className="w-3 h-3" /> Edit
                  </button>
                )}
                <button
                  onClick={() => handleBulkAction("delete")}
                  className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200 flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" /> Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {canEdit && (
                  <th className="p-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === items.length && items.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                )}
                <th className="p-4 text-left">
                  <SortButton field="customId">ID</SortButton>
                </th>
                {visibleFields.map(field => (
                  <th key={field.id} className="p-4 text-left">
                    <SortButton field={`fieldValues.${field.title}`}>
                      {field.title}
                    </SortButton>
                  </th>
                ))}
                <th className="p-4 text-left">
                  <SortButton field="createdAt">Created</SortButton>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {items.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  {canEdit && (
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleSelectItem(item.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                  )}
                  <td onClick={() => handleItemClick(item.id)} className="p-4 font-mono text-sm text-blue-500 underline cursor-pointer">
                    {item.customId || `#${item.id.slice(-8)}`}
                  </td>
                  {visibleFields.map(field => (
                    <td key={field.id} className="p-4 max-w-xs truncate">
                      {renderFieldValue(field, item.fieldValues[field.title])}
                    </td>
                  ))}
                  <td className="p-4 text-gray-600 text-sm">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {items.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            {search || Object.keys(filters).length > 0
              ? "No items found matching your criteria."
              : "No items yet. Add your first item!"}
          </div>
        )}

        {pagination?.pages > 1 && (
          <div className="p-4 border-t border-gray-200 flex justify-between items-center">
            <span className="text-sm text-gray-700">
              Page {pagination.page} of {pagination.pages} ({pagination.total} total)
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={pagination.page === 1}
                className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.pages))}
                disabled={pagination.page === pagination.pages}
                className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {showForm && (
        <ItemForm
          inventoryId={inventoryId}
          item={currentItem}
          onClose={() => {
            dispatch(setShowForm(false));
            dispatch(setCurrentItem(null));
          }}
        />
      )}
    </div>
  );
};

export default ItemManagement;