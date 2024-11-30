import { Request, Response, NextFunction } from "express";
import { db } from "../db";
import { userCourses, userMentors, users } from "../db/schema";
import { and, eq, InferInsertModel, InferSelectModel, ne, or } from "drizzle-orm";
import { AppError } from "../errorHandler";
import { parse } from "path";

export async function fetchCourseByUserId (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { userId } = req.params;
    const course = await db
      .select()
      .from( userCourses )
      .where( eq( userCourses.userId, ( userId ) ) );
    return res.status( 200 ).json( {
      success: true,
      message: "Course retrieved successfully",
      data: course,
    } );
  } catch ( error ) {
    next( error );
  }
}


export async function createCourseByUserId (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Extract userId from params
    const { userId } = req.params;
    if ( !userId ) throw new AppError( "User Id is required", 400 );

    // Parse request body with proper type inference
    const data = req.body as InferInsertModel<typeof userCourses> & Partial<typeof userMentors>;
    const {
      // Course fields
      courseName, courseDescription, courseStatus, courseProgress,
      courseStartDate, coursePrice, courseDuration, courseRating,
      courseMentorId, courseNotes,
      // Mentor fields
      mentorName, mentorEmail, mentorImage, mentorDescription,
      mentorWebsite, mentorNotes
    } = data;

    // 1️⃣ Validate Required Course Fields
    const requiredFields = { courseName, courseStatus, courseProgress };
    const missingFields = Object.entries( requiredFields )
      .filter( ( [ _, value ] ) => value === undefined )
      .map( ( [ key ] ) => key );

    if ( missingFields.length > 0 ) {
      return res.status( 400 ).json( {
        success: false,
        message: `Missing required fields: ${ missingFields.join( ", " ) }`,
      } );
    }

    // 2️⃣ Verify User Exists

    const doesUserExists = await db
      .select()
      .from( users )
      .where( eq( users.stageId, userId ) );

    if ( doesUserExists.length === 0 ) {
      throw new AppError( "User does not exist", 404 );
    }

    // 3️⃣ Handle Mentor Creation/Verification
    let mentorId: string | null = courseMentorId;

    async function mentorExistsFn ( id: string ) {
      const mentorExists = await db
        .select()
        .from( userMentors )
        .where( eq( userMentors.id, Number( id ) ) );

      console.log( 'MENTOR EXISTS', mentorExists );



      return mentorExists;
    }


    if ( courseMentorId ) {

      console.log( 'GIVEN MENTOR ID', courseMentorId );
      // Check if mentor exits with that id
      const mentorExistsWithId = await mentorExistsFn( courseMentorId );

      console.log( 'MENTOR EXISTS WITH ID', mentorExistsWithId );

      if ( mentorExistsWithId[ 0 ].id === undefined ) {
        throw new AppError( "Mentor does not exist", 404 );
      } else {
        mentorId = String( mentorExistsWithId[ 0 ].id );
      }
    } else {
      // So we will create a new mentor because no mentorId was provided
      const mentorExistsWithName = await db.select().from( userMentors ).where(
        and(
          eq( userMentors.mentorName, String( mentorName ) ),
          eq( userMentors.userId, userId )
        )
      );

      if ( mentorExistsWithName.length > 0 ) {
        throw new AppError( "Mentor with same name already exists", 400 );
      }
      else {
        // Finally we will create a new mentor
        const newMentor = await db.insert( userMentors ).values(
          {
            mentorName: String( mentorName ),
            userId,
            mentorEmail: String( mentorEmail ) || null,
            mentorImage: String( mentorImage ) || null,
            mentorDescription: String( mentorDescription ) || null,
            mentorWebsite: String( mentorWebsite ) || null,
            mentorNotes: String( mentorNotes ) || null,
          }
        ).returning( { id: userMentors.id } );

        mentorId = String( newMentor[ 0 ].id );
      }
    }

    // 5️⃣ Create New Course
    const courseData: InferInsertModel<typeof userCourses> = {
      userId,
      courseName,
      courseDescription,
      courseStatus,
      courseProgress,
      courseStartDate,
      coursePrice,
      courseDuration,
      courseRating,
      courseMentorId: mentorId,
      courseNotes
    };


    // Check if course already exists with same userId and courseName and courseMentorId
    const courseExists = await db.select().from( userCourses ).where(
      and(
        eq( userCourses.userId, userId ),
        eq( userCourses.courseName, courseName ),
        eq( userCourses.courseMentorId, mentorId )
      )
    );

    if ( courseExists.length > 0 ) {
      throw new AppError( "Course with same name and mentor already exists", 400 );
    }

    const newCourse = await db
      .insert( userCourses )
      .values( courseData )
      .returning( { id: userCourses.id } );

    if ( newCourse.length === 0 ) {
      throw new AppError( "Course creation failed", 500 );
    }

    // 6️⃣ Return Success Response
    return res.status( 200 ).json( {
      success: true,
      message: "Course created successfully",
      data: newCourse,
    } );
    // 🎬  End of Function
  } catch ( error ) {
    console.log( "ERROR", error );
    next( error );
  }
}
