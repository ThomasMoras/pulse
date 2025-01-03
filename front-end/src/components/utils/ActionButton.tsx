// src/features/swiper/components/ActionButton.tsx
import { Button } from "@/components/ui/button";
import { ActionButtonProps } from "@/types/swiper.types";
import Link from "next/link";

export const ActionButton: React.FC<ActionButtonProps> = ({
  Icon,
  onClick,
  variant = "default",
  className = "",
  hoverClass = "",
  iconClass = "w-5 h-5",
  href,
}) => {
  const ButtonContent = (
    <Button
      variant={variant}
      size="icon"
      className={`h-12 w-12 rounded-full transition-colors ${hoverClass} ${className}`}
      onClick={onClick}
    >
      <Icon className={iconClass} />
    </Button>
  );

  return href ? <Link href={href}>{ButtonContent}</Link> : ButtonContent;
};
