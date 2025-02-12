"use client"
import { useState } from "react";
import Image from "next/image";

const VALID_CURRENCIES = [
  'DXY Curncy',
  'JPY Curncy',
  'EUR Curncy',
  'GBP Curncy',
  'CHF Curncy',
  'AUD Curncy',
  'CAD Curncy',
  'NZD Curncy',
  'CNY Curncy',
  'USGG30YR'
];

export default function Home() {
  const [features, setFeatures] = useState("");
  const [result, setResult] = useState<
    { column: string; isAnomaly: boolean; strategy: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFeatures = (inputFeatures: string[]): boolean => {
    return inputFeatures.every(feature => 
      VALID_CURRENCIES.includes(feature.trim())
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const inputFeatures = features.split(",").map(f => f.trim());
    
    if (!validateFeatures(inputFeatures)) {
      setError(`Invalid currency types. Please use only: ${VALID_CURRENCIES.join(", ")}`);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/strategy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ features: inputFeatures }),
      });

      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        setResult(data);
      }
    } catch (error) {
      setError("Error submitting features: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {/* Main Content */}
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        {/* <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        /> */}

        <h1 className="text-2xl font-bold text-center">Financial Anomaly Detection</h1>
        <p className="text-center text-sm sm:text-left">
          Enter transaction features to determine if it's an anomaly and receive an investment strategy.
        </p>

        {/* Currency Selection Guide */}
        <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
          <p className="font-medium mb-2">Available Currency Types:</p>
          <div className="flex flex-wrap gap-2">
            {VALID_CURRENCIES.map((currency) => (
              <span key={currency} className="bg-white px-2 py-1 rounded border">
                {currency}
              </span>
            ))}
          </div>
        </div>

        {/* Interactive Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 items-center sm:items-start w-full max-w-lg">
          <label htmlFor="features" className="text-sm font-medium">
            Enter Features (comma-separated):
          </label>
          <input
            id="features"
            type="text"
            value={features}
            onChange={(e) => setFeatures(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="e.g., DXY Curncy, JPY Curncy, USGG30YR"
            required
          />
          
          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
          >
            {loading ? "Processing..." : "Analyze"}
          </button>
        </form>

        {/* Result Display */}
        {result.length > 0 && (
          <div className="mt-8 p-4 border border-gray-300 rounded bg-gray-50 w-full max-w-lg">
            <h2 className="text-lg font-semibold">Analysis Result:</h2>
            {result.map((col, index) => (
              <div key={index} className="mb-4">
                <h3 className="text-md font-bold">{col.column}</h3>
                <p>
                  <strong>Status:</strong> {col.isAnomaly ? "Anomalous" : "Normal"}
                </p>
                <p>
                  <strong>Suggestion:</strong> {col.strategy}
                </p>
                
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
