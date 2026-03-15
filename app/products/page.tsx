import { Suspense } from "react";
import { ProductGrid } from "@/components/products/product-grid";
import { Spinner } from "@/components/ui/spinner";

export const metadata = {
  title: "Products | ElectroStore",
  description:
    "Browse our full catalog of electronics including mobiles, laptops, tablets, headphones, gaming consoles, and accessories.",
};

export default function ProductsPage() {
  return (
    <div className="bg-background py-8">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">All Products</h1>
          <p className="text-muted-foreground">
            Browse our complete collection of electronics and gadgets
          </p>
        </div>

        <Suspense
          fallback={
            <div className="flex items-center justify-center py-20">
              <Spinner className="h-8 w-8" />
            </div>
          }
        >
          <ProductGrid />
        </Suspense>
      </div>
    </div>
  );
}
