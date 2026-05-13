export type ToolCategory = 'pdf' | 'image' | 'developer' | 'university';

export interface Tool {
  slug: string;
  title: string;
  description: string;
  category: ToolCategory;
  icon: string;          // Lucide icon name as string
  tags: string[];        // for CMD+K search
  isNew?: boolean;
  isPopular?: boolean;
}
