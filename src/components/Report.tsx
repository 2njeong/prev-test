import { useEffect, useState } from "react";
import {
  ReportType,
  useReportTypeStore,
  useReportDataStore,
  useTimeRangeStore,
  useDataStore,
} from "../store";
import ReportItem from "./ReportItem";
import { days } from "../util";
import styled from "styled-components";
import { PRIMARYBLUE } from "../constants";

const Report = () => {
  const { data } = useDataStore((state) => state);
  const { reportType } = useReportTypeStore((state) => state);
  const { year, month } = useTimeRangeStore((state) => state);
  const {
    maxData: { maxKey },
    setMaxData,
  } = useReportDataStore();
  const [totalCount, setTotalCount] = useState(0);

  type ReportParams<T extends ReportType> = T extends "주간"
    ? [year: number, month: number]
    : [year: number];

  const getReport = <T extends ReportType>(
    type: T,
    ...params: ReportParams<T>
  ) => {
    if (!data) return;

    const [year, month] = params;
    const groupByMap = new Map<number, number>();
    let maxKey = -1;
    let maxCount = 0;
    let total = 0;

    data.forEach(({ date, count }) => {
      const curDate = new Date(date);
      const key = type === "주간" ? curDate.getDay() : curDate.getMonth() + 1;

      if (
        curDate.getFullYear() === year &&
        (type === "주간" ? curDate.getMonth() + 1 === month : true)
      ) {
        groupByMap.set(key, (groupByMap.get(key) || 0) + count);
      }
    });
    for (const [key, count] of groupByMap) {
      total += count;
      if (count > maxCount) {
        maxCount = count;
        maxKey = key;
      }
    }

    setTotalCount(total);
    setMaxData(maxKey, maxCount, groupByMap);
  };

  useEffect(() => {
    if (data) {
      getReport(reportType, year, month);
    }
  }, [data, year, month, reportType]);

  return (
    <ReportContainer>
      <ReportItem label="Total" value={`${totalCount}회`} />
      <ReportItem
        label="Report"
        value={
          <>
            최근 {reportType === "주간" ? "한달" : "1년"} 동안 우리 병원
            환자들은 [
            <HighlightedText>
              {reportType === "주간" ? days[Number(maxKey)] : maxKey}
            </HighlightedText>
            ]{reportType === "주간" ? "요일" : "월"}에 CRM 메세지를 가장 많이
            조회하였습니다.
          </>
        }
      />
    </ReportContainer>
  );
};

export default Report;

const ReportContainer = styled.div`
  min-height: 84px;
  width: 100%;
  padding: 16px 0;
  text-align: left;
`;

const HighlightedText = styled.span`
  color: ${PRIMARYBLUE};
  font-weight: bold;
`;
