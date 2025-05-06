export interface CustomTemplate {
  id: string;
  restaurantId: string;
  name: string;
  type: TemplateType;
  content: TemplateContent;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type TemplateType = 'menu' | 'dailyMenu' | 'qrCode' | 'receipt' | 'customerCard' | 'email' | 'custom';

// L'interface TemplateContent est flexible selon le type de template
export interface TemplateContent {
  layout: string; // 'grid', 'list', 'cards', 'custom', etc.
  sections: TemplateSection[];
  styles: {
    [key: string]: string | number | object;
  };
  config: {
    [key: string]: any;
  };
}

export interface TemplateSection {
  id: string;
  name: string;
  type: string; // 'header', 'footer', 'menuCategory', 'dishList', etc.
  content?: {
    [key: string]: any;
  };
  styles?: {
    [key: string]: string | number | object;
  };
  order: number;
}

export interface TemplatePreview {
  id: string;
  name: string;
  type: TemplateType;
  isActive: boolean;
} 