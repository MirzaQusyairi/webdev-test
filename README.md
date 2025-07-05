# WebDev

A simple dashboard application built using react &amp; laravel.

This project consists of two main parts:

- **Backend**: Located in the `/backend` folder, built with **Laravel**.
- **Frontend**: Located in the `/frontend` folder, built with **React + Vite**.

## Prerequisites

Make sure you have the following installed:

- PHP >= 8.3
- Composer
- Node.js >= 20
- NPM
- MySQL or other supported database

## To run the current code in development mode

### For Backend

1. `cd backend` 
2. `composer install`
3. `cp .env.example .env`
4. `php artisan key:generate`
5. `php artisan migrate:fresh --seed`
6. `php artisan serve`

### For Frontend

1. `cd frontend` 
2. `npm install`
3. `cp .env.example .env`
4. `npm run dev`
