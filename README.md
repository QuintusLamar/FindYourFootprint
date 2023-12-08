# Find Your Footprint

This is part of a course project for Georgia Tech's CS 8803 SDG Sustainability and Computing course.

## Project Description

Find Your Footprint harnesses the power of gamification to make eco-friendly travel the status quo for urban commuters of cities. Users are encouraged to explore greener routes through a compelling point-based system, which rewards eco-conscious choices and lifestyle adjustments. The application provides real-time feedback, tracking users' contributions to reducing greenhouse gas emissions, ultimately fostering a sense of accomplishment and competition within the user community.

## File Structure/Contents

This repo contains two section:

- `frontend`
- `server`

## Frontend

The frontend section of this repository contains all UI components that are necessary to make the application function correctly. This code provides a mode for users to directly interact with the application. Here, users are able to interact with their friends, manage/record travel, view personal accomplishments, and compete with friends. The frontend is split into several sections, which are detailed below:

- `Components`: contains various ReactJS components for different frontend features (e.g. sidebar, authentication tab, friends interface)
- `Pages`: various screens that are used to provide different pieces of functionality (e.g. mapping interface, leaderboard, personal stats, and profile page)
- `Style`: contains styling information for the aforementioned pages

### Frontend Setup

The necessary dependencies for the `frontend` can be initialized by running `npm install`. The frontend can be started by running `npm start` in the `frontend` directory.

## Server

The server section of this repository contains all server side logic and provides API endpoints to enable the usage of the Find Your Footprint application. This code manages all user information and provides the frontend information to display to the user. Here, the server manages user sessions, calculates user statistics, and maintains travel records. The backend is split into several sections, which are detailed below:

- `records`: contains endpoints that deal with user travel records, providing functionality to maintain these records over time
- `stats`: contains endpoints that calculate user statistics, such as their favorite mode of transportation
- `users`: contains endpoints that pertain to user sessions, friendships, and state (login/logout)

### Server Setup

The necessary dependencies for the `server` can be initialized by running `conda env create -f environment.yml`. The server can be started by running `python run.py` in the `server` directory.
