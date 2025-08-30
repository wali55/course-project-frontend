// import { useState, useEffect } from "react";
// import { Shield, Search, UserCheck, UserX, Users, Crown } from "lucide-react";
// import api from "../services/api";
// import toast from "react-hot-toast";

// const Admin = () => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState("");
//   const [pagination, setPagination] = useState({});
//   const [selectedUsers, setSelectedUsers] = useState(new Set());
//   const [selectAll, setSelectAll] = useState(false);

//   const fetchUsers = async (page = 1, searchQuery = "") => {
//     try {
//       setLoading(true);
//       const response = await api.get(
//         `/admin/users?page=${page}&search=${searchQuery}&limit=10`
//       );
//       setUsers(response.data.users);
//       setPagination(response.data.pagination);
//       // Clear selections when fetching new data
//       setSelectedUsers(new Set());
//       setSelectAll(false);
//     } catch (error) {
//       toast.error("Failed to fetch users");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const handleSearch = (e) => {
//     e.preventDefault();
//     fetchUsers(1, search);
//   };

//   const handleSelectAll = () => {
//     if (selectAll) {
//       setSelectedUsers(new Set());
//     } else {
//       setSelectedUsers(new Set(users.map(user => user.id)));
//     }
//     setSelectAll(!selectAll);
//   };

//   const handleSelectUser = (userId) => {
//     const newSelected = new Set(selectedUsers);
//     if (newSelected.has(userId)) {
//       newSelected.delete(userId);
//     } else {
//       newSelected.add(userId);
//     }
//     setSelectedUsers(newSelected);
//     setSelectAll(newSelected.size === users.length);
//   };

//   const bulkUpdateRole = async (newRole) => {
//     if (selectedUsers.size === 0) {
//       toast.error("Please select users first");
//       return;
//     }

//     try {
//       const userIds = Array.from(selectedUsers);
//       await Promise.all(
//         userIds.map(userId => 
//           api.put(`/admin/users/${userId}/role`, { role: newRole })
//         )
//       );
//       toast.success(`${selectedUsers.size} user(s) role updated to ${newRole}`);
//       fetchUsers(pagination.page, search);
//     } catch (error) {
//       toast.error("Failed to update user roles");
//     }
//   };

//   const bulkUpdateStatus = async (isActive) => {
//     if (selectedUsers.size === 0) {
//       toast.error("Please select users first");
//       return;
//     }

//     try {
//       const userIds = Array.from(selectedUsers);
//       // Filter users that need status change
//       const usersToUpdate = users.filter(user => 
//         selectedUsers.has(user.id) && user.isActive !== isActive
//       );
      
//       await Promise.all(
//         usersToUpdate.map(user => 
//           api.put(`/admin/users/${user.id}/status`)
//         )
//       );
      
//       toast.success(`${usersToUpdate.length} user(s) ${isActive ? 'activated' : 'deactivated'}`);
//       fetchUsers(pagination.page, search);
//     } catch (error) {
//       toast.error("Failed to update user status");
//     }
//   };

//   const selectedCount = selectedUsers.size;
//   const hasSelections = selectedCount > 0;

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h1 className="text-2xl font-bold text-gray-900 flex items-center">
//           <Shield className="w-6 h-6 mr-2 text-blue-600" />
//           Admin Dashboard
//         </h1>
//       </div>

//       <div className="bg-white shadow rounded-lg p-6">
//         <form onSubmit={handleSearch} className="flex space-x-4">
//           <div className="flex-1">
//             <input
//               type="text"
//               placeholder="Search users by username or email..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//             />
//           </div>
//           <button
//             type="submit"
//             className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
//           >
//             <Search className="w-4 h-4" />
//           </button>
//         </form>
//       </div>

