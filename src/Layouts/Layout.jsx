import React, { useState, useRef,useEffect } from "react";
import Header from "../Components/Header";
export const GuestLayout = ({ children }) => {
    return (
        <>
            <Header />
            <main className="pt-[110px]">{children}</main>
            {/* <StudentFooter /> */}
        </>
    );
};