import { useState, useEffect } from 'react';
import { Problem, initialProblems } from '@/data/problems';

const STORAGE_KEY = 'dsa-tracker-problems';

export function useProblems() {
  const [problems, setProblems] = useState<Problem[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return initialProblems;
      }
    }
    return initialProblems;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(problems));
  }, [problems]);

  const updateProblem = (id: string, updates: Partial<Problem>) => {
    setProblems(prev => 
      prev.map(p => p.id === id ? { ...p, ...updates } : p)
    );
  };

  const addProblem = (problem: Omit<Problem, 'id'>) => {
    const maxId = Math.max(...problems.map(p => parseInt(p.id.slice(1))));
    const newProblem: Problem = {
      ...problem,
      id: `P${maxId + 1}`,
    };
    setProblems(prev => [...prev, newProblem]);
  };

  const resetProgress = () => {
    setProblems(initialProblems);
  };

  return { problems, updateProblem, addProblem, resetProgress };
}
