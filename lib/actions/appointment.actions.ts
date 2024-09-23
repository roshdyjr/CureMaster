"use server";

import { ID, Query } from "node-appwrite";
import {
  APPOINTMENT_COLLECTION_ID,
  DATABASE_ID,
  databases,
  messaging,
} from "../appwrite.config";
import { formatDateTime, parseStringify } from "../utils";
import { Appointment } from "@/types/appwrite.types";
import { revalidatePath } from "next/cache";

export const createAppointment = async (
  appointment: CreateAppointmentParams
) => {
  try {
    const newAppointment = await databases.createDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      ID.unique(),
      appointment
    );

    return parseStringify(newAppointment);
  } catch (error) {
    console.log(error);
  }
};

export const getAppointment = async (appointmentId: string) => {
  try {
    const appointment = await databases.getDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId
    );

    return parseStringify(appointment);
  } catch (error) {
    console.log(error);
  }
};

export const getRecentAppointmentList = async () => {
  try {
    const appointments = await databases.listDocuments(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      [Query.orderDesc("$createdAt")]
    );

    const initialCounts = {
      scheduledCount: 0,
      pendingCount: 0,
      cancelledCount: 0,
    };

    const counts = (appointments.documents as Appointment[]).reduce(
      (acc, appointment) => {
        switch (appointment.status) {
          case "scheduled":
            acc.scheduledCount++;
            break;
          case "pending":
            acc.pendingCount++;
            break;
          case "cancelled":
            acc.cancelledCount++;
            break;
        }
        return acc;
      },
      initialCounts
    );

    const data = {
      totalCount: appointments.total,
      ...counts,
      documents: appointments.documents,
    };

    return parseStringify(data);
  } catch (error) {
    console.error("Error", error);
  }
};

export const updateAppointment = async ({
  appointmentId,
  userId,
  appointment,
  type,
}: UpdateAppointmentParams) => {
  try {
    const updatedAppointment = await databases.updateDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId,
      appointment
    );
    if (!updatedAppointment) {
      throw new Error("Appointment not found");
    }

    const smsMessage = `Hi, this SMS message is regarding your appointment with CureMaster${
      type === `schedule`
        ? ` Your appointment has been scheduled for ${
            formatDateTime(appointment.schedule).dateTime
          } with Dr. ${appointment.primaryPhysician}`
        : `We regret to inform you that your appointment has been cancelled for the following reason(s). ${appointment.cancellationReason}
      `
    }
    `;


    //send SMS notification
    await sendSMSNotification(userId, smsMessage);

    const subject = `Appointment ${
      type === "schedule" ? "Scheduled" : "Cancelled"
    }`;

    const content = `Hi, this Email is regarding your appointment with CureMaster${
      type === `schedule`
        ? `Your appointment has been scheduled for ${
            formatDateTime(appointment.schedule).dateTime
          } with Dr. ${appointment.primaryPhysician}`
        : `We regret to inform you that your appointment has been cancelled for the following reason(s). ${appointment.cancellationReason}
      `
    }
    `;
    if (!subject) {
      throw new Error("Subject for the email notification is missing.");
    }

    // Send email notification
    await sendEmailNotification(subject, content, userId);

    return parseStringify(updatedAppointment);
  } catch (error) {
    console.log(error);
  }
};

export const sendSMSNotification = async (userId: string, content: string) => {
  try {
    const msg = await messaging.createSms(ID.unique(), content, [], [userId]);

    return parseStringify(msg);
  } catch (error) {
    console.log(error);
  }
};

export const sendEmailNotification = async (
  subject: string,
  content: string,
  userId: string
) => {
  try {
    const email = await messaging.createEmail(
      ID.unique(),
      subject,
      content,
      [],
      [userId]
    );
    return parseStringify(email);
  } catch (error) {
    console.error("Failed to send email notification:", error);
    throw new Error("Could not send email notification");
  }
};
