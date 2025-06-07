@echo off
echo WARNING: This will remove all Docker containers, images, volumes, and networks!
set /p confirm=Are you sure you want to continue? [y/N] 

if /I not "%confirm%"=="y" (
    echo Aborted.
    exit /b
)

echo.
echo Stopping and removing current docker-compose stack...
docker-compose down --volumes --remove-orphans

echo.
echo Running full Docker system prune (images, containers, volumes, networks)...
docker system prune -a --volumes -f

echo.
echo Rebuilding images from scratch...
docker-compose build --no-cache

echo.
echo Starting fresh containers...
docker-compose up --force-recreate
