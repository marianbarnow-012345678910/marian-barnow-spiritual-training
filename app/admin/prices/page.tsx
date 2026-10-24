import { deletePrice } from "@/app/admin/actions";
import { PriceForm } from "@/components/PriceForm";
import { adminListPricing } from "@/lib/admin-data";
import { config } from "@/lib/config";
import { formatPrice } from "@/lib/format";

export default async function PricesPage() {
  const prices = await adminListPricing();
  return (
    <div style={{ display: "grid", gap: 20 }}>
      <p className="muted" style={{ maxWidth: "62ch" }}>
        Momence doesn&apos;t share class prices through its API, so set them here. Any class without a match costs{" "}
        {formatPrice(config.defaultPriceCents, config.currency)}.
      </p>
      {prices.length > 0 && (
        <div className="table-wrap" style={{ maxWidth: 620 }}>
          <table className="table">
            <thead>
              <tr>
                <th>Class name contains</th>
                <th>Price</th>
                <th>
                  <span className="visually-hidden">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {prices.map((p) => (
                <tr key={p.id}>
                  <td>{p.name_match}</td>
                  <td>{formatPrice(p.price_cents, p.currency)}</td>
                  <td className="actions">
                    <form action={deletePrice}>
                      <input type="hidden" name="id" value={p.id} />
                      <button className="btn btn-quiet btn-small" type="submit">
                        Remove
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <section className="panel">
        <h2>Add a price</h2>
        <PriceForm />
      </section>
    </div>
  );
}