//       <div className="bg-white shadow rounded-lg overflow-hidden">
//         {/* Bulk Actions Toolbar */}
//         {hasSelections && (
//           <div className="bg-blue-50 border-b border-blue-200 px-6 py-4">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center space-x-4">
//                 <span className="text-sm font-medium text-blue-900">
//                   {selectedCount} user{selectedCount !== 1 ? 's' : ''} selected
//                 </span>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <button
//                   onClick={() => bulkUpdateRole('ADMIN')}
//                   className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                 >
//                   <Crown className="w-4 h-4 mr-2" />
//                   Make Admin
//                 </button>
//                 <button
//                   onClick={() => bulkUpdateRole('USER')}
//                   className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
//                 >
//                   <Users className="w-4 h-4 mr-2" />
//                   Make User
//                 </button>
//                 <button
//                   onClick={() => bulkUpdateStatus(true)}
//                   className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
//                 >
//                   <UserCheck className="w-4 h-4 mr-2" />
//                   Activate
//                 </button>
//                 <button
//                   onClick={() => bulkUpdateStatus(false)}
//                   className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
//                 >
//                   <UserX className="w-4 h-4 mr-2" />
//                   Deactivate
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left">
//                   <input
//                     type="checkbox"
//                     checked={selectAll}
//                     onChange={handleSelectAll}
//                     className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                   />
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   User
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Role
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Status
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   OAuth
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {loading ? (
//                 <tr>
//                   <td colSpan="5" className="px-6 py-4 text-center">
//                     <div className="flex justify-center">
//                       <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
//                     </div>
//                   </td>
//                 </tr>
//               ) : users.length === 0 ? (
//                 <tr>
//                   <td
//                     colSpan="5"
//                     className="px-6 py-4 text-center text-gray-500"
//                   >
//                     No users found
//                   </td>
//                 </tr>
//               ) : (
//                 users.map((user) => (
//                   <tr 
//                     key={user.id} 
//                     className={`hover:bg-gray-50 ${
//                       selectedUsers.has(user.id) ? 'bg-blue-50' : ''
//                     }`}
//                   >
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <input
//                         type="checkbox"
//                         checked={selectedUsers.has(user.id)}
//                         onChange={() => handleSelectUser(user.id)}
//                         className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                       />
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
//                           <span className="text-sm font-medium text-gray-700">
//                             {user.username.charAt(0).toUpperCase()}
//                           </span>
//                         </div>
//                         <div className="ml-4">
//                           <div className="text-sm font-medium text-gray-900">
//                             {user.username}
//                           </div>
//                           <div className="text-sm text-gray-500">
//                             {user.email}
//                           </div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span
//                         className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                           user.role === "ADMIN"
//                             ? "bg-blue-100 text-blue-800"
//                             : "bg-gray-100 text-gray-800"
//                         }`}
//                       >
//                         {user.role}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span
//                         className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                           user.isActive
//                             ? "bg-green-100 text-green-800"
//                             : "bg-red-100 text-red-800"
//                         }`}
//                       >
//                         {user.isActive ? "Active" : "Inactive"}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       <div className="flex space-x-1">
//                         {user.googleId && (
//                           <span className="text-red-600">Google</span>
//                         )}
//                         {user.githubId && (
//                           <span className="text-gray-900">Github</span>
//                         )}
//                         {!user.googleId && !user.githubId && <span>Email</span>}
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>

//         {pagination.pages > 1 && (
//           <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
//             <div className="text-sm text-gray-700">
//               Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
//               {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
//               of {pagination.total} results
//             </div>
//             <div className="flex space-x-2">
//               <button
//                 onClick={() => fetchUsers(pagination.page - 1, search)}
//                 disabled={pagination.page <= 1}
//                 className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
//               >
//                 Previous
//               </button>
//               <span className="px-3 py-1 text-sm text-gray-700">
//                 Page {pagination.page} of {pagination.pages}
//               </span>
//               <button
//                 onClick={() => fetchUsers(pagination.page + 1, search)}
//                 disabled={pagination.page >= pagination.pages}
//                 className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Admin;

import { useState, useEffect } from "react";
import { 
  Shield, 
  Search, 
  UserCheck, 
  UserX, 
  Users, 
  Crown, 
  Trash2,
  ChevronUp,
  ChevronDown,
  Filter,
  BarChart3
} from "lucide-react";
import api from "../services/api";
import toast from "react-hot-toast";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({});
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [stats, setStats] = useState({});
  const [filters, setFilters] = useState({
    status: "all", 
    role: "all", 
    sortBy: "createdAt",
    sortOrder: "desc"
  });
  const [showFilters, setShowFilters] = useState(false);

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/users/stats');
      setStats(response.data.stats);
    } catch (error) {
      console.error("Failed to fetch user stats");
    }
  };

  const fetchUsers = async (page = 1, searchQuery = "", filterOverrides = {}) => {
    try {
      setLoading(true);
      const currentFilters = { ...filters, ...filterOverrides };
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        sortBy: currentFilters.sortBy,
        sortOrder: currentFilters.sortOrder
      });

      if (searchQuery) params.append("search", searchQuery);
      if (currentFilters.status !== "all") params.append("status", currentFilters.status);
      if (currentFilters.role !== "all") params.append("role", currentFilters.role);

      const response = await api.get(`/admin/users?${params.toString()}`);
      setUsers(response.data.users);
      setPagination(response.data.pagination);
      setSelectedUsers(new Set());
      setSelectAll(false);
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchUsers(1, search, filters);
  }, [filters]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers(1, search);
  };

  const handleSort = (column) => {
    const newSortOrder = filters.sortBy === column && filters.sortOrder === "asc" ? "desc" : "asc";
    setFilters(prev => ({
      ...prev,
      sortBy: column,
      sortOrder: newSortOrder
    }));
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(users.map(user => user.id)));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectUser = (userId) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
    setSelectAll(newSelected.size === users.length);
  };

  const bulkAction = async (action) => {
    if (selectedUsers.size === 0) {
      toast.error("Please select users first");
      return;
    }

    try {
      const userIds = Array.from(selectedUsers);
      await api.post('/admin/users/bulk-actions', {
        action,
        userIds
      });
      
      const actionLabels = {
        block: 'blocked',
        unblock: 'unblocked', 
        delete: 'deleted',
        makeAdmin: 'promoted to admin',
        removeAdmin: 'demoted to user'
      };
      
      toast.success(`${selectedUsers.size} user(s) ${actionLabels[action]}`);
      fetchUsers(pagination.page, search);
      fetchStats(); 
    } catch (error) {
      toast.error(`Failed to ${action} users`);
    }
  };

  const getSortIcon = (column) => {
    if (filters.sortBy !== column) return null;
    return filters.sortOrder === "asc" ? 
      <ChevronUp className="w-4 h-4" /> : 
      <ChevronDown className="w-4 h-4" />;
  };

  const selectedCount = selectedUsers.size;
  const hasSelections = selectedCount > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <Shield className="w-6 h-6 mr-2 text-blue-600" />
          Admin Dashboard
        </h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <BarChart3 className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <UserCheck className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeUsers || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Crown className="w-8 h-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Admins</p>
              <p className="text-2xl font-bold text-gray-900">{stats.adminUsers || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-indigo-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Recent (30 days)</p>
              <p className="text-2xl font-bold text-gray-900">{stats.recentUsers || 0}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <form onSubmit={handleSearch} className="flex space-x-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search users by username or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={filters.role}
                  onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Roles</option>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sort By
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="createdAt">Created Date</option>
                  <option value="username">Username</option>
                  <option value="email">Email</option>
                  <option value="role">Role</option>
                  <option value="isActive">Status</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        {hasSelections && (
          <div className="bg-blue-50 border-b border-blue-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-blue-900">
                  {selectedCount} user{selectedCount !== 1 ? 's' : ''} selected
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => bulkAction('makeAdmin')}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Make Admin
                </button>
                <button
                  onClick={() => bulkAction('removeAdmin')}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Remove Admin
                </button>
                <button
                  onClick={() => bulkAction('unblock')}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <UserCheck className="w-4 h-4 mr-2" />
                  Unblock
                </button>
                <button
                  onClick={() => bulkAction('block')}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-orange-700 bg-orange-100 hover:bg-orange-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  <UserX className="w-4 h-4 mr-2" />
                  Block
                </button>
                <button
                  onClick={() => bulkAction('delete')}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('username')}
                >
                  <div className="flex items-center space-x-1">
                    <span>User</span>
                    {getSortIcon('username')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('email')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Email</span>
                    {getSortIcon('email')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('role')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Role</span>
                    {getSortIcon('role')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('isActive')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Status</span>
                    {getSortIcon('isActive')}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  OAuth
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('createdAt')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Created</span>
                    {getSortIcon('createdAt')}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr 
                    key={user.id} 
                    className={`hover:bg-gray-50 ${
                      selectedUsers.has(user.id) ? 'bg-blue-50' : ''
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedUsers.has(user.id)}
                        onChange={() => handleSelectUser(user.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {user.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.username}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.role === "ADMIN"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-1">
                        {user.googleId && (
                          <span className="text-red-600">Google</span>
                        )}
                        {user.githubId && (
                          <span className="text-gray-900">Github</span>
                        )}
                        {!user.googleId && !user.githubId && <span>Email</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {pagination.pages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="text-sm text-gray-700">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
              of {pagination.total} results
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => fetchUsers(pagination.page - 1, search)}
                disabled={pagination.page <= 1}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="px-3 py-1 text-sm text-gray-700">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                onClick={() => fetchUsers(pagination.page + 1, search)}
                disabled={pagination.page >= pagination.pages}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
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

export default Admin;