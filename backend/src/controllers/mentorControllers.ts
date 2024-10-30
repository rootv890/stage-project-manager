import { eq, InferInsertModel, InferSelectModel } from "drizzle-orm";
import { Request, Response } from "express";
import { Mentors } from "../db/schema";
import db from "../db/db";
import { numeric } from "drizzle-orm/pg-core";

type MentorType = InferInsertModel<typeof Mentors>;
type MentorSelectType = InferSelectModel<typeof Mentors>;

// export const getUser = async (req: Request, res: Response) => {};
export const getAllMentors = async (req: Request, res: Response) => {
  try {
    const mentors = await db.select().from(Mentors);
    return res.json(mentors);
  } catch (error) {
    console.error("Error fetching mentors", error);
    return res.status(500).json({ error: "Error fetching mentors" });
  }
};

export const createMentor = async (req: Request, res: Response) => {
  const data: MentorType = req.body;

  if (!data.name) {
    return res.status(400).json({ error: "Please provide a mentor name" });
  }

  // mentor already exists
  const mentorExists = await db
    .select()
    .from(Mentors)
    .where(eq(Mentors.name, data.name));

  if (mentorExists.length) {
    console.log(mentorExists);
    return res.status(400).json({ error: "Mentor already exists" });
  }

  // add mentor

  try {
    const [newMentor] = await db
      .insert(Mentors)
      .values({
        ...data,
        createdAt: new Date(), // Use Date object
        updatedAt: new Date(), // Use Date object
      })
      .returning();
    return res
      .status(201)
      .json({ message: "Mentor added successfully", data: { ...newMentor } });
  } catch (error: any) {
    console.error("Error adding mentor", error.message);
    return res.status(500).json({ error: error.message });
  }
};

export const updateMentor = async (req: Request, res: Response) => {
  let id = req.params.id;

  const data: MentorType = req.body;

  const mentorId = Number(id);

  if (!data) {
    return res.status(400).json({ error: "Please provide data to update" });
  }

  try {
    // check if userExists
    const mentorExists = await db
      .select()
      .from(Mentors)
      .where(eq(Mentors.id, mentorId));

    if (!mentorExists.length) {
      return res
        .status(404)
        .json({ error: "Mentor not found. please try again!" });
    }

    const restrictedFields = ["id"];

    if (Object.keys(data).some((field) => restrictedFields.includes(field))) {
      return res.status(400).json({ error: "You cannot update id" });
    }

    const updatedMentor = await db.update(Mentors).set({
      bio: data.bio || mentorExists[0].bio,
      name: data.name || mentorExists[0].name,
      imageUrl: data.imageUrl || mentorExists[0].imageUrl,
      id: mentorId,
      instagramLink: data.instagramLink || mentorExists[0].instagramLink,
      linkedinLink: data.linkedinLink || mentorExists[0].linkedinLink,
      twitterLink: data.twitterLink || mentorExists[0].twitterLink,
      websiteLink: data.websiteLink || mentorExists[0].websiteLink,
      updatedAt: new Date(),
    });
    console.log("Updated Mentor", updatedMentor);
    return res.json({ message: "Mentor updated successfully" });
  } catch (error) {
    console.log("Error updating mentor", error);
    return res.status(500).json({ error: "Error updating mentor" });
  }
};

export const getMentorById = async (req: Request, res: Response) => {
  const id = req.params.id;
  const mentorId = Number(id);

  if (!mentorId) {
    return res.status(400).json({ error: "Please provide mentor id" });
  }

  try {
    const mentor = await db
      .select()
      .from(Mentors)
      .where(eq(Mentors.id, mentorId));

    if (!mentor.length) {
      return res.status(404).json({ error: "Mentor not found" });
    }

    return res.json(mentor[0]);
  } catch (error) {
    console.error("Error fetching mentor", error);
    return res.status(500).json({ error: "Error fetching mentor" });
  }
};

export const deleteMentor = async (req: Request, res: Response) => {
  const id = req.params.id;
  const mentorId = Number(id);

  if (!mentorId) {
    return res.status(400).json({ error: "Please provide mentor id" });
  }

  try {
    const mentor = await db
      .select()
      .from(Mentors)
      .where(eq(Mentors.id, mentorId));

    if (!mentor.length) {
      return res.status(404).json({ error: "Mentor not found" });
    }

    // Delete the mentor
    await db.delete(Mentors).where(eq(Mentors.id, mentorId));
    return res.json({ message: "Mentor deleted successfully" });
  } catch (error) {
    console.error("Error deleting mentor", error);
    return res.status(500).json({ error: "Error deleting mentor" });
  }
};
