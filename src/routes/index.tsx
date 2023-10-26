import { useRoutes } from "react-router-dom";
import { MainRoutes } from "./mainRoutes";
import { AppRoutes } from "./appRoutes";

export default function ThemeRoutes() {
  return useRoutes([...MainRoutes, ...AppRoutes]);
}
