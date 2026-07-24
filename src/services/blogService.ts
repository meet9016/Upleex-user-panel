import { api } from '../utils/axiosInstance';
import endPointApi from '../utils/endPointApi';

export interface Blog {
    id: string;
    slug: string;
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
    private blogListPromise: Promise<Blog[]> | null = null;

    async getBlogList(): Promise<Blog[]> {
        if (this.blogList) {
            return this.blogList;
        }
        if (this.blogListPromise) {
            return this.blogListPromise;
        }

        this.blogListPromise = (async () => {
            try {
                const res = await api.get(endPointApi.blogList, {
                    params: {
                        page: 1,
                        limit: 100,
                    },
                });

            const payload = res.data;
            const rawList = Array.isArray(payload?.data) ? payload.data : [];

            const createBlogSlug = (title: string): string => {
                if (!title) return '';
                return title.toLowerCase().replace(/[^a-z0-9]+/g, '');
            };

            const mapped: Blog[] = rawList.map((item: any) => ({
                id: item.id,
                slug: item.slug || createBlogSlug(item.title),
                title: item.title,
                description: item.description,
                blog_date: item.blog_date,
                image: buildImageUrl(item.image),
            }));

                this.blogList = mapped;
                return mapped;
            } catch (error) {
                this.blogListPromise = null;
                return [];
            }
        })();

        return this.blogListPromise;
    }

    async getSingleBlog(id: string): Promise<SingleBlogData | null> {
        try {
            // Check if we can find the blog in the list by slug or ID
            const allBlogs = await this.getBlogList();
            const matchedBlog = allBlogs.find(b => b.slug === id || b.id === id);
            
            // If found by slug, use the actual ID for the API call
            const fetchId = matchedBlog ? matchedBlog.id : id;

            const res = await api.get(`${endPointApi.singleBlog}/${fetchId}`);
            const payload = res.data;

            if (!payload || !payload.blog_data) {
                return null;
            }

            const blogData = payload.blog_data;
            const related = Array.isArray(payload.related_blogs)
                ? payload.related_blogs
                : [];

            const createBlogSlug = (title: string): string => {
                if (!title) return '';
                return title.toLowerCase().replace(/[^a-z0-9]+/g, '');
            };

            const mappedBlog: Blog & { long_description: string } = {
                id: blogData.id,
                slug: blogData.slug || createBlogSlug(blogData.title),
                title: blogData.title,
                description: blogData.description,
                blog_date: blogData.blog_date,
                image: buildImageUrl(blogData.image),
                long_description: blogData.long_description || '',
            };

            const mappedRelated: Blog[] = related.map((item: any) => ({
                id: item.id,
                slug: item.slug || createBlogSlug(item.title),
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
            return null;
        }
    }
}

export const blogService = new BlogService();
