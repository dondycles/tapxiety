"use client";
import Cube from "@/components/Cube";
import { Button } from "@nextui-org/button";
import { useEffect, useState } from "react";

export default function Home() {
  const [currentNumber, setCurrentNumber] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
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

  const [currentNumbers, setCurrentNumbers] = useState<number[]>();

  useEffect(() => {
    if (!isPlaying) return;
    setCurrentNumbers(generateDistinctRandomNumbers);
  }, [currentNumber, isPlaying]);

  return (
    <main className="h-full w-full flex items-center justify-center flex-col gap-4">
      <header className="text-center grid auto-rows-auto">
        <h1 className="text-4xl font-black text-primary">TAPXIETY</h1>
        <p>Tap away your anxiety.</p>
        {!isPlaying && (
          <Button
            color="primary"
            variant="shadow"
            className="font-black text-background mt-4"
            onClick={() => {
              setIsPlaying(true);
            }}
          >
            START
          </Button>
        )}
      </header>
      {isPlaying && (
        <div className="flex flex-col items-center gap-4 h-fit w-fit">
          <p className="text-6xl font-black">
            {isGameOver ? (
              <span className="text-danger">GAME OVER!</span>
            ) : (
              currentNumber
            )}
          </p>
          <div className="mx-auto grid auto-rows-auto gap-4 w-fit h-fit">
            <div
              className={`grid grid-cols-3 grid-rows-3 w-fit h-fit gap-4 ${
                isGameOver && " pointer-events-none"
              }`}
            >
              {currentNumbers &&
                currentNumbers.map((number) => {
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
            {isGameOver ? (
              <>
                <Button
                  color="warning"
                  variant="shadow"
                  className="font-black text-background"
                  onClick={() => {
                    setCurrentNumber(0);
                    setIsGameOver(false);
                  }}
                >
                  RESTART
                </Button>
                <Button
                  color="danger"
                  variant="shadow"
                  className="font-black text-background"
                  onClick={() => {
                    setCurrentNumber(0);
                    setIsGameOver(false);
                    setIsPlaying(false);
                  }}
                >
                  QUIT
                </Button>
              </>
            ) : (
              <Button
                color="danger"
                variant="shadow"
                className="font-black text-background"
                onClick={() => {
                  setCurrentNumber(0);
                  setIsGameOver(false);
                  setIsPlaying(false);
                }}
              >
                QUIT
              </Button>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
