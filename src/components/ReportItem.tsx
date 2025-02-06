import { ReactNode } from "react";
import styled from "styled-components";

interface ReportItemProps {
  label: string;
  value: ReactNode;
}

const ReportItem = ({ label, value }: ReportItemProps) => {
  return (
    <ReportItemContainer>
      <Label>{label}</Label>
      <Value>{value}</Value>
    </ReportItemContainer>
  );
};

export default ReportItem;

const ReportItemContainer = styled.li`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  min-height: 24px;
`;

const Label = styled.p`
  width: 80px;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
`;

const Value = styled.p`
  width: 100%;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
`;
