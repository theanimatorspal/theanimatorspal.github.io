export type AccessLevel = 'public' | 'member' | 'premium';
export type ContentType = 'course' | 'article' | 'tool' | 'download';

export interface Subject {
  id: string;
  slug: string;
  title: string;
  description: string;
  itemCount: number;
}

export interface ContentItem {
  id: string;
  slug: string;
  title: string;
  type: ContentType;
  subjectId: string;
  subjectName: string;
  accessLevel: AccessLevel;
  durationOrReadTime: string;
  updatedAt: string;
  summary: string;
  tag?: string;
}