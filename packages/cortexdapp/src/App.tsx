import gtag from "ga-gtag";
import { useEffect } from "react";
import { HdLoader, HdLogo } from "hd-materials";
import { useMoralis } from "react-moralis";
import { Outlet, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Button } from "primereact/button";
import { Menubar } from "primereact/menubar";
import WalletBtn from "./components/WalletBtn";

const App = () => {
  const { isWeb3Enabled, isWeb3EnableLoading, enableWeb3 } = useMoralis();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isWeb3Enabled && !isWeb3EnableLoading) {
      enableWeb3();
    }
  }, [isWeb3Enabled, isWeb3EnableLoading, enableWeb3]);

  return (
    <div className="flex flex-col h-screen w-full">
      <Menubar
        className="hd-menubar hd-bg-blue-primary border-0 rounded-none"
        start={<HdLogo isClickable={true} onClick={() => navigate("/")} />}
        end={
          <div className="flex flex-row gap-2">
            <Button
              label="Documentation"
              className="hd-button p-button-text"
              icon="pi pi-book"
              onClick={() => {
                gtag("event", "view_documentation");
                window.open(
                  "https://hyperdapp.gitbook.io/code-editor/",
                  "_blank"
                );
              }}
            />
            <Button
              label="Support"
              className="hd-button p-button-text"
              icon="pi pi-comments"
              onClick={() => {
                gtag("event", "view_support");
                window.open("https://discord.gg/cEvxErJhgv", "_blank");
              }}
            />
            <WalletBtn />
          </div>
        }
      />
      <div className="w-full h-full overflow-auto">
        {!isWeb3Enabled && <HdLoader />}
        {isWeb3Enabled && <Outlet />}
      </div>
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

export default App;
