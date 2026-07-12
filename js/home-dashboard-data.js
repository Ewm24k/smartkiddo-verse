/* =========================================================
   home-dashboard-data.js — defines every category row and its
   items. Add/remove items here only — nothing else needs to
   change. Each item's media file just needs to exist at the
   given path; if it's missing, the card simply shows a plain
   placeholder background instead of breaking anything.

   "launched": true  → hovering a card shows a "Masuk Kelas"
                        button (the class is actually available).
   "launched": false → hovering shows "Very Soon Launching"
                        instead — use this for anything not
                        ready yet. Only flip it to true once
                        that category's content is real.

   "ageLabels": optional array of per-card age text shown above
   the "Masuk Kelas" button (Math only, for now).
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
      tabs: ["all", "math", "age-2-3", "age-4-5", "age-6", "age-7"],
      itemType: "video",
      itemCount: 6,
      filePrefix: "assets/videos/dashboard/m",
      fileSuffix: "v.mp4",
      launched: true,
      ageLabels: ["2 tahun", "3 tahun", "4 tahun", "5 tahun", "6 tahun", "6 tahun"],
    },
    {
      id: "bm",
      title: "Bahasa Melayu",
      tabs: ["all", "age-2-3", "age-4-5", "age-6", "age-7"],
      itemType: "video",
      itemCount: 6,
      filePrefix: "assets/videos/dashboard/bm",
      fileSuffix: "v.mp4",
      launched: false,
    },
    {
      id: "bi",
      title: "Bahasa Inggeris",
      tabs: ["all", "age-2-3", "age-4-5", "age-6", "age-7"],
      itemType: "video",
      itemCount: 6,
      filePrefix: "assets/videos/dashboard/bi",
      fileSuffix: "v.mp4",
      launched: false,
    },
    {
      id: "ba",
      title: "Bahasa Arab",
      tabs: ["all", "age-4-5", "age-6", "age-7"],
      itemType: "video",
      itemCount: 6,
      filePrefix: "assets/videos/dashboard/ba",
      fileSuffix: "v.mp4",
      launched: false,
    },
    {
      id: "bc",
      title: "Bahasa Mandarin",
      tabs: ["all", "age-4-5", "age-6", "age-7"],
      itemType: "video",
      itemCount: 6,
      filePrefix: "assets/videos/dashboard/bc",
      fileSuffix: "v.mp4",
      launched: false,
    },
    {
      id: "bonus",
      title: "Bonus",
      tabs: ["all", "age-2-3", "age-4-5", "age-6", "age-7"],
      itemType: "video",
      itemCount: 6,
      filePrefix: "assets/videos/dashboard/bo",
      fileSuffix: "v.mp4",
      launched: false,
    },
    {
      id: "videos",
      title: "Videos",
      tabs: ["all", "age-2-3", "age-4-5", "age-6", "age-7"],
      itemType: "video",
      itemCount: 6,
      filePrefix: "assets/videos/dashboard/vd",
      fileSuffix: "v.mp4",
      launched: false,
    },
    {
      id: "shop",
      title: "Shop",
      tabs: ["all", "shop"],
      itemType: "image",
      itemCount: 6,
      filePrefix: "assets/images/dashboard/sp",
      fileSuffix: ".jpg",
      launched: false,
    },
  ],
};
