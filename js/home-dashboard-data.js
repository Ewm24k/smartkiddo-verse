/* =========================================================
   home-dashboard-data.js — defines every category row and its
   items. Add/remove items here only — nothing else needs to
   change. Each item's media file just needs to exist at the
   given path; if it's missing, the card simply shows a plain
   placeholder background instead of breaking anything.
   ========================================================= */

const SmartKiddoDashboardData = {
  // Filter tabs shown above the rows. "tabs" on each category below
  // must include a tab's id for that category to appear under it.
  tabs: [
    { id: "all", label: "All" },
    { id: "math", label: "Math" },
    { id: "age-2-3", label: "2-3 years old" },
    { id: "age-4-5", label: "4-5 years old" },
    { id: "age-6", label: "6 years old" },
    { id: "age-7", label: "7 years old" },
    { id: "shop", label: "Shop" },
  ],

  categories: [
    {
      id: "math",
      title: "Math / Matematik",
      tabs: ["all", "math", "age-4-5", "age-6", "age-7"],
      itemType: "video",
      itemCount: 6,
      filePrefix: "assets/videos/dashboard/m",
      fileSuffix: "v.mp4",
    },
    {
      id: "bm",
      title: "Bahasa Melayu",
      tabs: ["all", "age-2-3", "age-4-5", "age-6", "age-7"],
      itemType: "video",
      itemCount: 6,
      filePrefix: "assets/videos/dashboard/bm",
      fileSuffix: "v.mp4",
    },
    {
      id: "bi",
      title: "Bahasa Inggeris",
      tabs: ["all", "age-2-3", "age-4-5", "age-6", "age-7"],
      itemType: "video",
      itemCount: 6,
      filePrefix: "assets/videos/dashboard/bi",
      fileSuffix: "v.mp4",
    },
    {
      id: "ba",
      title: "Bahasa Arab",
      tabs: ["all", "age-4-5", "age-6", "age-7"],
      itemType: "video",
      itemCount: 6,
      filePrefix: "assets/videos/dashboard/ba",
      fileSuffix: "v.mp4",
    },
    {
      id: "bc",
      title: "Bahasa Mandarin",
      tabs: ["all", "age-4-5", "age-6", "age-7"],
      itemType: "video",
      itemCount: 6,
      filePrefix: "assets/videos/dashboard/bc",
      fileSuffix: "v.mp4",
    },
    {
      id: "bonus",
      title: "Bonus",
      tabs: ["all", "age-2-3", "age-4-5", "age-6", "age-7"],
      itemType: "video",
      itemCount: 6,
      filePrefix: "assets/videos/dashboard/bo",
      fileSuffix: "v.mp4",
    },
    {
      id: "videos",
      title: "Videos",
      tabs: ["all", "age-2-3", "age-4-5", "age-6", "age-7"],
      itemType: "video",
      itemCount: 6,
      filePrefix: "assets/videos/dashboard/vd",
      fileSuffix: "v.mp4",
    },
    {
      id: "shop",
      title: "Shop",
      tabs: ["all", "shop"],
      itemType: "image",
      itemCount: 6,
      filePrefix: "assets/images/dashboard/sp",
      fileSuffix: ".jpg",
    },
  ],
};
