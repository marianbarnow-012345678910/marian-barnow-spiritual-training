import Link from "next/link";
import { adminCountClients, adminListContent } from "@/lib/admin-data";
import { formatDateTime, formatMinutes } from "@/lib/format";

export default async function AdminContentPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const [items, clients] = await Promise.all([adminListContent(), adminCountClients()]);

  return (
    <>
      {sp.saved && <p className="notice notice-ok" style={{ marginBottom: 20 }}>Saved. Clients see the change right away.</p>}
      {sp.deleted && <p className="notice" style={{ marginBottom: 20 }}>Deleted.</p>}

      <div className="section-head">
        <p className="muted">
          {clients} {clients === 1 ? "client has" : "clients have"} an account.
        </p>
        <Link className="btn btn-small" href="/admin/content/new">
          Add meditation or webinar
        </Link>
      </div>

      {items.length > 0 ? (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>When / length</th>
                <th>Visible</th>
                <th>
                  <span className="visually-hidden">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((i) => (
                <tr key={i.id}>
                  <td>{i.title}</td>
                  <td>{i.kind === "meditation" ? "Meditation" : i.live_at ? "Live webinar" : "Webinar recording"}</td>
                  <td>{i.live_at ? formatDateTime(i.live_at) : formatMinutes(i.duration_minutes)}</td>
                  <td>{i.published ? "Yes" : "Hidden"}</td>
                  <td className="actions">
                    <Link className="btn btn-quiet btn-small" href={`/admin/content/${i.id}`}>
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty">
          <p>Nothing here yet. Add your first meditation — a YouTube (unlisted) or Vimeo link is all you need.</p>
          <Link className="btn" href="/admin/content/new">
            Add meditation or webinar
          </Link>
        </div>
      )}
    </>
  );
}
