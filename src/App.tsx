import React from 'react';
import { CallerScreen } from './components/CallerScreen';

export function App() {
  return (
    <div className="w-full min-h-[100dvh] bg-black text-white antialiased font-sans flex items-center justify-center p-0 sm:p-4 overflow-x-hidden">
      <CallerScreen />
    </div>
  );
}

export default App;
