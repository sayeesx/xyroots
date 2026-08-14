import { z } from 'zod';

/**
 * Resume Data Schema
 * Used for validating structured data extracted from teacher resumes
 */
export const ResumeSchema = z.object({
  // Basic Information
  fullName: z.string().nullable(),
  phone: z.string().nullable(),
  email: z.string().nullable(),
  
  // Location
  location: z.string().nullable(), // Current city/location
  city: z.string().nullable(),
  
  // Teaching Information
  subject: z.string().nullable(), // Primary teaching subject
  specializations: z.array(z.string()).default([]),
  title: z.string().nullable(), // Professional title/designation
  qualification: z.string().nullable(), // Academic qualification
  professionalQualification: z.string().nullable(), // Teaching qualification (B.Ed, etc.)
  
  // Experience
  experienceYears: z.number().nullable(), // Total years of teaching
  experienceDetails: z.array(
    z.object({
      organization: z.string().nullable(), // School/institution name
      jobTitle: z.string().nullable(),
      location: z.string().nullable(),
      startDate: z.string().nullable(), // ISO date string or year
      endDate: z.string().nullable(), // ISO date string, year, or "Present"
      description: z.string().nullable(),
    })
  ).default([]),
  
  schoolsWorkedAt: z.array(z.string()).default([]), // List of schools worked at
  
  // Education
  education: z.array(
    z.object({
      institution: z.string().nullable(),
      degree: z.string().nullable(),
      qualification: z.string().nullable(),
      fieldOfStudy: z.string().nullable(),
      startDate: z.string().nullable(),
      endDate: z.string().nullable(),
    })
  ).default([]),
  
  // Certifications
  certifications: z.array(
    z.object({
      name: z.string().nullable(),
      issuingOrganization: z.string().nullable(),
      date: z.string().nullable(),
    })
  ).default([]),
  
  // Skills
  skills: z.array(z.string()).default([]),
  
  // Professional Links
  linkedin: z.string().nullable(),
  portfolio: z.string().nullable(),
});

export type ResumeData = z.infer<typeof ResumeSchema>;

/**
 * JSON Schema for Groq structured output
 * Derived from the Zod schema
 */
export const ResumeJsonSchema = {
  type: "object",
  properties: {
    fullName: { type: ["string", "null"] },
    phone: { type: ["string", "null"] },
    email: { type: ["string", "null"] },
    location: { type: ["string", "null"] },
    city: { type: ["string", "null"] },
    subject: { type: ["string", "null"] },
    specializations: { 
      type: "array", 
      items: { type: "string" },
      default: []
    },
    title: { type: ["string", "null"] },
    qualification: { type: ["string", "null"] },
    professionalQualification: { type: ["string", "null"] },
    experienceYears: { type: ["number", "null"] },
    experienceDetails: {
      type: "array",
      items: {
        type: "object",
        properties: {
          organization: { type: ["string", "null"] },
          jobTitle: { type: ["string", "null"] },
          location: { type: ["string", "null"] },
          startDate: { type: ["string", "null"] },
          endDate: { type: ["string", "null"] },
          description: { type: ["string", "null"] },
        }
      },
      default: []
    },
    schoolsWorkedAt: {
      type: "array",
      items: { type: "string" },
      default: []
    },
    education: {
      type: "array",
      items: {
        type: "object",
        properties: {
          institution: { type: ["string", "null"] },
          degree: { type: ["string", "null"] },
          qualification: { type: ["string", "null"] },
          fieldOfStudy: { type: ["string", "null"] },
          startDate: { type: ["string", "null"] },
          endDate: { type: ["string", "null"] },
        }
      },
      default: []
    },
    certifications: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: ["string", "null"] },
          issuingOrganization: { type: ["string", "null"] },
          date: { type: ["string", "null"] },
        }
      },
      default: []
    },
    skills: {
      type: "array",
      items: { type: "string" },
      default: []
    },
    linkedin: { type: ["string", "null"] },
    portfolio: { type: ["string", "null"] },
  },
  required: [],
  additionalProperties: false,
} as const;
