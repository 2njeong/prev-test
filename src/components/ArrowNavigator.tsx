import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useReportTypeStore, useTimeRangeStore } from "../store";
import styled from "styled-components";
import { PRIMARYGRAY } from "../constants";

const ArrowNavigator = () => {
  const { reportType } = useReportTypeStore((state) => state);
  const {
    year,
    increaseYear,
    decreaseYear,
    month,
    increaseMonth,
    decreaseMonth,
  } = useTimeRangeStore();

  const handleArrow = (type: "increase" | "decrease") => {
    if (type === "increase") {
      if (reportType === "주간") {
        increaseMonth();
      } else {
        increaseYear();
      }
    } else {
      if (reportType === "주간") {
        decreaseMonth();
      } else {
        decreaseYear();
      }
    }
  };

  return (
    <NavigatorContainer>
      <ArrowIcon onClick={() => handleArrow("decrease")}>
        <IoIosArrowBack />
      </ArrowIcon>
      <DateText $isWeekly={reportType === "주간"}>
        {year}년 {reportType === "주간" ? `${month}월` : null}
      </DateText>
      <ArrowIcon onClick={() => handleArrow("increase")}>
        <IoIosArrowForward />
      </ArrowIcon>
    </NavigatorContainer>
  );
};

export default ArrowNavigator;
const NavigatorContainer = styled.div`
  min-width: 171px;
  min-height: 28px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
`;

const ArrowIcon = styled.div`
  width: 24px;
  height: 24px;
  color: ${PRIMARYGRAY};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: color 0.2s ease-in-out;

  &:hover {
    color: black;
  }
`;

const DateText = styled.p<{ $isWeekly: boolean }>`
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  user-select: none;
  min-width: ${(props) => (props.$isWeekly ? "99px" : "68px")};
  text-align: center;
  cursor: pointer;

  &:hover {
    color: #333;
  }
`;
