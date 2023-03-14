import { ConnectButton as RainbowWidget } from "@rainbow-me/rainbowkit";
import { constants } from "../constants";
import { ethers, Signer } from "ethers";
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
    const tx = await contract.connect(signer as Signer).mint(metaDataUri);
    const result = await tx.wait();
    console.log(result);
  };

  const MintButton = () => {
    return (
      <button
        onClick={() => mint()}
        className="bg-[#ba2a4b] hover:[#ba2a4b] text-white font-bold py-2 px-4 rounded"
      >
        Mint
      </button>
    );
  };

  return (
    <>
      <div className="bg-white py-24 px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-base font-semibold leading-7 text-black text-center">
            Deine Wallet:
            <RainbowWidget chainStatus="name" />
          </p>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            {isConnected && !hasMinted && <MintButton />}
          </h2>
        </div>
      </div>
    </>
  );
}
