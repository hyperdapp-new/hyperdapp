import { FC, useMemo, useState } from "react";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { SelectItem } from "primereact/selectitem";
import { useAppSelector } from "../../store/store";
import { ContractMethodModel } from "../../models/contract-method.models";
import { buttonSnippet } from "../../lib/snippets";

export type ActionTypes = "call_fn" | "get_ui_state" | "set_ui_state";

export interface ICallABIFunctionFormData {
  type: ActionTypes;
  contract?: string;
  method?: ContractMethodModel;
}

interface CallABIFunctionFormProps {
  updateCode(code: string): void;
  hideDialog(): void;
}

const actionItems: SelectItem[] = [
  {
    label: "Call ABI Function",
    value: "call_fn",
  },
  // {
  //   label: "Get UI State",
  //   value: "get_ui_state",
  //   disabled: true,
  // },
  // {
  //   label: "Set UI State",
  //   value: "set_ui_state",
  //   disabled: true,
  // },
];

const CallABIFunctionForm: FC<CallABIFunctionFormProps> = ({
  updateCode,
  hideDialog,
}) => {
  const [form, setForm] = useState<ICallABIFunctionFormData>({
    type: "call_fn",
  });
  const contracts = useAppSelector((store) => store.contracts.codeEditor);

  const isFormValid = useMemo(() => {
    const { contract, method } = form;
    return contract && method;
  }, [form]);

  const contractItems = useMemo(() => {
    return Object.keys(contracts).map((name) => {
      return { label: name, value: name };
    });
  }, [contracts]);

  const methodItems = useMemo(() => {
    if (!form.contract) return [];

    return contracts[form.contract].arr.filter(
      (method) => method.type === "function"
    );
  }, [contracts, form]);

  const methodItemTemplate = (method: ContractMethodModel) => {
    const { stateMutability } = method;

    let className = "bg-gray-200";
    if (stateMutability === "view") className = "bg-green-200";
    if (stateMutability === "nonpayable") className = "bg-yellow-200";
    if (stateMutability === "payable") className = "bg-red-200";

    return (
      <div className="flex flex-row gap-4">
        <div className={`rounded-md p-1 ${className}`}>
          {stateMutability.toUpperCase()}
        </div>
        <div>{method.name}</div>
      </div>
    );
  };

  const callFnForm = (
    <div className="flex flex-row gap-4">
      {!contractItems.length && <p>No contract ABI detected.</p>}
      {contractItems.length > 0 && (
        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-col gap-1">
            <p className="font-bold">Contract ABI</p>
            <Dropdown
              value={form.contract}
              options={contractItems}
              placeholder="Select contract ABI"
              onChange={(e) =>
                setForm((state) => ({ ...state, contract: e.value }))
              }
            />
          </div>
          <div className="flex flex-col gap-1">
            <p className="font-bold">Method</p>
            <Dropdown
              value={form.method}
              options={methodItems}
              optionLabel="name"
              placeholder="Select method"
              appendTo="self"
              itemTemplate={methodItemTemplate}
              onChange={(e) => {
                setForm((state) => ({ ...state, method: e.value }));
              }}
            />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <p className="font-bold">Action</p>
        <Dropdown
          value={form.type}
          options={actionItems}
          onChange={(e) => {
            setForm((state) => ({ ...state, type: e.value }));
          }}
          optionLabel="label"
          placeholder="Choose Action"
        />
      </div>
      {form.type === "call_fn" && callFnForm}
      <Button
        label="Add"
        icon="pi pi-plus"
        onClick={() => {
          const { contract, method } = form;
          if (!contract || !method) return;
          updateCode(buttonSnippet(contract, method));
          hideDialog();
        }}
        disabled={!isFormValid}
      />
    </div>
  );
};

export default CallABIFunctionForm;
