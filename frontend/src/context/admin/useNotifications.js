import { useState } from "react";

export default function useNotifications() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "Welcome to City Care Admin Portal.",
      time: "Just now",
      read: false,
    },
    {
      id: 2,
      message: "Dr. Sarah Connor availability toggled to Available.",
      time: "1 hour ago",
      read: true,
    },
    {
      id: 3,
      message: "New appointment booked by patient Robert Paulson.",
      time: "2 hours ago",
      read: true,
    },
  ]);

  const addNotification = (message) => {
    setNotifications((prev) => [
      { id: Date.now(), message, time: "Just now", read: false },
      ...prev,
    ]);
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAllNotifications = () => setNotifications([]);

  return {
    notifications,
    addNotification,
    markAllNotificationsAsRead,
    clearAllNotifications,
  };
}