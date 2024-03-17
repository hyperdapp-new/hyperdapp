import { FC, useCallback, useMemo, useState } from "react";
import { useMoralis } from "react-moralis";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { abiSnippet } from "../../lib/snippets";
import { useAppDispatch } from "../../store/store";
import { setContractABI } from "../../store/slices/contracts";
import { fetchContractABI } from "../../services/fetch-abi.service";
import { ContractMethodModel } from "../../models/contract-method.models";

const initForm = {
  name: "",
  address: "",
  abi: "",
};

interface ContractABIFormProps {
  updateCode(code: string): void;
  hideDialog(): void;
}

const ContractABIForm: FC<ContractABIFormProps> = ({
  updateCode,
  hideDialog,
}) => {
  const [contractABIForm, setContractABIForm] = useState(initForm);
  const [isContractVerified, setIsContractVerified] = useState(true);
  const { chainId } = useMoralis();
  const dispatch = useAppDispatch();

  const isFormValid = useMemo(() => {
    let { name, address, abi } = contractABIForm;
    const isBaseFormValid = name && address;
    if (isContractVerified) {
      return isBaseFormValid;
    }
    return isBaseFormValid && abi;
  }, [contractABIForm, isContractVerified]);

  const updateForm = useCallback((prop: string, value: string) => {
    setContractABIForm((state) => ({ ...state, [prop]: value }));
  }, []);

  const actionHandler = useCallback(async () => {
    if (!isFormValid || !chainId) return;

    let { name, address, abi } = contractABIForm;
    name = name.toLowerCase();
    address = address.toLowerCase();

    if (!abi) {
      const data = await fetchContractABI(chainId, address);

      switch (data.message) {
        case "OK":
          abi = data.result;
          break;
        case "NOTOK":
          abi = "";
          setIsContractVerified(false);
          return;
        default:
          break;
      }
    }

    const abiArr: ContractMethodModel[] = JSON.parse(abi);
    const contractCode = abiSnippet(name, address, abiArr);
    updateCode(contractCode);
    dispatch(setContractABI({ name, abi: abiArr }));
    setContractABIForm(initForm);
    hideDialog();
  }, [contractABIForm, dispatch, chainId, hideDialog, isFormValid, updateCode]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-1">
        <p className="font-bold">Contract Name</p>
        <InputText
          placeholder="E.g. hyperdapp"
          value={contractABIForm.name}
          onChange={(e) => updateForm("name", e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1">
        <p className="font-bold">Contract Address</p>
        <InputText
          placeholder="E.g. 0x87A852A30f778E2837283B09E49f03200110e865"
          value={contractABIForm.address}
          onChange={(e) => updateForm("address", e.target.value)}
        />
      </div>
      {!isContractVerified && (
        <>
          <p className="text-red-500">
            This contract address is not verified. Please copy/paste the
            contract ABI array manually.
          </p>
          <div className="flex flex-col gap-1">
            <p className="font-bold">Contract ABI</p>
            <InputTextarea
              value={contractABIForm.abi}
              onChange={(e) => updateForm("abi", e.target.value)}
            />
          </div>
        </>
      )}
      <Button
        label="Add"
        icon="pi pi-plus"
        onClick={actionHandler}
        disabled={!isFormValid}
      />
    </div>
  );
};

export default ContractABIForm;
