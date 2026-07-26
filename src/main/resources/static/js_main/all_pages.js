const svgPaths = [
  // card
  // action -->
  "/images/System_Interface/card/action/action_info.svg",
  "/images/System_Interface/card/action/action.svg",

  // cart_card -->
  "/images/System_Interface/card/cart_card/cart_card_red_click.svg",
  "/images/System_Interface/card/cart_card/cart_card_red.svg",
  "/images/System_Interface/card/cart_card/cart_card.svg",

  // heart -->
  "/images/System_Interface/card/heart/heart_red.svg",
  "/images/System_Interface/card/heart/heart.svg",

  // product_cart -->
  "/images/System_Interface/card/product_cart/product_cart_red.svg",
  "/images/System_Interface/card/product_cart/product_cart.svg",

  // oth -->
  "/images/System_Interface/card/circle_number.svg",
  "/images/System_Interface/card/price.svg",
  "/images/System_Interface/card/top.svg",

  // carousel_symbols
  "/images/System_Interface/carousel_symbols/carousel_next.svg",
  "/images/System_Interface/carousel_symbols/carousel_prev.svg",
  "/images/System_Interface/carousel_symbols/circle_carousel.svg",

  // close
  "/images/System_Interface/close/close_tiny_red.svg",
  "/images/System_Interface/close/close_tiny.svg",
  "/images/System_Interface/close/close_white.svg",
  "/images/System_Interface/close/close.svg",

  // dropdown_symbols
  "/images/System_Interface/dropdown_symbols/down_red_light.svg",
  "/images/System_Interface/dropdown_symbols/down_red.svg",
  "/images/System_Interface/dropdown_symbols/right_left_red.svg",

  // feedback_control
  // category_page -->
  "/images/System_Interface/feedback_control/category_page/category_page_red.svg",
  "/images/System_Interface/feedback_control/category_page/category_page.svg",

  // dislike -->
  "/images/System_Interface/feedback_control/dislike/dislike_fill.svg",
  "/images/System_Interface/feedback_control/dislike/dislike.svg",

  // feedback_next -->
  "/images/System_Interface/feedback_control/feedback_next/feedback_next_max.svg",
  "/images/System_Interface/feedback_control/feedback_next/feedback_next.svg",

  // feedback_prev -->
  "/images/System_Interface/feedback_control/feedback_prev/feedback_prev_max.svg",
  "/images/System_Interface/feedback_control/feedback_prev/feedback_prev.svg",

  // home_page -->
  "/images/System_Interface/feedback_control/home_page/home_page_red.svg",
  "/images/System_Interface/feedback_control/home_page/home_page.svg",

  // like -->
  "/images/System_Interface/feedback_control/like/like_fill.svg",
  "/images/System_Interface/feedback_control/like/like.svg",

  // oth -->
  "/images/System_Interface/feedback_control/delivery_truck.svg",
  "/images/System_Interface/feedback_control/money_refund.svg",
  "/images/System_Interface/feedback_control/original_products.svg",
  "/images/System_Interface/feedback_control/warranty.svg",

  // minus
  "/images/System_Interface/minus/minus_red_click.svg",
  "/images/System_Interface/minus/minus_red.svg",
  "/images/System_Interface/minus/minus.svg",

  // navbar_symbols
  // carousel_next -->
  "/images/System_Interface/navbar_symbols/carousel_next/carousel_next_red_click.svg",
  "/images/System_Interface/navbar_symbols/carousel_next/carousel_next_red.svg",

  // cart_card_nav -->
  "/images/System_Interface/navbar_symbols/cart_card_nav/cart_card_nav_red_click.svg",
  "/images/System_Interface/navbar_symbols/cart_card_nav/cart_card_nav_red.svg",
  "/images/System_Interface/navbar_symbols/cart_card_nav/cart_card_nav.svg",

  // heart_nav -->
  "/images/System_Interface/navbar_symbols/heart_nav/heart_nav_red_click.svg",
  "/images/System_Interface/navbar_symbols/heart_nav/heart_nav_red.svg",
  "/images/System_Interface/navbar_symbols/heart_nav/heart_nav.svg",

  // search -->
  "/images/System_Interface/navbar_symbols/search/search_red_click.svg",
  "/images/System_Interface/navbar_symbols/search/search_red.svg",
  "/images/System_Interface/navbar_symbols/search/search.svg",

  // user -->
  "/images/System_Interface/navbar_symbols/user/user_red_click.svg",
  "/images/System_Interface/navbar_symbols/user/user_red.svg",
  "/images/System_Interface/navbar_symbols/user/user.svg",

  // payment
  "/images/System_Interface/payment/mastercard.svg",
  "/images/System_Interface/payment/visa.svg",

  // plus
  "/images/System_Interface/plus/plus_red_click.svg",
  "/images/System_Interface/plus/plus_red.svg",
  "/images/System_Interface/plus/plus_white.svg",
  "/images/System_Interface/plus/plus.svg",

  // social_networks
  "/images/System_Interface/social_networks/facebook.svg",
  "/images/System_Interface/social_networks/instagram.svg",

  // social_networks
  "/images/System_Interface/telephone/telephone_white.svg",
  "/images/System_Interface/telephone/telephone.svg",

  // oth
  "/images/System_Interface/check.svg",
  "/images/System_Interface/filter.svg",
  "/images/System_Interface/more.svg",
  "/images/System_Interface/send.svg",
  "/images/System_Interface/sorting_left.svg",
];

function preloadSVGs() {
  svgPaths.forEach((path) => {
    const img = new Image();
    img.src = path;
  });
}

window.addEventListener("load", preloadSVGs);
