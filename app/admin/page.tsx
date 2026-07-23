import type { Metadata } from "next";
import AdminCalendar from "@/components/admin/AdminCalendar";

export const metadata: Metadata = {
  title: "Admin | Chinese Tutor Yang",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminCalendar />;
}
