# REST API

## **1. MPA vs. SPA from Request/Response Perspective:**

### **Multi-Page Application (MPA) Request/Response Flow:**

1. **Initial Page Request:**
    - **Request Method:** **`GET`**
    - **Headers:** Standard browser headers (User-Agent, Accept, Accept-Language)
    - **Body:** Empty (GET requests typically have no body)
    - **Response:** Full HTML document with status code 200
    - **Response Headers:** **`Content-Type: text/html`**, may include caching headers
    - **Response Body:** Complete HTML markup with embedded resources
2. **Subsequent Navigation:**
    - Each link click/form submission triggers new full page request
    - **Request Method:** **`GET`** (navigation), **`POST`** (form submission)
    - **Headers:** Includes Cookie header for session management
    - **Body:** Form data (for POST requests) as **`application/x-www-form-urlencoded`**
    - **Response:** Always complete HTML document (even for errors - 404 page)
3. **Typical Headers:**
    - Heavy use of **`Cookie`** for session management
    - **`Accept: text/html`** as primary content type
    - Server sets **`Set-Cookie`** headers for session tracking

### **Single-Page Application (SPA) Request/Response Flow:**

1. **Initial Page Load:**
    - **Request Method:** **`GET`**
    - **Headers:** Standard browser headers
    - **Body:** Empty
    - **Response:** Minimal HTML shell with JavaScript bundle
    - **Response Headers:** **`Content-Type: text/html`**
    - **Response Body:** Skeleton HTML with script tags
2. **API Interactions:**
    - **Request Method:** Varied (**`GET`**, **`POST`**, **`PUT`**, **`DELETE`**, etc.)
    - **Headers:**
        - **`Accept: application/json`**
        - **`Content-Type: application/json`** (for requests with body)
        - **`Authorization: Bearer <token>`** for authenticated requests
    - **Body:** JSON payload for non-GET requests
    - **Response:** JSON data with appropriate status code
    - **Response Headers:** **`Content-Type: application/json`**
3. **Typical Headers:**
    - Focus on **`Authorization`** rather than **`Cookie`**
    - **`Accept`** header specifies JSON
    - Often includes custom headers like **`X-Requested-With: XMLHttpRequest`**

### **Differences:**

| **Aspect** | **MPA** | **SPA** |
| --- | --- | --- |
| Primary Content Type | **`text/html`** | **`application/json`** |
| Request Methods | Mostly GET/POST | Full range (GET, POST, PUT, DELETE etc.) |
| Payload Format | Form-encoded or multipart | JSON |
| Session Management | Cookies | Tokens (JWT) |
| Error Handling | HTML error pages | JSON error responses |
| Redirects | 302/303 with Location header | Often handled client-side |

### Other Differences:

| **Aspect** | **MPA** | **SPA** |
| --- | --- | --- |
| Page Loading | Full page reloads | Dynamic content updates |
| Initial Load Time | faster | Can be slower (in case of large JS files) |
| Speed | Slower navigation | Faster after initial load |
| Rendering | Server-side | Client-side |
| SEO | Naturally good | Requires extra effort |
| Bandwidth Usage | Higher (reloads entire page) | Lower (only data transfers) |
| Caching | Easier page-level caching | More complex caching needs |

## **2. Introduction to APIs in SPAs:**

### **The Role of APIs in Single-Page Applications (SPAs)**

1. **Bridge Between Frontend and Backend**
    - APIs act as the communication layer between the client-side SPA and server-side business logic.
    - They enable a **decoupled architecture**, separating frontend presentation from backend data processing.
2. **Separation of Concerns**
    - **SPA (Frontend)**: Handles UI rendering, user interactions, and client-side state management.
    - **API (Backend)**: Manages data storage, business logic, authentication, and third-party integrations.
    - This separation allows frontend and backend teams to develop independently, using the **API contract** as an agreement.
3. **Dynamic Data Loading**
    - After the initial page load, SPAs rely on APIs for all subsequent data operations.
    - User actions (e.g., button clicks, form submissions, navigation) trigger **asynchronous API calls** (AJAX/Fetch) instead of full page reloads.
4. **Improved User Experience**
    - API-driven updates make SPAs feel **fast and responsive**, similar to native apps.
    - Only the necessary data is fetched or updated, reducing bandwidth usage.
5. **Integration with Modern Frontend Frameworks**
    - API responses (usually JSON) are processed by frameworks like **React, Angular, or Vue.js** to dynamically update the DOM.
    - Enables features like **real-time updates, client-side routing, and offline capabilities**.
6. **Ideal for Complex Applications**
    - Best suited for apps requiring:
        - **Real-time data** (e.g., chat apps, dashboards)
        - **Rich interactivity** (e.g., drag-and-drop interfaces)
        - **Stateful user experiences** (e.g., progressive forms, multi-step workflows)
7. **Contrast with MPAs (Multi-Page Applications)**
    - Unlike MPAs (which reload entire pages), SPAs use APIs to fetch data silently in the background.
    - Eliminates disruptive page refreshes, providing a **smoother, app-like experience**.

## 3. REST API:

### **1. REST API Characteristics**

### **Resource-Based**

- Everything is a resource (user, product, order)
- Resources are identified by URIs (Uniform Resource Identifiers)
- Example: **`/api/users/123`**

### **HTTP Methods**

- **GET**: Retrieve a resource
- **POST**: Create a new resource
- **PUT**: Update an existing resource (full update)
- **PATCH**: Partial update of a resource
- **DELETE**: Remove a resource
- **HEAD**: Get metadata about a resource
- **OPTIONS**: Discover available operations

### **Representation**

- Resources can have multiple representations (JSON, XML, etc.)
- Client and server negotiate content type via headers
- JSON is the most common format today

### **Status Codes**

- **2xx Success**: 200 (OK), 201 (Created), 204 (No Content)
- **3xx Redirection**: 301 (Moved Permanently), 304 (Not Modified)
- **4xx Client Error**: 400 (Bad Request), 401 (Unauthorized), 404 (Not Found)
- **5xx Server Error**: 500 (Internal Server Error), 503 (Service Unavailable)

## **REST API Best Practices**

1. **Use Nouns for Resources**: **`/users`** instead of **`/getUsers`**
2. **Plural Resource Names**: **`/products`** rather than **`/product`**
3. **Nested Resources**: **`/users/123/orders`** for user's orders
4. **Filtering, Sorting, Pagination**: Use query parameters (**`?sort=name&page=2`**)
5. **Versioning**: Include API version in URL (**`/v1/users`**) or headers
6. **Security**: Use HTTPS, implement authentication (OAuth, JWT)
7. **Documentation**: Provide comprehensive API documentation
8. **HATEOAS**: Include links to related resources in responses
9. **Rate Limiting**: Protect against abuse with request limits
10. **Consistent Error Handling**: Standard error response format

## **Example REST API Endpoints**

```
GET    /api/v1/products          - List all products
POST   /api/v1/products          - Create new product
GET    /api/v1/products/{id}     - Get specific product
PUT    /api/v1/products/{id}     - Update entire product
PATCH  /api/v1/products/{id}     - Partially update product
DELETE /api/v1/products/{id}     - Delete product
GET    /api/v1/products/{id}/reviews - Get product reviews
```