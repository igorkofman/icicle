import React from "react";
import { range, uniq, sortBy } from "lodash";
import { Container, StyledRect } from "./IcicleChart.style";
import { Tree } from "../data";
import { calculateRectangles, NodeRect } from "./utils";
import Tooltip from "@material-ui/core/Tooltip";
import TextBox from "./TextBox";
import { interpolateRainbow } from "d3-scale-chromatic";
import { scaleOrdinal } from "@visx/scale";

const getCategory = (node: NodeRect) => {
  let d = node;
  while (d.depth > 2) {
    d = d.parent ?? d;
  }
  return d.data.name;
};

const IcicleChart: React.FC<{
  width: number;
  height: number;
  root: Tree;
  tooltipLabel: (node: NodeRect) => string;
  highlightNode?: (node: NodeRect) => boolean;
}> = ({ width, height, root, highlightNode, tooltipLabel }) => {
  const rectangles = calculateRectangles(root, width, height);

  const categories = uniq(rectangles.map(getCategory));

  const quantizedCategory = scaleOrdinal({
    domain: categories,
    range: range(0, 1, 1 / (categories.length + 1)),
  });

  const rectColor = (d: NodeRect) => {
    const category = getCategory(d);
    const t = quantizedCategory(category);
    return d.depth === 0 ? "#999" : interpolateRainbow(t);
  };

  const isHighlighted = (item: NodeRect) =>
    highlightNode ? highlightNode(item) : false;

  const filterId = `shadow-filter`;

  // collision detection
  const sortedHighlightedRecs = rectangles.filter(isHighlighted).sort((r1,r2)=>r1.x0-r2.x0);
  let lastStart = -22;
  let sumOfHighlighted:number = 0;
  sortedHighlightedRecs.forEach(r => {
    if (r.x0 < lastStart + 22) {
      r.x0 = lastStart + 22;
    }
    sumOfHighlighted += (r.value || 0);
    lastStart=r.x0;
  })
  const highlightingSome = sortedHighlightedRecs.length;
  const aae = rectangles.filter(r => r.data.name==="Average annual expenditures")[0].value;
  return (
    <>
    { Math.round(sumOfHighlighted / (aae||0) * 10000)/100 }% of Average annual expenditures
    <br/><br/>
    <Container>
      <svg width={width} height={height}>
        <defs>
          <filter id={filterId}>
            <feDropShadow dx="0" dy="0" stdDeviation="5" />
          </filter>
        </defs>
        {sortBy(rectangles, isHighlighted).map(
          (item) => {
            const highlighted = isHighlighted(item);
            const rectWidth = item.children
              ? item.y1 - item.y0
              : width - item.y0;
            if (highlighted) {
              item.x1 = item.x0 + 22;

            }

            const rectHeight = item.x1 - item.x0;
            const showLabel = highlighted || rectHeight > 8;

            return (
              <Tooltip
                key={item.data.name}
                title={tooltipLabel(item)}
                placement="top"
                arrow
              >
                <g transform={`translate(${item.y0 - 100}, ${item.x0})`}>
                  <StyledRect
                    width={rectWidth}
                    height={rectHeight}
                    fill={isHighlighted(item) ? "white" : rectColor(item)}
                    fillOpacity={highlighted ? 1 : (highlightingSome? 0.5 : 0.6)}
                    stroke={rectColor(item)}
                    strokeWidth={0}
                    strokeOpacity={0}
                    transform={
                      highlighted ? `translate(0, 0) scale(1.05, 1.05)` : ""
                    }
                    filter={highlighted ? `url(#${filterId})` : "none"}
                  />
                  {showLabel && (
                    <g
                      transform={
                        highlighted ? `translate(0, 0) scale(1.05)` : ""
                      }
                    >
                      <TextBox
                        width={rectWidth}
                        height={rectHeight}
                        text={tooltipLabel(item)}
                      />
                    </g>
                  )}
                </g>
              </Tooltip>
            );
          }
        )}
      </svg>
    </Container>
    </>
  );
};

export default IcicleChart;
