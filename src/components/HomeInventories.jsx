import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearError,
  fetchCategories,
  fetchTags,
  setCurrentInventory,
  setShowForm,
} from "../store/slices/inventoriesSlice";
import {
  Plus,
  Search,
  ChevronUp,
  ChevronDown,
  Globe,
  Lock,
  Filter,
  Tag,
  FolderOpen,
} from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";
import FilterInventories from "../components/FilterInventories";
import toast from "react-hot-toast";
import InventoriesPagination from "../components/InventoriesPagination";
import { useNavigate } from "react-router-dom";
import { clearAccessList, fetchAccessList } from "../store/slices/accessControlSlice";
import { fetchHomeInventories, fetchSingleHomeInventory } from "../store/slices/homeSlice";

const HomeInventories = () => {
  const dispatch = useDispatch();
  const {
    categories
  } = useSelector((state) => state.inventories);
  const {
    inventories,
    loading,
    error,
    inventoryTotal: total,
    inventoryPages: pages
  } = useSelector((state) => state.home);

  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("updatedAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedInventories, setSelectedInventories] = useState(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: "all",
    visibility: "all",
    creator: "all",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    dispatch(fetchHomeInventories({ 
      page: currentPage, 
      pageSize,
      search,
      sortField,
      sortOrder,
      filters 
    }));
    dispatch(fetchCategories()).unwrap();
    dispatch(fetchTags()).unwrap();
  }, [dispatch, currentPage, pageSize, search, sortField, sortOrder, filters]);

  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [search, filters, sortField, sortOrder]);

  const filteredAndSortedInventories = inventories; 

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setCurrentPage(1); 
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      setCurrentPage(1);
    }, 500);
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return null;
    return sortOrder === "asc" ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  const SortButton = ({ field, children }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 hover:text-blue-600 font-medium"
    >
      {children}
      {getSortIcon(field)}
    </button>
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSelectedInventories(new Set());
  };


  const selectedCount = selectedInventories.size;
  const hasSelections = selectedCount > 0;

  const handleInventoryClick = async (id) => {
    navigate(`/inventories/${id}`);
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Inventories
          </h1>
          <p className="text-gray-600">
            Create and manage your inventory collections
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
          <button
            onClick={() => {
              dispatch(setCurrentInventory(null));
              dispatch(setShowForm(true));
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Create Inventory
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search inventories..."
            value={search}
            onChange={handleSearchChange}
            className="w-full max-w-md pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {showFilters && (
        <FilterInventories filters={filters} setFilters={setFilters} categories={categories} />
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {hasSelections && (
          <div className="bg-blue-50 border-b border-blue-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-blue-900">
                  {selectedCount} inventor{selectedCount !== 1 ? "ies" : "y"}{" "}
                  selected
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <SortButton field="title">Title</SortButton>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tags
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Visibility
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Creator
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <SortButton field="updatedAt">Last Updated</SortButton>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedInventories.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    {search ||
                    filters.category !== "all" ||
                    filters.visibility !== "all" ||
                    filters.creator !== "all"
                      ? "No inventories found matching your criteria."
                      : "No inventories yet. Create your first inventory!"}
                  </td>
                </tr>
              ) : (
                filteredAndSortedInventories.map((inventory) => (
                  <tr
                    key={inventory.id}
                    className={`hover:bg-gray-50 ${
                      selectedInventories.has(inventory.id) ? "bg-blue-50" : ""
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {inventory.image && (
                          <img
                            src={inventory.image}
                            alt=""
                            className="w-12 h-12 object-cover rounded-md"
                          />
                        )}
                        <div>
                          <div onClick={() => handleInventoryClick(inventory.id)} className="font-medium text-blue-500 underline hover:text-blue-600 cursor-pointer">
                            {inventory.title}
                          </div>
                          {inventory.description && (
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {inventory.description.substring(0, 60)}
                              {inventory.description.length > 60 ? "..." : ""}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {inventory.category ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                          <FolderOpen className="w-3 h-3" />
                          {inventory.category.name}
                        </span>
                      ) : (
                        <span className="text-gray-400">No category</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {inventory.tags?.slice(0, 3).map((tag) => (
                          <span
                            key={tag.id}
                            className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800"
                          >
                            <Tag className="w-2 h-2" />
                            {tag.name}
                          </span>
                        ))}
                        {inventory.tags?.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{inventory.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
                          inventory.isPublic
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {inventory.isPublic ? (
                          <Globe className="w-3 h-3" />
                        ) : (
                          <Lock className="w-3 h-3" />
                        )}
                        {inventory.isPublic ? "Public" : "Private"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {inventory.creator?.username || "Unknown"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(inventory.updatedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <InventoriesPagination pages={pages} total={total} currentPage={currentPage} handlePageChange={handlePageChange} pageSize={pageSize}  />
      </div>
    </div>
  );
};

export default HomeInventories;