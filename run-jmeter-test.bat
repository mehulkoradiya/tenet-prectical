@echo off
echo Starting JMeter Wallet API Load Test...
echo.

REM Check if JMeter is installed
where jmeter >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: JMeter is not installed or not in PATH
    echo Please install Apache JMeter and add it to your PATH
    echo Download from: https://jmeter.apache.org/download_jmeter.cgi
    pause
    exit /b 1
)

REM Set JMeter properties
set JMETER_HOME=%JMETER_HOME%
if "%JMETER_HOME%"=="" (
    echo Warning: JMETER_HOME environment variable is not set
    echo JMeter will use default settings
)

REM Run the test
echo Running test plan: wallet-api-test-plan.jmx
echo Test will run for 60 seconds with 100 total requests (70 increase, 30 decrease)
echo.

jmeter -n -t wallet-api-test-plan.jmx -l results.jtl -e -o report

echo.
echo Test completed!
echo Results saved to: results.jtl
echo HTML report generated in: report/
echo.
pause 