import { lazy } from "react";
import { Route, Switch } from "react-router-dom";

import LazyLoading from "components/Base/LazyLoading";
import ErrorBoundary from "components/Custom/ErrorBoundary";
import Admin from "pages/Admin";
import useContracts from "hooks/useContracts";

const Imprint = lazy(() => import("pages/Imprint"));
const DataPrivacy = lazy(() => import("pages/DataPrivacy"));
const NotFound = lazy(() => import("pages/NotFound"));

const VotingPower = lazy(() => import("pages/VotingPower"));
const Manage = lazy(() => import("pages/Parameters"));
const Dashboard = lazy(() => import("pages/Dashboard"));

const Governance = lazy(() => import("pages/Governance"));
const NewProposal = lazy(() => import("pages/Governance/NewProposal"));
const Proposal = lazy(() => import("pages/Governance/Proposal"));

const MyNFT = lazy(() => import("pages/My-NFT/MyNFT"));
const Collection = lazy(() => import("pages/Collection/Collection"));

function Routes() {
  const { daoAddress } = useContracts();

  return (
    <ErrorBoundary>
      <LazyLoading>
        <Switch>
          {/* <Route exact path="/">
            <SelectDAO />
          </Route> */}

          <Route exact path="/imprint">
            <Imprint />
          </Route>

          <Route exact path="/privacy">
            <DataPrivacy />
          </Route>

          <Route exact path="/admin">
            <Admin />
          </Route>

          <Route exact path="/mein-nft">
            <MyNFT />
          </Route>

          <Route exact path="/collection">
            <Collection />
          </Route>

          <Route exact path="/">
            <Dashboard />
          </Route>

          <Route exact path={`/${daoAddress}/parameters/:type?`}>
            <Manage />
          </Route>

          <Route exact path={`/${daoAddress}/governance/:type/new`}>
            <NewProposal />
          </Route>

          <Route exact path={`/${daoAddress}/governance/:tab?`}>
            <Governance />
          </Route>

          <Route exact path={`/${daoAddress}/governance/proposal/:panel?/:id?`}>
            <Proposal />
          </Route>

          <Route exact path={`/${daoAddress}/voting-power`}>
            <VotingPower />
          </Route>

          <Route component={NotFound} />
        </Switch>
      </LazyLoading>
    </ErrorBoundary>
  );
}

export default Routes;
