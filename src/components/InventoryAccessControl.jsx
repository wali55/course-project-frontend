import { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Search,
  Trash2,
  Users,
  Lock,
  Unlock,
  UserPlus,
  Mail,
  User,
  Calendar,
} from "lucide-react";
import {
  fetchAccessList,
  searchUsers,
  addUserAccess,
  removeUserAccess,
  clearUserSearch,
  setSearchQuery,
} from "../store/slices/accessControlSlice";
import { debounce } from "../utils/debounce";

const InventoryAccessControl = ({ inventoryId }) => {
  const dispatch = useDispatch();
  const {
    inventory,
    accessList,
    userSearchResults,
    loading,
    searchLoading,
    searchQuery,
  } = useSelector((state) => state.accessControl);

  const [showAddUser, setShowAddUser] = useState(false);
  const [sortBy, setSortBy] = useState("grantedAt");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    if (inventory?.id) {
      dispatch(fetchAccessList(inventory?.id)).unwrap();
    }
  }, [dispatch, inventoryId]);

  const debouncedSearch = useCallback(
    debounce((query) => {
      if (query.length >= 1) {
        dispatch(searchUsers({ inventoryId: inventory?.id, query })).unwrap();
      } else {
        dispatch(clearUserSearch());
      }
    }, 300),
    [dispatch, inventory?.id]
  );

  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);

  const handleSearchChange = (value) => {
    dispatch(setSearchQuery(value));
  };

  const handleAddUser = async (user) => {
    await dispatch(addUserAccess({ inventoryId: inventory?.id, userId: user.id, user })).unwrap();
    setShowAddUser(false);
  };

  const handleRemoveUser = async (accessId) => {
    if (confirm("Remove this user's access?")) {
      await dispatch(removeUserAccess({ inventoryId: inventory?.id, accessId })).unwrap();
    }
  };

  const sortedAccessList = [...accessList].sort((a, b) => {
    let aVal, bVal;

    switch (sortBy) {
      case "username":
        aVal = a.user.username.toLowerCase();
        bVal = b.user.username.toLowerCase();
        break;
      case "email":
        aVal = a.user.email.toLowerCase();
        bVal = b.user.email.toLowerCase();
        break;
      case "grantedAt":
      default:
        aVal = new Date(a.grantedAt);
        bVal = new Date(b.grantedAt);
        break;
    }

    return sortOrder === "asc" ? (aVal > bVal ? 1 : -1) : aVal < bVal ? 1 : -1;
  });

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading access control...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Users className="w-6 h-6" />
              Access Control
            </h2>
            <div className="mt-2 flex items-center gap-2">
              <h3 className="text-lg text-gray-700">{inventory?.title}</h3>
              <span
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  inventory?.isPublic
                    ? "bg-green-100 text-green-800"
                    : "bg-orange-100 text-orange-800"
                }`}
              >
                {inventory?.isPublic ? (
                  <>
                    <Unlock className="w-3 h-3" />
                    Public
                  </>
                ) : (
                  <>
                    <Lock className="w-3 h-3" />
                    Private
                  </>
                )}
              </span>
            </div>
          </div>
        </div>
        {inventory?.isPublic && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              <strong>Public Mode:</strong> All authenticated users
              automatically have write access to this inventory.
            </p>
          </div>
        )}
      </div>

      {!inventory.isPublic && (
        <div>
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row gap-3 justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowAddUser(!showAddUser)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  Add User
                </button>

                <span className="text-sm text-gray-600">
                  {accessList.length} user{accessList.length !== 1 ? "s" : ""}{" "}
                  with access
                </span>
              </div>

              {!inventory.isPublic && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Sort by:</span>
                  <select
                    value={`${sortBy}-${sortOrder}`}
                    onChange={(e) => {
                      const [field, order] = e.target.value.split("-");
                      setSortBy(field);
                      setSortOrder(order);
                    }}
                    className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="grantedAt-desc">Newest First</option>
                    <option value="grantedAt-asc">Oldest First</option>
                    <option value="username-asc">Username A-Z</option>
                    <option value="username-desc">Username Z-A</option>
                    <option value="email-asc">Email A-Z</option>
                    <option value="email-desc">Email Z-A</option>
                  </select>
                </div>
              )}
            </div>

            {showAddUser && (
              <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder="Search users by username or email..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                </div>

                {searchQuery.length >= 2 && (
                  <div className="mt-3 max-h-40 overflow-y-auto">
                    {searchLoading ? (
                      <div className="flex items-center justify-center py-4">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        <span className="ml-2 text-sm text-gray-600">
                          Searching...
                        </span>
                      </div>
                    ) : userSearchResults.length > 0 ? (
                      <div className="space-y-2">
                        {userSearchResults.map((user) => (
                          <div
                            key={user.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <User className="w-4 h-4 text-blue-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">
                                  {user.username}
                                </p>
                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                  <Mail className="w-3 h-3" />
                                  {user.email}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => handleAddUser(user)}
                              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                            >
                              Add
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : searchQuery.length >= 2 ? (
                      <p className="text-center text-gray-500 py-4">
                        No users found
                      </p>
                    ) : null}
                  </div>
                )}

                <div className="mt-3 flex justify-end">
                  <button
                    onClick={() => setShowAddUser(false)}
                    className="text-gray-600 hover:text-gray-800 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            {sortedAccessList.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No users in access list</p>
                <p className="text-sm text-gray-400 mt-1">
                  {inventory?.isPublic
                    ? "All authenticated users can write to this public inventory"
                    : "Add users to grant them write access"}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {sortedAccessList.map((access) => (
                  <div
                    key={access.id}
                    className="p-4 hover:bg-gray-50 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {access.user.username}
                        </p>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {access.user.email}
                        </p>
                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                          <Calendar className="w-3 h-3" />
                          Added{" "}
                          {new Date(access.grantedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemoveUser(access.id)}
                      className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                      title="Remove access"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center text-sm text-gray-600">
              <p>
                Access control for <strong>{inventory?.title}</strong>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryAccessControl;
