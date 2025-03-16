"use client"

import { signOut } from "next-auth/react"

export default function Signout() {
    return(
        <>
        <button onClick={()=> signOut()}className="bg-red-500 text-white font-bold px-3 py-2 rounded">Signout</button>
        </>
    )
}