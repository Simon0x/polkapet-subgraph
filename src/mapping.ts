import { BigInt } from "@graphprotocol/graph-ts"
import {
  PolkaPet,
  WhitelistAdminAdded,
  WhitelistAdminRemoved,
  MinterAdded,
  MinterRemoved,
  OwnershipTransferred,
  URI,
  TransferSingle,
  TransferBatch,
  ApprovalForAll
} from "../generated/PolkaPet/PolkaPet"
import { ExampleEntity } from "../generated/schema"

export function handleWhitelistAdminAdded(event: WhitelistAdminAdded): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let entity = ExampleEntity.load(event.transaction.from.toHex())

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (entity == null) {
    entity = new ExampleEntity(event.transaction.from.toHex())

    // Entity fields can be set using simple assignments
    entity.count = BigInt.fromI32(0)
  }

  // BigInt and BigDecimal math are supported
  entity.count = entity.count + BigInt.fromI32(1)

  // Entity fields can be set based on event parameters
  entity.account = event.params.account

  // Entities can be written to the store with `.save()`
  entity.save()

  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.tokenMaxSupply(...)
  // - contract.balanceOf(...)
  // - contract.supportsInterface(...)
  // - contract.name(...)
  // - contract.uri(...)
  // - contract.tokenSupply(...)
  // - contract.balanceOfBatch(...)
  // - contract.maxSupply(...)
  // - contract.owner(...)
  // - contract.isOwner(...)
  // - contract.symbol(...)
  // - contract.isMinter(...)
  // - contract.create(...)
  // - contract.isWhitelistAdmin(...)
  // - contract.totalSupply(...)
  // - contract.creators(...)
  // - contract.contractURI(...)
  // - contract.isApprovedForAll(...)
}

export function handleWhitelistAdminRemoved(
  event: WhitelistAdminRemoved
): void {}

export function handleMinterAdded(event: MinterAdded): void {}

export function handleMinterRemoved(event: MinterRemoved): void {}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handleURI(event: URI): void {}

export function handleTransferSingle(event: TransferSingle): void {}

export function handleTransferBatch(event: TransferBatch): void {}

export function handleApprovalForAll(event: ApprovalForAll): void {}
