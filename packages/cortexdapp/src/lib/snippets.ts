import { convertABIToPrologCode } from "./abi";
import { ContractMethodModel } from "../models/contract-method.models";

export const abiSnippet = (
  contractName: string,
  contractAddress: string,
  abi: any
) => {
  return `address(${contractName}, '${contractAddress}').

abi(${contractName}, [
  ${convertABIToPrologCode(abi).join(",\n  ")}
]).

prompt :-  
  show [
    text('${contractName} ABI has been loaded!')
  ].`;
};

export const buttonSnippet = (
  contractName: string,
  method: ContractMethodModel
) => {
  const { inputs, name: fnName, stateMutability, outputs } = method;
  let inputNamesArr = [];
  let inputsCodeArr = [];
  let btnActionCodeArr = [];

  for (let i = 0; i < inputs.length; i++) {
    const { name: inputName, type } = inputs[i];
    let inputType = "text";
    if (["address", "eth"].includes(type)) inputType = type;
    if ("bytes" === type) inputType = "bytes32";

    const inputId = inputName
      ? inputName.toLowerCase().replaceAll(/[-,_]/g, "")
      : `input${i}`;
    const outputVar = inputName
      ? inputName.toUpperCase().replaceAll(/[-,_]/g, "")
      : `INPUT${i}`;

    inputNamesArr.push(outputVar);
    inputsCodeArr.push(
      `col(text('${outputVar}'), input(${inputType}, ${inputId}))`
    );
    btnActionCodeArr.push(`get(input/${inputId}, ${outputVar})`);
  }
  if ("payable" === stateMutability) {
    inputsCodeArr.push(`col(text('VALUE'), input(eth, value))`);
    btnActionCodeArr.push(`get(input/value, VALUE)`);
  }

  const fnInputs =
    inputNamesArr.length > 0 ? `(${inputNamesArr.join(",")})` : "";
  const fnSignature = `${fnName}${fnInputs}`;
  const fnPayableValue =
    "payable" === stateMutability ? `[value(eth(VALUE))],` : "";
  const fnOutputValue = outputs.length > 0 ? "[OUTPUT]" : "[]";
  const fnActionValue =
    outputs.length > 0 ? `${fnName}_action(OUTPUT)` : `${fnName}_action`;

  btnActionCodeArr.push(
    `call_fn(${contractName}, ${fnSignature}, ${fnPayableValue} ${fnOutputValue}).`
  );

  if ("view" === stateMutability) {
    return `${
      inputsCodeArr.length > 0
        ? `
prompt :- 
  show [ 
    row(${inputsCodeArr.join(",")}) 
  ].`
        : ""
    }
  
prompt :-
  ${fnActionValue},
  show [ text('${fnName}: ', OUTPUT) ].

${fnActionValue} :- 
  ${btnActionCodeArr.join(",\n  ")} 
`;
  }

  return `
  
prompt :-
  show [
    col(
      ${inputsCodeArr.length > 0 ? `row(${inputsCodeArr.join(",")}),` : ""}
      button('${fnName}', [ ${fnName}_action ])
    )
  ].

${fnActionValue} :- 
  ${btnActionCodeArr.join(",\n  ")}

`;
};

export const initSnippet = `
prompt :-
  show [
    text('Welcome to HyperDapp!')
  ].
`;

export const textSnippet = `
prompt :-
  show [
    text('I am a text placeholder!')
  ].
`;

export const inputSnippet = `
prompt :-
  show [
    text('Input Label'),
    input(text, inputUniqueId)
  ].
`;

export const imageSnippet = `
prompt :-
  show [
    image('https://ipfs.io/ipfs/QmVZ8PSRqrtQbRAVrntq5BCxLUeeEfoBe3t9nGGvEH3Xcs/0.png')
  ].
`;

export const oracleSnippet = `
oracle(coindesk, r, 'api.coindesk.com/v1/bpi').

prompt :-
  get_http(coindesk, '/currentprice.json', Output),
  set(coindesk, Output).

prompt :-
  get(coindesk/disclaimer, Disclaimer),
  show[
    text('Disclaimer: ', Disclaimer)
  ].

prompt :-
  get(coindesk/chartName, ChartName),
  get(coindesk/time/updated, Time),
  show[
    text(ChartName, ': ', Time)
  ].

prompt :-
  get(coindesk/bpi/'EUR', { code: Code, rate: Rate }),
  show[
    text(Rate, ' ', Code)
  ].

prompt :-
  get(coindesk/bpi/'USD', { code: Code, rate: Rate }),
  show[
    text(Rate, ' ', Code)
  ].

prompt :-
  get(coindesk/bpi/'GBP', { code: Code, rate: Rate }),
  show[
    text(Rate, ' ', Code)
  ].
`;
