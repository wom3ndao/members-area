import { ConnectButton as RainbowWidget } from "@rainbow-me/rainbowkit";
import { constants } from "../constants";
import { ethers, Signer } from "ethers";
import { useSigner, useAccount } from "wagmi";
import { useState } from "react";

export default function Mint() {
  const { address } = useAccount();
  const { data: signer } = useSigner();
  const [isMinting, toggleMinting] = useState(false);
  const contract = new ethers.Contract(
    constants.NFT_MEMBERSHIP_ADDRESS,
    constants.NFT_MEMBERSHIP_ABI
  );

  const mint = async () => {
    toggleMinting(true);

    if (!address) return;
    try {
      const tx = await contract.connect(signer as Signer).mint();
      const result = await tx.wait();
      toggleMinting(false);
      console.log(result);
    } catch (e) {
      toggleMinting(false);
      console.log(e);
    }
  };

  return (
    <button
      onClick={() => mint()}
      className="rounded-md border border-black bg-white-600 px-3.5 py-2.5 text-sm font-semibold text-black shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    >
      {isMinting
        ? "Minting .. Please wait.."
        : "Jetzt Minten und Membership sichern!"}
    </button>
  );
}
