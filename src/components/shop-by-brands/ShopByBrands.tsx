"use client";
import {
  FilterBy,
  HomeCarosoul,
  OutlinedButton,
  ProductCard,
} from "@/components";
import CustomPageWrapper from "@/components/Wrappers/CustomPageWrapper";
import {
  useAppContext,
  useDispatchContext,
} from "@/provider/ContextProvider/ContextProvider";
import { useGetAllBanners, useGetAllProducts } from "@/queries/dataHandlers";
import { useSearchParams } from "next/navigation";
import React, { ChangeEvent, useState, useMemo, useEffect } from "react";
import { API_CONFIG } from "@/config/api";
import { ApiPaths } from "@/constants";

export default function ShopByBrandPage() {
  const params = useSearchParams();
  const category = params?.get("category");
  const subcategory = params?.get("subcategory");
  const subcategory2 = params?.get("subcategory2");
  const brandParams = params?.getAll("brands[]") || [];
  const brandIdParam = params?.get("brandId");
  const brandParamKey = brandParams.length > 0 ? brandParams.join("&") : brandIdParam || "";
  const { filterProductsParams, selectedBrands } = useAppContext();
  const dispatch = useDispatchContext();
  const isCategoryRoute = Boolean(category || subcategory || subcategory2);
  const activeSelectedBrands = isCategoryRoute ? null : selectedBrands;
  const [sorting, setSorting] = useState<string | null>(null);
  const { data: bannersData } = useGetAllBanners();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // State for categories
  const [categories, setCategories] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // State for category products
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string | null>(null);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<number | null>(null);
  const [selectedSubcategoryName, setSelectedSubcategoryName] = useState<string | null>(null);
  const [selectedSubcategory2Id, setSelectedSubcategory2Id] = useState<number | null>(null);
  const [selectedSubcategory2Name, setSelectedSubcategory2Name] = useState<string | null>(null);
  const [categoryProducts, setCategoryProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  useEffect(() => {
    const brandIds = brandParamKey ? brandParamKey.split("&") : [];

    if (brandIds.length > 0) {
      sessionStorage.removeItem('selectedCategoryId');
      sessionStorage.removeItem('selectedCategoryName');
      sessionStorage.removeItem('selectedSubcategoryId');
      sessionStorage.removeItem('selectedSubcategoryName');
      sessionStorage.removeItem('selectedSubcategory2Id');
      sessionStorage.removeItem('selectedSubcategory2Name');
      setSelectedCategoryId(null);
      setSelectedCategoryName(null);
      setSelectedSubcategoryId(null);
      setSelectedSubcategoryName(null);
      setSelectedSubcategory2Id(null);
      setSelectedSubcategory2Name(null);
      dispatch({
        type: "SET_SELECTED_BRANDS",
        payload: brandIds.map((brandId) => `brands[]=${brandId}`).join("&"),
      });
    } else if (category || subcategory || subcategory2) {
      dispatch({
        type: "SET_SELECTED_BRANDS",
        payload: null,
      });
    }
  }, [brandParamKey, category, subcategory, subcategory2, dispatch]);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await fetch(`${API_CONFIG.BASE_URL}${ApiPaths.CATEGORIES}`);
        const data = await response.json();

        if (data.status && Array.isArray(data.categories)) {
          setCategories(data.categories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Set selected category/subcategory/subcategory2 from URL params
  useEffect(() => {
    // First try to get from URL params
    if (category) {
      const categoryId = Number(category);
      setSelectedCategoryId(categoryId);

      // Find category name if we have the categories loaded
      const categoryObj = categories.find(cat => cat.id === categoryId);
      if (categoryObj) {
        setSelectedCategoryName(categoryObj.name);
      } else {
        // Fetch category name if not available
        fetch(`${API_CONFIG.BASE_URL}${ApiPaths.CATEGORY}/${categoryId}`)
          .then(response => response.json())
          .then(data => {
            if (data.status && data.category) {
              setSelectedCategoryName(data.category.name);
            }
          })
          .catch(error => console.error("Error fetching category details:", error));
      }
    }
    // If no category in URL, try sessionStorage (from navbar click)
    else if (typeof window !== 'undefined') {
      const storedCategoryId = sessionStorage.getItem('selectedCategoryId');
      const storedCategoryName = sessionStorage.getItem('selectedCategoryName');

      if (storedCategoryId) {
        setSelectedCategoryId(Number(storedCategoryId));
        setSelectedCategoryName(storedCategoryName);
        // Clear after using to avoid persistence issues
        sessionStorage.removeItem('selectedCategoryId');
        sessionStorage.removeItem('selectedCategoryName');
      } else {
        setSelectedCategoryId(null);
        setSelectedCategoryName(null);
      }
    } else {
      setSelectedCategoryId(null);
      setSelectedCategoryName(null);
    }

    if (subcategory) {
      const subcategoryId = Number(subcategory);
      setSelectedSubcategoryId(subcategoryId);

      // Get subcategory name from sessionStorage first
      if (typeof window !== 'undefined') {
        const storedSubcategoryName = sessionStorage.getItem('selectedSubcategoryName');
        if (storedSubcategoryName) {
          setSelectedSubcategoryName(storedSubcategoryName);
        }
      }

      // Also fetch subcategory name from API as backup
      fetch(`${API_CONFIG.BASE_URL}${ApiPaths.SUBCATEGORY}/${subcategoryId}`)
        .then(response => response.json())
        .then(data => {
          if (data.status && data.subcategory) {
            setSelectedSubcategoryName(data.subcategory.name);
          }
        })
        .catch(error => console.error("Error fetching subcategory details:", error));
    }
    // If no subcategory in URL, try sessionStorage
    else if (typeof window !== 'undefined' && !category) {
      const storedSubcategoryId = sessionStorage.getItem('selectedSubcategoryId');
      const storedSubcategoryName = sessionStorage.getItem('selectedSubcategoryName');

      if (storedSubcategoryId) {
        setSelectedSubcategoryId(Number(storedSubcategoryId));
        setSelectedSubcategoryName(storedSubcategoryName);
        // Clear after using
        sessionStorage.removeItem('selectedSubcategoryId');
        sessionStorage.removeItem('selectedSubcategoryName');
      } else {
        setSelectedSubcategoryId(null);
        setSelectedSubcategoryName(null);
      }
    } else {
      setSelectedSubcategoryId(null);
      setSelectedSubcategoryName(null);
    }

    if (subcategory2) {
      const subcategory2Id = Number(subcategory2);
      setSelectedSubcategory2Id(subcategory2Id);

      // Get subcategory2 name from sessionStorage
      if (typeof window !== 'undefined') {
        const storedSubcategory2Name = sessionStorage.getItem('selectedSubcategory2Name');
        if (storedSubcategory2Name) {
          setSelectedSubcategory2Name(storedSubcategory2Name);
        }
      }

      fetch(`${API_CONFIG.BASE_URL}${ApiPaths.SUBCATEGORY2}/${subcategory2Id}`)
        .then(response => response.json())
        .then(data => {
          if (data.status && data.subcategory2) {
            setSelectedSubcategory2Name(data.subcategory2.name);
          }
        })
        .catch(error => console.error("Error fetching subcategory2 details:", error));
    }
    // If no subcategory2 in URL, try sessionStorage
    else if (typeof window !== 'undefined' && !category && !subcategory) {
      const storedSubcategory2Id = sessionStorage.getItem('selectedSubcategory2Id');
      const storedSubcategory2Name = sessionStorage.getItem('selectedSubcategory2Name');

      if (storedSubcategory2Id) {
        setSelectedSubcategory2Id(Number(storedSubcategory2Id));
        setSelectedSubcategory2Name(storedSubcategory2Name);
        // Clear after using
        sessionStorage.removeItem('selectedSubcategory2Id');
        sessionStorage.removeItem('selectedSubcategory2Name');
      } else {
        setSelectedSubcategory2Id(null);
        setSelectedSubcategory2Name(null);
      }
    } else {
      setSelectedSubcategory2Id(null);
      setSelectedSubcategory2Name(null);
    }
  }, [category, subcategory, subcategory2, categories]);

  // Fetch products by category/subcategory/subcategory2
  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      let url = `${API_CONFIG.BASE_URL}${ApiPaths.PRODUCTS_BY_CATEGORY}?`;
      let params = [];

      if (selectedCategoryId) {
        params.push(`catId=${selectedCategoryId}`);
      }

      if (selectedSubcategoryId) {
        params.push(`subCatId=${selectedSubcategoryId}`);
      }

      if (selectedSubcategory2Id) {
        params.push(`subCatId2=${selectedSubcategory2Id}`);
      }

      if (params.length === 0) {
        // No filtering needed
        setCategoryProducts([]);
        setLoadingProducts(false);
        return;
      }

      url += params.join('&');

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status && Array.isArray(data.products)) {
        console.log(`Loaded ${data.products.length} products`);
        setCategoryProducts(data.products);
      } else {
        console.error("Invalid response format:", data);
        setCategoryProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setCategoryProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  // Fetch products when selected filters change
  useEffect(() => {
    fetchProducts();
  }, [selectedCategoryId, selectedSubcategoryId, selectedSubcategory2Id]);

  // Handle category change 
  const handleCategoryChange = (categoryId: number | null, categoryName: string | null) => {
    setSelectedCategoryId(categoryId);
    setSelectedCategoryName(categoryName);
    setSelectedSubcategoryId(null);
    setSelectedSubcategoryName(null);
    setSelectedSubcategory2Id(null);
    setSelectedSubcategory2Name(null);
    setCurrentPage(1); // Reset to first page
  };

  // Fetch all products when no category is selected
  const { data: allProducts, refetch } = useGetAllProducts(
    { ...filterProductsParams, sorting: sorting?.trimStart(), category },
    activeSelectedBrands as string
  );

  // Determine which products to display based on category selection
  const productsToDisplay = useMemo(() => {
    if (selectedCategoryId !== null || selectedSubcategoryId !== null || selectedSubcategory2Id !== null) {
      // If a category, subcategory, or subcategory2 is selected, always use categoryProducts (even if empty)
      return categoryProducts;
    }
    return allProducts?.products || [];
  }, [selectedCategoryId, selectedSubcategoryId, selectedSubcategory2Id, categoryProducts, allProducts?.products]);

  // Calculate paginated products
  const paginatedProducts = useMemo(() => {
    if (!productsToDisplay) return [];

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return productsToDisplay.slice(startIndex, endIndex);
  }, [productsToDisplay, currentPage, itemsPerPage]);

  // Calculate total pages
  const totalPages = useMemo(() => {
    if (!productsToDisplay) return 0;
    return Math.ceil(productsToDisplay.length / itemsPerPage);
  }, [productsToDisplay, itemsPerPage]);

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Get display title based on selection
  const getDisplayTitle = () => {
    if (selectedSubcategory2Name) {
      return selectedSubcategory2Name;
    } else if (selectedSubcategoryName) {
      return selectedSubcategoryName;
    } else if (selectedCategoryName) {
      return selectedCategoryName;
    } else if (activeSelectedBrands) {
      return allProducts?.brandDetails?.name;
    } else {
      return "All Products";
    }
  };

  return (
    <CustomPageWrapper className="w-[1400px] px-5">
      <div className="grid grid-cols-4 gap-6">
        <div className="col-span-1 col-start-1 max-xl:hidden">
          <FilterBy
            selectedCategoryId={selectedCategoryId}
            selectedCategoryName={selectedCategoryName}
            displayedProducts={paginatedProducts}
          />
        </div>
        <div className="col-span-3 col-start-2 max-xl:col-span-4 max-xl:col-start-1 flex flex-col items-center gap-4 px-5">
          <div className="w-full">
            <HomeCarosoul
              bannersData={
                activeSelectedBrands && !activeSelectedBrands?.includes("&")
                  ? [{
                      id: 1,
                      web: allProducts?.brandDetails?.banner || allProducts?.brandDetails?.image,
                      tab: allProducts?.brandDetails?.banner || allProducts?.brandDetails?.image,
                      phone: allProducts?.brandDetails?.banner || allProducts?.brandDetails?.image,
                      link: "#",
                      createdAt: "",
                      updatedAt: "",
                    }]
                  : bannersData?.banner || []
              }
              className="!w-full max-w-[1000px]"
            />
          </div>
          {activeSelectedBrands && !activeSelectedBrands?.includes("&") && (
            <div className="w-full ">
              <p className="text-black text-start text-[28px] max-sm:text-lg not-italic font-semibold">
                {allProducts?.brandDetails?.name}
              </p>

              <ExpandableDescription description={allProducts?.brandDetails?.description} />
            </div>
          )}
          <div className="w-full flex mt-1 items-center justify-between border-t">
            <p className="text-black text-center text-2xl max-sm:text-base not-italic font-semibold">
              {getDisplayTitle()}
              <span className="text-black text-lg max-sm:text-sm not-italic font-normal">
                ({productsToDisplay?.length || 0} Items)
              </span>
            </p>

            <div>
              <select
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setSorting(e.target.value)
                }
                className="p-[10px] max-sm:w-[100px] max-sm:p-1 max-sm:text-sm border border-gray-400 rounded-md"
              >
                <option value="">Sort By</option>
                <option value=" P-lth">Price Low to High</option>
                <option value=" P-htl">Price HIgh to Low</option>
                <option value=" D-lth">Discount Low to High</option>
                <option value=" D-htl">Discount HIgh to Low</option>
                <option value=" Rating">Rating</option>
              </select>
            </div>
          </div>
          <div className="w-full overflow-x-auto mt-4">
            <div className="flex space-x-3 min-w-max">
              {/* Always include the "All" category tab */}
              <CategoryTab
                label="All"
                active={selectedCategoryId === null}
                onClick={() => handleCategoryChange(null, null)}
              />

              {/* Dynamic categories from API */}
              {loadingCategories ? (
                <div className="py-2 px-4 text-sm text-gray-500">Loading categories...</div>
              ) : (
                categories.map((category) => (
                  <CategoryTab
                    key={category.id}
                    label={category.name}
                    active={selectedCategoryId === category.id && selectedSubcategoryId === null}
                    onClick={() => handleCategoryChange(category.id, category.name)}
                  />
                ))
              )}
            </div>
          </div>

          {/* Products section with loading state */}
          {loadingProducts ? (
            <div className="w-full py-10 flex items-center justify-center">
              <p className="text-gray-500">Loading products...</p>
            </div>
          ) : paginatedProducts.length > 0 ? (
            <Products products={paginatedProducts} />
          ) : (
            <div className="w-full py-10 flex flex-col items-center justify-center">
              <p className="text-gray-500">No products found for {selectedSubcategoryName || selectedCategoryName || "this selection"}.</p>
              {(selectedCategoryId !== null || selectedSubcategoryId !== null) && (
                <button
                  onClick={() => handleCategoryChange(null, null)}
                  className="text-sm text-blue-600 hover:underline mt-2"
                >
                  View all products instead
                </button>
              )}
            </div>
          )}

          {/* Add pagination UI */}
          {productsToDisplay.length > itemsPerPage && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}

          <EndFooter />
        </div>
      </div>
    </CustomPageWrapper>
  );
}

// Rest of component definitions remain unchanged

// Rest of your component definitions remain exactly the same
const VarityCard = ({
  label,
  active,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className={`border-[2px] text-black text-center text-xs not-italic font-medium cursor-pointer rounded-[12px] p-2 ${active ? "text-gradient border-red-400" : ""
        }`}
    >
      {label}
    </div>
  );
};

// Pagination component remains unchanged
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  // Generate array of page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];

    // Always show first page
    pageNumbers.push(1);

    // For small number of pages, show all
    if (totalPages <= 7) {
      for (let i = 2; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
      return pageNumbers;
    }

    // For many pages, show current neighborhood + first/last
    if (currentPage > 3) {
      pageNumbers.push("...");
    }

    // Show neighborhood of current page
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }

    if (currentPage < totalPages - 2) {
      pageNumbers.push("...");
    }

    // Always show last page if more than 1 page
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  return (
    <div className="flex items-center justify-center gap-3 my-10">
      {/* Previous button */}
      <PaginationButton
        label="<"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={currentPage === 1 ? "opacity-50" : ""}
      />

      {/* Page numbers */}
      {getPageNumbers().map((page, index) => (
        <React.Fragment key={index}>
          {typeof page === 'number' ? (
            <PaginationButton
              label={page.toString()}
              active={currentPage === page}
              onClick={() => onPageChange(page)}
              className={page > 999 ? "max-[500px]:hidden" : ""}
            />
          ) : (
            <div className="text-gray-500 text-sm">
              {page}
            </div>
          )}
        </React.Fragment>
      ))}

      {/* Next button */}
      <PaginationButton
        label=">"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={currentPage === totalPages ? "opacity-50" : ""}
      />
    </div>
  );
};

// PaginationButton remains unchanged
const PaginationButton = ({
  label,
  active,
  className,
  onClick,
  disabled = false
}: {
  label: string;
  active?: boolean;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}) => {
  return (
    <div
      onClick={!disabled && onClick ? onClick : undefined}
      className={`w-[32px] h-[32px] rounded-full flex items-center justify-center text-xs not-italic font-semibold cursor-pointer border-[1px] ${active
        ? "border-red-500 text-white linear-gradient-1"
        : "border-red-500 text-gradient"
        } ${disabled ? "cursor-not-allowed opacity-50" : ""} ${className}`}
    >
      {label}
    </div>
  );
};

// Products component remains unchanged
export const Products = ({
  products,
  isOffer = false,
}: {
  products: any;
  isOffer?: boolean;
}) => {
  return (
    <div className="my-5 custom-grid2 w-full">
      {products?.map((item: any, index: number) => (
        <ProductCard
          isOffer={isOffer}
          fullidth
          productData={item}
          key={index}
        />
      ))}
    </div>
  );
};

// EndFooter component remains unchanged
const EndFooter = () => {
  return (
    <div className="border-[2px] border-gray-300 p-4 rounded-lg flex flex-col gap-5">
      <p className="text-black text-base not-italic font-medium">
        As a leading brand in the science nutrition space, MuscleTech® has a
        rich history of partnering with top-ranked researchers to sponsor
        scientific research and novel discovery. We have always been interested
        in developing scientifically-backed products and working with top
        scientists to further our understanding of key ingredients that benefit
        countless athletes, fitness enthusiasts, and bodybuilders.
      </p>
      <p className="text-black text-base not-italic font-medium">
        Study: Burke DG, MacLean PG, Walker RA, Dewar PJ, Smith-Palmer T.
        Analysis of creatine and creatinine in urine by capillary
        electrophoresis. J Chromatogr B Biomed Sci Appl. 1999;732(2):479-85.
      </p>
      <p className="text-black text-base not-italic font-medium">
        Key Finding: Creatine is found in the urine of subjects ingesting
        creatine monohydrate as an ergogenic aid. Significant amount of creatine
        is excreted after ingestion. It can also be seen that with a higher
        dose, a larger absolute amount of creatine is retained, even though the
        fraction of the dose excreted is larger.
      </p>
    </div>
  );
};

// BrandInfo component remains unchanged
const BrandInfo = () => {
  return (
    <div className="flex flex-col items-start">
      <h2 className="text-black text-2xl not-italic font-bold leading-9 mb-2">
        MuscleTech
      </h2>
      <p className="text-black text-sm not-italic font-medium leading-5 mb-3">
        MuscleBlaze is one of the best selling brands in India. When it comes to
        healthy, top quality and reasonable supplements. From whey protein, mass
        gainers, BCAA's to raw whey protein, MuscleBlaze has everything to
        complement your fitness
      </p>
      <OutlinedButton label="Read More" />
    </div>
  );
};

// ExpandableDescription component remains unchanged
const ExpandableDescription = ({ description }: { description?: string }) => {
  const [expanded, setExpanded] = useState(false);

  if (!description) return null;

  return (
    <div className="mb-3">
      <p
        className={`text-black text-sm not-italic font-medium leading-6 ${expanded ? "" : "line-clamp-2"
          }`}
      >
        {description}
      </p>
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-red-600 hover:text-red-700 bg-white border border-red-600 text-sm mt-2 py-1 px-3 rounded-md cursor-pointer"
      >
        {expanded ? "Read Less" : "Read More"}
      </button>
    </div>
  );
};

// CategoryTab component remains unchanged
const CategoryTab = ({
  label,
  active,
  onClick
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={`py-2 px-4 rounded-full text-sm font-medium transition-all ${active
        ? "bg-white border-2 border-[#E70F0F] text-[#E70F0F]"
        : "bg-gray-100 border border-gray-200 text-gray-700 hover:bg-gray-200"
        }`}
    >
      {label}
    </button>
  );
};
