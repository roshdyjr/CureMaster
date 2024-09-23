"use client";

import { useQuery } from "@tanstack/react-query";
import StatCard from "@/components/StatCard";
import Image from "next/image";
import Link from "next/link";
import { DataTable } from "@/components/table/DataTable";
import { columns } from "@/components/table/columns";
import Loader from "@/components/Loader";

const fetchAppointments = async () => {
  const response = await fetch("/api/appointments");

  if (!response.ok) {
    throw new Error("Failed to fetch appointments");
  }

  return response.json();
};

const Admin = () => {
  const {
    data: appointments,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["appointments"],
    queryFn: fetchAppointments,
    refetchInterval: 2000,
    refetchOnWindowFocus: true,
    staleTime: 0,
    retry: 3,
  });

  

  if (isLoading) return <Loader />;

  if (error) return <div>Error loading appointments</div>;

  return (
    <div className="flex flex-col mx-auto max-w-7xl space-y-14">
      <header className="admin-header">
        <Link href={"/"} className="cursor-pointer">
          <div className="flex items-center">
            <Image
              src="/assets/icons/logo-icon.png"
              height={1000}
              width={1000}
              alt="care-logo"
              className="h-10 w-fit mr-2"
            />
            <p className="font-bold text-xl">CureMaster</p>
          </div>
        </Link>

        <p className="text-16-semibold">Admin Dashboard</p>
      </header>

      <main className="admin-main">
        <section className="w-full space-y-4">
          <h1>Welcome Admin👋</h1>
          <p className="text-dark-700">Manage new appointments and more!</p>
        </section>

        <section className="admin-stat">
          <StatCard
            type="appointments"
            count={appointments?.scheduledCount}
            label="Scheduled appointments"
            icon="assets/icons/appointments.svg"
          />
          <StatCard
            type="pending"
            count={appointments?.pendingCount}
            label="Pending appointments"
            icon="assets/icons/pending.svg"
          />
          <StatCard
            type="cancelled"
            count={appointments?.cancelledCount}
            label="Cancelled appointments"
            icon="assets/icons/cancelled.svg"
          />
        </section>

        <DataTable columns={columns} data={appointments?.documents} />
      </main>
    </div>
  );
};

export default Admin;
