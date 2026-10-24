import Link from "next/link";
import { ContentForm } from "@/components/ContentForm";

export default function NewContentPage() {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <Link className="back" href="/admin">
        ← Content
      </Link>
      <h2>Add a meditation or webinar</h2>
      <ContentForm />
    </div>
  );
}
