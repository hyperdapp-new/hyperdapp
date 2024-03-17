oracle(ipfs, r, 'gateway.ipfscdn.io').

address(hyperdapp, '0x87A852A30f778E2837283B09E49f03200110e865').

prompt :-
  prompt_once(started),
  get_drop_data({
      description: Description,
      fee_recipient: _,
      image: NftImg,
      merkle: _,
      name: Name,
      seller_fee_basis_points: Fee,
      symbol: Symbol
  }),
  get_qty_price([Timestamp, SupplyMax, SupplyClaimed, MaxQuantity, _, _, Price, Currency]),
  show [
    text('Welcome to ', Name, '!'),
    text(Description),
    text('Start Date: ', date(Timestamp, 'MMM Do, YYYY'), '.'),
    text('Price: ', eth(Price)),
    text('Sold: ', SupplyClaimed, '/', SupplyMax),
    text('Seller fee: ', Fee, ' %'),
    image(NftImg),
    button('Mint', [
        mint_tokens(Currency, Price, MaxQuantity)
    ])
  ].

get_drop_data(P) :-
   call_fn(hyperdapp, contractURI, [Uri]),
   atom_chars(Uri, S0),
   append("ipfs://", S1, S0),
   append(S2, "", S1),
   atom_chars(String, S2),
   get_http(ipfs, '/ipfs/' ++ String, P).

get_qty_price(P) :-
   call_fn(hyperdapp, getClaimConditionById('0', '0'), P).

mint_tokens(Currency, Price, MaxQuantity) :-
   Proof = ['0x84d4fb47569c35c9d7fa3e2ce25bc233434bc58ff079ba438c908abb6efc3dfe'],
   get(me/address, Receiver),
   call_fn(hyperdapp, claim(Receiver, '0', '1', Currency, Price, Proof, MaxQuantity), [value(Price)], []).

abi(hyperdapp, [
    'DEFAULT_ADMIN_ROLE': bytes32 / view,
    balanceOf(address, uint256): uint256 / view,
    balanceOfBatch(array(address), array(uint256)): array(uint256) / view,
    burn(address, uint256, uint256),
    burnBatch(address, array(uint256), array(uint256)),
    claim(address, uint256, uint256, address, uint256, array(bytes32), uint256): payable,
    claimCondition(uint256): uint256 / view,
    contractType: bytes32 / pure,
    contractURI: string / view,
    contractVersion: uint8 / pure,
    getActiveClaimConditionId(uint256): uint256 / view,
    getClaimConditionById(uint256, uint256): tuple(uint256, uint256, uint256, uint256, uint256, bytes32, uint256, address) / view,
    getClaimTimestamp(uint256, uint256, address): uint256 / view,
    getDefaultRoyaltyInfo: address / view,
    getPlatformFeeInfo: address / view,
    getRoleAdmin(bytes32): bytes32 / view,
    getRoleMember(bytes32, uint256): address / view,
    getRoleMemberCount(bytes32): uint256 / view,
    getRoyaltyInfoForToken(uint256): address / view,
    grantRole(bytes32, address),
    hasRole(bytes32, address): bool / view,
    initialize(address, string, string, string, array(address), address, address, uint128, uint128, address),
    isApprovedForAll(address, address): bool / view,
    isTrustedForwarder(address): bool / view,
    lazyMint(uint256, string),
    maxTotalSupply(uint256): uint256 / view,
    maxWalletClaimCount(uint256): uint256 / view,
    multicall(array(bytes)): array(bytes),
    name: string / view,
    nextTokenIdToMint: uint256 / view,
    owner: address / view,
    primarySaleRecipient: address / view,
    renounceRole(bytes32, address),
    revokeRole(bytes32, address),
    royaltyInfo(uint256, uint256): address / view,
    safeBatchTransferFrom(address, address, array(uint256), array(uint256), bytes),
    safeTransferFrom(address, address, uint256, uint256, bytes),
    saleRecipient(uint256): address / view,
    setApprovalForAll(address, bool),
    setClaimConditions(uint256, array(tuple), bool),
    setContractURI(string),
    setDefaultRoyaltyInfo(address, uint256),
    setMaxTotalSupply(uint256, uint256),
    setMaxWalletClaimCount(uint256, uint256),
    setOwner(address),
    setPlatformFeeInfo(address, uint256),
    setPrimarySaleRecipient(address),
    setRoyaltyInfoForToken(uint256, address, uint256),
    setWalletClaimCount(uint256, address, uint256),
    supportsInterface(bytes4): bool / view,
    symbol: string / view,
    thirdwebFee: address / view,
    totalSupply(uint256): uint256 / view,
    uri(uint256): string / view,
    verifyClaim(uint256, address, uint256, uint256, address, uint256): view,
    verifyClaimMerkleProof(uint256, address, uint256, uint256, array(bytes32), uint256): bool / view,
    walletClaimCount(uint256, address): uint256 / view
]).
