"use client";

import Link from "next/link";
import { useActionState } from "react";
import { requestReset, signIn, signUp, updatePassword, type FormState } from "@/app/auth/actions";
import { SubmitButton } from "@/components/SubmitButton";

function Feedback({ state }: { state: FormState }) {
  if (state?.error)
    return (
      <p className="notice notice-error" role="alert">
        {state.error}
      </p>
    );
  if (state?.message)
    return (
      <p className="notice notice-ok" role="status">
        {state.message}
      </p>
    );
  return null;
}

export function SignInForm({ next, linkError, demo }: { next: string; linkError: boolean; demo: boolean }) {
  const [state, action] = useActionState(signIn, undefined);
  return (
    <form action={action}>
      {linkError && !state && (
        <p className="notice notice-error" role="alert">
          That link has expired or was already used. Sign in, or request a new password link.
        </p>
      )}
      <Feedback state={state} />
      <input type="hidden" name="next" value={next} />
      <div className="field">
        <label htmlFor="email">E-mail</label>
        <input className="input" id="email" name="email" type="email" autoComplete="email" required={!demo} />
      </div>
      <div className="field">
        <label htmlFor="password">Password</label>
        <input className="input" id="password" name="password" type="password" autoComplete="current-password" required={!demo} />
      </div>
      <SubmitButton pendingText="Signing in…">Sign in</SubmitButton>
      <p className="small">
        <Link className="link" href="/forgot-password">
          Forgot your password?
        </Link>
      </p>
    </form>
  );
}

export function SignUpForm({ demo }: { demo: boolean }) {
  const [state, action] = useActionState(signUp, undefined);
  if (state?.message) return <Feedback state={state} />;
  return (
    <form action={action}>
      <Feedback state={state} />
      <div className="field">
        <label htmlFor="full_name">Your name</label>
        <input className="input" id="full_name" name="full_name" autoComplete="name" required={!demo} />
      </div>
      <div className="field">
        <label htmlFor="email">E-mail</label>
        <input className="input" id="email" name="email" type="email" autoComplete="email" required={!demo} />
      </div>
      <div className="field">
        <label htmlFor="password">Password</label>
        <input
          className="input"
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={demo ? undefined : 8}
          required={!demo}
          aria-describedby="pw-hint"
        />
        <span className="hint" id="pw-hint">
          At least 8 characters.
        </span>
      </div>
      <SubmitButton pendingText="Creating your account…">Create my free account</SubmitButton>
    </form>
  );
}

export function ResetRequestForm() {
  const [state, action] = useActionState(requestReset, undefined);
  return (
    <form action={action}>
      <Feedback state={state} />
      <div className="field">
        <label htmlFor="email">E-mail</label>
        <input className="input" id="email" name="email" type="email" autoComplete="email" required />
      </div>
      <SubmitButton pendingText="Sending…">Send reset link</SubmitButton>
    </form>
  );
}

export function NewPasswordForm() {
  const [state, action] = useActionState(updatePassword, undefined);
  return (
    <form action={action}>
      <Feedback state={state} />
      <div className="field">
        <label htmlFor="password">New password</label>
        <input className="input" id="password" name="password" type="password" autoComplete="new-password" minLength={8} required />
        <span className="hint">At least 8 characters.</span>
      </div>
      <SubmitButton pendingText="Saving…">Save new password</SubmitButton>
    </form>
  );
}
