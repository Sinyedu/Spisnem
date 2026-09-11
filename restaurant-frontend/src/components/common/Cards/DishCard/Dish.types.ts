export type DishCardProps = {
  image: string | null;
  name: string;
  description: string | null;
  priceMinor: number;
  currency?: string;
  onAdd?: () => void;
};