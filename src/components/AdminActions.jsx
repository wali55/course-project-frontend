import {  
  UserCheck, 
  UserX, 
  Users, 
  Crown, 
  Trash2
} from "lucide-react";

const AdminActions = ({selectedCount, bulkAction}) => {
  return (
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
  )
}

export default AdminActions