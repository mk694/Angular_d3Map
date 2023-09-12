# Initial Setup

1. Run command `npm i `
2. Wait for node modules installation to complete. Open terminal and Run command `npm start` for default app initialize or `ng serve`.
3. After app starts the application will be live on `http://localhost:4200/`.

# App Component

The main component of the application which serves as the container for the map visualization is App component.

## Properties

- **backgroundPage**: String representing the background color of the page.
- **themes**: Array containing two theme objects with various properties that define the map's visual aspects.
- **themeIndex**: A number that stores the current theme's index.
- **currentTheme**: An object representing the currently active theme.

## Methods

- **ngOnInit** : Lifecycle hook that calls the createMap method when the component is initialized.
- **changeTheme(theme: any)** : A method to switch between different themes. It takes a theme index as an argument.
- **createMap()** : A method to initialize and create the map visualization using D3.js and topojson.
- **shipmentFrequencyIndex(postalCode: string)** : Method to calculate the frequency index of shipments for a given postal code.
- **circleSize(postalCode: string)** : Method to calculate the size of a circle based on the postal code.
- **circleColor(postalCode: string)** : Method to calculate the color of a circle based on the postal code.

## Theme Object Properties

### Create new theme

Copy an existing object theme in the theme Array inside the app.component and clone it inside the array. Thereon you can edit the themme properties as give below

- **name** : The name of the theme.
- **width** : The width of the map.
- **height** : The height of the map.
- **scale** : The scale of the map projection.
- **initialFreq** : Initial frequency value.
- **defaultRadius** : Default radius of the data points (circles) on the map.
- **mapColor** : Color of the map.
- **backgroundMapColor** : Background color of the map.
- **mapStroke** : Stroke color of the map boundaries.
- **mapStrokeWidth** : Stroke width of the map boundaries.
- **colorConstant** : A constant value to determine the color range for data point intensity.
- **startColor** : The starting color for the gradient.
- **stopColor** : The intermediate stop color for the gradient.
- **endColor** : The ending color for the gradient.
- **countryTextColour** : Color of the country text labels.
- **countryTextSize** : Font size of the country text labels.
- **legendTextSize** : Font size of the legendBar text labels.
- **legendTextColor** : Color of the legendBar text labels.


_Looking for something in different color or shade? Try experimenting with the theme properties to get the best looking-theme for yourself.😊_

