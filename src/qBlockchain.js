
export const qBlockchainMain = {
    id: 35441,
    name: 'Q Mainnet',
    network: 'q_main',
    nativeCurrency: {
        decimals: 18,
        name: 'Q',
        symbol: 'Q',
    },
    rpcUrls: {
        default: { http: ['https://rpc.q.org'] },
    },
    blockExplorers: {
        default: { url: 'https://explorer.q.org' },
    },
};

export const qBlockchainTest = {
    id: 35443,
    name: 'Q Testnet',
    network: 'q_dev',
    nativeCurrency: {
        decimals: 18,
        name: 'Q',
        symbol: 'Q',
    },
    rpcUrls: {
        default: { http: ['https://rpc.qtestnet.org'] },
    },
    blockExplorers: {
        default: { url: 'https://explorer.qtestnet.org' },
    },
    testnet: true,

};