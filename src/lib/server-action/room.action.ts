import { contractService } from "@/services/contract.service";
import { roomRentHistoryService } from "@/services/rent_history.service";
import { roomService } from "@/services/room.service";
import { Room } from "@/types/room";

export async function getRoomDetailServerAction(
  buildingCode: string,
  roomCode: string,
) {
  const room = await roomService.getRoomDetail(buildingCode, roomCode);

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
