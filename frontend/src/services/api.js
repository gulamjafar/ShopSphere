
const API_URL = "https://shopsphere-3495.onrender.com/api";

export async function getProducts() {
  const response = await fetch(`${API_URL}/products`);

  if (!response.ok) {
    throw new Error("Could not load products");
  }

  return response.json();
}
