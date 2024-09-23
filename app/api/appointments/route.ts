import { NextResponse } from "next/server";
import { getRecentAppointmentList } from "@/lib/actions/appointment.actions";

export async function GET() {
  try {
    const appointments = await getRecentAppointmentList();


    const response = NextResponse.json(appointments);

    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");

    return response;
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch appointments" }, { status: 500 });
  }
}
