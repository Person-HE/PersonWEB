export interface Tool {
  id: string;
  name: string;
  description: string;
  detail: string;
  category: string;
  imageUrl: string;
  driveLink: string;
  createdAt: string;
}

export interface Resource {
  id: string;
  name: string;
  description: string;
  detail: string;
  category: string;
  imageUrl: string;
  driveLink: string;
  createdAt: string;
}

export interface NavSite {
  id: string;
  name: string;
  description: string;
  category: string;
  iconUrl: string;
  url: string;
  createdAt: string;
}
