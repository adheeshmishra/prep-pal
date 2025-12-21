export interface WeekPlan {
  week: number;
  focus: string;
  patterns: string;
  problemIds: string;
  resolveIds: string;
  outcome: string;
}

export const executionOrder: WeekPlan[] = [
  { week: 1, focus: "Arrays I", patterns: "Sliding Window", problemIds: "P1–P12", resolveIds: "—", outcome: "Window invariants" },
  { week: 2, focus: "Arrays II", patterns: "Prefix / Two pointers", problemIds: "P13–P24", resolveIds: "P1–P6", outcome: "Preprocess thinking" },
  { week: 3, focus: "Strings", patterns: "Parsing / State", problemIds: "P25–P36", resolveIds: "P7–P12", outcome: "Deterministic logic" },
  { week: 4, focus: "Recursion", patterns: "Decision Trees", problemIds: "P37–P52", resolveIds: "P13–P18", outcome: "Search control" },
  { week: 5, focus: "Binary Search", patterns: "Answer Space", problemIds: "P53–P66", resolveIds: "P19–P24", outcome: "Monotonic reasoning" },
  { week: 6, focus: "Greedy", patterns: "Proof / Heap", problemIds: "P67–P86", resolveIds: "P25–P30", outcome: "Correctness" },
  { week: 7, focus: "Trees I", patterns: "Traversals / Basics", problemIds: "P87–P104", resolveIds: "P31–P36", outcome: "Tree comfort" },
  { week: 8, focus: "Trees II", patterns: "Tree DP / Paths", problemIds: "P105–P126", resolveIds: "P37–P44", outcome: "Hierarchy DP" },
  { week: 9, focus: "Graphs I", patterns: "BFS / DFS", problemIds: "P127–P146", resolveIds: "P45–P52", outcome: "Graph traversal" },
  { week: 10, focus: "Graphs II", patterns: "Implicit / Dijkstra", problemIds: "P147–P168", resolveIds: "P53–P60", outcome: "State graphs" },
  { week: 11, focus: "DP I", patterns: "1D / 2D", problemIds: "P169–P184", resolveIds: "P61–P70", outcome: "DP states" },
  { week: 12, focus: "DP II", patterns: "Subsequence", problemIds: "P185–P200", resolveIds: "P71–P80", outcome: "Transitions" },
  { week: 13, focus: "DP III", patterns: "Bitmask / Interval", problemIds: "P201–P220", resolveIds: "P81–P90", outcome: "Abstraction" },
  { week: 14, focus: "Design DS", patterns: "Invariants", problemIds: "P221–P240", resolveIds: "P91–P100", outcome: "API thinking" },
  { week: 15, focus: "Re-solve", patterns: "Depth", problemIds: "—", resolveIds: "P1–P120", outcome: "Mastery" },
  { week: 16, focus: "Mocks", patterns: "Control", problemIds: "—", resolveIds: "Weak areas", outcome: "Calm interviews" },
];

export const workbookTips = [
  "Follow Execution_Order strictly for week-by-week progression.",
  "A problem is DONE only if: Solved + Re-solved + Explained w/o code.",
  "Re-solve 30–40% problems after 7–10 days.",
  "Top 10–15% = finish Execution_Order honestly.",
  "Top 5% = finish Top5_Upgrade with ≥20 generalized problems.",
];
