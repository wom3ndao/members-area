import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@q-dev/q-ui-kit";
import { Signer } from "ethers";
import styled from "styled-components";

import useContract from "hooks/useContracts";
import useNfts from "hooks/useNfts";

import { useProviderStore } from "store/provider/hooks";

const AlertCard = styled.div`
  padding: 20px;
  border: 1px solid #f8d7da;
  color: #721c24;
  background-color: #f8d7da;
  border-color: #f5c6cb;
  border-radius: 0.25rem;
  margin-bottom: 1rem;
`;

export const StyledWrapper = styled.div`
  .expert-panel-block__header {
    margin-right: -8px;
  }

  .expert-panel-block__loading-wrp {
    display: grid;
    place-content: center;
    padding: 40px;
  }

  .expert-panel-block__list {
    display: grid;
    gap: 16px;
  }

  .expert-panel-block__list-item {
    display: flex;
    align-items: center;
    gap: 4px;
  }
`;

function Mint() {
  const { t } = useTranslation();
  const { currentProvider } = useProviderStore();
  const { nftContract: contract } = useContract();
  const [isMinting, setMinting] = useState(false);
  const { hasMintedOrInVault } = useNfts(isMinting);
  const [isAllowed, setIsAllowed] = useState();

  useEffect(() => {
    getIsAllowed();
  }, [currentProvider?.selectedAddress]);

  const getIsAllowed = async () => {
    const isAllowed = await contract
      .connect(currentProvider?.provider as any)
      .allowlist(currentProvider?.selectedAddress);
    setIsAllowed(isAllowed);
  };

  const mint = async () => {
    if (!currentProvider?.selectedAddress) return;
    try {
      setMinting(true);
      const tx = await contract.connect(currentProvider?.signer as Signer).mint({
        gasLimit: 1000000,
      });
      const result = await tx.wait();
      console.log(result);
      setMinting(false);
    } catch (e) {
      console.log(e);
      setMinting(false);
    }
  };

  return (
    <StyledWrapper className="block">
      <div className="expert-panel-block__header block__header">
        <h3 className="text-h3">Willkommen in der wom3n.DAO MEMBERS AREA!</h3>
        <p>
          <b>
            Hier ist der Ort, an dem sich die Mitglieder der wom3n.DAO organisieren. Falls du berechtigt bist, kannst du
            hier einen offiziellen wom3n.DAO NFT minten und danach für das die DAO-Governance approven. Für alle
            Mitglieder steht der Bereich der Votings offen. Hier treffen wir blockchain-basiert DAO-interne
            Entscheidungen. Du kannst dir außerdem unsere aktuelle NFT-Collection ansehen.
          </b>
        </p>
      </div>

      <div className="block__content">
        {!currentProvider?.selectedAddress && (
          <p>
            <em>
              Bitte verbinde zuerst deine Wallet (oben rechts), damit wir prüfen können, ob du bereits Member bist.
            </em>
          </p>
        )}

        {currentProvider?.selectedAddress && isAllowed && !hasMintedOrInVault && (
          <p>
            <em>Deine Wallet steht auf der Allowlist!</em>
          </p>
        )}

        {currentProvider?.selectedAddress && !isAllowed && !hasMintedOrInVault && (
          <>
            <p>Du bist leider nicht berechtigt, ein wom3n.DAO NFT zu minten.</p>
            <p className="text-sm font-light">
              Finde{" "}
              <a style={{ textDecoration: "underline" }} rel="noreferrer" href="https://wom3n.io" target="_blank">
                hier
              </a>{" "}
              heraus, wie das geht.
            </p>
          </>
        )}

        {currentProvider?.selectedAddress && isAllowed && !hasMintedOrInVault && (
          <>
            <br />
            <Button onClick={() => mint()}>
              {isMinting ? "Minting .. Please wait.." : "Jetzt Minten und Membership sichern!"}
            </Button>
          </>
        )}
        {currentProvider?.selectedAddress && hasMintedOrInVault && (
          <p>
            <em>Du bist bereits Mitglied!</em>
          </p>
        )}
      </div>
      <br />
      {currentProvider?.chainId === 35443 && (
        <AlertCard>
          <p>Bitte beachte, dass du dich in der TESTNET-Version der wom3n.DAO befindest. Hier ist unsere Spielwiese!</p>
        </AlertCard>
      )}
    </StyledWrapper>
  );
}

export default Mint;
