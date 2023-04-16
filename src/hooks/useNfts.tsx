import { constants } from "../constants";
import { ethers, Signer } from "ethers";
import { useEffect, useMemo, useState } from "react";
import { useSigner, useProvider, useAccount } from "wagmi";
export interface Token {
  id: string;
  json: any;
}
const useNfts = (isMinting: boolean) => {
  const { data: signer } = useSigner();
  const [nfts, setNfts] = useState<any>();
  const contract = new ethers.Contract(
    constants.NFT_MEMBERSHIP_ADDRESS,
    constants.NFT_MEMBERSHIP_ABI
  );
  const provider = useProvider();
  const { address, isConnected } = useAccount();
  const hasMinted = useMemo(
    () => nfts?.length > 0,
    [nfts, address, isConnected, isMinting]
  );
  console.log(hasMinted);
  useEffect(() => {
    listTokensOfOwner();
  }, [address, isConnected, isMinting]);

  async function mapUsersNfts() {
    const id = await contract.connect(provider).balanceOf(address);
    const uri = await contract.connect(provider).tokenURI(id.toString());
    const response = await fetch(
      uri.replace("ipfs://", "https://ipfs.io/ipfs/")
    );
    const json = await response.json();
    return [{ id: id.toNumber(), json: json }] as Token[];
  }

  async function listTokensOfOwner() {
    contract.connect(signer as Signer).tokenOfOwnerByIndex;
    try {
      const nfts = await mapUsersNfts();
      console.log(nfts);
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
