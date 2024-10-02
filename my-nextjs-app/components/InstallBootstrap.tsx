'use client'

import { useEffect } from "react";

function installBootstrap() {
    useEffect(() => {
        require("bootstrap/dist/js/bootstrap.bundle");
    }, [])
  return (
    null
  )
}

export default installBootstrap