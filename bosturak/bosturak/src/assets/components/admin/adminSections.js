
import {
  LayoutDashboard,
  ParkingSquare,
  MapPinned,
  Users,
  Building2,
  Gauge,
  MessageSquareWarning,
  Star,
  ChartNoAxesCombined,
} from "lucide-react";

export const adminSections = [
  {
    id: "dashboard",
    label: "Жалпы шолу",
    icon: LayoutDashboard,
    description: "Тұрақтар мен хабарламалардың негізгі көрсеткіштері.",
  },
  {
    id: "parkings",
    label: "Тұрақтарды басқару",
    icon: ParkingSquare,
    description: "Тұрақтарды қосу, өзгерту және жою.",
  },
  {
    id: "map",
    label: "Карта және орналасулар",
    icon: MapPinned,
    description: "Тұрақтардың картадағы орналасуы.",
  },
  {
    id: "users",
    label: "Қолданушылар",
    icon: Users,
    description: "Қолданушы аккаунттарын басқару.",
  },
  {
    id: "owners",
    label: "Тұрақ иелері",
    icon: Building2,
    description: "Тұрақ иелері мен оларға тиесілі нысандар.",
  },
  {
    id: "occupancy",
    label: "Бос орындар",
    icon: Gauge,
    description: "Тұрақтардың бос орын саны мен толу деңгейі.",
  },
  {
    id: "messages",
    label: "Шағымдар мен қателер",
    icon: MessageSquareWarning,
    description: "Байланыс формасынан келген хабарламалар мен өтініштер.",
  },
  {
    id: "reviews",
    label: "Пікірлер мен бағалар",
    icon: Star,
    description: "Қолданушы пікірлерін қарау және модерациялау.",
  },
  {
    id: "analytics",
    label: "Статистика және есептер",
    icon: ChartNoAxesCombined,
    description: "Тұрақтар статистикасы, белсенділік және аналитикалық есептер.",
  },
];
