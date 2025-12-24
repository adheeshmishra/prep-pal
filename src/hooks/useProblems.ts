import { useState, useEffect } from 'react';
import { Problem, initialProblems } from '@/data/problems';
import { toast } from 'sonner';

const STORAGE_KEY = 'dsa-tracker-problems';
const VERSION_KEY = 'dsa-tracker-version';
const CURRENT_VERSION = 270;

export function useProblems() {
  const [problems, setProblems] = useState<Problem[]>(() => {
    const storedVersion = localStorage.getItem(VERSION_KEY);
    const stored = localStorage.getItem(STORAGE_KEY);
    
    // If version mismatch or no stored data, use initialProblems
    if (!stored || storedVersion !== String(CURRENT_VERSION)) {
      // If we have old data, try to merge progress
      if (stored) {
        try {
          const oldProblems = JSON.parse(stored) as Problem[];
          // Create a map of old progress by problem name
          const progressMap = new Map(oldProblems.map(p => [p.problem, { 
            solved: p.solved, 
            resolved: p.resolved, 
            explained: p.explained, 
            notes: p.notes 
          }]));
          
          // Apply old progress to new problems
          const mergedProblems = initialProblems.map(p => {
            const oldProgress = progressMap.get(p.problem);
            return oldProgress ? { ...p, ...oldProgress } : p;
          });
          
          // Schedule toast after component mounts
          setTimeout(() => {
            toast.success('Problem list updated', {
              description: `Synced to ${CURRENT_VERSION} problems. Your progress has been preserved.`
            });
          }, 500);
          
          return mergedProblems;
        } catch {
          return initialProblems;
        }
      }
      return initialProblems;
    }
    
    try {
      return JSON.parse(stored);
    } catch {
      return initialProblems;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(problems));
    localStorage.setItem(VERSION_KEY, String(CURRENT_VERSION));
  }, [problems]);

  const updateProblem = (id: string, updates: Partial<Problem>) => {
    setProblems(prev => 
      prev.map(p => p.id === id ? { ...p, ...updates } : p)
    );
  };

  const addProblem = (problem: Omit<Problem, 'id'>) => {
    const maxId = Math.max(...problems.map(p => parseInt(p.id) || 0));
    const newProblem: Problem = {
      ...problem,
      id: String(maxId + 1),
    };
    setProblems(prev => [...prev, newProblem]);
  };

  const resetProgress = () => {
    setProblems(initialProblems);
    localStorage.setItem(VERSION_KEY, String(CURRENT_VERSION));
  };

  return { problems, updateProblem, addProblem, resetProgress };
}
