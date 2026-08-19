"use client";

import { useActionState } from "react";
import { createLeaseRequestAction } from "@/lib/actions/equipment-actions";
import type { ActionState } from "@/lib/constants";
import SubmitButton from "@/components/forms/SubmitButton";

export default function LeaseRequestForm({ equipmentId }: { equipmentId: string }) {
  const [state, formAction] = useActionState(createLeaseRequestAction, {} as ActionState);

  if (state?.success) {
    return (
      <div className="rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
        ✓ Lease request sent! The company will review your requested dates.
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="equipmentId" value={equipmentId} />
      {state?.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="field-label" htmlFor="startDate">
            From
          </label>
          <input id="startDate" name="startDate" type="date" required className="input" />
        </div>
        <div>
          <label className="field-label" htmlFor="endDate">
            To
          </label>
          <input id="endDate" name="endDate" type="date" required className="input" />
        </div>
      </div>
      <div>
        <label className="field-label" htmlFor="message">
          Message <span className="font-normal text-muted">(optional)</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className="textarea"
          placeholder="Intended use, delivery/pickup details, any questions…"
        />
      </div>
      <SubmitButton pendingText="Sending…">Request lease</SubmitButton>
    </form>
  );
}
