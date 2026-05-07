const BASE_URL = typeof window !== "undefined" ? "/api" : `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api`;

// GET ALL COLLECTIONS
export const getCollections = async () => {
  try {
    const res = await fetch(`${BASE_URL}/collections`);

    const data = await res.json();

    return {
      status: res.status,
      data: data.data, // karena backend return { data: [...] }
    };
  } catch (error) {
    return {
      status: 500,
      data: [],
    };
  }
};