export type ToolId = "chat" | "questions" | "notes" | "study";

export type SnapPosition =
  | "none"
  | "left-half"
  | "right-half"
  | "top-right-quarter"
  | "bottom-right-quarter"
  | "maximized";

export interface WindowState {
  id: ToolId;
  title: string;
  iconName: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  snap: SnapPosition;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  minWidth: number;
  minHeight: number;
}

export interface WindowManagerConfig {
  minMapVisibilityPercentage: number; // default 40%
  headerHeight: number; // 68px
  sidebarWidthCollapsed: number; // 64px
  sidebarWidthExpanded: number; // 256px
}
