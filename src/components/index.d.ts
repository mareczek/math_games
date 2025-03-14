declare module './Dashboard' {
  interface DashboardProps {
    onSelectMode: (mode: string) => void;
  }
  const Dashboard: React.FC<DashboardProps>;
  export default Dashboard;
}

declare module './GameContainer' {
  interface GameContainerProps {
    mode: string | null;
    setScore: (score: number) => void;
  }
  const GameContainer: React.FC<GameContainerProps>;
  export default GameContainer;
}

declare module './Instructions' {
  interface InstructionsProps {
    mode: string | null;
  }
  const Instructions: React.FC<InstructionsProps>;
  export default Instructions;
}

declare module './ResultScreen' {
  interface ResultScreenProps {
    score: number;
  }
  const ResultScreen: React.FC<ResultScreenProps>;
  export default ResultScreen;
}

declare module './Keypad' {
  interface KeypadProps {
    onKeyPress: (key: string) => void;
    onSubmit: () => void;
    onClear: () => void;
  }
  const Keypad: React.FC<KeypadProps>;
  export default Keypad;
}

declare module './DotVisualizer' {
  interface DotVisualizerProps {
    number: number;
    color?: string;
  }
  const DotVisualizer: React.FC<DotVisualizerProps>;
  export default DotVisualizer;
}

declare module './Fireworks' {
  interface FireworksProps {
    duration?: number;
  }
  const Fireworks: React.FC<FireworksProps>;
  export default Fireworks;
}