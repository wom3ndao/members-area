import { useEffect, useMemo, useState } from 'react';

import useContract from './useContract';

import { useProviderStore } from 'store/provider/hooks';

export interface Token {
  description: string;
  image: string;
  name: string;
  id: number | string;
}

const useNfts = (isMinting: boolean) => {
  const [nfts, setNfts] = useState<any>();
  const { nftContract: contract } = useContract();
  const { currentProvider } = useProviderStore();
  const hasMinted = useMemo(() => nfts?.length > 0, [nfts, currentProvider?.selectedAddress, isMinting]);
  useEffect(() => {
    listTokensOfOwner();
  }, [currentProvider?.selectedAddress, isMinting]);

  async function mapUsersNfts () {
    console.log(currentProvider);
    if (!currentProvider) return;
    const ids = await contract
      .connect(currentProvider?.provider as any)
      .tokensOwnedBy(currentProvider?.selectedAddress);
    const nfts = (await Promise.all(
      ids.map(async (id: number) => {
        const uri = await contract.connect(currentProvider?.provider as any).tokenURI(id.toString());
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

  async function listTokensOfOwner () {
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
