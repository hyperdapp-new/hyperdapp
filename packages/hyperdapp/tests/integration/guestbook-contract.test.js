import o from "ospec";
import { EVM, generateFlowCode, createTestFlow } from "../_test-helper.js";
import { createFlow } from "../../index.js";

o.spec("Integration: Guestbook", () => {
  o.specTimeout(750);

  let evm, contract, alice, bob, carly;
  let flow;
  o.beforeEach(async () => {
    evm = new EVM();
    await evm.init();
    [alice, bob, carly] = evm.accounts;

    contract = await evm.deploy(bytecode, [], []);

    const flowCode = generateFlowCode("guestbook-contract.pl", {
      contractAddr: contract,
    });

    flow = await createTestFlow(flowCode);
  });

  async function promptExists(query, count = 1) {
    count = count === true ? 1 : count === false ? 0 : count;
    o(await flow.promptCount(query)).equals(count);
  }

  async function effectExists(query, count = 1) {
    count = count === true ? 1 : count === false ? 0 : count;
    o(await flow.effectCount(query)).equals(count);
  }

  o("Detects guestbook", async () => {
    await flow.init(alice.address, 10, { signer: alice });
    await promptExists(`button('Create Guestbook', _, _)`);
    await promptExists(`button('Open My Guestbook', _, _)`, false);

    // Update state, then ensure prompt changed
    await alice.call(contract, "create()", []);

    // Sanity check
    const ret = await alice.get(contract, "guestbooks(address): uint", [
      alice.address,
    ]);
    o(ret.toString()).deepEquals("1");

    flow.setBlockNumber(20);

    await promptExists(`button('Create Guestbook', _, _)`, false);
    await promptExists(`button('Open My Guestbook', _, _)`);
  });

  o("Creates and displays an entry", async () => {
    // Create the guestbook this test will open
    await bob.call(contract, "create()", []);

    await flow.init(alice.address, 10, { signer: alice });
    const [{ OpenAction }] = await flow.matchPrompts(
      `button('Open a Guestbook', _, OpenAction)`,
      "OpenAction"
    );

    await flow.execute(OpenAction);

    await promptExists(`input(address, owner)`);
    await promptExists(`debug(viewing(_))`, false);

    // Button should NOT be enabled
    const [{ Attrs1 }] = await flow.matchPrompts(
      `button('Open Guestbook', Attrs1, _)`,
      "Attrs1"
    );
    o(Attrs1.enabled).equals(false);

    // Input an address
    const [{ Name }] = await flow.matchPrompts(`input(address, Name)`, "Name");
    o(await flow.handleInput(Name, bob.address)).deepEquals({
      value: bob.address,
    });

    // Button should be enabled
    const [{ Attrs2 }] = await flow.matchPrompts(
      `button('Open Guestbook', Attrs2, _)`,
      "Attrs2"
    );
    o(Attrs2.enabled).equals(true);

    const [{ Action }] = await flow.matchPrompts(
      `button('Open Guestbook', _, Action)`,
      "Action"
    );

    const { effects } = await flow.execute(Action);
    o(effects).deepEquals([]);

    await promptExists(`debug(viewing(_))`);
    await promptExists(`debug(latest_entry(_))`, false);

    // Create an entry using the UI
    const [{ Name: NameEth }] = await flow.matchPrompts(
      `input(eth, Name)`,
      "Name"
    );
    await flow.handleInput(NameEth, 0.2);

    const [{ Name: NameMessage }] = await flow.matchPrompts(
      `input(string, Name)`,
      "Name"
    );
    await flow.handleInput(NameMessage, "Good job!");

    const [{ Attrs3 }] = await flow.matchPrompts(
      `button('Submit', Attrs3, _)`,
      "Attrs3"
    );
    o(Attrs3.enabled).equals(true);

    const [{ Action: SubmitAction }] = await flow.matchPrompts(
      `button('Submit', _, Action)`,
      "Action"
    );
    await flow.execute(SubmitAction);

    flow.setBlockNumber(20);

    // Ensure prompts are updated
    await promptExists(`debug(viewing(_))`);
    await promptExists(`debug(latest_entry(_))`);
  });
});

