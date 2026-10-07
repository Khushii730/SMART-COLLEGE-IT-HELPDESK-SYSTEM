@echo off

cd /d "%~dp0"

start cmd /k ""C:\Users\DELL\AppData\Local\Programs\Python\Python313\python.exe" Backend\app.py"

timeout /t 3 /nobreak >nul

start "" "Frontend\Index\Index.html"

exit