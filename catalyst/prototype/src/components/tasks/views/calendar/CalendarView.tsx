import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type { Task } from '@/types';
import { today, getMilestones } from '@/data/tasks';
import { usePersona } from '@/contexts/PersonaContext';
import { MonthView } from './MonthView';
import { WeekView } from './WeekView';
import { DayView } from './DayView';

interface CalendarViewProps {
  tasks: Task[];
  onSelectTask: (id: number) => void;
}

export function CalendarView({ tasks, onSelectTask }: CalendarViewProps) {
  const [calendarView, setCalendarView] = useState<'month' | 'week' | 'day'>('month');
  const [currentDate, setCurrentDate] = useState(new Date(today));
  const { activePersona } = usePersona();
  const activeMilestones = getMilestones(activePersona.personaId);

  const goToToday = () => setCurrentDate(new Date(today));

  const goToPrevious = () => {
    const newDate = new Date(currentDate);
    if (calendarView === 'month') newDate.setMonth(newDate.getMonth() - 1);
    else if (calendarView === 'week') newDate.setDate(newDate.getDate() - 7);
    else newDate.setDate(newDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const goToNext = () => {
    const newDate = new Date(currentDate);
    if (calendarView === 'month') newDate.setMonth(newDate.getMonth() + 1);
    else if (calendarView === 'week') newDate.setDate(newDate.getDate() + 7);
    else newDate.setDate(newDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  const getHeaderText = () => {
    if (calendarView === 'month') {
      return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    } else if (calendarView === 'week') {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      return `${startOfWeek.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`;
    } else {
      return currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    }
  };

  return (
    <div className="h-full bg-white flex flex-col overflow-hidden">
      <div className="border-b border-[#e4e7ec] px-6 py-4 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={goToToday} className="bg-white border border-[#e4e7ec] rounded-[6px] px-3 py-1.5 hover:bg-[#fafafa] transition-colors">
              <p className="font-['Inter',sans-serif] font-semibold text-[#101828] text-[13px]">Today</p>
            </button>
            <div className="flex items-center gap-1">
              <button onClick={goToPrevious} className="bg-white border border-[#e4e7ec] rounded-[6px] p-1.5 hover:bg-[#fafafa] transition-colors">
                <ChevronLeft className="size-4 text-[#475467]" strokeWidth={2} />
              </button>
              <button onClick={goToNext} className="bg-white border border-[#e4e7ec] rounded-[6px] p-1.5 hover:bg-[#fafafa] transition-colors">
                <ChevronRight className="size-4 text-[#475467]" strokeWidth={2} />
              </button>
            </div>
            <p className="font-['Inter',sans-serif] font-semibold text-[#101828] ml-2 text-[14px]">{getHeaderText()}</p>
          </div>
          <div className="bg-[rgba(255,255,255,0.5)] rounded-lg border border-[#e4e7ec] flex p-px">
            {(['month', 'week', 'day'] as const).map(v => (
              <button key={v} onClick={() => setCalendarView(v)} className={`h-8 flex items-center justify-center px-3 rounded-[7px] transition-colors ${calendarView === v ? 'bg-white shadow-sm' : 'hover:bg-[rgba(255,255,255,0.5)]'}`}>
                <p className="font-['Inter',sans-serif] font-semibold text-[#00332a] text-[12px] capitalize">{v}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={calendarView}
            className="h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {calendarView === 'month' && <MonthView currentDate={currentDate} tasks={tasks} onSelectTask={onSelectTask} milestones={activeMilestones} />}
            {calendarView === 'week' && <WeekView currentDate={currentDate} tasks={tasks} onSelectTask={onSelectTask} milestones={activeMilestones} />}
            {calendarView === 'day' && <DayView currentDate={currentDate} tasks={tasks} onSelectTask={onSelectTask} milestones={activeMilestones} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
