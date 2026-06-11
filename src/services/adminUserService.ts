import api from "./api";

export const getAdminUsers = async () => {
  const response = await api.get(
    "/admin/users"
  );

  return response.data;
};

export const getAdminUser =
  async (id: string) => {
    const response =
      await api.get(
        `/admin/users/${id}`
      );

    return response.data;
  };

export const toggleAccountStatus =
  async (
    accountId: number
  ) => {
    const response =
      await api.post(
        `/admin/accounts/${accountId}/toggle-status`
      );

    return response.data;
  };