export interface Skill {
  id: string;
  title: string;
  image: string;
  category: string;
  style: string;
  scene: string;
  fileSize: number;
  downloads: number;
  likes: number;
}

export interface SkillsResponse {
  items: Skill[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface FilterOption {
  value: string;
  label: string;
}

export interface Filters {
  categories: FilterOption[];
  styles: FilterOption[];
  scenes: FilterOption[];
}
