@echo off
echo Testing B2B E-commerce API Endpoints...
echo.
echo Make sure the backend is running on http://localhost:8080
echo.

echo Testing health check...
curl -X GET http://localhost:8080/actuator/health
echo.
echo.

echo Testing admin login...
curl -X POST http://localhost:8080/api/users/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@b2b.com\",\"password\":\"admin123\"}"
echo.
echo.

echo Testing public categories endpoint...
curl -X GET http://localhost:8080/api/categories
echo.
echo.

echo API test completed!
pause