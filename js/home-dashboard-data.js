/* =========================================================
   home-dashboard-data.js — defines every category row and its
   items. Add/remove items here only — nothing else needs to
   change. Each item's media file just needs to exist at the
   given path; if it's missing, the card simply shows a plain
   placeholder background instead of breaking anything.
   
   Tabs generated FROM this category list:
   Selected Ages, Bedtime Story, Shop, Bonus
   
   "launched": true  → hovering a card shows a "Masuk Kelas"
                        button (the class is actually available).
   "launched": false → hovering shows "Very Soon Launching"
                        instead — use this for anything not
                        ready yet.
   "collapsible": true → Category goes in the dropdown
   "collapsible": false or omitted → Category shows directly
   ========================================================= */
const SmartKiddoDashboardData = {
  categories: [
    {
      id: "math",
      title: "Selected Ages",
      tabLabel: "Selected Ages",
      itemType: "video",
      itemCount: 6,
      filePrefix: "assets/videos/dashboard/m",
      fileSuffix: "v.mp4",
      launched: true,
      ageLabels: ["2 tahun", "3 tahun", "4 tahun", "5 tahun", "6 tahun", "6 tahun"],
      links: ["twoyears.html", "3years.html", "4years.html", "5years.html"],
      collapsible: false,
    },
    {
      id: "bedtime",
      title: "Bedtime Story / Cerita Dodoi",
      tabLabel: "Bedtime Story",
      itemType: "video",
      itemCount: 6,
      filePrefix: "assets/videos/dashboard/bt",
      fileSuffix: "v.mp4",
      posterSuffix: ".jpg",
      // Item-level launch status: Items 1 and 2 are active, 3-6 remain "Coming Soon"
      launched: [true, true, false, false, false, false],
      links: [
        "bedtime-story-1.html",   // Destination link for Card 1
        "bedtime-story-2.html",   // Destination link for Card 2
        "bedtime-story-3.html"    // Destination link for Card 3
      ],
      collapsible: false,
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
      collapsible: true,
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
      collapsible: true,
    },
  ],
};
