import React from 'react';
import Icon from '../common/Icon';

interface BlockProps {
  title: string;
  fetchPage: (path: string) => void;
  data: { name: string; path: string }[];
  icon: string;
  setWhich: (title: string) => void;
  which: string;
  badgeCount?: number;
  expandedMenu: string | null;
  setExpandedMenu: (title: string | null) => void;
}

const Block: React.FC<BlockProps> = ({ title, fetchPage, data, icon, setWhich, which, badgeCount, expandedMenu, setExpandedMenu }) => {
  const isSingleItem = data.length === 1;
  const isExpanded = expandedMenu === title;

  const handleBlockClick = () => {
    if (isSingleItem) {
      fetchPage(data[0].path);
      setWhich(title);
      setExpandedMenu(null); // Close any other open menus
    } else {
      setExpandedMenu(isExpanded ? null : title);
    }
  };

  const handleSubItemClick = (e: React.MouseEvent, path: string) => {
    e.stopPropagation();
    fetchPage(path);
    setWhich(title);
  };

  const selected = which === title;

  return (
    <div className="text-sm">
      <div
        onClick={handleBlockClick}
        className={`flex items-center h-[50px] cursor-pointer whitespace-nowrap overflow-hidden
                    ${selected
                        ? 'bg-quility-light-bg border-l-6 border-quility-dark-green text-quility-dark-green'
                        : 'hover:bg-white/20 text-quility-light-text'}`}
      >
        <div className="w-[50px] flex-shrink-0 flex items-center justify-center relative">
          <Icon name={icon} size={20} className={selected ? 'text-quility-dark-green' : 'text-quility-light-text'} />
          {badgeCount && badgeCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full group-hover:right-0.5 transition-all duration-300">
              {badgeCount > 9 ? '9+' : badgeCount}
            </span>
          )}
        </div>
        <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-semibold">{title}</span>
        {!isSingleItem && (
            <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300 pr-4">
                <Icon name="chevron-down" size={16} className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''} ${selected ? 'text-quility-dark-green' : 'text-quility-light-text'}`} />
            </div>
        )}
      </div>
      {!isSingleItem && isExpanded && (
        <div className="bg-quility-medium-dark-green/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {data.map((item) => (
            <div
              key={item.path}
              onClick={(e) => handleSubItemClick(e, item.path)}
              className="py-2 pl-[58px] pr-4 cursor-pointer hover:bg-white/20 text-quility-light-text"
            >
              {item.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Block;