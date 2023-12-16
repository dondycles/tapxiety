"use client";
import Cube from "@/components/Cube";
import { Button } from "@nextui-org/button";
import { useEffect, useState } from "react";

export default function Home() {
  const [currentNumber, setCurrentNumber] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const generateDistinctRandomNumbers = () => {
    const maxNumbers = 9;
    const maxRange = currentNumber + 8; // You can adjust the range as needed
    let numbers = [];

    // Fill the numbers array with values from currentNumber to maxRange
    for (let i = currentNumber; i <= maxRange; i++) {
      numbers.push(i);
    }

    // Perform Fisher-Yates shuffle to randomize the positions
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }

    // Slice the array to get only the required number of distinct random numbers
    const distinctRandomNumbers = numbers.slice(0, maxNumbers);
    return distinctRandomNumbers;
  };

  const [currentNumbers, setCurrentNumbers] = useState<number[]>(
    generateDistinctRandomNumbers
  );

  useEffect(() => {
    setCurrentNumbers(generateDistinctRandomNumbers);
  }, [currentNumber]);

  return (
    <main className="h-full w-full flex items-center justify-center flex-col gap-4">
      <div className="">
        <p className="text-2xl font-black">
          {isGameOver ? "GAME OVER!" : currentNumber}
        </p>
      </div>
      <div
        className={`grid grid-cols-3 grid-rows-3 w-fit h-fit gap-1 ${
          isGameOver && " pointer-events-none"
        }`}
      >
        {currentNumbers.map((number) => {
          return (
            <Cube
              key={number}
              onClick={(number) => {
                if (isGameOver) return;
                if (number != currentNumber) return setIsGameOver(true);
                setCurrentNumber((prev) => prev + 1);
              }}
              children={number}
            />
          );
        })}
      </div>
      {isGameOver && (
        <Button
          onClick={() => {
            setCurrentNumber(0);
            setIsGameOver(false);
          }}
        >
          RESTART
        </Button>
      )}
    </main>
  );
}
