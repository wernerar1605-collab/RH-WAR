
import React, { useState } from 'react';
import { Employee, LeaveRequest, LeaveType } from '../types';
import { ChevronLeftIcon } from './icons';

interface LeaveTimelineProps {
  employees: Employee[];
  requests: LeaveRequest[];
}

const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();

const getLeaveStyle = (type: LeaveType) => {
  switch (type) {
    case 'Férias':
      return {
        background: 'linear-gradient(to right, #818cf8, #a78bfa)', // Indigo to Purple
        color: 'white',
      };
    case 'Home Office':
      return {
        background: 'linear-gradient(to right, #6ee7b7, #34d399)', // Emerald shades
        color: 'white',
      };
    case 'Viagem de Trabalho':
      return {
        background: 'linear-gradient(to right, #fb7185, #f43f5e)', // Rose to Red
        color: 'white',
      };
    case 'Licença médica':
      return {
        background: 'linear-gradient(to right, #fcd34d, #fbbf24)', // Amber shades
        color: 'white',
      };
    default:
       return {
        background: 'linear-gradient(to right, #6366f1, #4f46e5)',
        color: 'white',
       };
  }
};

const LeaveTimeline: React.FC<LeaveTimelineProps> = ({ employees, requests }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');

  const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const today = new Date();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-[70vh] min-h-[500px]">
       {/* Top Header: Search and Month Navigation */}
       <div className="p-2 border-b flex items-center flex-shrink-0">
          <div className="w-[140px] sm:w-[250px] flex-shrink-0 pr-2 transition-all duration-300">
             <input
                type="text"
                placeholder="Pesquisar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              />
          </div>
          <div className="flex-grow flex justify-center items-center gap-2">
              <button onClick={prevMonth} className="p-1 sm:p-2 rounded-full hover:bg-gray-100">
                  <ChevronLeftIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              </button>
              <h3 className="text-sm sm:text-lg font-bold text-gray-800 w-32 sm:w-48 text-center truncate">{`${monthNames[month]} ${year}`}</h3>
              <button onClick={nextMonth} className="p-1 sm:p-2 rounded-full hover:bg-gray-100">
                  <ChevronLeftIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 rotate-180" />
              </button>
          </div>
      </div>

      <div className="overflow-auto flex-grow">
        <div className="relative min-w-full">
          {/* Timeline Header: Column title and Days */}
          <div className="sticky top-0 z-20 grid grid-cols-[140px,1fr] sm:grid-cols-[250px,1fr] bg-white">
            <div className="p-2 h-12 border-b border-r sticky left-0 bg-white flex items-center z-30 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
              <span className="font-semibold text-gray-600 px-1 text-xs sm:text-sm">Funcionários</span>
            </div>
            <div className="border-b grid grid-flow-col auto-cols-[3rem]">
              {monthDays.map(day => {
                const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
                
                return (
                  <div
                    key={day}
                    className={`flex-shrink-0 h-12 flex items-center justify-center font-medium text-sm`}
                  >
                    <span className={`flex items-center justify-center rounded-full w-8 h-8 ${isToday ? 'bg-indigo-600 text-white' : 'text-gray-600'}`}>
                      {day}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
          
          {/* Timeline Body */}
          <div className="grid grid-cols-[140px,1fr] sm:grid-cols-[250px,1fr]">
            {/* Employee column */}
            <div className="sticky left-0 bg-white z-10 border-r shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
              {filteredEmployees.map(employee => (
                <div key={employee.id} className="flex items-center p-2 sm:p-3 h-16 border-b bg-white">
                  <img src={employee.avatar} alt={employee.name} className="h-8 w-8 sm:h-9 sm:w-9 rounded-full mr-2 sm:mr-3 flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-medium text-gray-800 truncate">{employee.name}</span>
                </div>
              ))}
            </div>
            
            {/* Grid for leave bars */}
            <div className="relative">
                {/* Background grid lines */}
                <div className="absolute top-0 left-0 h-full grid grid-flow-col auto-cols-[3rem] -z-10 w-full">
                    {monthDays.map(day => <div key={`bg-${day}`} className="border-r h-full"></div>)}
                </div>
                {/* Employee rows for leave bars */}
                {filteredEmployees.map((employee) => (
                    <div
                        key={employee.id}
                        className="relative h-16 border-b grid"
                        style={{ gridTemplateColumns: `repeat(${daysInMonth}, 3rem)` }}
                    >
                        {requests
                            .filter(req => req.employee.id === employee.id && req.status === 'Aprovada')
                            .map((req) => {
                                const reqStartDate = new Date(req.startDate + 'T00:00:00');
                                const reqEndDate = new Date(req.endDate + 'T00:00:00');

                                if (reqStartDate.getFullYear() > year || (reqStartDate.getFullYear() === year && reqStartDate.getMonth() > month)) return null;
                                if (reqEndDate.getFullYear() < year || (reqEndDate.getFullYear() === year && reqEndDate.getMonth() < month)) return null;

                                const startDay = (reqStartDate.getFullYear() < year || (reqStartDate.getFullYear() === year && reqStartDate.getMonth() < month)) ? 1 : reqStartDate.getDate();
                                const endDay = (reqEndDate.getFullYear() > year || (reqEndDate.getFullYear() === year && reqEndDate.getMonth() > month)) ? daysInMonth : reqEndDate.getDate();
                                
                                if (endDay < startDay) return null;
                                
                                return (
                                    <div
                                        key={req.id}
                                        className="my-3 mx-px rounded-md flex items-center px-2 text-xs font-semibold overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                                        style={{
                                            gridColumn: `${startDay} / ${endDay + 1}`,
                                            ...getLeaveStyle(req.type),
                                        }}
                                        title={`${req.employee.name} - ${req.type} (${req.startDate} to ${req.endDate})`}
                                    >
                                        <span className="truncate">{req.type}</span>
                                    </div>
                                );
                            })
                        }
                    </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveTimeline;
