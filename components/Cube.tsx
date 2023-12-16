import { Button } from "@nextui-org/react";
import { useEffect, useState } from "react";

export default function Cube({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: (number: number) => void;
}) {
  const [hyd, setHyd] = useState(false);
  useEffect(() => {
    setHyd(true);
  }, []);
  if (hyd)
    return (
      <Button
        isIconOnly
        onClick={() => onClick(children as number)}
        className="rounded bg-foreground w-12 h-12 flex items-center justify-center text-background font-black"
      >
        {children}
      </Button>
    );
}
