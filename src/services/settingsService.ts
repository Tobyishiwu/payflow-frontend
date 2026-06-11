import api from "./api";

export const changePassword = async (
  data: {
    current_password: string;
    new_password: string;
    new_password_confirmation: string;
  }
) => {
  const response =
    await api.post(
      "/change-password",
      data
    );

  return response.data;
};

export const changePin = async (
  data: {
    current_pin: string;
    new_pin: string;
    new_pin_confirmation: string;
  }
) => {
  const response =
    await api.post(
      "/change-pin",
      data
    );

  return response.data;
};