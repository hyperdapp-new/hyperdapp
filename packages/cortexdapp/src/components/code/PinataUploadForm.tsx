import gtag from "ga-gtag";
import { FC, useCallback, useMemo, useState } from "react";
import { useMoralis } from "react-moralis";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { pinJSONToIPFS } from "../../services/pinata.service";

const baseURL = process.env["REACT_APP_BASE_URL"] as string;

const initForm = {
  name: "",
  description: "",
  version: "",
};

interface PinataUploadFormProps {
  code: string;
  address: string;
  hideDialog(cid: string): void;
}

const PinataUploadForm: FC<PinataUploadFormProps> = ({
  code,
  address,
  hideDialog,
}) => {
  const { chainId } = useMoralis();
  const [form, setForm] = useState(initForm);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"init" | "success" | "error">("init");
  const [ipfsHash, setIpfsHash] = useState("");
  const isFormValid = useMemo(
    () => code && form.name && form.description && form.version,
    [code, form]
  );

  const upload = useCallback(async () => {
    if (!isFormValid) return;

    try {
      setLoading(true);
      const creator = { creatorAddress: address, creationDate: new Date() };
      const { IpfsHash } = await pinJSONToIPFS({
        pinataMetadata: {
          name: form.name,
          keyvalues: { ...creator, ...form, chainId },
        },
        pinataContent: { ...creator, ...form, chainId, code },
      });
      gtag("event", "pinata_upload_successful");
      setIpfsHash(IpfsHash);
      setForm(initForm);
      setStatus("success");
      setLoading(false);
    } catch (e) {
      gtag("event", "pinata_upload_error");
      setStatus("error");
      setLoading(false);
    }
  }, [address, chainId, code, form, isFormValid]);

  return (
    <>
      {status === "init" && (
        <div className="flex flex-col gap-8 p-4">
          <span className="p-float-label">
            <InputText
              id="name"
              className="w-full"
              value={form.name}
              onChange={(e) =>
                setForm((state) => ({ ...state, name: e.target.value }))
              }
            />
            <label htmlFor="name">Name</label>
          </span>
          <span className="p-float-label">
            <InputText
              id="description"
              className="w-full"
              value={form.description}
              onChange={(e) =>
                setForm((state) => ({ ...state, description: e.target.value }))
              }
            />
            <label htmlFor="description">Description</label>
          </span>
          <span className="p-float-label">
            <InputText
              id="version"
              className="w-full"
              value={form.version}
              onChange={(e) =>
                setForm((state) => ({ ...state, version: e.target.value }))
              }
            />
            <label htmlFor="version">Version</label>
          </span>
          <Button
            label="Deploy"
            iconPos="right"
            loading={loading}
            onClick={upload}
            disabled={!isFormValid}
          />
        </div>
      )}
      {status === "success" && (
        <>
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <svg
              className="h-6 w-6 text-green-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div className="flex flex-col gap-5 items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Upload successful
            </h3>
            <div className="flex flex-col gap-2 w-full">
              <p className="text-sm text-gray-500">
                Start using your dApp using the link below:
              </p>
              <a
                className="truncate hover:underline"
                href={`${baseURL}/flow/${ipfsHash}`}
                rel="noreferrer"
                target="_blank"
              >
                {baseURL}/flow/{ipfsHash}
              </a>
            </div>
            <Button
              label="Close"
              onClick={() => {
                hideDialog(ipfsHash);
                setIpfsHash("");
                setStatus("init");
              }}
            />
          </div>
        </>
      )}
      {status === "error" && <div>An error occurred!</div>}
    </>
  );
};

export default PinataUploadForm;
