const API = "http://127.0.0.1:5000";


// Login
export async function login(username, password) {

  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, password })
  });

  return res.json();
}


// Register
export async function register(username, password, role = "employee") {

  const res = await fetch(`${API}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, password, role })
  });

  return res.json();
}


// Get Token
export function getToken() {
  return localStorage.getItem("token");
}


// Logout
export function logout() {
  localStorage.removeItem("token");
}
