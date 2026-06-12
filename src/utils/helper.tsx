interface MonthItem {
  month: string;       // stored as string in your form (e.g., "1", "2")
  price: string;
  cancelPrice: string;
}

interface FormDataType {
  months: MonthItem[];
}

export const getAvailableMonths = (
  currentIndex: number,
  months: MonthItem[]
): number[] => {
  const selectedMonths = months
    .filter((_, i) => i !== currentIndex)
    .map((m) => Number(m.month))
    .filter((m) => !isNaN(m));

  return Array.from({ length: 12 }, (_, i) => i + 1).filter(
    (month) => !selectedMonths.includes(month)
  );
};

/**
 * Create SEO-friendly URL slug from name
 * Example: "Canon Camera" => "canon-camera"
 */
export const createSlug = (name: string, id?: string): string => {
  if (!name) return id || '';
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '');
};

/**
 * Extract ID from SEO-friendly URL slug
 * Since we now use slugs directly, this function just returns the slug.
 */
export const extractIdFromSlug = (slug: string): string => {
  if (!slug) return '';
  return slug;
};

