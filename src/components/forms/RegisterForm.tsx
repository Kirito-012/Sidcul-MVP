"use client";

import { useActionState, useState } from "react";
import { registerAction } from "@/lib/actions/auth-actions";
import { SECTORS, type ActionState } from "@/lib/constants";
import SubmitButton from "@/components/forms/SubmitButton";

export default function RegisterForm() {
  const [state, formAction] = useActionState(registerAction, {} as ActionState);
  const [role, setRole] = useState<"STUDENT" | "COMPANY">("STUDENT");

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}

      {/* Role selector */}
      <input type="hidden" name="role" value={role} />
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setRole("STUDENT")}
          className={`rounded-lg border px-3 py-3 text-sm font-semibold transition ${
            role === "STUDENT"
              ? "border-brand bg-brand-50 text-brand-600"
              : "border-line bg-white text-ink-700 hover:border-brand/40"
          }`}
        >
          I&apos;m a student
        </button>
        <button
          type="button"
          onClick={() => setRole("COMPANY")}
          className={`rounded-lg border px-3 py-3 text-sm font-semibold transition ${
            role === "COMPANY"
              ? "border-brand bg-brand-50 text-brand-600"
              : "border-line bg-white text-ink-700 hover:border-brand/40"
          }`}
        >
          I&apos;m a company
        </button>
      </div>

      <div>
        <label className="field-label" htmlFor="name">
          {role === "COMPANY" ? "Contact / HR name" : "Full name"}
        </label>
        <input id="name" name="name" required className="input" />
      </div>

      {role === "COMPANY" && (
        <>
          <div>
            <label className="field-label" htmlFor="companyName">
              Company name
            </label>
            <input id="companyName" name="companyName" className="input" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="field-label" htmlFor="sector">
                Sector
              </label>
              <select id="sector" name="sector" className="select">
                <option value="">Select…</option>
                {SECTORS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="field-label" htmlFor="location">
                Location
              </label>
              <input
                id="location"
                name="location"
                className="input"
                placeholder="SIDCUL, Haridwar"
              />
            </div>
          </div>
          <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
            Company accounts are reviewed by an admin before you can post jobs.
          </p>
        </>
      )}

      <div>
        <label className="field-label" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="input"
        />
      </div>
      <div>
        <label className="field-label" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={6}
          className="input"
          placeholder="At least 6 characters"
        />
      </div>

      <SubmitButton pendingText="Creating account…">
        Create account
      </SubmitButton>
    </form>
  );
}
