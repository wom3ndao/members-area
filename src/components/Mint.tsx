import { constants } from "../constants";
import { ethers, Signer } from "ethers";
import { useSigner, useAccount } from "wagmi";
import { get_stage } from "@/utils";

export default function Mint({ isMinting, toggleMinting }: any) {
  const { address } = useAccount();
  const { data: signer } = useSigner();

  const contract = new ethers.Contract(
    get_stage() === "production"
      ? constants.NFT_MEMBERSHIP_ADDRESS_Q_MAINNET
      : constants.NFT_MEMBERSHIP_ADDRESS_Q_TESTNET,
    constants.NFT_MEMBERSHIP_ABI
  );

  const mint = async () => {
    toggleMinting(true);

    if (!address) return;
    try {
      const tx = await contract.connect(signer as Signer).mint({
        gasLimit: 30000,
      });
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
