import { NextResponse } from "next/server";
import { getRecentAppointmentList } from "@/lib/actions/appointment.actions";

export async function GET() {
  try {
    const appointments = await getRecentAppointmentList();
    return NextResponse.json(appointments);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch appointments" }, { status: 500 });
  }
}
