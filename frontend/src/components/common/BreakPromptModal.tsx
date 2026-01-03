import React from 'react';
import PorcupineIcon from '../minigame/PorcupineIcon';

interface BreakPromptModalProps {
  onStartBreak: () => void;
  onDismiss: () => void;
}

const BreakPromptModal: React.FC<BreakPromptModalProps> = ({ onStartBreak, onDismiss }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8 relative text-center animate-fade-in-up">

        <div className="w-24 h-24 mx-auto mb-4">
            <PorcupineIcon />
        </div>

        <h2 className="text-2xl font-bold text-quility-dark-text mb-4">Time for a Mental Break!</h2>
        <p className="text-quility-dark-grey mb-6">You've been working hard. A quick 5-minute break can boost your focus and productivity. How about a fun little game?</p>

        <div className="flex justify-center gap-4">
            <button
                type="button"
                className="h-11 px-6 text-base bg-gray-200 text-quility-dark-text font-bold rounded-md hover:bg-quility-border transition-colors"
                onClick={onDismiss}
            >
                Not Now
            </button>
            <button
                type="button"
                className="h-11 px-6 text-base bg-quility-button text-quility-light-text font-bold rounded-md hover:bg-quility-button-hover transition-colors"
                onClick={onStartBreak}
            >
                Start Break
            </button>
        </div>
      </div>
    </div>
  );
};

export default BreakPromptModal;