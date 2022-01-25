# Necktie Frontend Engineer Assessment

## Live Demo

https://necktie-test.herokuapp.com/

## Setup

1. Add the API key in your .env
2. Run `yarn install` to install dependencies
3. Run `yarn start` to run the app in the development mode. Open http://localhost:3000 to view it in the browser.

## Choice of Libraries & Packages

### React

**Reason**: Flexibility

As React is a library instead of framework like Vue, it offers APIs but not routing and state management tools. Therefore, it offers a high flexibility on choice of tools and implementation. As the scale of this project is relatively small, such flexibility allows me to choose whats fits this project instead of having more than what this projects needs.

### Material UI (MUI)

**Purpose**: Provides UI components and theme

**Benefits**:

- Offers a large variety of UI components and flexiblity on customization
- Using theme can ensure the UI consistency of the app
- Helps fasten the development process especially when a project is functionality-focused rather than a unique design

**Drawbacks**: It may takes more complicated implementation for a very customized UI component, comparing to not using MUI

**Assumption**: This project requires a simple and practical UI design

### Axios

**Purpose**: HTTP request and response handling

**Benefits**:

- Supports Promise API so that it can be used intercept HTTP requests and responses when necessary
- Automatically stringifies data into JSON format when sending requests

### React Query

**Purpose**: Faciliates data fetching and updating for React

**Benefits**:

- Automicatically identifies the request state (e.g. isLoading, isSuccess) so that no global states are required for handling request states
- Automicatically cache the data to reduce the loading time

**Drawbacks**: Some default settings may not fit the project requirement so that customize the settings may be required

**Assumption**: This project has a relatively small scale and simple design such that no complicated components that require global states for updates (e.g. multiple level nested components) after using React Query

### React Router

**Purpose**: Client-side routing

**Benefits**:

- Provides a standardized structure of the pages of the app
- Provides navigation without refreshing the page so that a single-page application can be built

**Drawbacks**:

- Initial loading time may be long since all the routes, components, and HTML need to be loaded at once when the app first mounts
- Resources that are not required for the first rendering of the app will also be downloaded

**Assumption**:

- Having a single-page and structural application is much more important
- The size of this project is small such that the loading time is acceptable

## Potential Improvement

If I have more time, or more APIs or params are supported by the backend, I would like to:

- Get the current location of the user and calculate the distance between the doctor and the user, so to suggest the closest doctors to the user on home page
- Provide more filters or sorting functions for doctors and bookings (e.g. location, opening hours, booking status)
- Do the searching and filtering of doctors and bookings on backend instead of frontend
- Provide autocomplete for searching
- Enhance the algorithm of calculating booking time
- Render skeletons instead of a loading icon during the loading process
- Apply virtualization or pagination on rendering large amount of data (e.g. doctors)
- Apply some transition animations to enhance UX

### Production Consideration

- Some devtools or logging functions need to be removed before deployment
- As Heroku does not provide buildpack for create-react-app, an extra buildpack needs to be set for deployment
- Variables in .env need to be configurated in Herouku separately

### Assumptions

**1. Performance and security of the app are not the first priority**

Due to the limitation on APIs, some functions that should be done by backend are now implemented on frontend (e.g. searching, filtering). As the current approach violates the privacy of data (e.g. users should not be able to access bookings that are not registered by them), and performance is hurt towards getting all records every time, I assume these conditions are not the most concerned.

**2. Fixed time slots for booking**

For simplicity, only fixed time slots according to the doctor's opening hours are generated and open for booking. No manual insertion of bookings from backend or database is also assumed.

**3. The scale of the project is relatively small**

As mentioned, small scale is assumed for this project. Therefore, I try not to use global state mangement such as Redux in this project. Since only one or two parts of the app may work better if Redux is used (e.g. get user's bookings), but it takes quite a lot of code to implement Redux, which is not necessary for such small-scaled project. At this stage, I use localStorage to replace Redux.

## Additional Features

**1. View and cancel bookings**

As long as the user does not clear the localStorage of a browser, they can view and cancel their submitted bookings using the same browser on the same device.

**2. Search doctors by keywords**

User can search doctors by some keywords. Doctors that have such keywords in their name, description or address will be returned.
