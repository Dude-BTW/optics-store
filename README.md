# optics-store

Incomplete e-commerce platform for an offline optics store.

The project is an e-commerce platform developed for an offline optics store. The solution architecture is based on a Server-Side Rendering (SSR) approach and is divided into Back-end and Front-end components. The platform's purpose is to facilitate the customer service process, including interaction with the product catalog, filtering and search systems, authentication mechanisms, and functionality for submitting reviews and ratings.

---

> **Profile Verification / Portfolio Note**  
> This repository serves as a portfolio project for job applications. It is officially linked to the profiles registered with the following email addresses:
> - `robota.ua@for-job-search.knows-all-and-nothing.com`
> - `work.ua@for-job-search.knows-all-and-nothing.com`

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
  - [Back-end](#back-end)
  - [Front-end](#front-end)
- [Interface and Functionality Demonstration](#interface-and-functionality-demonstration)
  - [Part 1](#part-1)
  - [Part 2](#part-2)
  - [Part 3](#part-3)
  - [Part 4](#part-4)
  - [Various Functionality](#various-functionality)
- [Third-Party Assets](#third-party-assets)

## Tech Stack

The project is developed using Java, Maven, Spring Boot, MariaDB, Nginx, HashiCorp Vault, NodeJS, FreeMarker, HTML, CSS, and JS.

## Architecture

### Back-end

The server side implements the business logic for data, security, and user session management. The security module includes JWT-based authentication, role-based access control, and symmetric encryption of personal data using the AES algorithm. Infrastructure protection against automated attacks is ensured by integrating Google reCAPTCHA, Rate Limiting algorithms, and a system for logging and blocking malicious IP addresses.

The database architecture is complemented by a custom system for two-way asynchronous synchronization of the SQL storage with Excel documents. The mechanism uses in-memory buffering of SQL operations (INSERT, UPDATE, DELETE) and query interception via custom filters to optimize disk write operations. Database load reduction during client request processing is implemented through a multi-level caching system based on the Caffeine library, which stores data for the main page, optics catalog, and user interaction history.

### Front-end

The client side is built on the Freemarker template engine, complemented by HTML, CSS, and client-side JavaScript for dynamic interaction with the DOM tree. The interface is built using flex and grid layouts for responsive content display across various devices.

A rich set of interactive UI components is implemented: navigation bars with mega-menu support, product and brand carousels, as well as modules for dynamic filtering (faceted search) and search. The product details page supports dynamic interface state changes depending on the selected configurations (e.g., color), automatically updating the image, price, SKU, and cart interaction form. User feedback modules are implemented, including sections for questions, reviews, and general store ratings, supporting client-side form validation, dynamic pagination, data sorting, and asynchronous UI state updates during CRUD operations. Functionality for tracking the history of viewed products are implemented separately.

## Interface and Functionality Demonstration

Below are the videos that demonstrate the operation of the client-side (Front-end) of the platform. Each file is accompanied by a detailed description of the rendered UI components, interactive elements, and the execution of the user interaction logic with the system.

> **Disclaimer:** Please note that all product descriptions, specifications, and brand names used in this project serve strictly as placeholder data. While the individual fragments of text are based on real products, they have been deliberately mixed. Consequently, the combined characteristics for any given item are fictitious and do not represent actual products. The use of these materials is solely for demonstration purposes and does not constitute an advertisement, endorsement, or disparagement of any specific brands or products.

### Part 1

<details>
  <summary>Expand image</summary>
  <img width="1920" height="7625" alt="1" src="https://github.com/user-attachments/assets/6a57129e-574d-48af-8a45-7b2604c7ba31" />
</details>

Home Page screenshot. A navbar is implemented in the header, followed by a hero banner and a brand logo carousel. The main content is rendered as grid/flex containers with product card components containing an image, price, rating, and an add-to-cart button with the corresponding event handler. UI elements for discount marking are present. Separate sections are allocated for extended product previews. In the bottom part, a reviews component with an overall rating is implemented. The footer contains contact data, navigation links, a subscription form, and social media icons.

#### 1 - Scroll

https://github.com/user-attachments/assets/75a00e96-6f81-45ce-93c8-556377fb3333

Demonstration of the Home Page vertical scrolling. Rendering of UI components is displayed: navbar, hero slider, brand carousel. Next is the product cards section with category tabs. Below it are containers with enlarged images and descriptions. The next components are two horizontal product carousels. Then the store statistics component with a rating distribution histogram is rendered. The scrolling ends at the footer element. During scrolling, the display of an animated loader component (spinner) is captured, indicating asynchronous loading or content initialization.

#### 1 - Functionality 1

https://github.com/user-attachments/assets/27595990-20d6-4041-841a-eea5b1ebb35d

Testing the interactivity of UI elements (hover effects). Demonstration of navbar elements' hover states. Hovering over a menu item triggers the rendering of a standard dropdown menu. Hovering over a category initiates the deployment of a mega-menu with columns of filtering parameters and rendered product cards. The operation of functional header icons is demonstrated: opening the search input field, profile, and cart icons. Next, the hero slider event listener is tested: switching images via navigation elements. In the second half, interaction with the brand carousel via the drag-and-drop scrollbar is shown.

#### 1 - Functionality 2.1

https://github.com/user-attachments/assets/84a02822-7082-4ffd-a1ad-0005e95d320a

Interaction with catalog components on the Home Page. Switching between category tabs, carousel scrolling. The specific rendering of the hover effect (flickering) for product card images in the Chrome browser is captured (the project is optimized for Edge, correct operation is in the file 1_Functionality_2.2.mp4). Triggering the cart icon causes the rendering of a confirmation modal window. After closing the modal, the cart counter state in the header is updated. Clicking on the "улюблене" (favorite) icon changes its state to active. Scrolling to the bottom component sections is shown.

#### 1 - Functionality 2.2

https://github.com/user-attachments/assets/be60ebed-0ebc-4865-bd80-4b92cf4356c4

Demonstration of the correct execution of CSS/JS hover animations of image changes in product card components within the Mozilla Firefox environment. Scrolling from the hero banner to the categories section is performed.

#### 1 - Functionality 3

https://github.com/user-attachments/assets/2cb3fbe3-63a5-4503-8c48-7a0469f7b15b

Testing the UI components of the bottom part of the page. Interaction with the reviews component: checking hover states, handling clicks on the button to load additional records (dynamic content loading into the DOM). Scrolling to the footer and checking the hover states of navigation links. Testing the client-side validation of the subscription form. Submitting an invalid email triggers the rendering of a validation error message. Submitting valid data initiates the display of a successful operation message.

### Part 2

<details>
  <summary>Expand image</summary>
  <img width="1920" height="6883" alt="2" src="https://github.com/user-attachments/assets/5d1752f3-3ba9-4451-b842-5e5fe22e6534" />
</details>

Reviews Page screenshot. In the top part, the overall statistics component is rendered: average rating, distribution histogram, detailed ratings by criteria, and a button to initialize the form modal window. The main content is a container with individual review components. Each element contains user data, a timestamp, rating, text, and voting UI elements with state counters. Rendering of nested response components is supported. A pagination component is implemented. The page ends with a standard footer element.

#### 2 - Scroll

https://github.com/user-attachments/assets/cd5ba2da-f0c7-4efe-979f-047cf9cc6a2f

Demonstration of the Reviews Page rendering during scrolling. The statistics component, select elements for configuring the display limit, and sorting parameters are shown. The list of review components with nested responses and voting elements is scrolled. At the bottom, a pagination component with a total records counter is displayed. The scrolling ends at the footer element.

#### 2 - Functionality 1

https://github.com/user-attachments/assets/ce0a85de-55d5-4a37-9e75-62f372d2bc9a

Demonstration of the Create operation (CRUD) for the review component. Clicking the create button triggers the rendering of a modal window with a form. Client-side validation testing: submitting an empty form is blocked, displaying messages about mandatory fields. After filling in the input/textarea fields, setting rating states, and activating the consent checkbox, the submit passes successfully, rendering a status message. Routing to the reviews page is shown. The new record is rendered in the DOM at the beginning of the list, and the counter state is updated.

#### 2 - Functionality 2

https://github.com/user-attachments/assets/922b8020-2c2d-44f3-a626-bbff4f11a5c4

Testing the UI elements for managing the reviews list. Interaction with the select element to change the record limit on the page. Checking the operation of the pagination component. Interaction with the select element for data sorting. Dynamic DOM rendering in response to changing display and sorting parameters is displayed.

#### 2 - Functionality 3

https://github.com/user-attachments/assets/618303eb-11c5-4a99-9c56-935a20cf0375

Full demonstration of CRUD operations for the reviews component. Create: initialization of the form modal window, filling in data, submit, dynamic DOM and counter updates. Update: triggering the edit icon, changing form data in the modal, submit, updating the UI of existing records. Delete: triggering the delete icon, confirming the action in a dialog box, removing the node from the DOM, recalculating the overall rating, and updating the counter state on the client.

### Part 3

<details>
  <summary>Expand image</summary>
  <img width="1920" height="7786" alt="3" src="https://github.com/user-attachments/assets/8b90dc6c-08c0-4919-a9f0-1a7642c4966e" />
</details>

Product Details Page screenshot. The layout is divided into blocks. On the left: the product's hero-image component with stickers and a button to change the favorite state. On the right: a metadata block (name, rating, SKU, price, availability status), color selection UI elements (color swatches), a quantity input, and an add-to-cart submit button. Anchor navigation is implemented. The main content contains sections: "Характеристики" (Characteristics), "Опис" (Description), "Q&A", "Відгуки" (Reviews). Interaction sections contain form initialization buttons and lists of existing records. Below, the "Схожі товари" (Similar products) carousel and the overall statistics component are rendered.

#### 3 - Scroll

https://github.com/user-attachments/assets/26158d86-fad6-455f-aca7-cbb39c7bd06c

Routing testing. Navigating to the Home Page via a click on the breadcrumbs element. Navigating to the Product Details Page by clicking on a card in the catalog. Vertical scrolling of the rendered page is demonstrated: metadata component, characteristics table, description, Q&A and reviews sections, similar products carousel, store statistics, footer.

#### 3 - Functionality 1

https://github.com/user-attachments/assets/560c6e5b-457b-4dce-aa0a-72ff4c7ed954

Testing the interactivity of the Product Details Page. Interaction with informational blocks: clicking on elements initiates the rendering of modal windows. Quantity component testing: changing the value via UI buttons and direct input followed by generating an add-to-cart event. Color selection component testing: a state change triggers dynamic updates of the hero-image, SKU, and availability status. Selecting a color with an out-of-stock status changes the UI state: the cart button is replaced by an availability notification form, the quantity input is hidden, and the price receives the appropriate styling.

#### 3 - Functionality 2

https://github.com/user-attachments/assets/f8b063e1-1ac4-429a-8571-bdef28c2b88f

Demonstration of CRUD operations (Create, Delete) for Q&A and reviews on the Product Details Page. Initialization of the question form modal. Testing the custom select for the country calling code. Client-side validation check (email formatting, required fields). Successful submit. Rendering the new record in the DOM with management icons. A similar flow is demonstrated for the review form. Delete operation testing: clicking the delete icon calls a confirm modal, confirmation initiates the removal of the record with the element disappearing from the DOM.

#### 3 - Functionality 3

https://github.com/user-attachments/assets/823ab653-a028-4f03-a5bb-e1ad73762610

Interaction with recommendation components. Scrolling the "Схожі товари" (Similar products) carousel. Triggering the cart button on a card in the carousel calls a confirmation modal window. Interaction with an out-of-stock product: calling the availability subscription form, validation, submit. Routing to another product's page. Demonstration of the viewing history mechanism: rendering the "Товари, які ви переглядали" (Products you have viewed) block. Triggering the "Очистити" (Clear) button resets the saved state (local storage/session) and reloads the page with an updated DOM.

### Part 4

<details>
  <summary>Expand image</summary>
  <img width="1920" height="5977" alt="4" src="https://github.com/user-attachments/assets/841e245a-7fcd-44bb-88fa-9e0a06473a45" />
</details>

Brand Catalog Page screenshot. Below the header, breadcrumbs and a title are rendered. The control panel contains a button to initialize the filters component, a products counter state, and a sorting select element. The main content is a grid of product cards (photo, favorite status, metadata, cart button). UI stickers are present. Below the grid, a pagination component, a brand carousel, and a footer are implemented.

#### 4 - Scroll

https://github.com/user-attachments/assets/446694fa-4257-44c6-8138-0cb1bd336178

Routing testing via the browser's history API. Navigating to the catalog page by clicking on a brand logo in the carousel. Scrolling of the generated page: hero banner, control panel, grid of product cards, pagination, brand carousel, footer.

#### 4 - Functionality 1

**Functionality №1**

https://github.com/user-attachments/assets/4cc5d9c8-05ae-4c69-9dd3-601022e2793b

**Functionality №2**

https://github.com/user-attachments/assets/5d8f67d4-fea0-415a-a98c-e88c72b5a3f9

Testing UI filtering (faceted search) and sorting. Triggering the "Фільтр" (Filter) button initiates the rendering of a sidebar panel. Changing the checkbox states causes a dynamic update of the product grid, URL parameters update, and the results counter. Triggering the filter clear resets the parameters state to default and closes the panel. Checking the sorting select menu: dynamic regrouping of DOM elements in the catalog according to the selected criteria.

#### 4 - Functionality 2

**Functionality №1**

https://github.com/user-attachments/assets/96c52389-c684-4efa-bdd2-d368a1c454c6

**Functionality №2**

https://github.com/user-attachments/assets/1647b8bc-0e60-4b06-87f8-6c444906b68c

**Functionality №3**

https://github.com/user-attachments/assets/46068739-fe5a-4e74-9725-adc870d92884

Testing the routing and search system. Navigating through pages via footer links, logo (Home Page), and mega-menu. Checking the pagination component. Routing by product categories. Testing the search component: text input initiates the rendering of a results dropdown list (live search). Selecting an element from the list executes a transition to the Product Details Page. Submitting the search form redirects to the Search Results Page, which uses a reused catalog component with a grid layout.

### Various Functionality

https://github.com/user-attachments/assets/5c25908b-711a-431f-b66a-bd122ea0d7e1

Demonstration of E2E functionality of the web application. Testing CRUD operations for reviews on various pages. Testing the Product Details Page: dynamic UI updating (image, SKU, availability) when changing the state of product attributes. Interaction with modal windows and content tabs. Submitting feedback forms and availability subscriptions. Testing faceted search (filtering) and sorting logic in catalog components. Checking the routing system. Testing authentication modules: submitting the registration form and login, which changes the user's authorization state in the system.

## Third-Party Assets

### SVG

<details>
  <summary>Expand resource links</summary>
  <p></p>
  <p>https://www.svgrepo.com/</p>
</details>

### JPG

<details>
  <summary>Expand resource links</summary>
  <p></p>
  <p>exempl1; exempl2: https://unsplash.com/photos/black-framed-eyeglasses-e8TtkC5xyv4</p>
  <p>exempl3; exempl4: https://unsplash.com/photos/brown-framed-eyeglasses-on-white-surface-PnsfHpDrY5o</p>
  <p>Акційні товари: https://unsplash.com/photos/red-and-white-sale-led-sign-KcPK_kzqWC8</p>
  <p>Оправи (дитячі): https://unsplash.com/photos/womens-black-framed-eyeglasses-GDhrGQcRQQc</p>
  <p>Оправи (жіночі): https://www.pexels.com/photo/modern-elegance-with-sleek-glasses-26100579/</p>
  <p>Оправи (унісекс): https://www.pexels.com/photo/an-eyeglasses-on-white-surface-7357971/</p>
  <p>Оправи: https://www.pexels.com/photo/close-up-shot-of-eyeglasses-on-a-white-surface-13430474/</p>
  <p>Пошук: https://www.pexels.com/photo/selective-focus-side-view-photo-girl-in-gray-sweater-selecting-vinyl-records-from-a-music-store-3769025/</p>
  <p>Сонцезахисні Окуляри: https://www.pexels.com/photo/stylish-black-sunglasses-on-beige-background-29538699/</p>
  <p>Сонцезахисні Окуляри (дитячі): https://www.pexels.com/photo/happy-little-boy-and-girl-on-blanket-5368721/</p>
  <p>Сонцезахисні Окуляри (жіночі): https://www.pexels.com/photo/stylish-portrait-of-women-in-sunglasses-31744828/</p>
  <p>Сонцезахисні Окуляри (унісекс): https://www.pexels.com/photo/stylish-portrait-of-trendy-young-adults-with-sunglasses-31206188/</p>
  <p>Сонцезахисні Окуляри (чоловічі): https://www.pexels.com/photo/relaxed-man-in-sunglasses-enjoying-outdoors-29088335/</p>
  <p>Ana Hickmann: https://unsplash.com/photos/woman-wearing-black-and-white-striped-top-and-round-eyeglasses-Brl7bqld05E?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText</p>
  <p>Bulget: https://unsplash.com/photos/man-in-black-crew-neck-shirt-beside-woman-in-red-cardigan-1dZ_OimzNW8?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText</p>
  <p>Estilo: https://www.pexels.com/photo/couple-in-black-and-blue-jackets-standing-at-wooden-wall-corner-1954659/</p>
  <p>Swing: https://www.pexels.com/photo/a-woman-carrying-a-young-girl-while-holding-an-eyeglasses-5621842/</p>
  <p>T-Charge: https://www.pexels.com/photo/smiling-man-in-black-bubble-jacket-wearing-eyeglasses-3481642/</p>
  <p>Ventoe: https://www.pexels.com/photo/photo-couple-16957203/</p>
  <p>Hot Wheels: https://www.pexels.com/photo/grandpa-playing-with-his-grandchild-6972662/</p>
</details>

### PNG

<details>
  <summary>Expand resource links</summary>
  <p></p>
  <p>Y!O; Y!O (R): https://www.pngmart.com/image/708808/png/708807</p>
  <p>ANA HICKMANN: https://vectorseek.com/vector_logo/ana-hickmann-eyewear-logo-vector/</p>
  <p>BULGET: https://vectorseek.com/vector_logo/bulget-occhiali-logo-png-svg-vector/</p>
  <p>ESTILO: https://interopticuss.com/estilo/?doing_wp_cron=1777222792.3488409519195556640625</p>
  <p>HOT WHEELS: https://vectorseek.com/vector_logo/hot-wheels-logo-vector/</p>
  <p>SWING: https://www.clipartkey.com/view/JwwmbT_swing-eyewear-logo/</p>
  <p>T-CHARGE: https://centreoptique-lepuy.fr/lunettes/t-charge/</p>
  <p>VENTOE: https://interopticuss.com/ventoe/?doing_wp_cron=1777224749.9275789260864257812500</p>
</details>

### Placeholder User Comments

<details>
  <summary>Expand resource links</summary>
  <p></p>
  <p>Soundtracks from Metal Gear Rising: Revengeance: «Red Sun» (Jason Charles Miller / Jamie Christopherson), «The Stains of Time» (Kit Walters / Jamie Christopherson)</p>
  <p>The Beatles: «While My Guitar Gently Weeps»</p>
  <p>Kanye West: «Never See Me Again» (also known as "See Me Again")</p>
</details>
