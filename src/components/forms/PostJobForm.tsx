"use client";

import { useActionState } from "react";
import { createJobAction } from "@/lib/actions/job-actions";
import { JOB_TYPES, type ActionState } from "@/lib/constants";
import SubmitButton from "@/components/forms/SubmitButton";

export default function PostJobForm() {
  const [state, formAction] = useActionState(createJobAction, {} as ActionState);

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <div>
        <label className="field-label" htmlFor="title">
          Job title
        </label>
        <input
          id="title"
          name="title"
          required
          className="input"
          placeholder="e.g. Production Operator — Tablet Section"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="jobType">
            Job type
          </label>
          <select id="jobType" name="jobType" className="select" defaultValue="FULL_TIME">
            {JOB_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
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
            required
            className="input"
            placeholder="Haridwar"
          />
        </div>
      </div>

      <div>
        <label className="field-label" htmlFor="salary">
          Salary / stipend{" "}
          <span className="font-normal text-muted">(optional)</span>
        </label>
        <input
          id="salary"
          name="salary"
          className="input"
          placeholder="e.g. ₹18,000–22,000 / month"
        />
      </div>

      <div>
        <label className="field-label" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={6}
          className="textarea"
          placeholder="Responsibilities, required qualifications (ITI / diploma / degree), certifications, shift details…"
        />
      </div>

      <SubmitButton pendingText="Posting…">Post job</SubmitButton>
    </form>
  );
}
