const BASE_URL = "https://arthakara.id/api";

// GET ALL COLLECTIONS
export const getCollections = async () => {
  try {
    const res = await fetch(`${BASE_URL}/collections`, {
      headers: {
        "Accept": "application/json",
      },
    });

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