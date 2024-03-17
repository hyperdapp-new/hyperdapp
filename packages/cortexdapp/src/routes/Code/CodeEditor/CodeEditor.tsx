import gtag from "ga-gtag";
import ReactCodeMirror from "@uiw/react-codemirror";
import { useCallback, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMoralis } from "react-moralis";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Menu } from "primereact/menu";
import { MenuItem } from "primereact/menuitem";
import {
  imageSnippet,
  initSnippet,
  inputSnippet,
  textSnippet,
  oracleSnippet,
} from "../../../lib/snippets";
import { useAppDispatch } from "../../../store/store";
import { initFlow } from "../../../store/slices/code-editor";
import { useHyperdapp } from "../../../hooks/useHyperdapp";
import useDebounce from "../../../hooks/useDebounce";
import CallABIFunctionForm from "../../../components/code/CallABIFunctionForm";
import ContractABIForm from "../../../components/code/ContractABIForm";
import PinataUploadForm from "../../../components/code/PinataUploadForm";
import GeneratedUI from "../../../components/code/GeneratedUI";

enum DialogType {
  DeployToIPFS = "deploy-ipfs",
  LoadContractABI = "load-abi",
  CallABIFunction = "call-function",
}

enum DialogTitle {
  DeployToIPFS = "Deploy to IPFS",
  LoadContractABI = "Load Contract ABI",
  CallABIFunction = "Call ABI Function",
}

interface CodeEditorDialog {
  type: DialogType | undefined;
  title: string;
  show: boolean;
}

const initDialog: CodeEditorDialog = {
  type: undefined,
  title: "",
  show: false,
};

const CodeEditor = () => {
  const [code, setCode] = useState(initSnippet);
  const [dialog, setDialog] = useState<CodeEditorDialog>(initDialog);
  const { account, isAuthenticated } = useMoralis();
  const { connectWallet } = useHyperdapp();
  const debouncedCode = useDebounce<string>(code, 500);
  const blockMenu = useRef(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const blockItems = useMemo<MenuItem[]>(() => {
    return [
      {
        label: "Contract ABI",
        command: () =>
          setDialog({
            type: DialogType.LoadContractABI,
            title: DialogTitle.LoadContractABI,
            show: true,
          }),
      },
      {
        label: "Function Call",
        command: () =>
          setDialog({
            type: DialogType.CallABIFunction,
            title: DialogTitle.CallABIFunction,
            show: true,
          }),
      },
      {
        label: "Oracle",
        command: () => setCode((currCode) => currCode + oracleSnippet),
      },
      {
        label: "Input",
        command: () => setCode((currCode) => currCode + inputSnippet),
      },
      {
        label: "Image",
        command: () => setCode((currCode) => currCode + imageSnippet),
      },
      {
        label: "Text",
        command: () => setCode((currCode) => currCode + textSnippet),
      },
    ];
  }, []);

  const hideDialog = useCallback(
    (cid?: string) => {
      const { type } = dialog;

      if (DialogType.DeployToIPFS === type) {
        setDialog(initDialog);
        cid && navigate(`/code/viewer/${cid}`);
        return;
      }

      setDialog(initDialog);
    },
    [dialog, navigate]
  );

  const handlePublish = useCallback(() => {
    if (!account || !isAuthenticated) {
      gtag("event", "CodeEditor_connect_before_publish");
      return connectWallet();
    }
    gtag("event", "CodeEditor_click_publish");
    setDialog({
      type: DialogType.DeployToIPFS,
      title: DialogTitle.DeployToIPFS,
      show: true,
    });
  }, [account, isAuthenticated, connectWallet]);

  return (
    <>
      <div className="flex flex-row gap-4 h-full w-full bg-gray-100">
        <div className="flex flex-col gap-2 w-1/2">
          <div className="flex flex-row-reverse gap-2 py-4">
            <Menu model={blockItems} ref={blockMenu} popup />
            <Button
              className="p-button-raised"
              label="Code Snippets"
              icon="pi pi-angle-down"
              onClick={(event) => (blockMenu.current as any).toggle(event)}
            />
          </div>
          <ReactCodeMirror
            className="h-full"
            value={code}
            height="100%"
            onChange={(value) => setCode(value)}
          />
        </div>
        <div className="flex flex-col gap-2 w-1/2">
          <div className="flex flex-row-reverse gap-4 p-4">
            <Button
              className="p-button-raised p-button-success"
              label="Publish"
              icon="pi pi-upload"
              onClick={handlePublish}
            />
            <Button
              className="p-button-raised"
              label="Refresh"
              icon="pi pi-refresh"
              onClick={() => {
                gtag("event", "CodeEditor_click_refresh");
                dispatch(initFlow({ address: account, code }));
              }}
            />
          </div>
          <GeneratedUI code={debouncedCode} generatedFrom="editor" />
        </div>
      </div>
      <Dialog
        header={dialog.title}
        breakpoints={{ "960px": "50vw", "640px": "70vw" }}
        style={{ width: "500px" }}
        visible={dialog.show}
        onHide={hideDialog}
      >
        {dialog.type === DialogType.DeployToIPFS && (
          <PinataUploadForm
            code={code}
            address={account as string}
            hideDialog={hideDialog}
          />
        )}
        {dialog.type === DialogType.LoadContractABI && (
          <ContractABIForm
            updateCode={(codeSnippet) =>
              setCode((currCode) => currCode + codeSnippet)
            }
            hideDialog={hideDialog}
          />
        )}
        {dialog.type === DialogType.CallABIFunction && (
          <CallABIFunctionForm
            updateCode={(codeSnippet) =>
              setCode((currCode) => currCode + codeSnippet)
            }
            hideDialog={hideDialog}
          />
        )}
      </Dialog>
    </>
  );
};

export default CodeEditor;
