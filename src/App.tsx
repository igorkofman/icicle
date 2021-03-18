import React from "react";
import "./App.css";
import IcicleChart from "./IcicleChart";
import { households, formatCurrency } from "./data";
import { NodeRect } from "./IcicleChart/utils";

const tooltipLabel = (node: NodeRect) =>
  `${node.data.name} ${formatCurrency(node.value || 0)}`;

function App() {
  return (
    <>
      {households.map((household, idx) => (
        <div className="container" key={`key-${idx}`}>
          <h2>{ordinal(idx + 1)} Quintile: Education and Electricity</h2>
          <IcicleChart
            width={600}
            height={600}
            root={household}
            divisor={idx === 0 ? 2.5 : 1}
            highlightNode={(node) =>
              ["Electricity", "Education"].includes(node.data.name)
            }
            tooltipLabel={tooltipLabel}
          />
        </div>
      ))}
    </>
  );
}

function ordinal(i: number) {
  var j = i % 10,
    k = i % 100;
  if (j === 1 && k !== 11) {
    return i + "st";
  }
  if (j === 2 && k !== 12) {
    return i + "nd";
  }
  if (j === 3 && k !== 13) {
    return i + "rd";
  }
  return i + "th";
}

export default App;
