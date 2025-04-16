project-root/

    Documentations, local development steps etc.
    /docs

    Project configurations (api-endpoints for dev-server & prod-server)
    /config

    Images, Videos, Logos, Fonts etc
    /public
        /images
        /videos
        /fonts...

    Keep all of your code files here separated from configuration files
    /src

        Icons
        /assets

        Reusable components through out the project
        /components

            Commonly use components such as Buttons, Inputs, Checkboxes etc.
            Put all of your components here.
            /common

            Layouts for the projects
            /layout

            DO NOT ADD/MODIFY THE FOLDER OR FILES INSIDE
            THIS IS USED FOR THE SHADCN-UI
            /ui

        Features related code, currently handling for the proected routes
        /features

        Other libraries code and/or helper functions
        /lib

        Pages for the project, make sure to put the page in their related folders.
        Create more folder if you need to
        /pages

        Services used in the project: zustand, formik, apiClient, routes, storage etc
        /services
