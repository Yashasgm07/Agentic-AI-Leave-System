import { getToken } from "./auth";

const API = "http://127.0.0.1:5000";


export async function apiGet(path) {

  const token = getToken();

  const res = await fetch(`${API}${path}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  return res.json();
}


export async function apiPost(path, data) {

  const token = getToken();

  const res = await fetch(`${API}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  return res.json();
}
