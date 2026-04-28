import { MainContainer } from "@/components/_cms/common/page-layout";
import { CreateRevenueForm, RevenueExpenditureTable } from "../components";

export default function RevenueExpenditurePageView() {
  return (
    <MainContainer
      title="Ghi nhận thu chi"
      links={[{ label: "Ghi nhận thu chi" }]}
    >
      <CreateRevenueForm />
      <RevenueExpenditureTable />
    </MainContainer>
  );
}
