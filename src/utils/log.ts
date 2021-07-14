import { format } from "util";

const log = (text: string): void => {
  process.stdout.write(`${format(text)}\n`);
};

export default log;
