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

  // Otherwise → attach backend
  return `${baseUrl}/${url.replace(/^\/+/, "")}`;
};