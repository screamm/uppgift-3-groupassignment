**E-commerce to sell subscriptions to news articles in 3 different tiers. After making a purchase, the user should receive login credentials to access content based on their subscription tier. Recurring payments should be processed every 7 days to ensure the user retains access.**

**Requirements for this task:**

- The backend must be built with TypeScript.
- Database choice is flexible: MongoDB or MySQL.
- A plan outlining the distribution of tasks and which days they will be developed should be prepared.
- Subscriptions at 3 different levels must be sold: basic package, plus, and full access.
- A user must be able to log in and log out of their account.
- After logging in, the homepage should display all content pages the user has access to, based on their subscription tier.
- Content pages must fetch all their data from the database, including title and content, and must be limited based on the user's subscription tier.
- If a user does not have the correct subscription level, they should receive an upgrade suggestion when trying to access restricted content.
- Payment processing must be implemented.
- Subscriptions should renew weekly, either through a cron job or using Stripe subscriptions.
- If a subscription payment fails, access should be restricted so that users can no longer view pages they previously had access to.
- A user should be able to manually pay for a renewal if an automatic payment fails, by going through the payment process again.
- A user should be able to cancel their subscription at any time, but will retain access to their tier until the paid days have expired.
- An administrator should be able to add content pages and specify which subscription level is required to view them.

**Give your e-commerce a unique name, such as "StoryStream Chronicles," and give the subscription levels unique names like "Explorer's Pass," "Odyssey Membership," and "Mastermind Access." This will make it stand out more when using it in your portfolio for internships and job applications.**

This task measures the following objectives from the course syllabus:

- TypeScript for backend development
- Planning and executing larger database-driven programming projects
