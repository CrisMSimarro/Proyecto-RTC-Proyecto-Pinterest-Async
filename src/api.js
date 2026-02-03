const BASE_URL = "https://api.unsplash.com";

const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

if (!ACCESS_KEY) {
  throw new Error(
    "Falta VITE_UNSPLASH_ACCESS_KEY en el archivo .env"
  );
}
async function fetchFromUnsplash(endpoint, params = {}) {
  const url = new URL(`${BASE_URL}${endpoint}`);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.append(key, value);
    }
  });

  const response = await fetch(url, {
    headers: {
      Authorization: `Client-ID ${ACCESS_KEY}`,
      "Accept-Version": "v1"
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Unsplash error ${response.status}: ${errorText}`
    );
  }

  return response.json();
}

export async function searchPhotos(query, page = 1, perPage = 20) {
  return fetchFromUnsplash("/search/photos", {
    query,
    page,
    per_page: perPage,
    content_filter: "high"
  });
}

export async function getPopularPhotos(page = 1, perPage = 20) {
  return fetchFromUnsplash("/photos", {
    page,
    per_page: perPage,
    order_by: "popular"
  });
}
