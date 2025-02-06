import React, { useEffect, useRef, useState } from "react";
import { useReportDataStore, useReportTypeStore } from "../store";
import { days } from "../util";
import { PRIMARYBLACK, PRIMARYBLUE } from "../constants";
import styled from "styled-components";

const Graph = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const { reportType } = useReportTypeStore((state) => state);
  const {
    maxData: { groupByMap },
  } = useReportDataStore((state) => state);
  const keys = [...groupByMap.keys()].sort((a, b) => a - b);
  const values = keys.map((key) => groupByMap.get(key) || 0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const padding = 50;

  useEffect(() => {
    const canvas = canvasRef.current;
    const offscreenCanvas = offscreenCanvasRef.current;
    if (!canvas || !offscreenCanvas) return;

    const context = canvas.getContext("2d");
    const offscreenContext = offscreenCanvas.getContext("2d");
    if (!context || !offscreenContext) return;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    context.clearRect(0, 0, canvasWidth, canvasHeight);

    const graghWidth = canvasWidth - padding * 2;
    const graphHeight = canvasHeight - padding * 2;

    const maxValue = Math.ceil(Math.max(...values) / 800) * 800;
    const minValue = 0;
    const normalizeY = (value: number) =>
      canvasHeight -
      ((value - minValue) / (maxValue - minValue)) * graphHeight -
      padding;

    const xStep = values.length > 1 ? graghWidth / (values.length - 1) : 0;

    // 꺾은선
    context.strokeStyle = "#ddd";
    context.lineWidth = 1;
    context.beginPath();

    values.forEach((val, idx) => {
      const x = padding + idx * xStep;
      const y = normalizeY(val);

      if (idx === 0) {
        context.moveTo(x, y);
      } else {
        context.lineTo(x, y);
      }
    });
    context.stroke();

    // 각 포인트
    values.forEach((val, idx) => {
      const x = padding + idx * xStep;
      const y = normalizeY(val);

      context.beginPath();
      context.arc(x, y, 8, 0, Math.PI * 2);
      context.fillStyle = "white";
      context.strokeStyle = PRIMARYBLUE;
      context.lineWidth = 2;
      context.fill();
      context.stroke();

      context.beginPath();
      context.arc(x, y, 4, 0, Math.PI * 2);
      context.fillStyle = PRIMARYBLUE;
      context.fill();
    });

    // x축 라벨
    context.fillStyle = PRIMARYBLACK;
    context.font = "14px Arial";
    context.textAlign = "center";
    const xLabelOffsetY = 20; // 적절한 간격 조정

    keys.forEach((key, idx) => {
      const x = padding + idx * xStep;
      context.fillText(
        reportType === "주간" ? days[key] : `${key}`,
        x,
        canvasHeight - xLabelOffsetY
      );
    });

    // y축 라벨
    const yLabelArr = [];
    let newValue = 0;
    while (newValue <= maxValue) {
      yLabelArr.push(newValue);
      newValue += 800;
    }

    context.fillStyle = PRIMARYBLACK;
    context.strokeStyle = "#ddd";
    context.lineWidth = 1;
    context.textAlign = "right";
    context.textBaseline = "middle";
    context.font = "14px Arial";

    yLabelArr.forEach((label) => {
      const y = canvasHeight - (label / maxValue) * graphHeight - padding;
      context.fillText(String(label), padding - 15, y);
      // 가로선
      context.beginPath();
      context.moveTo(padding, y);
      context.lineTo(canvasWidth - padding, y);
      context.stroke();
    });

    // 호버
    offscreenCanvas.width = canvasWidth;
    offscreenCanvas.height = canvasHeight;

    if (hoveredIndex !== null) {
      const x = padding + hoveredIndex * xStep;
      const y = normalizeY(values[hoveredIndex]);

      const boxWidth = 40;
      const boxHeight = 25;
      const boxX = x - boxWidth / 2;
      const boxY = y - 45;

      // 툴팁
      offscreenContext.fillStyle = "white";
      offscreenContext.shadowColor = "rgba(0, 0, 0, 0.2)";
      offscreenContext.shadowBlur = 5;
      offscreenContext.shadowOffsetX = 2;
      offscreenContext.shadowOffsetY = 2;

      const borderRadius = 4;
      drawRoundedRect(
        offscreenContext,
        boxX,
        boxY,
        boxWidth,
        boxHeight,
        borderRadius
      );

      offscreenContext.fillStyle = PRIMARYBLACK;
      offscreenContext.font = "12px Arial";
      offscreenContext.textAlign = "center";
      offscreenContext.fillText(String(values[hoveredIndex]), x, boxY + 16);

      offscreenContext.shadowBlur = 0;
      offscreenContext.shadowOffsetX = 0;
      offscreenContext.shadowOffsetY = 0;

      // 툴팁과 세로선
      offscreenContext.beginPath();
      offscreenContext.strokeStyle = "#ddd";
      offscreenContext.lineWidth = 1;
      offscreenContext.setLineDash([5, 5]);
      offscreenContext.moveTo(x, y + 5);
      offscreenContext.lineTo(x, canvasHeight - padding);
      offscreenContext.stroke();
      offscreenContext.setLineDash([]);
    }

    // Offscreen Canvas 내용을 기존 canvas에 합치기
    context.drawImage(offscreenCanvas, 0, 0);
  }, [keys, reportType, values, hoveredIndex]);

  const handleHover = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;

    const graghWidth = canvas.width - padding * 2;
    const xStep = graghWidth / (values.length - 1);

    let foundIdx: number | null = null;
    values.forEach((_, idx) => {
      const x = padding + idx * xStep;
      if (Math.abs(mouseX - x) < 10) {
        foundIdx = idx;
      }
    });

    setHoveredIndex(foundIdx);
  };

  const drawRoundedRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
  };

  return (
    <CanvasContainer>
      <StyledCanvas
        ref={canvasRef}
        width={1032}
        height={340}
        onMouseMove={handleHover}
        onMouseLeave={() => setHoveredIndex(null)}
      />
      <HiddenCanvas ref={offscreenCanvasRef} width={1032} height={340} />
    </CanvasContainer>
  );
};

export default Graph;

const CanvasContainer = styled.div`
  position: relative;
  width: 1032px;
  height: 340px;
`;

const StyledCanvas = styled.canvas`
  width: 100%;
  height: 100%;
  display: block;
`;

const HiddenCanvas = styled.canvas`
  display: none;
`;
