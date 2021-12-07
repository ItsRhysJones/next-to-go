# Next To Go - A technical test by Rhys Jones for Entain position

## Introduction

Task -
Create a single page application that displays 'Next to go’ races using the Entain API.

Features:
* A user should see 5 races at all times
* Races they should be sorted by time ascending.
* Race should disappear from the list after 1 min past the start time (​advertised_start).
* User should see meeting name (​meeting_name), race number (​race_number)
* A countdown timer that indicates the start of the race.
* User should be able to toggle race categories to view races belonging to only the selected
category.
* Categories are defined by IDs and are the following.

Categories:
* Greyhound racing: ​category_id: '9daef0d7-bf3c-4f50-921d-8e818c60fe61'
* Harness racing: ​category_id: '161d9be2-e909-4326-8c2c-35ed71fb460b'
* Horse racing: ​category_id: '4a2788f8-e825-4d36-9894-efd4baf1cfae'

Requirements
* Use React Native (​https://facebook.github.io/react-native​)
* Use Neds API to fetch a list of races

GET https://api.neds.com.au/rest/v1/racing/?method=nextraces&count=10
Content-type: application/json

Optional
* Use redux/vuex
* Unit tests
* Documentation

Additional  design choices
* Opted to use Expo for ease of debug and testing


I have strived to add ALL primary and secondary features.

## Repo Structure

Folder | Contents
--- | ---
assets | Expo resources / icons
component | Custom components used to render 'Next To Go' App
resources | Centralised Typescript definitions and Theme/Styles
services | Scripts and processes that access external services or device features
store | Redux actions and reducers, with accompanied state processing methods
test | Unit tests and test data

## Installation

After downloading the repository, there are a few ways to test.

Initialising:
* Open console in the downloaded / cloned repo folder
* Run Command ```npm install```
* Run Command ```npm start```
* For local/virtual device testing, follow on-screen prompts or press 'A' to launch to an Android device.
* For device testing, install Expo Client from Google Play or App Store
* Scan the QR Code available from either browser window or console

To run unit tests:
* Run Command ```npm test```
