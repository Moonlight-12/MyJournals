'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Journal {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  lastEditedAt?: string;
  status: boolean;
  isFavourite: boolean;
}

export default function JournalPage() {
  const params = useParams();
  const router = useRouter();
  const journalId = params.journalId as string;
  
  const [journal, setJournal] = useState<Journal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (journalId) {
      fetchJournal();
    }
  }, [journalId]);

  const fetchJournal = async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch(`http://localhost:4000/api/journal/${journalId}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Journal data received:', data);
        setJournal(data);
        setTitle(data.title);
        setContent(data.content);
      } else {
        console.error('Journal not found. Status:', response.status);
        // Try to get error details if available
        try {
          const errorData = await response.json();
          console.error('Error details:', errorData);
          setError(errorData.error || 'Journal not found');
        } catch (e) {
          console.error('No error details available');
          setError('Journal not found');
        }
      }
    } catch (error) {
      setError('Error loading journal');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async () => {
    if (isEditing) {
      try {
        setIsSaving(true);
        setError(null);
        
        
        const response = await fetch(`http://localhost:4000/api/edit/edit/${journalId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            title, 
            content 
          }),
        });

        if (response.ok) {
          const updatedJournal = await response.json();
          console.log('Journal updated successfully:', updatedJournal);
          
          // Update with the returned data from server
          setJournal(updatedJournal);
          setTitle(updatedJournal.title);
          setContent(updatedJournal.content);
          
          setIsEditing(false);
        } else {
          console.error('Failed to update journal. Status:', response.status);
          try {
            const errorData = await response.json();
            console.error('Error details:', errorData);
            setError(errorData.error || 'Failed to save changes');
          } catch (e) {
            console.error('No error details available');
            setError('Failed to save changes');
          }
          // Stay in editing mode if save failed
          return;
        }
      } catch (error) {
        console.error('Error updating journal:', error);
        setError('Network error while saving changes');
        return;
      } finally {
        setIsSaving(false);
      }
    } else {
      // Enter edit mode
      setIsEditing(true);
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error && !journal) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  if (!journal) {
    return <div className="p-4">Journal not found</div>;
  }

  return (
    <div className="flex flex-col items-center justify-start bg-[#FBF5DD] min-h-screen text-[#16404D] p-4">
      <div className="w-full max-w-screen-md">
        {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>}
        
        <div className="mb-4 flex justify-between items-center">
          {isEditing ? (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-2xl font-bold w-full p-2 border rounded"
              placeholder="Enter journal title"
            />
          ) : (
            <h1 className="text-2xl font-bold">{title}</h1>
          )}
          
          <button 
            onClick={handleEdit}
            disabled={isSaving}
            className={`px-4 py-2 ${isSaving ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded`}
          >
            {isSaving ? 'Saving...' : isEditing ? 'Save' : 'Edit'}
          </button>
        </div>

        <div className="text-sm text-gray-700 mb-4">
          Created: {new Date(journal.createdAt).toLocaleDateString()}
          {journal.lastEditedAt && (
            <span className="ml-4">
              Last edited: {new Date(journal.lastEditedAt).toLocaleDateString()}
            </span>
          )}
        </div>

        <div className="mt-4 w-full">
          {isEditing ? (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-64 p-2 border rounded bg-opacity-50 bg-white"
              placeholder="Write your journal entry here..."
            />
          ) : (
            <div className="prose max-w-none">{content}</div>
          )}
        </div>
        
        <div className="mt-4">
          {journal.isFavourite && (
            <span className="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
              Favorite
            </span>
          )}
        </div>
      </div>
    </div>
  );
}