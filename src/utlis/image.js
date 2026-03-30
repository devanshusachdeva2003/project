export const getImageUrl = (img, baseUrl) => {
  if (!img) return "";

  let url = img.trim();

  // Fix broken https
  url = url.replace("https//", "https://");

  // If Cloudinary → use directly
  if (url.includes("res.cloudinary.com")) {
    return url;
  }

  // If already full backend URL → use directly
  if (url.includes("onrender.com")) {
    return url;
  }

  // If no baseUrl provided, use from environment
  const finalBaseUrl = baseUrl || import.meta.env.VITE_API_BASE_URL;

  // Otherwise → attach backend
  return `${finalBaseUrl}/${url.replace(/^\/+/, "")}`;
};