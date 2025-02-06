import "./App.css";
import { useEffect } from "react";
import Toggle from "./components/Toggle";
import ArrowNavigator from "./components/ArrowNavigator";
import Report from "./components/Report";
import { useDataStore, useReportTypeStore } from "./store";
import Graph from "./components/Graph";
import styled from "styled-components";

function App() {
  const { setData } = useDataStore((state) => state);
  const { reportType } = useReportTypeStore((state) => state);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `https://motionz-kr.github.io/playground/apis/crm-report.json`
      );
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      const { data } = await response.json();
      setData(data);
    } catch (error) {
      console.error("failed to fetch data: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [reportType]);

  return (
    <Container>
      <Section>
        <UpperSection>
          <Header>
            <ArrowNavigator />
            <Toggle />
          </Header>
          <Report />
        </UpperSection>
        <Graph />
      </Section>
    </Container>
  );
}

export default App;

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const Section = styled.section`
  width: 1096px;
  height: 552px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  justify-content: space-between;
  border-radius: 8px;
  border: 1px solid #d9dde4;
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.1);
  padding: 28px 32px 32px 32px;
`;

const Header = styled.div`
  height: 40px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const UpperSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;
