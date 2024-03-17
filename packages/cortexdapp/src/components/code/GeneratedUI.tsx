import Moralis from "moralis";
import React, { FC, useCallback, useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { Button } from "primereact/button";
import { HdLoader, PromptsList } from "hd-materials";
import useDebounce from "../../hooks/useDebounce";
import { useAppDispatch, useAppSelector } from "../../store/store";
import {
  executeFn,
  handleInput,
  initFlow,
} from "../../store/slices/code-editor";
import { toast } from "react-toastify";
import { TOAST_TXT } from "../../models/toast.models";

const baseURL = process.env["REACT_APP_BASE_URL"] as string;

const signingMessage = `Welcome! 

Please sign this message to log in.
        
This request will not trigger a blockchain transaction or cost any gas fees.
        
Your authentication status will reset after 24 hours.`;

interface GeneratedUIProps {
  generatedFrom: "editor" | "viewer" | "standalone";
  code: string;
  cid?: string;
}

const GeneratedUI: FC<GeneratedUIProps> = ({ generatedFrom, code, cid }) => {
  const { account, authenticate, isAuthenticated } = useMoralis();
  const { loading, prompts } = useAppSelector((store) => store.codeEditor);
  const [input, setInputValue] = useState({ name: "", value: "" });
  const debouncedInput = useDebounce(input, 500);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!code) return;
    if ("standalone" === generatedFrom && (!account || !isAuthenticated))
      return;

    dispatch(initFlow({ address: account, code }));
  }, [account, code, dispatch, isAuthenticated, generatedFrom]);

  useEffect(() => {
    const { name, value } = debouncedInput;
    dispatch(handleInput({ name, value }));
  }, [debouncedInput, dispatch]);

  const connectWallet = useCallback(
    async (provider: Moralis.Web3ProviderType) => {
      toast.loading(TOAST_TXT.CONNECTING, { autoClose: false });
      await authenticate({
        provider,
        signingMessage,
        onSuccess: async (user) => {
          const isFromEditor = "editor" === generatedFrom;
          const isFromViewer = "viewer" === generatedFrom;
          const isFromStandalone = "standalone" === generatedFrom;
          await user?.save({
            lastConnection: new Date(),
            ...(isFromEditor && { connectedFromEditor: true }),
            ...(isFromViewer && { connectedFromViewer: true }),
            ...(isFromStandalone && { connectedFromStandalone: true }),
          });
          toast.dismiss();
          toast.success(TOAST_TXT.CONNECTED);
        },
        onError: (error) => {
          toast.dismiss();
          toast.error(error.message);
        },
      });
    },
    [authenticate, generatedFrom]
  );

  const generatedUI = useCallback(() => {
    if (!code) return;

    if ("standalone" === generatedFrom && (!account || !isAuthenticated)) {
      return (
        <>
          <Button
            label="Connect with Wallet Connect"
            onClick={() => connectWallet("walletconnect")}
          />
          <Button
            label="Connect with Metamask"
            onClick={() => connectWallet("metamask")}
          />
        </>
      );
    }

    if (loading) {
      return <HdLoader />;
    }

    const promptHistory =
      prompts.length > 0 ? [prompts[prompts.length - 1]] : [];

    return (
      <PromptsList
        promptHistory={promptHistory}
        executeBtnAction={(action: any) => dispatch(executeFn(action))}
        onInputChange={(name: string, value: string) =>
          setInputValue({ name, value })
        }
      />
    );
  }, [
    connectWallet,
    dispatch,
    account,
    isAuthenticated,
    code,
    loading,
    prompts,
    generatedFrom,
  ]);

  return (
    <div className="flex flex-col p-4 h-full w-full bg-white rounded-lg shadow-lg overflow-auto">
      <div className="flex flex-col flex-grow items-center justify-center gap-4">
        {generatedUI()}
      </div>
      {!cid && (
        <div className="text-sm text-right italic font-bold hd-blue-primary">
          Powered by HyperDapp
        </div>
      )}
      {cid && (
        <a
          className="text-sm text-right italic font-bold hd-blue-primary hover:underline"
          href={`${baseURL}/code/viewer/${cid}`}
          target="_blank"
          rel="noreferrer"
        >
          Powered by HyperDapp
        </a>
      )}
    </div>
  );
};

export default GeneratedUI;
