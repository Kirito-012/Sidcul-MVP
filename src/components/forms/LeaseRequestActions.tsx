"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { updateLeaseRequestStatusAction } from "@/lib/actions/equipment-actions";
import type { ActionState } from "@/lib/constants";

export default function LeaseRequestActions({ leaseRequestId }: { leaseRequestId: string }) {
  const [state, formAction] = useActionState(
    updateLeaseRequestStatusAction,
    {} as ActionState,
  );

  return (
    <form action={formAction} className="flex flex-col items-end gap-2">
      <input type="hidden" name="leaseRequestId" value={leaseRequestId} />
      <div className="flex items-center gap-2">
        <Buttons />
      </div>
      {state?.error && (
        <p className="text-right text-sm text-red-700">{state.error}</p>
      )}
    </form>
  );
}

function Buttons() {
  const { pending } = useFormStatus();
  return (
    <>
      <button
        type="submit"
        name="status"
        value="REJECTED"
        disabled={pending}
        className="btn btn-outline btn-sm"
      >
        Decline
      </button>
      <button
        type="submit"
        name="status"
        value="ACCEPTED"
        disabled={pending}
        className="btn btn-primary btn-sm"
      >
        Accept
      </button>
    </>
  );
}
