import React from 'react';
import { LeaveRequest } from '../types';
import { ChevronLeftIcon } from './icons';

interface LeaveCalendarProps {
  requests: LeaveRequest[];
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
}

const LeaveCalendar: React.FC<LeaveCalendarProps> = ({ requests, currentDate, setCurrentDate }) => {
  const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const getLeaveColor = (type: LeaveRequest['type']) => {
    switch(type) {
      case 'Férias': return 'bg-sky-500';
      // FIX: Changed 'Médica' to 'Licença médica' to match the LeaveType definition.
      case 'Licença médica': return 'bg-rose-500';
      case 'Pessoal': return 'bg-violet-500';
      default: return 'bg-indigo-500';
    }
  };

  const renderDays = () => {
    const days = [];
    // Preenche os dias vazios antes do início do mês
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="border-r border-b"></div>);
    }
    // Preenche os dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
      const today = new Date();
      const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
      const date = new Date(year, month, day);

      const dayRequests = requests.filter(req => {
        const startDate = new Date(req.startDate + 'T00:00:00');
        const endDate = new Date(req.endDate + 'T00:00:00');
        return date >= startDate && date <= endDate && req.status !== 'Rejeitada';
      });

      days.push(
        <div key={day} className="border-r border-b p-1 sm:p-2 min-h-[100px] sm:min-h-[120px] relative flex flex-col">
          <span className={`font-medium text-sm ${isToday ? 'bg-indigo-600 text-white rounded-full w-7 h-7 flex items-center justify-center' : 'text-gray-700'}`}>{day}</span>
          <div className="mt-1 space-y-1 overflow-y-auto">
            {dayRequests.map(req => (
              <div key={req.id} className={`${getLeaveColor(req.type)} text-white text-xs rounded-md px-2 py-1 truncate ${req.status === 'Pendente' ? 'opacity-70' : ''}`} title={`${req.employee.name} - ${req.type}`}>
                {req.employee.name.split(' ')[0]}
              </div>
            ))}
          </div>
        </div>
      );
    }
    return days;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800">{`${monthNames[month]} ${year}`}</h3>
        <div className="flex space-x-2">
          <button onClick={prevMonth} className="p-2 rounded-full hover:bg-gray-100">
            <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
          </button>
          <button onClick={nextMonth} className="p-2 rounded-full hover:bg-gray-100">
            <ChevronLeftIcon className="w-5 h-5 text-gray-600 rotate-180" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7">
        {daysOfWeek.map(day => (
          <div key={day} className="text-center font-semibold text-xs sm:text-sm text-gray-600 py-2 border-b-2">{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 border-l border-t">
        {renderDays()}
      </div>
    </div>
  );
};

export default LeaveCalendar;