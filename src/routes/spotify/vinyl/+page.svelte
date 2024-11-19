<script lang="ts">
  import { gsap } from "gsap";
  import { Draggable } from "gsap/Draggable";
  import { ScrollTrigger } from "gsap/ScrollTrigger";
  import { onMount } from "svelte";
  import { Auth, IUser } from "$lib/auth";
  import { Audio } from "$lib/types/audio";
  import { Playlist } from "../playlist.svelte";

  const auth = Auth();

  let user = $state(IUser);
  let audio = $state(Audio);
  let playlist = Playlist();

  gsap.registerPlugin(ScrollTrigger, Draggable);

  onMount(async () => {
    user = await auth.user();
    await playlist.get(auth.token, (a) => {
      // select.album = a;
    });
    // select.album = playlist.albums[0];

    gsap.set(".box", {
      yPercent: -50,
    });

    const STAGGER = 0.1;
    const DURATION = 1;
    const OFFSET = 0;
    const BOXES = gsap.utils.toArray<HTMLDivElement>(".box");

    const LOOP = gsap.timeline({
      paused: true,
      repeat: -1,
      ease: "none",
    });

    const SHIFTS = [...BOXES, ...BOXES, ...BOXES];

    SHIFTS.forEach((BOX, index) => {
      let q = gsap.utils.selector(BOX);
      let LABEL = q(".label");
      let VINYL = q(".vinyl");

      const BOX_TL = gsap
        .timeline()

        // Initial
        .set(BOX, {
          xPercent: 250,
          rotateY: -50,
          opacity: 0,
          scale: 0.5,
        })

        .set(LABEL, {
          opacity: 0,
        })

        .set(VINYL, {
          top: 0,
          rotate: 14,
        })

        // Opacity && Scale
        .to(
          BOX,
          {
            opacity: 1,
            scale: 1,
            duration: 0.1,
          },
          0,
        )

        .to(
          BOX,
          {
            opacity: 0,
            scale: 0.5,
            duration: 0.1,
          },
          0.9,
        )

        // Panning
        .fromTo(
          BOX,
          {
            xPercent: 250,
          },
          {
            xPercent: -350,
            duration: 1,
            immediateRender: false,
            ease: "power1.inOut",
          },
          0,
        )

        // Rotations
        .fromTo(
          BOX,
          {
            rotateY: -50,
          },
          {
            rotateY: 50,
            immediateRender: false,
            duration: 1,
            ease: "power4.inOut",
          },
          0,
        )

        // Scale && Z
        .to(
          BOX,
          {
            z: 100,
            scale: 1.25,
            duration: 0.1,
            repeat: 1,
            yoyo: true,
          },
          0.4,
        )

        .fromTo(
          BOX,
          {
            zIndex: 1,
          },
          {
            zIndex: BOXES.length,
            repeat: 1,
            yoyo: true,
            ease: "none",
            duration: 0.5,
            immediateRender: false,
          },
          0,
        )

        // Label Opacity
        .to(
          LABEL,
          {
            opacity: 1,
            duration: 0.1,
            repeat: 1,
            yoyo: true,
          },
          0.4,
        )

        .to(
          VINYL,
          {
            duration: 0.1,
            top: "-50%",
            repeat: 1,
            rotate: 288,
            yoyo: true,
          },
          0.4,
        );

      LOOP.add(BOX_TL, index * STAGGER);
    });

    const CYCLE_DURATION = STAGGER * BOXES.length;
    const START_TIME = CYCLE_DURATION + DURATION * 0.5 + OFFSET;

    const LOOP_HEAD = gsap.fromTo(
      LOOP,
      {
        totalTime: START_TIME,
      },
      {
        totalTime: `+=${CYCLE_DURATION}`,
        duration: 1,
        ease: "none",
        repeat: -1,
        paused: true,
      },
    );

    const PLAYHEAD = {
      position: 0,
    };

    const POSITION_WRAP = gsap.utils.wrap(0, LOOP_HEAD.duration());

    const SCRUB = gsap.to(PLAYHEAD, {
      position: 0,
      onUpdate: () => {
        LOOP_HEAD.totalTime(POSITION_WRAP(PLAYHEAD.position));
      },
      paused: true,
      duration: 0.25,
      ease: "power3",
    });

    SCRUB.vars.position;

    let iteration = 0;
    const TRIGGER = ScrollTrigger.create({
      start: 0,
      end: "+=2000",
      horizontal: true,
      pin: ".boxes",
      onUpdate: (self) => {
        const SCROLL = self.scroll();
        if (SCROLL > self.end - 1) {
          // Go forwards in time
          WRAP(1, 1);
        } else if (SCROLL < 1 && self.direction < 0) {
          // Go backwards in time
          WRAP(-1, self.end - 1);
        } else {
          const NEW_POS = (iteration + self.progress) * LOOP_HEAD.duration();
          SCRUB.vars.position = NEW_POS;
          SCRUB.invalidate().restart();
        }
      },
    });

    const WRAP = (iterationDelta: number, scrollTo: number) => {
      iteration += iterationDelta;
      TRIGGER.scroll(scrollTo);
      TRIGGER.update();
    };

    const SNAP = gsap.utils.snap(1 / BOXES.length);

    const progressToScroll = (progress: number) =>
      gsap.utils.clamp(1, TRIGGER.end - 1, gsap.utils.wrap(0, 1, progress) * TRIGGER.end);

    const scrollToPosition = (position: number) => {
      const SNAP_POS = SNAP(position);
      const PROGRESS = (SNAP_POS - LOOP_HEAD.duration() * iteration) / LOOP_HEAD.duration();
      const SCROLL = progressToScroll(PROGRESS);
      if (PROGRESS >= 1 || PROGRESS < 0) return WRAP(Math.floor(PROGRESS), SCROLL);
      TRIGGER.scroll(SCROLL);
    };

    const pos = (v: gsap.TweenValue | undefined): number => {
      if (!v) return 0;
      return Number(v);
    };

    ScrollTrigger.addEventListener("scrollEnd", () => scrollToPosition(pos(SCRUB.vars.position)));

    const NEXT = () => scrollToPosition(pos(SCRUB.vars.position) - 1 / BOXES.length);
    const PREV = () => scrollToPosition(pos(SCRUB.vars.position) + 1 / BOXES.length);

    document.addEventListener("keydown", (event) => {
      if (event.code === "ArrowLeft" || event.code === "KeyA") NEXT();
      if (event.code === "ArrowRight" || event.code === "KeyD") PREV();
    });

    document.querySelector(".boxes")!.addEventListener("click", (e) => {
      const t = e.target as HTMLDivElement;
      const BOX = t.closest(".box") as HTMLDivElement;
      if (BOX) {
        let TARGET = BOXES.indexOf(BOX);
        let CURRENT = gsap.utils.wrap(
          0,
          BOXES.length,
          Math.floor(BOXES.length * pos(SCRUB.vars.position)),
        );

        let BUMP = TARGET - CURRENT;
        if (TARGET > CURRENT && TARGET - CURRENT > BOXES.length * 0.5) {
          BUMP = (BOXES.length - BUMP) * -1;
        }
        if (CURRENT > TARGET && CURRENT - TARGET > BOXES.length * 0.5) {
          BUMP = BOXES.length + BUMP;
        }

        scrollToPosition(pos(SCRUB.vars.position) + BUMP * (1 / BOXES.length));
      }
    });

    gsap.set(".box", { display: "block" });

    gsap.set("button", {
      z: 200,
    });

    Draggable.create(".drag-proxy", {
      type: "x",
      trigger: ".box",
      onPress() {
        this.startOffset = SCRUB.vars.position;
      },
      onDrag() {
        SCRUB.vars.position = this.startOffset + (this.startX - this.x) * 0.001;
        SCRUB.invalidate().restart(); // same thing as we do in the ScrollTrigger's onUpdate
      },
      onDragEnd() {
        scrollToPosition(pos(SCRUB.vars.position));
      },
    });
  });
