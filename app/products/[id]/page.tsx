import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductById, getProductsByCategory } from "@/lib/products";
import { ProductGallery } from "@/components/products/product-gallery";
import { ProductInfo } from "@/components/products/product-info";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    return { title: "Product Not Found | ElectroStore" };
  }

  return {
    title: `${product.name} | ElectroStore`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    notFound();
  }

  // Get related products from the same category
  const relatedProducts = getProductsByCategory(product.category)
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="bg-background py-8">
      <div className="mx-auto max-w-7xl px-4">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild className="gap-1 px-0">
            <Link href="/products">
              <ChevronLeft className="h-4 w-4" />
              Back to Products
            </Link>
          </Button>
        </div>

        {/* Product details */}
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <ProductGallery product={product} />
          <ProductInfo product={product} />
        </div>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-6 text-2xl font-bold text-foreground">
              Related Products
            </h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
