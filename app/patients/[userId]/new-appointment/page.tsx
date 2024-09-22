import AppointmentForm from "@/components/forms/AppointmentForm";
import PatientForm from "@/components/forms/PatientForm";
import { getPatient } from "@/lib/actions/patient.actions";
import Image from "next/image";
import Link from "next/link";

export default async function NewAppointment({
  params: { userId },
}: SearchParamProps) {

  
  const patient = await getPatient(userId);

  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[860px] flex-1 justify-between">
        <div className="flex items-center mb-4">
            <Image
              src="/assets/icons/logo-icon.png"
              height={1000}
              width={1000}
              alt="care-logo"
              className="h-10 w-fit mr-2"
            />
            <p className="font-bold text-xl">CureMaster</p>
          </div>

          <AppointmentForm
            type="create"
            userId={userId}
            patientId={patient.$id}
          />

          <p className="copyright mt-10 py-12">
            © 2024 CureMaster
          </p>
        </div>
      </section>
      <Image
        src={"/assets/images/appointment-img.png"}
        alt="appointment"
        height={1000}
        width={1000}
        className="side-img max-w-[390px] bg-bottom"
      />
    </div>
  );
}
