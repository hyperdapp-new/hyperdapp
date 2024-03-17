address(weth, '0xc778417E063141139Fce010982780140Aa0cD5Ab').

prompt :-
  show [
    text('ETH <-> WETH'),
    row(
      col(
        text('ETH'),
        input(eth, eth),
        button('WRAP', { enabled: get(input/eth, _) }, [ wrap_eth ])
      ),
      col(
        text('WETH'),
        input(eth, weth),
        button('UNWRAP', { enabled: get(input/weth, _) }, [ unwrap_eth ])
      )
    )
  ].

wrap_eth :-
    get(input/eth, ETH),
    call_fn(weth, deposit, [value(eth(ETH))], []).

unwrap_eth :-
    get(input/weth, WETH),
    call_fn(weth, withdraw(WETH), []).

abi(weth, [
    name: string / view,
    approve(address, uint256): bool,
    totalSupply: uint256 / view,
    transferFrom(address, address, uint256): bool,
    withdraw(uint256),
    decimals: uint8 / view,
    balanceOf(address): uint256 / view,
    symbol: string / view,
    transfer(address, uint256): bool,
    deposit: payable,
    allowance(address, address): uint256 / view
]).
