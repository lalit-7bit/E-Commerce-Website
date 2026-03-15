"use client";

import { categories, getAllBrands } from "@/lib/products";
import type { Category, FilterState, SortOption } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Filter, X } from "lucide-react";

interface ProductFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  productCount: number;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "popularity", label: "Most Popular" },
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
];

function FilterContent({
  filters,
  onFilterChange,
}: Omit<ProductFiltersProps, "productCount">) {
  const brands = getAllBrands();

  const handleCategoryChange = (category: Category | "all") => {
    onFilterChange({ ...filters, category });
  };

  const handlePriceChange = (value: number[]) => {
    onFilterChange({
      ...filters,
      priceRange: [value[0], value[1]] as [number, number],
    });
  };

  const handleBrandToggle = (brand: string) => {
    const newBrands = filters.brands.includes(brand)
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand];
    onFilterChange({ ...filters, brands: newBrands });
  };

  const clearFilters = () => {
    onFilterChange({
      category: "all",
      priceRange: [0, 3000],
      brands: [],
      sortBy: "popularity",
    });
  };

  const hasActiveFilters =
    filters.category !== "all" ||
    filters.brands.length > 0 ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 3000;

  return (
    <div className="space-y-6">
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="w-full gap-2 text-muted-foreground"
        >
          <X className="h-4 w-4" />
          Clear All Filters
        </Button>
      )}

      <Accordion
        type="multiple"
        defaultValue={["category", "price", "brand"]}
        className="w-full"
      >
        {/* Category Filter */}
        <AccordionItem value="category">
          <AccordionTrigger className="text-sm font-semibold">
            Category
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <button
                onClick={() => handleCategoryChange("all")}
                className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${
                  filters.category === "all"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${
                    filters.category === cat.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Price Range Filter */}
        <AccordionItem value="price">
          <AccordionTrigger className="text-sm font-semibold">
            Price Range
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 px-1">
              <Slider
                min={0}
                max={3000}
                step={50}
                value={[filters.priceRange[0], filters.priceRange[1]]}
                onValueChange={handlePriceChange}
                className="mt-2"
              />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  ${filters.priceRange[0]}
                </span>
                <span className="text-muted-foreground">
                  ${filters.priceRange[1]}
                </span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Brand Filter */}
        <AccordionItem value="brand">
          <AccordionTrigger className="text-sm font-semibold">
            Brand
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {brands.map((brand) => (
                <div key={brand} className="flex items-center gap-2">
                  <Checkbox
                    id={`brand-${brand}`}
                    checked={filters.brands.includes(brand)}
                    onCheckedChange={() => handleBrandToggle(brand)}
                  />
                  <Label
                    htmlFor={`brand-${brand}`}
                    className="cursor-pointer text-sm"
                  >
                    {brand}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

export function ProductFilters({
  filters,
  onFilterChange,
  productCount,
}: ProductFiltersProps) {
  const handleSortChange = (value: SortOption) => {
    onFilterChange({ ...filters, sortBy: value });
  };

  return (
    <>
      {/* Desktop filters sidebar */}
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="sticky top-32 rounded-lg border border-border bg-card p-4">
          <h2 className="mb-4 font-semibold text-foreground">Filters</h2>
          <FilterContent filters={filters} onFilterChange={onFilterChange} />
        </div>
      </aside>

      {/* Mobile filter header */}
      <div className="mb-4 flex items-center justify-between lg:hidden">
        <p className="text-sm text-muted-foreground">
          {productCount} products
        </p>
        <div className="flex items-center gap-2">
          <Select value={filters.sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
                <span className="sr-only">Filters</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <FilterContent filters={filters} onFilterChange={onFilterChange} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Desktop sort bar */}
      <div className="mb-4 hidden items-center justify-between lg:flex">
        <p className="text-sm text-muted-foreground">
          Showing {productCount} products
        </p>
        <Select value={filters.sortBy} onValueChange={handleSortChange}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
}
