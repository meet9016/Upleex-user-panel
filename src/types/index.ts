export interface Product {
    id: string;
    title: string;
    category: string;
    pricePerMonth: number;
    imageUrl: string;
    location: string;
    available: boolean;
    description?: string;
    sellerName?: string;
    rating?: number;
    specifications?: { label: string; value: string }[];
}

export interface Category {
    id: string;
    name: string;
    icon: string; // Component name or url
    slug: string;
    imageUrl?: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
}
