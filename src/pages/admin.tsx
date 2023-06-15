import { get_stage } from "@/utils";
import { ethers, Signer } from "ethers";
import { useAccount, useProvider, useSigner } from "wagmi";
import useNfts, { Token } from "../hooks/useNfts";
import { constants } from "../constants";
import { useEffect, useState } from "react";

export default function Admin() {
  const { address } = useAccount();
  const { data: signer } = useSigner();
  const provider = useProvider();
  const [vault, setVault] = useState<any>();
  const [vaultNow, setVaultNow] = useState<string>();
  const [addToAllowlistAddress, setAddToAllowlistAddress] = useState<string>();
  const [transferTokenAddress, setTransferTokenAddress] = useState<string>();
  const [transferTokenID, setTransferTokenID] = useState<string>();
  const [transferTokenAddressFrom, setTransferTokenAddressFrom] =
    useState<string>();
  const [burnID, setBurnID] = useState<string>();

  setTransferTokenAddress;
  const contract = new ethers.Contract(
    get_stage() === "production"
      ? constants.NFT_MEMBERSHIP_ADDRESS_Q_MAINNET
      : constants.NFT_MEMBERSHIP_ADDRESS_Q_TESTNET,
    constants.NFT_MEMBERSHIP_ABI
  );

  useEffect(() => {
    getVaultAddress();
  }, []);

  const getVaultAddress = async () => {
    const vAddress = await contract.connect(provider).vaultAddress();
    setVaultNow(vAddress);
  };

  const setVaultTo = async () => {
    if (!address && !vault) return;
    try {
      const tx = await contract
        .connect(signer as Signer)
        .setVaultAddress(vault, {
          gasLimit: 300000,
        });
      const result = await tx.wait();
      console.log(result);
    } catch (e) {
      console.log(e);
    }
  };

  const burn = async () => {
    try {
      const tx = await contract.connect(signer as Signer).burn(burnID);
      const result = await tx.wait();
      console.log(result);
    } catch (e) {
      console.log(e);
    }
  };

  const addToVaultAddress = async () => {
    if (!address && !addToAllowlistAddress) return;
    try {
      const tx = await contract
        .connect(signer as Signer)
        .addToAllowlist([addToAllowlistAddress], {
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
        .connect(signer as Signer)
        .transferToken(
          transferTokenAddressFrom,
          transferTokenAddress,
          transferTokenID,
          {
            gasLimit: 300000,
          }
        );
      const result = await tx.wait();
      console.log(result);
    } catch (e) {
      console.log(e);
    }
  };

  const setTransferToTrue = async () => {
    try {
      const tx = await contract
        .connect(signer as Signer)
        .setTransferAllowed(true, {
          gasLimit: 300000,
        });
      const result = await tx.wait();
      console.log(result);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="bg-white shadow sm:rounded-lg p-6">
      <div className="pb-8">
        <h3 className="text-base font-semibold leading-6 text-gray-900">
          DAO Vault Address
        </h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500">
          <p>
            <b>now set to {vaultNow}</b>
          </p>
          <p>Change the DAO vault address you want associated with your DAO.</p>
        </div>
        <div className="mt-5 sm:flex sm:items-center">
          <div className="w-full sm:max-w-xs">
            <label htmlFor="address" className="sr-only">
              Address
            </label>
            <input
              onChange={(e) => setVault(e?.target.value)}
              name="address"
              id="address"
              className="block p-5 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="0x.."
            />
          </div>
          <button
            onClick={() => setVaultTo()}
            type="submit"
            className="mt-3 inline-flex w-full items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:ml-3 sm:mt-0 sm:w-auto"
          >
            Save
          </button>
        </div>
      </div>
      <hr />
      <div className="pt-6 pb-6">
        <button
          onClick={() => setTransferToTrue()}
          type="submit"
          className="mt-3 inline-flex w-full items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:ml-3 sm:mt-0 sm:w-auto"
        >
          Set Transfer to True
        </button>
      </div>
      <hr />
      <div className="pt-6 pb-6">
        <h3 className="text-base font-semibold leading-6 text-gray-900">
          DAO Address
        </h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500">
          <p>now set to {constants.DAO_ADDRESS}</p>
        </div>
      </div>
      <hr />
      <div className="pt-6 pb-6">
        <h3 className="text-base font-semibold leading-6 text-gray-900">
          NFT Address
        </h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500">
          <p>now set to {constants.NFT_MEMBERSHIP_ADDRESS_Q_TESTNET}</p>
        </div>
      </div>{" "}
      <hr />
      <div className="pt-6 pb-6">
        <h3 className="text-base font-semibold leading-6 text-gray-900">
          Add to allow list
        </h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500">
          <p> Address: {addToAllowlistAddress?.toString()}</p>
        </div>
        <div className="mt-5 sm:flex sm:items-center">
          <div className="w-full sm:max-w-xs">
            <label htmlFor="address" className="sr-only">
              Address
            </label>
            <input
              onChange={(e) => setAddToAllowlistAddress(e?.target.value)}
              name="address"
              id="address"
              className="block w-full p-5 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="0x.."
            />
          </div>
          <button
            onClick={() => addToVaultAddress()}
            type="submit"
            className="mt-3 inline-flex w-full items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:ml-3 sm:mt-0 sm:w-auto"
          >
            Add
          </button>
        </div>
      </div>
      <hr />
      <div className="pt-6 pb-6">
        <h3 className="text-base font-semibold leading-6 text-gray-900">
          Transfer Token to Address
        </h3>
        <div className="mt-5 sm:flex sm:items-center">
          <div className="w-full sm:max-w-xs">
            <label htmlFor="address">Address to transfer to</label>
            <input
              onChange={(e) => setTransferTokenAddress(e?.target.value)}
              name="Taddress"
              id="Taddress"
              className="block w-full p-5 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="0x.."
            />
          </div>
          <div className="w-full sm:max-w-xs">
            <label htmlFor="address">Address to transfer from</label>
            <input
              onChange={(e) => setTransferTokenAddressFrom(e?.target.value)}
              name="Faddress"
              id="Faddress"
              className="block w-full p-5 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="0x.."
            />
          </div>
          <div className="w-full sm:max-w-xs">
            <label htmlFor="address">Token ID</label>
            <input
              onChange={(e) => setTransferTokenID(e?.target.value)}
              name="id"
              id="id"
              type="number"
              className="block w-full p-5 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="0"
            />
          </div>
          <button
            onClick={() => transferToken()}
            type="submit"
            className="mt-3 inline-flex w-full items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:ml-3 sm:mt-0 sm:w-auto"
          >
            Transfer
          </button>
        </div>
      </div>
      <hr />
      <div className="pt-6 pb-6">
        <h3 className="text-base font-semibold leading-6 text-gray-900">
          Burn Token ID
        </h3>
        <div className="mt-5 sm:flex sm:items-center">
          <div className="w-full sm:max-w-xs">
            <label htmlFor="address" className="sr-only">
              ID
            </label>
            <input
              onChange={(e) => setBurnID(e?.target.value)}
              name="burnID"
              id="burnID"
              className="block w-full p-5 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="0"
            />
          </div>
          <button
            onClick={() => burn()}
            type="submit"
            className="mt-3 inline-flex w-full items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:ml-3 sm:mt-0 sm:w-auto"
          >
            Burn
          </button>
        </div>
      </div>
    </div>
  );
}
