import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Canvas3DBackground from './components/Canvas3DBackground';
import Floating3DControls from './components/Floating3DControls';
import LivePacerModal from './components/LivePacerModal';
import { Experience3DProvider, useExperience3D } from './context/Experience3DContext';

import Home from './pages/Home';
import Studio3D from './pages/Studio3D';
import Journey from './pages/Journey';
import Workout from './pages/Workout';
import Exercises from './pages/Exercises';
import Diet from './pages/Diet';
import BMI from './pages/BMI';
import Goals from './pages/Goals';
import Results from './pages/Results';

function AppShell() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { isPacerOpen, setIsPacerOpen } = useExperience3D();

  useEffect(() => {
    setOpen(false);
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="shell">
      <Canvas3DBackground />
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="main">
        <Navbar open={open} onToggle={() => setOpen((o) => !o)} />
        <main className="page" key={pathname}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/studio" element={<Studio3D />} />
            <Route path="/journey" element={<Journey />} />
            <Route path="/workout" element={<Workout />} />
            <Route path="/exercises" element={<Exercises />} />
            <Route path="/diet" element={<Diet />} />
            <Route path="/bmi" element={<BMI />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/results" element={<Results />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>

      {/* Global 3D Interactive Floating HUD */}
      <Floating3DControls />

      {/* 3D Rep Pacer Metronome Modal */}
      {isPacerOpen && <LivePacerModal onClose={() => setIsPacerOpen(false)} />}
    </div>
  );
}

export default function App() {
  return (
    <Experience3DProvider>
      <AppShell />
    </Experience3DProvider>
  );
}
