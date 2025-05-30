import { NextResponse } from "next/server";
import { LotteryResult, LotteryType } from "@/types/lottery";

// Cache for different lottery types
const cache = new Map<string, { data: LotteryResult[]; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function fetchFromGitHub(
  lotteryType: LotteryType = "power655"
): Promise<LotteryResult[]> {
  try {
    // Determine the correct file based on lottery type
    const fileName =
      lotteryType === "power655" ? "power655.jsonl" : "power645.jsonl";

    // Fetch from the vietvudanh/vietlott-data repository
    const response = await fetch(
      `https://raw.githubusercontent.com/vietvudanh/vietlott-data/master/data/${fileName}`,
      {
        headers: {
          "User-Agent": "Vietlott-Analyzer/1.0",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const rawData = await response.text();
    const lines = rawData.trim().split("\n");
    const results: LotteryResult[] = [];

    for (const line of lines) {
      try {
        const data = JSON.parse(line);
        if (
          data.result &&
          Array.isArray(data.result) &&
          data.result.length >= 6
        ) {
          // Validate that all numbers are within valid range based on lottery type
          const maxNumber = lotteryType === "power655" ? 55 : 45;
          const validNumbers = data.result
            .slice(0, 6)
            .every(
              (num: number) =>
                typeof num === "number" && num >= 1 && num <= maxNumber
            );

          if (validNumbers && data.date && data.id) {
            results.push({
              id: data.id,
              date: data.date,
              result: data.result.slice(0, 6), // Take first 6 numbers
              powerNumber:
                lotteryType === "power655" &&
                data.result[6] &&
                data.result[6] >= 1 &&
                data.result[6] <= 55
                  ? data.result[6]
                  : undefined,
              processTime: data.process_time,
            });
          }
        }
      } catch (parseError) {
        console.warn("Failed to parse line:", line);
      }
    }

    return results.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } catch (error) {
    console.error("Error fetching from GitHub:", error);
    throw error;
  }
}

async function fallbackScrapeVietlott(): Promise<LotteryResult[]> {
  try {
    // This is a simplified fallback - in a real implementation,
    // you would scrape the official Vietlott website
    console.log("Fallback scraping not implemented yet");
    return [];
  } catch (error) {
    console.error("Error in fallback scraping:", error);
    return [];
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lotteryType = (searchParams.get("type") as LotteryType) || "power655";

    const now = Date.now();
    const cacheKey = lotteryType;

    // Return cached data if it's still fresh
    const cachedEntry = cache.get(cacheKey);
    if (cachedEntry && now - cachedEntry.timestamp < CACHE_DURATION) {
      return NextResponse.json(cachedEntry.data);
    }

    let data: LotteryResult[] = [];

    try {
      // Try to fetch from GitHub first
      data = await fetchFromGitHub(lotteryType);
      console.log(
        `Fetched ${data.length} results from GitHub for ${lotteryType}`
      );
    } catch (githubError) {
      console.error("GitHub fetch failed:", githubError);

      try {
        // Fallback to scraping
        data = await fallbackScrapeVietlott();
        console.log(`Fetched ${data.length} results from fallback scraping`);
      } catch (scrapeError) {
        console.error("Fallback scraping failed:", scrapeError);

        // If both fail, return mock data for development
        console.log("Using mock data as fallback");
        data = generateMockData(lotteryType);
      }
    }

    // Add lottery type to each result
    data = data.map((result) => ({ ...result, lotteryType }));

    // Update cache
    cache.set(cacheKey, { data, timestamp: now });

    return NextResponse.json(data);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch lottery data" },
      { status: 500 }
    );
  }
}

function generateMockData(
  lotteryType: LotteryType = "power655"
): LotteryResult[] {
  const mockData: LotteryResult[] = [];
  const today = new Date();
  const maxNumber = lotteryType === "power655" ? 55 : 45;

  for (let i = 0; i < 100; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i * 2); // Every 2 days

    const result = [];
    const usedNumbers = new Set();

    // Generate 6 unique numbers within the valid range
    while (result.length < 6) {
      const num = Math.floor(Math.random() * maxNumber) + 1;
      if (!usedNumbers.has(num)) {
        result.push(num);
        usedNumbers.add(num);
      }
    }

    result.sort((a, b) => a - b);

    mockData.push({
      id: String(1200 - i).padStart(5, "0"),
      date: date.toISOString().split("T")[0],
      result,
      powerNumber:
        lotteryType === "power655"
          ? Math.floor(Math.random() * 55) + 1
          : undefined,
      processTime: date.toISOString(),
      lotteryType,
    });
  }

  return mockData;
}
