import Hero from '@/components/Hero/Hero';
import FeaturedCreators from '@/components/FeaturedCreators/FeaturedCreators';
import FeaturedPosts from '@/components/FeaturedPosts/FeaturedPosts';
import SignupCTA from '@/components/SignupCTA/SignupCTA';

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedCreators />
      <FeaturedPosts />
      <SignupCTA />
    </>
  );
}