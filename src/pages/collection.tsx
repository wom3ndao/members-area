import useNfts, { Token } from "../hooks/useNfts";

export default function Collection() {
  const { nfts, hasMinted } = useNfts(false);
  if (!hasMinted)
    return (
      <div className="nft-card border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 md:mb-12 md:grid-cols-2">
        <p className="text-lg leading-8 text-gray-600">
          Du bist leider noch kein DAO-Mitglied.
        </p>
      </div>
    );
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
