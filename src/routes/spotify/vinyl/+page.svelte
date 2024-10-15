<script lang="ts">
  import { gsap } from "gsap";
  import { ScrollTrigger } from "gsap/ScrollTrigger";
  import { Draggable } from "gsap/Draggable";
  import { onMount } from "svelte";

  gsap.registerPlugin(ScrollTrigger, Draggable);

  const srcs = [
    "https://i.scdn.co/image/ab67616d00001e020ecc8c4fd215d9eb83cbfdb3",
    "https://i.scdn.co/image/ab67616d00001e02d9194aa18fa4c9362b47464f",
    "https://i.scdn.co/image/ab67616d00001e02a7ea08ab3914c5fb2084a8ac",
    "https://i.scdn.co/image/ab67616d00001e0213ca80c3035333e5a6fcea59",
    "https://i.scdn.co/image/ab67616d00001e02df04e6071763615d44643725",
    "https://i.scdn.co/image/ab67616d00001e0239c7302c04f8d06f60e14403",
    "https://i.scdn.co/image/ab67616d00001e021c0bcf8b536295438d26c70d",
    "https://i.scdn.co/image/ab67616d00001e029bbd79106e510d13a9a5ec33",
    "https://i.scdn.co/image/ab67616d00001e021d97ca7376f835055f828139",
    "https://www.udiscovermusic.com/wp-content/uploads/2015/10/Kanye-West-Yeezus.jpg",
  ];

  onMount(() => {
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
      const BOX_TL = gsap
        .timeline()
        .set(BOX, {
          xPercent: 250,
          rotateY: -50,
          opacity: 0,
          scale: 0.5,
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
      horizontal: false,
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

    document.querySelector(".next")!.addEventListener("click", NEXT);
    document.querySelector(".prev")!.addEventListener("click", PREV);

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

<div class="boxes">
  {#each srcs as src, i}
    <div class="box">
      <span>{i}</span>
      <img {src} alt="" />
    </div>
  {/each}
  <div class="controls">
    <button class="prev btn btn-circle">Prev</button>
    <button class="next btn btn-circle">Next</button>
  </div>
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
  .controls {
    position: absolute;
    top: calc(50% + clamp(var(--min-size), 20vmin, 20vmin));
    left: 50%;
    transform: translate(-50%, -50%) scale(1.5);
    display: flex;
    justify-content: space-between;
    min-width: var(--min-size);
    height: 44px;
    width: 20vmin;
    z-index: 300;
  }
  .boxes {
    height: 100vh;
    width: 100%;
    overflow: hidden;
    position: absolute;
    transform-style: preserve-3d;
    perspective: 800px;
    touch-action: none;
  }
  .box {
    transform-style: preserve-3d;
    position: absolute;
    top: 50%;
    left: 50%;
    height: 20vmin;
    width: 20vmin;
    min-height: var(--min-size);
    min-width: var(--min-size);
    display: none;
  }
  .box:after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    height: 100%;
    width: 100%;
    background-image: var(--src);
    background-size: cover;
    transform: translate(-50%, -50%) rotate(180deg) translate(0, -100%) translate(0, -0.5vmin);
    opacity: 0.75;
  }
  .box:before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    height: 100%;
    width: 100%;
    background: linear-gradient(var(--bg) 50%, transparent);
    transform: translate(-50%, -50%) rotate(180deg) translate(0, -100%) translate(0, -0.5vmin)
      scale(1.01);
    z-index: 2;
  }
  .box img {
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    -o-object-fit: cover;
    object-fit: cover;
  }
  .box:nth-of-type(odd) {
    background: #b3f075;
  }
  .box:nth-of-type(even) {
    background: #66b814;
  }
  @supports (-webkit-box-reflect: below) {
    .box {
      -webkit-box-reflect: below 0.5vmin linear-gradient(transparent 0 50%, #fff 100%);
    }
    .box:after,
    .box:before {
      display: none;
    }
  }
</style>
