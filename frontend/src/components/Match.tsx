'use client';

import { useState } from "react";

export default function PropertyMatcher() {
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
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
        setMatches(data.matches);
        setLoading(false);
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">AI powered Property Matcher</h1>

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
                            <p className="text-sm">Amenities: {property.amenities?.join(", ")}</p>
                        </div>
                    ))}
                </div>
            )}

            {!loading && matches?.length === 0 && preferences && (
                <p className="text-red-600 mt-4">No matching properties found.</p>
            )}
        </div>
    );
}
