import { z } from 'zod';

/**
 * Validates data against a Zod schema
 */
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
      throw new Error(`Validation failed: ${messages.join(', ')}`);
    }
    throw error;
  }
}

/**
 * Formats time duration in seconds to human readable format
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  } else {
    return `${remainingSeconds}s`;
  }
}

/**
 * Calculates random interval within specified range
 */
export function getRandomInterval(minMinutes: number, maxMinutes: number): number {
  const minMs = minMinutes * 60 * 1000;
  const maxMs = maxMinutes * 60 * 1000;
  return Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
}

/**
 * Generates secure random string for tokens
 */
export function generateSecureToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Sanitizes file names for secure storage
 */
export function sanitizeFileName(fileName: string): string {
  return fileName
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_{2,}/g, '_')
    .substring(0, 100);
}

/**
 * Formats file size in bytes to human readable format
 */
export function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

/**
 * Checks if email format is valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Debounce function for API calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Encrypts sensitive data (placeholder - implement with actual crypto)
 */
export function encryptData(data: string, key: string): string {
  // TODO: Implement actual encryption using crypto library
  return Buffer.from(data).toString('base64');
}

/**
 * Decrypts sensitive data (placeholder - implement with actual crypto)
 */
export function decryptData(encryptedData: string, key: string): string {
  // TODO: Implement actual decryption using crypto library
  return Buffer.from(encryptedData, 'base64').toString('utf-8');
}

/**
 * Calculates activity score based on user interactions
 */
export function calculateActivityScore(
  mouseClicks: number,
  keystrokes: number,
  mouseMovement: number,
  scrollEvents: number
): number {
  const clickWeight = 0.3;
  const keystrokeWeight = 0.4;
  const movementWeight = 0.2;
  const scrollWeight = 0.1;

  const normalizedClicks = Math.min(mouseClicks / 10, 1);
  const normalizedKeystrokes = Math.min(keystrokes / 20, 1);
  const normalizedMovement = Math.min(mouseMovement / 100, 1);
  const normalizedScroll = Math.min(scrollEvents / 5, 1);

  return Math.round(
    (normalizedClicks * clickWeight +
     normalizedKeystrokes * keystrokeWeight +
     normalizedMovement * movementWeight +
     normalizedScroll * scrollWeight) * 100
  );
}