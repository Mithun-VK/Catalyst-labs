"use client";

import { useEffect } from "react";
import { captureAttribution } from "@/lib/attribution";

/** Renders nothing; records first-touch attribution once per tab session. */
export function AttributionCapture() {
  useEffect(() => {
    captureAttribution();
  }, []);
  return null;
}