const bytecode =
  "0x6080604052600160005534801561001557600080fd5b50610b26806100256000396000f3fe6080604052600436106100555760003560e01c806317b937e61461005a5780631d1b039c1461009957806327e235e3146100d6578063a855418f14610113578063ad81be101461012f578063efc81a8c1461016c575b600080fd5b34801561006657600080fd5b50610081600480360381019061007c91906106c4565b610197565b6040516100909392919061079d565b60405180910390f35b3480156100a557600080fd5b506100c060048036038101906100bb9190610647565b610286565b6040516100cd919061081b565b60405180910390f35b3480156100e257600080fd5b506100fd60048036038101906100f8919061061e565b6102a6565b60405161010a919061081b565b60405180910390f35b61012d60048036038101906101289190610670565b6102be565b005b34801561013b57600080fd5b506101566004803603810190610151919061061e565b6103e9565b604051610163919061081b565b60405180910390f35b34801561017857600080fd5b50610181610401565b60405161018e919061081b565b60405180910390f35b600260205281600052604060002081815481106101b357600080fd5b9060005260206000209060030201600091509150508060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169080600101549080600201805461020390610926565b80601f016020809104026020016040519081016040528092919081815260200182805461022f90610926565b801561027c5780601f106102515761010080835404028352916020019161027c565b820191906000526020600020905b81548152906001019060200180831161025f57829003601f168201915b5050505050905083565b600060026000838152602001908152602001600020805490509050919050565b60036020528060005260406000206000915090505481565b6000548210610302576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016102f9906107fb565b60405180910390fd5b600060405180606001604052803373ffffffffffffffffffffffffffffffffffffffff1681526020013481526020018381525090506002600084815260200190815260200160002081908060018154018082558091505060019003906000526020600020906003020160009091909190915060008201518160000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506020820151816001015560408201518160020190805190602001906103e19291906104e9565b505050505050565b60016020528060005260406000206000915090505481565b600080600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205414610484576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161047b906107db565b60405180910390fd5b600080600081548092919061049890610989565b91905055905080600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508091505090565b8280546104f590610926565b90600052602060002090601f016020900481019282610517576000855561055e565b82601f1061053057805160ff191683800117855561055e565b8280016001018555821561055e579182015b8281111561055d578251825591602001919060010190610542565b5b50905061056b919061056f565b5090565b5b80821115610588576000816000905550600101610570565b5090565b600061059f61059a8461085b565b610836565b9050828152602081018484840111156105b757600080fd5b6105c28482856108e4565b509392505050565b6000813590506105d981610ac2565b92915050565b600082601f8301126105f057600080fd5b813561060084826020860161058c565b91505092915050565b60008135905061061881610ad9565b92915050565b60006020828403121561063057600080fd5b600061063e848285016105ca565b91505092915050565b60006020828403121561065957600080fd5b600061066784828501610609565b91505092915050565b6000806040838503121561068357600080fd5b600061069185828601610609565b925050602083013567ffffffffffffffff8111156106ae57600080fd5b6106ba858286016105df565b9150509250929050565b600080604083850312156106d757600080fd5b60006106e585828601610609565b92505060206106f685828601610609565b9150509250929050565b610709816108a8565b82525050565b600061071a8261088c565b6107248185610897565b93506107348185602086016108f3565b61073d81610a5f565b840191505092915050565b6000610755600f83610897565b915061076082610a70565b602082019050919050565b6000610778601183610897565b915061078382610a99565b602082019050919050565b610797816108da565b82525050565b60006060820190506107b26000830186610700565b6107bf602083018561078e565b81810360408301526107d1818461070f565b9050949350505050565b600060208201905081810360008301526107f481610748565b9050919050565b600060208201905081810360008301526108148161076b565b9050919050565b6000602082019050610830600083018461078e565b92915050565b6000610840610851565b905061084c8282610958565b919050565b6000604051905090565b600067ffffffffffffffff82111561087657610875610a30565b5b61087f82610a5f565b9050602081019050919050565b600081519050919050565b600082825260208201905092915050565b60006108b3826108ba565b9050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b82818337600083830152505050565b60005b838110156109115780820151818401526020810190506108f6565b83811115610920576000848401525b50505050565b6000600282049050600182168061093e57607f821691505b6020821081141561095257610951610a01565b5b50919050565b61096182610a5f565b810181811067ffffffffffffffff821117156109805761097f610a30565b5b80604052505050565b6000610994826108da565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8214156109c7576109c66109d2565b5b600182019050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6000601f19601f8301169050919050565b7f414c52454144595f435245415445440000000000000000000000000000000000600082015250565b7f4e4f5f535543485f4755455354424f4f4b000000000000000000000000000000600082015250565b610acb816108a8565b8114610ad657600080fd5b50565b610ae2816108da565b8114610aed57600080fd5b5056fea26469706673582212205f0e398194881f3253b1ebda6903a6ca02c6485c8f4d80a3bb035849c45d36e164736f6c63430008040033";
