const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const followUser = async (userId, token) => {
  try {
    const response = await fetch(
      `${VITE_API_BASE_URL}/api/users/follow/${userId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to follow user");
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || "Failed to follow user");
  }
};

export const unfollowUser = async (userId, token) => {
  try {
    const response = await fetch(
      `${VITE_API_BASE_URL}/api/users/unfollow/${userId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to unfollow user");
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || "Failed to unfollow user");
  }
};

export const checkFollowStatus = async (userId, token) => {
  try {
    const response = await fetch(
      `${VITE_API_BASE_URL}/api/users/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch user status");
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || "Failed to check follow status");
  }
};
