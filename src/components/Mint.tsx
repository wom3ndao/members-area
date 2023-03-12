import { ConnectButton } from "@rainbow-me/rainbowkit";
import { constants } from "../constants";
import { ethers } from "ethers";
import { useSigner, useProvider, useAccount } from "wagmi";
import useNfts from "../hooks/useNfts";

const metaDataUris = [
  {
    id: 0,
    url: "ipfs://bafkreieimllgtcym4ztsrj5wcroikrtewlipzgczftbbk4k3sfbiobcpe4",
  },
];

export default function Mint() {
  const { address, isConnected } = useAccount();
  const { data: signer } = useSigner();
  const { hasMinted } = useNfts();
  const provider = useProvider();
  const contract = new ethers.Contract(
    constants.NFT_MEMBERSHIP_ADDRESS,
    constants.NFT_MEMBERSHIP_ABI
  );

  const getCurrentTokenId = async () => {
    const tx = await contract.connect(provider).getCurrentTokenID();
    const result = tx.toNumber();
    return result;
  };

  const mint = async () => {
    const currentTokenId = await getCurrentTokenId();
    if (!address || !(currentTokenId >= 0)) return;
    const metaDataUri = metaDataUris.find(
      (uri) => uri.id === currentTokenId
    )?.url;
    const tx = await contract.connect(signer).mint(metaDataUri);
    const result = await tx.wait();
  };

  const MintButton = () => {
    return (
      <button
        onClick={() => mint()}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Mint
      </button>
    );
  };

  return (
    <>
      {isConnected && !hasMinted && <MintButton />}
      <ConnectButton />{" "}
    </>
  );
}
