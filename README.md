# ProfiHoby

ProfiHoby is an application designed to streamline the process of managing and organizing articles related to the machine working industry. The application empowers your clients to add articles, categorize them into various categories and sub-categories (groups), and seamlessly connect with the OLX API CRUD service. This solution aims to enhance your customer's experience by enabling them to easily locate the products they need to efficiently complete their tasks in the machine working industry.

## Key Features

- **Article Management:** With ProfiHoby, your clients can effortlessly add new articles to the system. Each article can be associated with relevant categories and sub-categories, making it easier for customers to find the exact products they require.

- **Categorization:** The application allows your clients to categorize articles into different categories and sub-categories (groups). This hierarchical organization ensures that customers can navigate and filter articles based on their specific needs.

- **Integration with OLX API:** ProfiHoby is seamlessly integrated with the OLX API CRUD service. This integration ensures that articles posted on your application can be automatically synchronized with OLX, saving valuable time by eliminating the need to post the same articles twice.

## Technologies Used

ProfiHoby was developed using a modern technology stack to ensure robustness, scalability, and a seamless user experience:

- **Next.js:** The application is built on the Next.js framework, offering server-side rendering, optimized performance, and a rich development environment.

- **tRPC:** tRPC is utilized to facilitate type-safe communication between the frontend and backend, ensuring reliable data transfers and reducing the risk of errors.

- **Tailwind CSS:** The UI of ProfiHoby is designed using Tailwind CSS, providing a customizable and responsive design system.

- **Docker:** Docker containers are used to package the application and its dependencies, ensuring consistency across different environments.

- **AWS:** Amazon Web Services (AWS) is employed for hosting and deploying the application, ensuring scalability and reliability.

- **Prisma & Postgres:** Prisma serves as the data access layer, while Postgres is the database of choice for storing articles, categories, and other relevant information.

## Getting Started

To run ProfiHoby on your local machine, follow these steps:

1. Clone the repository: `git clone https://github.com/yourusername/profihoby.git`
2. Navigate to the project directory: `cd profihoby`
3. Install dependencies: `npm install`
4. Set up environment variables (e.g., database connection, API keys)
5. Run the application: `npm run dev`

Please ensure you have Docker, AWS, and the required API keys configured before deploying the application to production.

## Contributing

Contributions to ProfiHoby are welcome! If you have any suggestions, bug reports, or feature requests, please submit an issue or a pull request on the GitHub repository.

## License

All rights reserved. ProfiHoby and its source code are proprietary and confidential. No part of this project may be reproduced, distributed, or transmitted in any form or by any means without the prior written permission of the project owner. For inquiries, please contact [your contact information].
