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
    webRelatedProductList: string;

    //Product details
    webGetQuote: string;
    quoteList: string;
    userDashboard: string;
    quoteVerifyPayment: string;

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

    // Wishlist
    webWishlistList: string;
    webAddToWishlist: string;
    webRemoveWishlist: string;
    webToggleWishlist: string;
    webCheckWishlist: string;
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
    webRelatedProductList: 'products/related-products',

    //Product details
    webGetQuote: 'quote/create-quote',
    quoteList: 'quote/getall',
    userDashboard: 'quote/user-dashboard',
    quoteVerifyPayment: 'quote/verify-payment',

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

    // Wishlist
    webWishlistList: 'wishlist/web-wishlist-list',
    webAddToWishlist: 'wishlist/web-add-to-wishlist',
    webRemoveWishlist: 'wishlist/web-remove-wishlist',
    webToggleWishlist: 'wishlist/web-toggle-wishlist',
    webCheckWishlist: 'wishlist/web-check-wishlist',
};



export default endPointApi;
