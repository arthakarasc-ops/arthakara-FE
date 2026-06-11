"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Search, LogIn, User, ShoppingBag, ChevronDown, ArrowRight } from "lucide-react";
import { useAuth } from "@/components/context/AuthContext";
import { useCart } from "@/components/context/CartContext";
import { fetchProducts } from "@/app/api/ProductApi";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [mobileDropdowns, setMobileDropdowns] = useState({});
  const pathname = usePathname();
  const router = useRouter();

  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();

  const isShopPage = pathname.startsWith("/products") || pathname.startsWith("/collections") || pathname.startsWith("/cart") || pathname.startsWith("/profile") || pathname.startsWith("/supported-by") || pathname.startsWith("/sponsorship") || pathname.startsWith("/financial-report") || pathname.startsWith("/criticism-suggestions") || pathname.startsWith("/activities");

  const isActive = (link) => {
    if (link.dropdown) {
      return link.dropdown.some(subLink => subLink.path !== "/" && pathname.startsWith(subLink.path));
    }
    return link.path === "/" ? pathname === "/" : pathname.startsWith(link.path);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch products for search
  useEffect(() => {
    if (isSearchOpen && allProducts.length === 0) {
      const loadProducts = async () => {
        const data = await fetchProducts();
        if (data) setAllProducts(data);
      };
      loadProducts();
    }
  }, [isSearchOpen, allProducts.length]);

  // Handle Search Results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return allProducts.filter(p => 
      p.name?.toLowerCase().includes(query) || 
      p.description?.toLowerCase().includes(query)
    ).slice(0, 6);
  }, [searchQuery, allProducts]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const getTextColor = (active = false) => {
    if (active) return "text-cyan-600 font-bold";
    if (isShopPage || isScrolled) return "text-slate-600 hover:text-cyan-600 font-medium";
    return "text-white/90 hover:text-white font-medium drop-shadow-sm";
  };

  const getIconColor = () => {
    if (isShopPage || isScrolled) return "text-slate-800 hover:text-cyan-600";
    return "text-white hover:text-cyan-200 drop-shadow-sm";
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isShopPage || isScrolled
            ? "bg-white/90 backdrop-blur-xl border-b border-slate-200/50 shadow-sm py-2"
            : "bg-transparent py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* LOGO */}
            <Link href="/" className="flex-shrink-0 flex items-center">
              <img
                src="/Logonavbar.png"
                alt="Arthakara Logo"
                className={`transition-all duration-500 w-auto object-contain ${
                  isShopPage || isScrolled ? "h-35 sm:h-35" : "h-40 sm:h-40"
                }`}
              />
            </Link>

            {/* DESKTOP NAVIGATION (CENTER) */}
            <div className="hidden lg:flex items-center justify-center space-x-6 xl:space-x-8 flex-grow">
              {navLinks.map((link) => {
                const hasDropdown = !!link.dropdown;
                return (
                  <div key={link.name} className="relative group py-2">
                    {hasDropdown ? (
                      <div className="flex items-center gap-1 cursor-pointer">
                        <span className={`text-[12px] xl:text-[13px] uppercase tracking-[0.1em] transition-all duration-300 ${getTextColor(isActive(link))}`}>
                          {link.name}
                        </span>
                        <ChevronDown size={14} className={`transition-transform duration-300 group-hover:rotate-180 ${getIconColor()}`} />
                      </div>
                    ) : (
                      <Link
                        href={link.path}
                        className={`text-[12px] xl:text-[13px] uppercase tracking-[0.1em] transition-all duration-300 relative ${getTextColor(isActive(link))}`}
                      >
                        {link.name}
                        <span className={`absolute -bottom-1 left-0 h-[2px] bg-cyan-500 transition-all duration-300 ${isActive(link) ? "w-full" : "w-0 group-hover:w-full"}`}></span>
                      </Link>
                    )}

                    {hasDropdown && (
                      <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
                        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-100 py-2 overflow-hidden">
                          {link.dropdown.map((subLink) => (
                            <Link
                              key={subLink.path}
                              href={subLink.path}
                              className={`block px-5 py-2.5 text-xs font-semibold uppercase tracking-wider hover:bg-slate-50 hover:text-cyan-600 transition-colors ${
                                subLink.path !== "/" && pathname.startsWith(subLink.path) ? "text-cyan-600 bg-cyan-50/50" : "text-slate-600"
                              }`}
                            >
                              {subLink.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* RIGHT ACTIONS */}
            <div className="hidden lg:flex items-center space-x-5 xl:space-x-6">
              
              <button 
                onClick={() => setIsSearchOpen(true)}
                className={`flex items-center transition-colors duration-300 ${getIconColor()}`}
              >
                <Search size={20} strokeWidth={1.5} />
              </button>

              {!isAuthenticated ? (
                <div className="flex items-center gap-4 border-l border-slate-300/30 pl-5 xl:pl-6">
                  <Link href="/login" className={`text-sm transition-colors ${getTextColor()}`}>
                    Sign In
                  </Link>
                  <Link href="/signup">
                    <button className="bg-cyan-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-cyan-700 transition-all shadow-md shadow-cyan-600/20">
                      Sign Up
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-5 border-l border-slate-300/30 pl-5 xl:pl-6">
                  <Link href="/profile" className={`flex items-center transition-colors ${getIconColor()}`}>
                    <div className="w-8 h-8 rounded-full bg-cyan-50 flex items-center justify-center text-cyan-700 font-bold text-xs border border-cyan-100 shadow-sm overflow-hidden">
                      {user?.avatar ? (
                        <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        user?.full_name?.charAt(0).toUpperCase() || user?.name?.charAt(0).toUpperCase() || <User size={14} />
                      )}
                    </div>
                  </Link>
                </div>
              )}

              <Link href="/cart" className="relative group flex items-center">
                <button className={`flex items-center transition-colors duration-300 ${getIconColor()}`}>
                  <ShoppingBag size={20} strokeWidth={1.5} className="translate-y-[1px]" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2.5 bg-cyan-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white group-hover:scale-110 transition-transform shadow-sm">
                      {cartCount}
                    </span>
                  )}
                </button>
              </Link>

            </div>

            {/* MOBILE MENU BUTTON */}
            <div className="flex items-center gap-4 lg:hidden">
              <button 
                onClick={() => setIsSearchOpen(true)}
                className={`transition-colors duration-300 ${getIconColor()}`}
              >
                <Search size={22} strokeWidth={1.5} />
              </button>

              <Link href="/cart" className="relative flex items-center">
                <button className={`flex items-center transition-colors duration-300 ${getIconColor()}`}>
                  <ShoppingBag size={22} strokeWidth={1.5} className="translate-y-[1px]" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2.5 bg-cyan-600 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                      {cartCount}
                    </span>
                  )}
                </button>
              </Link>
              
              <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className={`p-2 -mr-2 transition-colors duration-300 ${getIconColor()}`}
              >
                {isMobileOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
              </button>
            </div>

          </div>
        </div>

        {/* MOBILE DROPDOWN MENU */}
        <div
          className={`lg:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 shadow-2xl transition-all duration-300 ease-in-out overflow-y-auto ${
            isMobileOpen ? "h-[100dvh] opacity-100 pb-32" : "h-0 opacity-0 pointer-events-none"
          }`}
        >
          <div className="px-4 pt-4 pb-8 space-y-1">
            {navLinks.map((link) => {
              const hasDropdown = !!link.dropdown;
              const isOpen = !!mobileDropdowns[link.name];
              return (
                <div key={link.name} className="space-y-1">
                  {hasDropdown ? (
                    <div>
                      <button
                        onClick={() => setMobileDropdowns(prev => ({ ...prev, [link.name]: !prev[link.name] }))}
                        className="w-full flex items-center justify-between px-4 py-3.5 text-base font-medium rounded-xl text-slate-700 hover:bg-slate-50 hover:text-cyan-600 transition-colors"
                      >
                        <span>{link.name}</span>
                        <ChevronDown size={18} className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                      </button>
                      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-80 opacity-100 py-1 pl-4" : "max-h-0 opacity-0 pointer-events-none"}`}>
                        {link.dropdown.map((subLink) => (
                          <Link
                            key={subLink.path}
                            href={subLink.path}
                            onClick={() => setIsMobileOpen(false)}
                            className={`block px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                              subLink.path !== "/" && pathname.startsWith(subLink.path) ? "text-cyan-700 bg-cyan-50/50" : "text-slate-500 hover:text-cyan-600 hover:bg-slate-50"
                            }`}
                          >
                            {subLink.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={link.path}
                      onClick={() => setIsMobileOpen(false)}
                      className={`block px-4 py-3.5 text-base font-medium rounded-xl transition-colors ${
                        isActive(link) ? "bg-cyan-50 text-cyan-700" : "text-slate-700 hover:bg-slate-50 hover:text-cyan-600"
                      }`}
                    >
                      {link.name}
                    </Link>
                  )}
                </div>
              );
            })}
            
            <div className="mt-6 pt-6 border-t border-slate-100 px-4">
              {!isAuthenticated ? (
                <div className="flex flex-col gap-3">
                  <Link href="/login" onClick={() => setIsMobileOpen(false)}>
                    <button className="w-full py-3 text-center text-slate-700 font-semibold border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                      Sign In
                    </button>
                  </Link>
                  <Link href="/signup" onClick={() => setIsMobileOpen(false)}>
                    <button className="w-full py-3 text-center text-white font-semibold bg-cyan-600 rounded-xl hover:bg-cyan-700 transition-colors shadow-md shadow-cyan-600/20">
                      Create Account
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link href="/profile" onClick={() => setIsMobileOpen(false)}>
                    <button className="w-full py-3 text-center text-slate-700 font-semibold bg-slate-50 rounded-xl flex items-center justify-center gap-2 overflow-hidden">
                      {user?.avatar ? (
                        <img src={user.avatar} alt="Avatar" className="w-6 h-6 rounded-full object-cover" />
                      ) : (
                        <User size={18} />
                      )}
                      My Profile
                    </button>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileOpen(false);
                    }}
                    className="w-full py-3 text-center text-red-600 font-semibold hover:bg-red-50 rounded-xl transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* SEARCH OVERLAY */}
      <div 
        className={`fixed inset-0 z-[100] bg-white/95 backdrop-blur-md transition-all duration-500 ease-in-out ${
          isSearchOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
      >
        <div className="max-w-4xl mx-auto px-6 pt-24">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">Product Search</h2>
            <button 
              onClick={() => {
                setIsSearchOpen(false);
                setSearchQuery("");
              }}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-900"
            >
              <X size={24} strokeWidth={1.5} />
            </button>
          </div>

          <form onSubmit={handleSearchSubmit} className="relative mb-12 group">
            <input 
              type="text"
              autoFocus={isSearchOpen}
              placeholder="Search products..."
              className="w-full bg-transparent border-b-2 border-slate-200 py-6 text-2xl sm:text-4xl font-bold text-slate-900 placeholder:text-slate-200 focus:outline-none focus:border-cyan-600 transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-cyan-600 transition-colors">
              <ArrowRight size={32} />
            </button>
          </form>

          {/* Results Area */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[50vh] overflow-y-auto pr-4 scrollbar-hide">
            {searchResults.length > 0 ? (
              searchResults.map((product) => (
                <Link 
                  key={product.id}
                  href={`/products/${product.id}`}
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery("");
                  }}
                  className="flex gap-4 group items-center p-2 rounded-2xl hover:bg-slate-50 transition-colors"
                >
                  <div className="w-20 h-20 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0">
                    <img 
                      src={product.usage_image || "/no-image.png"} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 group-hover:text-cyan-600 transition-colors">{product.name}</h3>
                    <p className="text-cyan-700 font-bold text-sm">Rp {Number(product.price).toLocaleString("id-ID")}</p>
                  </div>
                </Link>
              ))
            ) : searchQuery.length > 2 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-slate-400 font-medium italic">Products not found...</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}

const navLinks = [
  { name: "Home", path: "/" },
  {
    name: "Shop",
    path: "/products",
    dropdown: [
      { name: "Collections", path: "/collections" },
      { name: "All Products", path: "/products" }
    ]
  },
  {
    name: "About Arthakara",
    path: "/#about",
    dropdown: [
      { name: "About Us", path: "/#about" },
      { name: "Our Values", path: "/#value" },
      { name: "Our Team", path: "/#ourteam" },
      { name: "Our Activities", path: "/activities" },
      { name: "Supported By", path: "/supported-by" },
      { name: "Sponsorship", path: "/sponsorship" },
      { name: "Financial Report", path: "/financial-report" },
      { name: "Criticism & Suggestions", path: "/criticism-suggestions" }
    ]
  },
  { name: "Contact", path: "/#contact" }
];