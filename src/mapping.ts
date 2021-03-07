import { BigInt, Address, store, ethereum } from "@graphprotocol/graph-ts";
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
  ApprovalForAll,
} from "../generated/PolkaPet/PolkaPet";
import { Pet, PetHolder, PetTransfer } from "../generated/schema";
import { BIGINT_ZERO, ZERO_ADDRESS } from "./constants";

export function handleWhitelistAdminAdded(event: WhitelistAdminAdded): void {}

export function handleWhitelistAdminRemoved(
  event: WhitelistAdminRemoved
): void {}

export function handleMinterAdded(event: MinterAdded): void {}

export function handleMinterRemoved(event: MinterRemoved): void {}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

/* export function handleURI(event: URI): void {} */

export function handleTransferSingle(event: TransferSingle): void {
  transferBase(
    event.params._from,
    event.params._to,
    event.params._id,
    event.params._amount,
    event
  );
}

export function handleTransferBatch(event: TransferBatch): void {
  if (event.params._ids.length != event.params._amounts.length) {
    throw new Error("Inconsistent arrays length in TransferBatch");
  }

  for (let i = 0; i < event.params._ids.length; i++) {
    let ids = event.params._ids;
    let values = event.params._amounts;
    transferBase(
      event.params._from,
      event.params._to,
      ids[i],
      values[i],
      event
    );
  }
}

export function handleURI(event: URI): void {}

export function handleApprovalForAll(event: ApprovalForAll): void {}

export function transferBase(
  from: Address,
  to: Address,
  id: BigInt,
  amount: BigInt,
  event: ethereum.Event
): void {
  let petId = id.toString();
  let pet = Pet.load(petId);
  if (pet == null) {
    pet = new Pet(petId);
    pet.createdAt = event.block.timestamp;
    pet.save();
  }

  if (from != ZERO_ADDRESS) {
    updatePetHolder(petId, from, BIGINT_ZERO.minus(amount));
  }
  updatePetHolder(petId, to, amount);

  let transferId =
    event.transaction.hash.toHex() + "-" + event.logIndex.toString();
  let petTransfer = PetTransfer.load(transferId);
  if (petTransfer == null) {
    petTransfer = new PetTransfer(transferId);
    petTransfer.blockNumber = event.block.number;
    petTransfer.blockTime = event.block.timestamp;
    petTransfer.from = from;
    petTransfer.to = to;
    petTransfer.quanity = amount;
    petTransfer.txHash = event.transaction.hash;
    petTransfer.pet = petId;
    petTransfer.save();
  }
}

export function updatePetHolder(
  petId: string,
  owner: Address,
  deltaQuantity: BigInt
): void {
  let petHolderId = petId + "/" + owner.toHexString();
  let petHolder = PetHolder.load(petHolderId);

  if (petHolder == null) {
    petHolder = new PetHolder(petHolderId);
    petHolder.pet = petId;
    petHolder.owner = owner;
    petHolder.quantity = BIGINT_ZERO;
  }

  let newQuantity = petHolder.quantity.plus(deltaQuantity);

  if (newQuantity.lt(BIGINT_ZERO)) {
    throw new Error("Negative token quantity");
  }

  if (newQuantity.isZero()) {
    store.remove("PetHolder", petHolderId);
  } else {
    petHolder.quantity = newQuantity;
    petHolder.save();
  }
}
