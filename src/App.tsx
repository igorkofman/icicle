import React, { useState } from "react";
import "./App.css";
import IcicleChart from "./IcicleChart";
import { households, formatCurrency } from "./data";
import { NodeRect } from "./IcicleChart/utils";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { getUniqueCategories } from "./IcicleChart/utils";

const tooltipLabel = (node: NodeRect) =>
  `${node.data.name} ${formatCurrency(node.value || 0)}`;

function App() {
  const [quintile, setQuintile] = useState<number>(0);
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>(
    []
  );
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setQuintile(event.target.value as number);
  };

  const root = households[quintile];
  const categories = getUniqueCategories(root);

  return (
    <>
      <div className="container">
        <FormControl>
          <InputLabel>Percentile</InputLabel>
          <Select value={quintile} onChange={handleChange}>
            <MenuItem value={0}>0-10th</MenuItem>
            <MenuItem value={1}>10-20th</MenuItem>
            <MenuItem value={2}>20-30th</MenuItem>
            <MenuItem value={3}>30-40th</MenuItem>
            <MenuItem value={4}>40-50th</MenuItem>
            <MenuItem value={5}>50-60th</MenuItem>
            <MenuItem value={6}>60-70th</MenuItem>
            <MenuItem value={7}>70-80th</MenuItem>
            <MenuItem value={8}>80-90th</MenuItem>
            <MenuItem value={9}>90-100th</MenuItem>

          </Select>
        </FormControl>
        <Autocomplete
          multiple
          value={selectedCategories}
          id="tags-standard"
          options={categories}
          getOptionLabel={(option: any) => option}
          defaultValue={[]}
          onChange={(event, newSelectedCategories) => {
            setSelectedCategories(newSelectedCategories);
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
          {ordinal(quintile + 1)} Decile: {selectedCategories.join(", ")}
        </h2>
        <IcicleChart
          width={600}
          height={600}
          root={root}
          highlightNode={(node) =>
            selectedCategories.map((c) => c).includes(node.data.name)
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
