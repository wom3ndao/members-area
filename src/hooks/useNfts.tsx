import { constants } from "../constants";
import { ethers } from "ethers";
import { useEffect, useMemo, useState } from "react";
import { useProvider, useAccount } from "wagmi";
import { get_stage } from "@/utils";

export interface Token {
  description: string;
  image: string;
  name: string;
  id: number | string;
}
const useNfts = (isMinting: boolean) => {
  const [nfts, setNfts] = useState<any>();
  const contract = new ethers.Contract(
    get_stage() === "production"
      ? constants.NFT_MEMBERSHIP_ADDRESS_Q_MAINNET
      : constants.NFT_MEMBERSHIP_ADDRESS_Q_TESTNET,
    constants.NFT_MEMBERSHIP_ABI
  );
  const provider = useProvider();
  const { address, isConnected } = useAccount();
  const hasMinted = useMemo(
    () => nfts?.length > 0,
    [nfts, address, isConnected, isMinting]
  );
  useEffect(() => {
    listTokensOfOwner();
  }, [address, isConnected, isMinting]);

  async function mapUsersNfts() {
    const ids = await contract.connect(provider).tokensOwnedBy(address);
    console.log(ids);
    const nfts = (await Promise.all(
      ids.map(async (id: number) => {
        const uri = await contract.connect(provider).tokenURI(id.toString());
        console.log(uri);
        const response = await fetch(uri);
        const json = await response.json();
        console.log(json);
        return { ...json, id: id.toString() };
      })
    )) as Token[];
    console.log(nfts);
    return nfts;
  }

  async function listTokensOfOwner() {
    try {
      const nfts = await mapUsersNfts();
      setNfts(nfts);
    } catch (e) {
      console.error(e);
    }
  }

  return {
    nfts: nfts,
    hasMinted: hasMinted,
  };
};

export default useNfts;
