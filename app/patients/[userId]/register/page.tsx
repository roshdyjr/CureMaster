import RegisterForm from "@/components/forms/RegisterForm";
import { getUser } from "@/lib/actions/patient.actions";
import Image from "next/image";
import React from "react";

const Register = async ({ params: { userId } }: SearchParamProps) => {
  const user = await getUser(userId);

  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container">
        <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
        <div className="flex items-center mb-12">
            <Image
              src="/assets/icons/logo-icon.png"
              height={1000}
              width={1000}
              alt="care-logo"
              className="h-10 w-fit mr-2"
            />
            <p className="font-bold text-xl">CureMaster</p>
          </div>

          <RegisterForm user={user} />

          <p className="copyright py-12">© 2024 CureMaster</p>
        </div>
      </section>
      <Image
        src={"/assets/images/register-img.png"}
        alt="patient"
        height={1000}
        width={1000}
        className="side-img max-w-[390px]"
      />
    </div>
  );
};

export default Register;
