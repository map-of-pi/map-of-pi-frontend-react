import { useTranslations } from "next-intl";

export default function MembershipPage() {
  const t = useTranslations();
  const SUBHEADER = "font-bold mb-2";

  return (
    <div className="w-full md:w-[500px] md:mx-auto p-4">
      <h1 className="mb-5 text-center font-bold text-lg md:text-2xl">{'Membership'}</h1>
      <h2 className={SUBHEADER}>{'Current member class:'}</h2>
    </div>
  );
}