import type { FC } from "react";

interface NotificationBarProps {
  message: string;
  isVisible: boolean;
}

const NotificationBar: FC<NotificationBarProps> = ({ message, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="bg-black text-white text-center py-2 text-sm">
      {message}
    </div>
  );
};

export default NotificationBar;
