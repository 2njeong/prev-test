import { ReportType, useReportTypeStore } from "../store";
import styled from "styled-components";

const Toggle = () => {
  const { reportType, setReportType } = useReportTypeStore();
  const reportTypeList: ReportType[] = ["주간", "월간"];

  return (
    <ToggleContainer>
      {reportTypeList.map((type, idx) => (
        <ToggleButton
          key={idx}
          $isActive={reportType === type}
          onClick={() => setReportType(type)}
        >
          {type}
        </ToggleButton>
      ))}
    </ToggleContainer>
  );
};

export default Toggle;

const ToggleContainer = styled.div`
  min-width: 122px;
  min-height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #e8ecf2;
  border-radius: 4px;
  padding: 4px;
`;

const ToggleButton = styled.button<{ $isActive: boolean }>`
  min-width: 57px;
  min-height: 32px;
  padding: 6px 16px;
  font-size: 14px;
  border: none;
  cursor: pointer;
  background-color: ${(props) => (props.$isActive ? "white" : "#e8ecf2")};
  border-radius: 4px;
  transition: background-color 0.2s ease-in-out;

  outline: none;
  &:focus {
    outline: none;
  }
  &:active {
    outline: none;
  }

  &:hover {
    background-color: ${(props) => (props.$isActive ? "#f7f7f7" : "#dbe2ea")};
  }
`;
