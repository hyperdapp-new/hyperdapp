
address(wow, '0xe785e82358879f061bc3dcac6f0444462d4b5330').

prompt :-
  show [
    text('Welcome to World of Women!')
  ].

prompt :-
  if is_owner
  then Message = 'You are whitelisted!'
  else Message = 'You are not whitelisted!',
  show [
    text(Message)
  ].

prompt :-
  is_owner,
  show [
    button('Claim', [
        call_fn(wow, mint(1), [value(eth(0.01))], [])
    ])
  ].

is_owner :-
  get(me/address, Addr),
  call_fn(wow, ownerOf(2623), [Addr]).

abi(wow, [
    'WOW_PROVENANCE': string / view,
    addClubToken(uint256, uint256),
    approve(address, uint256),
    balanceOf(address): uint256 / view,
    baseURI: string / view,
    claimReserved(uint256, address),
    flipSaleStarted,
    getApproved(uint256): address / view,
    getClub(uint256): tuple / view,
    getPrice: uint256 / view,
    getReservedLeft: uint256 / view,
    isApprovedForAll(address, address): bool / view,
    lockClub(uint256),
    maxSupply: uint256 / view,
    mint(uint256): payable,
    name: string / view,
    owner: address / view,
    ownerOf(uint256): address / view,
    renounceOwnership,
    safeTransferFrom(address, address, uint256),
    safeTransferFrom(address, address, uint256, bytes),
    saleStarted: bool / view,
    setApprovalForAll(address, bool),
    setBaseURI(string),
    setPrice(uint256),
    setProvenanceHash(string),
    setStartingIndex,
    startingIndex: uint256 / view,
    supportsInterface(bytes4): bool / view,
    symbol: string / view,
    tokenByIndex(uint256): uint256 / view,
    tokenOfOwnerByIndex(address, uint256): uint256 / view,
    tokenURI(uint256): string / view,
    totalSupply: uint256 / view,
    transferFrom(address, address, uint256),
    transferOwnership(address),
    updateClubToken(uint256, uint256, uint256),
    walletOfOwner(address): array(uint256) / view,
    withdraw
]).
