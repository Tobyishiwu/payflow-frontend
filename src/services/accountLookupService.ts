import api from "./api";

export const lookupAccount =
  async (
    accountNumber: string
  ) => {

    const response =
      await api.get(
        `/accounts/lookup/${accountNumber}`
      );

    return response.data;
  };