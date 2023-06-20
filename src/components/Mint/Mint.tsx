import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@q-dev/q-ui-kit';
import { Signer } from 'ethers';
import styled from 'styled-components';

import useContract from 'hooks/useContract';
import useNfts from 'hooks/useNfts';

import { useProviderStore } from 'store/provider/hooks';

const StyledWrapper = styled.div`
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

function Mint () {
  const { t } = useTranslation();
  const { currentProvider } = useProviderStore();
  const { nftContract: contract } = useContract();
  const [isMinting, setMinting] = useState(false);
  const { hasMinted } = useNfts(isMinting);
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
        <h3 className="text-h3">
          {currentProvider?.selectedAddress && hasMinted ? 'Willkommen in deiner wom3n.DAO!' : 'Membership NFT'}
        </h3>
      </div>

      <div className="block__content">
        {!currentProvider?.selectedAddress && (
          <p>Bitte verbinde zuerst deine Wallet (oben rechts), damit wir prüfen können, ob du bereits Member bist.</p>
        )}

        {currentProvider?.selectedAddress && isAllowed && !hasMinted && <p>Deine Wallet steht auf der Allowlist!</p>}

        {currentProvider?.selectedAddress && !isAllowed && !hasMinted && (
          <>
            <p>Du bist leider nicht berechtigt, ein wom3n.DAO NFT zu minten.</p>
            <p className="text-sm font-light">
              Finde{' '}
              <a
                style={{ textDecoration: 'underline' }}
                rel="noreferrer"
                href="https://wom3n.io"
                target="_blank"
              >
                hier
              </a>{' '}
              heraus, wie das geht.
            </p>
          </>
        )}

        {currentProvider?.selectedAddress && isAllowed && !hasMinted && (
          <Button onClick={() => mint()}>
            {isMinting ? 'Minting .. Please wait..' : 'Jetzt Minten und Membership sichern!'}
          </Button>
        )}
        {currentProvider?.selectedAddress && hasMinted && <p>(Du bist bereits Mitglied! :))</p>}
      </div>
    </StyledWrapper>
  );
}

export default Mint;
