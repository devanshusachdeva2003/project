import React, { useState } from "react";
import { Trash2, Plus } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ManageUsers({ users, onRoleChange, onDelete, onCreate }) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    username: "",
    role: "user",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password) {
      alert("Name, email, and password are required");
      return;
    }

    onCreate(
      formData.name,
      formData.email,
      formData.password,
      formData.username,
      formData.role
    );

    // Reset form
    setFormData({
      name: "",
      email: "",
      password: "",
      username: "",
      role: "user",
    });
    setShowCreateForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white flex">
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-center flex-1 font-bold text-3xl bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">Manage Users</h2>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white px-4 py-2 rounded-lg font-semibold shadow-lg shadow-green-500/20 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
          >
            <Plus size={20} />
            Create User
          </button>
        </div>

        {/* Create User Form */}
        {showCreateForm && (
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-8 mb-8 hover:border-slate-600/50 transition-all duration-300">
            <h3 className="text-2xl font-bold mb-6 text-indigo-300">Create New User</h3>
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="px-4 py-3 bg-slate-700/50 border border-slate-600/50 focus:border-indigo-500 text-white placeholder-gray-500 rounded-lg outline-none transition-all duration-300 focus:shadow-lg focus:shadow-indigo-500/20"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="px-4 py-3 bg-slate-700/50 border border-slate-600/50 focus:border-indigo-500 text-white placeholder-gray-500 rounded-lg outline-none transition-all duration-300 focus:shadow-lg focus:shadow-indigo-500/20"
                  required
                />
                <input
                  type="text"
                  name="username"
                  placeholder="Username (optional)"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="px-4 py-3 bg-slate-700/50 border border-slate-600/50 focus:border-indigo-500 text-white placeholder-gray-500 rounded-lg outline-none transition-all duration-300 focus:shadow-lg focus:shadow-indigo-500/20"
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="px-4 py-3 bg-slate-700/50 border border-slate-600/50 focus:border-indigo-500 text-white placeholder-gray-500 rounded-lg outline-none transition-all duration-300 focus:shadow-lg focus:shadow-indigo-500/20"
                  required
                />
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="px-4 py-3 bg-slate-700/50 border border-slate-600/50 focus:border-indigo-500 text-white rounded-lg outline-none transition-all duration-300 focus:shadow-lg focus:shadow-indigo-500/20"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg shadow-green-500/20 transition-all duration-300 transform hover:scale-105"
                >
                  ✅ Create User
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg shadow-gray-500/20 transition-all duration-300 transform hover:scale-105"
                >
                  ❌ Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Users Table */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-lg border border-slate-700/50 rounded-2xl overflow-hidden hover:border-slate-600/50 transition-all duration-300">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-indigo-600/20 to-blue-600/20 border-b border-slate-700/50">
                <TableHead className="text-indigo-300">SN</TableHead>
                <TableHead className="text-indigo-300">Name</TableHead>
                <TableHead className="text-indigo-300">Email</TableHead>
                <TableHead className="text-indigo-300">Role</TableHead>
                <TableHead className="text-center text-indigo-300">Followers</TableHead>
                <TableHead className="text-center text-indigo-300">Following</TableHead>
                <TableHead className="text-center text-indigo-300">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {users && users.length > 0 ? (
                users.map(({ _id, name, email, role, followers, following }, index) => (
                  <TableRow key={_id} className="border-t border-slate-700/30 hover:bg-slate-700/20 transition-colors duration-200">
                    <TableCell className="text-gray-300">{index + 1}</TableCell>
                    <TableCell className="text-gray-300">{name}</TableCell>
                    <TableCell className="text-gray-300">{email}</TableCell>
                    <TableCell className="text-gray-300">{role}</TableCell>
                    <TableCell className="text-center">
                      <span className="inline-block bg-indigo-600/30 text-indigo-300 px-3 py-1 rounded-full text-sm font-semibold border border-indigo-500/50">
                        {followers?.length || 0}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="inline-block bg-blue-600/30 text-blue-300 px-3 py-1 rounded-full text-sm font-semibold border border-blue-500/50">
                        {following?.length || 0}
                      </span>
                    </TableCell>
                    <TableCell className="flex justify-center gap-4">
                      <button
                        onClick={() =>
                          onRoleChange(_id, role === "user" ? "admin" : "user")
                        }
                        className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white px-3 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-amber-500/20 text-sm font-semibold"
                      >
                        {role === "user" ? "Make Admin" : "Make User"}
                      </button>
                      <button
                        onClick={() => onDelete(_id)}
                        className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-3 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-red-500/20"
                      >
                        <Trash2 size={18} />
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}