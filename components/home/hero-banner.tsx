import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-primary">
      <div className="mx-auto max-w-7xl px-4 py-12 md:py-20">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          {/* Content */}
          <div className="text-center lg:text-left">
            <span className="mb-4 inline-block rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-accent-foreground">
              New Arrivals 2026
            </span>
            <h1 className="mb-4 text-balance text-4xl font-bold tracking-tight text-primary-foreground md:text-5xl lg:text-6xl">
              Discover the Latest in Tech Innovation
            </h1>
            <p className="mb-8 text-pretty text-lg text-primary-foreground/80 md:text-xl">
              Shop premium electronics from top brands. Free shipping on orders
              over $50 and 30-day hassle-free returns.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <Button
                size="lg"
                variant="secondary"
                className="gap-2 text-base"
                asChild
              >
                <Link href="/products">
                  Shop Now
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/30 bg-transparent text-base text-primary-foreground hover:bg-primary-foreground/10"
                asChild
              >
                <Link href="/products?filter=deals">View Best Deals</Link>
              </Button>
            </div>
          </div>

          {/* Hero image */}
          <div className="relative hidden lg:block">
            <div className="relative aspect-square">
              <Image
                src="https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=600&h=600&fit=crop"
                alt="Latest electronics and gadgets"
                fill
                className="rounded-2xl object-cover"
                priority
              />
              {/* Floating badge */}
              <div className="absolute -left-4 bottom-12 rounded-xl bg-card p-4 shadow-xl">
                <p className="text-sm font-medium text-muted-foreground">
                  Starting from
                </p>
                <p className="text-2xl font-bold text-foreground">$39</p>
              </div>
              <div className="absolute -right-4 top-12 rounded-xl bg-accent p-4 text-center shadow-xl">
                <p className="text-2xl font-bold text-accent-foreground">50%</p>
                <p className="text-sm font-medium text-accent-foreground">OFF</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
      <div className="absolute -left-24 top-0 h-64 w-64 rounded-full bg-primary-foreground/10 blur-3xl" />
    </section>
  );
}
