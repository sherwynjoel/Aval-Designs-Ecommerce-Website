import Hero from "@/components/sections/Hero";
import NewArrivals from "@/components/sections/NewArrivals";
import ShopByCategory from "@/components/sections/ShopByCategory";
import CustomDesignCTA from "@/components/sections/CustomDesignCTA";
import EditorialBanner from "@/components/sections/EditorialBanner";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import Testimonials from "@/components/sections/Testimonials";
import InstagramGallery from "@/components/sections/InstagramGallery";
import Newsletter from "@/components/sections/Newsletter";

export default function Home() {
  return (
    <>
      <Hero />
      <NewArrivals />
      <ShopByCategory />
      <CustomDesignCTA />
      <EditorialBanner />
      <WhyChooseUs />
      <Testimonials />
      <InstagramGallery />
      <Newsletter />
    </>
  );
}
