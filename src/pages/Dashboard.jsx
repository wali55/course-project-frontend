import { useSelector } from "react-redux";
import Inventories from "./Inventories";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="space-y-6">
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Welcome back, {user?.username}!
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-blue-900">Your Role</h3>
              <p className="text-2xl font-bold text-blue-600">{user?.role}</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-green-900">Member Since</h3>
              <p className="text-lg text-green-600">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-purple-900">Account Status</h3>
              <p className="text-lg text-purple-600">Active</p>
            </div>
          </div>
        </div>
      </div>
      
      <Inventories />
    </div>
  );
};

export default Dashboard;