import { useMoralis } from "react-moralis";
import { toast } from "react-toastify";
import { TOAST_TXT } from "../models/toast.models";

interface HyperdappHook {
  connectWallet(): Promise<void>;
  disconnectWallet(): Promise<void>;
}

const signingMessage = `Welcome to HyperDapp! 

Please sign this message to log in to HyperDapp.
        
This request will not trigger a blockchain transaction or cost any gas fees.
        
Your authentication status will reset after 24 hours.`;

export const useHyperdapp = (): HyperdappHook => {
  const { authenticate, logout } = useMoralis();

  const connectWallet = async () => {
    toast.loading(TOAST_TXT.CONNECTING, { autoClose: false });
    await authenticate({
      signingMessage,
      onSuccess: async (user) => {
        await user?.save({
          lastConnection: new Date(),
          connectedFromHyperdapp: true,
        });
        toast.dismiss();
        toast.success(TOAST_TXT.CONNECTED);
      },
      onError: (error) => {
        toast.dismiss();
        toast.error(error.message);
      },
    });
  };

  const disconnectWallet = () => logout();

  return { connectWallet, disconnectWallet };
};
