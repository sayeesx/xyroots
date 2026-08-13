"use client";

import { useAuth } from "@/lib/auth/AuthProvider";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

interface Props {
  href: string;
  type: "teacher" | "institution";
  className?: string;
  children: ReactNode;
}

export default function AuthGuardedLink({ href, type, className, children }: Props) {
  const { isAuthenticated, requireTeacher, requireInstitution } = useAuth();
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
      router.push(href);
    }
  };

  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  );
}
