"use client";

import { useActionState } from "react";
import { changePassword, updateProfile } from "@/app/dashboard/actions";
import { SubmitButton } from "@/components/SubmitButton";

type S = { error?: string; message?: string } | undefined;

function Feedback({ state }: { state: S }) {
  if (state?.error) return <p className="notice notice-error" role="alert">{state.error}</p>;
  if (state?.message) return <p className="notice notice-ok" role="status">{state.message}</p>;
  return null;
}

export function ProfileForm({ fullName, email }: { fullName: string; email: string }) {
  const [state, action] = useActionState(updateProfile, undefined);
  return (
    <form action={action}>
      <Feedback state={state} />
      <div className="grid-2">
        <div className="field">
          <label htmlFor="full_name">Name</label>
          <input className="input" id="full_name" name="full_name" defaultValue={fullName} autoComplete="name" required />
        </div>
        <div className="field">
          <label htmlFor="email">E-mail</label>
          <input className="input" id="email" value={email} readOnly aria-describedby="email-hint" />
          <span className="hint" id="email-hint">
            To change your e-mail, write to Marian.
          </span>
        </div>
      </div>
      <div>
        <SubmitButton className="btn" pendingText="Saving…">
          Save name
        </SubmitButton>
      </div>
    </form>
  );
}

export function PasswordForm() {
  const [state, action] = useActionState(changePassword, undefined);
  return (
    <form action={action}>
      <Feedback state={state} />
      <div className="field">
        <label htmlFor="password">New password</label>
        <input className="input" id="password" name="password" type="password" autoComplete="new-password" minLength={8} required />
        <span className="hint">At least 8 characters.</span>
      </div>
      <div>
        <SubmitButton className="btn" pendingText="Saving…">
          Change password
        </SubmitButton>
      </div>
    </form>
  );
}
