import { useCallback } from 'react';

import { DAO_RESERVED_NAME, DefaultVotingSituations } from '@q-dev/gdk-sdk';
import { ErrorHandler } from 'helpers';
import { NewProposalForm } from 'typings/forms';
import {
  DaoProposal,
  DaoProposalVotingInfo,
  ProposalBaseInfo,
  VotingActionType
} from 'typings/proposals';

import { useProviderStore } from 'store/provider/hooks';

import { daoInstance } from 'contracts/contract-instance';
import {
  createConstitutionProposal,
  createGeneralSituationProposal,
  createMembershipSituationProposal,
  createParameterSituationProposal
} from 'contracts/helpers/proposals-helper';

import { PROPOSAL_STATUS } from 'constants/statuses';

export function useDaoProposals () {
  const { currentProvider } = useProviderStore();

  async function getPanelSituations (panelName: string) {
    try {
      if (!daoInstance) return;
      const votingInstance = await daoInstance.getDAOVotingInstance(panelName);
      return votingInstance.instance.getVotingSituations();
    } catch (error) {
      ErrorHandler.processWithoutFeedback(error);
    }
  }

  async function getPanelSituationInfo (panelName: string, situation: string) {
    try {
      if (!daoInstance) return;
      const votingInstance = await daoInstance.getDAOVotingInstance(panelName);
      const votingSituationInfo = await votingInstance.instance.getVotingSituationInfo(situation);
      return votingSituationInfo;
    } catch (error) {
      ErrorHandler.processWithoutFeedback(error);
    }
  }

  async function getProposalsList (panelName: string, offset: number, limit: number) {
    try {
      if (!daoInstance) return;
      const votingInstance = await daoInstance.getDAOVotingInstance(panelName);
      return votingInstance.getProposalList(offset, limit);
    } catch (error) {
      ErrorHandler.processWithoutFeedback(error);
    }
  }

  async function getProposal (panelName: string, proposalId: string | number) {
    try {
      if (!daoInstance) return;
      const votingInstance = await daoInstance.getDAOVotingInstance(panelName);
      return votingInstance.getProposal(Number(proposalId));
    } catch (error) {
      ErrorHandler.processWithoutFeedback(error);
    }
  }

  async function getUserVotingStats (proposal: DaoProposal) {
    try {
      if (!daoInstance || !currentProvider?.selectedAddress) return { isUserVoted: false, isUserVetoed: false };
      const votingInstance = await daoInstance.getDAOVotingInstance(proposal.relatedExpertPanel);
      const isUserVoted = await votingInstance.instance
        .hasUserVoted(Number(proposal.id), currentProvider.selectedAddress);
      const isUserVetoed = await votingInstance.instance
        .hasUserVetoed(Number(proposal.id), currentProvider.selectedAddress);
      return { isUserVoted, isUserVetoed };
    } catch (error) {
      ErrorHandler.processWithoutFeedback(error);
    }
  }

  async function getProposalVetoStats (proposal: DaoProposal) {
    try {
      if (!daoInstance) return;
      const permissionManagerInstance = await daoInstance.getPermissionManagerInstance();
      const isVetoGroupExists = await permissionManagerInstance.isVetoGroupExists(proposal.target);
      const vetoMembersCount = isVetoGroupExists
        ? (await permissionManagerInstance.instance.getVetoMembersCount(proposal.target)).toString()
        : '0';
      const vetoGroupInfo = (await permissionManagerInstance.instance
        .getVetoGroupInfo(proposal.target));
      return { isVetoGroupExists, vetoMembersCount, vetoGroupInfo };
    } catch (error) {
      ErrorHandler.processWithoutFeedback(error);
    }
  }

  async function getProposalMembersCount (proposal: DaoProposal) {
    try {
      if (!daoInstance || proposal.relatedExpertPanel === DAO_RESERVED_NAME) return '0';
      const memberStorageInstance = await daoInstance.getMemberStorageInstance(proposal.relatedExpertPanel);
      const count = await memberStorageInstance.instance.getMembersCount();
      return count.toString();
    } catch (error) {
      ErrorHandler.processWithoutFeedback(error);
    }
  }
  async function getAccountStatuses () {
    try {
      if (!daoInstance || !currentProvider?.selectedAddress) return [];
      return await daoInstance.DAORegistryInstance.getAccountStatuses(
        currentProvider.selectedAddress
      );
    } catch (error) {
      ErrorHandler.processWithoutFeedback(error);
      return [];
    }
  }

  async function getProposalVotingDetails (proposal: DaoProposal) {
    try {
      if (!daoInstance) return;

      const votingInstance = await daoInstance.getDAOVotingInstance(proposal.relatedExpertPanel);
      const proposalVotingStats = await votingInstance.getProposalVotingStats(Number(proposal.id.toString()));
      const proposalStatus = await votingInstance.instance.getProposalStatus(proposal.id.toString());
      return { ...proposalVotingStats, votingStatus: proposalStatus } as DaoProposalVotingInfo;
    } catch (error) {
      ErrorHandler.processWithoutFeedback(error);
    }
  }

  async function getProposalTurnoutDetails (proposal: DaoProposal) {
    try {
      if (!daoInstance) return;
      const totalVoteValue = await daoInstance.getProposalTotalParticipate(
        proposal.relatedExpertPanel,
        Number(proposal.id.toString())
      );
      return totalVoteValue.toString();
    } catch (error) {
      ErrorHandler.processWithoutFeedback(error);
    }
  }

  async function getProposalBaseInfo (panelName: string, proposalId: string | number) {
    try {
      const proposal = (await getProposal(panelName, proposalId)) as DaoProposal;
      if (!proposal) return;
      const [userVotingInfo, userVetoInfo, proposalInfo, totalVoteValue, membersCount] = await Promise.all([
        getUserVotingStats(proposal),
        getProposalVetoStats(proposal),
        getProposalVotingDetails(proposal),
        getProposalTurnoutDetails(proposal),
        getProposalMembersCount(proposal)
      ]);

      return {
        totalVoteValue,
        membersCount,
        ...proposal,
        ...userVotingInfo,
        ...userVetoInfo,
        ...proposalInfo
      } as ProposalBaseInfo;
    } catch (error) {
      ErrorHandler.processWithoutFeedback(error);
    }
  }

  async function createNewProposal (form: NewProposalForm) {
    switch (form.type) {
      case DefaultVotingSituations.GeneralSituation:
        return createGeneralSituationProposal(form);
      case DefaultVotingSituations.MembershipSituation:
        return createMembershipSituationProposal(form);
      case DefaultVotingSituations.ConstitutionSituation:
        return createConstitutionProposal(form);
      case DefaultVotingSituations.RegularParameterSituation:
        return createParameterSituationProposal(form, DefaultVotingSituations.RegularParameterSituation);
      case DefaultVotingSituations.ConfigurationParameterSituation:
        return createParameterSituationProposal(form, DefaultVotingSituations.ConfigurationParameterSituation);
    }
  }

  async function voteForProposal ({
    proposal,
    type,
    isVotedFor
  }: {
    proposal: DaoProposal;
    type: VotingActionType;
    isVotedFor?: boolean;
  }) {
    if (!daoInstance || !currentProvider) return;
    const votingInstance = await daoInstance.getDAOVotingInstance(proposal.relatedExpertPanel);
    const userAddress = currentProvider?.selectedAddress;

    if (type === 'vote') {
      return isVotedFor
        ? votingInstance.voteFor(Number(proposal.id), { from: userAddress })
        : votingInstance.voteAgainst(Number(proposal.id), { from: userAddress });
    }

    return votingInstance.veto(Number(proposal.id), { from: userAddress });
  }

  async function executeProposal (proposal: DaoProposal) {
    if (!daoInstance || !currentProvider) return;
    const votingInstance = await daoInstance.getDAOVotingInstance(proposal.relatedExpertPanel);
    const userAddress = currentProvider?.selectedAddress;
    const promiseStatus = await votingInstance.instance.getProposalStatus(Number(proposal.id));
    return promiseStatus === PROPOSAL_STATUS.passed && !proposal.executed
      ? votingInstance.executeProposal(Number(proposal.id), { from: userAddress })
      : undefined;
  }

  return {
    createNewProposal: useCallback(createNewProposal, []),
    voteForProposal: useCallback(voteForProposal, []),
    executeProposal: useCallback(executeProposal, []),
    getProposal: useCallback(getProposal, []),
    getProposalsList: useCallback(getProposalsList, []),
    getProposalVotingDetails: useCallback(getProposalVotingDetails, []),
    getPanelSituations: useCallback(getPanelSituations, []),
    getUserVotingStats: useCallback(getUserVotingStats, []),
    getProposalVetoStats: useCallback(getProposalVetoStats, []),
    getProposalBaseInfo: useCallback(getProposalBaseInfo, []),
    getAccountStatuses: useCallback(getAccountStatuses, []),
    getPanelSituationInfo: useCallback(getPanelSituationInfo, [])
  };
}
