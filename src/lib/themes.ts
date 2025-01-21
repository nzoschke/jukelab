import { writable } from "svelte/store";

export const theme = writable("default");

export const getThemes = () => [
  ...jukelabThemes,
  ...partifulThemes.map((t) => partifulToJukelab(t)).filter((t) => !!t),
];

export const getTheme = (name: string) => {
  const jt = jukelabThemes.find((t) => t.name === name);
  if (jt) {
    return {
      backdropClass: "bg-gradient-to-b from-white to-gray-300",
      backgroundColor: null,
      backgroundGradient: null,
      animationStyle: null,
      darkMode: false,
      transparent: false,
    };
  }

  const pt = partifulThemes.find((t) => t.name === name);
  if (pt) {
    return { ...pt, backdropClass: null, transparent: true };
  }

  throw `unknown theme: ${name}`;
};

const jukelabThemes = [
  {
    name: "default",
    avatar: "Default",
    img: null,
  },
];

const partifulToJukelab = (t: (typeof partifulThemes)[number]) => {
  if (t.hidden) {
    return null;
  }

  return {
    name: t.name,
    avatar: null,
    img: `https://assets.getpartiful.com/backgrounds/${t.name}/thumbnail.png`,
  };
};

const partifulThemes = [
  {
    name: "test",
    backgroundColor: "#1C0606",
    themeColors: {
      gradient1: "#FF7A27",
      gradient2: "#410101",
      gradient3: "#FF6529",
      gradient4: "#FFAD33",
      gradient5: "#FE742F",
      link: "#FFF3BF",
      linkGradientCenter: "#FFC184",
    },
    dimensions: {
      desktop: {
        width: 1440,
        height: 3354,
      },
      mobile: {
        width: 375,
        height: 1900,
      },
    },
    backgroundGradient:
      "linear-gradient(90deg, rgba(240,97,2,1) 0%, rgba(217,103,193,1) 43%, rgba(96,226,195,1) 65%, rgba(217,139,180,1) 95%)",
    animationStyle: "none",
    darkMode: true,
    hidden: true,
  },
  {
    name: "karaoke",
    backgroundColor: "#030378",
    themeColors: {
      gradient1: "#FF00EB",
      gradient2: "#374BFF",
      gradient3: "#0000FF",
      gradient4: "#00BAFF",
      gradient5: "#5835EA",
      link: "#A3FFD3",
      linkGradientCenter: "#8F9BFF",
    },
    dimensions: {
      desktop: {
        width: 1440,
        height: 3354,
      },
      mobile: {
        width: 375,
        height: 1900,
      },
    },
    backgroundGradient:
      "linear-gradient(90deg, rgba(207,0,249,1) 0%, rgba(3,3,120,1) 50%, rgba(207,0,249,1) 100%)",
    animationStyle: "video",
    darkMode: true,
    hasMultipleSizes: true,
    newUntil: "2024-12-26T04:00:00.000Z",
    category: ["🔥 Trending", "🐒 Fun"],
  },
  {
    name: "snowPaws",
    backgroundColor: "#BCD7FF",
    themeColors: {
      gradient1: "#8585FF",
      gradient2: "#A4DEFF",
      gradient3: "#86FFFB",
      gradient4: "#7EFFEE",
      gradient5: "#89A3FF",
      link: "#0558FF",
      linkGradientCenter: "#0091D4",
    },
    dimensions: {
      desktop: {
        width: 1440,
        height: 3354,
      },
      mobile: {
        width: 375,
        height: 1900,
      },
    },
    backgroundGradient:
      "linear-gradient(90deg, rgba(191,203,222,1) 0%, rgba(188,215,255,1) 50%, rgba(191,203,222,1) 100%)",
    animationStyle: "video",
    darkMode: false,
    hasMultipleSizes: true,
    newUntil: "2024-12-17T04:00:00.000Z",
    category: ["🔥 Trending", "🎁 Seasonal"],
  },
  {
    name: "winterWonderland",
    backgroundColor: "#B3CAF1",
    themeColors: {
      gradient1: "#FF76FA",
      gradient2: "#07F7FF",
      gradient3: "#64D5FF",
      gradient4: "#BDFBFF",
      gradient5: "#F7D6FF",
      link: "#4603B3",
      linkGradientCenter: "#0927C3",
    },
    dimensions: {
      desktop: {
        width: 1440,
        height: 3354,
      },
      mobile: {
        width: 375,
        height: 1900,
      },
    },
    backgroundGradient:
      "linear-gradient(90deg, rgba(229,237,250,1) 0%, rgba(179,202,241,1) 43%, rgba(207,220,239,1) 100%)",
    animationStyle: "video",
    darkMode: false,
    hasMultipleSizes: true,
    category: ["🎁 Seasonal", "🔥 Trending"],
  },
  {
    name: "phantom",
    backgroundColor: "#11100E",
    themeColors: {
      gradient1: "#0056AC",
      gradient2: "#00C58A",
      gradient3: "#8EF6FF",
      gradient4: "#6846FF",
      gradient5: "#00CABA",
      link: "#B1FFEF",
      linkGradientCenter: "#84FFCA",
    },
    dimensions: {
      desktop: {
        width: 1440,
        height: 3354,
      },
      mobile: {
        width: 375,
        height: 1900,
      },
    },
    backgroundGradient:
      "linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(249,245,239,1) 47%, rgba(212,214,241,1) 65%, rgba(183,180,208,1) 97%)",
    animationStyle: "video",
    darkMode: true,
    hasMultipleSizes: true,
    category: ["🌑 Dark", "🎁 Seasonal"],
  },
  {
    name: "oxblood",
    backgroundColor: "#1C0606",
    themeColors: {
      gradient1: "#FF7A27",
      gradient2: "#410101",
      gradient3: "#FF6529",
      gradient4: "#FFAD33",
      gradient5: "#FE742F",
      link: "#FFF3BF",
      linkGradientCenter: "#FFC184",
    },
    dimensions: {
      desktop: {
        width: 1440,
        height: 3354,
      },
      mobile: {
        width: 375,
        height: 1900,
      },
    },
    backgroundGradient:
      "linear-gradient(90deg, rgba(240,97,2,1) 0%, rgba(217,103,193,1) 43%, rgba(96,226,195,1) 65%, rgba(217,139,180,1) 95%)",
    animationStyle: "none",
    darkMode: true,
    category: ["🔥 Trending", "🌑 Dark", "🎁 Seasonal"],
  },
  {
    name: "whisky",
    backgroundColor: "#200400",
    themeColors: {
      gradient1: "#E0792A",
      gradient2: "#D55200",
      gradient3: "#FFDE73",
      gradient4: "#FBC07C",
      gradient5: "#C9801A",
      link: "#FFE986",
      linkGradientCenter: "#FFD280",
    },
    dimensions: {
      desktop: {
        width: 1440,
        height: 3354,
      },
      mobile: {
        width: 375,
        height: 1900,
      },
    },
    backgroundGradient:
      "linear-gradient(90deg, rgba(169,148,70,1) 0%, rgba(32,4,0,1) 30%, rgba(32,4,0,1) 70%, rgba(169,148,70,1) 97%)",
    animationStyle: "none",
    darkMode: true,
    category: ["🔥 Trending", "🌑 Dark", "🎁 Seasonal"],
  },
  {
    name: "ice",
    backgroundColor: "#091520",
    themeColors: {
      gradient1: "#2A89E0",
      gradient2: "#5B83BE",
      gradient3: "#87DEFF",
      gradient4: "#7CE2FB",
      gradient5: "#1A1AC9",
      link: "#86E9FF",
      linkGradientCenter: "#80C8FF",
    },
    dimensions: {
      desktop: {
        width: 1440,
        height: 3354,
      },
      mobile: {
        width: 375,
        height: 1900,
      },
    },
    backgroundGradient:
      "linear-gradient(90deg, rgba(97,128,174,1) 0%, rgba(9,21,32,1) 30%, rgba(0,0,0,1) 70%, rgba(97,128,174,1) 100%)",
    animationStyle: "none",
    darkMode: true,
    category: ["🔥 Trending", "🌑 Dark", "🎁 Seasonal"],
  },
  {
    name: "komorebi",
    backgroundColor: "#D4D6F1",
    themeColors: {
      gradient1: "#FFF0CA",
      gradient2: "#54E0FF",
      gradient3: "#E5C3FF",
      gradient4: "#A77EFF",
      gradient5: "#FFADBB",
      link: "#612CF7",
      linkGradientCenter: "#CCA5FF",
    },
    dimensions: {
      desktop: {
        width: 1440,
        height: 3354,
      },
      mobile: {
        width: 375,
        height: 1900,
      },
    },
    backgroundGradient:
      "linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(249,245,239,1) 47%, rgba(212,214,241,1) 65%, rgba(183,180,208,1) 97%)",
    animationStyle: "video",
    darkMode: false,
    hasMultipleSizes: true,
    category: ["🔥 Trending", "🌕 Minimal"],
  },
  {
    name: "rainbowGlitter",
    backgroundColor: "#F7AC67",
    themeColors: {
      gradient1: "#FF70AC",
      gradient2: "#54E0FF",
      gradient3: "#FF9DF2",
      gradient4: "#88A2FF",
      gradient5: "#FF5C77",
      link: "#AD26FF",
      linkGradientCenter: "#16A1FF",
    },
    dimensions: {
      desktop: {
        width: 1440,
        height: 3354,
      },
      mobile: {
        width: 375,
        height: 1900,
      },
    },
    backgroundGradient:
      "linear-gradient(90deg, rgba(238,162,117,1) 0%, rgba(247,176,92,1) 16%, rgba(245,197,84,1) 32%, rgba(208,205,130,1) 47%, rgba(163,195,223,1) 65%, rgba(171,180,235,1) 81%, rgba(184,149,199,1) 97%",
    animationStyle: "video",
    darkMode: false,
    hasMultipleSizes: true,
    category: ["🐒 Fun", "🎁 Seasonal"],
  },
  {
    name: "beer",
    backgroundColor: "#DE9747",
    themeColors: {
      gradient1: "#FFD5A4",
      gradient2: "#ABFFEB",
      gradient3: "#96F2FF",
      gradient4: "#B1FFF1",
      gradient5: "#FDFF89",
      link: "#001687",
      linkGradientCenter: "#006180",
    },
    dimensions: {
      desktop: {
        width: 1440,
        height: 3354,
      },
      mobile: {
        width: 375,
        height: 1900,
      },
    },
    backgroundGradient:
      "linear-gradient(90deg, rgba(222,224,221,1) 0%, rgba(178,173,161,1) 20%, rgba(213,181,146,1) 32%, rgba(217,144,47,1) 53%, rgba(208,145,23,1) 98%)",
    animationStyle: "video",
    darkMode: false,
    hasMultipleSizes: true,
    category: ["🐒 Fun"],
  },
  {
    name: "cloudflow",
    backgroundColor: "#A7C8FF",
    themeColors: {
      gradient1: "#FF8500",
      gradient2: "#1FAFFF",
      gradient3: "#FFD600",
      gradient4: "#00FFFF",
      gradient5: "#6EFFE5",
      link: "#014FAB",
      linkGradientCenter: "#356DD8",
    },
    dimensions: {
      desktop: {
        width: 1440,
        height: 3354,
      },
      mobile: {
        width: 375,
        height: 1900,
      },
    },
    backgroundGradient:
      "linear-gradient(90deg, rgba(113,155,209,1) 0%, rgba(182,131,187,1) 22%, rgba(211,164,137,1) 41%, rgba(227,142,108,1) 67%, rgba(94,146,208,1) 98%)",
    animationStyle: "video",
    darkMode: false,
    hasMultipleSizes: true,
    category: ["🔥 Trending", "🐒 Fun"],
  },
  {
    name: "girlyMac",
    backgroundColor: "#DE70D6",
    themeColors: {
      gradient1: "#2138FF",
      gradient2: "#C00DFF",
      gradient3: "#00C2FF",
      gradient4: "#C4EAFF",
      gradient5: "#F2CDFF",
      link: "#053EAD",
      linkGradientCenter: "#7D18FF",
    },
    dimensions: {
      desktop: {
        width: 1440,
        height: 3354,
      },
      mobile: {
        width: 375,
        height: 1900,
      },
    },
    backgroundGradient:
      "linear-gradient(90deg, rgba(185,225,226,1) 0%, rgba(204,186,222,1) 22%, rgba(230,192,230,1) 41%, rgba(243,74,207,1) 67%, rgba(255,107,252,1) 98%)",
    animationStyle: "video",
    darkMode: false,
    hasMultipleSizes: true,
    category: ["🐒 Fun"],
  },
  {
    name: "lofiGrass",
    backgroundColor: "#93dc77",
    themeColors: {
      gradient1: "#D796FF",
      gradient2: "#75FF20",
      gradient3: "#FBFF27",
      gradient4: "#44DDFF",
      gradient5: "#29FF3F",
      link: "#00700B",
      linkGradientCenter: "#0BBC12",
    },
    dimensions: {
      desktop: {
        width: 1440,
        height: 3354,
      },
      mobile: {
        width: 375,
        height: 1900,
      },
    },
    backgroundGradient:
      "linear-gradient(90deg, rgba(137,214,120,1) 0%, rgba(158,227,127,1) 20%, rgba(191,255,128,1) 32%, rgba(147,220,119,1) 53%, rgba(137,214,120,1) 98%)",
    animationStyle: "video",
    darkMode: false,
    hasMultipleSizes: true,
    category: ["🐒 Fun"],
  },
  {
    name: "kaleidoscope",
    backgroundColor: "#FEDDDA",
    themeColors: {
      gradient1: "#CFFF48",
      gradient2: "#FFA6E1",
      gradient3: "#70F6FF",
      gradient4: "#74FFDE",
      gradient5: "#94FF52",
      link: "#00879A",
      linkGradientCenter: "#8DCEFD",
    },
    dimensions: {
      desktop: {
        width: 1440,
        height: 3354,
      },
      mobile: {
        width: 375,
        height: 1900,
      },
    },
    backgroundGradient:
      "linear-gradient(90deg, rgba(254,239,254,1) 0%, rgba(161,237,244,1) 29%, rgba(250,236,188,1) 53%, rgba(166,198,254,1) 78%, rgba(205,187,235,1) 98%)",
    animationStyle: "video",
    darkMode: false,
    hasMultipleSizes: true,
    category: ["🐒 Fun"],
  },
  {
    name: "shroomset",
    backgroundColor: "#F9800A",
    themeColors: {
      gradient1: "#ED1FFF",
      gradient2: "#FF3D8E",
      gradient3: "#9E00FF",
      gradient4: "#BFFFFB",
      gradient5: "#22FFD7",
      link: "#4900A7",
      linkGradientCenter: "#9D02D3",
    },
    dimensions: {
      desktop: {
        width: 1440,
        height: 3354,
      },
      mobile: {
        width: 375,
        height: 1900,
      },
    },
    backgroundGradient:
      "linear-gradient(90deg, rgba(240,97,2,1) 0%, rgba(217,103,193,1) 43%, rgba(96,226,195,1) 65%, rgba(217,139,180,1) 95%)",
    animationStyle: "video",
    darkMode: false,
    hasMultipleSizes: true,
    category: ["🐒 Fun"],
  },
  {
    name: "lavaRave",
    backgroundColor: "#1F0011",
    themeColors: {
      gradient1: "#FF5AC7",
      gradient2: "#1385EF",
      gradient3: "#7500FF",
      gradient4: "#07AFF7",
      gradient5: "#9912D8",
      link: "#C59BFF",
      linkGradientCenter: "#9D7CFF",
    },
    dimensions: {
      desktop: {
        width: 1440,
        height: 3354,
      },
      mobile: {
        width: 375,
        height: 1900,
      },
    },
    backgroundGradient:
      "linear-gradient(90deg, rgba(69,17,66,1) 0%, rgba(201,49,199,1) 43%, rgba(226,85,128,1) 100%)",
    animationStyle: "video",
    darkMode: true,
    hasMultipleSizes: true,
    category: ["🐒 Fun"],
  },
  {
    name: "darkSky",
    backgroundColor: "#172648",
    themeColors: {
      gradient1: "#000AFF",
      gradient2: "#3FDEFF",
      gradient3: "#3A92FF",
      gradient4: "#F5E197",
      gradient5: "#3A37EF",
      link: "#ABFFFB",
      linkGradientCenter: "#3ED1FF",
    },
    dimensions: {
      desktop: {
        width: 1440,
        height: 3354,
      },
      mobile: {
        width: 375,
        height: 1900,
      },
    },
    backgroundGradient:
      "linear-gradient(90deg, rgba(27,41,75,1) 0%, rgba(121,96,94,1) 50%, rgba(70,115,128,1) 100%)",
    animationStyle: "video",
    darkMode: true,
    hasMultipleSizes: true,
    category: ["🔥 Trending", "🐒 Fun", "🎁 Seasonal", "🌑 Dark"],
  },
  {
    name: "darkForest",
    backgroundColor: "#172648",
    themeColors: {
      gradient1: "#000AFF",
      gradient2: "#3FDEFF",
      gradient3: "#3A92FF",
      gradient4: "#F5E197",
      gradient5: "#3A37EF",
      link: "#ABFFFB",
      linkGradientCenter: "#3ED1FF",
    },
    dimensions: {
      desktop: {
        width: 1440,
        height: 3354,
      },
      mobile: {
        width: 375,
        height: 1900,
      },
    },
    backgroundGradient:
      "linear-gradient(90deg, rgba(27,41,75,1) 0%, rgba(121,96,94,1) 50%, rgba(70,115,128,1) 100%)",
    animationStyle: "video",
    darkMode: true,
    hasMultipleSizes: true,
    hidden: true,
  },
  {
    name: "crystal",
    backgroundColor: "#dceaf9",
    themeColors: {
      gradient1: "#A762FF",
      gradient2: "#AEDCFF",
      gradient3: "#64D5FF",
      gradient4: "#DFB7FF",
      gradient5: "#FDDFFA",
      link: "#0E42FA",
      linkGradientCenter: "#8C5ADD",
    },
    dimensions: {
      desktop: {
        width: 1440,
        height: 3354,
      },
      mobile: {
        width: 375,
        height: 1900,
      },
    },
    backgroundGradient:
      "linear-gradient(90deg, rgba(234,219,251,1) 0%, rgba(220,234,249,1) 35%, rgba(202,218,250,1) 63%, rgba(201,210,251,1) 100%)",
    animationStyle: "video",
    darkMode: false,
    hasMultipleSizes: true,
    category: ["🔥 Trending", "🐒 Fun"],
  },
  {
    name: "champagne",
    backgroundColor: "#e3d0a3",
    themeColors: {
      gradient1: "#FFC1D0",
      gradient2: "#FCD266",
      gradient3: "#FDDFFA",
      gradient4: "#FFF6A4",
      gradient5: "#EFFFAF",
      link: "#0A47A3",
      linkGradientCenter: "#B57700",
    },
    dimensions: {
      desktop: {
        width: 1440,
        height: 900,
      },
      mobile: {
        width: 375,
        height: 1900,
      },
    },
    backgroundGradient: "linear-gradient(0deg, rgba(147,128,102,1) 0%, rgba(243,235,216,1) 100%)",
    animationStyle: "video",
    darkMode: false,
    hasMultipleSizes: true,
    category: ["🌕 Minimal", "🐒 Fun"],
  },
  {
    name: "starburst",
    backgroundColor: "#d46758",
    themeColors: {
      gradient1: "#FF72C6",
      gradient2: "#C9FFAB",
      gradient3: "#74FCFF",
      gradient4: "#FF648C",
      gradient5: "#CCFFF5",
      link: "#3401FF",
      linkGradientCenter: "#5E43FF",
    },
    dimensions: {
      desktop: {
        width: 1440,
        height: 3354,
      },
      mobile: {
        width: 375,
        height: 1900,
      },
    },
    backgroundGradient:
      "linear-gradient(90deg, rgba(212,103,88,1) 0%, rgba(234,107,130,1) 11%, rgba(95, 207, 194, 1) 50%, rgba(208,212,165,1) 89%, rgba(168,219,150,1) 100%)",
    animationStyle: "video",
    darkMode: false,
    hasMultipleSizes: true,
    category: ["🐒 Fun"],
  },
  {
    name: "grass",
    backgroundColor: "#BDD49C",
    themeColors: {
      gradient1: "#8FFF86",
      gradient2: "#75D6F4",
      gradient3: "#20FF26",
      gradient4: "#FFFFC3",
      gradient5: "#B8FFE0",
      link: "#229ADD",
      linkGradientCenter: "#3D9D47",
    },
    dimensions: {
      desktop: {
        width: 1440,
        height: 3354,
      },
      mobile: {
        width: 375,
        height: 1900,
      },
    },
    backgroundGradient:
      "linear-gradient(to top left, rgb(160, 223, 186) 0%, 25%, rgb(212, 225, 201) 35%, 50%, rgb(195, 217, 157) 60%, 75%, rgb(160, 199, 124) 92%)",
    animationStyle: "normal",
    darkMode: false,
    category: ["🌕 Minimal"],
  },
  {
    name: "candy",
    backgroundColor: "#E9E9E9",
    themeColors: {
      gradient1: "#FF74E0",
      gradient2: "#94FFC9",
      gradient3: "#FDDFFA",
      gradient4: "#FFF6A4",
      gradient5: "#EFFFAF",
      link: "#02C697",
      linkGradientCenter: "#5AA879",
    },
    dimensions: {
      desktop: {
        width: 1440,
        height: 3354,
      },
      mobile: {
        width: 375,
        height: 1900,
      },
    },
    backgroundGradient:
      "radial-gradient(farthest-corner circle at 95% 100%, rgba(4,255,105) 0%, rgba(233,233,233) 50%, transparent),radial-gradient(farthest-corner circle at 100% 200%, rgba(233,233,233) 0%, rgba(233,233,233) 46%, transparent),radial-gradient(farthest-corner circle at 0px 0px, rgba(255,0,199) 0%, rgba(233,233,233) 50%, #E9E9E9)",
    animationStyle: "normal",
    darkMode: false,
    category: ["🔥 Trending", "🌕 Minimal", "🐒 Fun"],
  },
  {
    name: "aquatica",
    backgroundColor: "#0b2064",
    themeColors: {
      gradient1: "#9F65FF",
      gradient2: "#3FDEFF",
      gradient3: "#3A92FF",
      gradient4: "#639FFF",
      gradient5: "#3A37EF",
      link: "#93ECFF",
      linkGradientCenter: "#3FDEFF",
    },
    dimensions: {
      desktop: {
        width: 1440,
        height: 3354,
      },
      mobile: {
        width: 375,
        height: 1900,
      },
    },
    backgroundGradient:
      "linear-gradient(to right bottom, rgb(3, 3, 13) 40%, 55.4731%, rgb(12, 42, 114) 65.9463%, 80%, rgb(60, 111, 192) 100%)",
    animationStyle: "normal",
    darkMode: true,
    category: ["🌑 Dark"],
  },
  {
    name: "galaxy",
    backgroundColor: "#7f3730",
    themeColors: {
      gradient1: "#277FFB",
      gradient2: "#F2495B",
      gradient3: "#FF46AA",
      gradient4: "#29F5FF",
      gradient5: "#B92AF4",
      link: "#50F1CA",
      linkGradientCenter: "#FB8A96",
    },
    dimensions: {
      desktop: {
        width: 1440,
        height: 3354,
      },
      mobile: {
        width: 375,
        height: 1900,
      },
    },
    backgroundGradient:
      "linear-gradient(to right bottom, rgb(22, 38, 51) 27%, 38.2695%, rgb(72, 109, 118) 46.539%, 58.922%, rgb(140, 136, 135) 65.305%, 77.6525%, rgb(171, 88, 82) 100%)",
    animationStyle: "normal",
    darkMode: true,
    category: ["🔥 Trending", "🌑 Dark"],
  },
  {
    name: "midnight",
    backgroundColor: "#010019",
    themeColors: {
      gradient1: "#3F5CF3",
      gradient2: "#1B1BFF",
      gradient3: "#00BAFF",
      gradient4: "#00CDFF",
      gradient5: "#0000A3",
      link: "#3ADBFF",
      linkGradientCenter: "#8383FF",
    },
    dimensions: {
      desktop: {
        width: 1440,
        height: 1583,
      },
      mobile: {
        width: 375,
        height: 896,
      },
    },
    backgroundGradient:
      "linear-gradient(to right, rgb(26, 26, 90) 0%, 8%, rgb(1, 1, 35) 20% 80%, 92%, rgb(26, 25, 91) 100%)",
    animationStyle: "none",
    darkMode: true,
    category: ["🔥 Trending", "🌑 Dark"],
  },
  {
    name: "aquamarine",
    backgroundColor: "#84DBDE",
    themeColors: {
      gradient1: "#60FFFF",
      gradient2: "#928DFF",
      gradient3: "#4742FF",
      gradient4: "#8FEEFF",
      gradient5: "#ACFFF7",
      link: "#0A1AFF",
      linkGradientCenter: "#8B73CD",
    },
    dimensions: {
      desktop: {
        width: 1440,
        height: 3354,
      },
      mobile: {
        width: 375,
        height: 1900,
      },
    },
    backgroundGradient:
      "linear-gradient(to top right, rgb(127, 221, 221) 0%, 22%, rgb(192, 227, 227) 30%, 50%, rgb(134, 206, 223) 60%, 75%, rgb(105, 154, 235) 92%)",
    animationStyle: "normal",
    darkMode: false,
    category: ["🔥 Trending", "🌕 Minimal"],
  },
  {
    name: "ink",
    backgroundColor: "#000000",
    themeColors: {
      gradient1: "#45338F",
      gradient2: "#B50BF0",
      gradient3: "#F556A3",
      gradient4: "#007EF2",
      gradient5: "#424242",
      link: "#C1ABFF",
      linkGradientCenter: "#8F7DFF",
    },
    dimensions: {
      desktop: {
        width: 1440,
        height: 3354,
      },
      mobile: {
        width: 375,
        height: 1900,
      },
    },
    backgroundGradient:
      "linear-gradient(to top right, rgb(0, 0, 0) 0%, 15%, rgb(27, 27, 27) 27%, 50%, rgb(72, 72, 72) 58%, 63%, rgb(79, 79, 79) 70%, 85%, rgb(0, 0, 0) 95%)",
    animationStyle: "video",
    darkMode: true,
    category: ["🌑 Dark"],
  },
  {
    name: "blacklight",
    backgroundColor: "#000000",
    themeColors: {
      gradient1: "#FF009F",
      gradient2: "#25D8CF",
      gradient3: "#2BEDAD",
      gradient4: "#00BAFF",
      gradient5: "#5835EA",
      link: "#ABFFFB",
      linkGradientCenter: "#73F5EE",
    },
    dimensions: {
      desktop: {
        width: 1440,
        height: 3354,
      },
      mobile: {
        width: 375,
        height: 1900,
      },
    },
    backgroundGradient:
      "radial-gradient(farthest-corner circle at 95% 100%, rgba(0,255,240) 0%, rgba(0,0,0) 50%, transparent),radial-gradient(farthest-corner circle at 100% 200%, rgba(0,0,0) 0%, rgba(0,0,0) 46%, transparent), radial-gradient(farthest-corner circle at 0px 0px, rgba(237,24,255) 0%, rgba(0,0,0) 50%, #000000)",
    animationStyle: "normal",
    animationDurationSeconds: 17,
    darkMode: true,
    category: ["🌑 Dark"],
  },
  {
    name: "daybreak",
    backgroundColor: "#e8dee5",
    themeColors: {
      gradient1: "#FF7CFF",
      gradient2: "#A6D2FF",
      gradient3: "#C9A8FF",
      gradient4: "#E7FFE1",
      gradient5: "#FDDFFA",
      link: "#D24EA5",
      linkGradientCenter: "#BA75FF",
    },
    dimensions: {
      desktop: {
        width: 1440,
        height: 3354,
      },
      mobile: {
        width: 375,
        height: 1900,
      },
    },
    backgroundGradient: "linear-gradient(139deg, rgb(221, 228, 234) 0%, rgb(239, 218, 213) 100%)",
    animationStyle: "normal",
    darkMode: false,
    category: ["🌕 Minimal"],
  },
  {
    name: "twilight",
    backgroundColor: "#3d2c53",
    themeColors: {
      gradient1: "#25CBFF",
      gradient2: "#B73FFC",
      gradient3: "#5238CD",
      gradient4: "#EB14D4",
      gradient5: "#9E00FF",
      link: "#57FFE1",
      linkGradientCenter: "#D181FF",
    },
    dimensions: {
      desktop: {
        width: 1440,
        height: 3354,
      },
      mobile: {
        width: 375,
        height: 1900,
      },
    },
    backgroundGradient:
      "linear-gradient(to bottom, rgb(86, 35, 86) 0%, rgb(35, 51, 73) 66%, rgb(30, 32, 83) 100%)",
    animationStyle: "normal",
    darkMode: true,
    category: ["🌑 Dark"],
  },
  {
    name: "aurora",
    backgroundColor: "#314c77",
    themeColors: {
      gradient1: "#3D1DFF",
      gradient2: "#79FF9B",
      gradient3: "#2BEA60",
      gradient4: "#40FFD9",
      gradient5: "#00C5E0",
      link: "#1BFF9F",
      linkGradientCenter: "#03EF8C",
    },
    dimensions: {
      desktop: {
        width: 1440,
        height: 3354,
      },
      mobile: {
        width: 375,
        height: 1900,
      },
    },
    backgroundGradient:
      "linear-gradient(to right bottom, rgb(49, 76, 119) 0%, 36%, rgb(67, 131, 133) 42%, 52%, rgb(121, 188, 135) 60%, 75%, rgb(130, 73, 128) 89%)",
    animationStyle: "normal",
    darkMode: true,
    category: ["🔥 Trending", "🌑 Dark"],
  },
  {
    name: "pool",
    backgroundColor: "#C9E7EE",
    themeColors: {
      gradient1: "#B5A3FF",
      gradient2: "#89F6FF",
      gradient3: "#64D5FF",
      gradient4: "#B8FCFF",
      gradient5: "#FEFFDE",
      link: "#3959FF",
      linkGradientCenter: "#19B0BA",
    },
    dimensions: {
      desktop: {
        width: 1440,
        height: 3354,
      },
      mobile: {
        width: 375,
        height: 1900,
      },
    },
    backgroundGradient:
      "linear-gradient(to top right, rgb(188, 223, 230) 0%, 15%, rgb(177, 210, 229) 27%, 50%, rgb(215, 237, 245) 58%, 63%, rgb(212, 237, 247) 70%, 85%, rgb(195, 225, 231) 95%)",
    animationStyle: "video",
    darkMode: false,
    category: ["🎁 Seasonal", "🐒 Fun"],
  },
  {
    name: "bokeh",
    backgroundColor: "#D1D8D9",
    themeColors: {
      gradient1: "#8FFF86",
      gradient2: "#01FFFA",
      gradient3: "#E5E066",
      gradient4: "#FFFFE2",
      gradient5: "#B8FFE0",
      link: "#C133D8",
      linkGradientCenter: "#B678F4",
    },
    dimensions: {
      desktop: {
        width: 1440,
        height: 3354,
      },
      mobile: {
        width: 375,
        height: 1900,
      },
    },
    backgroundGradient:
      "linear-gradient(to top right, rgb(186, 191, 196) 0%, 15%, rgb(236, 207, 159) 27%, 50%, rgb(195, 217, 157) 58%, 63%, rgb(199, 203, 224) 70%, 85%, rgb(186, 191, 196) 95%)",
    animationStyle: "normal",
    darkMode: false,
    category: ["🔥 Trending", "🌕 Minimal"],
  },
  {
    name: "bubblegum",
    backgroundColor: "#e3cde7",
    themeColors: {
      gradient1: "#FF7CFF",
      gradient2: "#F8DAFF",
      gradient3: "#DCCBFF",
      gradient4: "#E8B6E5",
      gradient5: "#FF84F3",
      link: "#9F28FD",
      linkGradientCenter: "#C173CD",
    },
    dimensions: {
      desktop: {
        width: 1440,
        height: 3354,
      },
      mobile: {
        width: 375,
        height: 1900,
      },
    },
    backgroundGradient:
      "linear-gradient(90deg, rgba(232,155,224,1) 0%, rgba(232,180,225,1) 11%, rgba(232,222,237,1) 50%, rgba(232,180,225,1) 89%, rgba(221,162,221,1) 100%)",
    animationStyle: "none",
    darkMode: false,
    category: ["🌕 Minimal", "🐒 Fun"],
  },
  {
    name: "forest",
    backgroundColor: "#18351e",
    themeColors: {
      gradient1: "#F54459",
      gradient2: "#06A367",
      gradient3: "#11C964",
      gradient4: "#088466",
      gradient5: "#8085F3",
      link: "#E6F8C1",
      linkGradientCenter: "#E1F762",
    },
    dimensions: {
      desktop: {
        width: 1440,
        height: 3354,
      },
      mobile: {
        width: 375,
        height: 1900,
      },
    },
    backgroundGradient:
      "linear-gradient(0deg, rgba(2,0,36,1) 0%, rgba(16,33,21,1) 0%, rgba(61,132,73,1) 38%, rgba(32,69,43,1) 100%)",
    animationStyle: "normal",
    darkMode: true,
    category: ["🌑 Dark"],
  },
  {
    name: "sunrise",
    backgroundColor: "#ece1cc",
    themeColors: {
      gradient1: "#FFA3DC",
      gradient2: "#FFDD8C",
      gradient3: "#FFF59B",
      gradient4: "#FFB8AD",
      gradient5: "#AFEE9E",
      link: "#527A29",
      linkGradientCenter: "#9E9266",
    },
    dimensions: {
      desktop: {
        width: 1440,
        height: 3354,
      },
      mobile: {
        width: 375,
        height: 1900,
      },
    },
    backgroundGradient:
      "linear-gradient(155deg, rgb(240, 212, 209) 0%, rgb(240, 226, 200) 28%, rgb(233, 236, 192) 44%, rgb(231, 231, 205) 70%, rgb(182, 207, 246) 100%)",
    animationStyle: "normal",
    darkMode: false,
    category: ["🌕 Minimal"],
  },
  {
    name: "midday",
    backgroundColor: "#ece8d3",
    themeColors: {
      gradient1: "#FFA3DC",
      gradient2: "#FFDD8C",
      gradient3: "#C6EBFF",
      gradient4: "#FFE1CA",
      gradient5: "#CEFFFC",
      link: "#2987F5",
      linkGradientCenter: "#FF8DDF",
    },
    dimensions: {
      desktop: {
        width: 1440,
        height: 3354,
      },
      mobile: {
        width: 375,
        height: 1900,
      },
    },
    backgroundGradient:
      "linear-gradient(340deg, rgb(223, 232, 241) 0%, rgb(230, 232, 233) 27%, rgb(236, 232, 225) 44%, rgb(229, 239, 215) 100%)",
    animationStyle: "normal",
    darkMode: false,
    category: ["🌕 Minimal"],
  },
  {
    name: "sunset",
    backgroundColor: "#E9AB99",
    themeColors: {
      gradient1: "#FF83D1",
      gradient2: "#DACAFF",
      gradient3: "#FF8276",
      gradient4: "#9658D4",
      gradient5: "#FFC36C",
      link: "#7414A1",
      linkGradientCenter: "#A419D5",
    },
    dimensions: {
      desktop: {
        width: 1440,
        height: 3354,
      },
      mobile: {
        width: 375,
        height: 1900,
      },
    },
    backgroundGradient:
      "linear-gradient(210deg, rgb(245, 224, 159) 6%, rgb(239, 198, 163) 28%, rgb(236, 182, 167) 55%, rgb(194, 136, 177) 79%, rgb(144, 90, 210) 100%)",
    animationStyle: "normal",
    darkMode: false,
    category: ["🌕 Minimal"],
  },
];
