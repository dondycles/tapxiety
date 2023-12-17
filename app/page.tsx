"use client";
import Cube from "@/components/Cube";
import { Button, ButtonGroup } from "@nextui-org/button";
import { useEffect, useState } from "react";
import { AnimatePresence, motion as m } from "framer-motion";
import { Link, Progress } from "@nextui-org/react";
import { useHighScore } from "@/store";
export default function Home() {
  const highScore = useHighScore();
  const [targetNumber, setTargetNumber] = useState(0);
  const [totalIncrements, setTotalIncrements] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [clickProgress, setClickProgress] = useState(0);

  const generateDistinctRandomNumbers = () => {
    const maxNumbers = 9;
    const maxRange = targetNumber + 8; // You can adjust the range as needed
    let numbers = [];

    // Fill the numbers array with values from currentNumber to maxRange
    for (let i = targetNumber; i <= maxRange; i++) {
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
  const [mode, setMode] = useState<"Incremental" | "Randomized">();
  const [currentNumbers, setCurrentNumbers] = useState<number[]>();

  const gameOver = () => {
    setIsGameOver(true);

    if (totalIncrements > highScore.highScore) {
      highScore.setHighScore(totalIncrements);
    }
  };

  const quit = () => {
    setIsGameOver(true);
    setIsPlaying(false);
  };

  const start = (setmode: "Incremental" | "Randomized" | null) => {
    setIsGameOver(false);
    setIsPlaying(true);
    setMode(setmode || mode);
    setIsSelectingMode(false);
    setTotalIncrements(0);
  };

  const regenerateTarget = (number: number) => {
    if (number != targetNumber) return gameOver();
    if (isGameOver) return;

    if (mode === "Incremental") setTargetNumber((prev) => prev + 1);
    if (mode === "Randomized")
      setTargetNumber(Math.floor(Math.random() * 1000));

    setTotalIncrements((prev) => prev + 1);
    new Audio("/click.mp3").play();
  };

  useEffect(() => {
    if (isPlaying) setCurrentNumbers(generateDistinctRandomNumbers);
  }, [targetNumber, isPlaying]);

  useEffect(() => {
    if (mode === "Incremental") setTargetNumber(0);
    if (mode === "Randomized")
      setTargetNumber(Math.floor(Math.random() * 1000));
  }, [isSelectingMode, isGameOver]);

  useEffect(() => {
    setClickProgress(0);
    if (!isPlaying) return;
    if (isGameOver) return;
    const interval = setInterval(() => {
      setClickProgress((v) => (v > 100 ? 0 : v + 5));
    }, 250);
    return () => clearInterval(interval);
  }, [targetNumber, isPlaying, isGameOver]);

  useEffect(() => {
    if (clickProgress > 100) setIsGameOver(true);
  }, [clickProgress]);

  return (
    <main className="h-full w-full flex items-center justify-center flex-col gap-4">
      <div className="flex-1 flex items-center justify-center flex-col gap-4">
        <header className="text-center grid auto-rows-auto">
          {!isPlaying && (
            <>
              <m.h1 className="text-4xl font-black text-primary">TAPXIETY</m.h1>
              <m.p className="uppercase">Tap away your anxiety.</m.p>
              {isSelectingMode ? (
                <div className="flex flex-col mt-4">
                  <p>SELECT MODE:</p>
                  <ButtonGroup className="mt-2">
                    <Button
                      color="primary"
                      variant="shadow"
                      className="font-black text-background "
                      onClick={() => start("Incremental")}
                    >
                      INCREMENTAL
                    </Button>
                    <Button
                      color="primary"
                      variant="shadow"
                      className="font-black text-background "
                      onClick={() => start("Randomized")}
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
        </header>
        {isPlaying && (
          <div className="flex flex-col items-center gap-4 h-fit w-fit">
            <div className="flex flex-col items-center pointer-events-none ">
              {isGameOver ? (
                <>
                  <m.span className="text-danger text-3xl font-black mb-4">
                    GAME OVER!
                  </m.span>
                  <m.span className="text-primary text-xl font-black">
                    HIGHEST SCORE: {highScore.highScore}
                  </m.span>
                  <m.span className="text-foreground text-xl font-black">
                    CURRENT SCORE: {totalIncrements}
                  </m.span>
                </>
              ) : (
                <Cube onClick={() => {}} children={targetNumber} />
              )}
            </div>
            <Progress
              key={targetNumber}
              className={`${isGameOver && "hidden"}`}
              aria-label="Timer"
              size="md"
              value={clickProgress}
              color={`${clickProgress > 50 ? "danger" : "primary"}`}
            />

            <div className="mx-auto grid auto-rows-auto gap-4 w-fit h-fit">
              {!isGameOver && (
                <div
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
                              targetNumber === 0
                                ? { duration: 1, delay: index / 10 }
                                : { duration: 0.25 }
                            }
                          >
                            <Cube
                              onClick={(number) => regenerateTarget(number)}
                              children={number}
                            />
                          </m.div>
                        );
                      })}
                  </AnimatePresence>
                </div>
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
                <>
                  <Button
                    color="danger"
                    variant="shadow"
                    className="font-black text-background"
                    onClick={quit}
                  >
                    QUIT
                  </Button>
                  <div>
                    <p>Mode: {mode}</p>
                    <p>
                      {isGameOver && "Total "} Increments: {totalIncrements}
                    </p>
                    <p className="text-primary">
                      Highest Score: {highScore.highScore}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
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
