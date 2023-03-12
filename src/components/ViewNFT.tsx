import useNfts, { Token } from "../hooks/useNfts";

export default function ViewNFT() {
  const { nfts, hasMinted } = useNfts();

  if (!hasMinted) return null;
  return (
    <>
      {nfts?.map((nft: Token) => (
        <>
          <p className="mt-6 text-lg leading-8 text-white">
            Glückwunsch, du bist bereits Mitglied!{" "}
          </p>
          <div className="nft-card">
            <img
              style={{ display: "inline" }}
              src={nft.json.image.replace("ipfs://", "https://ipfs.io/ipfs/")}
              alt=""
              className="nft-card__img"
            />

            <div className="nft-card__content">
              <h2 className="nft-card__content-title">
                wom3n.DAO NFT Season #1 No. #{nft?.id}
              </h2>
            </div>
          </div>
        </>
      ))}
    </>
  );
}