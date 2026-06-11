import api from "./api";

export const getBeneficiaries =
  async () => {
    const response =
      await api.get(
        "/beneficiaries"
      );

    return response.data;
  };

export const deleteBeneficiary =
  async (id: number) => {
    const response =
      await api.delete(
        `/beneficiaries/${id}`
      );

    return response.data;
  };