import p1 from '../assets/p1.jpg';
import p2 from '../assets/p2.jpg';

export const invitationConfig = {
  // Primary Couple details (Basmala Hany & Ali Adel)
  couple: {
    groom: "Ali Adel",
    groomAr: "Ali Adel",
    groomTitle: "العريس",
    bride: "Basmala Hany",
    brideAr: "Basmala Hany",
    brideTitle: "العروس",
    coverGroom: "Basmala Hany",
    coverBride: "Ali Adel",
    primary: "Ali & Basmala",
    primaryEn: "Ali & Basmala",
    initials: "A & B",
    monogram: "A B",
    ceremonyHeader: "تفاصيل الحفل",
    announcementLine1: "ببالغ الفرح والسرور نتشرف بدعوتكم",
    announcementLine2: "لحضور حفل زفاف",
    quote: "بارك الله لهما وبارك عليهما وجمع بينهما في خير",
  },

  // Date & Time
  eventDate: {
    display: "الأربعاء 25 نوفمبر 2026",
    displayEn: "Wednesday, November 25, 2026",
    dayOfWeek: "الأربعاء",
    dayNumber: "25",
    monthName: "نوفمبر",
    year: "2026",
    time: "الساعة 6:00 مساءً",
    targetIso: "2026-11-25T18:00:00",
    monthIndex: 10, // 0-based: November = 10
    highlightDay: 25,
  },

  // Venue details (قاعة بيلا روز - العباسية)
  venue: {
    name: "قاعة بيلا روز",
    subtitle: "العباسية / حديقة الأندلسية بجوار وزارة المالية",
    address: "العباسية / حديقة الأندلسية بجوار وزارة المالية",
    city: "العباسية، القاهرة",
    googleMapsLink: "https://maps.app.goo.gl/Adi8LjXFhmeN3ebB8",
    mapEmbedUrl: "https://maps.google.com/maps?q=%D9%82%D8%A7%D8%B9%D8%A9+%D8%A8%D9%8A%D9%84%D8%A7+%D8%B1%D9%88%D8%B2+%D8%A7%D9%84%D8%B9%D8%A8%D8%A7%D8%B3%D9%8A%D8%A9+%D8%AD%D8%AF%D9%8A%D9%82%D8%A9+%D8%A7%D9%84%D8%A3%D9%86%D8%AF%D9%84%D8%B3%D9%8A%D8%A9&hl=ar&z=15&output=embed",
  },

  // Photos
  gallery: [
    {
      id: 1,
      role: "العريس",
      src: p1,
      title: "علي عادل",
    },
    {
      id: 2,
      role: "العروس",
      src: p2,
      title: "بسملة هاني",
    },
  ],

  // Initial guestbook wishes
  initialWishes: [
    {
      id: "w-1",
      name: "الأهل والأصدقاء",
      wishes: "ألف مبروك لأجمل عروسين! بارك الله لكما وجمع بينكما في خير وسعادة دائمة.",
      timestamp: "اليوم",
      likes: 14,
    },
    {
      id: "w-2",
      name: "الأصحاب",
      wishes: "مبروك يا علي وبسملة! ربنا يتمملكم بألف خير ويسعد أيامكم.",
      timestamp: "اليوم",
      likes: 9,
    },
  ],
};
