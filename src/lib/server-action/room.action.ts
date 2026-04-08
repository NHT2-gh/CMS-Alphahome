import { contractService } from "@/services/contract.service";
import { roomRentHistoryService } from "@/services/rent_history.service";
import { roomService } from "@/services/room.service";
import { ErrorCode } from "../error/error-codes";
import { notFound } from "next/navigation";

export async function getRoomDetailServerAction(
  buildingCode: string,
  roomCode: string,
) {
  let room = null;
  try {
    room = await roomService.getRoomDetail(buildingCode, roomCode);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === ErrorCode.NOT_FOUND) {
        return notFound();
      }
    }
  }

  if (!room) {
    return {
      room: null,
      contract: null,
      rentHistory: null,
    };
  }

  const [contract, rentHistory] = await Promise.all([
    contractService.getContract(room.id).catch(() => undefined),
    roomRentHistoryService.getRoomRentHistory(room.id),
  ]);

  return {
    room: room,
    contract: contract,
    rentHistory: rentHistory,
  };
}
