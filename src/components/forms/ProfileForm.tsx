"use client";

import { useActionState, useState } from "react";
import { updateProfileAction } from "@/lib/actions/profile-actions";
import type { ActionState } from "@/lib/constants";
import SubmitButton from "@/components/forms/SubmitButton";

type Profile = {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  education: string;
  skills: string;
  experience: string;
  about: string;
  hasAadhaar: boolean;
};

const AADHAAR_MAX_BYTES = 1024 * 1024;

export default function ProfileForm({ profile }: { profile: Profile }) {
  const [state, formAction] = useActionState(updateProfileAction, {} as ActionState);
  const [fileError, setFileError] = useState<string | null>(null);

  function checkFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return setFileError(null);
    if (file.type !== "application/pdf" && !/\.pdf$/i.test(file.name)) {
      e.target.value = "";
      return setFileError("Aadhaar must be a PDF file.");
    }
    if (file.size > AADHAAR_MAX_BYTES) {
      e.target.value = "";
      return setFileError("Aadhaar PDF must be under 1 MB.");
    }
    setFileError(null);
  }

  const error = fileError ?? state?.error;

  return (
    <form action={formAction} className="space-y-6">
      {error && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      {state?.success && !error && (
        <p role="status" className="rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-700">
          ✓ Profile updated.
        </p>
      )}

      <section className="card space-y-4 p-5 sm:p-6">
        <h2 className="font-display text-lg font-bold text-ink">Personal details</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name" htmlFor="fullName">
            <input id="fullName" name="fullName" required maxLength={100} defaultValue={profile.fullName} className="input" />
          </Field>
          <Field label="Email" htmlFor="email">
            <input id="email" value={profile.email} readOnly disabled className="input bg-canvas text-muted" />
          </Field>
          <Field label="Mobile number" htmlFor="phone">
            <input id="phone" name="phone" type="tel" inputMode="numeric" placeholder="98765 43210" defaultValue={profile.phone} className="input" />
          </Field>
          <Field label="Location" htmlFor="location">
            <input id="location" name="location" placeholder="e.g. Bahadrabad, Haridwar" defaultValue={profile.location} className="input" />
          </Field>
        </div>
        <Field label="About you" htmlFor="about">
          <textarea id="about" name="about" rows={3} maxLength={1000} className="textarea" placeholder="A short introduction companies will see." defaultValue={profile.about} />
        </Field>
      </section>

      <section className="card space-y-4 p-5 sm:p-6">
        <h2 className="font-display text-lg font-bold text-ink">Education &amp; experience</h2>
        <Field label="Education" htmlFor="education">
          <input id="education" name="education" placeholder="e.g. ITI Electrician, Diploma in Mechanical" defaultValue={profile.education} className="input" />
        </Field>
        <Field label="Skills" htmlFor="skills">
          <input id="skills" name="skills" maxLength={500} placeholder="e.g. CNC operation, welding, MS Excel" defaultValue={profile.skills} className="input" />
        </Field>
        <Field label="Work experience" htmlFor="experience">
          <textarea id="experience" name="experience" rows={4} maxLength={1000} className="textarea" placeholder="Previous roles, companies and years of experience." defaultValue={profile.experience} />
        </Field>
      </section>

      <section className="card space-y-3 p-5 sm:p-6">
        <h2 className="font-display text-lg font-bold text-ink">Aadhaar card</h2>
        <p className="text-sm text-muted">
          {profile.hasAadhaar
            ? "Your Aadhaar is on file. Upload a new PDF only to replace it."
            : "No Aadhaar on file yet."}{" "}
          Single PDF with both sides, maximum 1 MB.
        </p>
        <input
          id="aadhaarDocument"
          name="aadhaarDocument"
          type="file"
          accept="application/pdf,.pdf"
          onChange={checkFile}
          className="input cursor-pointer file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-accent file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white"
        />
      </section>

      <SubmitButton pendingText="Saving…" className="btn btn-primary w-full sm:w-auto sm:px-10">
        Save changes
      </SubmitButton>
    </form>
  );
}

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="field-label" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
    </div>
  );
}
