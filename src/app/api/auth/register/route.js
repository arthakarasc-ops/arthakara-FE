import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();

    const { name, email, password, phone } = body;

    // Validasi basic (optional)
    if (!name || !email || !password || !phone) {
      return NextResponse.json(
        { error: "Semua field harus diisi" },
        { status: 400 }
      );
    }

    // 🔥 MAPPING KE FORMAT LARAVEL
    const payload = {
      email: email,
      password: password,
      phone_number: phone, // ✅ WAJIB
      nickname: name,      // ✅ WAJIB
    };

    // 🔥 KIRIM KE LARAVEL
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const response = await fetch(`${apiBaseUrl}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });

  } catch (error) {
    console.error("Register error:", error);

    return NextResponse.json(
      { error: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}