import React from "react";
import { Breadcrumb } from "../../components/breadcrumb";

interface MainContainerProps {
  title: string;
  children: React.ReactNode;
  links?: { href?: string; label: string }[];
}

export default function MainContainer({
  title,
  children,
  links,
}: MainContainerProps) {
  return (
    <section>
      <Breadcrumb pageTitle={title} links={links} />
      <section className="rounded-lg bg-white p-5 shadow-theme-sm dark:bg-gray-800 space-y-4 text-gray-600 dark:text-gray-400">
        {children}
      </section>
    </section>
  );
}
