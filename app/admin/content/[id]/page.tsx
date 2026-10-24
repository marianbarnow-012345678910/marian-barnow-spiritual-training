import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteContent } from "@/app/admin/actions";
import { ContentForm } from "@/components/ContentForm";
import { adminGetContent } from "@/lib/admin-data";

export default async function EditContentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await adminGetContent(id);
  if (!item) notFound();
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <Link className="back" href="/admin">
        ← Content
      </Link>
      <h2>Edit “{item.title}”</h2>
      <ContentForm item={item} />
      <form action={deleteContent} className="panel" style={{ maxWidth: 760 }}>
        <input type="hidden" name="id" value={item.id} />
        <p className="muted small">Deleting removes it for every client. To take it offline temporarily, untick “Visible to clients” instead.</p>
        <div>
          <button className="btn btn-quiet" type="submit">
            Delete permanently
          </button>
        </div>
      </form>
    </div>
  );
}
