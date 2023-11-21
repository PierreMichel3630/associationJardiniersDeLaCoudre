/*import { Resend } from "resend";
import { Adherent } from "../model/Adherent";
import { EmailAG } from "../email/EmailAG";

const resend = new Resend("re_123456789");

export interface Attachment {
  content?: string | Buffer;
  filename?: string | false | undefined;
  path?: string;
}

export const sendEmailAG = (
  annee: number,
  lieu: string,
  date: string,
  adherent: Adherent,
  attachments: Array<Attachment>
) => {
  resend.sendEmail({
    from: "you@example.com",
    to: "user@gmail.com",
    subject: `Jardiniers de la Coudre - AG ${annee}`,
    react: (
      <EmailAG adherent={adherent} annee={annee} lieu={lieu} date={date} />
    ),
    attachments: attachments,
  });
};*/
