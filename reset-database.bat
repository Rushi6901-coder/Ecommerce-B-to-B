@echo off
echo Resetting B2B E-commerce Database...
echo.
echo This will drop and recreate all tables!
echo Make sure to backup any important data first.
echo.
pause

echo Connecting to MySQL and recreating database...
mysql -u root -pcdac -e "DROP DATABASE IF EXISTS B2BEcom; CREATE DATABASE B2BEcom;"

echo Database recreated successfully!
echo Now start the backend application.
echo.
pause