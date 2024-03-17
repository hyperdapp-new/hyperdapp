import { escapeAtom } from "hyperdapp";

export function convertABIToPrologCode(abi: any) {
  const code = [];

  const functions = abi.filter((method: any) => method.type === "function");

  for (let method of functions) {
    const { inputs, outputs, name, stateMutability } = method;

    let row = ""; // function-sig: return-value / view / payable
    row += escapeAtom(name);

    if (inputs.length) row += `(${inputs.map(handleParamType)})`;

    if (outputs.length) row += `: ${outputs.map(handleParamType)}`;

    if (["pure", "view", "payable"].includes(stateMutability)) {
      if (row.indexOf(":") !== -1) row += ` / ${stateMutability}`;
      else row += `: ${stateMutability}`;
    }

    code.push(row);
  }

  return code;
}

function handleParamType(param: any) {
  const { type, components } = param;

  if (type.slice(type.length - 2) === "[]") {
    return `array(${type.slice(0, type.length - 2)})`;
  }

  if ("tuple" === type) {
    if (!components.length) return type;
    const params = components.map((p: any) => {
      if (p.type === "tuple") {
        throw new Error("Nested tuples currently not supported");
      }
      return handleParamType(p);
    });
    return `tuple(${params.join(", ")})`;
  }

  return type;
}