</script>

<div class="boxes absolute h-svh w-svw touch-none overflow-hidden">
  {#each playlist.albums as album}
    <div class="box absolute left-1/2 top-1/2 h-[36vmin] min-h-[200px] w-[36vmin] min-w-[200px]">
      <div class="vinyl absolute flex size-full items-center justify-center rounded-full">
        <img class="h-2/3 w-2/3" src={album.art} alt="" />
      </div>
      <img class="absolute size-full object-cover" src={album.art} alt="" />
      <div class="label absolute size-full p-0">
        <div class="flex size-full flex-col bg-black p-2 opacity-85">
          <p class="truncate font-bold">{album.title}</p>
          <p class="truncate">{album.artist}</p>
          <div class="flex-1 overflow-scroll text-[12px]">
            {#each album.tracks as track}
              <p class="truncate">{track.title}</p>
            {/each}
          </div>
        </div>
      </div>
    </div>
  {/each}
</div>
<div class="drag-proxy"></div>

<style>
  * {
    box-sizing: border-box;
  }

  :root {
    --bg: #1a1a1a;
    --min-size: 200px;
  }
  .drag-proxy {
    visibility: hidden;
    position: absolute;
  }
  .boxes {
    transform-style: preserve-3d;
    perspective: 800px;
  }
  .box .vinyl {
    background-image: url("/vinyl.png");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }
  .box .vinyl img {
    background-repeat: no-repeat;
    mask-image: radial-gradient(circle, black 70%, transparent 70%);
    -webkit-mask-image: radial-gradient(circle, black 70%, transparent 70%);
  }
  .box img {
    -webkit-box-reflect: below 0.1vmin
      linear-gradient(to bottom, rgba(0, 0, 0, 0) 35%, rgba(0, 0, 0, 0.2));
  }
</style>
