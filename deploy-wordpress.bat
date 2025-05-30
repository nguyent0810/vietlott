@echo off
setlocal enabledelayedexpansion

REM Vietlott Analyzer WordPress Deployment Script for Windows
REM Usage: deploy-wordpress.bat "C:\path\to\wordpress"

echo.
echo ========================================
echo  Vietlott Analyzer WordPress Deployment
echo ========================================
echo.

REM Check if WordPress path is provided
if "%~1"=="" (
    echo [ERROR] Please provide WordPress installation path
    echo Usage: %0 "C:\path\to\wordpress"
    echo Example: %0 "C:\xampp\htdocs\wordpress"
    pause
    exit /b 1
)

set "WORDPRESS_PATH=%~1"
set "PLUGIN_PATH=%WORDPRESS_PATH%\wp-content\plugins\vietlott-analyzer"

REM Validate WordPress installation
if not exist "%WORDPRESS_PATH%\wp-config.php" (
    echo [ERROR] WordPress installation not found at %WORDPRESS_PATH%
    echo [ERROR] Please check the path and try again
    pause
    exit /b 1
)

echo [INFO] Starting Vietlott Analyzer WordPress deployment...
echo [INFO] WordPress path: %WORDPRESS_PATH%
echo [INFO] Plugin path: %PLUGIN_PATH%
echo.

REM Step 1: Build the application
echo [INFO] Building the application...
call npm run build
if errorlevel 1 (
    echo [ERROR] Build failed. Please check for errors and try again.
    pause
    exit /b 1
)
echo [SUCCESS] Application built successfully
echo.

REM Step 2: Create plugin directory
echo [INFO] Creating plugin directory...
if not exist "%PLUGIN_PATH%" mkdir "%PLUGIN_PATH%"
if not exist "%PLUGIN_PATH%\build" mkdir "%PLUGIN_PATH%\build"
if not exist "%PLUGIN_PATH%\build\static" mkdir "%PLUGIN_PATH%\build\static"
echo [SUCCESS] Plugin directory created
echo.

REM Step 3: Copy plugin files
echo [INFO] Copying plugin files...

REM Copy main plugin file
if exist "wordpress-plugin\vietlott-analyzer.php" (
    copy "wordpress-plugin\vietlott-analyzer.php" "%PLUGIN_PATH%\" >nul
    echo [SUCCESS] Main plugin file copied
) else (
    echo [ERROR] Main plugin file not found
    pause
    exit /b 1
)

REM Copy built application files
if exist ".next\static" (
    xcopy ".next\static\*" "%PLUGIN_PATH%\build\static\" /E /I /Y >nul
    echo [SUCCESS] Built application files copied
) else (
    echo [WARNING] Built static files not found, using alternative method
    
    REM Alternative: copy from build directory if it exists
    if exist "build\static" (
        xcopy "build\static\*" "%PLUGIN_PATH%\build\static\" /E /I /Y >nul
        echo [SUCCESS] Application files copied from build directory
    ) else (
        echo [ERROR] No built files found. Please run 'npm run build' first
        pause
        exit /b 1
    )
)
echo.

REM Step 4: Create readme file
echo [INFO] Creating plugin readme...
(
echo === Vietlott Analyzer ===
echo Contributors: yourname
echo Tags: lottery, vietlott, prediction, analysis
echo Requires at least: 5.0
echo Tested up to: 6.4
echo Stable tag: 1.0.0
echo License: GPL v2 or later
echo.
echo AI-powered Vietlott lottery analysis with advanced algorithms for Power 6/55 and Mega 6/45.
echo.
echo == Description ==
echo.
echo The Vietlott Analyzer plugin provides sophisticated lottery number analysis and prediction capabilities for Vietnamese lottery games.
echo.
echo Features:
echo * Support for Power 6/55 and Mega 6/45
echo * 8 advanced prediction algorithms
echo * Real historical data analysis
echo * Prediction tracking and performance comparison
echo * No duplicate numbers ^(Vietlott rule compliant^)
echo * Mobile responsive design
echo.
echo == Installation ==
echo.
echo 1. Upload the plugin files to `/wp-content/plugins/vietlott-analyzer/`
echo 2. Activate the plugin through the 'Plugins' screen in WordPress
echo 3. Use the shortcode [vietlott_analyzer] in any page or post
echo.
echo == Shortcode Usage ==
echo.
echo Basic usage:
echo [vietlott_analyzer]
echo.
echo With specific lottery type:
echo [vietlott_analyzer type="mega645"]
echo.
echo With custom height:
echo [vietlott_analyzer type="power655" height="1000px"]
echo.
echo == Changelog ==
echo.
echo = 1.0.0 =
echo * Initial release
echo * Support for Power 6/55 and Mega 6/45
echo * Advanced prediction algorithms
echo * Real data integration
) > "%PLUGIN_PATH%\readme.txt"

echo [SUCCESS] Plugin readme created
echo.

REM Step 5: Verify installation
echo [INFO] Verifying installation...

if exist "%PLUGIN_PATH%\vietlott-analyzer.php" (
    if exist "%PLUGIN_PATH%\build\static" (
        echo [SUCCESS] Installation verified successfully
    ) else (
        echo [ERROR] Installation verification failed - static files missing
        pause
        exit /b 1
    )
) else (
    echo [ERROR] Installation verification failed - main plugin file missing
    pause
    exit /b 1
)
echo.

REM Final instructions
echo.
echo ========================================
echo  🎉 DEPLOYMENT COMPLETED SUCCESSFULLY! 🚀
echo ========================================
echo.
echo [INFO] Next steps:
echo 1. Go to WordPress Admin → Plugins
echo 2. Find 'Vietlott Analyzer' and click 'Activate'
echo 3. Go to Settings → Vietlott Analyzer for configuration
echo 4. Add shortcode [vietlott_analyzer] to any page or post
echo.
echo [INFO] Shortcode examples:
echo • Basic: [vietlott_analyzer]
echo • Mega 6/45: [vietlott_analyzer type="mega645"]
echo • Custom height: [vietlott_analyzer height="1000px"]
echo.
echo [INFO] Plugin location: %PLUGIN_PATH%
echo.
echo Press any key to exit...
pause >nul
