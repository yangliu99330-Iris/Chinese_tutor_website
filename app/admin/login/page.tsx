"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error ?? "Login failed.");
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border p-8 max-w-sm w-full"
        style={{ borderColor: "#F8ECE1" }}
      >
        <h1 className="font-playfair text-2xl font-bold text-gray-900 mb-1">Admin</h1>
        <p className="text-sm text-gray-400 mb-6">Enter the password to manage your schedule.</p>

        <input
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-lg px-3 py-2.5 text-sm mb-4"
          style={{ borderColor: "#F8ECE1" }}
          placeholder="Password"
        />

        {error && (
          <p className="text-sm rounded-lg px-3 py-2 mb-4" style={{ backgroundColor: "#FEF2F2", color: "#B91C1C" }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 rounded-xl font-bold text-sm text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: "#B668BD" }}
        >
          {submitting ? "Checking…" : "Log In"}
        </button>
      </form>
    </div>
  );
}
