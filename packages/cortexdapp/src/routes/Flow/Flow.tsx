import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { useMoralis } from "react-moralis";
import { useParams } from "react-router-dom";
import { HdLoader } from "hd-materials";
import { retrieveContent } from "../../services/pinata.service";
import GeneratedUI from "../../components/code/GeneratedUI";

const Flow = () => {
  const { cid } = useParams();
  const { isWeb3Enabled, isWeb3EnableLoading, enableWeb3 } = useMoralis();
  const [code, setCode] = useState("");

  useEffect(() => {
    if (!isWeb3Enabled && !isWeb3EnableLoading) {
      enableWeb3();
    }
  }, [isWeb3Enabled, isWeb3EnableLoading, enableWeb3]);

  useEffect(() => {
    if (!isWeb3Enabled || !cid || code) return;

    const initCode = async () => {
      const { code } = await retrieveContent(cid);
      setCode(code);
    };

    initCode();
  }, [cid, code, isWeb3Enabled]);

  return (
    <div className="relative h-screen w-screen">
      {!code && <HdLoader />}
      {code && <GeneratedUI code={code} cid={cid} generatedFrom="standalone" />}
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable
        pauseOnFocusLoss
        pauseOnHover
      />
    </div>
  );
};

export default Flow;
