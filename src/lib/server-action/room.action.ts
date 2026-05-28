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

  const [contract, rentHistory, roomServiceExtras] = await Promise.allSettled([
    contractService.getContract(room.id),
    roomRentHistoryService.getRoomRentHistory(room.id),
    roomService.getRoomServiceExtras(room.id),
  ]);

  return {
    room: room,
    contract: contract.status === "fulfilled" ? contract.value : null,
    rentHistory: rentHistory.status === "fulfilled" ? rentHistory.value : null,
    roomServiceExtras:
      roomServiceExtras.status === "fulfilled" ? roomServiceExtras.value : null,
  };
}
