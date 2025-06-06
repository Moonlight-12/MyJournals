import SignIn from "./(auth)/signin/page";

export default function Home() {
  console.log('Environment Variables Check:');
console.log('NEXT_PUBLIC_APP_API_URL:', process.env.NEXT_PUBLIC_APP_API_URL);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
  return (
    
      <SignIn />
      
    
  );
}
