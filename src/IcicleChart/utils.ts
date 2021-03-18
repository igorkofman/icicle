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

  console.log({ rootNode });
  const partition = d3Partition<Tree>().size([height, width]).padding(1);
  return partition(rootNode).descendants();
}
