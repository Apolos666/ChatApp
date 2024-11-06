"use client";

import { useLoggedInUserProfile } from "@/entities/user/hooks/userLoggedInUserProfile";
import React from "react";

function Home() {
  const { data } = useLoggedInUserProfile();

  console.log(data);

  return <div>Home</div>;
}

export default Home;
