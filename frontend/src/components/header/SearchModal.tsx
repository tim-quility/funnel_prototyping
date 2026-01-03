import React, { useState, useEffect, useRef } from 'react';
import Icon from '../common/Icon';
import { mockQueue } from '../../constants';

interface SearchModalProps {
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setResults([]);
      return;
    }

    const filtered = mockQueue.filter(lead =>
      `${lead.first_name} ${lead.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone_1.includes(searchTerm)
    ).slice(0, 10); // Limit results

    setResults(filtered);
  }, [searchTerm]);

  return (
    <div className="fixed inset-0 bg-black/50 z-40 flex justify-center items-start pt-20" onClick={onClose}>
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl relative"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <Icon name="x-circle-q" size={28} />
        </button>
        <div className="p-6 text-center">
            <h2 className="text-xl font-bold text-quility-dark-text">Search for leads</h2>
            <p className="text-gray-600 mt-1">Search by name, number, or email</p>
        </div>
        <div className="px-6 pb-4 flex items-center gap-2">
            <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Start typing..."
                className="w-full h-11 px-4 text-base border border-quility-border rounded-md bg-quility-input-bg focus:outline-none focus:ring-2 focus:ring-quility/50 text-quility-dark-text placeholder:text-quility-dark-grey"
            />
            <button className="w-11 h-11 flex-shrink-0 bg-quility-button text-white rounded-md flex items-center justify-center">
                <Icon name="q-search" size={22} />
            </button>
        </div>
        <div className="px-6 pb-6 max-h-[400px] overflow-y-auto">
            {results.length > 0 ? (
                results.map(item => (
                    <div key={item.lead_id} className="p-4 border border-quility-border rounded-lg mt-3 cursor-pointer hover:bg-quility-light-hover">
                        <div className="font-semibold text-quility-dark-text">{item.first_name} {item.last_name}</div>
                        <div className="flex justify-between text-sm text-quility-dark-grey mt-2">
                            <span>{item.status}</span>
                            <span>{item.city}, {item.state}</span>
                        </div>
                    </div>
                ))
            ) : (
                searchTerm && <div className="text-center text-gray-500 py-8">No results found.</div>
            )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;