export interface Food {
    id: number;
    name: string;
    description: string;
    price: number;
    url_img: string | null;
    category: string;
    available: boolean;
    created_at: string;
}
