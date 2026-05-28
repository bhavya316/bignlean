import { SearchBarIcon } from "@/Icons";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { API_CONFIG } from "@/config/api";
import { useDispatchContext } from "@/provider/ContextProvider/ContextProvider";

type Props = {
  label: string;
  value: string;
  className?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  setSearchValue: any;
};

interface SearchResult {
  status: boolean;
  products: any[];
  brands: any[];
  categories: any[];
}

const fallbackRecommendedCategories = [
  { id: null, name: "Whey Protein", href: "/shop-by-brands" },
  { id: null, name: "Creatine", href: "/shop-by-brands" },
  { id: null, name: "Vitamins", href: "/shop-by-brands" },
];

const normalizeSearchResults = (data: any): SearchResult => ({
  status: Boolean(data?.status),
  products: Array.isArray(data?.products) ? data.products : [],
  brands: Array.isArray(data?.brands) ? data.brands : [],
  categories: Array.isArray(data?.categories) ? data.categories : [],
});

export default function Searchbar({
  label,
  className,
  setSearchValue,
  value,
  onFocus,
  onBlur,
}: Props) {
  const router = useRouter();
  const dispatch = useDispatchContext();
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<any[]>([]);
  const [recommendedCategories, setRecommendedCategories] = useState<any[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  // Load search history on mount
  useEffect(() => {
    try {
      const history = localStorage.getItem("bignlean_search_history");
      if (history) {
        setSearchHistory(JSON.parse(history));
      }
    } catch (e) {
      console.error("Failed to load search history", e);
    }
  }, []);

  const saveToHistory = (query: string) => {
    if (!query || query.trim() === "") return;
    try {
      const q = query.trim();
      const updatedHistory = [q, ...searchHistory.filter(item => item !== q)].slice(0, 5);
      setSearchHistory(updatedHistory);
      localStorage.setItem("bignlean_search_history", JSON.stringify(updatedHistory));
    } catch (e) {
      console.error("Failed to save search history", e);
    }
  };

  // Fetch search results when value changes (with debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (value.trim().length >= 2) {
        fetchSearchResults(value);
      } else {
        setSearchResults(null);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [value]);

  // Handle clicks outside the search component
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchSearchResults = async (query: string) => {
    setIsSearching(true);
    try {
      const response = await axios.get(
        `${API_CONFIG.BASE_URL}/search?q=${encodeURIComponent(query)}`
      );

      const normalized = normalizeSearchResults(response.data);
      if (normalized.status) {
        setSearchResults(normalized);
        setShowResults(true);
      } else {
        setSearchResults(null);
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults(null);
    } finally {
      setIsSearching(false);
    }
  };

  const fetchTrendingProducts = async () => {
    if (trendingProducts.length > 0) return;
    try {
      const response = await axios.get(`${API_CONFIG.BASE_URL}/admin/bestSellers`, {
        params: { limit: 5 },
      });
      const products = Array.isArray(response.data?.products)
        ? response.data.products
        : [];
      setTrendingProducts(products.slice(0, 5));
    } catch (error) {
      setTrendingProducts([]);
    }
  };

  const fetchRecommendedCategories = async () => {
    if (recommendedCategories.length > 0) return;
    try {
      const response = await axios.get(`${API_CONFIG.BASE_URL}/categories`);
      const categories = Array.isArray(response.data?.categories)
        ? response.data.categories
        : [];
      setRecommendedCategories(categories.slice(0, 5));
    } catch (error) {
      setRecommendedCategories([]);
    }
  };

  const clearCategorySelection = () => {
    sessionStorage.removeItem("selectedCategoryId");
    sessionStorage.removeItem("selectedCategoryName");
    sessionStorage.removeItem("selectedSubcategoryId");
    sessionStorage.removeItem("selectedSubcategoryName");
    sessionStorage.removeItem("selectedSubcategory2Id");
    sessionStorage.removeItem("selectedSubcategory2Name");
  };

  const goToBrand = (brand: any) => {
    if (!brand?.id) return;
    clearCategorySelection();
    dispatch({
      type: "SET_SELECTED_BRANDS",
      payload: `brands[]=${brand.id}`,
    });
    router.push(`/shop-by-brands?brands[]=${brand.id}`);
    setShowResults(false);
  };

  const goToCategory = (category: any) => {
    dispatch({
      type: "SET_SELECTED_BRANDS",
      payload: null,
    });

    if (category?.id) {
      sessionStorage.setItem("selectedCategoryId", String(category.id));
      sessionStorage.setItem("selectedCategoryName", category.name || "");
      sessionStorage.removeItem("selectedSubcategoryId");
      sessionStorage.removeItem("selectedSubcategoryName");
      sessionStorage.removeItem("selectedSubcategory2Id");
      sessionStorage.removeItem("selectedSubcategory2Name");
      router.push(`/category/${category.id}`);
    } else {
      clearCategorySelection();
      router.push(category?.href || "/shop-by-brands");
    }

    setShowResults(false);
  };

  const handleInputFocus = () => {
    if (onFocus) onFocus();
    setShowResults(true);
    fetchTrendingProducts();
    fetchRecommendedCategories();
  };
  // Update the handleKeyDown function (around line 95)

  // Update the handleKeyDown function

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchResults) {
      e.preventDefault();
      saveToHistory(value);

      // Navigate to the first available result
      if ((searchResults.products || []).length > 0) {
        // Direct navigation using window.location
        window.location.href = `/product/${encodeURIComponent(searchResults.products[0].name)}?id=${searchResults.products[0].id}`;
      } else if ((searchResults.brands || []).length > 0) {
        goToBrand(searchResults.brands[0]);
      } else if ((searchResults.categories || []).length > 0) {
        goToCategory(searchResults.categories[0]);
      }

      setShowResults(false);
    } else if (e.key === "Enter" && value.trim() !== "") {
      e.preventDefault();
      saveToHistory(value);
      // Just save to history if no direct result but Enter pressed
    }
  };
  return (
    <div className="relative w-full" ref={searchRef}>
      <div
        className={`w-full flex items-center gap-4 bg-white p-[10px] border-2 border-gray-400 rounded-[10px] ${className}`}
      >
        <SearchBarIcon />
        <input
          type="text"
          placeholder={`Search for ${label}`}
          className="outline-none text-black text-sm not-italic font-medium w-full"
          value={value}
          onChange={(e) => setSearchValue(e.target.value)}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
        />
        {isSearching && (
          <div className="w-5 h-5 border-t-2 border-r-2 border-[#E70F0F] rounded-full animate-spin"></div>
        )}
      </div>

      {/* Search History, Recommended Categories and Trending Products */}
      {showResults && value.trim().length < 2 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-[80vh] overflow-y-auto">
          <div className="p-2">
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-semibold text-gray-600">History</h3>
                {searchHistory.length > 0 && (
                  <button
                    onClick={() => {
                      setSearchHistory([]);
                      localStorage.removeItem("bignlean_search_history");
                    }}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    Clear
                  </button>
                )}
              </div>
              {searchHistory.length > 0 ? (
                searchHistory.map((query, index) => (
                  <div
                    key={index}
                    className="p-2 hover:bg-gray-100 cursor-pointer rounded-md flex items-center gap-2"
                    onClick={() => {
                      setSearchValue(query);
                      fetchSearchResults(query);
                    }}
                  >
                    <SearchBarIcon />
                    <p className="text-sm font-medium">{query}</p>
                  </div>
                ))
              ) : (
                <p className="px-2 pb-2 text-xs text-gray-400">No recent searches</p>
              )}
            </div>

            <div className="border-t border-gray-200 pt-2 mt-2">
              <h3 className="text-sm font-semibold text-gray-600 mb-2">
                Recommended Categories
              </h3>
              {(recommendedCategories.length
                ? recommendedCategories
                : fallbackRecommendedCategories
              ).map((category) => (
                <button
                  key={category.id || category.name}
                  type="button"
                  className="w-full p-2 hover:bg-gray-100 cursor-pointer rounded-md flex items-center gap-2 text-left"
                  onClick={() => {
                    goToCategory(category);
                  }}
                >
                  <SearchBarIcon />
                  <span className="text-sm font-medium">{category.name}</span>
                </button>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-2 mt-2">
              <h3 className="text-sm font-semibold text-gray-600 mb-2">
                Trending Products
              </h3>
              {trendingProducts.length > 0 ? (
                trendingProducts.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    className="w-full p-2 hover:bg-gray-100 cursor-pointer rounded-md flex items-center gap-2 text-left"
                    onClick={() => {
                      saveToHistory(product.name);
                      router.push(`/product/${encodeURIComponent(product.name)}?id=${product.id}`);
                      setShowResults(false);
                    }}
                  >
                    {product.images?.[0] && (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-10 h-10 object-contain mix-blend-multiply"
                      />
                    )}
                    <span className="text-sm font-semibold">{product.name}</span>
                  </button>
                ))
              ) : (
                <p className="px-2 pb-2 text-xs text-gray-400">
                  Trending products will appear here
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Search Results Dropdown */}
      {showResults && searchResults && value.trim().length >= 2 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-[80vh] overflow-y-auto">
          {/* Products section */}
          {(searchResults.products || []).length > 0 && (
            <div className="p-2">
              <h3 className="text-sm font-semibold text-gray-600 mb-2">Products</h3>
              {(searchResults.products || []).map((product) => (
                <div
                  key={product.id}
                  className="p-2 hover:bg-gray-100 cursor-pointer rounded-md flex items-center gap-2"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    saveToHistory(product.name);

                    // Directly use window.location for guaranteed navigation
                    window.location.href = `/product/${encodeURIComponent(product.name)}?id=${product.id}`;

                    setShowResults(false);
                  }}
                >
                  {product.images && product.images[0] && (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-10 h-10 object-contain mix-blend-multiply"
                    />
                  )}
                  <div>
                    <p className="text-sm font-semibold">{product.name}</p>
                    {product.varients?.[0] && (
                      <p className="text-xs text-green-600">₹{product.varients[0].sellingPrice}/-</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Brands section */}
          {(searchResults.brands || []).length > 0 && (
            <div className="p-2 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-600 mb-2">Brands</h3>
              {(searchResults.brands || []).map((brand) => (
                <div
                  key={brand.id}
                  className="p-2 hover:bg-gray-100 cursor-pointer rounded-md flex items-center gap-2"
                  onClick={() => {
                    goToBrand(brand);
                  }}
                >
                  {brand.image && (
                    <img
                      src={brand.image}
                      alt={brand.name}
                      className="w-10 h-10 object-contain rounded-md"
                    />
                  )}
                  <p className="text-sm font-medium">{brand.name}</p>
                </div>
              ))}
            </div>
          )}

          {/* Categories section */}
          {(searchResults.categories || []).length > 0 && (
            <div className="p-2 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-600 mb-2">Categories</h3>
              {(searchResults.categories || []).map((category) => (
                <div
                  key={category.id}
                  className="p-2 hover:bg-gray-100 cursor-pointer rounded-md flex items-center gap-2"
                  onClick={() => {
                    goToCategory(category);
                  }}
                >
                  {category.imageOn && (
                    <img
                      src={category.imageOn}
                      alt={category.name}
                      className="w-10 h-10 object-contain rounded-md"
                    />
                  )}
                  <p className="text-sm font-medium">{category.name}</p>
                </div>
              ))}
            </div>
          )}

          {/* No results message */}
          {(searchResults.products || []).length === 0 &&
            (searchResults.brands || []).length === 0 &&
            (searchResults.categories || []).length === 0 && (
              <div className="p-4 text-center text-gray-500">
                No results found for "{value}"
              </div>
            )}
        </div>
      )}
    </div>
  );
}
