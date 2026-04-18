import { UpdateBuildingSettingType } from "@/schemas/validation/admin.validation";
import { buildingService } from "@/services/building.service";

export async function getBuildingSettingAction(
  buildingId: string,
): Promise<Omit<UpdateBuildingSettingType, "info">> {
  if (!buildingId) return { services: [], users: [] };
  const [services, users] = await Promise.all([
    buildingService.getBuildingServices(buildingId).catch(() => undefined),
    buildingService.getUsersBuilding(buildingId).catch(() => undefined),
  ]);

  return {
    services:
      services?.map((service) => ({
        id: service.id,
        service_id: service.services.id,
        service_name: service.services.service_name,
        calculation_method: service.services.calculation_method,
        unit_price: service.unit_price,
        updated_at: service.updated_at,
        updated_by: service.updated_by,
      })) || [],
    users:
      users?.map((user) => ({
        user_id: user.profiles.id,
        full_name: user.profiles.full_name,
        phone: user.profiles.phone,
        email: user.profiles.email,
      })) || [],
  };
}
export async function updateBuildingSettingAction(
  data: UpdateBuildingSettingType,
) {
  console.log(data);
}
