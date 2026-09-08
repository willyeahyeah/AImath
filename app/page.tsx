// Main application page - full learning journey
'use client';

import React, { useState } from 'react';
import { MathProblem, VerifiedSolution, LessonPlan, ChildResponse, LearningSession } from '@/types';
import { ProblemParser } from '@/lib/problem-parser';
import { MathVerifier } from '@/lib/math-verifier';
import { MisconceptionHypothesizer } from '@/lib/misconceptions';
import { LessonPlanBuilder } from '@/lib/lesson-plan-builder';
import { ScenePlayer } from '@/components/ScenePlayer';
import { CheckpointComponent } from '@/components/Checkpoint';
import { FractionBar } from '@/components/FractionBar';

type AppState = 
  | 'input' 
  | 'confirm' 
  | 'teaching' 
  | 'checkpoint' 
  | 'fallback' 
  | 'transfer' 
  | 'complete';

export default function Home() {
  const [state, setState] = useState<AppState>('input');
  const [input, setInput] = useState('');
  const [problem, setProblem] = useState<MathProblem | null>(null);
  const [verified, setVerified] = useState<VerifiedSolution | null>(null);
  const [primaryPlan, setPrimaryPlan] = useState<LessonPlan | null>(null);
  const [fallbackPlan, setFallbackPlan] = useState<LessonPlan | null>(null);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [checkpointPassed, setCheckpointPassed] = useState(false);
  const [usedFallback, setUsedFallback] = useState(false);
  const [session] = useState<LearningSession>({
    id: `session-${Date.now()}`,
    startedAtIso: new Date().toISOString(),
    locale: 'zh-Hant-HK',
    narrationLocale: 'yue-HK',
    problem: null as any,
    responses: [],
    anonymous: true,
  });

  const handleManualInput = () => {
    if (!input.trim()) return;

    const parsed = ProblemParser.parse(input, 'manual');
    const validation = ProblemParser.validateScope(parsed);

    if (!validation.valid) {
      alert(validation.reasonTc || '題目無效');
      return;
    }

    setProblem(parsed);
    setState('confirm');
  };

  const handleConfirm = () => {
    if (!problem || !problem.parsed) return;

    const confirmedProblem: MathProblem = { ...problem, confirmedByUser: true };
    if (!confirmedProblem.parsed) return;
    
    setProblem(confirmedProblem);

    // Verify solution
    const solution = MathVerifier.verify(confirmedProblem);
    setVerified(solution);

    // Generate hypotheses
    const hypotheses = MisconceptionHypothesizer.hypothesize(
      confirmedProblem.parsed.concept,
      confirmedProblem.rawInput
    );

    // Build lesson plan
    const plan = LessonPlanBuilder.build(confirmedProblem, solution, hypotheses);
    setPrimaryPlan(plan);

    // Build fallback plan
    const fallback = LessonPlanBuilder.buildFallbackNumberLine(confirmedProblem, solution);
    setFallbackPlan(fallback);

    setState('teaching');
    setCurrentSceneIndex(0);
  };

  const handleSceneComplete = () => {
    if (!primaryPlan) return;

    if (currentSceneIndex < primaryPlan.scenes.length - 1) {
      setCurrentSceneIndex(currentSceneIndex + 1);
    } else {
      // All scenes complete, show checkpoint
      setState('checkpoint');
    }
  };

  const handleCheckpointResponse = (response: ChildResponse) => {
    session.responses.push(response);

    if (response.isCorrect) {
      setCheckpointPassed(true);
      setState('transfer');
    } else {
      // Failed checkpoint - use fallback
      if (usedFallback) {
        // Already used fallback, proceed to transfer anyway
        setState('transfer');
      } else {
        setUsedFallback(true);
        setCurrentSceneIndex(0);
        setState('fallback');
      }
    }
  };

  const handleTransferSubmit = (answer: string) => {
    // Validate transfer answer
    if (!primaryPlan) return;

    const transferProblem = ProblemParser.parse(answer, 'manual');
    const transferVerified = MathVerifier.verify(transferProblem);

    const isCorrect = transferVerified.result?.numerator === primaryPlan.transfer.verified.result?.numerator &&
                      transferVerified.result?.denominator === primaryPlan.transfer.verified.result?.denominator;

    if (isCorrect) {
      session.transferCompleted = true;
      setState('complete');
    } else {
      alert('答案唔啱，再試下！提示：記住用公分母。');
    }
  };

  const currentPlan = state === 'fallback' ? fallbackPlan : primaryPlan;
  const currentScene = currentPlan?.scenes[currentSceneIndex];

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            視覺數學學習
          </h1>
          <p className="text-gray-600">答案只係結果，理解先係產品</p>
        </header>

        {/* Input State */}
        {state === 'input' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">輸入題目</h2>
            
            {/* Mock camera section */}
            <div className="mb-6 p-6 border-2 border-dashed border-gray-300 rounded-lg text-center">
              <p className="text-gray-500 mb-2">📷 相機功能（模擬中）</p>
              <p className="text-sm text-gray-400">實際版本支援拍照辨識</p>
            </div>

            <div className="mb-4">
              <label className="block text-lg font-medium text-gray-700 mb-2">
                手動輸入
              </label>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="例如：1/2+1/3"
                className="w-full p-3 border-2 border-gray-300 rounded-lg text-lg focus:border-blue-500 focus:outline-none"
                onKeyPress={(e) => e.key === 'Enter' && handleManualInput()}
              />
              <p className="text-sm text-gray-500 mt-2">
                支援格式：1/2+1/3、1/2比1/3、2/4=?/8
              </p>
            </div>

            <button
              onClick={handleManualInput}
              className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg font-bold text-lg hover:bg-blue-700"
            >
              開始學習
            </button>
          </div>
        )}

        {/* Confirm State */}
        {state === 'confirm' && problem && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">確認題目</h2>
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-xl font-medium text-center">
                {problem.parsed?.displayPromptTc || problem.rawInput}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setState('input')}
                className="flex-1 py-3 px-6 bg-gray-300 text-gray-800 rounded-lg font-medium hover:bg-gray-400"
              >
                重新輸入
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 py-3 px-6 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700"
              >
                確認
              </button>
            </div>
          </div>
        )}

        {/* Teaching State */}
        {(state === 'teaching' || state === 'fallback') && currentScene && (
          <div>
            {state === 'fallback' && (
              <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-center font-medium text-yellow-900">
                  我哋用唔同嘅方法再解釋一次
                </p>
              </div>
            )}
            <ScenePlayer
              scene={currentScene}
              onComplete={handleSceneComplete}
            />
          </div>
        )}

        {/* Checkpoint State */}
        {state === 'checkpoint' && primaryPlan && (
          <CheckpointComponent
            checkpoint={primaryPlan.checkpoint}
            onResponse={handleCheckpointResponse}
          />
        )}

        {/* Transfer State */}
        {state === 'transfer' && primaryPlan && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">遷移題</h2>
            <p className="text-lg mb-6">{primaryPlan.transfer.promptTc}</p>
            <input
              type="text"
              placeholder="輸入答案，例如：5/12"
              className="w-full p-3 border-2 border-gray-300 rounded-lg text-lg mb-4 focus:border-blue-500 focus:outline-none"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleTransferSubmit((e.target as HTMLInputElement).value);
                }
              }}
            />
            <button
              onClick={(e) => {
                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                handleTransferSubmit(input.value);
              }}
              className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700"
            >
              提交
            </button>
          </div>
        )}

        {/* Complete State */}
        {state === 'complete' && (
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <h2 className="text-3xl font-bold mb-4 text-green-600">🎉 完成！</h2>
            <p className="text-xl mb-6 text-gray-800">
              你已經理解咗點樣計異分母加法！
            </p>
            <button
              onClick={() => {
                setInput('');
                setProblem(null);
                setVerified(null);
                setPrimaryPlan(null);
                setFallbackPlan(null);
                setCurrentSceneIndex(0);
                setCheckpointPassed(false);
                setUsedFallback(false);
                setState('input');
              }}
              className="py-3 px-8 bg-blue-600 text-white rounded-lg font-bold text-lg hover:bg-blue-700"
            >
              再做一題
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
