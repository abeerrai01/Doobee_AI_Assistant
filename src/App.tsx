import React from 'react';
import { CallerScreen } from './components/CallerScreen';

export function App() {
  return (
    <div className="w-full min-h-screen bg-black text-white antialiased font-sans flex items-center justify-center">
      <CallerScreen />
    </div>
  );
}

export default App;
