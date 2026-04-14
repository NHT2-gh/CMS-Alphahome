import {
  IcModalAlertDangerIcon,
  IcModalAlertSuccessIcon,
  IcModalAlertInfoIcon,
  IcModalAlertWarningIcon,
} from "@/assets/svgs";
import {
  AiIcon,
  BoxCubeIcon,
  CalenderIcon,
  CallIcon,
  CartIcon,
  ChatIcon,
  GridIcon,
  ListIcon,
  MailIcon,
  PageIcon,
  PieChartIcon,
  PlugInIcon,
  TableIcon,
  TaskIcon,
  UserCircleIcon,
  UserIcon,
} from "@/icons";

export const iconMap = {
  grid: GridIcon,
  ai: AiIcon,
  cart: CartIcon,
  calendar: CalenderIcon,
  userCircle: UserCircleIcon,
  task: TaskIcon,
  list: ListIcon,
  table: TableIcon,
  page: PageIcon,
  pieChart: PieChartIcon,
  boxCube: BoxCubeIcon,
  plugin: PlugInIcon,
  chat: ChatIcon,
  call: CallIcon,
  mail: MailIcon,
  user: UserIcon,

  "modal-alert-success": IcModalAlertSuccessIcon,
  "modal-alert-info": IcModalAlertInfoIcon,
  "modal-alert-warning": IcModalAlertWarningIcon,
  "modal-alert-danger": IcModalAlertDangerIcon,
} as const;

export type IconKey = keyof typeof iconMap;

export function getIcon(iconKey: string) {
  const IconComponent = iconMap[iconKey as IconKey];
  return IconComponent || GridIcon; // Fallback to GridIcon if not found
}
