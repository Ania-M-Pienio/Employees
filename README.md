![GitHub Logo](https://github.com/Ania-M-Pienio/Employees/blob/master/public/images/readme/EmployeesApp.PNG)
Format: ![Alt Text](url)

## `Express and NPM`

Open-source Express is the ideal framework to construct a simple and fast portal-server without digging into the underlying world of http header content. Middleware functions serve to pre-process requests before they are handed over to the specific routes.

Among the dependenices installed using NPM, these are the main ones: 

   path:        directories and file paths
   fs:          parsing files
   multer:      file uploading
   bodyParser:  extracting content from HTTP requests 

![GitHub Logo](https://github.com/Ania-M-Pienio/Employees/blob/master/public/images/readme/expressjs.png)
Format: ![Alt Text](url)

## `Templates using Handlebars`

One of the templating engines supported by Express is Handlebars (a Mustache templating language). The templates are served in response to the specific route(s) built by Express. The utility is installed using Node Package Manager and imported using 'require' in server.js.  

    const exphbs = require('express-handlebars')";

On the client-side, user still receives valid HTML5 pages which are actually assembled on the back-end with complex portions that are used and re-used as needed.  Helpers, such as "each", "unless", "for-each" are used to conditionally render sections and data in each template. Custom-made helpers such as navLink and equal are created to render links and to quickly evaluate equality between propperties. 

![GitHub Logo](https://github.com/Ania-M-Pienio/Employees/blob/master/public/images/readme/handlebars.png)
Format: ![Alt Text](url)

## `Database Support`

The fully atomic PostgresSQL system was selected for persiting the Employee and Departments information entered and accessed by the user. Sequelize provides the Object-Relational Mapping (ORM).

Registered User information is stored using a non-sql system (MongoDB) with Mongoose as the Object Data Modelling (ODM) needed to communicate with the Mongo driver.

![GitHub Logo](https://github.com/Ania-M-Pienio/Employees/blob/master/public/images/readme/databases.png)
Format: ![Alt Text](url)

## `Deployed Version` located at: https://employees-serve.herokuapp.com/
