import Product from "@/components/Arrival";
import FontShowcase from "@/components/Fonts";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Shirt from "./(pages)/arrival/shirt";


export default function Home() {
  return (
    <>
   <Header/>
   <Hero/>
   <FontShowcase/>
<Product/>
<Shirt/>
   </>
  );
}
