import api from "./api";

export const login = async (email: string, password: string) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as { response: { data: { error: string } } };
      throw new Error(axiosError.response.data.error || "Invalid email or password");
    }
    throw new Error("Network error. Please try again.");
  }
};

export const forgotPassword = async (email: string) => {
  try {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as { response: { data: { error: string } } };
      throw new Error(axiosError.response.data.error || "Failed to process request");
    }
    throw new Error("Network error. Please try again.");
  }
};

export const changePassword = async (currentPassword: string, newPassword: string) => {
  try {
    const response = await api.post("/auth/change-password", { currentPassword, newPassword });
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as { response: { data: { error: string } } };
      throw new Error(axiosError.response.data.error || "Failed to update password");
    }
    throw new Error("Network error. Please try again.");
  }
};

export const updateProfile = async (data: { name?: string; email?: string }) => {
  try {
    const response = await api.put("/auth/profile", data);
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as { response: { data: { error: string } } };
      throw new Error(axiosError.response.data.error || "Failed to update profile");
    }
    throw new Error("Network error. Please try again.");
  }
};
