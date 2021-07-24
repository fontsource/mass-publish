export interface GitWalk {
  path: string;
  type: "equal" | "modify" | "add" | "remove";
}
