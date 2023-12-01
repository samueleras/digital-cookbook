# digital-cookbook

This is a digital cookbook. You can use it to create, share and find new recipes.<br>
It is based on Express, EJS and MongoDB at the backend. The frontend runs on plain js.

## Display all recipes
![all-recipes](https://github.com/samueleras/digital-cookbook/assets/123464312/edd0d029-6dfb-4e3e-a721-0b9d75efcbef) <br>
Includes search and filter options.

## Sign up and log in for further possibilities
![sign-up](https://github.com/samueleras/digital-cookbook/assets/123464312/690bca27-62d6-4983-9e18-d941b5fda5ef) <br>

## Create and edit your recipes
![createedit](https://github.com/samueleras/digital-cookbook/assets/123464312/6a8ad0a7-3c30-4929-a656-407787680038) <br>
Upload a picture of your creation!

## Save and rate your friends recipes
![save func](https://github.com/samueleras/digital-cookbook/assets/123464312/d0a32923-ecc1-4b51-8148-e8cc1a4a9f47) <br>

<br>

# How to deploy this webapp

1. Clone this repo and install its dependencies with npm
2. Deploy a mongoDB Database or use the MongoDB cloud service Atlas. The webapp will create the required collections on its own.
3. Create those two highlighted files in the modules folder of the project: <br>
![modules](https://github.com/samueleras/digital-cookbook/assets/123464312/f15ac3bc-43c0-4dee-91fe-5b24910a7989) <br>
4. In the jwtEncryptionKey.js file, export some generated encryption key: <br>
 ![image](https://github.com/samueleras/digital-cookbook/assets/123464312/98f126ab-91d8-4158-a3ec-ee8721ac8ebf) <br>
5. In the mongoDbLogin.js export your Database connection string: <br>
![mongo](https://github.com/samueleras/digital-cookbook/assets/123464312/56f924f1-96a1-4269-ae63-d61a0d8252df)
6. Run it
