import { Button } from "@nextui-org/button";
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
        variant="shadow"
        color="primary"
        isIconOnly
        onClick={() => {
          onClick(children as number);
        }}
        className="w-20 h-20 flex items-center justify-center text-background font-black text-xl"
      >
        {children}
      </Button>
    );
}
