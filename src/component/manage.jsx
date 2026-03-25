import React from "react";
import { Trash2 } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ManageUsers({ users, onRoleChange, onDelete }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white flex">
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 flex-1 p-8">
        <h2 className="text-center font-bold text-3xl mb-6 bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">Manage Users</h2>

        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-lg border border-slate-700/50 rounded-2xl overflow-hidden hover:border-slate-600/50 transition-all duration-300">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-indigo-600/20 to-blue-600/20 border-b border-slate-700/50">
                <TableHead className="text-indigo-300">SN</TableHead>
                <TableHead className="text-indigo-300">Name</TableHead>
                <TableHead className="text-indigo-300">Email</TableHead>
                <TableHead className="text-indigo-300">Role</TableHead>
                <TableHead className="text-center text-indigo-300">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {users && users.length > 0 ? (
                users.map(({ _id, name, email, role }, index) => (
                  <TableRow key={_id} className="border-t border-slate-700/30 hover:bg-slate-700/20 transition-colors duration-200">
                    <TableCell className="text-gray-300">{index + 1}</TableCell>
                    <TableCell className="text-gray-300">{name}</TableCell>
                    <TableCell className="text-gray-300">{email}</TableCell>
                    <TableCell className="text-gray-300">{role}</TableCell>
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
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
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