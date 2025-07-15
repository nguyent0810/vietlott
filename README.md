# Vietlott AI Predictor

This is an advanced web application designed to analyze historical lottery data for Vietlott's Power 6/55 and Mega 6/45 games. It uses Google's Gemini AI to generate intelligent predictions based on deep statistical analysis and user-defined strategies. The app features a rich, interactive interface for data exploration and a powerful backtesting simulator to test strategies against historical outcomes.

## Core Features

- **Multi-Lottery Support**: Seamlessly switch between **Power 6/55** and **Mega 6/45**.
- **Interactive Heatmap**: A dynamic heatmap visualizes number frequency (hot/cold) and momentum, allowing you to spot trends at a glance.
- **Advanced AI Analysis**: The AI considers multiple factors including:
  - Hot & Cold Numbers
  - Trend & Momentum Analysis
  - Odd/Even & Low/High Distribution
- **Selectable AI Strategies**:
  - **Balanced Mix**: A smart blend of all analytical factors.
  - **Hot Focus**: Prioritizes numbers that have appeared frequently.
  - **Contrarian (Cold Focus)**: Favors numbers that are statistically "due".
- **AI Co-Pilot Mode**: Lock in your own "lucky" numbers and have the AI find the best statistical companions to complete your ticket.
- **AI Rationale**: The AI provides a concise explanation for its picks, offering transparency into its "thought process."
- **Number Inspector**: Click on any number to get a detailed breakdown of its entire history, including its top "partner" numbers.
- **"What If" Backtesting Simulator**: Travel back in time to any date with historical data. Use all the analytical tools and the AI to make a prediction as if you were in the past, then reveal the actual historical draw to see how your strategy would have performed.
- **Local Data Management**: An interface to add, view, and delete draw results, which are saved locally in your browser.

## Local Setup & Running the Application

This project is a client-side application and can be run locally without any complex build steps.

### Prerequisites

1.  **Python**: You need Python installed on your computer. It is used to run a simple local web server. Most macOS and Linux systems have it pre-installed. For Windows, you can download it from [python.org](https://www.python.org/downloads/).
2.  **Web Browser**: A modern web browser like Chrome, Firefox, or Edge.
3.  **Gemini API Key**: To use the AI prediction features, you will need a Gemini API key. You can get one for free from [Google AI Studio](https://aistudio.google.com/app/apikey).

### Running the App

1.  **Clone or Download**: Download all the project files into a single folder on your computer.

2.  **Run the Server Script**:
    -   **On macOS or Linux**: Open a terminal, navigate to the project folder, and run:
        ```bash
        chmod +x run-local.sh
        ./run-local.sh
        ```
    -   **On Windows**: Open Command Prompt, navigate to the project folder, and run:
        ```bash
        run-local.bat
        ```
    These scripts will start a local web server and print URLs to the console.

3.  **Open in Browser**: Open your web browser and go to `http://localhost:8000`.

4.  **Enter API Key**:
    -   The first time you click "Generate Prediction," a pop-up will appear asking for your Gemini API key.
    -   Paste your key into the input field and click "Save Key".
    -   The key will be saved for your current browser session, and you won't be asked for it again unless you close the tab/browser.

### Testing on a Mobile Device

The `run-local` scripts automatically detect your computer's local network IP address.

1.  Ensure your mobile device is connected to the **same Wi-Fi network** as your computer.
2.  Look at the terminal/command prompt where you ran the script. It will display a URL like `http://192.168.1.123:8000`.
3.  Open the web browser on your mobile device and navigate to that specific URL. The application should load.