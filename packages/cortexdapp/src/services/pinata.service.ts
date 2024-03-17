import Moralis from "moralis";
import axios from "axios";
import { Chains, networkConfigs } from "hd-materials";

const pinata_api_key = process.env["REACT_APP_PINATA_API_KEY"] as string;
const pinata_secret_api_key = process.env[
  "REACT_APP_PINATA_API_SECRET"
] as string;
const pinata_jwt = process.env["REACT_APP_PINATA_JWT"] as string;

const excludedAddr = [
  "0x7243508b98bdb260ad825b60976dbdb2e8115771".toLowerCase(),
  "0xC80F452d3e073Bf9c68E6A94074E7F2662612FDf".toLowerCase(),
  "0x41e7e3FC64C31C7968E375C86182222a494eE234".toLowerCase(),
  "0x0C151023EDedCC419caB0f49ABaCd2e87a4FF013".toLowerCase(),
  "0x5EECb73e32e6b4dc31b129443D95b19f86EC69Bf".toLowerCase(),
  "0x1918D8ECb31A5F2db0E74AA4f268A84E8B863FEe".toLowerCase(),
  "0x941E6365E663C27133E44e53a898fcF1cb579E68".toLowerCase(),
  "0x264404F7eaD48f392b4fD3CBbf81bD7Aa9720af1".toLowerCase(),
  "0xBBf047afF833c31673E60Ea5922ae7e296692aDe".toLowerCase(),
];

const gatewayURL = "https://hyperdapp.mypinata.cloud";
const headers = { pinata_api_key, pinata_secret_api_key };

const switchNetwork = async (chainId: Chains) => {
  const currChainId = await Moralis.chainId;

  if (currChainId === chainId) return;

  try {
    await Moralis.switchNetwork(chainId);
  } catch (error: any) {
    if (error.code === 4902) {
      const {
        chainName,
        currencyName,
        currencySymbol,
        rpcUrl,
        blockExplorerUrl,
      } = networkConfigs[chainId];

      await Moralis.addNetwork(
        chainId,
        chainName,
        currencyName,
        currencySymbol,
        rpcUrl as string,
        blockExplorerUrl
      );
    }
  }
};

const testAuthentication = async (): Promise<any> => {
  const url = `${gatewayURL}/data/testAuthentication`;
  const { data } = await axios.get(url, { headers });
  console.log(data.message);
};

const retrieveContent = async (cid: string) => {
  const url = `${gatewayURL}/ipfs/${cid}`;
  const { data } = await axios.get(url);
  await switchNetwork(data.chainId);
  return data;
};

const pinJSONToIPFS = async (JSONBody: any) => {
  try {
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
    const { data } = await axios.post(url, JSONBody, { headers });
    return data;
  } catch (e) {}
};

const unpinFile = (cid: string) => {
  try {
    const url = `https://api.pinata.cloud/pinning/unpin/${cid}`;
    return axios.delete(url, {
      headers: { Authorization: `Bearer ${pinata_jwt}` },
    });
  } catch (e) {}
};

const getPinList = async (address: string, chainId: string) => {
  try {
    const params = {
      pageLimit: 1000,
      status: "pinned",
      "metadata[keyvalues]": JSON.stringify({
        creatorAddress: {
          value: address,
          op: "eq",
        },
        chainId: {
          value: chainId,
          op: "eq",
        },
      }),
    };
    const url = "https://api.pinata.cloud/data/pinList";
    const { data } = await axios.get(url, { headers, params });

    return data.rows.map((res: any) => {
      const { ipfs_pin_hash, metadata } = res;
      const { name, description, version, creationDate } = metadata.keyvalues;

      return {
        name,
        description,
        version,
        creationDate,
        cid: ipfs_pin_hash,
      };
    });
  } catch (e) {}
};

const getAllFiles = async () => {
  const params = {
    pageLimit: 1000,
    status: "pinned",
  };

  try {
    const url = "https://api.pinata.cloud/data/pinList";
    const { data } = await axios.get(url, { headers, params });
    const byCreator: { [key: string]: any[] } = {};
    const byChain: { [key: string]: any[] } = {};

    const filteredData = data.rows.filter((res: any) => {
      return !excludedAddr.includes(
        res.metadata.keyvalues.creatorAddress.toLowerCase()
      );
    });

    filteredData.forEach((res: any) => {
      const { ipfs_pin_hash, metadata } = res;
      const {
        chainId,
        creationDate,
        creatorAddress,
        description,
        name,
        version,
      } = metadata.keyvalues;
      const obj = {
        cid: ipfs_pin_hash,
        chainId,
        creationDate,
        creatorAddress,
        description,
        name,
        version,
      };

      if (creatorAddress) {
        if (!byCreator[creatorAddress]) {
          byCreator[creatorAddress] = [obj];
        } else {
          byCreator[creatorAddress].push(obj);
        }
      } else {
        // await unpinFile(obj.cid);
      }

      if (chainId) {
        if (!byChain[chainId]) {
          byChain[chainId] = [obj];
        } else {
          byChain[chainId].push(obj);
        }
      } else {
        // await unpinFile(obj.cid);
      }
    });

    console.log(
      "Nb of addresses that didn't deploy a frontend: ",
      131 - excludedAddr.length - Object.keys(byCreator).length
    );
    console.log(
      "Nb of unique wallet addresses that deploy a frontend: ",
      Object.keys(byCreator).length
    );
    console.log("Nb of frontends deployed: ", filteredData.length);
    console.log("----------------BY CHAIN----------------");
    Object.keys(byChain).forEach((chainId) =>
      console.log(
        networkConfigs[chainId as Chains].chainName,
        byChain[chainId].length
      )
    );
  } catch (e) {}
};

// getAllFiles();

export {
  testAuthentication,
  retrieveContent,
  pinJSONToIPFS,
  unpinFile,
  getPinList,
  getAllFiles,
};
