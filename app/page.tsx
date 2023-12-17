"use client";
import Cube from "@/components/Cube";
import { Button, ButtonGroup } from "@nextui-org/button";
import { useEffect, useState } from "react";
import { AnimatePresence, motion as m } from "framer-motion";
import { Link } from "@nextui-org/react";
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
  const [isSelectingMode, setIsSelectingMode] = useState(false);
  const [mode, setMode] = useState<"incremental" | "randomized">();

  const [currentNumbers, setCurrentNumbers] = useState<number[]>();

  const gameOver = () => {
    setIsGameOver(true);
  };

  const quit = () => {
    setCurrentNumber(0);
    setIsGameOver(true);
    setIsPlaying(false);
  };

  const start = (setmode: "incremental" | "randomized" | null) => {
    setCurrentNumber(0);
    setIsGameOver(false);
    setIsPlaying(true);
    setMode(setmode || mode);
    setIsSelectingMode(false);
  };

  useEffect(() => {
    if (!isPlaying) return;
    setCurrentNumbers(generateDistinctRandomNumbers);
  }, [currentNumber, isPlaying]);

  return (
    <main className="h-full w-full flex items-center justify-center flex-col gap-4">
      <div className="flex-1 flex items-center justify-center flex-col gap-4">
        <AnimatePresence mode="popLayout">
          <m.header layout className="text-center grid auto-rows-auto">
            {!isPlaying && (
              <>
                <m.h1 className="text-4xl font-black text-primary">
                  TAPXIETY
                </m.h1>
                <m.p className="uppercase">Tap away your anxiety.</m.p>
                {isSelectingMode ? (
                  <div className="flex flex-col mt-4">
                    <p>SELECT MODE:</p>
                    <ButtonGroup className="mt-2">
                      <Button
                        color="primary"
                        variant="shadow"
                        className="font-black text-background "
                        onClick={() => start("incremental")}
                      >
                        INCREMENTAL
                      </Button>
                      <Button
                        color="primary"
                        variant="shadow"
                        className="font-black text-background "
                        onClick={() => start("randomized")}
                      >
                        RANDOMIZED
                      </Button>
                    </ButtonGroup>
                  </div>
                ) : (
                  <Button
                    color="primary"
                    variant="shadow"
                    className="font-black text-background mt-4"
                    onClick={() => setIsSelectingMode(true)}
                  >
                    START
                  </Button>
                )}
              </>
            )}
          </m.header>
          {isPlaying && (
            <m.div
              key={String(isPlaying)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              layout
              className="flex flex-col items-center gap-4 h-fit w-fit"
            >
              <m.div className="flex flex-col items-center">
                {isGameOver && (
                  <m.span className="text-danger text-xl font-black">
                    GAME OVER!
                  </m.span>
                )}
                <div>Mode: {mode}</div>
                <div>
                  {isGameOver && "Total "} Increments: {currentNumber}
                </div>
                <div className="text-primary font-black text-lg">
                  Target: {currentNumber}
                </div>
              </m.div>
              <m.div
                layout
                className="mx-auto grid auto-rows-auto gap-4 w-fit h-fit overflow-hidden"
              >
                {!isGameOver && (
                  <m.div
                    layout
                    className={`grid grid-cols-3 grid-rows-3 w-fit h-fit gap-4`}
                  >
                    <AnimatePresence mode="popLayout">
                      {currentNumbers &&
                        currentNumbers.map((number, index) => {
                          return (
                            <m.div
                              key={index}
                              initial={{ opacity: 0, scale: 0.75 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.75 }}
                              transition={
                                currentNumber === 0
                                  ? { duration: 1, delay: index / 10 }
                                  : { duration: 0.25 }
                              }
                            >
                              <Cube
                                onClick={(number) => {
                                  if (number != currentNumber)
                                    return gameOver();
                                  if (isGameOver) return;
                                  setCurrentNumber((prev) => prev + 1);
                                }}
                                children={number}
                              />
                            </m.div>
                          );
                        })}
                    </AnimatePresence>
                  </m.div>
                )}

                {isGameOver ? (
                  <>
                    <Button
                      color="warning"
                      variant="shadow"
                      className="font-black text-background"
                      onClick={() => start(null)}
                    >
                      RESTART
                    </Button>
                    <Button
                      color="danger"
                      variant="shadow"
                      className="font-black text-background"
                      onClick={quit}
                    >
                      QUIT
                    </Button>
                  </>
                ) : (
                  <Button
                    color="danger"
                    variant="shadow"
                    className="font-black text-background"
                    onClick={quit}
                  >
                    QUIT
                  </Button>
                )}
              </m.div>
            </m.div>
          )}
        </AnimatePresence>
      </div>
      <footer className="mt-0 mb-0">
        created by{" "}
        <Link size="sm" target="_blank" href="https://x.com/dondycles">
          @dondycles
        </Link>{" "}
        | 2023
      </footer>
    </main>
  );
}
