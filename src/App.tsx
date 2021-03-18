import React, { useState } from "react";
import "./App.css";
import IcicleChart from "./IcicleChart";
import { households, formatCurrency } from "./data";
import { NodeRect } from "./IcicleChart/utils";
import Chip from "@material-ui/core/Chip";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";

import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

const tooltipLabel = (node: NodeRect) =>
  `${node.data.name} ${formatCurrency(node.value || 0)}`;

const categories = [
  { title: "Education", value: "Education" },
  { title: "Electricity", value: "Education" },
];

function App() {
  const [quintile, setQuintile] = useState<number>(0);
  const [value, setValue] = React.useState([]);
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setQuintile(event.target.value as number);
  };
  return (
    <>
      <div className="container">
        <FormControl>
          <InputLabel>Quintile</InputLabel>
          <Select value={quintile} onChange={handleChange}>
            <MenuItem value={0}>Bottom 20%</MenuItem>
            <MenuItem value={1}>20-40%</MenuItem>
            <MenuItem value={2}>Middle 20%</MenuItem>
            <MenuItem value={3}>60%-80%</MenuItem>
            <MenuItem value={4}>Top 20%</MenuItem>
          </Select>
        </FormControl>
        <Autocomplete
          multiple
          value={value}
          id="tags-standard"
          options={categories}
          getOptionLabel={(option: any) => option.title}
          defaultValue={[]}
          onChange={(event, newValue) => {
            //            setValue(newValue);
          }}
          renderInput={(params: any) => (
            <TextField
              {...params}
              variant="standard"
              label="Highlighted Categories"
              placeholder="Highlighted Categories"
            />
          )}
        />
        <h2>
          {ordinal(quintile + 1)} Quintile:{" "}
          {categories.map((c) => c.title).join(", ")}
        </h2>
        <IcicleChart
          width={600}
          height={600}
          root={households[quintile]}
          divisor={1}
          highlightNode={(node) =>
            categories.map((c) => c.title).includes(node.data.name)
          }
          tooltipLabel={tooltipLabel}
        />
      </div>
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
