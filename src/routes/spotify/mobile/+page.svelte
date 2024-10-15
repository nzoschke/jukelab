<script lang="ts">
  import { href } from "$lib/href";
  import { onMount } from "svelte";
  import { AlbumTrack, Playlist } from "../jukebox/playlist.svelte";

  let playlist = Playlist("spotify:playlist:0JOnan9Ym7vJ485NEfdu5E");
  let select = $state(AlbumTrack);

  const pad = (n: number) => n.toString().padStart(2, "0");
  const enqueue = async (at: AlbumTrack) => {
    await playlist.enqueue(at);

    const el = document.getElementById("enqueue") as HTMLDialogElement;
    el.showModal();
    setTimeout(() => {
      el.close();
    }, 2500);
  };

  onMount(async () => {
    const res = await fetch(href("/playlist.json"));
    playlist.parse(await res.text());
  });
</script>

<div class="flex h-screen w-screen flex-col">
  <div class="overflow-scroll">
    {#each playlist.albums as album}
      <div class="collapse collapse-arrow w-full border">
        <input
          type="radio"
          name="my-accordion-2"
          oninput={() => {
            console.log("input");
          }}
        />
        <div class="collapse-title flex items-center overflow-hidden text-xl font-medium">
          <img class="mr-2 h-20 w-20" src={album.art} alt="" />
          <div class="overflow-hidden">
            <p class="truncate">{album.artist}</p>
            <p class="truncate">{album.title}</p>
          </div>
        </div>
        <div class="collapse-content overflow-hidden">
          {#each album.tracks as track, n}
            <button
              class="block w-full truncate text-left text-xl"
              onclick={() => {
                select = playlist.find({ albumSrc: album.src, trackSrc: track.src });
                const el = document.getElementById("select") as HTMLDialogElement;
                el.showModal();
              }}
            >
              <span class="font-mono font-bold">{pad(n + 1)}</span>
              {track.title}
            </button>
          {/each}
        </div>
      </div>
    {/each}
  </div>
  <div class="navbar bg-base-200">
    <div class="navbar-start">start</div>
    <div class="navbar-center">center</div>
    <div class="navbar-end">end</div>
  </div>
</div>

<dialog id="select" class="modal">
  <div class="modal-box text-center">
    <h3 class="pb-4 text-lg font-bold">Queue {pad(select.albumNum)}{pad(select.trackNum + 1)}</h3>
    <p class="text-lg font-bold">{select.track.title}</p>
    <p>{select.track.artist}</p>
    <form method="dialog">
      <div class="modal-action justify-between">
        <button class="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">✕</button>
        <button
          class="btn btn-accent"
          onclick={async () => {
            await enqueue(select);
          }}>OK</button
        >
        <button class="btn btn-primary" onclick={() => {}}>NO</button>
      </div>
    </form>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>

<dialog id="enqueue" class="modal">
  <div class="modal-box text-center">
    <h3 class="pb-4 text-lg font-bold">Queued {pad(select.albumNum)}{pad(select.trackNum + 1)}</h3>
    <p class="text-lg font-bold">{select.track.title}</p>
    <p>{select.track.artist}</p>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>
