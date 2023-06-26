import { useState } from "react";
import styled from "styled-components";

import { Signer } from "ethers";

import useContract from "hooks/useContracts";

import Mint from "../../components/Mint/Mint";

import { useProviderStore } from "store/provider/hooks";
import { Button } from "@q-dev/q-ui-kit";
import { useDaoVault } from "store/dao-vault/hooks";
import { daoInstance } from "contracts/contract-instance";
import { getState } from "store";

const Container = styled.div`
  background-color: white;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  border-radius: 0.5rem;
  padding: 1.5rem;
`;

const Title = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
`;

const SubText = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.5rem;
`;

const Input = styled.input`
  display: block;
  padding: 1rem;
  width: 100%;
  border-radius: 0.375rem;
  border: none;
  background-color: #fff;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  outline: none;
  font-size: 0.875rem;
  color: #111827;
  &::placeholder {
    color: #9ca3af;
  }
`;

const HorizontalRule = styled.hr`
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
  border: none;
  border-top: 1px solid #d1d5db;
`;

export default function Admin() {
  const { currentProvider } = useProviderStore();
  const [vault, setVault] = useState<any>();
  const [addToAllowlistAddress, setAddToAllowlistAddress] = useState<string>();
  const [transferTokenAddress, setTransferTokenAddress] = useState<string>();
  const [transferTokenID, setTransferTokenID] = useState<string>();
  const [transferTokenAddressFrom, setTransferTokenAddressFrom] = useState<string>();
  const [withdrawID, setWithdrawId] = useState<string>();
  const [withdrawAddress, setWithdrawAddress] = useState<string>();
  const [isMinting, setMinting] = useState(false);

  const [burnID, setBurnID] = useState<string>();
  const { nftContract: contract, nftAddress, vaultAddress: vaultNow, vaultContract, daoAddress } = useContract();

  const setVaultTo = async () => {
    if (!currentProvider?.selectedAddress && !vault) return;
    try {
      const tx = await contract.connect(currentProvider?.signer as Signer).setVaultAddress(vault, {
        gasLimit: 300000,
      });
      const result = await tx.wait();
      console.log(result);
    } catch (e) {
      console.log(e);
    }
  };

  // const withdrawFromVault = async () => {
  //   if (!currentProvider?.selectedAddress || !vaultContract) return;
  //   // withdrawNFT(tokenInfo.address, erc721Id, { from: userAddress })
  //   try {
  //     withdrawFromVault(1, );
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  const burn = async () => {
    try {
      const tx = await contract.connect(currentProvider?.signer as Signer).burn(burnID);
      const result = await tx.wait();
      console.log(result);
    } catch (e) {
      console.log(e);
    }
  };

  const addToVaultAddress = async () => {
    if (!currentProvider?.selectedAddress && !addToAllowlistAddress) return;
    try {
      const tx = await contract.connect(currentProvider?.signer as Signer).addToAllowlist([addToAllowlistAddress], {
        gasLimit: 300000,
      });
      const result = await tx.wait();
      console.log(result);
    } catch (e) {
      console.log(e);
    }
  };

  const transferToken = async () => {
    try {
      const tx = await contract
        .connect(currentProvider?.signer as Signer)
        .transferToken(transferTokenAddressFrom, transferTokenAddress, transferTokenID, {
          gasLimit: 300000,
        });
      const result = await tx.wait();
      console.log(result);
    } catch (e) {
      console.log(e);
    }
  };

  const setTransferToTrue = async () => {
    try {
      const tx = await contract.connect(currentProvider?.signer as Signer).setTransferAllowed(true, {
        gasLimit: 300000,
      });
      const result = await tx.wait();
      console.log(result);
    } catch (e) {
      console.log(e);
    }
  };

  const withdraw = async () => {
    const daoVaultInstance = await daoInstance?.getVaultInstance();
    const { tokenInfo } = getState().daoToken;
    try {
      const result = daoVaultInstance?.withdrawNFT(tokenInfo.address, withdrawID as string);
      console.log(result);
    } catch (e) {
      console.log(e);
    }
  };

  const mint = async () => {
    if (!currentProvider?.selectedAddress) return;
    try {
      setMinting(true);
      const tx = await contract.connect(currentProvider?.signer as Signer).mint({
        gasLimit: 1000000,
      });
      const result = await tx.wait();
      console.log(result);
      setMinting(false);
    } catch (e) {
      console.log(e);
      setMinting(false);
    }
  };
  return (
    <Container>
      <div>
        <Title>DAO Vault Address</Title>
        <SubText>
          <b>now set to {vaultNow}</b>
        </SubText>
        <SubText>Change the DAO vault address you want associated with your DAO.</SubText>
      </div>
      <div className="sm:flex sm:items-center mt-5">
        <div className="w-full sm:max-w-xs">
          <label htmlFor="address" className="sr-only">
            Address
          </label>
          <Input name="address" id="address" placeholder="0x.." onChange={(e) => setVault(e?.target.value)} />
        </div>
        <Button onClick={() => setVaultTo()}>Save</Button>
      </div>
      <HorizontalRule />
      <div className="pt-6 pb-6">
        <Button onClick={() => setTransferToTrue()}>Set Transfer to True</Button>
      </div>
      <HorizontalRule />
      <div className="pt-6 pb-6">
        <Title>DAO Address</Title>
        <SubText>now set to {daoAddress}</SubText>
      </div>
      <HorizontalRule />
      <div className="pt-6 pb-6">
        <Title>NFT Address</Title>
        <SubText>now set to {nftAddress}</SubText>
      </div>
      <HorizontalRule />
      <div className="pt-6 pb-6">
        <Title>Add to allow list</Title>
        <SubText>Address: {addToAllowlistAddress?.toString()}</SubText>
        <div className="sm:flex sm:items-center mt-5">
          <div className="w-full sm:max-w-xs">
            <label htmlFor="address" className="sr-only">
              Address
            </label>
            <Input
              name="address"
              id="address"
              placeholder="0x.."
              onChange={(e) => setAddToAllowlistAddress(e?.target.value)}
            />
          </div>
          <Button onClick={() => addToVaultAddress()}>Add</Button>
        </div>
      </div>
      <HorizontalRule />
      <div className="pt-6 pb-6">
        <Title>Transfer Token to Address</Title>
        <div className="sm:flex sm:items-center">
          <div className="w-full sm:max-w-xs">
            <label htmlFor="address">Address to transfer to</label>
            <Input
              name="Taddress"
              id="Taddress"
              placeholder="0x.."
              onChange={(e) => setTransferTokenAddress(e?.target.value)}
            />
          </div>
          <div className="w-full sm:max-w-xs">
            <label htmlFor="address">Address to transfer from</label>
            <Input
              name="Faddress"
              id="Faddress"
              placeholder="0x.."
              onChange={(e) => setTransferTokenAddressFrom(e?.target.value)}
            />
          </div>
          <div className="w-full sm:max-w-xs">
            <label htmlFor="address">Token ID</label>
            <Input
              name="id"
              id="id"
              type="number"
              placeholder="0"
              onChange={(e) => setTransferTokenID(e?.target.value)}
            />
          </div>
          <Button onClick={() => transferToken()}>Transfer</Button>
        </div>
      </div>
      <HorizontalRule />
      <div className="pt-6 pb-6">
        <Title>Burn Token ID</Title>
        <div className="sm:flex sm:items-center">
          <div className="w-full sm:max-w-xs">
            <label htmlFor="address" className="sr-only">
              ID
            </label>
            <Input name="burnID" id="burnID" placeholder="0" onChange={(e) => setBurnID(e?.target.value)} />
          </div>
          <Button onClick={() => burn()}>Burn</Button>
        </div>
      </div>
      # <HorizontalRule />
      <div className="pt-6 pb-6">
        <Title>Withdraw</Title>
        <div className="sm:flex sm:items-center">
          <div className="w-full sm:max-w-xs">
            <label htmlFor="address" className="sr-only">
              ID
            </label>
            <Input name="withdrawID" id="withdrawID" placeholder="0" onChange={(e) => setWithdrawId(e?.target.value)} />
            <label htmlFor="address" className="sr-only">
              Address
            </label>
            <Input
              name="withdrawAddress"
              id="withdrawAddress"
              placeholder="0"
              onChange={(e) => setWithdrawAddress(e?.target.value)}
            />
          </div>
          <Button onClick={() => withdraw()}>Withdraw</Button>
        </div>
      </div>
      <HorizontalRule />
      <div className="pt-6 pb-6">
        <Title>Mint Token</Title>
        <div className="sm:flex sm:items-center">
          <Button onClick={() => mint()}>
            {isMinting ? "Minting .. Please wait.." : "Jetzt Minten und Membership sichern!"}
          </Button>
        </div>
      </div>
    </Container>
  );
}
