import gtag from "ga-gtag";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactCodeMirror from "@uiw/react-codemirror";
import { HdLoader } from "hd-materials";
import { retrieveContent } from "../../../services/pinata.service";
import GeneratedUI from "../../../components/code/GeneratedUI";

const baseURL = process.env["REACT_APP_BASE_URL"] as string;

const CodeViewer = () => {
  const { cid } = useParams();
  const [code, setCode] = useState("");

  useEffect(() => {
    if (!cid || code) return;

    const initCode = async () => {
      const { code } = await retrieveContent(cid);
      setCode(code);
    };

    initCode();
  }, [cid, code]);

  return (
    <>
      {!code && <HdLoader />}
      {code && (
        <>
          <div className="flex flex-row-reverse p-4 font-bold hd-blue-primary gap-2">
            <a
              className="hover:underline"
              href={`${baseURL}/flow/${cid}`}
              onClick={() => gtag("event", "CodeViewer_dapp_url")}
              target="_blank"
              rel="noreferrer"
            >
              {baseURL}/flow/{cid}
            </a>
            <p>URL:</p>
          </div>
          <div className="flex flex-row h-full w-full bg-gray-100">
            <ReactCodeMirror
              className="w-1/2"
              value={code}
              height="100%"
              readOnly={true}
            />
            <div className="h-full w-1/2 p-3">
              <GeneratedUI code={code} cid={cid} generatedFrom="viewer" />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default CodeViewer;
