import { untrack } from "svelte";

export type Level = "error" | "info" | "success" | "warning";

export interface Log {
  level: Level;
  msg: string;
}

export const Log = (length = 1000) => {
  const logs = $state<Log[]>([]);

  const log = (msg: string, level?: Level) => {
    console.log(msg);
    untrack(() => {
      logs.push({
        level: level || "info",
        msg,
      });
      if (logs.length > length) {
        logs.splice(0, logs.length - length);
      }
    });
  };

  return {
    log,

    get logs() {
      return logs;
    },
  };
};
