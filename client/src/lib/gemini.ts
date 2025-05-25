export interface StoryPanel {
  character: string;
  characterName: string;
  text: string;
  background: string;
}

export interface GeneratedStory {
  title: string;
  panels: StoryPanel[];
}

export const generateStory = async (
  topic: string,
  subject: string,
  userId: number,
  userPreferences?: any
): Promise<any> => {
  const response = await fetch('/api/stories/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      topic,
      subject,
      userId,
      userPreferences
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to generate story');
  }

  return response.json();
};
