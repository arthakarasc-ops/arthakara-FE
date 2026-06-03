const BASE_URL = "https://arthakara.id/api";
// const BASE_URL = "http://localhost:8000/api";

export const registerUser = async (data) => {
  try {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await res.json();
    return { status: res.status, data: responseData };
  } catch (error) {
    return {
      status: 500,
      data: { error: error.message || "Terjadi kesalahan" },
    };
  }
};

export const loginUser = async (data) => {
  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await res.json();
    return { status: res.status, data: responseData };
  } catch (error) {
    return {
      status: 500,
      data: { error: error.message || "Terjadi kesalahan" },
    };
  }
};

export const forgotPasswordUser = async (data) => {
  try {
    // Pastikan ada kata /auth/ sesuai dengan pola login kamu yang sukses
    const res = await fetch(`${BASE_URL}/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await res.json();
    return { status: res.status, data: responseData };
  } catch (error) {
    return {
      status: 500,
      data: { error: error.message || "Terjadi kesalahan" },
    };
  }
};  

export const updateUserProfile = async (token, formData) => {
  try {
    const res = await fetch(`${BASE_URL}/users/update`, {
      method: "POST", // Laravel PUT with _method='PUT' or just use POST with formData
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      body: formData, // FormData will handle Content-Type automatically
    });

    const responseData = await res.json();
    return { status: res.status, data: responseData };
  } catch (error) {
    return {
      status: 500,
      data: { error: error.message || "Terjadi kesalahan" },
    };
  }
};

export const getUser = async (token) => {
  const res = await fetch(`${BASE_URL}/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Accept": "application/json",
    },
  });

  return res.json();
};

/*
|--------------------------------------------------------------------------
| CART API
|--------------------------------------------------------------------------
*/

export const getCart = async (token) => {
  try {
    const res = await fetch(`${BASE_URL}/cart`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
    const data = await res.json();
    return { status: res.status, data: data.data || [] };
  } catch (error) {
    return { status: 500, data: [] };
  }
};

export const addToCart = async (token, payload) => {
  try {
    const res = await fetch(`${BASE_URL}/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return { status: res.status, data };
  } catch (error) {
    return { status: 500, data: { error: error.message } };
  }
};

export const addBulkToCart = async (token, payload) => {
  try {
    const res = await fetch(`${BASE_URL}/cart/bulk`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      body: JSON.stringify({ items: payload }), // backend expects 'items'
    });
    const data = await res.json();
    return { status: res.status, data };
  } catch (error) {
    return { status: 500, data: { error: error.message } };
  }
};

export const updateCartQty = async (token, cartId, qty) => {
  try {
    const res = await fetch(`${BASE_URL}/cart/${cartId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      body: JSON.stringify({ qty }),
    });
    const data = await res.json();
    return { status: res.status, data };
  } catch (error) {
    return { status: 500, data: { error: error.message } };
  }
};

export const removeFromCart = async (token, cartId) => {
  try {
    const res = await fetch(`${BASE_URL}/cart/${cartId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
    const data = await res.json();
    return { status: res.status, data };
  } catch (error) {
    return { status: 500, data: { error: error.message } };
  }
};

export const clearCart = async (token) => {
  try {
    const res = await fetch(`${BASE_URL}/cart`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
    const data = await res.json();
    return { status: res.status, data };
  } catch (error) {
    return { status: 500, data: { error: error.message } };
  }
};

/*
|--------------------------------------------------------------------------
| ORDER API
|--------------------------------------------------------------------------
*/

export const getUserOrders = async (token) => {
  try {
    const res = await fetch(`${BASE_URL}/users/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
    const data = await res.json();
    return { status: res.status, data: data.data || [] };
  } catch (error) {
    return { status: 500, data: [] };
  }
};

/*
|--------------------------------------------------------------------------
| RAJAONGKIR API
|--------------------------------------------------------------------------
*/

export const getProvinces = async () => {
  try {
    const res = await fetch(`${BASE_URL}/rajaongkir/provinces`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching provinces:", error);
    return { data: [] };
  }
};

export const getCities = async (provinceId) => {
  try {
    const res = await fetch(`${BASE_URL}/rajaongkir/cities?province=${provinceId}`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching cities:", error);
    return { data: [] };
  }
};

export const getShippingCost = async (payload) => {
  try {
    const res = await fetch(`${BASE_URL}/rajaongkir/cost`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching shipping cost:", error);
    return { error: true, message: error.message };
  }
};

