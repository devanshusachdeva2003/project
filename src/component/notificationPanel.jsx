import React, { useEffect, useState } from "react";
import { X, Trash2, Check } from "lucide-react";
import { toast } from "react-toastify";

export default function NotificationPanel({ isOpen, onClose }) {
  const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const token = localStorage.getItem("token");

  // FETCH NOTIFICATIONS
  useEffect(() => {
    if (isOpen && token) {
      fetchNotifications();
      fetchUnreadCount();
    }
  }, [isOpen, token]);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${VITE_API_BASE_URL}/api/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch notifications");

      const data = await res.json();
      setNotifications(data);
      console.log("📬 Notifications loaded:", data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      toast.error("Failed to load notifications");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const res = await fetch(
        `${VITE_API_BASE_URL}/api/notifications/unread-count`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error();

      const data = await res.json();
      setUnreadCount(data.unreadCount);
    } catch (err) {
      console.error("Error fetching unread count:", err);
    }
  };

  // MARK AS READ
  const handleMarkAsRead = async (id) => {
    try {
      const res = await fetch(
        `${VITE_API_BASE_URL}/api/notifications/${id}/read`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error();

      setNotifications((prev) =>
        prev.map((notif) => (notif._id === id ? { ...notif, read: true } : notif))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      toast.error("Failed to mark as read");
    }
  };

  // MARK ALL AS READ
  const handleMarkAllAsRead = async () => {
    try {
      const res = await fetch(
        `${VITE_API_BASE_URL}/api/notifications/mark-all-read`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error();

      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, read: true }))
      );
      setUnreadCount(0);
      toast.success("All notifications marked as read");
    } catch (err) {
      toast.error("Failed to mark all as read");
    }
  };

  // DELETE NOTIFICATION
  const handleDelete = async (id) => {
    try {
      const res = await fetch(
        `${VITE_API_BASE_URL}/api/notifications/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error();

      setNotifications((prev) => prev.filter((notif) => notif._id !== id));
      toast.success("Notification deleted");
    } catch (err) {
      toast.error("Failed to delete notification");
    }
  };

  // DELETE ALL NOTIFICATIONS
  const handleDeleteAll = async () => {
    if (!window.confirm("Delete all notifications?")) return;

    try {
      const res = await fetch(`${VITE_API_BASE_URL}/api/notifications`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error();

      setNotifications([]);
      setUnreadCount(0);
      toast.success("All notifications deleted");
    } catch (err) {
      toast.error("Failed to delete notifications");
    }
  };

  // GET NOTIFICATION ICON AND COLOR
  const getNotificationIcon = (type) => {
    switch (type) {
      case "like":
        return "❤️";
      case "comment":
        return "💬";
      case "blog":
        return "📝";
      case "admin":
        return "⚙️";
      default:
        return "🔔";
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "like":
        return "border-red-500/30 bg-red-500/10";
      case "comment":
        return "border-purple-500/30 bg-purple-500/10";
      case "blog":
        return "border-blue-500/30 bg-blue-500/10";
      case "admin":
        return "border-yellow-500/30 bg-yellow-500/10";
      default:
        return "border-indigo-500/30 bg-indigo-500/10";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* NOTIFICATION PANEL */}
      <div className="relative w-full max-w-md h-screen bg-gradient-to-b from-slate-800/95 to-slate-900/95 backdrop-blur-xl border-l border-slate-700/50 flex flex-col shadow-2xl rounded-l-2xl">
        {/* HEADER */}
        <div className="flex justify-between items-center p-6 border-b border-slate-700/50">
          <div>
            <h2 className="text-2xl font-bold text-white">Notifications</h2>
            {unreadCount > 0 && (
              <p className="text-sm text-indigo-400">
                {unreadCount} unread
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2"
          >
            <X size={24} />
          </button>
        </div>

        {/* ACTIONS */}
        {notifications.length > 0 && (
          <div className="flex gap-2 p-4 border-b border-slate-700/50">
            <button
              onClick={handleMarkAllAsRead}
              className="flex-1 flex items-center justify-center gap-2 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300"
            >
              <Check size={16} />
              Mark All Read
            </button>
            <button
              onClick={handleDeleteAll}
              className="flex-1 flex items-center justify-center gap-2 bg-red-600/30 hover:bg-red-600/50 text-red-300 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300"
            >
              <Trash2 size={16} />
              Clear All
            </button>
          </div>
        )}

        {/* NOTIFICATIONS LIST */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <div className="text-center">
                <div className="animate-spin w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full mx-auto mb-2"></div>
                <p className="text-gray-400">Loading...</p>
              </div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-gray-500">
              <p className="text-xl">🔔</p>
              <p className="mt-2">No notifications</p>
            </div>
          ) : (
            <div className="space-y-2 p-4">
              {notifications.map((notif) => (
                <div
                  key={notif._id}
                  className={`p-4 rounded-lg border transition-all duration-300 ${getNotificationColor(
                    notif.type
                  )} ${!notif.read ? "ring-2 ring-indigo-500/50" : ""}`}
                >
                  <div className="flex gap-3">
                    {/* ICON */}
                    <div className="text-2xl flex-shrink-0">
                      {getNotificationIcon(notif.type)}
                    </div>

                    {/* CONTENT */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-300 line-clamp-2">
                        {notif.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(notif.createdAt).toLocaleDateString()} at{" "}
                        {new Date(notif.createdAt).toLocaleTimeString()}
                      </p>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex gap-2 flex-shrink-0">
                      {!notif.read && (
                        <button
                          onClick={() => handleMarkAsRead(notif._id)}
                          className="text-indigo-400 hover:text-indigo-300 transition-colors"
                          title="Mark as read"
                        >
                          <Check size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notif._id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
