import { api } from '../utils/axiosInstance';
import endPointApi from '../utils/endPointApi';

export interface Blog {
    id: string;
    title: string;
    image: string;
    description: string;
    blog_date: string;
}

export interface SingleBlogData {
    blog_data: Blog & { long_description: string };
    related_blogs: Blog[];
}

export interface BlogListResponse {
    status: number;
    message: string;
    data: Blog[];
}

export interface SingleBlogResponse {
    status: number;
    message: string;
    data: SingleBlogData;
}

const buildImageUrl = (path: string | undefined | null): string => {
    if (!path) return '';
    const trimmed = path.trim();
    if (!trimmed) return '';
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
        return trimmed;
    }
    const base = process.env.NEXT_PUBLIC_APP_URL || '';
    if (!base) return trimmed;
    if (trimmed.startsWith('/')) {
        return `${base.replace(/\/+$/, '')}${trimmed}`;
    }
    return `${base.replace(/\/+$/, '')}/${trimmed.replace(/^\/+/, '')}`;
};

class BlogService {
    private blogList: Blog[] | null = null;

    async getBlogList(): Promise<Blog[]> {
        if (this.blogList) {
            return this.blogList;
        }
        try {
            const res = await api.get(endPointApi.blogList, {
                params: {
                    page: 1,
                    limit: 100,
                },
            });

            const payload = res.data;
            const rawList = Array.isArray(payload?.data) ? payload.data : [];

            const mapped: Blog[] = rawList.map((item: any) => ({
                id: item.id,
                title: item.title,
                description: item.description,
                blog_date: item.blog_date,
                image: buildImageUrl(item.image),
            }));

            this.blogList = mapped;
            return mapped;
        } catch (error) {
            console.error('Error fetching blog list:', error);
            return [];
        }
    }

    async getSingleBlog(id: string): Promise<SingleBlogData | null> {
        try {
            const res = await api.get(`${endPointApi.singleBlog}/${id}`);
            const payload = res.data;

            if (!payload || !payload.blog_data) {
                return null;
            }

            const blogData = payload.blog_data;
            const related = Array.isArray(payload.related_blogs)
                ? payload.related_blogs
                : [];

            const mappedBlog: Blog & { long_description: string } = {
                id: blogData.id,
                title: blogData.title,
                description: blogData.description,
                blog_date: blogData.blog_date,
                image: buildImageUrl(blogData.image),
                long_description: blogData.long_description || '',
            };

            const mappedRelated: Blog[] = related.map((item: any) => ({
                id: item.id,
                title: item.title,
                description: item.description,
                blog_date: item.blog_date,
                image: buildImageUrl(item.image),
            }));

            return {
                blog_data: mappedBlog,
                related_blogs: mappedRelated,
            };
        } catch (error) {
            console.error('Error fetching single blog:', error);
            return null;
        }
    }
}

export const blogService = new BlogService();
