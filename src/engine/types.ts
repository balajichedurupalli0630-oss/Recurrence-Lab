export type StepEvent = {
  id: string;
  type: "call" | "return" | "repeat" | "memo-hit" | "table-update" | "choice";
  stateKey: string;
  params: Record<string, number | string>;
  parentId?: string;
  value?: number;
  explanation: string;
  formula?: string;
  tableCell?: { row: number; col: number };
  depth: number;
};

export type InputField = {
  name: string;
  label: string;
  type: "number" | "text";
  defaultValue: any;
  min?: number;
  max?: number;
};

export type TableModel = {
  rows: number;
  cols: number;
  rowLabels: string[];
  colLabels: string[];
  initialValues: Record<string, number>;
};

export type ProblemDefinition = {
  id: string;
  title: string;
  description: string;
  inputSchema: InputField[];
  maxTreeInputRule: (input: any) => boolean;
  generateSteps: (input: any) => StepEvent[];
  buildRecurrenceText: (state: any) => string;
  buildTabulationModel?: (input: any) => TableModel;
};
