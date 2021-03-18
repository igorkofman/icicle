import { uniq } from "lodash";
import {
  hierarchy as d3Hierarchy,
  partition as d3Partition,
  HierarchyRectangularNode,
} from "d3-hierarchy";
import { Tree } from "../data";

export type NodeRect = HierarchyRectangularNode<Tree>;

export function calculateRectangles(
  root: Tree,
  width: number,
  height: number
): NodeRect[] {
  const rootNode = d3Hierarchy(root)
    .sum((d) => Math.abs(d?.value || 0))
    .sort((a, b) => b.height - a.height);
  const partition = d3Partition<Tree>().size([height, width]).padding(1);
  return partition(rootNode).descendants();
}

export const getCategory = (node: NodeRect) => {
  let d = node;
  return d.data.name;
};

export const getUniqueCategories = (root: Tree) => {
  // we don't care about the dimensions here
  const rectangles = calculateRectangles(root, 10, 10);
  return uniq(rectangles.map(getCategory))
    .filter((item) => typeof item === "string")
    .sort();
};
