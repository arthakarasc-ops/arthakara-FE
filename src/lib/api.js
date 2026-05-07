const BASE_URL = typeof window !== "undefined" ? "/api" : `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api`;

export const registerUser = async (data) => {
  try {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
