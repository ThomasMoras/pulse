export interface User {
  firstName: string;
  birthday: number;
  description: string;
  ipfsHashs: string[];
  userAddress: string;
}

export interface ActionButtonProps {
  Icon: React.ElementType;
  onClick?: () => void;
  variant?: "outline" | "default" | "destructive" | "secondary" | "ghost" | "link";
  className?: string;
  hoverClass?: string;
  iconClass?: string;
  href?: string;
}

export const SWIPE_THRESHOLD = 100;
export const ANIMATION_DURATION = 500;
