// API Utilities for centralized error handling and response formatting
import { NextResponse } from 'next/server';

/**
 * Standard API error response
 */
export interface ApiErrorResponse {
  success: false;
  error: string;
}

/**
 * Standard API success response
 */
export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
}

/**
 * Union type for all API responses
 */
export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * HTTP Status codes used throughout the API
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const;

/**
 * Centralized error handler for API routes
 * Converts any error into a standardized JSON response
 * 
 * @param error - The error object (Error instance or unknown)
 * @param statusCode - HTTP status code (default: 500)
 * @returns NextResponse with error details
 */
export function handleApiError(error: unknown, statusCode?: number): NextResponse<ApiErrorResponse> {
  const errorMessage = error instanceof Error ? error.message : 'Internal server error';
  
  // Determine status code based on error message if not provided
  let finalStatusCode = statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  
  if (!statusCode && error instanceof Error) {
    if (error.message.includes('not found')) {
      finalStatusCode = HTTP_STATUS.NOT_FOUND;
    } else if (error.message.includes('already occupied') || error.message.includes('already exists')) {
      finalStatusCode = HTTP_STATUS.CONFLICT;
    } else if (error.message.includes('required') || error.message.includes('invalid')) {
      finalStatusCode = HTTP_STATUS.BAD_REQUEST;
    }
  }
  
  return NextResponse.json<ApiErrorResponse>(
    { success: false, error: errorMessage },
    { status: finalStatusCode }
  );
}

/**
 * Creates a success response with data
 * 
 * @param data - The data to return
 * @param status - HTTP status code (default: 200)
 * @returns NextResponse with success data
 */
export function successResponse<T>(data: T, status: number = HTTP_STATUS.OK): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json<ApiSuccessResponse<T>>(
    { success: true, data },
    { status }
  );
}

/**
 * Creates a "not found" error response
 * 
 * @param entityName - Name of the entity that wasn't found
 * @returns NextResponse with 404 error
 */
export function notFoundResponse(entityName: string): NextResponse<ApiErrorResponse> {
  return NextResponse.json<ApiErrorResponse>(
    { success: false, error: `${entityName} not found` },
    { status: HTTP_STATUS.NOT_FOUND }
  );
}

/**
 * Creates a "bad request" error response for validation failures
 * 
 * @param message - Error message describing the validation failure
 * @returns NextResponse with 400 error
 */
export function badRequestResponse(message: string): NextResponse<ApiErrorResponse> {
  return NextResponse.json<ApiErrorResponse>(
    { success: false, error: message },
    { status: HTTP_STATUS.BAD_REQUEST }
  );
}

/**
 * Creates a "conflict" error response
 * 
 * @param message - Error message describing the conflict
 * @returns NextResponse with 409 error
 */
export function conflictResponse(message: string): NextResponse<ApiErrorResponse> {
  return NextResponse.json<ApiErrorResponse>(
    { success: false, error: message },
    { status: HTTP_STATUS.CONFLICT }
  );
}

/**
 * Validates that required fields are present in request body
 * 
 * @param body - Request body object
 * @param requiredFields - Array of field names that must be present
 * @throws Error if any required field is missing
 */
export function validateRequiredFields(body: Record<string, unknown>, requiredFields: string[]): void {
  const missingFields = requiredFields.filter(field => {
    const value = body[field];
    return value === undefined || value === null || (typeof value === 'string' && value.trim() === '');
  });
  
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }
}
