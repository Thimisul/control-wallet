'use client';
import { signOut } from "next-auth/react";

const Home = () => {
  return (
    <>
      <h1 className="text-2xl font-bold mb-3">Home</h1>
      <p>Welcome to the control wallet</p>
      return <button onClick={() => signOut()}>Sign Out</button>
    </>
  );
};

export default Home;