async function getJournal() {
    try {
      const res = await fetch("http://localhost:4000/api/journals");
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return await res.json();
    } catch (err: any) {
      console.error("Fetch failed:", err.message);
      throw err;
    }
  }

export default async function Journals() {
    const journal = await getJournal()

    return(
        <>
            <h1>
            {journal.mssg}
            </h1>
                
        </>
    )
}