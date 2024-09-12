import { useState } from "react";

type Document = {
  id: number;
  title: string;
  author: string;
  tags: string[];
  visits: number;
};

const documents: Document[] = [
  {
    id: 1,
    title: "Document 1",
    author: "John Doe",
    tags: ["finance", "tax"],
    visits: 120,
  },
  {
    id: 2,
    title: "Document 2",
    author: "Jane Smith",
    tags: ["legal", "contract"],
    visits: 98,
  },
  {
    id: 3,
    title: "Document 3",
    author: "Alice Johnson",
    tags: ["education", "syllabus"],
    visits: 45,
  },
  {
    id: 4,
    title: "Document 4",
    author: "Bob Brown",
    tags: ["health", "insurance"],
    visits: 150,
  },
];

export default function LandingPage() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Document[]>([]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    if (value) {
      const keywords = value.split(" ");
      setSearchResults(
        documents.filter((doc) =>
          keywords.some(
            (keyword) =>
              doc.title.toLowerCase().includes(keyword) ||
              doc.tags.some((tag) => tag.toLowerCase().includes(keyword))
          )
        )
      );
    } else {
      setSearchResults([]);
    }
  };

  const mostVisitedDocs = documents
    .sort((a, b) => b.visits - a.visits)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full text-center p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-4xl font-bold mb-6">Request Documents</h1>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by keyword..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>

        {searchResults.length > 0 && (
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">Search Results:</h2>
            <ul className="divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden">
              {searchResults.map((doc) => (
                <li key={doc.id} className="p-3 bg-white hover:bg-gray-50">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">{doc.title}</span>
                    <span className="text-sm text-gray-500">{doc.author}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {doc.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {searchTerm && searchResults.length === 0 && (
          <p>No search results found.</p>
        )}

        <div>
          <h2 className="text-2xl font-semibold mb-2">
            Most Visited Documents
          </h2>
          {mostVisitedDocs.length > 0 ? (
            <ul className="divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden">
              {mostVisitedDocs.map((doc, index) => (
                <li key={doc.id} className="p-3 bg-white hover:bg-gray-50">
                  <div className="flex items-center mb-1">
                    <span className="font-bold mr-2 text-lg">{index + 1}.</span>
                    <span className="font-medium flex-grow">{doc.title}</span>
                    <span className="text-sm text-gray-500">
                      {doc.visits} visits
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{doc.author}</span>
                    <div className="flex flex-wrap gap-1">
                      {doc.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No documents available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
