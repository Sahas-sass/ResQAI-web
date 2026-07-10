import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // 1. Extract the text address sent by the frontend
    const { address } = await request.json();

    // 2. Validate that the address isn't empty
    if (!address || address.trim() === '') {
      return NextResponse.json({ error: 'Address is required' }, { status: 400 });
    }

    // 3. Build the OpenStreetMap Nominatim API URL
    // encodeURIComponent ensures spaces and symbols in the address don't break the URL
    const osmUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      address
    )}&format=json&limit=1`;

    // 4. Fetch the data from OpenStreetMap
    // IMPORTANT: OSM requires a 'User-Agent' header so they know who is making the request
    const response = await fetch(osmUrl, {
      headers: {
        'User-Agent': 'ResQAI-Emergency-Application (poojanidanulya@gmail.com)' 
      }
    });

    const data = await response.json();

    // 5. If OpenStreetMap couldn't find the location, return a clean error
    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'Could not resolve coordinates for this location.' }, 
        { status: 404 }
      );
    }

    // 6. Extract coordinates from the first matching result
    const firstResult = data[0];
    const coordinates = {
      lat: parseFloat(firstResult.lat),
      lng: parseFloat(firstResult.lon), // OpenStreetMap outputs 'lon' instead of 'lng'
      formatted_address: firstResult.display_name
    };

    // 7. Send the clean coordinates back to whoever called this API
    return NextResponse.json(coordinates, { status: 200 });

  } catch (error) {
    console.error('Geocoding route breakdown error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}