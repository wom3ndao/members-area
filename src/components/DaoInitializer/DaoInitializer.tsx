import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "react-router";

import { useWeb3Context } from "context/Web3ContextProvider";
import { Wrap } from "context/Web3ContextProvider/styles";
import { motion } from "framer-motion";
import { ErrorHandler, getDaoSupportedNetworks } from "helpers";

import useLoadDao from "hooks/useLoadDao";

import { useDaoStore } from "store/dao/hooks";
import { useProviderStore } from "store/provider/hooks";

import { PROVIDERS } from "constants/providers";

interface Props {
  children: ReactNode;
}

function DaoInitializer({ children }: Props) {
  const { pathname } = useLocation();
  const [isInfoLoaded, setIsInfoLoaded] = useState(false);
  const [isDaoAddressChecked, setIsDaoAddressChecked] = useState(false);
  const { currentProvider, isWeb3Loaded, initDefaultProvider } = useWeb3Context();
  const { setDaoAddress, setSupportedNetworks, supportedNetworks } = useDaoStore();
  const { setProviderValue, currentProvider: storeProvider, isRightNetwork } = useProviderStore();
  const { loadAdditionalInfo } = useLoadDao();

  const loadAppDetails = async () => {
    if (!isWeb3Loaded || !storeProvider || !isDaoAddressChecked || !isRightNetwork) return;

    setIsInfoLoaded(false);
    try {
      await loadAdditionalInfo();
    } catch (error) {
      ErrorHandler.processWithoutFeedback(error);
    }
    setIsInfoLoaded(true);
  };

  const initDaoAddress = async () => {
    try {
      // SET DAO ADDRESS
      const daoAddress =
        currentProvider?.chainId === 35443 // TEST
          ? "0x20345B6b458Ef96878668AF8bE51dc3abD41FC92"
          : currentProvider?.chainId === 35441 // MAIN
          ? "0x7291ad61261693e312d9affecc2429f5ee288262"
          : "";
      setIsDaoAddressChecked(false);
      const chains = await getDaoSupportedNetworks(daoAddress);
      const supportedChains = chains.filter((item) => item.isDaoExist);
      setDaoAddress(daoAddress);
      setSupportedNetworks(supportedChains);
      setIsDaoAddressChecked(true);
    } catch (error) {
      ErrorHandler.processWithoutFeedback(error);
    }
  };

  const tryInitProvider = async () => {
    try {
      if (storeProvider?.selectedProvider !== PROVIDERS.default) return;
      const isDaoInitOnSupportedChain = supportedNetworks.find((item) => item.chainId === storeProvider.chainId);
      if (isDaoInitOnSupportedChain && supportedNetworks.length) {
        await initDefaultProvider(isDaoInitOnSupportedChain.chainId);
      }
    } catch (error) {
      ErrorHandler.processWithoutFeedback(error);
    }
  };

  useEffect(() => {
    if (currentProvider?.provider) {
      setProviderValue(currentProvider);
      tryInitProvider();
    }
  }, [currentProvider]);

  useEffect(() => {
    loadAppDetails();
  }, [storeProvider, isDaoAddressChecked, isRightNetwork]);

  useEffect(() => {
    initDaoAddress();
  }, [pathname, currentProvider?.chainId]);

  if (!isWeb3Loaded || !isInfoLoaded || !storeProvider?.provider || !isDaoAddressChecked) {
    return (
      <Wrap>
        <motion.div
          className="breathing-q"
          animate={{ scale: 1.2 }}
          transition={{
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeOut",
            duration: 0.5,
          }}
        >
          <img className="breathing-q__logo" src="/logo.png" alt="q" />
        </motion.div>
      </Wrap>
    );
  }

  return <div>{children}</div>;
}

export default DaoInitializer;
