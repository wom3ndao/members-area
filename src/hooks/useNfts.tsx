import { constants } from "../constants";
import { ethers, Signer } from "ethers";
import { useEffect, useMemo, useState } from "react";
import { useSigner, useProvider, useAccount } from "wagmi";
export interface Token {
  id: string;
  json: any;
}
const useNfts = () => {
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
    [nfts, address, isConnected]
  );

  useEffect(() => {
    listTokensOfOwner();
  }, [address, isConnected]);

  async function mapUsersNfts() {
    const ids = await contract.connect(provider).balanceOf(address);
    console.log(ids);
    const idsArray = Array.from(Array(ids).keys());
    if (!+ids || !idsArray.length) return [];

    const nfts = (await Promise.all(
      idsArray.map(async (id) => {
        const tokenId = await contract
          .connect(provider)
          .tokenOfOwnerByIndex(address!, id);
        const uri = await contract.connect(provider).tokenURI(tokenId);
        const response = await fetch(
          uri.replace("ipfs://", "https://ipfs.io/ipfs/")
        );
        const json = await response.json();
        return { id: tokenId.toNumber(), json: json } as Token;
      })
    )) as Token[];

    if (!nfts.length) return [];
    return nfts;
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
