/* eslint-disable @next/next/no-img-element */
import React from "react";
import { getProviders, signIn } from "next-auth/react";
import Head from "next/head";

function login({ providers }) {
  return (
    <div className="flex flex-col items-center justify-center bg-black min-h-screen w-full">
      <Head>
        <title>Spotify</title>
        <meta
          name="description"
          content="All your favorite songs are listed here"
        />
        <link rel="icon" href="/spotify_icon.ico" />
      </Head>
      <img
        className="w-52 mb-20"
        src="https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg"
        alt="Spotify Logo"
      />

      {Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <button
            className="bg-[#18d860] text-white p-5 rounded-full"
            onClick={() => signIn(provider.id, { callbackUrl: "/" })}
          >
            Login with {provider.name}
          </button>
        </div>
      ))}
    </div>
  );
}

export default login;

export async function getServerSideProps() {
  const providers = await getProviders();

  return {
    props: {
      providers,
    },
  };
}
