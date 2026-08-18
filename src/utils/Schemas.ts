export type Brands = {
  id: number;
  image: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type Banners = {
  id: number;
  phone: string;
  tab: string;
  web: string;
  link?: string | string[];
  createdAt: string;
  updatedAt: string;
};

export type Categories = {
  id: number;
  name: string;
  image?: string;
  imageOn: string;
  imageOff: string;
  brandId: string;
  createdAt: string;
  updatedAt: string;
};

export type Faq = {
  id: number;
  heading: string;
  question: string;
  answer: string;
  createdAt: string;
  updatedAt: string;
};

export type Blog = {
  id: number;
  images: string[];
  heading: string;
  bodyText: string;
  tags: string[];
  duration: string;
  category: string;
  createdAt: string;
  updatedAt: string;
};
