/** One card on the projects page. */
export interface Project {
  name: string;
  /** Shown on the link and prefixed with https:// to open it; absent until it is live. */
  domain?: string;
  /** The source repository, when it is public. */
  repo?: string;
  year?: string;
  /** A short badge beside the name, such as «در حال توسعه». */
  status?: string;
  description: readonly string[];
  // A screenshot pair per theme in public/images/projects/, or a post drawn in code
  // where a screenshot is not possible (Telegram pages render without a Persian font).
  preview?: { type: 'screenshot'; light: string; dark: string } | { type: 'telegram-post' };
}

const projects: readonly Project[] = [
  {
    name: 'کراکن استور',
    domain: 'krakenstore.ir',
    year: '۱۴۰۰',
    description: [
      'کراکن استور یه فروشگاه آنلاینه برای خرید گیفت کارت پلتفرم‌های مختلف مثل پلی‌استیشن و ایکس‌باکس، و آیتم‌های استیم مثل کلید تیم فورترس ۲. قیمت‌ها هم بر اساس نرخ لحظه‌ای دلار حساب می‌شن.',
      'تمرکزم این بود که مسیر خرید تا جای ممکن کوتاه باشه. یه بار ثبت‌نام و احراز هویت می‌کنی، محصول رو میندازی توی باکس سفارش و با چند قدم ساده پرداخت می‌کنی. رابط کاربری کامل راست‌به‌چپه، تم روشن و تیره داره و روی موبایل هم به همون راحتی دسکتاپ کار می‌کنه، تا خرید از هر جایی بی‌دردسر باشه.',
    ],
    preview: {
      type: 'screenshot',
      light: '/images/projects/krakenstore-light.jpg',
      dark: '/images/projects/krakenstore-dark.jpg',
    },
  },
  {
    name: 'پلتفرم کات',
    status: 'در حال توسعه',
    description: [
      'یه پلتفرم برای رزرو آنلاین نوبت سالن‌های آرایش. مشتری خدمت و آرایشگر دلخواهش رو انتخاب می‌کنه، از بین ساعت‌های خالی نوبت می‌گیره و همون‌جا پرداخت می‌کنه. تقویمش شمسیه و بعد از هر نوبت می‌شه نظر و امتیاز ثبت کرد.',
      'کنار سایت مشتری یه داشبورد مدیریت هم داره که باهاش خدمات، برنامه کاری و مرخصی پرسنل، تعطیلی‌ها و کدهای تخفیف تعریف می‌شن.',
    ],
  },
  {
    name: 'تتر واچ',
    domain: 't.me/TetherWatch',
    repo: 'https://github.com/amirhosseinkhorshidi/tether-watch',
    description: [
      'یه ربات و کانال تلگرامی که هر پونزده دقیقه قیمت لحظه‌ای تتر رو از صرافی‌های معتبر ایرانی می‌گیره و منتشر می‌کنه، همراه با بالاترین و پایین‌ترین قیمت روز و درصد تغییرات.',
      'همه چیز خودکاره و بدون دخالت دستی، قیمت‌ها توی یه پیام کوتاه و خوانا به دست دنبال‌کننده‌ها می‌رسه.',
    ],
    preview: { type: 'telegram-post' },
  },
];

/** Site-wide content in one place, so pages never hard-code the owner's details. */
export const site = {
  /** The live origin, for canonical links, the sitemap and structured data. */
  url: 'https://khorshidi.dev',
  name: 'امیرحسین خورشیدی',
  /** The name in Latin script, so searches written in English find the site too. */
  latinName: 'Amirhossein Khorshidi',
  title: 'امیرحسین خورشیدی | درباره من و پروژه‌هام',
  description:
    'امیرحسین خورشیدی، توسعه‌دهنده فرانت‌اند با React و TypeScript. اینجا از خودم و پروژه‌هام می‌نویسم.',
  githubUsername: 'amirhosseinkhorshidi',
  role: 'توسعه‌دهنده فرانت‌اند',
  bio: [
    'سلام، من امیرحسینم. بیشتر وقتم رو می‌ذارم روی ساختن رابط‌هایی که ساده و روون باشن و کار کردن باهاشون حس خوبی بده. جزئیات کوچیک برام خیلی مهمن، چون به نظرم همین چیزای ریزن که آخرش یه تجربه خوب می‌سازن.',
    'با React و TypeScript کار می‌کنم و پروژه‌هام رو بیشتر با Next.js و Vite می‌سازم. به دیزاین سیستم و دسترس‌پذیری علاقه دارم و از کار با ابزارایی مثل shadcn/ui و Tailwind خیلی لذت می‌برم، چون باهاشون می‌شه بی‌دردسر رابط‌هایی ساخت که هم خوش‌ظاهرن، هم راحت شخصی‌سازی می‌شن.',
    'کنار اینا به بلاکچین هم علاقه دارم. به نظرم یه قدم بزرگه برای رها شدن از سیستم‌های مالی سنتی و پول فیات، جایی که آدم‌ها بدون واسطه خودشون مالک دارایی‌شون باشن و هیچ سیستمی دست یه نفر یا یه سازمان خاص نباشه.',
    'بیشتر از همه اکوسیستم اتریوم و راه‌حل‌های مقیاس‌پذیریش برام جذابه، مثل Polygon، Arbitrum و Optimism که هر کدوم یه جور سعی می‌کنن مشکل سرعت و کارمزد اتریوم رو حل کنن. BSC هم برام جالبه و کلا دوست دارم شبکه‌های مختلف رو بیشتر بشناسم و بفهمم پشتشون چی می‌گذره.',
    'اینجا هم قراره پروژه‌هام و چیزایی که توی این مسیر یاد می‌گیرم رو جمع کنم و با بقیه به اشتراک بذارم.',
  ],
  socials: {
    telegram: 'https://t.me/ajayChe',
    instagram: 'https://instagram.com/amirhossein.khorshidi',
    github: 'https://github.com/amirhosseinkhorshidi',
  },
  projects,
} as const;
