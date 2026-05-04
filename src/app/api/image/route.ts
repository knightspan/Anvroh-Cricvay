import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');

  if (!name) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }

  try {
    // Wikipedia API call to search for the page and get the thumbnail image
    const wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&titles=${encodeURIComponent(name + " (cricketer)")}|${encodeURIComponent(name)}&format=json&pithumbsize=500&redirects=1`;
    
    const response = await fetch(wikiUrl);
    const data = await response.json();
    
    if (data.query && data.query.pages) {
      const pages = Object.values(data.query.pages) as any[];
      // Try to find a page with a thumbnail
      const pageWithImg = pages.find(p => p.thumbnail && p.thumbnail.source);
      if (pageWithImg) {
        return NextResponse.json({ imageUrl: pageWithImg.thumbnail.source });
      }
    }
    
    // Return null if no image found (UI will fallback to placeholder)
    return NextResponse.json({ imageUrl: null });
  } catch (error) {
    console.error('Error fetching Wikipedia image:', error);
    return NextResponse.json({ imageUrl: null });
  }
}
