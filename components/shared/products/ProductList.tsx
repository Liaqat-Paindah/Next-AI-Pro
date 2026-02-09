import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Rating } from "./Rating";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Eye, ShoppingCart, Zap, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  images: string[];
  price: number;
  originalPrice?: number;
  brand: string;
  rating: number;
  numReviews: number;
  stock: number;
  isFeatured: boolean;
  isTrending?: boolean;
  isNew?: boolean;
  banner: string | null;
  tags?: string[];
  discount?: number;
  colors?: string[];
  sizes?: string[];
  weight?: number;
  dimensions?: string;
  sku: string;
};

type ProductListProps = {
  data: Product[];
  title?: string;
  limit?: number;
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
  variant?: "grid" | "list" | "compact";
  showActions?: boolean;
  showWishlist?: boolean;
  onQuickView?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  onAddToWishlist?: (product: Product) => void;
  className?: string;
};

export default function ProductList({
  data,
  title,
  limit,
  columns = 4,
  variant = "grid",
  showActions = true,
  showWishlist = true,
  onQuickView,
  onAddToCart,
  onAddToWishlist,
  className,
}: ProductListProps) {
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  if (!data?.length) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
          <ShoppingCart className="w-8 h-8 text-muted-foreground" />
        </div>
        <p className="text-lg font-medium">No products found</p>
        <p className="text-sm text-muted-foreground">
          Try adjusting your search or filter criteria
        </p>
      </div>
    );
  }

  const products = limit ? data.slice(0, limit) : data;

  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
    5: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
    6: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6",
  };

  const renderProductBadges = (product: Product) => {
    const badges = [];
    
    if (product.discount && product.discount > 0) {
      badges.push(
        <Badge 
          key="discount" 
          className="absolute top-2 left-2 bg-red-500 text-white border-0"
        >
          -{product.discount}%
        </Badge>
      );
    }
    
    if (product.isNew) {
      badges.push(
        <Badge 
          key="new" 
          className="absolute top-2 left-2 bg-green-500 text-white border-0"
        >
          NEW
        </Badge>
      );
    }
    
    if (product.isTrending) {
      badges.push(
        <Badge 
          key="trending" 
          className="absolute top-2 right-2 bg-purple-500 text-white border-0"
        >
          <TrendingUp className="w-3 h-3 mr-1" />
          Trending
        </Badge>
      );
    }
    
    if (product.stock <= 10 && product.stock > 0) {
      badges.push(
        <Badge 
          key="low-stock" 
          className="absolute bottom-2 left-2 bg-amber-500 text-white border-0"
        >
          Only {product.stock} left
        </Badge>
      );
    }
    
    return badges;
  };

  const renderProductImage = (product: Product) => (
    <div className="relative aspect-square bg-gray-50 to-gray-100 overflow-hidden">
      {/* Product Image */}
      <Image
        src={product.images?.[0] || "/placeholder.png"}
        alt={product.name}
        fill
        sizes="(max-width: 768px) 100vw, 25vw"
        className={cn(
          "object-cover transition-all duration-500",
          hoveredProduct === product.id 
            ? "scale-110 opacity-0" 
            : "scale-100 opacity-100"
        )}
        priority={product.isFeatured}
      />
      
      {/* Hover Image */}
      {product.images?.[1] && (
        <Image
          src={product.images[1]}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 25vw"
          className={cn(
            "object-cover transition-all duration-500 absolute inset-0",
            hoveredProduct === product.id 
              ? "scale-100 opacity-100" 
              : "scale-110 opacity-0"
          )}
        />
      )}
      
      {/* Badges */}
      {renderProductBadges(product)}
      
      {/* Quick Actions Overlay */}
      {showActions && (
        <div className={cn(
          "absolute inset-0 bg-black/40 opacity-0 transition-all duration-300",
          hoveredProduct === product.id && "opacity-100"
        )}>
          <div className="absolute inset-0 flex items-center justify-center gap-2">
            {onQuickView && (
              <Button
                size="icon"
                variant="secondary"
                className="rounded-full bg-white hover:bg-gray-100"
                onClick={(e) => {
                  e.preventDefault();
                  onQuickView(product);
                }}
              >
                <Eye className="w-4 h-4" />
              </Button>
            )}
            {onAddToCart && (
              <Button
                size="icon"
                variant="secondary"
                className="rounded-full bg-white hover:bg-gray-100"
                onClick={(e) => {
                  e.preventDefault();
                  onAddToCart(product);
                }}
              >
                <ShoppingCart className="w-4 h-4" />
              </Button>
            )}
            {showWishlist && onAddToWishlist && (
              <Button
                size="icon"
                variant="secondary"
                className="rounded-full bg-white hover:bg-gray-100"
                onClick={(e) => {
                  e.preventDefault();
                  onAddToWishlist(product);
                }}
              >
                <Heart className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderProductContent = (product: Product) => (
    <>
      {/* Category & Brand */}
      <div className="flex items-center justify-between mb-2">
        <Badge variant="outline" className="text-xs font-normal">
          {product.category}
        </Badge>
        <span className="text-xs text-muted-foreground">{product.brand}</span>
      </div>
      
      {/* Product Name */}
      <CardTitle className="line-clamp-2 text-base font-semibold mb-2 group-hover:text-primary transition-colors">
        {product.name}
      </CardTitle>
      
      {/* Description */}
      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
        {product.description}
      </p>
      
      {/* Price */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
        {product.originalPrice && product.originalPrice > product.price && (
          <span className="text-sm text-muted-foreground line-through">
            ${product.originalPrice.toFixed(2)}
          </span>
        )}
        {product.discount && product.discount > 0 && (
          <Badge variant="secondary" className="ml-auto">
            Save ${(product.originalPrice! - product.price).toFixed(2)}
          </Badge>
        )}
      </div>
      
      {/* Rating & Reviews */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1">
          <Rating rating={product.rating}  />
          <span className="text-xs text-muted-foreground">
            ({product.numReviews})
          </span>
        </div>
        {product.stock > 0 ? (
          <div className="flex items-center gap-1 text-xs text-green-600">
            <Zap className="w-3 h-3" />
            In Stock
          </div>
        ) : (
          <span className="text-xs text-red-500">Out of stock</span>
        )}
      </div>
      
      {/* Tags */}
      {product.tags && product.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {product.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </>
  );

  const renderProductActions = (product: Product) => (
    <div className="flex gap-2">
      {onAddToCart && (
        <Button
          size="sm"
          className="flex-1"
          disabled={product.stock === 0}
          onClick={(e) => {
            e.preventDefault();
            onAddToCart(product);
          }}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </Button>
      )}
      {showWishlist && onAddToWishlist && (
        <Button
          size="icon"
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
            onAddToWishlist(product);
          }}
        >
          <Heart className="w-4 h-4" />
        </Button>
      )}
    </div>
  );

  if (variant === "list") {
    return (
      <section className={cn("space-y-6", className)}>
        {title && (
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
            {limit && (
              <Link 
                href="/products" 
                className="text-sm text-primary hover:underline"
              >
                View All →
              </Link>
            )}
          </div>
        )}
        
        <div className="space-y-4">
          {products.map((product) => (
            <Card
              key={product.slug}
              className="overflow-hidden hover:shadow-lg transition-shadow"
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              <Link 
                href={`/products/${product.slug}`} 
                className="block sm:flex"
              >
                <div className="sm:w-48 md:w-56 lg:w-64 ">
                  {renderProductImage(product)}
                </div>
                
                <div className="flex-1 p-6">
                  {renderProductContent(product)}
                  {showActions && renderProductActions(product)}
                </div>
              </Link>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className={cn("space-y-6", className)}>
      {title && (
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          {limit && (
            <Link 
              href="/products" 
              className="text-sm text-primary hover:underline"
            >
              View All →
            </Link>
          )}
        </div>
      )}

      <div className={cn(
        "grid gap-4 md:gap-6",
        gridCols[columns],
        variant === "compact" && "gap-3"
      )}>
        {products.map((product) => (
          <Card
            key={product.slug}
            className={cn(
              "group overflow-hidden transition-all hover:shadow-xl border-border/50",
              variant === "compact" && "p-2"
            )}
            onMouseEnter={() => setHoveredProduct(product.id)}
            onMouseLeave={() => setHoveredProduct(null)}
          >
            <Link href={`/products/${product.slug}`} className="block">
              {/* Image */}
              <CardHeader className="p-0">
                {renderProductImage(product)}
              </CardHeader>

              {/* Content */}
              <CardContent className={cn(
                "p-4",
                variant === "compact" && "p-2 space-y-1"
              )}>
                {renderProductContent(product)}
              </CardContent>

              {/* Footer - Actions */}
              {showActions && (
                <CardFooter className="p-4 pt-0">
                  {renderProductActions(product)}
                </CardFooter>
              )}
            </Link>
          </Card>
        ))}
      </div>
    </section>
  );
}