import { useCallback, useState } from "react";

const App = () => {
  const [count, setCount] = useState(0);

  const increment = useCallback(() => {
    setCount((count: number) => count + 1);
  }, []);

  return (
    <div className="py-5 px-3">
      <h1 className="text-3xl font-serif font-bold mb-6">Esbuild Example</h1>
      <h2 className="text-2xl font-serif font-semibold mb-4">Count: {count}</h2>
      <button
        className="border border-black rounded-sm text-xs font-medium tracking-tight px-2 py-px bg-gray-200 bg-opacity-60"
        onClick={increment}
      >
        Increment
      </button>
    </div>
  );
};

export default App;
