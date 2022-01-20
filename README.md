# Credit Card Management API

The API functionalities of a management system for credit cards

## Technologies Used
- Node.js/ExpressJS (Server Side)
- MySQL DB

## Prerequisites
The following should be installed in your machine
- Node v10.13.0
- MySQL v8+

## How To Install And Run The Application
* Clone this Repo and `cd` into it
* Install all the dependancies by running the `yarn install`
* Ensure to setup  `MySQL on your local machine`
* Create a `.env` file and request for values from ADMIN
* Substitute all these values `DB_USERNAME_DEV`, `DB_PASSWORD_DEV`, `DB_NAME_DEV`, and `DB_HOST_DEV`, with the values used to setup MySQL on your local machine
* Run `yarn dev:migration` to setup the database tables.
* Start the application on development mode by running `yarn dev`

## Debugging
- Ensure to include `logger` from the heloers directory in all catch block for ease of debugging in any environment
- The `logger` logs to the console on **development** environment, and writes to a `logs/**.log` file on **production** environment
**Usage**
```
    logger.info(string data);

    logger.warn({
      message: 'string data'
      ...otherProperties
    });

    logger.error({
      message: 'string data'
      ...otherProperties
    });
```


## To Run migration to database on development environments
* Run `yarn dev:migration` for development environment

## To undo migration to database on development environments
* Run `yarn dev:undoall:migration` for development environment

## To Seed necesary data to database
* Run `yarn dev:seed:all` for development environment

## How To Contribute
Kindly refer to the guide above to setup, and reachout to admin for further instructions

### Issues
Issues are always very welcome. Please be sure to create a constructive issue when neccessary.

### Pull requests
I'm glad to get pull request if anything is missing or something is buggy.
