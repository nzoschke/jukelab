export interface Log {
  level: string;
  msg: string;
}

// export const Log = (cb: (log: Log) => void) => {
//   const log = (msg: string, level?: "success" | "warning" | "error") => {
//     cb({
//       level: level || "success",
//       msg,
//     })
//   }

//   return {
//     log,
//   }
// }
