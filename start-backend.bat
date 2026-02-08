@echo off
echo Starting B2B E-commerce Backend...
echo.
echo Make sure MySQL is running on localhost:3306
echo Database: B2BEcom
echo Username: root
echo Password: cdac
echo.
cd /d "%~dp0spring_boot_mvc_template"
mvnw.cmd spring-boot:run
pause