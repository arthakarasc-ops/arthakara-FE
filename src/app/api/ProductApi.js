const BASE_URL = typeof window !== "undefined" ? "/api" : `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api`;

/*
|------------------------------------------------------------------
| FETCHER (FIXED)
|------------------------------------------------------------------
*/
const fetcher = async (url) => {
  try {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const json = await res.json();

    // 🔥 ini fix penting
    return json.data ?? json;

  } catch (error) {
    console.error("API Error:", error);
    return null;
  }
};

/*
|------------------------------------------------------------------
| GET ALL PRODUCTS
|------------------------------------------------------------------
*/
export const fetchProducts = async () => {
  return await fetcher(`${BASE_URL}/products`);
};

/*
|------------------------------------------------------------------
| GET PRODUCT DETAIL
|------------------------------------------------------------------
*/
export const fetchProductDetail = async (id) => {
  return await fetcher(`${BASE_URL}/products/${id}`);
};