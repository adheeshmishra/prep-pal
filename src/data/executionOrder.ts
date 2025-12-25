export interface WeekPlan {
  week: number;
  focus: string;
  patterns: string;
  problemIds: string;
  problemCount: number;
  hoursEstimate: string;
  resolveIds: string;
  outcome: string;
}

// 16-week plan optimized for 20 hours/week
// Total: 270 problems across 16 weeks = ~17 problems/week
// At ~45 min per problem (solve + understand + notes) + re-solve time = fits in 20 hrs
export const executionOrder: WeekPlan[] = [
  { 
    week: 1, 
    focus: "Arrays & Sliding Window", 
    patterns: "Sliding Window, Two Pointers", 
    problemIds: "P1–P16", 
    problemCount: 16,
    hoursEstimate: "~18 hrs",
    resolveIds: "—", 
    outcome: "Window invariants, pointer manipulation" 
  },
  { 
    week: 2, 
    focus: "Arrays & Prefix", 
    patterns: "Prefix Sum, Difference Arrays, State Machines", 
    problemIds: "P17–P32", 
    problemCount: 16,
    hoursEstimate: "~18 hrs",
    resolveIds: "P1–P8", 
    outcome: "Preprocessing, deterministic logic" 
  },
  { 
    week: 3, 
    focus: "Recursion & Backtracking I", 
    patterns: "Decision Trees, Subsets, Permutations", 
    problemIds: "P33–P50", 
    problemCount: 18,
    hoursEstimate: "~20 hrs",
    resolveIds: "P9–P16", 
    outcome: "Recursion tree thinking" 
  },
  { 
    week: 4, 
    focus: "Recursion & Binary Search", 
    patterns: "Pruning, Search on Answer", 
    problemIds: "P51–P68", 
    problemCount: 18,
    hoursEstimate: "~20 hrs",
    resolveIds: "P17–P24", 
    outcome: "Search space control" 
  },
  { 
    week: 5, 
    focus: "Binary Search & Greedy I", 
    patterns: "Boundaries, Greedy Proofs", 
    problemIds: "P69–P86", 
    problemCount: 18,
    hoursEstimate: "~20 hrs",
    resolveIds: "P25–P32", 
    outcome: "Monotonic reasoning, correctness" 
  },
  { 
    week: 6, 
    focus: "Greedy & Heaps", 
    patterns: "Heap-based Greedy, Greedy Failures", 
    problemIds: "P87–P104", 
    problemCount: 18,
    hoursEstimate: "~20 hrs",
    resolveIds: "P33–P40", 
    outcome: "Heap patterns, when greedy fails" 
  },
  { 
    week: 7, 
    focus: "Trees I", 
    patterns: "Traversals, Tree DP Basics", 
    problemIds: "P105–P120", 
    problemCount: 16,
    hoursEstimate: "~18 hrs",
    resolveIds: "P41–P50", 
    outcome: "Tree traversal comfort" 
  },
  { 
    week: 8, 
    focus: "Trees II & Trie", 
    patterns: "Re-rooting, BST Logic, Trie", 
    problemIds: "P121–P136", 
    problemCount: 16,
    hoursEstimate: "~18 hrs",
    resolveIds: "P51–P60", 
    outcome: "Advanced tree patterns" 
  },
  { 
    week: 9, 
    focus: "Graphs I", 
    patterns: "BFS/DFS, Union Find, Island Problems", 
    problemIds: "P137–P154", 
    problemCount: 18,
    hoursEstimate: "~20 hrs",
    resolveIds: "P61–P70", 
    outcome: "Graph traversal fundamentals" 
  },
  { 
    week: 10, 
    focus: "Graphs II", 
    patterns: "Implicit Graphs, Multi-source BFS, Dijkstra", 
    problemIds: "P155–P172", 
    problemCount: 18,
    hoursEstimate: "~20 hrs",
    resolveIds: "P71–P80", 
    outcome: "State graphs, shortest paths" 
  },
  { 
    week: 11, 
    focus: "Graphs III & DP Intro", 
    patterns: "Topological Sort, 1D DP", 
    problemIds: "P173–P190", 
    problemCount: 18,
    hoursEstimate: "~20 hrs",
    resolveIds: "P81–P90", 
    outcome: "DAG problems, DP states" 
  },
  { 
    week: 12, 
    focus: "Dynamic Programming I", 
    patterns: "1D/2D DP, Grid DP", 
    problemIds: "P191–P208", 
    problemCount: 18,
    hoursEstimate: "~20 hrs",
    resolveIds: "P91–P100", 
    outcome: "2D state transitions" 
  },
  { 
    week: 13, 
    focus: "Dynamic Programming II", 
    patterns: "Subsequence DP, Bitmask DP", 
    problemIds: "P209–P226", 
    problemCount: 18,
    hoursEstimate: "~20 hrs",
    resolveIds: "P101–P110", 
    outcome: "Advanced state representations" 
  },
  { 
    week: 14, 
    focus: "DP III & Design", 
    patterns: "Interval DP, Tree DP, Cache Design", 
    problemIds: "P227–P244", 
    problemCount: 18,
    hoursEstimate: "~20 hrs",
    resolveIds: "P111–P120", 
    outcome: "Interval thinking, API design" 
  },
  { 
    week: 15, 
    focus: "Design & Advanced", 
    patterns: "Composite DS, Advanced Patterns", 
    problemIds: "P245–P270", 
    problemCount: 26,
    hoursEstimate: "~20 hrs",
    resolveIds: "P121–P150", 
    outcome: "Complex data structures" 
  },
  { 
    week: 16, 
    focus: "Review & Mocks", 
    patterns: "All Patterns, Interview Simulation", 
    problemIds: "—", 
    problemCount: 0,
    hoursEstimate: "~20 hrs",
    resolveIds: "Weak areas + Mock contests", 
    outcome: "Interview readiness, calm under pressure" 
  },
];

export const workbookTips = [
  "20 hrs/week breakdown: ~12 hrs new problems, ~5 hrs re-solving, ~3 hrs review/notes",
  "A problem is DONE only if: Solved + Re-solved after 7 days + Can explain without code",
  "Spend max 30 min attempting before checking solution, then re-solve next day",
  "Track your weak patterns in Universal Notes for targeted review",
  "Week 16 is crucial: do timed mock contests to simulate interview pressure",
  "Quality > Quantity: Understanding 1 problem deeply beats rushing through 5",
];
