/* =========================================================
   home-dashboard-data.js — defines every category row and its
   items. Add/remove items here only — nothing else needs to
   change. Each item's media file just needs to exist at the
   given path; if it's missing, the card simply shows a plain
   placeholder background instead of breaking anything.

   Tabs are generated directly FROM this category list (each
   category is its own tab, "All" is added automatically) — so
   there's no separate tabs list to keep in sync anymore.

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
  categories: [
    {
      id: "math",
      title: "Math / Matematik",
      tabLabel: "Math",
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
      tabLabel: "BM",
      itemType: "video",
      itemCount: 6,
      filePrefix: "assets/videos/dashboard/bm",
      fileSuffix: "v.mp4",
      launched: false,
    },
    {
      id: "bi",
      title: "Bahasa Inggeris",
      tabLabel: "BI",
      itemType: "video",
      itemCount: 6,
      filePrefix: "assets/videos/dashboard/bi",
      fileSuffix: "v.mp4",
      launched: false,
    },
    {
      id: "ba",
      title: "Bahasa Arab",
      tabLabel: "BA",
      itemType: "video",
      itemCount: 6,
      filePrefix: "assets/videos/dashboard/ba",
      fileSuffix: "v.mp4",
      launched: false,
    },
    {
      id: "bc",
      title: "Bahasa Mandarin",
      tabLabel: "BC",
      itemType: "video",
      itemCount: 6,
      filePrefix: "assets/videos/dashboard/bc",
      fileSuffix: "v.mp4",
      launched: false,
    },
    {
      id: "bonus",
      title: "Bonus",
      tabLabel: "Bonus",
      itemType: "video",
      itemCount: 6,
      filePrefix: "assets/videos/dashboard/bo",
      fileSuffix: "v.mp4",
      launched: false,
    },
    {
      id: "videos",
      title: "Videos",
      tabLabel: "Videos",
      itemType: "video",
      itemCount: 6,
      filePrefix: "assets/videos/dashboard/vd",
      fileSuffix: "v.mp4",
      launched: false,
    },
    {
      id: "bedtime",
      title: "Bedtime Story / Cerita Dodoi",
      tabLabel: "Bedtime Story",
      itemType: "video",
      itemCount: 6,
      filePrefix: "assets/videos/dashboard/bt",
      fileSuffix: "v.mp4",
      launched: false,
    },
    {
      id: "shop",
      title: "Shop",
      tabLabel: "Shop",
      itemType: "image",
      itemCount: 6,
      filePrefix: "assets/images/dashboard/sp",
      fileSuffix: ".jpg",
      launched: false,
    },
  ],
};
