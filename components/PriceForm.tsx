"use client";

import { useActionState } from "react";
import { addPrice } from "@/app/admin/actions";
import { SubmitButton } from "@/components/SubmitButton";

export function PriceForm() {
  const [state, action] = useActionState(addPrice, undefined);
  return (
    <form action={action}>
      {state?.error && <p className="notice notice-error" role="alert">{state.error}</p>}
      {state?.message && <p className="notice notice-ok" role="status">{state.message}</p>}
      <div className="grid-2">
        <div className="field">
          <label htmlFor="name_match">Class name in Momence</label>
          <input className="input" id="name_match" name="name_match" placeholder="Sacred Geometry 1" required />
          <span className="hint">Matches any class whose name contains this text.</span>
        </div>
        <div className="field">
          <label htmlFor="price">Price in €</label>
          <input className="input" id="price" name="price" inputMode="decimal" placeholder="20" required />
        </div>
      </div>
      <div>
        <SubmitButton className="btn" pendingText="Saving…">
          Add price
        </SubmitButton>
      </div>
    </form>
  );
}
