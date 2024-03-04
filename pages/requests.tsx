import RootLayout from "@/app/layout";
import Navbar from "@/components/Navbar";

export default function Index() {
  return <RootLayout>
    <Navbar/>

    <div className="mx-auto container">
      <div className="my-12 block">
        <h1>Lorem ipsum dolor.</h1>
      </div>
    </div>
  </RootLayout>
}