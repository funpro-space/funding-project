'use client';

import { ReactNode, useState, useEffect } from 'react';
import { http } from 'wagmi';
import { WagmiProvider, createConfig } from '@privy-io/wagmi';
import { base } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { useBClickObserver } from '@/lib/use-bclick';
import { WorkspaceModalProvider } from '@/components/providers/WorkspaceModalProvider';
import { PrivyProvider, dataSuffix } from '@privy-io/react-auth';
import { Attribution } from 'ox/erc8021';
import { Toaster } from 'sonner';
import '@coinbase/onchainkit/styles.css';
import { addRpcUrlOverrideToChain } from '@privy-io/chains';

const baseMainnetOverride = addRpcUrlOverrideToChain(base, 'https://mainnet.base.org');

// Generate the ERC-8021 attribution suffix for funpro.space and funpro
const DATA_SUFFIX = Attribution.toDataSuffix({
  codes: ['funpro.space', 'funpro'],
});

const wagmiConfig = createConfig({
  chains: [base],
  transports: {
    // Force the transport to bind cleanly to the Chain ID (8453)
    [base.id]: http('https://mainnet.base.org'), 
  },
  dataSuffix: DATA_SUFFIX,
});

declare module 'wagmi' {
  interface Register {
    config: typeof wagmiConfig;
  }
}

export function OnchainProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  useBClickObserver();

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_PRIVY_APP_ID && process.env.NODE_ENV === 'development') {
      console.warn(
        '[OnchainProvider] NEXT_PUBLIC_PRIVY_APP_ID is missing. Authentication features will fail. Please add it to your environment variables.'
      );
    }
  }, []);

  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || "clx123abc0000000000000000"}
      config={{
        loginMethods: ['wallet'],
        appearance: {
          theme: 'dark',
          accentColor: '#67a2a4',
          showWalletLoginFirst: true,
          walletList: ['base_account'],
        },
        // Hard-override Privy to only understand Base Mainnet
        defaultChain: baseMainnetOverride,
        supportedChains: [baseMainnetOverride],
        intl: {
          defaultCountry: 'US',
        },
        plugins: [dataSuffix(DATA_SUFFIX)],
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>
          <OnchainKitProvider
            apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY || ''}
            chain={base}
          >
            <WorkspaceModalProvider>
              {children}
              <Toaster position="bottom-right" richColors />
            </WorkspaceModalProvider>
          </OnchainKitProvider>
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}
