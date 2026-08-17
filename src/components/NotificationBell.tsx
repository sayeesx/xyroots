"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { FaBell, FaCircle, FaCheckDouble, FaCalendarDays, FaBriefcase, FaStar, FaCircleInfo, FaUser } from "react-icons/fa6";
import { getMyNotifications, markNotificationRead, markAllNotificationsRead } from "@/lib/actions/notifications";
import type { Notification } from "@/lib/actions/notifications";

const TYPE_ICON: Record<Notification["type"], React.ElementType> = {
  interview_scheduled: FaCalendarDays,
  application_update: FaBriefcase,
  hiring_alert: FaStar,
  profile_incomplete: FaUser,
  profile_view: FaCircle,
  general: FaCircleInfo,
};

const TYPE_COLOR: Record<Notification["type"], string> = {
  interview_scheduled: "text-blue-600 bg-blue-50",
  application_update: "text-emerald-600 bg-emerald-50",
  hiring_alert: "text-amber-600 bg-amber-50",
  profile_incomplete: "text-orange-600 bg-orange-50",
  profile_view: "text-purple-600 bg-purple-50",
  general: "text-gray-600 bg-gray-100",
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const load = useCallback(async () => {
    setLoading(true);
    const res = await getMyNotifications();
    if (res.success && res.data) setNotifications(res.data);
    setLoading(false);
  }, []);

  // Load on mount
  useEffect(() => { load(); }, [load]);

  // Poll every 60s
  useEffect(() => {
    const interval = setInterval(load, 60000);
    return () => clearInterval(interval);
  }, [load]);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClickNotification = async (n: Notification) => {
    if (!n.is_read) {
      setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, is_read: true } : x));
      await markNotificationRead(n.id);
    }
    setOpen(false);
    if (n.link) router.push(n.link);
  };

  const handleMarkAllRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    await markAllNotificationsRead();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="relative flex items-center justify-center pl-2 pr-2 py-1.5 rounded-full border border-xyroots-border hover:border-xyroots-teal hover:bg-xyroots-mint transition-colors bg-white"
        style={{ height: "auto" }}
        aria-label="Notifications"
      >
        <div className="w-8 h-8 rounded-full bg-xyroots-cream flex items-center justify-center">
          <FaBell className="w-3.5 h-3.5 text-gray-600" />
        </div>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center px-1 rounded-full leading-none">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-gray-100 z-[200] flex flex-col overflow-hidden animate-modal-in">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-gray-900">Notifications</h3>
              {unreadCount > 0 && (
                <span className="text-xs font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="flex items-center gap-1 text-xs font-semibold text-xyroots-teal hover:underline"
              >
                <FaCheckDouble className="w-3 h-3" /> Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="overflow-y-auto max-h-[400px] custom-scrollbar">
            {loading && notifications.length === 0 ? (
              <div className="p-8 text-center text-sm text-gray-400">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <FaBell className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-500">You&apos;re all caught up!</p>
                <p className="text-xs text-gray-400 mt-1">Notifications about interviews, applications, and more will appear here.</p>
              </div>
            ) : (
              notifications.map(n => {
                const Icon = TYPE_ICON[n.type] || FaCircleInfo;
                const colorClass = TYPE_COLOR[n.type] || TYPE_COLOR.general;
                return (
                  <button
                    key={n.id}
                    onClick={() => handleClickNotification(n)}
                    className={`w-full text-left flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 ${
                      !n.is_read ? "bg-blue-50/30" : ""
                    }`}
                  >
                    {/* Icon */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${colorClass}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-xs font-bold text-gray-900 leading-tight ${!n.is_read ? "font-extrabold" : ""}`}>
                          {n.title}
                        </p>
                        {!n.is_read && (
                          <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-0.5" />
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mt-0.5 leading-relaxed line-clamp-2">{n.body}</p>
                      <p className="text-[10px] text-gray-400 mt-1">{timeAgo(n.created_at)}</p>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50">
              <p className="text-xs text-center text-gray-400">Showing last 50 notifications</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
