import { untrack } from "svelte";

export type Level = "success" | "error" | "warning";

export interface Log {
  level: Level;
  msg: string;
}

export const Log = () => {
  let logs = $state<Log[]>([]);

  const log = (msg: string, level?: Level) => {
    untrack(() => {
      logs.push({
        level: level || "success",
        msg,
      });
    });
  };

  return {
    log,

    get logs() {
      return logs;
    },
  };
};
