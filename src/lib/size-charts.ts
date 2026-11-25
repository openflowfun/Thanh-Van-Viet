export type SizeChartKey = "women" | "girls" | "boys" | "family" | "slippers";

export type SizeRow = {
  size: string;
  weight?: string;
  au?: string;
  bust?: string;
  waist?: string;
  hip?: string;
  height?: string;
  foot?: string;
};

export type SizeChart = {
  key: Exclude<SizeChartKey, "family">;
  title: string;
  note: string;
  columns: { key: keyof SizeRow; label: string }[];
  rows: SizeRow[];
};

const bodyCols: SizeChart["columns"] = [
  { key: "size", label: "Size" },
  { key: "bust", label: "Bust" },
  { key: "waist", label: "Waist" },
  { key: "hip", label: "Hip" },
  { key: "height", label: "Height" },
];

export const SIZE_CHARTS: Record<SizeChart["key"], SizeChart> = {
  women: {
    key: "women",
    title: "Women’s áo dài",
    note:
      "From the Thanh Van Viet size chart. These áo dài are made to Vietnamese sizing and run smaller than Australian sizes — please check bust and waist in cm before ordering. Between sizes? Choose the larger, or email us.",
    columns: [
      { key: "size", label: "Size" },
      { key: "weight", label: "Weight" },
      { key: "bust", label: "Bust" },
      { key: "waist", label: "Waist" },
    ],
    rows: [
      { size: "S", weight: "40–46", bust: "82–84", waist: "66–68" },
      { size: "M", weight: "47–52", bust: "86–88", waist: "70–72" },
      { size: "L", weight: "53–58", bust: "90–92", waist: "72–76" },
      { size: "XL", weight: "59–62", bust: "94–96", waist: "78–80" },
      { size: "XXL", weight: "63–67", bust: "98–100", waist: "82–84" },
      { size: "3XL", weight: "68–72", bust: "100–104", waist: "86–88" },
      { size: "4XL", weight: "72–76", bust: "106–108", waist: "90–92" },
    ],
  },
  girls: {
    key: "girls",
    title: "Girls’ áo dài",
    note:
      "Children’s áo dài are sized by height first. For a growing child, size up — the hem can be taken up and let down later.",
    columns: bodyCols,
    rows: [
      { size: "2", bust: "52", waist: "50", hip: "54", height: "88–98" },
      { size: "4", bust: "56", waist: "52", hip: "58", height: "99–110" },
      { size: "6", bust: "60", waist: "55", hip: "62", height: "111–122" },
      { size: "8", bust: "66", waist: "58", hip: "68", height: "123–134" },
      { size: "10", bust: "72", waist: "61", hip: "74", height: "135–146" },
      { size: "12", bust: "78", waist: "63", hip: "80", height: "147–155" },
    ],
  },
  boys: {
    key: "boys",
    title: "Boys’ áo dài",
    note:
      "Boys’ sets are cut with a straighter body and more room across the chest. Khăn đóng (headpiece) circumference is listed on each product.",
    columns: [
      { key: "size", label: "Size" },
      { key: "bust", label: "Chest" },
      { key: "waist", label: "Waist" },
      { key: "hip", label: "Hip" },
      { key: "height", label: "Height" },
    ],
    rows: [
      { size: "2", bust: "54", waist: "51", hip: "56", height: "88–98" },
      { size: "4", bust: "58", waist: "54", hip: "60", height: "99–110" },
      { size: "6", bust: "63", waist: "57", hip: "65", height: "111–122" },
      { size: "8", bust: "68", waist: "60", hip: "70", height: "123–134" },
      { size: "10", bust: "74", waist: "63", hip: "76", height: "135–146" },
      { size: "12", bust: "80", waist: "66", hip: "82", height: "147–158" },
    ],
  },
  slippers: {
    key: "slippers",
    title: "Slippers & sandals",
    note: "Measure your foot from heel to longest toe, standing, at the end of the day.",
    columns: [
      { key: "size", label: "EU" },
      { key: "au", label: "AU women’s" },
      { key: "foot", label: "Foot length" },
    ],
    rows: [
      { size: "35", au: "5", foot: "22.5" },
      { size: "36", au: "6", foot: "23.0" },
      { size: "37", au: "6.5", foot: "23.5" },
      { size: "38", au: "7.5", foot: "24.0" },
      { size: "39", au: "8.5", foot: "24.5" },
      { size: "40", au: "9", foot: "25.0" },
    ],
  },
};

export function chartsFor(key: SizeChartKey | null | undefined): SizeChart[] {
  if (!key) return [];
  if (key === "family") return [SIZE_CHARTS.women, SIZE_CHARTS.girls, SIZE_CHARTS.boys];
  return [SIZE_CHARTS[key]];
}

export const HOW_TO_MEASURE = [
  { part: "Bust", how: "Around the fullest part of the bust, tape level under the arms. Wear the bra you plan to wear with the áo dài." },
  { part: "Waist", how: "Around the narrowest part of the natural waist, usually just above the navel. Keep one finger under the tape." },
  { part: "Hip", how: "Around the fullest part of the hips, feet together." },
  { part: "Height", how: "Barefoot, back against a wall, from floor to the top of the head." },
];
