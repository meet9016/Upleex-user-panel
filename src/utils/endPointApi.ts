export interface EndPointApi {
    //Auth
    webLoginRegister: string;
    logout: string;

    //Vendor
    home: string;
    webSubCategoryList: string;
    webCategoryProductList: string;
    webSingleProductList: string;
    webVendorProductList: string;
    webAllCityList: string;
    webProductSuggestionList: string;
    webSearchProductList: string;

    //Product details
    webGetQuote: string;

    // Content
    blogList: string;
    singleBlog: string;
    faqList: string;

    // Cart
    webAddToCart: string;
    webCartList: string;
    webRemoveCart: string;
    businessRegister: string;
}

// Define and export the API endpoint object
const endPointApi: EndPointApi = {
    //Auth
    webLoginRegister: 'web-login-register',
    logout: 'auth/logout',

    //Vendor
    home: '/api/v1/categories/getall',
    webSubCategoryList: '/api/v1/subcategories/getall',
    webCategoryProductList: '/api/v1/products/getall',
    webSingleProductList: '/api/v1/products/getById',
    webVendorProductList: 'web-vendor-product-list',
    webAllCityList: 'web-all-city-list',
    webProductSuggestionList: 'web-product-suggestion-list',
    webSearchProductList: 'web-search-product-list',

    //Product details
    webGetQuote: 'web-get-quote',

    // Content
    blogList: '/api/v1/blogs/getall',
    singleBlog: 'single-blog',
    faqList: '/api/v1/faqs/getall',

    // Cart
    webAddToCart: 'web-add-to-cart',
    webCartList: 'web-cart-list',
    webRemoveCart: 'web-remove-cart',
    businessRegister: 'business-register',
};



export default endPointApi;
