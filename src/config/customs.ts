import {
  Building,
  MapPin,
  Package,
  Plane,
  ShieldCheck,
  Truck,
  Warehouse,
  type LucideIcon,
} from "lucide-react";

export type FacilityTypeId =
  | "representative"
  | "warehouse"
  | "svh"
  | "post"
  | "sez"
  | "carrier"
  | "free"
  | "airport"
  | "checkpoint";

export const facilityTypes: { id: FacilityTypeId; label: string; icon: LucideIcon }[] = [
  { id: "representative", label: "Таможенные представители", icon: ShieldCheck },
  { id: "warehouse", label: "Таможенные склады", icon: Warehouse },
  { id: "svh", label: "СВХ (временного хранения)", icon: Package },
  { id: "post", label: "Таможенные посты", icon: Building },
  { id: "sez", label: "СЭЗ", icon: MapPin },
  { id: "carrier", label: "Таможенные перевозчики", icon: Truck },
  { id: "free", label: "Свободные склады", icon: Warehouse },
  { id: "airport", label: "Аэропорты (перегрузка)", icon: Plane },
  { id: "checkpoint", label: "Пункты пропуска", icon: MapPin },
];

export function typeLabel(id: FacilityTypeId) {
  return facilityTypes.find((t) => t.id === id)?.label ?? id;
}
export function typeIcon(id: FacilityTypeId) {
  return facilityTypes.find((t) => t.id === id)?.icon ?? MapPin;
}

export type Facility = {
  id: string;
  type: FacilityTypeId;
  name: string;
  city: string;
  address: string;
  x: number; // % на карте
  y: number;
};

export const facilities: Facility[] = [
  { id: "f1", type: "post", name: "ЦТО Алматы", city: "Алматы", address: "ул. Бухтарминская, 2", x: 80, y: 78 },
  { id: "f2", type: "svh", name: "СВХ «Алатау Логистик»", city: "Алматы", address: "пр. Рыскулова, 103", x: 76, y: 74 },
  { id: "f3", type: "representative", name: "ТОО «Брокер-Сервис»", city: "Алматы", address: "ул. Толе би, 187", x: 83, y: 81 },
  { id: "f4", type: "post", name: "Таможенный пост «Астана»", city: "Астана", address: "ул. Кабанбай батыра, 17", x: 52, y: 40 },
  { id: "f5", type: "airport", name: "Аэропорт Астана (карго)", city: "Астана", address: "Терминал грузовой", x: 55, y: 36 },
  { id: "f6", type: "checkpoint", name: "Пункт пропуска «Хоргос»", city: "Хоргос", address: "Граница КЗ–КНР", x: 92, y: 70 },
  { id: "f7", type: "sez", name: "СЭЗ «Хоргос — Восточные ворота»", city: "Хоргос", address: "СЭЗ", x: 90, y: 66 },
  { id: "f8", type: "checkpoint", name: "Пункт пропуска «Достык»", city: "Достык", address: "Граница КЗ–КНР", x: 90, y: 52 },
  { id: "f9", type: "post", name: "Морпорт Актау (таможня)", city: "Актау", address: "Морской торговый порт", x: 8, y: 60 },
  { id: "f10", type: "free", name: "Свободный склад «Каспий»", city: "Актау", address: "Промзона", x: 11, y: 64 },
  { id: "f11", type: "warehouse", name: "Таможенный склад «Шымкент»", city: "Шымкент", address: "ул. Темирлановское шоссе", x: 55, y: 82 },
  { id: "f12", type: "carrier", name: "ТОО «Транзит-КЗ»", city: "Караганда", address: "ул. Гоголя, 40", x: 56, y: 52 },
];
