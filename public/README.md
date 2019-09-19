This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm install`

Installs all the required modules, scripts and other dependencies needed to run this application.<br>

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.


### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## `Custom Components with React`

Components created on my own include App.js, TeamBox.js, and Drop.js. 
React Hooks were applied to avoid the need for this(binding) and allowed state to set before and after each rendering without additional code

-useState  - managed binding
-useEffect - managed state building on mounting



## `Third-Party Components with React`

Custom Components were enhanced with Components Material-UI - an open source react UI library. It requires react and react-dom as peer dependencies. 
The components used required Material UI's main packages, which are:

    "@material-ui/core": "^4.0.0-rc.0",
    "@material-ui/icons": "^4.2.0",
    "@material-ui/styles": "^4.1.1",

The components rely heavily on Roboto Font from Goople's Front API which was includes by using an HTML link in index.html: 

    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />

Prior to rendering, the Browser was scrubbed of default formats using an appropriate starter component at the top of the component hierarchy from which all the rest of the component tree was spawned:

 "<React.Fragment>"
   <CssBaseline />

 "</React.Fragment>"
      
        
To ensure responsiveness and scalling when rendering components across all devices, a special meta tag was inserted into the <head> element of the index.html: 

  "<meta
      name="viewport"
      content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
    />"   


## `Other Third-Party Tools`

Lodash library was used for more complicated sorting and deep cloning. The npm clsx utility was used for constructing className strings.

The application was standardized using the 'prettier' utility for layout and eslint' for syntax.

## `Layout and Functionality`

The App component has a responsive and consistent grid layout in a TeamBox - where Drop and Drop List components are respectively mounted. There is a single-select drop list, along with two multi-select drop-lists per each team.  

Using the checkbox selections, user can perform edits on the UI and observe how the interface "remembers" the changes made, even prior to permanantly saving the changes to the database.  The sequence and location of changes are irrelevant to the stability of the app. 

Each team card has a "SAVE" button - which is enabled only once the user has made any changes to that particular team. It is disabled when a save is actually made or when the user decides to abandon/suspend changes to the current team and edit a different one.  

To help the user rememeber that work on the previous team was suspended and not saved, the team's "SAVE" button turns into a "UNSAVED CHANGES" tag. Additionally, when a user first starts making changes to any teams, a WARNING (yellow) snackbar is made visible to remind the user that there is unsaved work.  It won't annoyingly trigger everytime something is tweaked, only after the page is first loaded (upon first change) and after an actual SAVE to the database has been made (upon next change).

Other helpful modals include a WELCOME (blue) snackbar which shows up when the page is first loaded or reloaded - to notify the user that work can begin. There is also a green SUCCESS snackbar which lets the user know that a successful save has been made to the database. Alternatively a red error one appears when the database update failed. The snackbars will disappear from view due to one of the following reasons: 1) if/when the user explicitly clicks the "X" button on the snackbar, or 2) the user clicks anywhere on the interace or 3) if 1) and 2) do not occur, then the snackbar will dismiss itself after a period of about 20 seconds.

User is able to make as many tweaks to the teams or teams as they wish before actually saving any work.  The database will not be receiving any fresh information to replace the old until the "SAVE" button is clicked. All unsaved work is stored in the front-end and managed by the state kept by the React Components. When a SAVE-click does take place, it is an action that realtes only to the particualar team that it was clicked on. So it is possible to save the work for one team , and not affect the work being done on any others. 

## `Creator Notes`
