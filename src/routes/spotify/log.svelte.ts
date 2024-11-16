import { untrack } from "svelte";

export type Level = "error" | "info" | "success" | "warning";

export interface Log {
  level: Level;
  msg: string;
}

export const Log = () => {
  let logs = $state<Log[]>([]);

  const log = (msg: string, level?: Level) => {
    console.log(msg);
    untrack(() => {
      logs.push({
        level: level || "info",
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
