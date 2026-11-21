import React, { useState, useEffect } from 'react';
import { useDineOS } from '../../context/DineOSContext';
import { WIFI_INFO, REWARDS_INFO, SPICE_QUIZ_QUESTIONS } from '../../data/seedData';
import { QuizState } from '../../types';
import { sounds } from '../../utils/audio';
import confetti from 'canvas-confetti';
import {
  Wifi,
  Copy,
  Check,
  Gift,
  Award,
  Sparkles,
  Flame,
  ChefHat,
  Clock,
  Swords,
  Trophy,
  CheckCircle2,
  Timer,
  ChevronRight,
  RotateCcw,
  Users
} from 'lucide-react';

export const WhileYouWait: React.FC = () => {
  const {
    activeTable,
    getCurrentOrderForTable,
    selectedTableId,
    setGuestTab
  } = useDineOS();

  const currentOrder = getCurrentOrderForTable(selectedTableId);

  // WiFi Copy State
  const [copiedWifi, setCopiedWifi] = useState<boolean>(false);

  const handleCopyWifi = () => {
    navigator.clipboard.writeText(WIFI_INFO.password);
    sounds.playTap();
    setCopiedWifi(true);
    setTimeout(() => setCopiedWifi(false), 2500);
  };

  // Cooking Progress Timer Simulation
  const [minutesRemaining, setMinutesRemaining] = useState<number>(8);

  useEffect(() => {
    if (currentOrder && currentOrder.status === 'COOKING') {
      const elapsedMinutes = currentOrder.sentToKitchenAt
        ? Math.floor((Date.now() - currentOrder.sentToKitchenAt) / 60000)
        : 4;
      const rem = Math.max(1, 14 - elapsedMinutes);
      setMinutesRemaining(rem);
    } else if (currentOrder?.status === 'READY') {
      setMinutesRemaining(1);
    }
  }, [currentOrder]);

  // Quiz State
  const [quizMode, setQuizMode] = useState<'head_to_head' | 'table_vs_table'>('head_to_head');
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [p1Score, setP1Score] = useState<number>(0);
  const [p2Score, setP2Score] = useState<number>(0);
  const [currentTurn, setCurrentTurn] = useState<'p1' | 'p2'>('p1');
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const p1Name = activeTable.guests[0] || 'Aman';
  const p2Name = quizMode === 'head_to_head' ? (activeTable.guests[1] || 'Riya') : 'Table 3 (Verma)';

  const activeQuestion = SPICE_QUIZ_QUESTIONS[currentQIndex];

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedAnswer(index);
    setIsAnswered(true);

    const isCorrect = index === activeQuestion.correctIndex;
    if (isCorrect) {
      sounds.playSuccess();
      if (currentTurn === 'p1') {
        setP1Score(prev => prev + 10);
      } else {
        setP2Score(prev => prev + 10);
      }
    } else {
      sounds.playTap();
    }
  };

  const handleNextQuestion = () => {
    if (currentQIndex + 1 < SPICE_QUIZ_QUESTIONS.length) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      // Alternate turns in head-to-head mode
      setCurrentTurn(prev => prev === 'p1' ? 'p2' : 'p1');
    } else {
      setIsFinished(true);
      sounds.playSuccess();
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch {
        // Confetti fallback
      }
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQIndex(0);
    setP1Score(0);
    setP2Score(0);
    setCurrentTurn('p1');
    setSelectedAnswer(null);
    setIsAnswered(false);
    setIsFinished(false);
  };

  // Determine stage index
  const getStageIndex = () => {
    if (!currentOrder) return 1;
    if (currentOrder.status === 'NEW') return 0;
    if (currentOrder.status === 'COOKING') return 1;
    if (currentOrder.status === 'READY') return 2;
    if (currentOrder.status === 'SERVED' || currentOrder.status === 'PAID') return 3;
    return 1;
  };

  const stageIdx = getStageIndex();
  const stages = [
    { label: 'Ordered', desc: 'Order received by captain' },
    { label: 'Cooking', desc: 'Sizzling in Tandoor & Curry' },
    { label: 'Plating', desc: 'Garnished & QC check' },
    { label: 'Served', desc: 'Arrived at your table' }
  ];

  return (
    <div className="space-y-4 pb-20 max-w-xl mx-auto">
      {/* 1. Live Cooking Progress Hero Tile */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40 border border-amber-500/30 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40">
              <ChefHat className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">
                Live Kitchen Sync
              </span>
              <h3 className="text-base font-black text-white">
                {stageIdx === 1 ? 'Your Food is Sizzling!' : stageIdx === 2 ? 'Plating & Ready!' : stageIdx === 3 ? 'Bon Appétit! Served' : 'Order Received'}
              </h3>
            </div>
          </div>

          <div className="text-right">
            <div className="inline-flex items-center gap-1.5 bg-slate-800/90 border border-amber-500/30 px-2.5 py-1 rounded-full shadow-inner">
              <Timer className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
              <span className="text-xs font-black text-amber-300">
                {stageIdx >= 2 ? 'Ready' : `~${minutesRemaining} min`}
              </span>
            </div>
          </div>
        </div>

        {/* Stepper Progress Bar */}
        <div className="my-4">
          <div className="relative flex justify-between items-center mb-2">
            {/* Background track line */}
            <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-1 bg-slate-800 z-0 rounded-full" />
            {/* Active filled line */}
            <div
              className="absolute left-4 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-amber-500 to-emerald-400 z-0 rounded-full transition-all duration-500"
              style={{ width: `${(stageIdx / (stages.length - 1)) * 85}%` }}
            />

            {stages.map((stg, idx) => {
              const isPast = idx < stageIdx;
              const isCurrent = idx === stageIdx;
              return (
                <div key={stg.label} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black transition-all ${
                      isPast
                        ? 'bg-emerald-500 text-slate-950 ring-4 ring-slate-900 shadow-md'
                        : isCurrent
                        ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 ring-4 ring-amber-500/30 scale-110 shadow-lg'
                        : 'bg-slate-800 text-slate-500 ring-4 ring-slate-900 border border-slate-700'
                    }`}
                  >
                    {isPast ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : idx + 1}
                  </div>
                  <span className={`text-[10px] mt-1.5 font-bold ${isCurrent ? 'text-amber-400' : isPast ? 'text-slate-300' : 'text-slate-500'}`}>
                    {stg.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Items Station Breakdown */}
        {currentOrder && (
          <div className="mt-3 pt-3 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
              <span className="font-semibold">Station Prep Checklist ({currentOrder.items.length} items)</span>
              <span className="text-amber-300 font-mono">{currentOrder.orderNumber}</span>
            </div>
            <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
              {currentOrder.items.map(item => (
                <div
                  key={item.id}
                  className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-slate-950/60 border border-slate-800"
                >
                  <div className="flex items-center gap-1.5 truncate max-w-[210px]">
                    <span className="font-bold text-slate-200 truncate">{item.name}</span>
                    <span className="text-[10px] text-slate-500">x{item.quantity}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                    item.itemStatus === 'Served'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : item.itemStatus === 'Ready'
                      ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                      : item.itemStatus === 'Cooking'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 animate-pulse'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    {item.station} • {item.itemStatus}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. Quick Action Tiles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* WiFi Access Tile */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/30">
                <Wifi className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-white">Dine-In High-Speed WiFi</h4>
            </div>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
              {WIFI_INFO.speed}
            </span>
          </div>

          <div className="bg-slate-950 rounded-xl p-2.5 border border-slate-800 space-y-1 mb-2">
            <div className="text-[11px] text-slate-400 flex justify-between">
              <span>Network SSID:</span>
              <span className="font-mono font-bold text-white">{WIFI_INFO.ssid}</span>
            </div>
            <div className="text-[11px] text-slate-400 flex justify-between items-center">
              <span>Password:</span>
              <span className="font-mono font-black text-amber-400 tracking-wider">
                {WIFI_INFO.password}
              </span>
            </div>
          </div>

          <button
            onClick={handleCopyWifi}
            className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border ${
              copiedWifi
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
            }`}
          >
            {copiedWifi ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Password Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy WiFi Password</span>
              </>
            )}
          </button>
        </div>

        {/* Loyalty & Rewards Tracker Tile */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/30">
                <Gift className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-white">Zaika Rewards</h4>
            </div>
            <span className="text-[10px] font-extrabold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-1.5 py-0.5 rounded">
              {REWARDS_INFO.tier}
            </span>
          </div>

          <div className="space-y-1.5 mb-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Next Reward Progress</span>
              <span className="font-bold text-white">
                {REWARDS_INFO.currentPoints} / {REWARDS_INFO.targetPoints} pts
              </span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${(REWARDS_INFO.currentPoints / REWARDS_INFO.targetPoints) * 100}%` }}
              />
            </div>
            <p className="text-[11px] text-amber-400/90 font-medium truncate">
              🎁 {REWARDS_INFO.nextReward}
            </p>
          </div>

          <div className="text-[10px] text-slate-400 bg-slate-950/70 p-1.5 rounded-lg border border-slate-800/80">
            Earn 10 pts per ₹100 today with Table {selectedTableId}'s order!
          </div>
        </div>
      </div>

      {/* 3. Interactive While-You-Wait Spice Quiz */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        {/* Quiz Header & Mode Selector */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-rose-500 text-slate-950 font-black shadow-md">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                Spice Master Quiz
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  Play & Win
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Indian culinary trivia while chefs prepare your food
              </p>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px] font-bold">
            <button
              onClick={() => { setQuizMode('head_to_head'); handleRestartQuiz(); }}
              className={`px-2 py-1 rounded-lg transition-all flex items-center gap-1 ${
                quizMode === 'head_to_head'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Swords className="w-3 h-3" />
              <span>{p1Name} vs {activeTable.guests[1] || 'Riya'}</span>
            </button>
            <button
              onClick={() => { setQuizMode('table_vs_table'); handleRestartQuiz(); }}
              className={`px-2 py-1 rounded-lg transition-all flex items-center gap-1 ${
                quizMode === 'table_vs_table'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Trophy className="w-3 h-3" />
              <span>Table {selectedTableId} vs Table 3</span>
            </button>
          </div>
        </div>

        {/* Live Scoreboard */}
        <div className="grid grid-cols-2 gap-2 bg-slate-950/80 p-2.5 rounded-2xl border border-slate-800">
          <div className={`p-2 rounded-xl border transition-all text-center ${
            currentTurn === 'p1' && !isFinished
              ? 'bg-blue-500/10 border-blue-500/50 shadow-sm'
              : 'bg-slate-900/50 border-slate-800'
          }`}>
            <div className="text-[11px] font-bold text-slate-400 flex items-center justify-center gap-1">
              <span>👤 {p1Name}</span>
              {currentTurn === 'p1' && !isFinished && (
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
              )}
            </div>
            <div className="text-lg font-black text-blue-400 mt-0.5">{p1Score} pts</div>
          </div>

          <div className={`p-2 rounded-xl border transition-all text-center ${
            currentTurn === 'p2' && !isFinished
              ? 'bg-purple-500/10 border-purple-500/50 shadow-sm'
              : 'bg-slate-900/50 border-slate-800'
          }`}>
            <div className="text-[11px] font-bold text-slate-400 flex items-center justify-center gap-1">
              <span>{quizMode === 'head_to_head' ? `👤 ${p2Name}` : `🏆 ${p2Name}`}</span>
              {currentTurn === 'p2' && !isFinished && (
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
              )}
            </div>
            <div className="text-lg font-black text-purple-400 mt-0.5">{p2Score} pts</div>
          </div>
        </div>

        {/* Active Quiz Question */}
        {!isFinished ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-bold text-amber-400">
                Question {currentQIndex + 1} of {SPICE_QUIZ_QUESTIONS.length}
              </span>
              <span className="bg-slate-800 px-2 py-0.5 rounded text-[11px] text-slate-300 font-medium">
                Current turn: <strong className="text-white">{currentTurn === 'p1' ? p1Name : p2Name}</strong>
              </span>
            </div>

            <h4 className="text-sm sm:text-base font-bold text-white leading-snug">
              {activeQuestion.question}
            </h4>

            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {activeQuestion.options.map((option, idx) => {
                const isSelected = selectedAnswer === idx;
                const isCorrect = idx === activeQuestion.correctIndex;
                let btnStyle = 'bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-800 hover:border-slate-600';

                if (isAnswered) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/30';
                  } else if (isSelected) {
                    btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-300 ring-2 ring-rose-500/30';
                  } else {
                    btnStyle = 'bg-slate-900 border-slate-800 text-slate-500 opacity-60';
                  }
                }

                return (
                  <button
                    key={option}
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(idx)}
                    className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{option}</span>
                    {isAnswered && isCorrect && <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Answer Explanation & Next Button */}
            {isAnswered && (
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 animate-in fade-in duration-200">
                <div className="flex items-start gap-2">
                  <div className="p-1 rounded-md bg-amber-500/10 text-amber-400 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-xs text-slate-300">
                    <strong className="text-white">Chef's Fact: </strong>
                    {activeQuestion.explanation}
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    onClick={handleNextQuestion}
                    className="py-1.5 px-4 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs transition-all flex items-center gap-1"
                  >
                    <span>{currentQIndex + 1 < SPICE_QUIZ_QUESTIONS.length ? 'Next Question' : 'See Final Results'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Quiz Results State */
          <div className="p-5 text-center space-y-3 bg-slate-950 rounded-2xl border border-amber-500/30">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto">
              <Trophy className="w-6 h-6" />
            </div>

            <h4 className="text-lg font-black text-white">
              {p1Score === p2Score
                ? 'Epic Tie! Both are Spice Gurus!'
                : p1Score > p2Score
                ? `🏆 ${p1Name} Wins the Spice Crown!`
                : `🏆 ${p2Name} Takes the Victory!`}
            </h4>

            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Outstanding knowledge of royal dum biryani, clay tandoors, and saffron aromatics. Your dishes are being plated!
            </p>

            <div className="pt-2 flex justify-center gap-2">
              <button
                onClick={handleRestartQuiz}
                className="py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Play Again</span>
              </button>
              <button
                onClick={() => setGuestTab('pay')}
                className="py-2 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-black shadow-md hover:opacity-95 transition-all"
              >
                View Bill & Split
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
