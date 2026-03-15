import Link from "next/link";
import { categories } from "@/lib/products";
import {
  Smartphone,
  Laptop,
  Tablet,
  Headphones,
  Gamepad2,
  Cable,
} from "lucide-react";

const categoryIcons: Record<string, React.ReactNode> = {
  smartphone: <Smartphone className="h-8 w-8" />,
  laptop: <Laptop className="h-8 w-8" />,
  tablet: <Tablet className="h-8 w-8" />,
  headphones: <Headphones className="h-8 w-8" />,
  "gamepad-2": <Gamepad2 className="h-8 w-8" />,
  cable: <Cable className="h-8 w-8" />,
};

const categoryImages: Record<string, string> = {
  mobiles: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=200&fit=crop",
  laptops: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=200&fit=crop",
  tablets: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&h=200&fit=crop",
  headphones: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop",
  gaming: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=300&h=200&fit=crop",
  accessories: "https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=300&h=200&fit=crop",
};

export function CategoryGrid() {
  return (
    <section className="bg-background py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-8 text-center">
          <h2 className="mb-2 text-3xl font-bold text-foreground">
            Shop by Category
          </h2>
          <p className="text-muted-foreground">
            Browse our wide selection of electronic categories
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.id}`}
              className="group relative overflow-hidden rounded-xl bg-card transition-all hover:shadow-lg"
            >
              {/* Background image */}
              <div
                className="aspect-square bg-cover bg-center opacity-20 transition-opacity group-hover:opacity-30"
                style={{ backgroundImage: `url(${categoryImages[category.id]})` }}
              />

              {/* Content overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                <div className="mb-3 rounded-full bg-primary/10 p-4 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  {categoryIcons[category.icon]}
                </div>
                <span className="text-center font-semibold text-foreground">
                  {category.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
