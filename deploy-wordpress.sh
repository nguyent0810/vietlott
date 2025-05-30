#!/bin/bash

# Vietlott Analyzer WordPress Deployment Script
# Usage: ./deploy-wordpress.sh /path/to/wordpress

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if WordPress path is provided
if [ -z "$1" ]; then
    print_error "Please provide WordPress installation path"
    echo "Usage: $0 /path/to/wordpress"
    echo "Example: $0 /var/www/html"
    exit 1
fi

WORDPRESS_PATH="$1"
PLUGIN_PATH="$WORDPRESS_PATH/wp-content/plugins/vietlott-analyzer"

# Validate WordPress installation
if [ ! -f "$WORDPRESS_PATH/wp-config.php" ]; then
    print_error "WordPress installation not found at $WORDPRESS_PATH"
    print_error "Please check the path and try again"
    exit 1
fi

print_status "Starting Vietlott Analyzer WordPress deployment..."
print_status "WordPress path: $WORDPRESS_PATH"
print_status "Plugin path: $PLUGIN_PATH"

# Step 1: Build the application
print_status "Building the application..."
if ! npm run build; then
    print_error "Build failed. Please check for errors and try again."
    exit 1
fi
print_success "Application built successfully"

# Step 2: Create plugin directory
print_status "Creating plugin directory..."
mkdir -p "$PLUGIN_PATH"
mkdir -p "$PLUGIN_PATH/build"
mkdir -p "$PLUGIN_PATH/build/static"
print_success "Plugin directory created"

# Step 3: Copy plugin files
print_status "Copying plugin files..."

# Copy main plugin file
if [ -f "wordpress-plugin/vietlott-analyzer.php" ]; then
    cp "wordpress-plugin/vietlott-analyzer.php" "$PLUGIN_PATH/"
    print_success "Main plugin file copied"
else
    print_error "Main plugin file not found"
    exit 1
fi

# Copy built application files
if [ -d ".next/static" ]; then
    cp -r .next/static/* "$PLUGIN_PATH/build/static/"
    print_success "Built application files copied"
else
    print_warning "Built static files not found, using alternative method"
    
    # Alternative: copy from build directory if it exists
    if [ -d "build/static" ]; then
        cp -r build/static/* "$PLUGIN_PATH/build/static/"
        print_success "Application files copied from build directory"
    else
        print_error "No built files found. Please run 'npm run build' first"
        exit 1
    fi
fi

# Step 4: Set proper permissions
print_status "Setting file permissions..."
chmod -R 755 "$PLUGIN_PATH"
chmod 644 "$PLUGIN_PATH/vietlott-analyzer.php"
print_success "File permissions set"

# Step 5: Create readme file
print_status "Creating plugin readme..."
cat > "$PLUGIN_PATH/readme.txt" << 'EOF'
=== Vietlott Analyzer ===
Contributors: yourname
Tags: lottery, vietlott, prediction, analysis
Requires at least: 5.0
Tested up to: 6.4
Stable tag: 1.0.0
License: GPL v2 or later

AI-powered Vietlott lottery analysis with advanced algorithms for Power 6/55 and Mega 6/45.

== Description ==

The Vietlott Analyzer plugin provides sophisticated lottery number analysis and prediction capabilities for Vietnamese lottery games.

Features:
* Support for Power 6/55 and Mega 6/45
* 8 advanced prediction algorithms
* Real historical data analysis
* Prediction tracking and performance comparison
* No duplicate numbers (Vietlott rule compliant)
* Mobile responsive design

== Installation ==

1. Upload the plugin files to `/wp-content/plugins/vietlott-analyzer/`
2. Activate the plugin through the 'Plugins' screen in WordPress
3. Use the shortcode [vietlott_analyzer] in any page or post

== Shortcode Usage ==

Basic usage:
[vietlott_analyzer]

With specific lottery type:
[vietlott_analyzer type="mega645"]

With custom height:
[vietlott_analyzer type="power655" height="1000px"]

== Changelog ==

= 1.0.0 =
* Initial release
* Support for Power 6/55 and Mega 6/45
* Advanced prediction algorithms
* Real data integration
EOF

print_success "Plugin readme created"

# Step 6: Verify installation
print_status "Verifying installation..."

if [ -f "$PLUGIN_PATH/vietlott-analyzer.php" ] && [ -d "$PLUGIN_PATH/build/static" ]; then
    print_success "Installation verified successfully"
else
    print_error "Installation verification failed"
    exit 1
fi

# Final instructions
echo ""
print_success "🎉 Vietlott Analyzer WordPress plugin deployed successfully!"
echo ""
print_status "Next steps:"
echo "1. Go to WordPress Admin → Plugins"
echo "2. Find 'Vietlott Analyzer' and click 'Activate'"
echo "3. Go to Settings → Vietlott Analyzer for configuration"
echo "4. Add shortcode [vietlott_analyzer] to any page or post"
echo ""
print_status "Shortcode examples:"
echo "• Basic: [vietlott_analyzer]"
echo "• Mega 6/45: [vietlott_analyzer type=\"mega645\"]"
echo "• Custom height: [vietlott_analyzer height=\"1000px\"]"
echo ""
print_status "Plugin location: $PLUGIN_PATH"
print_success "Deployment completed successfully! 🚀"
EOF
