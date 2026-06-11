import api from "./api";

export const getBalance = async () => {
  const response = await api.get(
    "/accounts/balance"
  );

  return response.data;
};