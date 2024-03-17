import gtag from "ga-gtag";
import { WalletButton } from "hd-materials";
import { useMoralis } from "react-moralis";
import { useHyperdapp } from "../hooks/useHyperdapp";

const WalletBtn = () => {
  const { account, chainId, isAuthenticated, isAuthenticating } = useMoralis();
  const { connectWallet, disconnectWallet } = useHyperdapp();

  return (
    <WalletButton
      account={account}
      chainId={chainId}
      isAuthenticating={isAuthenticating}
      isAuthenticated={isAuthenticated}
      onConnect={async () => {
        await connectWallet();
        gtag("event", "connect_wallet");
      }}
      onDisconnect={async () => {
        await disconnectWallet();
        gtag("event", "disconnect_wallet");
      }}
    />
  );
};

export default WalletBtn;
