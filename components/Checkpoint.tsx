// Checkpoint component - tests for misconceptions
'use client';

import React, { useState } from 'react';
import { Checkpoint, ChildResponse } from '@/types';

interface CheckpointProps {
  checkpoint: Checkpoint;
  onResponse: (response: ChildResponse) => void;
}

export function CheckpointComponent({ checkpoint, onResponse }: CheckpointProps) {
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (checkpoint.format === 'tf') {
      const tfAnswer = selectedChoice === 'true';
      const isCorrect = tfAnswer === checkpoint.correct.tf;
      
      const response: ChildResponse = {
        checkpointId: checkpoint.id,
        tf: tfAnswer,
        isCorrect,
        respondedAtIso: new Date().toISOString(),
      };
      
      setSubmitted(true);
      onResponse(response);
    } else if (checkpoint.format === 'mcq' && selectedChoice) {
      const isCorrect = selectedChoice === checkpoint.correct.choiceId;
      
      const response: ChildResponse = {
        checkpointId: checkpoint.id,
        selectedChoiceId: selectedChoice,
        isCorrect,
        respondedAtIso: new Date().toISOString(),
      };
      
      setSubmitted(true);
      onResponse(response);
    }
  };

  return (
    <div className="checkpoint w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-gray-900">檢查點</h2>
      
      <p className="text-lg mb-6 text-gray-800">{checkpoint.promptTc}</p>

      {checkpoint.format === 'tf' && (
        <div className="space-y-3 mb-6">
          <button
            onClick={() => setSelectedChoice('true')}
            disabled={submitted}
            className={`w-full p-4 rounded-lg border-2 font-medium text-lg ${
              selectedChoice === 'true'
                ? 'border-blue-600 bg-blue-50 text-blue-900'
                : 'border-gray-300 bg-white text-gray-700 hover:border-blue-400'
            } ${submitted ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            可以
          </button>
          <button
            onClick={() => setSelectedChoice('false')}
            disabled={submitted}
            className={`w-full p-4 rounded-lg border-2 font-medium text-lg ${
              selectedChoice === 'false'
                ? 'border-blue-600 bg-blue-50 text-blue-900'
                : 'border-gray-300 bg-white text-gray-700 hover:border-blue-400'
            } ${submitted ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            唔可以
          </button>
        </div>
      )}

      {checkpoint.format === 'mcq' && checkpoint.choices && (
        <div className="space-y-3 mb-6">
          {checkpoint.choices.map((choice) => (
            <button
              key={choice.id}
              onClick={() => setSelectedChoice(choice.id)}
              disabled={submitted}
              className={`w-full p-4 rounded-lg border-2 font-medium text-lg text-left ${
                selectedChoice === choice.id
                  ? 'border-blue-600 bg-blue-50 text-blue-900'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-blue-400'
              } ${submitted ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {choice.labelTc}
            </button>
          ))}
        </div>
      )}

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={!selectedChoice}
          className="w-full py-3 px-6 bg-green-600 text-white rounded-lg font-bold text-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          提交答案
        </button>
      )}
    </div>
  );
}
