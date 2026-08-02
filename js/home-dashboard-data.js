/* =========================================================
   home-dashboard-data.js — Only Math (Selected Ages), Bedtime,
   Shop, and Bonus. Shop and Bonus are collapsible.
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
      links: ["twoyears.html"],
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
