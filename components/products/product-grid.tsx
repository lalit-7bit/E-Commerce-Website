"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { products, searchProducts } from "@/lib/products";
import type { Category, FilterState, Product } from "@/lib/types";
import { ProductCard } from "@/components/product-card";
import { ProductFilters } from "./product-filters";
import { Empty } from "@/components/ui/empty";
import { SearchX } from "lucide-react";

function filterProducts(allProducts: Product[], filters: FilterState): Product[] {
  return allProducts.filter((product) => {
    // Category filter
    if (filters.category !== "all" && product.category !== filters.category) {
      return false;
    }

    // Price filter
    if (
      product.price < filters.priceRange[0] ||
      product.price > filters.priceRange[1]
    ) {
      return false;
    }

    // Brand filter
    if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) {
      return false;
    }

    return true;
  });
}

function sortProducts(products: Product[], sortBy: FilterState["sortBy"]): Product[] {
  const sorted = [...products];

  switch (sortBy) {
    case "price-low":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-high":
      return sorted.sort((a, b) => b.price - a.price);
    case "newest":
      return sorted; // In a real app, sort by date
    case "popularity":
    default:
      return sorted.sort((a, b) => b.reviewCount - a.reviewCount);
  }
}

export function ProductGrid() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") as Category | null;
  const searchQuery = searchParams.get("search");
  const dealsFilter = searchParams.get("filter") === "deals";

  const [filters, setFilters] = useState<FilterState>({
    category: categoryParam || "all",
    priceRange: [0, 3000],
    brands: [],
    sortBy: "popularity",
  });

  const filteredProducts = useMemo(() => {
    let baseProducts = products;

    // Apply search filter
    if (searchQuery) {
      baseProducts = searchProducts(searchQuery);
    }

    // Apply deals filter
    if (dealsFilter) {
      baseProducts = baseProducts.filter((p) => p.bestDeal || p.discount);
    }

    // Apply other filters
    const filtered = filterProducts(baseProducts, filters);

    // Sort products
    return sortProducts(filtered, filters.sortBy);
  }, [filters, searchQuery, dealsFilter]);

  // Update category filter when URL param changes
  useMemo(() => {
    if (categoryParam && categoryParam !== filters.category) {
      setFilters((prev) => ({ ...prev, category: categoryParam }));
    }
  }, [categoryParam, filters.category]);

  return (
    <div className="flex gap-8">
      <ProductFilters
        filters={filters}
        onFilterChange={setFilters}
        productCount={filteredProducts.length}
      />

      <div className="flex-1">
        {/* Desktop sort bar rendered by ProductFilters */}
        <div className="hidden lg:block">
          <ProductFilters
            filters={filters}
            onFilterChange={setFilters}
            productCount={filteredProducts.length}
          />
        </div>

        {filteredProducts.length === 0 ? (
          <Empty
            icon={SearchX}
            title="No products found"
            description="Try adjusting your filters or search query to find what you're looking for."
          />
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4 xl:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
