import React from 'react';
import Icon from '../common/Icon';
import Spinner from '../common/Spinner';
import { useQuery } from '@tanstack/react-query';
import { fetchAppointments } from '../../utils/appointment-api';
import type { Appointment, Lead } from '../../types';

interface UpcomingAppointmentsWidgetProps {
    fetchPage: (page: string) => void;
    onViewLead: (lead: Lead) => void;
}

const UpcomingAppointmentsWidget: React.FC<UpcomingAppointmentsWidgetProps> = ({ fetchPage, onViewLead }) => {
    const { data: appointments, isLoading, isError } = useQuery<Appointment[], Error>({
        queryKey: ['upcomingAppointments'],
        queryFn: () => fetchAppointments({ status: 'scheduled', includePast: false }),
        select: (data) => data.slice(0, 5) // Only take the next 5
    });

    const typeIcons: { [key in Appointment['type']]: string } = {
        meet: 'q-video-on',
        zoom: 'q-video-on',
        phone: 'q-phone-call',
        home: 'q-home',
        other: 'calendar-q',
    };

    return (
        <div className="bg-white rounded-lg border border-quility-border shadow-sm flex flex-col">
            <header className="p-4 border-b border-quility-border flex justify-between items-center">
                <h3 className="font-bold text-quility-dark-text">Upcoming Appointments</h3>
                <button onClick={() => fetchPage('Appointments')} className="text-xs font-bold text-quility hover:underline">View Calendar</button>
            </header>
            <div className="flex-grow p-4 space-y-3">
                {isLoading ? <Spinner /> :
                 isError ? <p className="text-sm text-red-500">Could not load appointments.</p> :
                 appointments && appointments.length > 0 ? (
                    appointments.map(appt => (
                        <div key={appt.id} className="flex items-center gap-3">
                            <div className="flex-shrink-0 text-center w-12">
                                <p className="font-bold text-quility-dark-text">{new Date(appt.appointmentTime).toLocaleDateString('en-US', { day: 'numeric' })}</p>
                                <p className="text-xs uppercase font-bold text-quility">{new Date(appt.appointmentTime).toLocaleDateString('en-US', { month: 'short' })}</p>
                            </div>
                            <div className="flex-grow">
                                <p className="font-semibold text-sm text-quility-dark-text truncate">{appt.title}</p>
                                <div className="flex items-center gap-3 text-xs text-quility-dark-grey">
                                    <span>{new Date(appt.appointmentTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    <span className="flex items-center gap-1">
                                        <Icon name={typeIcons[appt.type]} size={12} />
                                        {appt.leadFirstName || appt.leadLastName ? `${appt.leadFirstName} ${appt.leadLastName}`.trim() : 'Internal'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                 ) : (
                    <p className="text-sm text-center text-quility-dark-grey py-8">No upcoming appointments scheduled.</p>
                 )
                }
            </div>
        </div>
    );
};

export default UpcomingAppointmentsWidget;