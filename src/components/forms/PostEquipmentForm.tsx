"use client";

import { useActionState } from "react";
import { createEquipmentAction } from "@/lib/actions/equipment-actions";
import { EQUIPMENT_CATEGORIES, type ActionState } from "@/lib/constants";
import SubmitButton from "@/components/forms/SubmitButton";

export default function PostEquipmentForm() {
  const [state, formAction] = useActionState(createEquipmentAction, {} as ActionState);

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <div>
        <label className="field-label" htmlFor="name">
          Equipment name
        </label>
        <input
          id="name"
          name="name"
          required
          className="input"
          placeholder="e.g. Tablet Compression Machine"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="category">
            Category
          </label>
          <select id="category" name="category" className="select" defaultValue="">
            <option value="">Select a category</option>
            {EQUIPMENT_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
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
        <label className="field-label" htmlFor="rate">
          Lease rate <span className="font-normal text-muted">(optional)</span>
        </label>
        <input
          id="rate"
          name="rate"
          className="input"
          placeholder="e.g. ₹5,000 / day"
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
          placeholder="Specs, condition, operating requirements, what's included…"
        />
      </div>

      <SubmitButton pendingText="Listing…">List equipment</SubmitButton>
    </form>
  );
}
