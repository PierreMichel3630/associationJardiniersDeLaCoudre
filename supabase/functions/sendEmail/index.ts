// import { SMTPClient } from "https://deno.land/x/denomailer/mod.ts";
import { SMTPClient } from "emailjs";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  try {
    const { to, subject, html } = await req.json();
    /*const client = new SMTPClient({
      connection: {
        hostname: "smtp.gmail.com",
        port: 465,
        tls: true,
        auth: {
          username: "jardiniersdelacoudre@gmail.com",
          password: "vqxzyrkfuykmaciq",
        },
      },
    });

    await client.send({
      from: "jardiniersdelacoudre@gmail.com",
      to: to,
      subject: subject,
      html: html,
    });

    await client.close();*/

    const client = new SMTPClient({
      username: "jardiniersdelacoudre@gmail.com",
      password: "vqxzyrkfuykmaciq",
      host: "smtp.gmail.com",
      ssl: true,
    });

    const message = {
      text: html,
      from: "you <jardiniersdelacoudre@gmail.com>",
      to: `someone <${to}>`,
      subject: subject,
    };
    client.send(message, (err, message) => {
      return new Response(undefined, {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
