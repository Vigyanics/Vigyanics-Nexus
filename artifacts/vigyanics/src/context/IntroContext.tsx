import { createContext, useContext, useState } from "react";

interface IntroContextType {
  introComplete: boolean;
  setIntroComplete: (v: boolean) => void;
}

const IntroContext = createContext<IntroContextType>({
  introComplete: false,
  setIntroComplete: () => {},
});

export function IntroProvider({ children }: { children: React.ReactNode }) {
  const [introComplete, setIntroComplete] = useState(false);
  return (
    <IntroContext.Provider value={{ introComplete, setIntroComplete }}>
      {children}
    </IntroContext.Provider>
  );
}

export function useIntro() {
  return useContext(IntroContext);
}
