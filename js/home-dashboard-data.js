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
      // Unlocks Cards 1, 2, 3, and 4. Only Cards 5 and 6 remain "Coming Soon".
      launched: [true, true, true, true, false, false],
      links: [
        "bedtime-story-1.html",  // Routes Card 1
        "bedtime-story-2.html",  // Routes Card 2
        "bedtime-story-3.html",  // Routes Card 3
        "bedtime-story-4.html"   // Routes Card 4
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
      posterPrefix: "assets/images/dashboard/bonus", 
      posterSuffix: ".jpg",                           
      launched: false,
      collapsible: false, // Set to false so it displays directly by default
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
      collapsible: true, // Only Shop remains collapsed under the "Go Shop" toggle
    },
  ],
};
