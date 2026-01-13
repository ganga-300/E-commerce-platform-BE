const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export async function signupUser(userData) {
  const res = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  if (!res.ok) throw new Error("Signup failed");
  return res.json();
}

export async function loginUser(credentials) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!res.ok) throw new Error("Invalid credentials");
  return res.json();
}
