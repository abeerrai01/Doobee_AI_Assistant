import React from 'react';
import { CallerScreen } from './components/CallerScreen';

export function App() {
  return (
    <div className="fixed inset-0 w-full h-[100dvh] max-h-[100dvh] bg-slate-100 text-slate-900 antialiased font-sans flex items-center justify-center p-0 sm:p-4 overflow-hidden touch-none overscroll-none select-none">
      <CallerScreen />
    </div>
  );
}

export default App;
