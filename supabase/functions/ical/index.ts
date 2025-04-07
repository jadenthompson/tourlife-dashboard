/// <reference lib="deno.unstable" />
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import ical from "https://esm.sh/ical-generator@8.1.1";

serve(async (req: Request) => {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop() || "";

    const supabase = createClient(
      Deno.env.get("https://jorantgixpsjetsyujkl.supabase.co")!,
      Deno.env.get("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvcmFudGdpeHBzamV0c3l1amtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMxNjU0MjcsImV4cCI6MjA1ODc0MTQyN30.QxPmwjTHxUru_GBT_EbxzkhOg2RCE4-4a5X_l8Ul0SY")!
    );

    // Find user by their unique iCal ID
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("ical_url", id)
      .maybeSingle();

    if (userError || !user) {
      console.error("User fetch failed", userError);
      return new Response("User not found", { status: 404 });
    }

    // Get events linked to the user
    const { data: events, error: eventsError } = await supabase
      .from("events")
      .select("id, name, start_time, end_time, city")
      .eq("user_id", user.id);

    if (eventsError || !events) {
      console.error("Events fetch failed", eventsError);
      return new Response("Event loading failed", { status: 500 });
    }

    const cal = ical({ name: "Tour Calendar" });

    events.forEach((event) => {
      cal.createEvent({
        start: new Date(event.start_time),
        end: new Date(event.end_time || event.start_time),
        summary: event.name,
        location: event.city,
      });
    });

    return cal.serve(); // auto sets headers
  } catch (err) {
    console.error("Unhandled error", err);
    return new Response("Internal Server Error: " + err.message, { status: 500 });
  }
});
