import Link from "next/link";
import { getFeaturedProducts } from "@/lib/products";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function FeaturedProducts() {
  const featuredProducts = getFeaturedProducts();

  return (
    <section className="bg-muted/50 py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div>
            <h2 className="text-3xl font-bold text-foreground">
              Featured Products
            </h2>
            <p className="text-muted-foreground">
              Handpicked selections from our top categories
            </p>
          </div>
          <Button variant="outline" asChild className="gap-2">
            <Link href="/products">
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
