import { StyledWrapper } from "components/Mint/Mint";
import PageLayout from "components/PageLayout";
import useNfts, { Token } from "hooks/useNfts";

function MyNFT() {
  const { nfts, hasMinted, hasInVault, vaultNfts } = useNfts(false);
  console.log(nfts, hasMinted, vaultNfts, hasInVault);

  return (
    <PageLayout title={"Mein wom3n.DAO NFT"}>
      {!hasMinted && !hasInVault && (
        <div className="nft-card border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 md:mb-12 md:grid-cols-2">
          <p className="text-lg leading-8 text-gray-600">Du bist leider noch kein DAO-Mitglied.</p>
        </div>
      )}
      {hasMinted && (
        <StyledWrapper className="block">
          <div className="expert-panel-block__header block__header">
            Diesen NFT hast du gemintet, aber noch nicht für das Voting in der wom3n.DAO freigegeben.
          </div>

          <div className="block__content">
            {nfts?.map((nft: Token) => (
              <>
                <div className="nft-card border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 md:mb-12 md:grid-cols-2">
                  <img style={{ display: "inline", width: 500 }} src={nft.image} alt="" className="nft-card__img" />

                  <div className="nft-card__content">
                    <h2 className="nft-card__content-title">wom3n.DAO NFT Season #1 No. {nft?.id}</h2>
                  </div>
                </div>
              </>
            ))}
          </div>
        </StyledWrapper>
      )}
      {hasInVault && (
        <StyledWrapper className="block">
          <div className="expert-panel-block__header block__header">
            Du hast diesen von dir geminteten NFT für das Voting in der wom3n.DAO freigegeben.
          </div>

          <div className="block__content">
            {vaultNfts?.map((nft: any) => (
              <>
                <div className="nft-card border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 md:mb-12 md:grid-cols-2">
                  <img style={{ display: "inline", width: 500 }} src={nft.image} alt="" className="nft-card__img" />

                  <div className="nft-card__content">
                    <h2 className="nft-card__content-title">wom3n.DAO NFT Season #1 No. {nft?.id}</h2>
                  </div>
                </div>
              </>
            ))}
          </div>
        </StyledWrapper>
      )}
    </PageLayout>
  );
}
export default MyNFT;
