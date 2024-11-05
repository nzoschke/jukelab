import { SvelteMap as Map } from "svelte/reactivity";
import { client } from "./auth";

export interface Presence {
  at: Date;
  name: string;
}

export interface Message {
  payload: any;
  type: string;
}

export const Broadcast = () => {
  const messages = $state<Message[]>([]);
  const presence = $state<Map<string, Presence>>(new Map());
  let status = $state("");

  const pub = (channel: string, msg: Message) => {
    client.channel(channel).send({
      type: "broadcast",
      event: "message",
      payload: msg,
    });
  };

  const sub = (
    channel: string,
    name: string,
    onmsg: (msg: Message) => void,
    onpresence?: (p: Presence) => void,
  ) => {
    var ch = client.channel(channel);
    ch.on("broadcast", { event: "message" }, (payload) => {
      const msg = payload.payload as Message;
      onmsg(msg);

      const n = messages.push(msg);
      if (n > 25) {
        messages.splice(0, messages.length - 25);
      }
    })
      .on("presence", { event: "sync" }, () => {
        const presences = ch.presenceState<Presence>();
        Object.entries(presences).forEach(([id, ps]) => {
          const p = ps[0];
          onpresence && onpresence(p);
          presence.set(p.presence_ref, p);
        });
      })
      .on("presence", { event: "join" }, ({ newPresences }) => {
        newPresences.forEach((pp) => {
          const p = pp as unknown as Presence;
          onpresence && onpresence(p);
          presence.set(pp.presence_ref, p);
        });
      })
      .on("presence", { event: "leave" }, ({ leftPresences }) => {
        leftPresences.forEach((pp) => {
          presence.delete(pp.presence_ref);
        });
      })
      .subscribe(async (s) => {
        status = s;
        if (s === "SUBSCRIBED") {
          await ch.track({ name });
        }
      });
  };

  return {
    pub,
    sub,

    get messages() {
      return messages;
    },
    get presence() {
      return presence;
    },
    get status() {
      return status;
    },
  };
};
