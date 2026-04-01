export interface EndPointApi {
    //Auth
    webLoginRegister: string;
    logout: string;
    updateUserProfile: string;

    //Vendor
    vendorLogin?: string;
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
    
    // Payment
    createOrder: string;
    verifyPayment: string;
    userOrders: string;
    
    // Priority plans
    getPriorityPlans?: string;

    // Services
    serviceCategoryList: string;
    serviceList: string;
    serviceDetails: string;
    bannerList: string;
    
    // Contact
    createContact: string;
}

// Define and export the API endpoint object
const endPointApi: EndPointApi = {
    //Auth
    webLoginRegister: 'web-login-register',
    logout: 'auth/logout',
    updateUserProfile: 'auth/update-profile',

    //Vendor
    vendorLogin: 'vendor/auth/vendor-login',
    home: 'categories/getall',
    webSubCategoryList: 'subcategories/getall',
    webCategoryProductList: 'products/getall',
    webSingleProductList: 'products/getById',
    webVendorProductList: 'products/web-vendor-product-list',
    webAllCityList: 'vendor-india-city-list',
    webProductSuggestionList: 'web-product-suggestion-list',
    webSearchProductList: 'web-search-product-list',

    //Product details
    webGetQuote: 'quote/create-quote',

    // Content
    blogList: 'blogs/getall',
    singleBlog: 'blogs/getbyid',
    faqList: 'faqs/getall',

    // Cart
    webAddToCart: 'cart/web-add-to-cart',
    webCartList: 'cart/web-cart-list',
    webRemoveCart: 'cart/web-remove-cart',
    businessRegister: 'vendor/auth/business-register',
    
    // Payment
    createOrder: 'payment/create-order',
    verifyPayment: 'payment/verify-payment',
    userOrders: 'payment/user-orders',
    // Priority plans
    getPriorityPlans: 'priority-plans/getall',

    // Services
    serviceCategoryList: 'service-categories/getall',
    serviceList: 'services/getall',
    serviceDetails: 'services/getById',
    bannerList: 'banners/getall',
    
    // Contact
    createContact: 'create-contact',
};



export default endPointApi;
