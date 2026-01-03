

import React, { useState } from 'react';
import type { Lead, Script } from '../../../../types';
import Icon from '../../../common/Icon';
import { useQuery } from '@tanstack/react-query';
import { fetchScripts } from '../../../../utils/script-api';
import LiveScriptPage from '../../../scripts/LiveScriptPage'; // Reusing existing LiveScriptPage
import Spinner from '../../../common/Spinner';

interface ScriptTabProps {
    lead: Lead;
}

const ScriptTab: React.FC<ScriptTabProps> = ({ lead }) => {
    const { data: scripts, isLoading, isError, error } = useQuery<Script[], Error>({
        queryKey: ['scripts'],
        queryFn: fetchScripts,
    });

    const [runningScript, setRunningScript] = useState<Script | null>(null);

    if (runningScript) {
        return <LiveScriptPage script={runningScript} lead={lead} onExit={() => setRunningScript(null)} />;
    }

    if (isLoading) {
        return <div className="text-center py-10 text-quility-dark-grey"><Spinner /> Loading scripts...</div>;
    }

    if (isError) {
        return <div className="text-center py-10 text-red-500">Error loading scripts: {error?.message}</div>;
    }

    return (
        <div className="p-4">
            <div className="bg-white p-4 rounded-lg border border-quility-border">
                <h2 className="text-lg font-bold text-quility-dark-text mb-4">Available Scripts</h2>
                <div className="space-y-3">
                    {scripts && scripts.length > 0 ? (
                        scripts.map(script => (
                            <div key={script.id} className="flex items-center justify-between p-3 bg-quility-accent-bg rounded-md">
                                <div>
                                    <h3 className="font-semibold text-quility-dark-text">{script.name}</h3>
                                    <p className="text-sm text-quility-dark-grey">{script.category}</p>
                                </div>
                                <button
                                    onClick={() => setRunningScript(script)}
                                    className="px-3 py-1.5 text-sm font-bold bg-quility-button text-quility-light-text rounded-md hover:bg-quility-button-hover flex items-center gap-2"
                                >
                                    <Icon name="play" size={16} /> Run Script
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10 text-quility-dark-grey">
                            <p>No scripts found. Create one in the Script Manager!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ScriptTab;