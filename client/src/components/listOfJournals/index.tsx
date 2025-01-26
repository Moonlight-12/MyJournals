async function getJournals() {
  try {
    const response = await fetch("http://localhost:4000/api/journals", {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`HTTP Error Status: ${response.status}`);
    }

    const journals = await response.json();
    return journals;
  } catch (error: any) {
    console.error(error.message);
    throw error;
  }
}

export default async function DisplayList() {
  const journals = await getJournals();

  return (
    <>
      {journals.map((journal: any) => (
        <div
          key={journal._id}
          className="p-4 rounded-md shadow-sm bg-[rgb(72,166,155)] mb-4"
        >
          <h2 className="tex-lg font-semibold mb-2">
            {journal.title || "untitled journal"}
          </h2>
          <p className="text-gray-700">{journal.content || "Empty"}</p>
        </div>
      ))}
    </>
  );
}
