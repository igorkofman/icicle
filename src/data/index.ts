import householdJson from "./household.json";

export interface LeafNode {
  name: string;
  value?: number;
}

export interface BranchNode {
  name: string;
  children: (BranchNode | LeafNode)[];
  value?: number;
}

export type Tree = BranchNode | LeafNode;
export type Trees = Tree[];

export const household1: Tree = (householdJson as any)[0];
export const household2: Tree = (householdJson as any)[1];
export const household3: Tree = (householdJson as any)[2];
export const household4: Tree = (householdJson as any)[3];
export const household5: Tree = (householdJson as any)[4];
export const households = [household1, household2, household3, household4, household5 ];

export const formatCurrency = (value: number) =>
  `$${Number(value).toLocaleString()}`;
