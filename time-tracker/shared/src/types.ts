import { z } from 'zod';

// User Types
export const UserRoleSchema = z.enum(['admin', 'employee']);
export type UserRole = z.infer<typeof UserRoleSchema>;

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: UserRoleSchema,
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type User = z.infer<typeof UserSchema>;

// Authentication Types
export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;

export const AuthResponseSchema = z.object({
  user: UserSchema,
  token: z.string(),
  refreshToken: z.string(),
});

export type AuthResponse = z.infer<typeof AuthResponseSchema>;

// Time Tracking Types
export const TimeEntryStatusSchema = z.enum(['active', 'paused', 'stopped']);
export type TimeEntryStatus = z.infer<typeof TimeEntryStatusSchema>;

export const TimeEntrySchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  projectId: z.string().uuid().optional(),
  description: z.string().optional(),
  startTime: z.date(),
  endTime: z.date().optional(),
  status: TimeEntryStatusSchema,
  totalDuration: z.number().min(0), // in seconds
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type TimeEntry = z.infer<typeof TimeEntrySchema>;

// Screenshot Types
export const ScreenshotSchema = z.object({
  id: z.string().uuid(),
  timeEntryId: z.string().uuid(),
  userId: z.string().uuid(),
  filePath: z.string(),
  encryptedFilePath: z.string(),
  thumbnailPath: z.string().optional(),
  capturedAt: z.date(),
  fileSize: z.number().min(0),
  metadata: z.object({
    screenResolution: z.string(),
    activeWindow: z.string().optional(),
    mouseActivity: z.boolean(),
    keyboardActivity: z.boolean(),
  }).optional(),
});

export type Screenshot = z.infer<typeof ScreenshotSchema>;

// Project Types
export const ProjectSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().optional(),
  isActive: z.boolean(),
  createdBy: z.string().uuid(),
  assignedUsers: z.array(z.string().uuid()),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Project = z.infer<typeof ProjectSchema>;

// API Response Types
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  data: z.any().optional(),
  errors: z.array(z.string()).optional(),
});

export type ApiResponse<T = any> = {
  success: boolean;
  message?: string;
  data?: T;
  errors?: string[];
};

// Desktop App Configuration
export const DesktopConfigSchema = z.object({
  screenshotInterval: z.number().min(1).max(30), // minutes
  screenshotsPerInterval: z.number().min(1).max(10),
  enableShutterSound: z.boolean(),
  enableSystemTrayNotifications: z.boolean(),
  autoStart: z.boolean(),
  minimizeToTray: z.boolean(),
  apiEndpoint: z.string().url(),
});

export type DesktopConfig = z.infer<typeof DesktopConfigSchema>;

// Activity Tracking
export const ActivityDataSchema = z.object({
  mouseClicks: z.number().min(0),
  keystrokes: z.number().min(0),
  mouseMovement: z.number().min(0),
  scrollEvents: z.number().min(0),
  activeWindow: z.string().optional(),
  recordedAt: z.date(),
});

export type ActivityData = z.infer<typeof ActivityDataSchema>;

// WebSocket Events
export type WebSocketEvent = 
  | { type: 'TIME_ENTRY_STARTED'; payload: TimeEntry }
  | { type: 'TIME_ENTRY_STOPPED'; payload: TimeEntry }
  | { type: 'TIME_ENTRY_PAUSED'; payload: TimeEntry }
  | { type: 'SCREENSHOT_CAPTURED'; payload: Screenshot }
  | { type: 'USER_ACTIVITY'; payload: ActivityData }
  | { type: 'CONNECTION_STATUS'; payload: { connected: boolean } };

// Error Types
export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends Error {
  constructor(message: string = 'Authentication failed') {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends Error {
  constructor(message: string = 'Access denied') {
    super(message);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends Error {
  constructor(resource: string) {
    super(`${resource} not found`);
    this.name = 'NotFoundError';
  }
}