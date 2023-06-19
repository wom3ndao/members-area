import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';

import Network from 'navigation/Header/components/Network';

import packageJson from '../../../package.json';

import EcosystemLinks from './components/EcosystemLinks';
import References from './components/References/References';
import SidebarLink from './components/SidebarLink/SidebarLink';
import VersionModal from './components/VersionModal';
import { SidebarContainer } from './styles';

import { useDaoStore } from 'store/dao/hooks';

import { RoutePaths } from 'constants/routes';

function Sidebar ({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { composeDaoLink, isShowDao } = useDaoStore();
  const [versionModalOpen, setVersionModalOpen] = useState(false);

  return (
    <SidebarContainer $open={open} isSelectPage={isShowDao}>
      <div className="sidebar-overlay" onClick={onClose} />

      <div className="sidebar" onClick={onClose}>
        <div className="sidebar-content">
          <Link to="/" className="sidebar-logo-link">
            <p className="sidebar__logo-title text-h3">{'wom3n.DAO MEMBERS'}</p>
          </Link>

          <div className="sidebar-main">
            <div className="sidebar__network">
              <Network />
            </div>
            {!isShowDao && (
              <div className="sidebar-links">
                <SidebarLink
                  exact={!pathname.includes('dashboard')}
                  to={'/'}
                  title={t('DASHBOARD')}
                  icon="dashboard"
                />
                <SidebarLink
                  exact={false}
                  to={'/mein-nft'}
                  title={'Mein NFT'}
                  icon="medium"
                />
                <SidebarLink
                  exact={false}
                  to={'/collection'}
                  title={'Collection'}
                  icon="folder"
                />
                <SidebarLink
                  exact={false}
                  to={composeDaoLink('/governance')}
                  title={t('GOVERNANCE')}
                  icon="vote"
                />
                <SidebarLink
                  exact={false}
                  to={composeDaoLink(RoutePaths.votingPower)}
                  title={t('VOTING_POWER')}
                  icon="bank"
                />
              </div>
            )}

            <References />
            <EcosystemLinks />
          </div>
        </div>

        <div className="sidebar-footer">
          <button className="sidebar-footer-link text-md" onClick={() => setVersionModalOpen(true)}>
            {packageJson.version}
          </button>

          <Link to="/privacy" className="sidebar-footer-link text-md">
            {t('DATA_PRIVACY')}
          </Link>

          <Link to="/imprint" className="sidebar-footer-link text-md">
            {t('IMPRINT')}
          </Link>
        </div>

        <VersionModal open={versionModalOpen} onClose={() => setVersionModalOpen(false)} />
      </div>
    </SidebarContainer>
  );
}

export default Sidebar;
