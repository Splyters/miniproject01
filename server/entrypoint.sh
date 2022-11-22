#!/bin/sh
# Docker entrypoint script.

# Sets up tables and running migrations.
echo "Setting up database..."
/app/bin/miniproject01 eval "ApiProject.Release.migrate"
echo "Seeding database..."
/app/bin/miniproject01 eval "ApiProject.Release.seeds"
echo "Seed complete."
/app/bin/miniproject01 eval "ApiProject.Release.migrate"
echo  "Database setup complete."

# Start our app
/app/bin/server