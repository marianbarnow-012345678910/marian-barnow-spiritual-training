import { resolveBooking } from "@/app/admin/actions";
import { adminListBookings } from "@/lib/admin-data";
import { formatDateTime, formatPrice } from "@/lib/format";

export default async function AdminBookingsPage() {
  const bookings = await adminListBookings();
  const attention = bookings.filter((b) => b.status === "needs_attention");
  const now = Date.now();
  const upcoming = bookings.filter((b) => b.status !== "needs_attention" && new Date(b.ends_at).getTime() >= now);

  return (
    <div style={{ display: "grid", gap: 28 }}>
      {attention.length > 0 && (
        <section style={{ display: "grid", gap: 12 }}>
          <h2>Paid, but not yet on the Momence roster</h2>
          <p className="muted" style={{ maxWidth: "64ch" }}>
            These clients paid by card, but Momence refused the automatic booking. Add them to the class in Momence by
            hand, then mark the booking as done here.
          </p>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Class</th>
                  <th>Reason</th>
                  <th>
                    <span className="visually-hidden">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {attention.map((b) => (
                  <tr key={b.id}>
                    <td>
                      {b.client_name}
                      <br />
                      <span className="muted small">{b.client_email}</span>
                    </td>
                    <td>
                      {b.session_name}
                      <br />
                      <span className="muted small">{formatDateTime(b.starts_at)}</span>
                    </td>
                    <td className="small">{b.error}</td>
                    <td className="actions">
                      <form action={resolveBooking}>
                        <input type="hidden" name="id" value={b.id} />
                        <button className="btn btn-small" type="submit">
                          Added in Momence
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section style={{ display: "grid", gap: 12 }}>
        <h2>Upcoming bookings</h2>
        {upcoming.length > 0 ? (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Class</th>
                  <th>Client</th>
                  <th>Paid</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {upcoming.map((b) => (
                  <tr key={b.id}>
                    <td>
                      {b.session_name}
                      <br />
                      <span className="muted small">{formatDateTime(b.starts_at)}</span>
                    </td>
                    <td>
                      {b.client_name}
                      <br />
                      <span className="muted small">{b.client_email}</span>
                    </td>
                    <td>{formatPrice(b.amount_cents, b.currency)}</td>
                    <td>{b.status === "confirmed" ? "On the roster" : b.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty">
            <p>No upcoming bookings through the portal yet. Bookings made directly in Momence show up in Momence.</p>
          </div>
        )}
      </section>
    </div>
  );
}
