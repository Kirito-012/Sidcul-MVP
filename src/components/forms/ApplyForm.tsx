"use client";

import { useActionState } from "react";
import { applyAction } from "@/lib/actions/job-actions";
import type { ActionState } from "@/lib/constants";
import SubmitButton from "@/components/forms/SubmitButton";

export default function ApplyForm({ jobId }: { jobId: string }) {
  const [state, formAction] = useActionState(applyAction, {} as ActionState);

  if (state?.success) {
    return (
      <div className="rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
        ✓ Application submitted! The company can now see your profile
        {" "}and résumé.
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="jobId" value={jobId} />
      {state?.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}
      <div>
        <label className="field-label" htmlFor="resume">
          Résumé{" "}
          <span className="font-normal text-muted">(PDF or Word, max 4 MB)</span>
        </label>
        <input
          id="resume"
          name="resume"
          type="file"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="block w-full text-sm text-ink-700 file:mr-3 file:rounded-lg file:border-0 file:bg-ink file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-ink-700"
        />
      </div>
      <div>
        <label className="field-label" htmlFor="coverNote">
          Cover note <span className="font-normal text-muted">(optional)</span>
        </label>
        <textarea
          id="coverNote"
          name="coverNote"
          rows={4}
          className="textarea"
          placeholder="Tell the company why you're a good fit — relevant skills, certifications, availability…"
        />
      </div>
      <SubmitButton pendingText="Submitting…">Apply now</SubmitButton>
    </form>
  );
}
