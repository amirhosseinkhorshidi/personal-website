import {
  Banknote,
  ChartColumn,
  Clock,
  Eye,
  type LucideIcon,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';

interface Row {
  icon: LucideIcon;
  label: string;
  value: string;
}

// A sample post in the channel's own format; the figures are illustrative.
const rows: Row[] = [
  { icon: TrendingUp, label: 'بالاترین قیمت', value: '۲۳۴٬۹۹۶ تومان' },
  { icon: TrendingDown, label: 'پایین‌ترین قیمت', value: '۲۳۱٬۶۱۵ تومان' },
  { icon: ChartColumn, label: 'تغییرات امروز', value: '۱٫۱۴٪ کاهشی' },
];

/** A TetherWatch post drawn with the site's font and colours, standing in for a screenshot. */
export function TelegramPostPreview() {
  return (
    <div className="flex size-full items-end justify-center gap-2 p-5 sm:p-8">
      <span
        aria-hidden="true"
        className="grid size-9 shrink-0 place-items-center rounded-full bg-primary font-bold text-primary-foreground"
      >
        ₮
      </span>

      <div className="flex w-full max-w-72 flex-col gap-3 rounded-2xl rounded-es-sm border border-border/60 bg-card p-4 text-xs">
        <p className="font-semibold text-primary">Tether Watch</p>

        <p className="flex items-center gap-2 font-semibold text-sm">
          <Banknote className="size-4 text-primary" />
          قیمت تتر: ۲۳۲٬۱۰۵ تومان
        </p>

        <ul className="flex flex-col gap-1.5 text-foreground/80">
          {rows.map((row) => (
            <li key={row.label} className="flex items-center gap-2">
              <row.icon className="size-3.5 text-muted-foreground" />
              {row.label}: {row.value}
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Clock className="size-3.5" />
            آخرین به‌روزرسانی: ۱۷:۱۵
          </span>
          <span className="flex items-center gap-1">
            <Eye className="size-3.5" />
            ۲۸
          </span>
        </div>
      </div>
    </div>
  );
}
