import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ChevronUp,
  ChevronDown,
  FileText,
} from "lucide-react";
import { 
  clearError,  
} from "../store/slices/itemsSlice";
import { useNavigate } from "react-router-dom";
import { fetchHomeInventoryItems } from "../store/slices/homeSlice";

const HomeInventoryItems = ({ inventoryId }) => {
  const dispatch = useDispatch();
  const {
    items,
    customFields,
    loading,
    error,
    pagination,
  } = useSelector((state) => state.home);

  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({});

  const visibleFields = customFields.filter(field => field.showInTable).slice(0, 4);

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchHomeInventoryItems({
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

  const handleItemClick = async (id) => {
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

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
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
    </div>
  );
};

export default HomeInventoryItems;