import ClassicLayout from "@/components/ClassicLayout";
import TableRouters from "@/components/TableRouters"

export default function Routers() {
  const unpackedTableRouters = TableRouters()

  return <ClassicLayout modalComponents={[unpackedTableRouters.modalComponent]} name="Routers">
    <unpackedTableRouters.element/>
  </ClassicLayout>
}