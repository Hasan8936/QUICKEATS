import { NextResponse } from 'next/server';

export function handleMongoDBError(error: any) {
  console.error('MongoDB Error:', error);

  // If MongoDB URI is not configured
  if (error.message?.includes('MONGODB_URI') || !process.env.MONGODB_URI) {
    return NextResponse.json(
      {
        success: false,
        error: 'Database connection not configured',
        message: 'Please set MONGODB_URI environment variable in Vercel dashboard',
        details: 'Go to Vercel Project Settings > Environment Variables and add MONGODB_URI',
      },
      { status: 503 }
    );
  }

  // Connection refused
  if (error.message?.includes('ECONNREFUSED')) {
    return NextResponse.json(
      {
        success: false,
        error: 'Database connection refused',
        message: 'MongoDB is not accessible',
      },
      { status: 503 }
    );
  }

  // Authentication failed
  if (error.message?.includes('auth failed') || error.message?.includes('authentication failed')) {
    return NextResponse.json(
      {
        success: false,
        error: 'Database authentication failed',
        message: 'Check MongoDB credentials in environment variables',
      },
      { status: 503 }
    );
  }

  // Generic database error
  return NextResponse.json(
    {
      success: false,
      error: 'Database error',
      message: error.message || 'An error occurred while accessing the database',
    },
    { status: 500 }
  );
}
