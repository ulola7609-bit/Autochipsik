# Autochip.uz — GitHub Pages build

## Publish
1. Upload **all files and folders inside this ZIP** to the root of `ulola7609-bit/Autochip` (not the enclosing folder).
2. Commit the changes to the `main` branch.
3. Open **Settings → Pages** and set **Build and deployment → Source** to **GitHub Actions**.
4. Open the **Actions** tab and wait for `Deploy Autochip to GitHub Pages` to finish successfully.
5. The website URL will be: https://ulola7609-bit.github.io/Autochip/

## Important limitations
This is a static GitHub Pages deployment. GitHub Pages can host the public website, but it does not execute the project's Vercel server functions in `/api`. Therefore the booking form intentionally displays a notice instead of pretending that a request was sent, and the admin dashboard is not available in this deployment.

For real booking submissions, administrator login, and database-backed requests, deploy the original full-stack project to Vercel and configure the Supabase environment variables. Do not publish secrets in this GitHub repository.
