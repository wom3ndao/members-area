import { get_stage } from "@/utils";
import { ethers, Signer } from "ethers";
import { useAccount, useSigner } from "wagmi";
import useNfts, { Token } from "../hooks/useNfts";
import { constants } from "../constants";
import { useState } from "react";

export default function Admin() {
  const { address } = useAccount();
  const { data: signer } = useSigner();
  const [vault, setVault] = useState<any>();
  const contract = new ethers.Contract(
    get_stage() === "production"
      ? constants.NFT_MEMBERSHIP_ADDRESS_Q_MAINNET
      : constants.NFT_MEMBERSHIP_ADDRESS_Q_TESTNET,
    constants.NFT_MEMBERSHIP_ABI
  );

  const setVaultTo = async () => {
    if (!address) return;
    try {
      const tx = await contract
        .connect(signer as Signer)
        .setVaultAddress(vault);
      const result = await tx.wait();
      console.log(result);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-base font-semibold leading-6 text-gray-900">
          Update your email
        </h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500">
          <p>Change the email address you want associated with your account.</p>
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
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
    </div>
  );
}
