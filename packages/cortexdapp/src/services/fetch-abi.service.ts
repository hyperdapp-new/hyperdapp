import axios from "axios";
import { Chains, networkConfigs } from "hd-materials";

interface ContractABIData {
  message: "OK" | "NOTOK";
  result: string;
  status: number;
}

export const fetchContractABI = async (
  chainId: string,
  address: string
): Promise<ContractABIData> => {
  const baseURL = networkConfigs[chainId as Chains].apiUrl;
  const apiKey = networkConfigs[chainId as Chains].apiKey;

  const params = {
    module: "contract",
    action: "getabi",
    apiKey: process.env[apiKey],
    address,
  };

  const { data } = await axios.get(baseURL, { params });

  return data;
};
