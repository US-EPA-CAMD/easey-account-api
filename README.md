# EASEY Account API
[![GitHub](https://img.shields.io/github/license/US-EPA-CAMD/easey-account-api)](https://github.com/US-EPA-CAMD/easey-account-api/blob/develop/LICENSE)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=US-EPA-CAMD_easey-account-api&metric=alert_status)](https://sonarcloud.io/dashboard?id=US-EPA-CAMD_easey-account-api)
[![Develop Branch Pipeline](https://github.com/US-EPA-CAMD/easey-account-api/workflows/Develop%20Branch%20Workflow/badge.svg)](https://github.com/US-EPA-CAMD/easey-account-api/actions)<br>
Account data API for the EPA CAMD Business Systems EASEY Application
​
## Getting Started
​
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Set environment variables
- Establish cloud.gov SSH tunnel

**Environment Variables**

You will need to set up the following environment variables in order to access the database. These are to be used for development purposes only.

- EASEY_DB_HOST: localhost
- EASEY_DB_PORT: `LOCAL_PORT` used in the SSH tunnel

Please reach out to an EPA tech lead (see Mike Heese or Jason Whitehead) to get the values for these variables

- EASEY_DB_NAME
- EASEY_DB_PWD
- EASEY_DB_USER
 

**Cloud.gov SSH tunnel**

1. [Log in and set up the command line](https://cloud.gov/docs/getting-started/setup/#set-up-the-command-line) 

2. Target the development org (you will need to be granted permission to access this):
```bash
$ cf target -o epa-easey -s dev
```
3. Open SSH tunnel
```bash
$ cf ssh account-api -L <LOCAL_PORT>:<DB_HOST>:5432
```
4. Keep the SSH tunnel open while running the application

> NOTE: For more information on cloud.gov, please refer to their [documentation](https://cloud.gov/docs/).

### Installing
1. Open your terminal and navigate to the directory you wish to store this repository.

2. Clone this repository

    ```shell
    # If using SSH
    $ git clone git@github.com:US-EPA-CAMD/easey-account-api.git
    
    # If using HTTPS
    $ git clone https://github.com/US-EPA-CAMD/easey-account-api.git
    ```

3. Navigate to the root project directory

    ```
    $ cd easey-account-api
    ```

4. Install dependencies 
    
    ```
    $ yarn install
    ```
### Run the appication 

From within the `easey-account-api` project directory, you can run:

```bash
# Runs the api in the development mode
$ yarn start:dev
```

Open [http://localhost:8080/api/account-mgmt/swagger/](http://localhost:8080/api/account-mgmt/swagger/) to view swagger documentation.
> NOTE: The port can be changed by setting the EASEY_ACCOUNT_API_PORT environment variable

The page will reload if you make edits via the use of nodemon.<br />
You will also see any lint errors in the console.

```bash
# for production mode
$ yarn start
```

### Run the tests

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```
## API Endpoints

Please refer to the [Account Management API Swagger Documentation](https://easey-dev.app.cloud.gov/api/account-mgmt/swagger/) for descriptions of the endpoints.

## Built With
​
[NestJS](https://nestjs.com/) - server-side Node.js framework

## Disclaimer
The United States Environmental Protection Agency (EPA) GitHub project code is provided on an "as is" basis and the user assumes responsibility for its use. EPA has relinquished control of the information and no longer has responsibility to protect the integrity , confidentiality, or availability of the information. Any reference to specific commercial products, processes, or services by service mark, trademark, manufacturer, or otherwise, does not constitute or imply their endorsement, recommendation or favoring by EPA. The EPA seal and logo shall not be used in any manner to imply endorsement of any commercial product or activity by EPA or the United States Government.

[Cloud.gov](https://cloud.gov/) - Platform as a Service (PaaS)
​ 
​
## License & Contributing
​
This project is licensed under the MIT License. We encourage you to read this project’s [License](LICENSE), [Contributing Guidelines](CONTRIBUTING.md), and [Code of Conduct](CODE_OF_CONDUCT.md).
