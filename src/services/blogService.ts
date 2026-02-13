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

class BlogService {
    private blogList: Blog[] | null = null;

    async getBlogList(): Promise<Blog[]> {
        if (this.blogList) {
            return this.blogList;
        }
        try {
            const res = await api.post(endPointApi.blogList, {});
            const data = res.data.data || [];
            this.blogList = data;
            return data;
        } catch (error) {
            console.error('Error fetching blog list:', error);
            return [];
        }
    }

    async getSingleBlog(id: string): Promise<SingleBlogData | null> {
        try {
            const formData = new FormData();
            formData.append('blog_id', id);
            const res = await api.post(endPointApi.singleBlog, formData);
            return res.data.data || null;
        } catch (error) {
            console.error('Error fetching single blog:', error);
            return null;
        }
    }
}

export const blogService = new BlogService();
