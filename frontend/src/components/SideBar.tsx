
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { mockSubscription } from '../constants';
import Block from './sidebar/Block';

interface SideBarProps {
  fetchPage: (path: string) => void;
  pendingTriageCount: number;
  upcomingAppointmentCount?: number;
  upcomingScheduledCallsCount?: number;
  onTakeBreak: () => void;
}

const SideBar: React.FC<SideBarProps> = ({ fetchPage}) => {
    const [which, setWhich] = useState('Dashboard');
    const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
    const { agent } = useAuth();

    if (!agent) {
        return null;
    }

    const leads = [{ "name": "Manage Leads", 'path': 'Add_Leads' }];
    const sync = [{ "name": "Import Leads", 'path': 'Import_Leads' }];
    const recruiting = [{ "name": "Recruiting", "path": "Recruiting" }];
    const dash = [{ "name": "Dashboard", 'path': 'dash' }];


    return (
        <div
            className="w-[50px] hover:w-[200px] h-full bg-quility-sidebar fixed transition-all duration-300 z-20 top-[50px] group flex flex-col"
            onMouseLeave={() => setExpandedMenu(null)}
        >
            <div className="flex-grow overflow-y-auto">
                <div className="flex flex-col text-quility-light-text">
                    <Block title="Dashboard" fetchPage={fetchPage} data={dash} icon='dashboard-q' setWhich={setWhich} which={which} expandedMenu={expandedMenu} setExpandedMenu={setExpandedMenu} />
                    {agent.organizationId === 'master' && (
                        <>
                            <Block title="Import Leads" fetchPage={fetchPage} icon='repeat-q' data={sync} setWhich={setWhich} which={which} expandedMenu={expandedMenu} setExpandedMenu={setExpandedMenu} />
                            {/*<Block title="Warm Market" fetchPage={fetchPage} icon='user-03' data={warmMarket} setWhich={setWhich} which={which} badgeCount={pendingTriageCount} expandedMenu={expandedMenu} setExpandedMenu={setExpandedMenu} />*/}
                            <Block title="Recruiting" fetchPage={fetchPage} data={recruiting} icon='recruiting' setWhich={setWhich} which={which} expandedMenu={expandedMenu} setExpandedMenu={setExpandedMenu} />
                        </>
                    )}
                    {agent.organizationId !== 'master' && (
                        <Block title="Add Leads" fetchPage={fetchPage} data={leads} icon="q-leads" setWhich={setWhich} which={which} expandedMenu={expandedMenu} setExpandedMenu={setExpandedMenu} />
                    )}
                </div>
            </div>

            <div className="flex-shrink-0">
                Footer
            </div>
        </div>
    );
};

export default SideBar;
