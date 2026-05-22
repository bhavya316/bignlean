"use client";

import { FilterBy, ProductCard } from "@/components";
import CustomPageWrapper from "@/components/Wrappers/CustomPageWrapper";
import { ApiPaths } from "@/constants";
import { API_CONFIG } from "@/config/api";
import {
  useAppContext,
  useDispatchContext,
} from "@/provider/ContextProvider/ContextProvider";
import { useGetAllBrands } from "@/queries/dataHandlers";
import { useEffect, useMemo, useState } from "react";

type Props = {
  categoryId: string;
  subcategoryId?: string;
  subcategory2Id?: string;
};

const getEntityName = (payload: any, key: string) =>
  payload?.[key]?.name || payload?.data?.name || payload?.result?.name || payload?.name || "";

const getResponseList = (payload: any, key: string) =>
  Array.isArray(payload?.[key])
    ? payload[key]
    : Array.isArray(payload?.data)
      ? payload.data
      : [];

const parseAmount = (value: any) => {
  const parsed = Number(String(value ?? "").replace(/[^\d.]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
};

const getPrimaryVariant = (product: any) =>
  Array.isArray(product?.varients) && product.varients.length > 0
    ? product.varients[0]
    : {};

const getProductMrp = (product: any) => {
  const variant = getPrimaryVariant(product);
  return parseAmount(variant.mrp ?? product?.mrp ?? product?.price);
};

const getProductSellingPrice = (product: any) => {
  const variant = getPrimaryVariant(product);
  return parseAmount(variant.sellingPrice ?? product?.sellingPrice ?? product?.price ?? variant.mrp);
};

const getProductDiscount = (product: any) => {
  if (product?.discountPercentage !== undefined && product?.discountPercentage !== null) {
    return parseAmount(product.discountPercentage);
  }
  const mrp = getProductMrp(product);
  const sellingPrice = getProductSellingPrice(product);
  return mrp > 0 ? ((mrp - sellingPrice) / mrp) * 100 : 0;
};

const getSelectedBrandValues = (selectedBrands: string | null) => {
  if (!selectedBrands) return [];
  return selectedBrands
    .split("&")
    .map((part) => {
      const [key, value] = part.split("=");
      return key === "brands[]" && value ? decodeURIComponent(value) : "";
    })
    .filter(Boolean);
};

export default function CategoryProductListing({ categoryId, subcategoryId, subcategory2Id }: Props) {
  const { filterProductsParams, selectedBrands } = useAppContext();
  const dispatch = useDispatchContext();
  const { data: brandsData } = useGetAllBrands();
  const [categoryName, setCategoryName] = useState<string>("");
  const [subcategoryName, setSubcategoryName] = useState<string>("");
  const [subcategory2Name, setSubcategory2Name] = useState<string>("");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const numericCategoryId = Number(categoryId);
  const numericSubcategoryId = subcategoryId ? Number(subcategoryId) : null;
  const numericSubcategory2Id = subcategory2Id ? Number(subcategory2Id) : null;

  useEffect(() => {
    dispatch({ type: "SET_SELECTED_BRANDS", payload: null });
  }, [dispatch]);

  useEffect(() => {
    let cancelled = false;

    async function loadCategoryData() {
      setLoading(true);
      try {
        const productParams = new URLSearchParams({ catId: String(numericCategoryId) });
        if (numericSubcategoryId) productParams.set("subCatId", String(numericSubcategoryId));
        if (numericSubcategory2Id) productParams.set("subCatId2", String(numericSubcategory2Id));

        const [categoryResponse, subcategoryResponse, subcategory2Response, productsResponse] = await Promise.all([
          fetch(`${API_CONFIG.BASE_URL}${ApiPaths.CATEGORY}/${numericCategoryId}`),
          numericSubcategoryId
            ? fetch(`${API_CONFIG.BASE_URL}${ApiPaths.SUBCATEGORY}/${numericSubcategoryId}`)
            : Promise.resolve(null),
          numericSubcategory2Id
            ? fetch(`${API_CONFIG.BASE_URL}${ApiPaths.SUBCATEGORY2}/${numericSubcategory2Id}`)
            : Promise.resolve(null),
          fetch(`${API_CONFIG.BASE_URL}${ApiPaths.PRODUCTS_BY_CATEGORY}?${productParams.toString()}`),
        ]);

        const categoryData = await categoryResponse.json();
        const subcategoryData = subcategoryResponse ? await subcategoryResponse.json() : null;
        const subcategory2Data = subcategory2Response ? await subcategory2Response.json() : null;
        const productsData = await productsResponse.json();
        const [allProductsResponse, categoriesResponse] = await Promise.all([
          fetch(`${API_CONFIG.BASE_URL}${ApiPaths.ALL_PRODUCTS}`),
          fetch(`${API_CONFIG.BASE_URL}${ApiPaths.CATEGORIES}`),
        ]);
        const allProductsData = await allProductsResponse.json();
        const categoriesData = await categoriesResponse.json();
        const matchesCurrentCategory = (product: any) => {
          if (!product) return false;
          if (Number(product.catId) !== numericCategoryId) return false;
          if (numericSubcategoryId && Number(product.subCatId) !== numericSubcategoryId) return false;
          if (numericSubcategory2Id && Number(product.subCatId2) !== numericSubcategory2Id) return false;
          return true;
        };
        const categoryProducts = getResponseList(productsData, "products");
        const enrichedCategoryProducts = getResponseList(allProductsData, "products").filter(matchesCurrentCategory);
        let loadedProducts = enrichedCategoryProducts.length > 0 ? enrichedCategoryProducts : categoryProducts;

        if (loadedProducts.length === 0) {
          loadedProducts = getResponseList(allProductsData, "products").filter(matchesCurrentCategory);
        }

        if (cancelled) return;

        const categoryListMatch = getResponseList(categoriesData, "categories").find(
          (category: any) => Number(category.id) === numericCategoryId
        );
        const productCategoryName =
          loadedProducts.find((product: any) => product?.categoryName || product?.category?.name)?.categoryName ||
          loadedProducts.find((product: any) => product?.category?.name)?.category?.name ||
          "";
        setCategoryName(getEntityName(categoryData, "category") || categoryListMatch?.name || productCategoryName || "");
        setSubcategoryName(getEntityName(subcategoryData, "subcategory"));
        setSubcategory2Name(getEntityName(subcategory2Data, "subcategory2"));
        setProducts(loadedProducts.filter(matchesCurrentCategory));
      } catch (error) {
        if (!cancelled) setProducts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (numericCategoryId) loadCategoryData();

    return () => {
      cancelled = true;
    };
  }, [numericCategoryId, numericSubcategoryId, numericSubcategory2Id]);

  const brandNameById = useMemo(() => {
    const map = new Map<string, string>();
    (brandsData?.brands || []).forEach((brand: any) => {
      if (brand?.id != null) map.set(String(brand.id), String(brand.name || ""));
    });
    return map;
  }, [brandsData?.brands]);

  const filteredProducts = useMemo(() => {
    const selectedFilterValues = getSelectedBrandValues(selectedBrands);
    const wantsBestSeller = selectedFilterValues.some(
      (value) => value.toLowerCase() === "bestseller"
    );
    const selectedBrandValues = selectedFilterValues.filter(
      (value) => value.toLowerCase() !== "bestseller"
    );
    const selectedBrandSet = new Set(selectedBrandValues.map((brand) => brand.toLowerCase()));
    const discountPercent = parseAmount(filterProductsParams.discountPercent);
    const minRating = parseAmount(filterProductsParams.minRating);
    const priceNumbers = String(filterProductsParams["priceRanges[]"] || "0-99999").match(/\d+(\.\d+)?/g) || [];
    const minPrice = parseAmount(priceNumbers[0] || 0);
    const maxPrice = parseAmount(priceNumbers[1] || 99999);

    return products.filter((product) => {
      if (wantsBestSeller && !product.isBestSeller) return false;

      if (selectedBrandSet.size > 0) {
        const productBrandValues = [
          String(product.brandId || ""),
          String(product.brand?.id || ""),
          String(product.brandName || ""),
          String(product.brand?.name || ""),
          brandNameById.get(String(product.brandId)) || "",
        ].map((value) => value.toLowerCase());

        if (!productBrandValues.some((value) => selectedBrandSet.has(value))) return false;
      }

      const price = getProductMrp(product);
      if (price < minPrice || price > maxPrice) return false;
      if (getProductDiscount(product) < discountPercent) return false;
      if (parseAmount(product.averageRating) < minRating) return false;

      return true;
    });
  }, [brandNameById, filterProductsParams, products, selectedBrands]);

  const heading = useMemo(() => {
    if (subcategory2Name) return subcategory2Name;
    if (subcategoryName) return subcategoryName;
    if (categoryName) return categoryName;
    return numericCategoryId ? `Category #${numericCategoryId}` : "Category Products";
  }, [categoryName, numericCategoryId, subcategoryName, subcategory2Name]);

  return (
    <CustomPageWrapper className="w-[1400px] px-5">
      <div className="grid grid-cols-4 gap-6">
        <div className="col-span-1 col-start-1 max-xl:hidden">
          <FilterBy
            selectedCategoryId={numericCategoryId}
            selectedCategoryName={categoryName}
            selectedSubcategoryId={numericSubcategoryId}
            selectedSubcategory2Id={numericSubcategory2Id}
            displayedProducts={products}
            showRelatedProducts={false}
          />
        </div>

        <div className="col-span-3 col-start-2 max-xl:col-span-4 max-xl:col-start-1 flex flex-col gap-4 px-5">
          <div className="w-full border-b pb-3">
            <p className="text-black text-2xl max-sm:text-base not-italic font-semibold">
              {heading}
              <span className="text-black text-lg max-sm:text-sm not-italic font-normal">
                {" "}({filteredProducts.length} Items)
              </span>
            </p>
          </div>

          {loading ? (
            <div className="w-full py-10 text-center text-gray-500">Loading products...</div>
          ) : filteredProducts.length > 0 ? (
            <div className="my-5 custom-grid2 w-full">
              {filteredProducts.map((product: any, index: number) => (
                <ProductCard fullidth productData={product} key={product.id || index} />
              ))}
            </div>
          ) : (
            <div className="w-full py-10 text-center text-gray-500">
              No products found for {heading}.
            </div>
          )}
        </div>
      </div>
    </CustomPageWrapper>
  );
}
