"use client";

import { useAuth } from "@/lib/auth/AuthProvider";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import React from "react";

interface Props {
  href: string;
  type: "teacher" | "institution";
  className?: string;
  style?: React.CSSProperties;
  children: ReactNode;
}

export default function AuthGuardedLink({ href, type, className, style, children }: Props) {
  const { isAuthenticated, role, requireTeacher, requireInstitution } = useAuth();
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      if (type === "teacher") {
        requireTeacher(() => router.push(href));
      } else {
        requireInstitution(() => router.push(href));
      }
    } else {
      // Agencies can access both teacher profiles and job pages
      router.push(href);
    }
  };

  return (
    <button onClick={handleClick} className={className} style={style}>
      {children}
    </button>
  );
}
