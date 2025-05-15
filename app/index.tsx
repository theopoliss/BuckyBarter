import { Redirect } from 'expo-router';
 
export default function Index() {
  // For production, you would check auth state and redirect to welcome/login or tabs
  // Redirecting to welcome page; from there you can navigate to tabs
  return <Redirect href="/welcome" />;
} 