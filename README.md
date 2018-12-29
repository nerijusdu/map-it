# map-it
Roadmap tool.

## First time API project setup
- Install [PostgreSQL](https://www.postgresql.org/download/) 
- Create database with name 'map-it'
- `npm install -g typescript ts-node`
- Navigate to `/api` folder
- Create `src/.secret.ts` file with contents
```
export const JWTSecret = '<your-jwt-secret>';
```
Replace `<your-jwt-secret>` with your secret (can be random string).
- run `npm install`
