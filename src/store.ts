import { create } from "zustand";

// data
export type Data = {
  date: string;
  count: number;
};

type DataStore = {
  data: Data[];
  setData: (data: Data[]) => void;
};

export const useDataStore = create<DataStore>((set) => ({
  data: [],
  setData: (data) => set({ data }),
}));

// 주간, 월간
export type ReportType = "주간" | "월간";

type ReportTypeStore = {
  reportType: ReportType;
  setReportType: (type: ReportType) => void;
};

export const useReportTypeStore = create<ReportTypeStore>((set) => ({
  reportType: "주간",
  setReportType: (type) => set({ reportType: type }),
}));

// 조회기간
export type TimeRangeStore = {
  year: number;
  increaseYear: () => void;
  decreaseYear: () => void;
  month: number;
  increaseMonth: () => void;
  decreaseMonth: () => void;
};

export const useTimeRangeStore = create<TimeRangeStore>((set) => ({
  year: 2024,
  increaseYear: () =>
    set((state) => ({
      ...state,
      year: Math.min(Math.max(2024, state.year + 1), 2025),
    })),
  decreaseYear: () =>
    set((state) => ({
      ...state,
      year: Math.min(Math.max(2024, state.year - 1), 2025),
    })),
  month: 1,
  increaseMonth: () =>
    set((state) => ({
      ...state,
      month: Math.min(Math.max(1, state.month + 1), 12),
    })),
  decreaseMonth: () =>
    set((state) => ({
      ...state,
      month: Math.min(Math.max(1, state.month - 1), 12),
    })),
}));

// 리포트
type ReportData = {
  maxKey: string | number;
  maxCount: number;
  groupByMap: Map<number, number>;
};

type ReportDataStore = {
  maxData: ReportData;
  setMaxData: (
    maxKey: string | number,
    maxCount: number,
    groupByMap: Map<number, number>
  ) => void;
};

export const useReportDataStore = create<ReportDataStore>((set) => ({
  maxData: { maxKey: -1, maxCount: 0, groupByMap: new Map() },
  setMaxData: (maxKey, maxCount, groupByMap) =>
    set((state) => ({
      maxData: { ...state.maxData, maxKey, maxCount, groupByMap },
    })),
}));
