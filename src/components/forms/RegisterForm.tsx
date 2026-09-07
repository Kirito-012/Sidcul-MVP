"use client";

import { useActionState, useState } from "react";
import { registerAction } from "@/lib/actions/auth-actions";
import {
  SECTORS,
  OTHER_SECTOR_VALUE,
  INDIAN_PHONE_RE,
  type ActionState,
} from "@/lib/constants";
import SubmitButton from "@/components/forms/SubmitButton";

const EMPTY = {
  name: "",
  companyName: "",
  sector: "",
  sectorOther: "",
  location: "",
  phone: "",
  email: "",
  password: "",
};

const DOC_INPUT_CLASS =
  "input cursor-pointer file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-accent file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white";

export default function RegisterForm() {
  const [state, formAction] = useActionState(registerAction, {} as ActionState);
  const [role, setRole] = useState<"STUDENT" | "COMPANY">("STUDENT");
  const [step, setStep] = useState<1 | 2>(1);
  const [stepError, setStepError] = useState<string | null>(null);

  // Controlled so values survive React 19's automatic form reset after a
  // (failed) action and the step 1 ⇄ step 2 toggle.
  const [f, setF] = useState({ ...EMPTY });
  const upd =
    (k: keyof typeof EMPTY) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setF((s) => ({ ...s, [k]: e.target.value }));

  function pickRole(next: "STUDENT" | "COMPANY") {
    setRole(next);
    setStep(1);
    setStepError(null);
  }

  function goToStep2() {
    if (!f.name.trim()) return setStepError("Contact / HR name is required.");
    if (!f.companyName.trim()) return setStepError("Company name is required.");
    if (f.sector === OTHER_SECTOR_VALUE && !f.sectorOther.trim()) {
      return setStepError("Please describe your sector.");
    }
    if (!INDIAN_PHONE_RE.test(f.phone.replace(/[\s-]/g, ""))) {
      return setStepError("Enter a valid Indian mobile number (10 digits).");
    }
    setStepError(null);
    setStep(2);
  }

  return (
    <form action={formAction} className="space-y-4">
      {(state?.error || stepError) && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {stepError ?? state.error}
        </p>
      )}

      {/* Role selector */}
      <input type="hidden" name="role" value={role} />
      <div className="grid grid-cols-2 gap-2">
        {(["STUDENT", "COMPANY"] as const).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => pickRole(r)}
            className={`cursor-pointer rounded-lg border px-3 py-3 text-sm font-semibold transition-colors ${
              role === r
                ? "border-brand bg-brand-50 text-brand-600"
                : "border-line bg-white text-ink-700 hover:border-brand/40"
            }`}
          >
            {r === "STUDENT" ? "I'm a student" : "I'm a company"}
          </button>
        ))}
      </div>

      {/* ---------------- STUDENT: single step ---------------- */}
      {role === "STUDENT" && (
        <>
          <Field label="Full name" htmlFor="name">
            <input
              id="name"
              name="name"
              required
              className="input"
              value={f.name}
              onChange={upd("name")}
            />
          </Field>
          <Field label="Email" htmlFor="email">
            <input
              id="email"
              name="email"
              type="email"
              required
              className="input"
              value={f.email}
              onChange={upd("email")}
            />
          </Field>
          <Field label="Password" htmlFor="password">
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              className="input"
              placeholder="At least 6 characters"
              value={f.password}
              onChange={upd("password")}
            />
          </Field>
          <SubmitButton pendingText="Creating account…">
            Create account
          </SubmitButton>
        </>
      )}

      {/* ---------------- COMPANY: two steps ---------------- */}
      {role === "COMPANY" && (
        <>
          <Stepper step={step} />

          {/* Step 1 — company details */}
          <div className={step === 1 ? "space-y-4" : "hidden"}>
            <Field label="Contact / HR name" htmlFor="name">
              <input
                id="name"
                name="name"
                className="input"
                value={f.name}
                onChange={upd("name")}
              />
            </Field>

            <Field label="Company name" htmlFor="companyName">
              <input
                id="companyName"
                name="companyName"
                className="input"
                value={f.companyName}
                onChange={upd("companyName")}
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Sector" htmlFor="sector">
                <select
                  id="sector"
                  name="sector"
                  className="select"
                  value={f.sector}
                  onChange={upd("sector")}
                >
                  <option value="">Select…</option>
                  {SECTORS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Location" htmlFor="location">
                <input
                  id="location"
                  name="location"
                  className="input"
                  placeholder="SIDCUL, Haridwar"
                  value={f.location}
                  onChange={upd("location")}
                />
              </Field>
            </div>

            {f.sector === OTHER_SECTOR_VALUE && (
              <Field label="Tell us your sector" htmlFor="sectorOther">
                <input
                  id="sectorOther"
                  name="sectorOther"
                  className="input"
                  placeholder="e.g. Textiles"
                  value={f.sectorOther}
                  onChange={upd("sectorOther")}
                />
              </Field>
            )}

            <Field label="Phone number" htmlFor="phone">
              <input
                id="phone"
                name="phone"
                type="tel"
                inputMode="numeric"
                className="input"
                placeholder="98765 43210"
                value={f.phone}
                onChange={upd("phone")}
              />
            </Field>

            <Field label="GST number" htmlFor="gstDocument">
              <input
                id="gstDocument"
                name="gstDocument"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className={DOC_INPUT_CLASS}
              />
            </Field>

            <Field label="EM Part 1" htmlFor="emDocument">
              <input
                id="emDocument"
                name="emDocument"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className={DOC_INPUT_CLASS}
              />
            </Field>

            <button
              type="button"
              className="btn btn-primary w-full"
              onClick={goToStep2}
            >
              Continue
            </button>
          </div>

          {/* Step 2 — account login */}
          <div className={step === 2 ? "space-y-4" : "hidden"}>
            <Field label="Work email" htmlFor="email">
              <input
                id="email"
                name="email"
                type="email"
                required={step === 2}
                className="input"
                value={f.email}
                onChange={upd("email")}
              />
            </Field>
            <Field label="Password" htmlFor="password">
              <input
                id="password"
                name="password"
                type="password"
                required={step === 2}
                minLength={6}
                className="input"
                placeholder="At least 6 characters"
                value={f.password}
                onChange={upd("password")}
              />
            </Field>

            <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
              Company accounts are reviewed by an admin before you can post
              jobs.
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  setStepError(null);
                  setStep(1);
                }}
              >
                Back
              </button>
              <SubmitButton
                pendingText="Creating account…"
                className="btn btn-primary flex-1"
              >
                Create account
              </SubmitButton>
            </div>
          </div>
        </>
      )}
    </form>
  );
}

function Stepper({ step }: { step: 1 | 2 }) {
  return (
    <div className="flex items-center gap-2 text-xs font-semibold text-muted">
      <span className={step === 1 ? "text-ink" : ""}>1. Company details</span>
      <span className="h-px flex-1 bg-line" />
      <span className={step === 2 ? "text-ink" : ""}>2. Account login</span>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="field-label" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
    </div>
  );
}
