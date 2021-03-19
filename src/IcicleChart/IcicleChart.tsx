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

  return (
    <Container>
      <svg width={width} height={height}>
        <defs>
          <filter id={filterId}>
            <feDropShadow dx="0" dy="0" stdDeviation="5" />
          </filter>
        </defs>
        {sortBy(rectangles, (item: NodeRect) => isHighlighted(item)).map(
          (item) => {
            // TODO
            // if (item.data.name === "All") {
            //   return "";
            // }
            // console.log(item.data);
            // console.log(item.y0);
            // console.log(item.x0);
            // console.log(item.y1);
            // console.log(item.x1);
            const highlighted = isHighlighted(item);
            const rectWidth = item.children
              ? item.y1 - item.y0
              : width - item.y0;
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
                    fillOpacity={highlighted ? 1 : 0.6}
                    stroke={rectColor(item)}
                    strokeWidth={0}
                    strokeOpacity={0}
                    transform={
                      highlighted ? `translate(-5, 0) scale(1.05, 3)` : ""
                    }
                    filter={highlighted ? `url(#${filterId})` : "none"}
                  />
                  {showLabel && (
                    <g
                      transform={
                        highlighted ? `translate(-5, 0) scale(1.05)` : ""
                      }
                    >
                      <TextBox
                        width={rectWidth}
                        height={highlighted ? 3 * rectHeight : rectHeight}
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
  );
};

export default IcicleChart;
