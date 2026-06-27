import { AgentKit, cdpApiActionProvider, cdpEvmWalletActionProvider } from "@coinbase/agentkit";
import { getVercelAITools } from "@coinbase/agentkit-vercel-ai-sdk";

export async function initializeOnChainAgent() {
  const cdpApi = cdpApiActionProvider();
  const cdpWallet = cdpEvmWalletActionProvider();

  const agentKit = await AgentKit.from({
    walletProvider: undefined,
    actionProviders: [cdpApi, cdpWallet], 
  });

  const aiTools = await getVercelAITools(agentKit);

  return { aiTools };
}
