const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://arthakara.id/api";

/*
|------------------------------------------------------------------
| FETCHER (FIXED)
|------------------------------------------------------------------
*/
const fetcher = async (url) => {
  try {
    const res = await fetch(url, {
      headers: {
        "Accept": "application/json",
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error("Backend Error Detail:", errorData);
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