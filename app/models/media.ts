export interface MediaAsset {
  id: string;
  restaurantId: string;
  type: MediaType;
  category: MediaCategory;
  originalUrl: string;
  thumbnailUrl?: string;
  mediumUrl?: string;
  largeUrl?: string;
  alt?: string;
  mimeType: string;
  size: number;
  dimensions?: {
    width: number;
    height: number;
  };
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type MediaType = 'image' | 'logo' | 'icon' | 'video' | 'document';
export type MediaCategory = 'food' | 'drink' | 'ambiance' | 'staff' | 'menu' | 'branding' | 'other';

export interface MediaUploadRequest {
  file: File;
  type: MediaType;
  category: MediaCategory;
  alt?: string;
  tags?: string[];
}

export interface MediaUploadResponse {
  asset: MediaAsset;
  uploadSuccess: boolean;
  message?: string;
}

export interface MediaAssetPreview {
  id: string;
  type: MediaType;
  category: MediaCategory;
  thumbnailUrl?: string;
  alt?: string;
} 