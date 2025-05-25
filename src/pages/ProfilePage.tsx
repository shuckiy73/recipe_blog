import React from 'react';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">Account Information</h2>
            <p className="text-gray-600">Email: {user?.email}</p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2">My Recipes</h2>
            {/* Recipe list will be implemented later */}
            <p className="text-gray-600">No recipes yet</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;