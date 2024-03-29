import { ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useTheme } from 'styled-components';

import NetworkWarning from 'components/NetworkWarning';
import SupportedDaoNetworks from 'components/SupportedDaoNetworks';
import TransactionLoader from 'components/TransactionLoader';
import Header from 'navigation/Header';
import Sidebar from 'navigation/Sidebar';
import NotFound from 'pages/NotFound';

import { AppContainer } from './styles';

import { useDaoStore } from 'store/dao/hooks';
import { useProviderStore } from 'store/provider/hooks';

interface Props {
  children: ReactNode;
}

function Layout ({ children }: Props) {
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentProvider, isRightNetwork } = useProviderStore();
  const { isDarkTheme, onChangeTheme } = useTheme();
  const { supportedNetworks, isDaoOnSupportedNetwork, isShowDao, isSelectPage, daoAddress } = useDaoStore();

  useEffect(() => {
    if (isDarkTheme) onChangeTheme();
  }, []);

  const infoPages = ['imprint', 'privacy'];

  return (
    <>
      {currentProvider?.isConnected && !isRightNetwork
        ? (
          <NetworkWarning />
        )
        : (
          <AppContainer $wide={isShowDao}>
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="app__content">
              <Header onMenuClick={() => setSidebarOpen(true)} />
              <main className="app__main">
                {isSelectPage || infoPages.includes(daoAddress)
                  ? (
                    <div className="app__main-content">{children}</div>
                  )
                  : (
                    <>
                      {isDaoOnSupportedNetwork
                        ? (
                          <NotFound text={t('DAO_TOKEN_NOT_SUPPORTED')} />
                        )
                        : (
                          <SupportedDaoNetworks networkOptions={supportedNetworks} />
                        )}
                    </>
                  )}
              </main>
            </div>
          </AppContainer>
        )}
      <TransactionLoader />
    </>
  );
}

export default Layout;
