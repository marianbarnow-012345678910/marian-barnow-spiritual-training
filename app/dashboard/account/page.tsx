import { PasswordForm, ProfileForm } from "@/components/AccountForms";
import { requireUser } from "@/lib/auth";

export const metadata = { title: "Your account" };

export default async function AccountPage() {
  const user = await requireUser();
  return (
    <>
      <header className="page-head">
        <h1>Your account</h1>
      </header>
      <section className="panel">
        <h2>Your details</h2>
        <ProfileForm fullName={user.fullName} email={user.email} />
      </section>
      <section className="panel">
        <h2>Password</h2>
        <PasswordForm />
      </section>
      <section className="panel">
        <h2>Sign out</h2>
        <p className="muted">You&apos;ll need your e-mail and password to come back in.</p>
        <form action="/auth/signout" method="post">
          <button className="btn btn-quiet" type="submit">
            Sign out
          </button>
        </form>
      </section>
    </>
  );
}
