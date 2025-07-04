'use client';

import { useState } from "react";

export default function PropertyMatcher() {
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [recommendation, setRecommendation] = useState<string | null>(null);
    const [preferences, setPreferences] = useState<any>(null);
    const [matches, setMatches] = useState<any[]>([]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMatches([]);
        setPreferences(null);

        const res = await fetch("http://localhost:4001/parse-and-match", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message }),
        });

        const data = await res.json();
        setPreferences(data.extractedPreferences);
        setRecommendation(data.recommendation || null);
        setMatches(data.matches);
        setLoading(false);
    };

    return (
        <div className="max-w-5xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">AI powered Property Matcher</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left: Property Matcher */}
                <div>
                    <form onSubmit={handleSubmit} className="mb-6">
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Describe what you're looking for (e.g., 2BR in Brooklyn, under $2000)..."
                            className="w-full border rounded p-3 mb-2"
                            rows={4}
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
                            disabled={loading || !message}
                        >
                            {loading ? "Matching..." : "Find Matches"}
                        </button>
                    </form>

                    {preferences && (
                        <div className="mb-4 border p-4 bg-gray-50 rounded">
                            <h2 className="text-lg font-semibold mb-2">Extracted Preferences</h2>
                            <pre className="text-sm">{JSON.stringify(preferences, null, 2)}</pre>
                        </div>
                    )}

                    {matches?.length > 0 && (
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold">Matching Properties</h2>
                            {matches?.map((property) => (
                                <div
                                    key={property.id}
                                    className="border p-4 rounded bg-white shadow-sm"
                                >
                                    <h3 className="font-bold text-lg">{property.title}</h3>
                                    <p>{property.description}</p>
                                    <p className="text-sm text-gray-600">
                                        {property.bedrooms} BED · {property.bathrooms} BATH . {property.type} . ${property.price} · {property.location}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Available from: {new Date(property.availableFrom).toDateString()}
                                    </p>
                                    <p className="text-sm">Amenities: {Array.isArray(property.amenities) ? property.amenities.join(", ") : Object.keys(property.amenities).filter(k => property.amenities[k]).join(", ")}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right: AI Recommendation or Empty State */}
                <div className="flex flex-col h-full">
                    <h3 className="font-semibold mb-5">AI Recommendation</h3>

                    {recommendation ? (
                        <div className="bg-green-50 border p-4 rounded mb-4">
                            <p className="text-green-900">{recommendation}</p>
                        </div>
                    ) : (
                        <div className="bg-gray-50 border p-4 rounded mb-4">
                            <p className="text-gray-900">No AI recommendations available at this time.</p>
                        </div>
                    )}
                    {!loading && matches?.length === 0 && preferences && !recommendation && (
                        <div className="flex flex-col items-center justify-center h-full min-h-[200px] border rounded bg-gray-50">
                            <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-gray-300 mb-2">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12A9 9 0 11 3 12a9 9 0 0118 0z" />
                            </svg>
                            <p className="text-gray-500 text-center">No matching properties or AI recommendations found.<br />Try adjusting your search criteria.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
