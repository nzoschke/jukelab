import { untrack } from "svelte";

export interface Line {
  level: string;
  msg: string;
}

export const Log = () => {
  let logs = $state<Line[]>([]);

  const log = (msg: string, level?: string) => {
    untrack(() => {
      logs.push({
        level: level || "success",
        msg,
      });
    });
  };

  return {
    log,
    logs,
  };
};
