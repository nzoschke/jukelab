import { createClient } from '@supabase/supabase-js'
import { SvelteMap as Map } from "svelte/reactivity";
import * as env from "$env/static/public";

export interface Presence {
  at: Date;
  name: string;
}

export interface Message {
  payload: any;
  type: string;
}

export const Broadcast = (channel: string) => {
  const messages = $state<Message[]>([])
  const presence = $state<Map<string, Presence>>(new Map());

  const client = createClient(
    env.PUBLIC_SUPABASE_URL,
    env.PUBLIC_SUPABASE_ANON_KEY,
  )

  const pub = (msg: Message) => {
    client
      .channel(channel)
      .send({
        type: 'broadcast',
        event: 'message',
        payload: msg,
      })
  }

  const sub = () => {
    var ch = client.channel(channel)

    ch
      .on("broadcast", { event: "message" }, (payload) => {
        const msg = payload.payload as Message;
        messages.push(msg)
      })
      .on('presence', { event: 'sync' }, () => {
        const presences = ch.presenceState<Presence>();
        Object.entries(presences).forEach(([id, ps]) => {
          const p = ps[0];
          presence.set(p.presence_ref, p);
        });
      })
      .on("presence", { event: "join" }, ({ newPresences }) => {
        newPresences.forEach((p) => {
          presence.set(p.presence_ref, p as unknown as Presence);
        });
      })
      .on("presence", { event: "leave" }, ({ leftPresences }) => {
        leftPresences.forEach((p) => {
          presence.delete(p.presence_ref);
        });
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await ch.track({ name: "src" })
          pub({ type: "hi", payload: { src: "src" } })
        }
      });
  }

  return {
    pub,
    sub,
    get messages() {
      return messages;
    },
    get presence() {
      return presence;
    },
  }
}