import { useEffect, useMemo, useState } from "react";

import useContract from "./useContracts";

import { useProviderStore } from "store/provider/hooks";
import { useDaoVault } from "store/dao-vault/hooks";

export interface Token {
  description: string;
  image: string;
  name: string;
  id: number | string;
}

const useNfts = (isMinting: boolean) => {
  const [nfts, setNfts] = useState<any>();
  const [vaultNfts, setVaultNfts] = useState<any>();
  const { nftContract: contract } = useContract();
  const { currentProvider } = useProviderStore();
  const { walletNftsList, withdrawalNftsList } = useDaoVault();

  const hasMinted = useMemo(
    () => nfts?.length > 0,
    [nfts, walletNftsList, currentProvider?.selectedAddress, isMinting]
  );
  const hasInVault = useMemo(
    () => vaultNfts?.length > 0,
    [vaultNfts, withdrawalNftsList, currentProvider?.selectedAddress]
  );

  useEffect(() => {
    listTokensOfOwner();
    listVaultTokensOfOwner();
  }, [currentProvider?.selectedAddress, isMinting, withdrawalNftsList, walletNftsList]);

  async function mapUsersNfts() {
    if (!currentProvider) return [];
    const promises = walletNftsList?.map(async (id: any) => {
      const uri = await contract?.connect(currentProvider?.provider as any).tokenURI(id.toString());
      const response = await fetch(uri);
      const json = await response.json();
      return { ...json, id: id.toString() };
    });
    const nfts = promises?.length && (await Promise?.all(promises));
    return nfts;
  }

  async function mapUsersVaultNfts() {
    if (!currentProvider) return [];
    const promises = withdrawalNftsList?.map(async (id: any) => {
      const uri = await contract?.connect(currentProvider?.provider as any).tokenURI(id.toString());
      const response = await fetch(uri);
      const json = await response.json();
      return { ...json, id: id.toString() };
    });
    const nfts = promises?.length && (await Promise?.all(promises));
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

  async function listVaultTokensOfOwner() {
    try {
      const nfts = await mapUsersVaultNfts();
      setVaultNfts(nfts);
    } catch (e) {
      console.error(e);
    }
  }

  return {
    nfts: nfts,
    vaultNfts: vaultNfts,
    hasMinted: hasMinted,
    hasInVault: hasInVault,
    hasMintedOrInVault: hasInVault || hasMinted,
  };
};

export default useNfts;
