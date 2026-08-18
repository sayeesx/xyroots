"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { FaBell, FaCircle, FaCheckDouble, FaCalendarDays, FaBriefcase, FaStar, FaCircleInfo, FaUser, FaXmark } from "react-icons/fa6";
import { createClient } from "@/lib/supabase/client";
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
  const supabase = createClient();
  const router = useRouter();

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profile } = await (supabase as any)
        .from("profiles")
        .select("id")
        .eq("auth_user_id", user.id)
        .single();
      if (!profile) return;
      const { data } = await (supabase as any)
        .from("notifications")
        .select("*")
        .eq("recipient_profile_id", profile.id)
        .order("created_at", { ascending: false })
        .limit(50);
      if (data) setNotifications(data as Notification[]);
    } finally {
      if (!silent) setLoading(false);
    }
  }, []); // eslint-disable-line

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const interval = setInterval(() => load(true), 90000);
    return () => clearInterval(interval);
  }, [load]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleClickNotification = async (n: Notification) => {
    if (!n.is_read) {
      setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, is_read: true } : x));
      await (supabase as any).from("notifications").update({ is_read: true }).eq("id", n.id);
    }
    setOpen(false);
    if (n.link) router.push(n.link);
  };

  const handleMarkAllRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    await (supabase as any)
      .from("notifications")
      .update({ is_read: true })
      .eq("is_read", false);
  };

  return (
    <>
      {/* Bell button */}
      <button
        onClick={e => { e.stopPropagation(); setOpen(o => !o); }}
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

      {/* Full-screen modal — fixed, not a dropdown, so it never bubbles to parent buttons */}
      {open && (
        <div
          className="fixed inset-0 z-[500] flex items-start justify-center pt-14 sm:pt-16 px-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-modal-in"
            style={{ maxHeight: "calc(100vh - 4rem)" }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-gray-900">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="text-xs font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="flex items-center gap-1 text-xs font-semibold text-xyroots-teal hover:underline"
                  >
                    <FaCheckDouble className="w-3 h-3" /> Mark all read
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                  aria-label="Close"
                >
                  <FaXmark className="w-3.5 h-3.5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="overflow-y-auto flex-1 custom-scrollbar">
              {loading && notifications.length === 0 ? (
                <div className="p-10 text-center text-sm text-gray-400">Loading...</div>
              ) : notifications.length === 0 ? (
                <div className="p-10 text-center">
                  <FaBell className="w-8 h-8 text-gray-200 mx-auto mb-3" />
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
                      className={`w-full text-left flex items-start gap-3 px-5 py-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 ${
                        !n.is_read ? "bg-blue-50/30" : ""
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${colorClass}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-sm font-bold text-gray-900 leading-tight ${!n.is_read ? "font-extrabold" : ""}`}>
                            {n.title}
                          </p>
                          {!n.is_read && (
                            <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1" />
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
              <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 shrink-0">
                <p className="text-xs text-center text-gray-400">Showing last 50 notifications</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
