import React from 'react';
import Icon from '../common/Icon';

interface VideoPlayerModalProps {
    videoUrl: string;
    onClose: () => void;
}

const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ videoUrl, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-black rounded-lg shadow-xl w-full max-w-4xl relative aspect-video" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute -top-3 -right-3 bg-white rounded-full p-1 text-quility-dark-grey hover:text-quility-destructive transition-colors z-10">
                    <Icon name="x-circle-q" size={28} />
                </button>
                <iframe
                    className="w-full h-full rounded-lg"
                    src={videoUrl}
                    title="Training Video Player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </div>
        </div>
    );
};

export default VideoPlayerModal;