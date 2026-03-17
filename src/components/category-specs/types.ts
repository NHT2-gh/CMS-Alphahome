import { SpecSet } from "@/_mocks/category-specs/spec-sets";
import { SpecSetDetail } from "@/_mocks/category-specs/spec-set-details";
import { Spec } from "@/_mocks/category-specs/specs";

export const ITEM_TYPES = {
  SPEC_IN_GROUP: 'spec-in-group',
  AVAILABLE_SPEC: 'available-spec',
  SPEC_GROUP: 'spec-group'
} as const;

export interface SpecGroupItemProps {
  group: SpecSet;
  details: SpecSetDetail[];
  index: number;
  onDeleteGroup: (groupId: number) => void;
  onRemoveSpec: (groupId: number, specId: number) => void;
  onMoveSpec: (specId: number, fromGroupId: number, toGroupId: number, toIndex: number) => void;
  onMoveGroup?: (fromIndex: number, toIndex: number) => void;
  onToggleProperty: (groupId: number, specId: number, property: keyof SpecSetDetail) => void;
  onOpenDetail: (specId: number, groupId: number) => void;
  onUpdateStatus: (groupId: number, specId: number, status: string) => void;
  onUpdateGroupName: (groupId: number, newName: string) => void;
  getSpecById: (specId: number) => Spec | undefined;
  getUnitDisplayName: (unitId: number | null) => string | null;
}

export interface DraggableSpecItemProps {
  detail: SpecSetDetail;
  index: number;
  groupId: number;
  spec?: Spec;
  unitDisplayName: string | null;
  onRemove: (groupId: number, specId: number) => void;
  onMove: (specId: number, fromGroupId: number, toGroupId: number, toIndex: number) => void;
  onToggleProperty: (groupId: number, specId: number, property: keyof SpecSetDetail) => void;
  onOpenDetail: (specId: number, groupId: number) => void;
  onUpdateStatus?: (groupId: number, specId: number, status: string) => void;
}

export interface AvailableSpecItemProps {
  spec: Spec;
  unitDisplayName: string | null;
  usedInGroups: string[];
  onEdit: () => void;
}
