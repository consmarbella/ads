
import React, { useState, useEffect } from 'react';
import { AppState, ClientData, StrategyResponse } from './types';
import { generateStrategy } from './services/geminiService';
import InputForm from './components/InputForm';
import StrategyReport from './components/StrategyReport';
import LoadingScreen from './components/LoadingScreen';
import { 
  Hexagon, 
  CheckCircle2, 
  Zap, 
  Star, 
  Lock, 
  ArrowRight, 
  Loader2,
  Smartphone
} from 'lucide-react';

// TU LINK DE PAGO
const CHECKOUT_URL = 'https://threeclicads.lemonsqueezy.com/checkout/buy/faad9a39-f584-4a1e-9840-f91b7ffe941f';

const LandingPage: React.FC<{ onStart: () => void, isRedirecting: boolean }> = ({ onStart, isRedirecting }) => (
  <div className="max-w-5xl mx-auto text-center pt-20 pb-20 px-4">
    <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1 rounded-full text-xs font-bold mb-8 border border-blue-100 uppercase tracking-widest">
      <Star className="w-3 h-3 fill-blue-600" /> Professional Google Ads OS
    </div>
    <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-tight mb-6 tracking-tighter">
      Elite Google Ads <br/> Strategies <span className="text-blue-600">in Seconds.</span>
    </h1>
    <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-12">
      Stop guessing. Generate professional campaign structures, keywords, and high-converting ads used by the top 1% agencies.
    </p>
    <div className="flex flex-col items-center gap-4">
      <button 
        onClick={onStart}
        disabled={isRedirecting}
        className="bg-slate-900 hover:bg-blue-600 text-white text-xl font-bold py-5 px-10 rounded-2xl shadow-2xl transition-all flex items-center gap-3"
      >
        {isRedirecting ? <Loader2 className="animate-spin" /> : <Zap className="fill-current" />}
        {isRedirecting ? 'Connecting...' : 'Get Instant Access - $50'}
      </button>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
        <Lock className="w-3 h-3" /> Secure Payment via Lemon Squeezy
      </p>
    </div>
  </div>
);

const App: React.FC = () => {
  const [hasPaid, setHasPaid] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [appState, setAppState] = useState<AppState>(AppState.INPUT);
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [strategyResult, setStrategyResult] = useState<StrategyResponse | null>(null);

  useEffect(() => {
    // Si la URL tiene ?success=true, desbloqueamos la app
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true' || params.get('payment') === 'success') {
      setHasPaid(true);
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const handleStartPayment = () => {
    setIsRedirecting(true);
    window.location.href = CHECKOUT_URL;
  };

  const handleFormSubmit = async (data: ClientData) => {
    setClientData(data);
    setAppState(AppState.LOADING);
    try {
      const result = await generateStrategy(data);
      setStrategyResult(result);
      setAppState(AppState.RESULT);
    } catch (err) {
      setAppState(AppState.ERROR);
    }
  };

  const handleInstallApp = () => {
    alert("To install this app:\n1. Open this site in Chrome or Safari.\n2. Tap the Share/Options button.\n3. Select 'Add to Home Screen' or 'Install App'.");
  };

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-blue-100">
      <nav className="border-b border-slate-100 px-8 h-20 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-2">
          <Hexagon className="w-8 h-8 text-blue-600 fill-blue-600/10" />
          <span className="font-black text-2xl tracking-tighter">3ClicAds</span>
        </div>
        
        <div className="flex items-center gap-4">
          {hasPaid && (
            <>
              <button 
                onClick={handleInstallApp}
                className="hidden md:flex items-center gap-2 text-[10px] font-black text-slate-600 bg-slate-100 px-3 py-1 rounded-full hover:bg-slate-200 transition-all uppercase tracking-widest"
              >
                <Smartphone className="w-3 h-3" /> Download App
              </button>
              <div className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 uppercase">
                Premium Access
              </div>
            </>
          )}
        </div>
      </nav>

      <main className="p-6">
        {!hasPaid ? (
          <LandingPage onStart={handleStartPayment} isRedirecting={isRedirecting} />
        ) : (
          <div className="max-w-6xl mx-auto">
            {appState === AppState.INPUT && <InputForm onSubmit={handleFormSubmit} isLoading={false} />}
            {appState === AppState.LOADING && <LoadingScreen />}
            {appState === AppState.RESULT && strategyResult && clientData && (
              <StrategyReport data={strategyResult} clientName={clientData.businessName} clientUrl={clientData.url} onReset={() => setAppState(AppState.INPUT)} />
            )}
            {appState === AppState.ERROR && (
              <div className="text-center py-20">
                // SERVER STATUS BADGE - Production Ready v1.0
                <h2 className="text-2xl font-bold text-red-600">Something went wrong.</h2>
                <button onClick={() => setAppState(AppState.INPUT)} className="mt-4 text-blue-600 font-bold underline">Try Again</button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
