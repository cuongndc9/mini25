import React, { useState, useEffect } from 'react';
import { HistoryEntry } from '../types';

interface DashboardProps {
  history: HistoryEntry[];
}

const isToday = (someDate: Date) => {
    const today = new Date();
    return someDate.getDate() === today.getDate() &&
           someDate.getMonth() === today.getMonth() &&
           someDate.getFullYear() === today.getFullYear();
};

const isThisWeek = (someDate: Date) => {
    const today = new Date();
    // Adjust to make Sunday the start of the week for consistency with getDay() where Sunday is 0
    const firstDayOfWeek = new Date(today);
    firstDayOfWeek.setDate(today.getDate() - today.getDay());
    firstDayOfWeek.setHours(0, 0, 0, 0);

    const lastDayOfWeek = new Date(firstDayOfWeek);
    lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6);
    lastDayOfWeek.setHours(23, 59, 59, 999);
    
    return someDate >= firstDayOfWeek && someDate <= lastDayOfWeek;
};


const Dashboard: React.FC<DashboardProps> = ({ history }) => {
  const [recharts, setRecharts] = useState<any>(null);

  useEffect(() => {
    if ((window as any).Recharts) {
      setRecharts((window as any).Recharts);
      return;
    }
    
    const intervalId = setInterval(() => {
      if ((window as any).Recharts) {
        setRecharts((window as any).Recharts);
        clearInterval(intervalId);
      }
    }, 100);

    return () => clearInterval(intervalId);
  }, []);
  
  const todayCount = history.filter(entry => isToday(new Date(entry.timestamp))).length;
  const weekCount = history.filter(entry => isThisWeek(new Date(entry.timestamp))).length;

  const getPast7DaysData = () => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() - i);
        
        const dayKey = d.toLocaleDateString('en-US', { weekday: 'short' });
        
        const count = history.filter(entry => {
            const entryDate = new Date(entry.timestamp);
            entryDate.setHours(0,0,0,0);
            return entryDate.getTime() === d.getTime();
        }).length;
        
        data.push({ name: dayKey, pomodoros: count });
    }
    return data;
  };
  
  const chartData = getPast7DaysData();
  const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });

  const renderChart = () => {
    if (!recharts) {
      return (
        <div style={{ width: '100%', height: 300 }} className="flex items-center justify-center text-[var(--text-secondary)]">
          <p>Loading chart...</p>
        </div>
      );
    }

    const { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } = recharts;

    return (
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.1)" />
            <XAxis dataKey="name" stroke="var(--text-secondary)" />
            <YAxis allowDecimals={false} stroke="var(--text-secondary)" />
            <Tooltip
              contentStyle={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}
              labelStyle={{ color: 'var(--text-primary)' }}
              cursor={{fill: 'rgba(59, 130, 246, 0.1)'}}
            />
            <Bar dataKey="pomodoros" fill="var(--primary-accent)" radius={[4, 4, 0, 0]}>
              {
                chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.name === today ? '#60a5fa' : '#3b82f6'} />
                ))
              }
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div className="p-2">
      <h3 className="text-2xl font-bold mb-6 text-center text-[var(--text-primary)]">Your Progress</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="glass-pane p-6 rounded-lg text-center">
          <p className="text-5xl font-bold text-[var(--primary-accent)]">{todayCount}</p>
          <p className="text-[var(--text-secondary)] mt-1">Sessions Today</p>
        </div>
        <div className="glass-pane p-6 rounded-lg text-center">
          <p className="text-5xl font-bold text-[var(--primary-accent)]">{weekCount}</p>
          <p className="text-[var(--text-secondary)] mt-1">Sessions This Week</p>
        </div>
      </div>

      <h4 className="text-xl font-semibold mb-4 text-center">Last 7 Days</h4>
      {renderChart()}
    </div>
  );
};

export default Dashboard;