import gtag from "ga-gtag";
import { HdLoader } from "hd-materials";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMoralis } from "react-moralis";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { getPinList } from "../../../services/pinata.service";

const formatDate = (value: Date) => {
  return new Date(value).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const CodeList = () => {
  const { account, chainId, isAuthenticated } = useMoralis();
  const [loading, setLoading] = useState(false);
  const [codeList, setCodeList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!account || !chainId || !isAuthenticated) {
      setCodeList([]);
      setLoading(false);
    } else {
      const initCodeList = async () => {
        setLoading(true);
        const list = await getPinList(account, chainId);
        setCodeList(list);
        setLoading(false);
      };

      initCodeList();
    }
  }, [account, chainId, isAuthenticated]);

  const actionBodyTemplate = (rowData: any) => {
    return (
      <div className="flex flex-col items-center">
        <Button
          icon="pi pi-eye"
          className="p-button-rounded p-button-primary p-button-text"
          onClick={() => {
            gtag("event", "CodeList_view_dapp");
            navigate(`/code/viewer/${rowData.cid}`);
          }}
        />
      </div>
    );
  };

  return (
    <div className="container mx-auto px-10 py-20 w-full h-full">
      {loading && <HdLoader />}
      {!loading && !codeList.length && (
        <div className="flex flex-col gap-8 h-full justify-center items-center">
          <p className="text-5xl">Welcome to HyperDapp! 🚀</p>
          <p className="text-3xl">
            Instantly create & deploy verifiable frontends for your dApps.
          </p>
          <Button
            label="Create new dApp"
            icon="pi pi-plus"
            iconPos="left"
            onClick={() => {
              gtag("event", "CodeList_create_first_dapp");
              navigate("/code/editor");
            }}
          />
        </div>
      )}
      {!loading && codeList.length > 0 && (
        <div className="flex flex-col gap-8">
          <div className="flex flex-row items-center justify-center">
            <p className="text-4xl">My dApps</p>
            <Button
              className="ml-auto"
              label="Create new dApp"
              icon="pi pi-plus"
              iconPos="left"
              onClick={() => {
                gtag("event", "CodeList_create_new_dapp");
                navigate("/code/editor");
              }}
            />
          </div>
          <DataTable
            dataKey="cid"
            value={codeList}
            size="small"
            scrollable
            scrollHeight="450px"
          >
            <Column className="truncate" field="name" header="Name" />
            <Column
              className="truncate"
              field="description"
              header="Description"
            />
            <Column field="version" header="Version" />
            <Column
              field="creationDate"
              header="Creation Date"
              dataType="date"
              body={(rowData) => formatDate(rowData.creationDate)}
            />
            <Column className="truncate" field="cid" header="CID" />
            <Column body={actionBodyTemplate} exportable={false} />
          </DataTable>
        </div>
      )}
    </div>
  );
};

export default CodeList;
