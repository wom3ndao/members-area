import useNfts, { Token } from "../hooks/useNfts";

export default function MyNFT() {
  const { nfts, hasMinted } = useNfts(false);
  if (!hasMinted) return null;
  return (
    <>
      {nfts?.map((nft: Token) => (
        <>
          <div className="nft-card border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 md:mb-12 md:grid-cols-2">
            <img
              style={{ display: "inline" }}
              src={nft.image}
              alt=""
              className="nft-card__img"
            />

            <div className="nft-card__content">
              <h2 className="nft-card__content-title">
                wom3n.DAO NFT Season #1 No. {nft?.id}
              </h2>
            </div>
          </div>
        </>
      ))}
    </>
  );
}